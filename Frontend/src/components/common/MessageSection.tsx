import { useState, useEffect, useRef } from 'react';
import { socket } from '../../utilities/socket';
import type { IChat } from '../../types/IChat';
import type { IChatMessage } from '../../types/IChatMessage';
import CallComponent from './AudioCall';
import { acceptCall, endCall, handleAnswerCall, handleIncomingIceCandidates } from '../../utilities/webrtcService';
import { Search, ArrowLeft, Phone, Send } from 'lucide-react';
import { toast } from 'react-toastify';

interface Props {
  chats: IChat[];
  me: string;
}

export default function MessageSection({ chats, me }: Props) {
  const [chatMessages, setChatMessages] = useState<IChatMessage[]>([]);
  const [chat, setChats] = useState<IChat[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<IChat['participants'][0] | null>(null);
  const [message, setMessage] = useState('');
  const [isCall, setIsCall] = useState(false);
  const [isOutgoing, setIsOutgoing] = useState(false);
  const [incomingCall, setIncomingCall] = useState<{ from: string; offer: RTCSessionDescriptionInit; callerId: string } | null>(null);
  const joinedRef = useRef(false);

  const onCallEnd = () => {
    endCall();
    setIsCall(false);
    setIsOutgoing(false);
    setIncomingCall(null);
    const remoteAudio = document.getElementById('remote-audio') as HTMLAudioElement;
    if (remoteAudio) {
      remoteAudio.srcObject = null;
      remoteAudio.pause();
    }
  };

  useEffect(() => {
    setChats(chats);
  }, [chats]);

  useEffect(() => {
    socket.emit('join-user-room', me);
    return () => {
      socket.off('webrtc-offer');
      socket.off('webrtc-answer');
      socket.off('webrtc-ice-candidate');
      socket.off('webrtc-reject');
      socket.off('webrtc-end-call');
    };
  }, [me]);

  const filteredChats = chat?.filter((chat) =>
    chat.participants.some((participant) =>
      participant.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  const selectedChat = selectedUser
    ? chat?.find((chat) =>
      chat.participants.some((p) => p._id === selectedUser._id)
    )
    : null;
  const chatId = selectedChat?._id || '';

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    if (!joinedRef.current && chatId) {
      socket.emit('joinChat', { chatId, userId: me });
      joinedRef.current = true;
    }

    const onMessage = (msg: IChatMessage, updatedChat: IChat) => {
      if (updatedChat._id === chatId) {
        setChatMessages((prev) => {
          const updatedMessages = [...prev, msg].sort((a, b) =>
            new Date(a.createdAt as string).getTime() - new Date(b.createdAt as string).getTime()
          );
          return updatedMessages;
        });
      }
      setChats((prev) =>
        prev.map((chat) =>
          chat._id === updatedChat._id
            ? {
              ...chat,
              lastMessage: updatedChat.lastMessage,
              unreadCounts: updatedChat.unreadCounts,
            }
            : chat
        )
      );
    };

    const onPrevious = (prevMsgs: IChatMessage[]) => {
      setChatMessages(
        prevMsgs.sort((a, b) =>
          new Date(a.createdAt as string).getTime() - new Date(b.createdAt as string).getTime()
        )
      );
    };

    const onChatUpdate = ({
      _id: updatedChatId,
      lastMessage,
      unreadCount,
    }: { _id: string; lastMessage?: IChatMessage; unreadCount: number }) =>
      setChats((prev: IChat[]) => {
        if (!prev) return prev;
        return prev.map((chat) =>
          chat._id === updatedChatId
            ? {
              ...chat,
              lastMessage: lastMessage || chat.lastMessage,
              unreadCounts: {
                ...chat.unreadCounts,
                [me]: unreadCount,
              },
            }
            : chat
        );
      });

    socket.on('webrtc-offer', ({ offer, callerId }) => {
      setIncomingCall({ from: callerId, offer, callerId });
      const caller = chat?.find((c) =>
        c.participants.some((p) => p._id === callerId)
      )?.participants.find((p) => p._id === callerId);
      if (caller) setSelectedUser(caller);
    });

    socket.on('webrtc-answer', handleAnswerCall);
    socket.on('webrtc-ice-candidate', handleIncomingIceCandidates);
    socket.on('webrtc-reject', () => {
      endCall();
      onCallEnd();
    });
    socket.on('webrtc-end-call', () => {
      toast('Call ended');
      endCall();
      onCallEnd();
    });

    socket.on('message', onMessage);
    socket.on('previousMessages', onPrevious);
    socket.on('chatUpdate', onChatUpdate);

    return () => {
      if (chatId) {
        socket.emit('leaveChat', chatId, me);
      }
      socket.off('message', onMessage);
      socket.off('previousMessages', onPrevious);
      socket.off('chatUpdate', onChatUpdate);
      socket.off('webrtc-offer');
      socket.off('webrtc-answer');
      socket.off('webrtc-ice-candidate');
      socket.off('webrtc-reject');
      socket.off('webrtc-end-call');
      joinedRef.current = false;
      if (isCall) {
        endCall();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId, me, selectedUser, isCall]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;

    if (!selectedUser || !chatId) return;

    const receiverId = selectedChat?.participants.find((p) => p._id !== me)?._id;
    if (!receiverId) return;

    socket.emit('sendMessage', {
      chatId,
      senderId: me,
      receiverId,
      content: trimmed,
      contentType: 'text',
    });
    setMessage('');
  };

  const handleAcceptCall = async () => {
    if (incomingCall) {
      await acceptCall(incomingCall.callerId, incomingCall.offer);
      setIncomingCall(null);
      setIsOutgoing(false);
      setIsCall(true);
      const remoteAudio = document.getElementById('remote-audio') as HTMLAudioElement;
      if (remoteAudio && remoteAudio.srcObject) {
        remoteAudio.play().catch(error => console.error('MessageSection: Failed to play audio after accept:', error));
      }
    }
  };

  const handleRejectCall = () => {
    if (incomingCall) {
      socket.emit('webrtc-reject', { targetUserId: incomingCall.callerId });
      setIncomingCall(null);
      endCall();
      onCallEnd();
    }
  };

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const user = {
    _id: selectedUser?._id,
    name: selectedUser?.name,
    profileImage: selectedUser?.profileImage,
  };

  return (
    <div className="border-2 h-screen border-green-700 rounded-xl mx-4 sm:mx-6 md:mx-8 lg:mx-8 my-4 sm:my-6 md:my-8 lg:my-8 p-4 sm:p-5 flex flex-col md:flex-row min-h-screen md:h-[calc(100vh-4rem)] gap-0 md:gap-4">
      <audio id="remote-audio" autoPlay playsInline />

      {/* Sidebar */}
      <div className={`w-full lg:w-1/3 md:w-1/3 ${selectedUser ? 'hidden md:block' : 'block'} h-full animate-fadeInLeft`}>
        <div className="bg-[#65A276] w-full h-full overflow-y-auto rounded-r rounded-xl p-4 flex flex-col gap-4">
          {/* Search Box */}
          <div className="relative animate-fadeInDown">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 rounded-lg py-3 sm:py-4 pl-12 pr-4 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:bg-white transition-all text-sm sm:text-base"
            />
          </div>

          {/* Chat Users */}
          <div className="flex flex-col gap-3">
            {filteredChats?.map((chat, index) => {
              const otherParticipant = chat.participants.find((p) => p._id !== me);
              if (!otherParticipant) return null;
              const unreadCount = chat.unreadCounts?.[me] || 0;

              return (
                <div
                  onClick={() => {
                    if (isCall) {
                      toast.warning("You can't switch users while on a call");
                      return;
                    }
                    setSelectedUser(otherParticipant);
                  }}

                  key={chat?._id}
                  className="bg-gray-100 rounded-lg p-3 sm:p-4 flex items-center gap-4 hover:bg-white transition-all cursor-pointer animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0">
                    <img
                      src={otherParticipant.profileImage}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
                      alt={otherParticipant.name}
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{otherParticipant.name}</h3>
                      {unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-xs sm:text-sm truncate">
                      {chat?.lastMessage?.content ?? 'No messages yet'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredChats?.length === 0 && searchQuery && (
            <div className="text-center py-8 animate-fadeInScale">
              <p className="text-white text-sm">No users found</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`w-full lg:w-2/3 md:w-2/3 bg-white ${selectedUser ? 'block' : 'hidden md:block'} h-full`}>
        {isCall ? (
          <CallComponent onCallEnd={onCallEnd} user={user} isOutgoing={isOutgoing} me={me} />
        ) : selectedUser ? (
          <div className="flex flex-col h-full">
            {/* Chat Header */}
            <div className="bg-[#65A276] px-4 sm:px-6 py-3 sm:py-4 flex rounded-xl rounded-b-none items-center justify-between animate-fadeInDown">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-2 hover:bg-gray-300 rounded-lg transition-colors md:hidden"
                >
                  <ArrowLeft className="h-5 w-5 text-black" />
                </button>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-full flex items-center justify-center">
                  <img
                    src={selectedUser?.profileImage as string}
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-full"
                    alt="Profile image"
                  />
                </div>
                <div className="flex flex-col">
                  <h2 className="text-black font-semibold text-base sm:text-lg">{selectedUser?.name}</h2>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    setIsOutgoing(true);
                    setIsCall(true);
                  }}
                  className="p-2 hover:bg-gray-300 rounded-lg transition-colors"
                >
                  <Phone className="h-5 w-5 text-black" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 h-screen overflow-y-auto p-4 sm:p-6 space-y-4">
              {chatMessages.map((msg, i) => {
                const time = new Date(msg.createdAt as string).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                });
                return (
                  <div
                    key={msg._id || i}
                    className={`flex ${msg.senderId === me ? 'justify-end' : 'justify-start'} `}
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <div
                      className={`relative max-w-[70%] sm:max-w-xs md:max-w-md lg:max-w-lg px-4 sm:px-8 py-1 pb-4 rounded-2xl ${msg.senderId === me ? 'bg-[#65A276] text-black' : 'bg-[#65A286] text-black'}`}
                    >
                      <p className="text-sm sm:text-md">{msg.content}</p>
                      <span
                        className={`absolute bottom-1 text-[10px] text-gray-700 ${msg.senderId === me ? 'right-2' : 'left-2'}`}
                      >
                        {time}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="bg-[#65A276] px-4 sm:px-6 py-3 rounded-xl rounded-t-none animate-fadeInUp">
              <form onSubmit={handleSendMessage} className="flex items-center gap-4">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Message"
                  className="flex-1 bg-[#65A276] border-none outline-none text-black placeholder-black text-base sm:text-lg py-2"
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
          <div className="flex items-center justify-center h-full relative overflow-hidden animate-fadeInScale">
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
            <div className="relative text-center space-y-4 text-white px-4">
              <h1 className="merienda-text text-5xl sm:text-6xl md:text-7xl text-green-900 animate-zoomIn">WorkBee</h1>
              <p className="text-black text-base sm:text-lg md:text-lg text-semibold animate-fadeInUp">
                Select a user from the sidebar to start your conversation.
              </p>
            </div>
          </div>
        )}
      </div>
      {incomingCall ? (
        <div className="fixed  inset-0 flex items-start justify-center z-50 animate-zoomIn">
          <div className="w-full  md:w-2/3 lg:w-2/3 bg-white p-6 rounded-lg shadow-lg text-center mx-4">
            <h2 className="text-xl font-bold mb-4">
              Incoming Call from {selectedUser?.name || 'User'}
            </h2>
            <div className="flex justify-center gap-4">
              <button
                className="bg-green-400 rounded-full border border-green-500 text-white px-4 py-2 rounded"
                onClick={handleAcceptCall}
              >
                Accept
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={handleRejectCall}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );

}

