import React, {useState} from "react";
import axios from "axios";
import HorizontalLogo from "../../components/Common/HorizontalLogo";
import {useDispatch, useSelector} from "react-redux";
import LeftPaneImage from "../../components/Common/LeftPaneImage";
import FlicToaster from "../../utils/FlicToaster";
import {setLocalStorageUser} from "../../utils/UserLocalStorageHelper";
import RightArrowIcon from "../../components/Common/RightArrowIcon";
import {Navigate} from "react-router-dom";

function Auth(props) {

    const loginFormName = 'LOGIN';
    const registerFormName = 'REGISTER';

    const dispatch = useDispatch();
    const {auth} = useSelector(state => state);

    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [formName, setFormName] = useState(loginFormName);

    if (auth.isLoggedIn) {
        return <Navigate to="/"/>
    }

    const handleLoginFormSubmit = (formData) => {
        setIsSubmitLoading(true);
        axios
            .post("/user/login", formData)
            .then((response) => {
                if (response.data.status === "success") {
                    FlicToaster.success("Login success! :D");
                    setLocalStorageUser(response.data);
                    window.location.replace(window.location.origin);
                } else {
                    FlicToaster.error(response.data.message);
                }
            })
            .catch((response) => {
                FlicToaster.error("It's not you, it's us. We are sorry, something went wrong on our end.");
            })
            .finally(() => {
                setIsSubmitLoading(false);
            });
    }

    const handleRegisterFormSubmit = (formData) => {
        setIsSubmitLoading(true);
        axios
            .post("/user/create", formData)
            .then((response) => {
                if (response.data.status === "success") {
                    FlicToaster.success(response.data.message);
                    setFormName(registerFormName);
                } else {
                    FlicToaster.error(response.data.message);
                }
            })
            .catch((response) => {
                FlicToaster.error("We are sorry. Something went wrong.");
            })
            .finally(() => {
                setIsSubmitLoading(false);
            });
    }

    const handleFormSubmit = (formSubmitEvent) => {
        formSubmitEvent.preventDefault();
        const formData = new FormData(formSubmitEvent.currentTarget);
        switch (formName) {
            case loginFormName:
                handleLoginFormSubmit(formData)
                break;
            case registerFormName:
                handleRegisterFormSubmit(formData)
                break;
            //Todo: Add Forgot Password
            default:
        }
    }

    const getFormFieldsJsx = () => {
        if (formName === loginFormName) {
            return getLoginFormFieldsJsx();
        }
        return getRegisterFormFieldsJsx();
    }

    const getHeadingContainerJsx = () => {
        if (formName === loginFormName) {
            return <p>New to Empowerverse?
                <span onClick={() => setFormName(registerFormName)}>Sign Up</span>
            </p>
        }
        return <p>Already a member?
            <span onClick={() => setFormName(loginFormName)}>Log in</span>
        </p>
    }

    const getLoginFormFieldsJsx = () => {
        return <>
            <div className="form-group">
                <input type="text" name="mixed" placeholder="Your email or username" required/>
            </div>
            <div className="form-group">
                <input type="password" name="password" placeholder="Your password" required/>
            </div>
        </>
    }

    const getRegisterFormFieldsJsx = () => {
        return <>
            <div className="form-group many">
                <input type="text" name="first_name" placeholder="First name"/>
                <input type="text" name="last_name" placeholder="Last name"/>
            </div>
            <div className="form-group">
                <input type="text" name="username" placeholder="Choose username"/>
            </div>
            <div className="form-group">
                <input type="email" name="email" placeholder="Email"/>
            </div>
            <div className="form-group">
                <input type="password" name="password" placeholder="Password"/>
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
                    <HorizontalLogo/>
                    <div className="heading-container">
                        <h2>{formName.toLowerCase()}</h2>
                        {getHeadingContainerJsx()}
                    </div>
                    <div className="interaction-container">
                        {getFormFieldsJsx()}
                        {getFormSubmitButton()}
                        <div className="forgot-password-container">
                            <span>Forgot your password?</span>
                        </div>
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


export default Auth;