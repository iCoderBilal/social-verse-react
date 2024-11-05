import React from "react";
import Widgets from "../../../components/Common/Widgest";
import { FlagIcon } from "@heroicons/react/24/outline";

function ReportAnalytics({ data }) {
    return (
        <div className="dashboard">
            <div className="grid-container">
            <Widgets
                    title={"Reports"}
                    num={data.data?.totalReports || 0}
                    trand={data.last30daysData?.totalReports || 0}
                    color={"#6b0092"}
                    Icon={FlagIcon}
                />
            </div>
        </div>
    )
}

export default ReportAnalytics;