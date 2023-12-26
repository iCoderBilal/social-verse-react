import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { setShowLoginDialog } from '../../store/ui';
import { setUserLoggedOut } from '../../store/auth';
import EmpowerverseLogo from '../../images/empowerverse.png';
import MobileSideNavigation from './SideNavigation';

function MobileTopNavigation(props) {
  let navigate = useNavigate();
  let dispatch = useDispatch();

  const { auth } = useSelector((state) => state);
  const { isLoggedIn } = auth;
  const [isActive, setIsActive] = useState('Logout');
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);

  const handleLogoutButtonClick = () => {
    if (!isLoggedIn) {
      setIsActive('Login');
      dispatch(setShowLoginDialog(true));
    } else {
      dispatch(setUserLoggedOut());
      setIsActive('Login');
      navigate('/auth');
    }
  };

  const downloadEmpowerverse = () => {
    window.open('https://socialverse.page.link/empowerverse', '_blank');
    console.log('Clicked Download Empowerverse');
  };

  const handleMenuIconClick = () => {
    setIsSideNavOpen(!isSideNavOpen);
  };

  const handleNavigationClick = () => {
    setIsSideNavOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="top-navigation">
      <div className="section">
        {isMobileView ? (
          <div className="logo">
            <div className="menu-icon" onClick={handleMenuIconClick}>
              &#9776;
            </div>
            {/* <div className="logo" onClick={downloadEmpowerverse}>
                <p className="header-logo">Empowerverse</p>
            </div> */}
          </div>
        ) : (
          <div className="logo" onClick={downloadEmpowerverse}>
            <img
              width={50}
              height={50}
              src={EmpowerverseLogo}
              alt={`Empowerverse's Logo`}
            />
          </div>
        )}
      </div>
      <div className="section">
        {isMobileView ? null : (
          <div className="header-btn">
            <button
              className="login-btn"
              type="button"
              onClick={handleLogoutButtonClick}
            >
              {isActive}
            </button>
          </div>
        )}
      </div>
      {isMobileView ? null : (
        <MobileSideNavigation
          isOpen={isSideNavOpen}
          onClose={handleNavigationClick}
        />
        )}
      {isSideNavOpen && <MobileSideNavigation isOpen={isSideNavOpen} onClose={handleNavigationClick} />}
    </div>
  );
}

export default MobileTopNavigation;
