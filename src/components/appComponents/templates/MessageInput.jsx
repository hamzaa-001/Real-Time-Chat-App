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

  return (
    <div>
      <div className="flex items-center p-4 border-t border-white/50">
        <Dialog>
          <DialogTrigger>
            <FaPaperclip
              className={` ${
                image ? "text-[#21978B]" : "text-gray-500"
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
                    className="max-h-60 w-full mb-4"
                    alt="image"
                  />
                )}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mb-4"
                  />
                  <button
                    className="shrink-0 rounded-md border border-blue-600 bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
                    onClick={() => handleUpload()}
                  >
                    Upload
                  </button>
                </div>
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
          className="flex-1 border-none p-2 outline-none bg-[#FBFBFD] text-[#141414]"
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
