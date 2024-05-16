import { FaPaperclip } from "react-icons/fa6";
import { FaPaperPlane } from "react-icons/fa6";
const MessageInput = () => {
  return (
    <div>
      <div className="flex items-center p-4 border-t border-gray-200">
        <FaPaperclip className="text-gray-500 mr-2 cursor-pointer" />

        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 border-none p-2 outline-none bg-slate-900 text-white"
        />

        <FaPaperPlane className="text-gray-500 ml-2 cursor-pointer" />
      </div>
    </div>
  );
};

export default MessageInput;
