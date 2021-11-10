import React from "react";
import Skeleton from "react-loading-skeleton";

function TopUserDonorLoading(props) {
  return (
    <div className="p-4 px-6 bg-white flex">
      <div className="mr-2">
        <Skeleton circle={true} width={40} height={40}></Skeleton>
      </div>
      <div>
        <div className="text-sm font-medium text-gray-900">
          <Skeleton width={110} height={20}></Skeleton>
        </div>
        <div className="text-sm text-gray-500">
          <Skeleton width={155} height={20}></Skeleton>
        </div>
      </div>
    </div>
  );
}

export default TopUserDonorLoading;
