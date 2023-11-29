import dbConnect from "@/config/db"
import NotificationItem from "@/config/schema/User/NotificationItem";
import { pushNotification } from "./pushNotification";


export async function addNotification(data, userId) {

    try {

        await dbConnect();

        data.map(async (notification) => {
            const newNotification = new NotificationItem(notification);
            await newNotification.save();
            const pushData = {
                pushData : notification,
                userId,
                type : notification.type,
            }
            await pushNotification(pushData);
        });

    } catch(err) {
        console.log(err)
        return err
    }
}