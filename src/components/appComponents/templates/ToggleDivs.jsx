import Image from "next/image";
import userProfile from "../../../../public/user.jpg";

const ToggleDivs = ({ name, latestMessage, time, type }) => {
  return (
    <div className="flex flex-col gap-5">
      {type == "users" && (
        <>
          <ul>
            <li className="">
              <div className="flex justify-start items-center gap-2 mt-3">
                <Image
                  src={userProfile}
                  width={40}
                  height={40}
                  className="rounded-full"
                  alt="profile"
                />
                <div className="flex justify-between">
                  <h2 className="text-lg text-[#141414]">{name}</h2>
                </div>
              </div>
            </li>
          </ul>
          <span class="flex items-center -mt-2">
            <span class="h-px flex-1 bg-[#141414]"></span>
          </span>
        </>
      )}
      {type == "chatroom" && (
        <>
          <ul>
            <li>
              <div className="flex justify-between gap-2 items-center ">
                <div className="flex gap-2 justify-center items-center mt-3 ">
                  <Image
                    src={userProfile}
                    width={40}
                    height={40}
                    className="rounded-full"
                    alt="profile"
                  />
                  <div className="flex flex-col justify-between">
                    <h2 className="text-lg text-[#141414] ">{name}</h2>
                    <p className="text-xs text-[#323232] truncate">
                      {latestMessage}
                    </p>
                  </div>
                </div>
                <p className="text-[#323232] text-xs">{time}</p>
              </div>
            </li>
          </ul>
          <span class="flex items-center -mt-2">
            <span class="h-px flex-1 bg-[#323232]"></span>
          </span>
        </>
      )}
    </div>
  );
};

export default ToggleDivs;
