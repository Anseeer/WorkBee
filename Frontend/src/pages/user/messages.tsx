import Header from "../../components/user/Header";
import MessageSection from "../../components/common/MessageSection";
import { fetchChat } from "../../services/userService";
import { useSelector } from "react-redux";
import type { RootState } from "../../Store";
import { useEffect, useState } from "react";
import type { IChat } from "../../types/IChat";

const Message = () => {
    const user = useSelector((state: RootState) => state.user.user);
    const [chats, setChats] = useState<IChat[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.id) return;

            try {
                const chatResponse = await fetchChat();
                console.log("ChatResponse :", chatResponse)
                setChats(chatResponse);
            } catch (err) {
                console.error("Error fetching chats:", err);
            }
        };
        fetchData();
    }, [user?.id]);

    return (
        <>
            <div className="h-screen max-h-[5">
                <Header />
                <MessageSection me={user?.id as string} chats={chats} />
            </div>
        </>
    )
}

export default Message;
