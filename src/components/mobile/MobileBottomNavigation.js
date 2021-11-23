import React from 'react';
import {HomeIcon} from "@heroicons/react/solid";
import {ChatIcon, PlusCircleIcon, SearchIcon, UserIcon} from "@heroicons/react/outline";

function MobileBottomNavigation(props) {

    const handleBottomNavigationClick = () => {
        props.openDialog();

        gtag('event', 'touch', {
            'event_category' : 'interactions',
            'event_label' : 'bottom navigation',
        });

    }

    return (
        <div className="bottom-navigation">
            <HomeIcon onClick={()=>handleBottomNavigationClick()}/>
            <SearchIcon onClick={()=>handleBottomNavigationClick()}/>
            <PlusCircleIcon onClick={()=>handleBottomNavigationClick()}/>
            <ChatIcon onClick={()=>handleBottomNavigationClick()}/>
            <UserIcon onClick={()=>handleBottomNavigationClick()}/>
        </div>
    );
}

export default MobileBottomNavigation;