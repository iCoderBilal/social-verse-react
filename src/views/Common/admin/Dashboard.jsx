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
import { FaTh, FaList } from 'react-icons/fa';
import axios from 'axios'; // Import axios for API calls

function Dashboard() {
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const { data, isLoading } = useAdminDataLoader();
  const [selectedComponent, setSelectedComponent] = useState('');
  const [view, setView] = useState('grid');
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true); // State for loading projects

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('/projects/user/get');
        if (response.data.status === 'success') {
          setProjects(response.data.projects);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, []); // Fetch projects on component mount

  const handleNavigationClick = () => {
    setIsSideNavOpen(false);
  };

  const handleSelectChange = (event) => {
    setSelectedComponent(event.target.value);
  };

  const toggleView = (newView) => {
    setView(newView);
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
                <option value="Projects">Projects</option>
                <option value="Users">Users</option>
                <option value="Content">Content</option>
                <option value="Notifications">Notifications & Messaging</option>
                <option value="Wallets">Wallets</option>
                <option value="Reports">Analytics & Reports</option>
                <option value="Subscriptions">Subscriptions & Payments</option>
              </select>

              {selectedComponent === 'Projects' && (
                <div className="toggle-container">
                  <div className="view-toggle">
                    {view === 'grid' ? (
                      <span onClick={() => toggleView('list')} className="icon">
                        <FaList />
                      </span>
                    ) : (
                      <span onClick={() => toggleView('grid')} className="icon">
                        <FaTh />
                      </span>
                    )}
                  </div>
                </div>
              )}

              {!isLoading ? data.data && 
                <div>
                  {(selectedComponent === '' || selectedComponent === 'Users') && <UserAnalytics data={data} />}
                  {selectedComponent === 'Projects' && (
                    <div className="project-list-container">
                      {loadingProjects ? ( // Show loading state for projects
                        <Loader />
                      ) : (
                        <div className={`projects ${view}`}>
                          {projects.map(project => (
                            <div key={project.id} className="project-card">
                              <img 
                                src={project.logo_url} 
                                alt={project.name} 
                                className="project-logo" 
                              />
                              <h3 className="project-name">{project.name}</h3>
                              {view === 'list' && (
                                <p className="project-description">{project.description}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
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
