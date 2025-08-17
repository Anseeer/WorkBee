import Header from "../../components/user/Header";
import MessageSection from "../../components/common/MessageSection";
import { fetchWorkHistory } from "../../services/userService";
import { useSelector } from "react-redux";
import type { RootState } from "../../Store";
import { useEffect, useState } from "react";
import type { IWork } from "../../types/IWork";
import { findWorkersByIds } from "../../services/workerService";

const Message = () => {
    const user = useSelector((state: RootState) => state.user.user);
    const [workers, setWorkers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.id) return;

            try {
                const work = await fetchWorkHistory(user.id);
                const workHistory = work?.data?.data ?? [];

                const workerIds = workHistory
                    .filter((work: IWork) => work.status !== "Pending" && work.status !== "Canceled")
                    .map((work: IWork) => work.workerId);

                if (workerIds.length === 0) return;
                const response = await findWorkersByIds(workerIds);

                setWorkers(response.workers);
            } catch (err) {
                console.error("Error fetching work history:", err);
            }
        };

        fetchData();
    }, [user?.id]);

    console.log("workers ::", workers);



    const users = workers;

    const messages = [
        { id: 1, text: "Hello! How are you doing today?", sender: "other", time: "10:30 AM" },
        { id: 2, text: "I'm doing great, thanks for asking!", sender: "me", time: "10:32 AM" },
        { id: 3, text: "That's wonderful to hear. I wanted to discuss the project details with you.", sender: "other", time: "10:33 AM" },
        { id: 4, text: "Sure, I'm available to discuss. What would you like to know?", sender: "me", time: "10:35 AM" },
    ];
    return (
        <>
            <Header />
            <MessageSection users={users}  />
        </>
    )
}

export default Message;
