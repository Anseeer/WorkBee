/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../Store";
import type { IChat } from "../../types/IChat";
import type { IChatMessage } from "../../types/IChatMessage";
import type { INotification } from "../../types/INotification";
import { fetchChat } from "../../services/userService";
import { socket } from "../../utilities/socket";

type UnreadMessageCountType = {
    unreadCounts: number;
}

const UnreadMessageCountContext = createContext<UnreadMessageCountType | undefined>(undefined);

interface Props {
    children: React.ReactNode;
}

export function UnreadMessageCountProvider({ children }: Props) {
    const user = useSelector((state: RootState) => state.user.user);
    const worker = useSelector((state: RootState) => state.worker.worker);

    const currentUser = user?.id ? user : worker?.id ? worker : null;
    const currentUserId = currentUser?.id;

    console.log('Current User:', currentUser);

    const [chats, setChats] = useState<IChat[]>([]);
    const [unreadCounts, setUnreadCounts] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            if (!currentUserId) return;

            try {
                const chatResponse = await fetchChat();
                setChats(chatResponse);
            } catch (err) {
                console.error("Error fetching chats:", err);
            }
        };
        fetchData();
    }, [currentUserId]);

    useEffect(() => {
        if (!chats || !currentUserId) return;

        const totalUnread = chats.reduce((sum, chat) => {
            const unreadCount = chat.unreadCounts?.[currentUserId] || 0;
            return sum + unreadCount;
        }, 0);

        console.log("Total unread count:", totalUnread);
        setUnreadCounts(totalUnread);
    }, [chats, currentUserId]);

    useEffect(() => {
        if (!currentUserId) return;

        if (!socket.connected) socket.connect();

        socket.emit('join-user-room', currentUserId);

        const onMessage = (_msg: IChatMessage, updatedChat: IChat) => {
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

        const onChatUpdate = ({
            _id: updatedChatId,
            lastMessage,
            unreadCount,
        }: { _id: string; lastMessage?: IChatMessage; unreadCount: number }) => {
            setChats((prev) => {
                if (!prev) return prev;
                return prev.map((chat) =>
                    chat._id === updatedChatId
                        ? {
                            ...chat,
                            lastMessage: lastMessage || chat.lastMessage,
                            unreadCounts: {
                                ...chat.unreadCounts,
                                [currentUserId]: unreadCount,
                            },
                        }
                        : chat
                );
            });
        };

        socket.on('message', onMessage);
        socket.on('chatUpdate', onChatUpdate);

        return () => {
            socket.off('message', onMessage);
            socket.off('chatUpdate', onChatUpdate);
        };
    }, [currentUserId]);

    return (
        <UnreadMessageCountContext.Provider value={{ unreadCounts }}>
            {children}
        </UnreadMessageCountContext.Provider>
    );
}

export function useUnreadMessageCount() {
    const context = useContext(UnreadMessageCountContext);
    if (!context) throw new Error("useUnreadMessageCount must be used within UnreadMessageCountProvider");
    return context;
}


type UnreadNotificationCountType = {
    unreadNotificationCount: number;
}

const UnreadNotificationCountContext = createContext<UnreadNotificationCountType | undefined>(undefined);

interface Props {
    children: React.ReactNode;
}

export function UnreadNotificationCountProvider({ children }: Props) {
    const user = useSelector((state: RootState) => state.user.user);
    const worker = useSelector((state: RootState) => state.worker.worker);

    const currentUser = user?.id ? user : worker?.id ? worker : null;
    const currentUserId = currentUser?.id;

    const [notifications, setNotifications] = useState<INotification[]>([]);
    const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

    useEffect(() => {
        if (!currentUserId) return;

        if (!socket.connected) socket.connect();

        // Join user room
        socket.emit("join-user-room", currentUserId);

        // Request notifications
        socket.emit("get-notifications", { userId: currentUserId });

        // Listen for initial notifications list
        const onNotificationsList = (data: INotification[]) => {
            setNotifications(data || []);
        };

        // Listen for new notifications in real-time
        const onNewNotification = (newNotification: INotification) => {
            setNotifications((prev) => [newNotification, ...prev]);
        };

        socket.on("notifications_list", onNotificationsList);
        socket.on("new-notification", onNewNotification);

        return () => {
            socket.off("notifications_list", onNotificationsList);
            socket.off("new-notification", onNewNotification);
        };
    }, [currentUserId]);

    // Calculate unread count whenever notifications change
    useEffect(() => {
        const unreadCount = notifications.filter(n => !n.read).length;
        setUnreadNotificationCount(unreadCount);
        console.log("Unread notification count:", unreadCount);
    }, [notifications]);

    return (
        <UnreadNotificationCountContext.Provider value={{ unreadNotificationCount }}>
            {children}
        </UnreadNotificationCountContext.Provider>
    );
}

export function useUnreadNotificationCount() {
    const context = useContext(UnreadNotificationCountContext);
    if (!context) throw new Error("useUnreadNotificationCount must be used within UnreadNotificationCountProvider");
    return context;
}