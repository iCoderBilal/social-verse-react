import React, { useEffect, useState } from "react";
import Loader from "../../../components/Common/Loader";
import MobileTopNavigation from "../../../components/Mobile/TopNavigation";
import MobileSideNavigation from "../../../components/Mobile/SideNavigation";
import useAdminDataLoader from "../../../utils/hooks/useAdminDataLoader";
import UserAnalytics from "./UserAnalytics";
import SubscriptionAnalytics from "./SubscriptionAnalytics";
import ReportAnalytics from "./ReportAnalytics";
import NotificationAnalytics from "./NotificationAnalytics";
import ContentAnalytics from "./ContentAnalytics";
import WalletAnalytics from "./WalletAnalytics";

function Dashboard() {
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const { data, isLoading } = useAdminDataLoader();
  const [selectedComponent, setSelectedComponent] = useState('');

  useEffect(() => {

  }, [isSideNavOpen, isMobileView])


  const handleNavigationClick = () => {
    setIsSideNavOpen(false);
  };

  const handleSelectChange = (event) => {
    setSelectedComponent(event.target.value);
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
          <MobileSideNavigation
            isOpen={isSideNavOpen}
            onClose={handleNavigationClick}
          />
        </aside>
        <main className="main-container">
          <div className="dashboard-container">
            <div>
              <select onChange={handleSelectChange} value={selectedComponent} className="select">
                <option value="">Navigate to Section</option>
                <option value="Users">Users</option>
                <option value="Content">Content</option>
                <option value="Notifications">Notifications & Messaging</option>
                <option value="Wallets">Wallets</option>
                <option value="Reports">Analytics & Reports</option>
                <option value="Subscriptions">Subscriptions & Payments</option>
              </select>

            {!isLoading ? data.data && 
              <div>
                {(selectedComponent === '' || selectedComponent === 'Users') && <UserAnalytics data={data} />}
                {selectedComponent === 'Content' && <ContentAnalytics data={data} />}
                {selectedComponent === 'Subscriptions' && <SubscriptionAnalytics data={data} />}
                {selectedComponent === 'Notifications' && <NotificationAnalytics data={data} />}
                {selectedComponent === 'Reports' && <ReportAnalytics data={data} />}
                {selectedComponent === 'Wallets' && <WalletAnalytics data={data} />}
              </div>
                : (
            <Loader />
          )}
            </div>
          </div>
        </main>
      </div>

    </>

  );
}

export default Dashboard;
