import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { socket } from "../../utilities/socket";
import type { INotification } from "../../types/INotification";
import { NotificationBadge } from "../../utilities/StatusBadge";
import type { Iuser } from "../../types/IUser";
import type { IWorker } from "../../types/IWorker";

const NotificationItem = ({ notification }: { notification: INotification }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });

    const formattedTime = notification?.createdAt
        ? formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })
        : "Unknown time";

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-white border border-green-700 rounded-md px-3 py-2 xs:px-4 xs:py-3 sm:px-5 sm:py-4 mx-2 my-2 xs:mx-3 xs:my-3 sm:mx-4 sm:my-4 shadow-sm hover:shadow-md transition-shadow duration-300"
        >
            <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center mb-1 xs:mb-2 space-y-1 xs:space-y-0">
                <p className="font-semibold text-gray-800 text-xs xs:text-sm sm:text-base">
                    {notification.title || "No title"}
                </p>

                <div className="flex items-center space-x-2">
                    <NotificationBadge type={notification.type} />
                    <span className="text-gray-500 text-xs sm:text-sm">{formattedTime}</span>
                </div>
            </div>

            <p className="text-gray-600 text-xs xs:text-sm sm:text-base">
                {notification.body || "No description"}
            </p>
        </motion.div>
    );
};

interface props {
    user: Iuser | IWorker;
}

const NotificationSection = ({ user }: props) => {
    const [notifications, setNotifications] = useState<INotification[]>([]);
    console.log(notifications)
    useEffect(() => {
        if (!user?.id) return;

        socket.emit("join-user-room", user.id);

        socket.emit("get-notifications", { userId: user.id });

        socket.on("notifications_list", (data: INotification[]) => {
            setNotifications(data || []);
        });

        socket.on("new-notification", (newNotification) => {
            setNotifications((prev) => [newNotification, ...prev]);
        });

        return () => {
            socket.off("notifications_list");
            socket.off("new-notification");
        };
    }, [user?.id]);

    return (
        <div className="min-h-screen bg-white p-2 xs:p-4 sm:p-6 md:p-8 lg:p-10">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 xs:mb-6 sm:mb-8 text-center">
                    Notifications
                </h2>
                <div className="max-h-[calc(100vh-120px)] xs:max-h-[calc(100vh-150px)] sm:max-h-[calc(100vh-180px)] md:max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-hidden">
                    {notifications.length > 0 ? (
                        notifications.map((n) => (
                            <NotificationItem key={n._id} notification={n} />
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-center text-gray-500 text-sm xs:text-base sm:text-lg font-medium py-6 xs:py-8 sm:py-10"
                        >
                            No notifications
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationSection;
