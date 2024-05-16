"use client";

import { useEffect, useState } from "react";
import ToggleDivs from "./ToggleDivs";
import { firestore, app } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  addDoc,
  querySnapshot,
  doc,
} from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FaPowerOff } from "react-icons/fa";

const Users = ({ userData }) => {
  const [activeTab, setActiveTab] = useState("users");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState([]);
  const [userChatRoom, setUserChatRoom] = useState([]);
  const auth = getAuth(app);
  const router = useRouter();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    setLoading(true);
    const testQuery = query(collection(firestore, "users"));

    const unSubscribe = onSnapshot(testQuery, (querySnapshot) => {
      const users = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUser(users);
      setLoading(false);
    });
    return unSubscribe;
  }, []);

  console.log("Users:", user);

  const handleLogout = () => {
    signOut(auth).then(() => {
      router.push("/login");
    });
  };
  return (
    <>
      <div className="flex justify-between">
        <button
          className={` rounded-md px-4 py-2 text-sm  focus:relative dark:text-gray-400 dark:hover:text-gray-200 ${
            activeTab === "users" ? "bg-white" : "text-white"
          }`}
          onClick={() => handleTabClick("users")}
        >
          Users
        </button>

        <button
          className={`rounded-md px-4 py-2 text-sm  shadow-sm focus:relative dark:bg-gray-800 ${
            activeTab === "chatroom" ? "bg-white" : "text-white"
          } `}
          onClick={() => handleTabClick("chatroom")}
        >
          Chatroom
        </button>
        <button
          className="rounded-md px-4 py-2 text-sm  shadow-sm focus:relative text-white dark:bg-gray-800"
          onClick={handleLogout}
        >
          <FaPowerOff className="text-2xl text-red-900" />
        </button>
      </div>

      <div>
        {activeTab === "users" && (
          <div>
            <h1 className="text-white text-2xl font-bold my-5">Users</h1>
            {loading ? (
              <p>loading....</p>
            ) : (
              user?.map(
                (user, index) =>
                  user?.id !== userData?.id && (
                    <ToggleDivs
                      key={index}
                      name={user.full_name}
                      time="2h ago"
                      type="users"
                    />
                  )
              )
            )}
          </div>
        )}
        {activeTab === "chatroom" && (
          <div>
            <h1 className="text-white text-2xl font-bold my-5">Chatroom</h1>
            <ToggleDivs
              type={"chatroom"}
              name={"Hamza Shahid"}
              time={"5:30 PM"}
              latestMessage={"Hello there"}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Users;
