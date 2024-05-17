"use client";

import { useState, useEffect, useRef } from "react";
import { firestore } from "@/lib/firebase";
import {
  addDoc,
  collection,
  doc,
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
  console.log("🚀 ~ ChatRoom ~ selectedChatRoom:", selectedChatRoom);

  const me = selectedChatRoom?.myData;
  const other = selectedChatRoom?.otherData;
  const chatRoomId = selectedChatRoom?.id;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
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
        receiverId: other.id,
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
    } catch (error) {}
  };

  return (
    <div>
      <div className="flex flex-col h-[590px] ">
        <div className="flex-1 overflow-y-auto p-10">
          {messages?.map((message, index) => (
            <>
              <MessageCard
                key={index}
                message={message}
                me={me}
                other={other}
              />
            </>
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
