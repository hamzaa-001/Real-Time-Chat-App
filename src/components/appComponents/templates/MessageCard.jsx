import userProfile from "../../../../public/user.jpg";
import Image from "next/image";

const MessageCard = ({ message, user }) => {
  const isMessageFromMe = message.sender === user;

  return (
    <div
      className={`flex mb-4 ${
        isMessageFromMe ? "justify-end" : "justify-start"
      }`}
    >
      <div className={`w-10 h-10 ${isMessageFromMe ? "ml-2 mr-2" : "mr-2"}`}>
        <Image
          src={userProfile}
          alt="profile"
          className="w-full h-full rounded-full object-cover"
        />
      </div>

      <div
        className={`text-white p-2 rounded-md ${
          isMessageFromMe ? "bg-blue-600" : "bg-gray-600 self-start"
        }`}
      >
        <p className="">{message.content}</p>
        <div className="text-xs text-gray-300">{message.time}</div>
      </div>
    </div>
  );
};

export default MessageCard;
