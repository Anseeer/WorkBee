import MessageSection from "../../components/common/MessageSection";
import { useSelector } from "react-redux";
import type { RootState } from "../../Store";
import { useEffect, useState } from "react";
import { fetchChat } from "../../services/userService";
import type { IChat } from "../../types/IChat";

const Message = () => {
    const worker = useSelector((state: RootState) => state.worker.worker);
    const [chats, setChats] = useState<IChat[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!worker?.id) return;

            try {
                const chatResponse = await fetchChat(worker.id);
                console.log("chat:", chatResponse);
                setChats(chatResponse);
            } catch (err) {
                console.error("Error fetching chats:", err);
            }
        };
        fetchData();
    }, [worker?.id]);

    return (
        <>
            <div className="flex-1 min-h-0">
                <MessageSection me={worker?._id as string} chats={chats} />
            </div>
        </>
    )
}

export default Message;
