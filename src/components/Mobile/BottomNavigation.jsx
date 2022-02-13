import React from 'react';
import {ChatIcon, HomeIcon, PlusCircleIcon, SearchIcon, UserIcon} from "@heroicons/react/outline";
import {useNavigate} from 'react-router';
import {useDispatch, useSelector} from "react-redux";
import {setShowLoginDialog, setShowSwitchToAppSuggestionDialog} from "../../store/ui";

function MobileBottomNavigation(props) {

    let navigate = useNavigate();
    let dispatch = useDispatch();

    const {auth, ui} = useSelector((state) => state);

    const {isLoggedIn, user} = auth;

    const handleHomeNavigationClick = () => {
        navigate('/')
    }

    const handleSearchNavigationClick = () => {
        dispatch(setShowSwitchToAppSuggestionDialog(true))
    }

    const handleUploadNavigationClick = () => {
        if (!isLoggedIn) {
            dispatch(setShowLoginDialog(true));
        } else {
            navigate('/upload')
        }
    }

    const handleInboxNavigationClick = () => {

        if (!isLoggedIn) {
            dispatch(setShowLoginDialog(true));
        } else {
            navigate('/inbox')
        }
    }

    const handleProfileNavigationClick = () => {
        if (!isLoggedIn) {
            dispatch(setShowLoginDialog(true));
        } else {
            navigate('/@' + user.username)
        }
    }


    return (
        <div className="bottom-navigation">
            <HomeIcon onClick={handleHomeNavigationClick} activeClassName={`active`}/>
            <SearchIcon onClick={handleSearchNavigationClick} activeClassName={`active`}/>
            <PlusCircleIcon onClick={handleUploadNavigationClick} activeClassName={`active`}/>
            <ChatIcon onClick={handleInboxNavigationClick} activeClassName={`active`}/>
            <UserIcon onClick={handleProfileNavigationClick} activeClassName={`active`}/>
        </div>
    );
}

export default MobileBottomNavigation;