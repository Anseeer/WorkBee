/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../Store";
import type { IChat } from "../../types/IChat";
import { fetchChat } from "../../services/userService";

type UnreadMessageCountType = {
    unreadCounts: number;
}

const UnreadMessageCountContext = createContext<UnreadMessageCountType | undefined>(undefined);

interface Props {
    children: React.ReactNode;
}

export function UnreadMessageCountProvider({ children }: Props) {
    const user = useSelector((state: RootState) => state.user.user);
    const [chats, setChats] = useState<IChat[]>([]);
    const [unreadCounts, setUnreadCounts] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.id) return;

            try {
                const chatResponse = await fetchChat();
                setChats(chatResponse);
            } catch (err) {
                console.error("Error fetching chats:", err);
            }
        };
        fetchData();
    }, [user?.id]);

    useEffect(() => {
        if (!chats || !user?.id) return;

        const totalUnread = chats.reduce((sum, chat) => {
            const otherParticipant = chat.participants.find((p) => p._id !== user.id);
            if (!otherParticipant) return sum;

            const unreadCount = chat.unreadCounts?.[user.id] || 0;
            return sum + unreadCount;
        }, 0);

        setUnreadCounts(totalUnread);
    }, [chats, user?.id]);

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

