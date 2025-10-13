import React, { useState, useEffect } from "react";
import axios from "axios";
import HorizontalLogo from "../../components/Common/HorizontalLogo";
import LeftPaneImage from "../../components/Common/LeftPaneImage";
import FlicToaster from "../../utils/FlicToaster";
import RightArrowIcon from "../../components/Common/RightArrowIcon";

function ChangePassword(props) {
    const forgotPasswordFormName = "Welcome Back!"

    const [changeStatus, setChangeStatus] = useState(null);
    const [loader, setLoader] = useState(false);
    const [token, setToken] = useState("");

    const [isSubmitLoading, setIsSubmitLoading] = useState(false);

    useEffect(() => {
        const pageURL = new URL(window.location.href);
        setToken(pageURL.searchParams.get("token") || "");

        window.gtag('event', 'view', {
            'event_category': 'page',
            'event_label': 'password_change'
        });
    }, []);
    

    const handleForgotPasswordFormSubmit = (formData) => {
        setIsSubmitLoading(true);
        axios
            .post("/auth/credentials/reset/finish", formData)
            .then((response) => {
                if (response.data.status === "success") {
                    FlicToaster.success("Password change successfully 😊");
                    setChangeStatus(true);
                    getStatusResponse()
                } else {
                    FlicToaster.error(response.data.message);
                }
            })
            .catch((response) => {
                FlicToaster.error("It's not you, it's us. We are sorry, something went wrong on our end.");
            })
            .finally(() => {
                setLoader(false);
                setIsSubmitLoading(false);
            });
    }

    const getStatusResponse = () => {
        if (changeStatus === true) {
            return "Password change successfully 😊";
        }
        if (changeStatus === false) {
            return "Failed 😔";
        }
        return (
            <>
                <img className="hidden" src="loader.gif" alt="Empowerverse Loading Spinner"/>
                <br/>
                Checking...
            </>
        );
    };

    const handleFormSubmit = (formSubmitEvent) => {
        formSubmitEvent.preventDefault();
        const formData = new FormData(formSubmitEvent.currentTarget);
            setLoader(true);
            handleForgotPasswordFormSubmit(formData)
    }

    const getPasswordFormFieldsJsx = () => {
        return <>
            <div className="form-group hidden">
                <input type="text" name="token" value={token} hidden required/>
            </div>
            <div className="form-group">
                <input type="password" name="password" placeholder="Enter your new password" required/>
            </div>
            <div className="form-group">
                <input type="text" name="password-confirm" placeholder="Re-enter your new password" required/>
            </div>
        </>
    }

    const getFormSubmitButton = () => {
        return <div className={`form-group ${isSubmitLoading && "loading"}`}>
            <button style={{backgroundColor:"#8223F8 !important", borderColor:"#8223F8 !important", borderRadius:"10px !important"}} className={`reset-password-button ${isSubmitLoading && "loading"}`}>Update Password</button>
        </div>
    }


    return (
        <div className="auth-container reset-password">
            <LeftPaneImage/>
            <div className="form-container">
                <form onSubmit={handleFormSubmit}>
                    {loader ? getStatusResponse() : ""} 
                    <HorizontalLogo/>
                    <div className="heading-container">
                        <h2>{forgotPasswordFormName}</h2>
                        <h4 style={{marginTop:"1.3rem", fontSize:"1.3rem", fontWeight:"400"}}>Set a new password</h4>
                    </div>
                    <div className="interaction-container">
                        {getPasswordFormFieldsJsx()}
                        {getFormSubmitButton()}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ChangePassword;
