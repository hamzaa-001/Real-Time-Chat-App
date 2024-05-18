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
          isMessageFromMe ? "bg-[#21978B]" : "bg-[#4F5665] self-start"
        }`}
      >
        {message.image && (
          <img
            className="h-60 w-60 object-cover rounded-lg mb-2"
            src={message.image}
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
