import MessageCard from "./MessageCard";
import MessageInput from "./MessageInput";

const ChatRoom = () => {
  const fakeMessages = [
    {
      receiver: "Hanzla",
      content: "Hey How are you?",
      time: "2h ago",
    },
    {
      sender: "Hamza",
      content: "What are you doing?",
      time: "3h ago",
    },
  ];

  return (
    <div>
      <div className="flex flex-col h-screen">
        <div className="flex-1 overflow-y-auto p-10">
          {fakeMessages?.map((message, index) => (
            <MessageCard key={index} message={message} user={"Hamza"} />
          ))}
        </div>

        <MessageInput />
      </div>
    </div>
  );
};

export default ChatRoom;
