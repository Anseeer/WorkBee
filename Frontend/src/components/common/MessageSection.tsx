import { Phone, Menu, Send, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { IWorker } from "../../types/IWorker";
import type { Iuser } from "../../types/IUser";
import { socket } from "../../utilities/socket";
import { toast } from "react-toastify";

interface Props {
  users: (IWorker | Iuser)[];
  roomId: string;
  me: string;
}

type ChatMessage = {
  room?: string;
  sender: string;
  receiver: string;
  content: string;
  timestamp?: string | Date;
};

export default function MessageSection({ users, me }: Props) {
  const [roomId, setRoomId] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<IWorker | Iuser | null>(null);
  const [message, setMessage] = useState("");
  const joinedRef = useRef<string[]>([]);
  const [lastMessages, setLastMessages] = useState<Record<string, string>>({});
  const [unread, setUnread] = useState<Record<string, number>>({});


  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Notification permission granted");
        }
      });
    }
  }, []);

  useEffect(() => {
    if (selectedUser) {
      const room = [me, selectedUser.id].sort().join("_");
      setRoomId(room);
      setUnread((prev) => ({
        ...prev,
        [selectedUser.id]: 0,
      }));

    }
  }, [selectedUser, me]);

  useEffect(() => {
    if (!socket.connected) socket.connect();

    users.forEach((user) => {
      const room = [me, user.id].sort().join("_");
      if (!joinedRef.current.includes(room)) {
        socket.emit("joinRoom", room);
        joinedRef.current.push(room);
      }
    });

    const onMessage = (msg: ChatMessage) => {
      if (roomId == msg.room) {
        setChatMessages((prev) => [...prev, msg]);
      }

      const otherId = msg.sender === me ? msg.receiver : msg.sender;
      setLastMessages((prev) => ({
        ...prev,
        [otherId]: msg.content,
      }));

      if (msg.receiver === me && (!selectedUser || selectedUser.id !== msg.sender)) {
        setUnread((prev) => ({
          ...prev,
          [msg.sender]: (prev[msg.sender] || 0) + 1,
        }));
      }
    };

    const onNotification = ({ content }: { content: string }) => {
      toast.info(`new message ${content}`)
    };

    const onPrevious = (prevMsgs: ChatMessage[], room: string) => {
      if (roomId == room) {
        setChatMessages(prevMsgs);
      }
      if (prevMsgs.length > 0) {
        const lastMsg = prevMsgs[prevMsgs.length - 1];
        const otherId =
          lastMsg.sender === me ? lastMsg.receiver : lastMsg.sender;
        setLastMessages((prev) => ({
          ...prev,
          [otherId]: lastMsg.content,
        }));
      }
    };


    socket.on("message", onMessage);
    socket.on("notification", onNotification);
    socket.on("previousMessages", onPrevious);

    return () => {
      users.forEach((user) => {
        const room = [me, user.id].sort().join("_");
        socket.emit("leaveRoom", room);
      });
      socket.off("message", onMessage);
      socket.off("notification", onNotification);
      socket.off("previousMessages", onPrevious);
      socket.emit('unreadedMessage', unread);
      joinedRef.current = [];
    };
  }, [users, me, roomId]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || !selectedUser) return;

    socket.emit("sendMessage", {
      room: [me, selectedUser.id].sort().join("_"),
      sender: me,
      receiver: selectedUser.id,
      content: trimmed,
    });
    setMessage("");
  };

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const onSelect = (selectedUser: Iuser | IWorker | null) => {
    setSelectedUser(selectedUser);
    const room = [me, selectedUser?.id].sort().join("_");
    socket.emit("prevMessage", room);
  }


  return (
    <div className="border-2 border-green-700 rounded-xl m-8 p-5 flex h-full">
      {/* Sidebar */}
      <div className="w-1/3">
        <div className="bg-[#65A276]  h-full overflow-y rounded-r rounded-xl p-4 flex flex-col gap-5 mr-10">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 rounded-lg sm:py-3 py-4 pl-12 pr-4 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:bg-white transition-all"
            />
          </div>

          <div className="flex flex-col sm:gap-2 gap-3">
            {filteredUsers.map((user) => (
              <div
                onClick={() => onSelect(user)}
                key={user.id}
                className="bg-gray-100 rounded-lg p-4 sm:p-2 sm:gap-3 flex items-center gap-4 hover:bg-white transition-all cursor-pointer"
              >
                <div className="md:w-12 md:h-12 sm:w-7 sm:h-7 rounded-full flex items-center justify-center flex-shrink-0">
                  <img
                    src={user.profileImage as string}
                    className=" w-7 h-7 md:w-12 md:h-12 sm:w-7 sm:h-7 rounded-full"
                    alt=""
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <h3 className="font-semibold text-gray-900 md:text-base sm:text-sm flex items-center gap-2">
                    {user.name}
                    {unread && unread[user.id] > 0 && (
                      <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {unread[user.id]}
                      </span>
                    )}
                  </h3>
                  <p className="text-gray-600 md:text-sm sm:text-xs truncate">
                    {lastMessages[user.id] ?? "No messages yet"}
                  </p>
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
              <div ref={bottomRef} />
            </div>

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
              <source src="/bee.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0"></div>
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