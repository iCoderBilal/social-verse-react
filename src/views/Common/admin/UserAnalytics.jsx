import React from "react";

import { DoughnutChart } from "../../../components/Common/Chart";
import Widgets from "../../../components/Common/Widgest";
import { UserGroupIcon, UserPlusIcon } from "@heroicons/react/24/outline";

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

                {data.data?.verifiedUsers &&
                    <div className="grid-item row-2">
                        <div className="grid-item-title">
                            User Status
                        </div>
                        <div className="doughnut-chart">
                            <DoughnutChart
                                labels={['Verified', 'Not Verified']}
                                color={["#6b23de", "#4b006"]}
                                data={data.data.verifiedUsers}
                            />
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default UserAnalytics;