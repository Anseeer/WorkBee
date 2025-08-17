// src/components/ChatRoom.tsx
import { useEffect, useRef, useState } from "react";
import { socket } from "../../utilities/socket";

type ChatMessage = {
  room: string;
  sender: string;
  content: string;
  timestamp?: string | Date;
};

export default function ChatRoom({ roomId, me }: { roomId: string; me: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const joinedRef = useRef(false);

  useEffect(() => {
    if (!socket.connected) socket.connect();

    // join once per room change
    if (!joinedRef.current) {
      socket.emit("joinRoom", roomId);
      joinedRef.current = true;
    }

    const onMessage = (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    };

    // (for later when you add DB) handle previousMessages
    const onPrevious = (prevMsgs: ChatMessage[]) => {
      setMessages(prevMsgs);
    };

    socket.on("message", onMessage);
    socket.on("previousMessages", onPrevious);

    return () => {
      socket.emit("leaveRoom", roomId);
      socket.off("message", onMessage);
      socket.off("previousMessages", onPrevious);
      // keep socket connected if app-wide; disconnect if this is the only consumer:
      // socket.disconnect();
      joinedRef.current = false;
    };
  }, [roomId]);

  const send = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    socket.emit("sendMessage", { room: roomId, sender: me, content: trimmed });
    setInput(""); // Optimistic clear; server will broadcast to everyone (incl. me)
  };

  return (
    <div className="max-w-md w-full border rounded-xl p-3 space-y-3">
      <div className="font-semibold">Room: {roomId}</div>
      <div className="h-64 overflow-y-auto border rounded p-2 text-sm space-y-1">
        {messages.map((m, i) => (
          <div key={i}>
            <span className="font-medium">{m.sender}: </span>
            <span>{m.content}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-2 py-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type message…"
        />
        <button className="border rounded px-3 py-1" onClick={send}>
          Send
        </button>
      </div>
    </div>
  );
}
