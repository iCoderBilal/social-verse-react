import React, { useState, useEffect } from 'react';
import {HomeIcon, SearchIcon, UserIcon} from "@heroicons/react/outline";
import {useNavigate} from 'react-router';
import {useDispatch, useSelector} from "react-redux";
import {setShowLoginDialog, setShowSwitchToAppSuggestionDialog} from "../../store/ui";
import { setUserLoggedOut } from "../../store/auth";

function MobileSideNavigation({ isOpen, onClose }) {

    let navigate = useNavigate();
    let dispatch = useDispatch();

    const [active, setActive] = useState('home');

    const {auth} = useSelector((state) => state);

    const {isLoggedIn} = auth;

    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
        setIsMobileView(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);

        return () => {
        window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleHomeNavigationClick = () => {
        setActive("home");
        onClose();
        navigate('/');
    }

    const handleSearchNavigationClick = () => {
        setActive("search");
        if (!isLoggedIn) {
            dispatch(setShowLoginDialog(true));
        } else {
            onClose();
            navigate('/search');
        }
    }

    const handleProfileNavigationClick = () => {
        setActive("profile");
        onClose();
        dispatch(setShowSwitchToAppSuggestionDialog(true))
        // if (!isLoggedIn) {
        //     dispatch(setShowLoginDialog(true));
        // } else {
        //     navigate('/@' + user.username)
        // }
    }

    const handleLogoutButtonClick = () => {        
        dispatch(setUserLoggedOut());
        navigate('/auth')
    }

    return (
        <div className={`side-navigation ${isOpen ? 'open' : ''}`}>
            <div className={`nav-item ${active === 'home' ? 'active' : ''}`} onClick={handleHomeNavigationClick}>
                <HomeIcon />
                <p className="nav-text">Home</p>
            </div>
            <div className={`nav-item ${active === 'search' ? 'active' : ''}`} onClick={handleSearchNavigationClick}>
                <SearchIcon />
                <p className="nav-text">Search</p>
            </div>
            <div className={`nav-item ${active === 'profile' ? 'active' : ''}`} onClick={handleProfileNavigationClick}>
                <UserIcon />
                <p className="nav-text">Profile</p>
            </div>
            {isMobileView ? (
                <div className="nav-item logout ">
                    <button type="button" class="button-logout" onClick={handleLogoutButtonClick}>Logout</button>
                </div>
            ) : null}
        </div>
    );
}

export default MobileSideNavigation;