import { useSelector } from "react-redux"
import NotificationSection from "../../components/common/NotificationSection"
import Header from "../../components/user/Header"
import type { RootState } from "../../Store"
import type { Iuser } from "../../types/IUser"

export const Notifications = () => {
    const user = useSelector((state: RootState) => state.user.user);
    return (
        <>
            <Header />
            <NotificationSection user={user as Iuser} />
        </>
    )
}