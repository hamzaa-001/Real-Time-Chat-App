import moment from "moment";
import userProfile from "../../../../public/user.jpg";
import Image from "next/image";

const MessageCard = ({ message, me, other }) => {
  const isMessageFromMe = message.senderId === me.id;

  const timeAgo = (time) => {
    const date = time?.toDate();
    const momentDate = moment(date);
    return momentDate.fromNow();
  };

  console.log("🚀 ~ MessageCard ~ message:", message);

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
        {message.image && (
          <Image
            className="object-cover rounded-lg mb-2"
            src={message.image}
            width={60}
            height={60}
            alt="image"
          />
        )}
        <p className="">{message.content}</p>
        <div className="text-xs text-gray-300">{timeAgo(message.time)}</div>
      </div>
    </div>
  );
};

export default MessageCard;
