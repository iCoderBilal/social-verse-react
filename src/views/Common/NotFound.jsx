import React, { useState } from "react";
import LeftPaneImage from "../../components/Common/LeftPaneImage";
import HorizontalLogo from "../../components/Common/HorizontalLogo";
import {useNavigate} from "react-router";
import {useDispatch} from "react-redux";
import { setUserLoggedOut } from "../../store/auth";
import MobileTopNavigation from "../../components/Mobile/TopNavigation";
import MobileSideNavigation from "../../components/Mobile/SideNavigation";


function NotFound(props) {

    const navigate = useNavigate();
    let dispatch = useDispatch();
    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
    const [isSideNavOpen, setIsSideNavOpen] = useState(false);
    const handleButtonClick = () => {
        navigate("/");
    }


    const handleLogoutButtonClick = () => {        
        dispatch(setUserLoggedOut());
        navigate('/auth')
    }
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
          <MobileSideNavigation
            isOpen={isSideNavOpen}
            onClose={handleNavigationClick}
          />
        </aside>
        <main className="main-container">
        <div className="not-found-container">
            <LeftPaneImage/>
            <div className="form-container">
                <form>
                    <HorizontalLogo/>
                    {/* <div className="big-message-container">
                        404<br/>Not Found
                    </div> */}
                    <div className="interaction-container">
                        <div className="form-group">
                            <button type="button" onClick={handleButtonClick}>Let's go back to home?</button>
                        </div>
                        {/* <div className="form-group">
                            <button type="button" onClick={handleLogoutButtonClick}>Logout</button>
                        </div> */}
                        <p className="copyright">
                            Empowerverse 2024
                        </p>
                    </div>
                </form>
            </div>
        </div>
        </main>
      </div>
      
        
        </>
   
    );
}

export default NotFound;
