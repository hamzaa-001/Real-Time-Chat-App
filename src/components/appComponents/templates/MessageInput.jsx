import { useEffect, useState } from "react";
import { FaPaperclip } from "react-icons/fa6";
import { FaPaperPlane } from "react-icons/fa6";
import { app } from "@/lib/firebase";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

const MessageInput = ({
  sendMessage,
  message,
  setMessage,
  image,
  setImage,
}) => {
  const storage = getStorage(app);
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      return;
    }

    const storageRef = ref(storage, `chatroom_images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "storage_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {},
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImage(downloadURL);
          setUploadProgress(null);
          setImagePreview(null);
        });
      }
    );
  };

  const handleKeyPress = (e) => {
    if (e.key == "Enter") {
      sendMessage();
    }
  };
  window.addEventListener("keydown", handleKeyPress);

  return (
    <div>
      <div className="flex items-center p-4 border-t border-gray-200">
        <Dialog>
          <DialogTrigger>
            <FaPaperclip
              className={` ${
                image ? "text-blue-500" : "text-gray-500"
              } mr-2 cursor-pointer`}
            />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload the image</DialogTitle>
              <DialogDescription>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    className="max-h-60 w-60 mb-4"
                    alt="image"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mb-4"
                />
                <button
                  className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
                  onClick={() => handleUpload()}
                >
                  Upload
                </button>
                {uploadProgress && (
                  <progress value={uploadProgress} max={100}></progress>
                )}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 border-none p-2 outline-none bg-slate-900 text-white"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />

        <FaPaperPlane
          onClick={() => {
            sendMessage();
          }}
          className="text-gray-500 ml-2 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default MessageInput;
