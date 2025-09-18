import { useSelector } from "react-redux";
import NotificationSection from "../../components/common/NotificationSection";
import type { RootState } from "../../Store";
import type { IWorker } from "../../types/IWorker";

const Notifications = () => {
    const worker = useSelector((state: RootState) => state.worker.worker);
    return (
        <>
            <NotificationSection user={worker as IWorker} />
        </>
    )
}

export default Notifications;