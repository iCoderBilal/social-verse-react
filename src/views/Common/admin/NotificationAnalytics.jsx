import React from "react";
import Widgets from "../../../components/Common/Widgest";
import { BellAlertIcon, ChatBubbleBottomCenterIcon, UserGroupIcon, UsersIcon } from "@heroicons/react/24/outline";

function NotificationAnalytics({ data }) {
    return (
        <div className="dashboard">
            <div className="grid-container">
                <Widgets
                    title={"Groups"}
                    num={data.data?.totalGroups || 0}
                    trand={data.last30daysData?.totalGroups || 0}
                    color={"#6b0092"}
                    Icon={UserGroupIcon}
                />

                <Widgets
                    title={"Private Chats"}
                    num={data.data?.privateChats || 0}
                    trand={data.last30daysData?.privateChats || 0}
                    color={"#6b0092"}
                    Icon={UsersIcon}
                />
                
                <Widgets
                    title={"Messages"}
                    num={data.data?.totalMessage || 0}
                    trand={data.last30daysData?.totalMessage || 0}
                    color={"#6b0092"}
                    Icon={ChatBubbleBottomCenterIcon}
                />

                <Widgets
                    title={"Notifications"}
                    num={data.data?.totalNotifications || 0}
                    trand={data.last30daysData?.totalNotifications || 0}
                    color={"#6b0092"}
                    Icon={BellAlertIcon}
                />
            </div>
        </div>
    )
}

export default NotificationAnalytics;