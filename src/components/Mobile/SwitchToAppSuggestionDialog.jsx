import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {setShowSwitchToAppSuggestionDialog} from "../../store/ui";
import Dialog from "./Dialog";

function SwitchToAppSuggestionDialog(props) {

    const dispatch = useDispatch();
    const {showSwitchToAppSuggestionDialog} = useSelector(({ui}) => ui)

    const downloadFlic = () => {
        console.log("Clicked Download Flic");
    }

    const closeDialog = () => {
        dispatch(setShowSwitchToAppSuggestionDialog(false));
    }

    const primaryButton = {
        text: "Open Flic",
        clickCallback: downloadFlic
    }

    const secondaryButton = {
        text: "Not now",
        clickCallback: closeDialog
    }

    return <Dialog isVisible={showSwitchToAppSuggestionDialog}
                   position={"Bottom"}
                   title={`Get the full experience on the app`}
                   description={`Follow your favorite accounts, explore new trends, and create your own videos`}
                   primaryButton={primaryButton}
                   secondaryButton={secondaryButton}
    />
}

export default SwitchToAppSuggestionDialog;