"use client";

import { useEffect, useState } from "react";
import ToggleDivs from "./ToggleDivs";
import { firestore, app } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  addDoc,
  getDocs,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FaPowerOff } from "react-icons/fa";
import toast from "react-hot-toast";

const Users = ({ userData, setSelectedChatRoom }) => {
  const [activeTab, setActiveTab] = useState("users");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [userChatRooms, setUserChatRooms] = useState([]);
  const auth = getAuth(app);
  const router = useRouter();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    setLoading(true);
    const usersQuery = query(collection(firestore, "users"));

    const unSubscribe = onSnapshot(usersQuery, (querySnapshot) => {
      const users = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(users);
      setLoading(false);
    });

    return unSubscribe;
  }, []);

  const handleLogout = () => {
    signOut(auth).then(() => {
      router.push("/login");
    });
  };

  useEffect(() => {
    if (!userData) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const chatRoomsQuery = query(
      collection(firestore, "chatrooms"),
      where("users", "array-contains", userData.id)
    );

    const unSubscribe = onSnapshot(chatRoomsQuery, (querySnapshot) => {
      if (!querySnapshot.empty) {
        const chatrooms = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserChatRooms(chatrooms);
      } else {
        console.log("No chatrooms found for this user.");
      }
      setLoading(false);
    });

    return unSubscribe;
  }, [userData]);

  const createChat = async (otherUser) => {
    if (!userData) {
      toast.error("User data is not available");
      return;
    }

    const existingChatRoomQuery = query(
      collection(firestore, "chatrooms"),
      where("users", "array-contains", userData.id)
    );

    try {
      const existingChatRoomSnapshot = await getDocs(existingChatRoomQuery);

      if (!existingChatRoomSnapshot.empty) {
        toast.error("ChatRoom already exists");

        return;
      }

      const chatRoomData = {
        users: [userData.id, otherUser.id],
        userData: {
          [userData.id]: userData,
          [otherUser.id]: otherUser,
        },
        timestamp: serverTimestamp(),
        lastMessage: null,
      };

      const chatRoomRef = await addDoc(
        collection(firestore, "chatrooms"),
        chatRoomData
      );
      setActiveTab("chatroom");
    } catch (error) {}
  };

  const openChat = (chatRoom) => {
    const data = {
      id: chatRoom.id,
      myData: userData,
      otherData:
        chatRoom.userData[chatRoom.users.find((id) => id !== userData?.id)],
    };

    setSelectedChatRoom(data);
  };

  return (
    <div>
      <div className="flex justify-between">
        <button
          className={`rounded-md px-4 py-2 text-sm focus:relative ${
            activeTab === "users" ? "bg-[#21978B] text-white" : "text-[#141414]"
          }`}
          onClick={() => handleTabClick("users")}
        >
          Users
        </button>
        <button
          className={`rounded-md px-4 py-2 text-sm focus:relative ${
            activeTab === "chatroom"
              ? "bg-[#21978B] text-white"
              : "text-[#141414]"
          }`}
          onClick={() => handleTabClick("chatroom")}
        >
          Chatroom
        </button>
        <button
          className="rounded-md px-4 py-2 text-sm focus:relative text-white"
          onClick={handleLogout}
        >
          <FaPowerOff className="text-2xl text-rose-900" />
        </button>
      </div>

      <div>
        {activeTab === "users" && (
          <div>
            <h1 className="text-[#141414] text-2xl font-bold my-5">Users</h1>
            {loading ? (
              <p className="text-white">Loading...</p>
            ) : (
              users?.map(
                (user, index) =>
                  user?.id !== userData?.id && (
                    <div
                      key={user?.id}
                      className="cursor-pointer"
                      onClick={() => createChat(user)}
                    >
                      <ToggleDivs
                        key={index}
                        name={user.full_name}
                        time="2h ago"
                        type="users"
                      />
                    </div>
                  )
              )
            )}
          </div>
        )}
        {activeTab === "chatroom" && (
          <div>
            <h1 className="text-[#141414] text-2xl font-bold my-5">Chatroom</h1>
            {userChatRooms.length === 0 ? (
              <p className="text-white">No chatrooms found.</p>
            ) : (
              userChatRooms.map((chatRoom) => {
                const otherUserId = chatRoom.users.find(
                  (id) => id !== userData.id
                );
                const otherUserData = chatRoom.userData[otherUserId];
                return (
                  <div
                    key={chatRoom.id}
                    className="cursor-pointer"
                    onClick={() => openChat(chatRoom)}
                  >
                    <ToggleDivs
                      key={chatRoom.id}
                      type="chatroom"
                      name={otherUserData?.full_name || "Chatroom"}
                      time={
                        chatRoom.timestamp?.toDate().toLocaleTimeString() || ""
                      }
                      latestMessage={chatRoom.lastMessage || "No messages yet"}
                    />
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
