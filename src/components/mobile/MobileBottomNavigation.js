import React from 'react';
import {ChatIcon, PlusCircleIcon, SearchIcon, UserIcon, HomeIcon} from "@heroicons/react/outline";
import {Link, NavLink} from "react-router-dom";

function MobileBottomNavigation(props) {

    const handleBottomNavigationClick = () => {
        props.openDialog();

        window.gtag('event', 'touch', {
            'event_category' : 'interactions',
            'event_label' : 'bottom navigation',
        });

    }

    return (
        <div className="bottom-navigation">
            <NavLink exact to="/" activeClassName={`active`}>
                <HomeIcon/>
            </NavLink>
            <SearchIcon onClick={()=>handleBottomNavigationClick()}/>
            <NavLink exact to="/upload" activeClassName={`active`}>
                <PlusCircleIcon/>
            </NavLink>
            <ChatIcon onClick={()=>handleBottomNavigationClick()}/>
            <UserIcon onClick={()=>handleBottomNavigationClick()}/>
        </div>
    );
}

export default MobileBottomNavigation;