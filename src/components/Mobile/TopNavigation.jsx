import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {useNavigate} from 'react-router';
import { setShowLoginDialog } from '../../store/ui';
import { setUserLoggedOut } from '../../store/auth';
import EmpowerverseLogo from '../../images/empowerverse.png';
import MobileSideNavigation from './SideNavigation';

function MobileTopNavigation(props) {
  let dispatch = useDispatch();
  let navigate = useNavigate();

  const { auth } = useSelector((state) => state);
  const { isLoggedIn } = auth;
  const [isActive, setIsActive] = useState('Login');
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);

  const checkLoginStatusAsync = async () => {

    return new Promise(resolve => {
      setTimeout(() => {
        resolve(isLoggedIn);
      }, 1000);
    });
  };
  const checkLoginStatus = async () => {
    try {
      const isLoggedIn = await checkLoginStatusAsync();
      setIsActive(isLoggedIn ? 'Logout' : 'Login');
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  };

  useEffect(() => {
    checkLoginStatus();
    return () => {
      // Cleanup logic, if any
    };
  }, []); 

  const handleLogoutButtonClick = () => {
      setIsActive('Login');
      dispatch(setUserLoggedOut());
      navigate('/auth');
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
          </div>
        ) : (
          <div className="logo" onClick={downloadEmpowerverse}>
            <img
              width={80}
              height={80}
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
