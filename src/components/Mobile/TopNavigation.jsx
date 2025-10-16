import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {useNavigate} from 'react-router';
import { setUserLoggedOut } from '../../store/auth';
import EmpowerverseLogo from '../../images/social-verse-logo.svg';
import { RxCross1 } from "react-icons/rx";
import { GiHamburgerMenu } from "react-icons/gi";


function MobileTopNavigation({setIsSideNavOpen , isSideNavOpen}) {
  let dispatch = useDispatch();
  let navigate = useNavigate();

  const { auth } = useSelector((state) => state);
  const { isLoggedIn } = auth;
  const [isActive, setIsActive] = useState('Login');
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
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
    // console.log('Clicked Download Empowerverse');
  };

  const handleMenuIconClick = () => {
    setIsSideNavOpen(!isSideNavOpen)
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
      <div className="section logo-section">
        {isMobileView ? (
          <div className="logo top-navigation-logo">
             <img
              
              src={EmpowerverseLogo}
              alt={`Empowerverse's Logo`}
            />
            <div className="menu-icon" onClick={handleMenuIconClick}>
              {isSideNavOpen ? <RxCross1 /> :   <GiHamburgerMenu/>}
            </div>
          
          </div>
        ) : (
          <div className="logo" onClick={downloadEmpowerverse}>
            <img
              width={215}
              src={EmpowerverseLogo}
              alt={`Empowerverse's Logo`}
            />
          </div>
        )}
      </div>
      <div className="section button-section">
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
    </div>
  );
}

export default MobileTopNavigation;
