import React from "react";
import Widgets from "../../../components/Common/Widgest";
import { CurrencyDollarIcon, UserGroupIcon } from "@heroicons/react/24/outline";

function SubscriptionAnalytics({ data }) {
    return (
        <div className="dashboard">
            <div className="grid-container">
                <Widgets
                    title={"Active Subscriptions"}
                    num={data.data?.totalSubscriptions || 0}
                    trand={data.last30daysData?.totalSubscriptions || 0}
                    color={"#6b0092"}
                    Icon={UserGroupIcon}
                />
                <Widgets
                    title={"Revenue"}
                    num={data.data?.totalRevenue || 0}
                    trand={data.last30daysData?.totalRevenue || 0}
                    color={"#6b0092"}
                    Icon={CurrencyDollarIcon}
                />
            </div>
        </div>
    )
}

export default SubscriptionAnalytics;