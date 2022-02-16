import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {setShowLoginDialog} from "../../store/ui";
import Dialog from "./Dialog";
import {useNavigate} from "react-router";

function LoginDialog(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {showLoginDialog} = useSelector(({ui}) => ui)

    const navigateToLogin = () => {
        dispatch(setShowLoginDialog(false))
        navigate('/auth');
    }

    const closeDialog = () => {
        dispatch(setShowLoginDialog(false));
    }

    const primaryButton = {
        text: "Login",
        clickCallback: navigateToLogin
    }

    const secondaryButton = {
        text: "Maybe later",
        clickCallback: closeDialog
    }

    return <Dialog isVisible={showLoginDialog}
                   position={"Middle"}
                   title={`Login to Flic`}
                   description={`Login to follow flickers, like posts, comments, inbox and manage your profile`}
                   primaryButton={primaryButton}
                   secondaryButton={secondaryButton}
    />
}

export default LoginDialog;