import React from "react";

import Widgets from "../../../components/Common/Widgest";
import { AdjustmentsHorizontalIcon, UserGroupIcon, UserPlusIcon } from "@heroicons/react/24/outline";

function UserAnalytics({ data }) {
    return (
        <div className="dashboard">
            <div className="grid-container">
                <Widgets
                    title={"Users"}
                    num={data.data?.totalUser || 0}
                    trand={data.last30daysData?.totalUser || 0}
                    color={"#6b0092"}
                    Icon={UserGroupIcon}
                />

                <Widgets
                    title={"Referrals"}
                    num={data.data?.totalReferrals || 0}
                    trand={data.last30daysData?.totalReferrals || 0}
                    color={"#6b0092"}
                    Icon={UserPlusIcon}
                />

                <Widgets
                    title={"Creators"}
                    num={data.data?.totalCreators}
                    trand={data.last30daysData?.totalCreators}
                    color={"#6b0092"}
                    Icon={UserGroupIcon}
                />

                <Widgets
                    title={"Active Users"}
                    num={data.data.totalActiveUsers}
                    trand={data.last30daysData.totalActiveUsers}
                    color={"#6b0092"}
                    Icon={UserGroupIcon}
                />

                <Widgets
                    title={"User Tokens"}
                    num={data.data?.totalTokens}
                    trand={data.last30daysData?.totalTokens}
                    color={"#6b0092"}
                    Icon={AdjustmentsHorizontalIcon}
                />
            </div>
        </div>
    )
}

export default UserAnalytics;