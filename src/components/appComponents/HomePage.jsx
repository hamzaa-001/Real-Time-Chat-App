"use client";

import { useState, useEffect } from "react";
import { app, firestore } from "@/lib/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import User from "@/components/appComponents/templates/Users";
import ChatRoom from "@/components/appComponents/templates/ChatRoom";

const HomePage = () => {
  const auth = getAuth(app);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const useRef = doc(firestore, "users", user.uid);
        const userSnap = await getDoc(useRef);
        const userData = userSnap.data();
        setUser(userData);
      } else {
        setUser(null);
        router.push("/login");
      }
    });
    return () => unSubscribe();
  }, [auth, router]);

  return (
    <>
      <div className="flex bg-slate-900 h-screen w-full overflow-auto mb-20">
        <div className="flex flex-col gap-5 w-1/4 h-screen py-10 px-5 shadow-lg">
          <User userData={user} />
        </div>
        <div className="w-3/4 py-10 px-5">
          <ChatRoom />
        </div>
      </div>
    </>
  );
};

export default HomePage;
