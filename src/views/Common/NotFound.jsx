import React from "react";
import LeftPaneImage from "../../components/Common/LeftPaneImage";
import HorizontalLogo from "../../components/Common/HorizontalLogo";
import {useNavigate} from "react-router";
import {useDispatch} from "react-redux";
import { setUserLoggedOut } from "../../store/auth";


function NotFound(props) {

    const navigate = useNavigate();
    let dispatch = useDispatch();

    const handleButtonClick = () => {
        navigate("/");
    }


    const handleLogoutButtonClick = () => {        
        dispatch(setUserLoggedOut());
        navigate('/auth')
    }
    return (
        <div className="not-found-container">
            <LeftPaneImage/>
            <div className="form-container">
                <form>
                    <HorizontalLogo/>
                    {/* <div className="big-message-container">
                        404<br/>Not Found
                    </div> */}
                    <div className="interaction-container">
                        <div className="form-group">
                            <button type="button" onClick={handleButtonClick}>Let's go back to home?</button>
                        </div>
                        {/* <div className="form-group">
                            <button type="button" onClick={handleLogoutButtonClick}>Logout</button>
                        </div> */}
                        <p className="copyright">
                            Empowerverse 2024
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default NotFound;
