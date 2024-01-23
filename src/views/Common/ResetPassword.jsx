import React, { useState, useEffect } from "react";
import axios from "axios";
import HorizontalLogo from "../../components/Common/HorizontalLogo";
import LeftPaneImage from "../../components/Common/LeftPaneImage";
import FlicToaster from "../../utils/FlicToaster";
import RightArrowIcon from "../../components/Common/RightArrowIcon";

function ChangePassword(props) {
    const forgotPasswordFormName = "FORGOT PASSWORD"

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
                <img src="loader.gif" alt="Empowerverse Loading Spinner"/>
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
                <input type="password" name="password" placeholder="Enter new password" required/>
            </div>
            <div className="form-group">
                <input type="text" name="password-confirm" placeholder="Confirm new password" required/>
            </div>
        </>
    }

    const getFormSubmitButton = () => {
        return <div className={`form-group ${isSubmitLoading && "loading"}`}>
            <button className={isSubmitLoading && "loading"}>Continue <RightArrowIcon/></button>
        </div>
    }


    return (
        <div className="auth-container">
            <LeftPaneImage/>
            <div className="form-container">
                <form onSubmit={handleFormSubmit}>
                    {loader ? getStatusResponse() : ""} 
                    <HorizontalLogo/>
                    <div className="heading-container">
                        {forgotPasswordFormName}
                    </div>
                    <div className="interaction-container">
                        {getPasswordFormFieldsJsx()}
                        {getFormSubmitButton()}
                        <p className="legal-links-container">
                            By continuing you accept our{" "}
                            <span>Terms of Use</span>{" "}
                            and{" "}
                            <span>Privacy Policy</span>
                            .
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ChangePassword;
