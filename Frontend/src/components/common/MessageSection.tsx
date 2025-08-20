import { Phone, Menu, Send, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { IWorker } from "../../types/IWorker";
import type { Iuser } from "../../types/IUser";
import { socket } from "../../utilities/socket";

interface Props {
  users: (IWorker | Iuser)[];
  roomId: string;
  me: string;
}

type ChatMessage = {
  room: string;
  sender: string;
  receiver: string;
  content: string;
  timestamp?: string | Date;
};

export default function MessageSection({ users, roomId, me }: Props) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<IWorker | Iuser | null>(null);
  const [message, setMessage] = useState(""); // input field state
  const joinedRef = useRef(false);
  const [lastMessages, setLastMessages] = useState<Record<string, string>>({});



  // filter user list by search query
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const otherUserId = selectedUser?.id;
  roomId = otherUserId ? [me, otherUserId].sort().join("_") : '';



  useEffect(() => {
    if (!socket.connected) socket.connect();

    // join once per room change
    if (!joinedRef.current) {
      socket.emit("joinRoom", roomId);
      joinedRef.current = true;
    }

    const onMessage = (msg: ChatMessage) => {
      setChatMessages((prev) => [...prev, msg]);

      // update last message for sender/receiver
      const otherId = msg.sender === me ? msg.receiver : msg.sender;
      setLastMessages((prev) => ({
        ...prev,
        [otherId]: msg.content,
      }));
    };


    const onPrevious = (prevMsgs: ChatMessage[]) => {
      setChatMessages(prevMsgs);

      if (prevMsgs.length > 0 && selectedUser) {
        const lastMsg = prevMsgs[prevMsgs.length - 1];
        setLastMessages((prev) => ({
          ...prev,
          [selectedUser.id]: lastMsg.content,
        }));
      }
    };


    socket.on("message", onMessage);
    socket.on("previousMessages", onPrevious);

    return () => {
      socket.emit("leaveRoom", roomId);
      socket.off("message", onMessage);
      socket.off("previousMessages", onPrevious);
      joinedRef.current = false;
    };
  }, [roomId, me]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;

    if (!selectedUser) return;

    socket.emit("sendMessage", {
      room: [me, selectedUser.id].sort().join("_"),
      sender: me,
      receiver: selectedUser.id,
      content: trimmed
    });
    setMessage("");
  };

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);


  return (
    <div className="border-2 border-green-700 rounded-xl m-8 p-5 flex h-full ">
      {/* Sidebar */}
      <div className="w-1/3">
        <div className="bg-[#65A276] w-80 h-full overflow-y rounded-r rounded-xl p-4 flex flex-col gap-4">
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 rounded-lg py-4 pl-12 pr-4 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:bg-white transition-all"
            />
          </div>

          {/* User List */}
          <div className="flex flex-col gap-3">
            {filteredUsers.map((user) => (
              <div
                onClick={() => setSelectedUser(user)}
                key={user.id}
                className="bg-gray-100 rounded-lg p-4 flex items-center gap-4 hover:bg-white transition-all cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <img
                    src={user.profileImage as string}
                    className="w-12 h-12 rounded-full"
                    alt=""
                  />
                </div>

                <div className="flex flex-col min-w-0">
                  <h3 className="font-semibold text-gray-900 text-base">{user.name}</h3>
                  <p className="text-gray-600 text-sm truncate"> {lastMessages[user.id] ?? "No messages yet"}</p>
                </div>
              </div>
            ))}
          </div>

          {filteredUsers.length === 0 && searchQuery && (
            <div className="text-center py-8">
              <p className="text-white text-sm">No users found</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="w-2/3 bg-white">
        {selectedUser ? (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="bg-[#65A276] px-6 py-4 flex rounded-xl rounded-b items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                  <img
                    src={selectedUser.profileImage as string}
                    className="w-12 h-12 bg-black rounded-full"
                    alt="Profile image"
                  />
                </div>

                <div className="flex flex-col">
                  <h2 className="text-black font-semibold text-lg">{selectedUser.name}</h2>
                  <p className="text-xs text-gray-700">{selectedUser.phone ?? "No phone available"}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button className="p-2 hover:bg-white-600 rounded-lg transition-colors">
                  <Phone className="h-5 w-5 text-black" />
                </button>
                <button className="p-2 hover:bg-white-600 rounded-lg transition-colors">
                  <Menu className="h-5 w-5 text-black" />
                </button>
              </div>
            </div>

            {/* message */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {chatMessages.map((msg, i) => {
                const time = new Date(msg.timestamp as string).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                });

                return (
                  <div
                    key={i}
                    className={`flex ${msg.sender === me ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`relative max-w-xs lg:max-w-md px-6 py-1 pb-4 rounded-2xl ${msg.sender === me ? "bg-[#65A276] text-black" : "bg-[#65A286] text-black"
                        }`}
                    >
                      <p className="text-md">{msg.content}</p>
                      <span
                        className={`absolute bottom-1 text-[10px] text-gray-700 ${msg.sender === me ? "right-2" : "left-2"
                          }`}
                      >
                        {time}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* invisible anchor to scroll to */}
              <div ref={bottomRef} />
            </div>



            {/* Input */}
            <div className="bg-[#65A276] px-6 py-3 rounded-xl rounded-t">
              <form onSubmit={handleSendMessage} className="flex items-center gap-4">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Message"
                  className="flex-1 bg-[#65A276] border-none outline-none text-black placeholder-black text-lg py-2"
                />
                <button
                  type="submit"
                  className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  disabled={!message.trim()}
                >
                  <Send className="h-5 w-5 text-black" />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full relative overflow-hidden">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute pb-20 inset-0 w-full h-full object-fit opacity-30"
            >
              <source src="./bee.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 "></div>
            <div className="relative text-center space-y-4 text-white">
              <div className="flex-shrink-0">
                <h1 className="merienda-text text-7xl text-green-900">WorkBee</h1>
              </div>
              <p className="text-black text-lg text-semibold">Select a user from the sidebar to start your conversation.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
