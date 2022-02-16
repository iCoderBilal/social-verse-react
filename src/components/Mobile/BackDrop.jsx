import React from 'react';
import {useSelector} from "react-redux";

function BackDrop(props) {

    const {
        showSwitchToAppSuggestionDialog,
        showLoginDialog,
        showHomeScreenShortcutSuggestionDialog
    } = useSelector(({ui}) => ui)

    if (showSwitchToAppSuggestionDialog || showLoginDialog || showHomeScreenShortcutSuggestionDialog) {
        return (
            <div className={`backdrop`}/>
        );
    }

    return <></>
}

export default BackDrop;