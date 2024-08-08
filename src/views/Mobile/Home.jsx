import React, { useEffect, useState } from "react";
import Feed from "../../components/Mobile/Feed";
import MobileTopNavigation from "../../components/Mobile/TopNavigation";
import { useDispatch } from "react-redux";
import { setUserLoggedOut } from "../../store/auth";
import { useNavigate } from "react-router";
import MobileSideNavigation from "../../components/Mobile/SideNavigation";

function Home(props) {
  let dispatch = useDispatch();
  let navigate = useNavigate();
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);

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
      <div style={{display : `${isSideNavOpen ? 'block' : 'none'} `}} onClick={()=> setIsSideNavOpen(false)} className="overlay"></div>
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
          <Feed />
        </main>
      </div>
    </>
  );
}

export default Home;
