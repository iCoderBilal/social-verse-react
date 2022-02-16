import React, { Component } from "react";
import Skeleton from "react-loading-skeleton";

export default class LoadingPost extends Component {
  render() {
    return (
      <div
        className={`my-5 p-5 bg-white shadow overflow-hidden flex-grow ${
          this.props.customClass || ""
        }`}
      >
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <Skeleton circle={true} width={40} height={40} />
          </div>
          <div className="ml-4 mt-3">
            <div className="text-sm font-medium text-gray-900">
              <Skeleton width={100} />
            </div>
            <div className="text-sm text-gray-500">
              <Skeleton width={150} />
            </div>
          </div>
        </div>
        <div className="mt-5">
          <Skeleton height={500}/>
        </div>
      </div>
    );
  }
}
