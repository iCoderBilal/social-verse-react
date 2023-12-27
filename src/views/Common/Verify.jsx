import React, {useEffect, useState} from "react";
import axios from "axios";
import FlicToaster from "../../utils/FlicToaster";
import LeftPaneImage from "../../components/Common/LeftPaneImage";
import HorizontalLogo from "../../components/Common/HorizontalLogo";
import {useNavigate} from "react-router";


function Verify(props) {

    const [emailVerified, setEmailVerified] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const pageURL = new URL(window.location.href);
        let formData = new FormData();
        formData.append("username", pageURL.searchParams.get("username") || "");
        formData.append("code", pageURL.searchParams.get("code") || "");
        axios.post("/user/verify", formData).then((response) => {
            if (response.data.status === "success") {
                FlicToaster.success(response.data.message);
                setEmailVerified(true);
            } else {
                FlicToaster.error(response.data.message);
                setEmailVerified(false);
            }
        });

        window.gtag('event', 'view', {
            'event_category': 'page',
            'event_label': 'Verification Page'
        });

    }, []);

    const getVerificationStatusJsx = () => {
        if (emailVerified === true) {
            return "Email Verified 😊"
        }
        if (emailVerified === false) {
            return "Failed 😔"
        }
        return <>
            <img src="loader.gif" alt="Empowerverse Loading Spinner"/>
            <br/>
            Checking...
        </>
    }

    const handleButtonClick = () => {
        navigate("/");
    }

    return (
        <div className="verify-container">
            <LeftPaneImage/>
            <div className="form-container">
                <form>
                    <HorizontalLogo/>
                    <div className="big-message-container">
                        {getVerificationStatusJsx()}
                    </div>
                    <div className="interaction-container">
                        <div className="form-group">
                            <button type="button" onClick={handleButtonClick}>Let's go back to home?</button>
                        </div>
                        <p className="copyright">
                            Empowerverse 2023
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Verify;
