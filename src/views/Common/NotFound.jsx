import React from "react";
import LeftPaneImage from "../../components/Common/LeftPaneImage";
import HorizontalLogo from "../../components/Common/HorizontalLogo";
import {useNavigate} from "react-router";


function NotFound(props) {

    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate("/");
    }

    return (
        <div className="not-found-container">
            <LeftPaneImage/>
            <div className="form-container">
                <form>
                    <HorizontalLogo/>
                    <div className="big-message-container">
                        404<br/>Not Found
                    </div>
                    <div className="interaction-container">
                        <div className="form-group">
                            <button type="button" onClick={handleButtonClick}>Let's go back to home?</button>
                        </div>
                        <p className="copyright">
                            Flic 2022
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default NotFound;
