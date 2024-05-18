"use client";

import { useState, useEffect, useRef } from "react";
import { firestore } from "@/lib/firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  onSnapshot,
  query,
  where,
  orderBy,
  updateDoc,
} from "firebase/firestore";
import MessageCard from "./MessageCard";
import MessageInput from "./MessageInput";

const ChatRoom = ({ user, selectedChatRoom }) => {
  const me = selectedChatRoom?.myData;
  const otherId = selectedChatRoom?.otherData?.id;
  const chatRoomId = selectedChatRoom?.id;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [otherUserData, setOtherUserData] = useState(null);
  const [image, setImage] = useState("");
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    if (!chatRoomId) {
      return;
    }
    const unSubscribe = onSnapshot(
      query(
        collection(firestore, "messages"),
        where("chatRoomId", "==", chatRoomId),
        orderBy("time", "asc")
      ),
      (snapShot) => {
        const messagesData = snapShot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messagesData);
      }
    );
    return unSubscribe;
  }, [chatRoomId]);

  useEffect(() => {
    const fetchOtherUserData = async () => {
      if (!otherId) {
        return;
      }
      try {
        const userDoc = await getDoc(doc(firestore, "users", otherId));
        if (userDoc.exists()) {
          setOtherUserData(userDoc.data());
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchOtherUserData();
  }, [otherId]);

  const sendMessage = async () => {
    if (message.trim() === "" && !image) {
      return;
    }

    try {
      const messageData = {
        chatRoomId,
        senderId: me.id,
        content: message,
        time: serverTimestamp(),
        image: image || "",
        messageType: "text",
        receiverId: otherId,
        timestamp: serverTimestamp(),
      };

      await addDoc(collection(firestore, "messages"), messageData);
      setMessage("");
      setImage("");

      const chatRoomRef = doc(firestore, "chatrooms", chatRoomId);
      await updateDoc(chatRoomRef, {
        lastMessage: message,
        lastMessageTime: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex flex-col h-[530px]">
      <div className=" text-[#141414] flex items-center justify-center  border-b-2 mb-4">
        <h2 className="text-2xl font-bold mb-4">
          {otherUserData ? otherUserData.full_name : ""}
        </h2>
      </div>

      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-4">
          {messages?.map((message, index) => (
            <MessageCard
              key={index}
              message={message}
              me={me}
              other={otherUserData}
            />
          ))}
        </div>

        <MessageInput
          sendMessage={sendMessage}
          message={message}
          setMessage={setMessage}
          image={image}
          setImage={setImage}
        />
      </div>
    </div>
  );
};

export default ChatRoom;
