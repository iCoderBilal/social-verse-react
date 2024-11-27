import React from "react";
import Widgets from "../../../components/Common/Widgest";
import { DoughnutChart } from "../../../components/Common/Chart";
import { WalletIcon } from "@heroicons/react/24/outline";

function WalletAnalytics({ data }) {
    return (
        <div className="dashboard">
            <div className="grid-container">
                <Widgets
                    title={"Wallets"}
                    num={data.data?.totalWallets || 0}
                    trand={data.last30daysData?.totalWallets || 0}
                    color={"#6b0092"}
                    Icon={WalletIcon}
                />

                <Widgets
                    title={"Wallets on Solana"}
                    num={data.data?.totalWalletOnSolana}
                    trand={data.last30daysData?.totalWalletOnSolana}
                    color={"#6b0092"}
                    Icon={WalletIcon}
                />

                <Widgets
                    title={"Wallets on EVM"}
                    num={data.data?.totalWalletOnEVM}
                    trand={data.last30daysData?.totalWalletOnEVM}
                    color={"#6b0092"}
                    Icon={WalletIcon}
                />

                <Widgets
                    title={"Wallets on Polygon"}
                    num={data.data?.totalWalletOnPolygon}
                    trand={data.last30daysData?.totalWalletOnPolygon}
                    color={"#6b0092"}
                    Icon={WalletIcon}
                />

                <div className="grid-item row-2">
                    <div className="grid-item-title">
                        Wallet Status
                    </div>
                    <div className="doughnut-chart">
                        <DoughnutChart
                            labels={['Solana', 'Etherium', 'Polygon']}
                            color={["#42d4f5", "#5461a8", '#6b23de']}
                            data={[
                                data.data.totalWalletOnSolana,
                                data.data.totalWalletOnEVM,
                                data.data.totalWalletOnEVM
                            ]}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WalletAnalytics;