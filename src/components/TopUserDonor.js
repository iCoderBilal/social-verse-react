import React from "react";

function TopUserDonor(props) {
  return (
    <div className="p-4 px-6 bg-white flex">
      <div className="mr-2">
        <img
          className="inline-block h-12 w-12 rounded-full"
          src={props.donor.picture_url}
        ></img>
      </div>
      <div>
        <div className="text-sm font-medium text-gray-900">
          {props.donor.first_name} {props.donor.last_name}
        </div>
        <div className="text-sm text-gray-500 flex items-center">
          Shelter Donated: {props.donor.total_shelter_donated}{" "}
          <img
            src="https://shelter-cdn.nyc3.digitaloceanspaces.com/public/coin_logo%20x64.png"
            className="ml-2 h-4"
          ></img>
        </div>
      </div>
    </div>
  );
}

export default TopUserDonor;
