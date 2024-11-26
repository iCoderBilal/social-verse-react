import React from "react";
import Widgets from "../../../components/Common/Widgest";
import { BookmarkIcon, ChatBubbleBottomCenterIcon, DocumentTextIcon, EyeIcon, FireIcon, HeartIcon, MinusCircleIcon, NoSymbolIcon, ShareIcon, TagIcon } from "@heroicons/react/24/outline";

function ContentAnalytics({ data }) {
    return (
        <div className="dashboard">
            <div className="grid-container">
                <Widgets
                    title={"Posts"}
                    num={data.data?.totalPosts || 0}
                    trand={data.last30daysData?.totalPosts || 0}
                    color={"#6b0092"}
                    Icon={DocumentTextIcon}
                />
                <Widgets
                    title={"Posts Exit Count"}
                    num={data.data?.totalPostsExitCount || 0}
                    trand={data.last30daysData?.totalPostsExitCount || 0}
                    color={"#6b0092"}
                    Icon={FireIcon}
                />
                <Widgets
                    title={"Categories"}
                    num={data.data?.totalCategories || 0}
                    trand={data.last30daysData?.totalCategories || 0}
                    color={"#6b0092"}
                    Icon={TagIcon}
                />
                <Widgets
                    title={"Bookmarks"}
                    num={data.data?.totalBookmarks || 0}
                    trand={data.last30daysData?.totalBookmarks || 0}
                    color={"#6b0092"}
                    Icon={BookmarkIcon}
                />
                <Widgets
                    title={"Comments"}
                    num={data.data?.totalComments || 0}
                    trand={data.last30daysData?.totalComments || 0}
                    color={"#6b0092"}
                    Icon={ChatBubbleBottomCenterIcon}
                />
                <Widgets
                    title={"Views"}
                    num={data.data?.totalViews || 0}
                    trand={data.last30daysData?.totalViews || 0}
                    color={"#6b0092"}
                    Icon={EyeIcon}
                />
                <Widgets
                    title={"Likes"}
                    num={data.data?.totalLikes || 0}
                    trand={data.last30daysData?.totalLikes || 0}
                    color={"#6b0092"}
                    Icon={HeartIcon}
                />
                <Widgets
                    title={"Shares"}
                    num={data.data?.totalPostShares || 0}
                    trand={data.last30daysData?.totalPostShares || 0}
                    color={"#6b0092"}
                    Icon={ShareIcon}
                />

                <Widgets
                    title={"Posts Deleted"}
                    num={data.data?.totalPostDeleted}
                    trand={data.last30daysData?.totalPostDeleted}
                    color={"#6b0092"}
                    Icon={MinusCircleIcon}
                />

                <Widgets
                    title={"Posts Blocked"}
                    num={data.data?.totalPostBlocks}
                    trand={data.last30daysData?.totalPostBlocks}
                    color={"#6b0092"}
                    Icon={NoSymbolIcon}
                />
            </div>
        </div>
    )
}

export default ContentAnalytics;