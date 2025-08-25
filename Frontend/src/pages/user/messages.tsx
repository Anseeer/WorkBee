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
                const work = await fetchWorkHistory(user.id,1,1000);
                const workHistory = work?.data?.data.paginatedWorks ?? [];

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

    return (
        <>
        <div className="h-screen max-h-[5">
            <Header />
            <MessageSection roomId={user?.id as string} me={user?.id as string} users={users} />
        </div>
        </>
    )
}

export default Message;
