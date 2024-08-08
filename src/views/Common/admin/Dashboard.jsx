import React, { useEffect, useState } from "react";
import {
  BarChart,
  PieChart,
} from "../../../components/Common/Chart";
import Loader from "../../../components/Common/Loader";
import Widgets from "../../../components/Common/Widgest";
import MobileTopNavigation from "../../../components/Mobile/TopNavigation";
import MobileSideNavigation from "../../../components/Mobile/SideNavigation";
import useAdminDataLoader from "../../../utils/hooks/useAdminDataLoader";

function Dashboard() {
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const { data, isLoading } = useAdminDataLoader();

  const percentageFinder = (last30daysData, totalData) => {
    return (last30daysData / (totalData - last30daysData)) * 100;
  }

  useEffect(() => {

  }, [isSideNavOpen, isMobileView])


  const handleNavigationClick = () => {
    setIsSideNavOpen(false);
  };
  return (
    <>
      <MobileTopNavigation
        isSideNavOpen={isSideNavOpen}
        setIsSideNavOpen={setIsSideNavOpen}
      />
      <div className="container">
        <div style={{ display: `${isSideNavOpen ? 'block' : 'none'} ` }} onClick={() => setIsSideNavOpen(false)} className="overlay"></div>
        <aside className="side-bar">
          {isMobileView ? null : (
            <MobileSideNavigation
              isOpen={isSideNavOpen}
              onClose={handleNavigationClick}
            />
          )}
          {isSideNavOpen && (
            <MobileSideNavigation
              isOpen={isSideNavOpen}
              onClose={handleNavigationClick}
            />
          )}
        </aside>
        <main className="main-container">
          <div className="dashboard-container">
            {!isLoading ? data.data && (
              <div className="dashboard">
                <div className="widget-container">
                  <Widgets
                    title={"Users"}
                    num={data.data.totalUser}
                    percentage={percentageFinder(data.last30daysData.totalUser, data.data.totalUser)}
                    trand={data.last30daysData.totalUser}
                    color={"#6b0092 "}
                  />
                  <Widgets
                    title={"Views"}
                    num={data.data.totalViews}
                    percentage={percentageFinder(data.last30daysData.totalViews, data.data.totalViews)}
                    trand={data.last30daysData.totalViews}
                    color={"#6b0092 "}
                  />
                  <Widgets
                    title={"Post"}
                    num={data.data.totalPosts}
                    percentage={percentageFinder(data.last30daysData.totalPosts, data.data.totalPosts)}
                    trand={data.last30daysData.totalPosts}
                    color={"#6b0092 "}
                  />
                  <Widgets
                    title={"Likes"}
                    num={data.data.totalLikes}
                    percentage={percentageFinder(data.last30daysData.totalLikes, data.data.totalLikes)}
                    trand={data.last30daysData.totalLikes}
                    color={"#6b0092 "}
                  />
                </div>
                <div className="graph-container">
                  <div className="bar-chart">
                    <h2 className="bar-title">Posts Overview</h2>
                    <BarChart
                      labels={["Comments", "Likes", "Exit Count", "Share"]}
                      label={"count"}
                      data={[
                        data.data.totalComments,
                        data.data.totalLikes,
                        data.data.totalPostExitCount,
                        data.data.totalPostShares
                      ]}
                    />
                  </div>
                  <div className="pie-chart">
                    <h2 className="pie-title">Wallets</h2>
                    {data && (
                      <PieChart
                        labels={data.data.totalChains}
                        color={["#a066c2", "#4b006d", "#6b0092 "]}
                        data={[
                          data.data.totalWalletOnSolana,
                          data.data.totalWalletOnEVM,
                          data.data.totalWalletOnEVM,
                        ]}
                      />
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <Loader />
            )}
          </div>
        </main>
      </div>

    </>

  );
}

export default Dashboard;
