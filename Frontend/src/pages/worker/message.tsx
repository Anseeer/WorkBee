import MessageSection from "../../components/common/MessageSection";
import { useSelector } from "react-redux";
import type { RootState } from "../../Store";
import { useEffect, useState } from "react";
import { fetchWorkHistory } from "../../services/workerService";
import type { IWork } from "../../types/IWork";
import { findUsersByIds } from "../../services/userService";

const Message = () => {
    const worker = useSelector((state: RootState) => state.worker.worker);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {

            try {
                const work = await fetchWorkHistory(worker?._id as string,1,1000);
                const workHistory = work?.data.paginatedWorkHistory ?? [];
                const userIds = workHistory
                    .filter((work: IWork) => work.status !== "Pending" && work.status !== "Canceled")
                    .map((work: IWork) => work.userId);

                if (userIds.length === 0) return;
                const response = await findUsersByIds(userIds);

                setUsers(response.result);
            } catch (err) {
                console.error("Error fetching work history:", err);
            }
        };

        fetchData();
    }, [worker?._id]);

    return (
        <>
        <div className="max-h-[540px] h-[540px]">
            <MessageSection roomId={worker?._id as string} me={worker?._id as string} users={users} />
        </div>
        </>
    )
}

export default Message;
