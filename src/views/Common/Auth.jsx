import React, {useState} from "react";
import axios from "axios";
import HorizontalLogo from "../../components/Common/HorizontalLogo";
import {useDispatch, useSelector} from "react-redux";
import LeftPaneImage from "../../components/Common/LeftPaneImage";
import FlicToaster from "../../utils/FlicToaster";
import {setLocalStorageUser} from "../../utils/UserLocalStorageHelper";
import RightArrowIcon from "../../components/Common/RightArrowIcon";
import {Navigate, useNavigate} from "react-router-dom";
import MobileTopNavigation from "../../components/Mobile/TopNavigation";
import MobileSideNavigation from "../../components/Mobile/SideNavigation";

function Auth(props) {

    const loginFormName = 'LOGIN';
    const registerFormName = 'REGISTER';
    const forgotPasswordFormName = "FORGOT PASSWORD"
    let navigate = useNavigate();
    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
    const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  
    const dispatch = useDispatch();
    const {user , isLoggedIn} = useSelector(state => state.auth);

    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [formName, setFormName] = useState(loginFormName);
    const [changeStatus, setChangeStatus] = useState(null);
    const [loader, setLoader] = useState(false);

    if (isLoggedIn) {
       <Navigate to={'/admin/dashboard'}/>
    }

    const handleLoginFormSubmit = (formData) => {
        setIsSubmitLoading(true);
        axios
            .post("/user/login", formData)
            .then((response) => {
                if (response.data.status === "success") {
                    FlicToaster.success("Login success! :D");
                    setLocalStorageUser(response.data);
                    window.location.replace(window.location.href = "/admin/dashboard");
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

    const handleForgotPasswordFormSubmit = (formData) => {
        setIsSubmitLoading(true);
        axios
            .post("/auth/credentials/reset/start", formData)
            .then((response) => {
                if (response.data.status === "success") {
                    FlicToaster.success("A reset-link is sent to your email address, please check your inbox");
                    setChangeStatus(true);
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
                setLoader(false);
                setIsSubmitLoading(false);
            });
    }

    const handleFormSubmit = (formSubmitEvent) => {
        formSubmitEvent.preventDefault();
        const formData = new FormData(formSubmitEvent.currentTarget);
        setLoader(true);
        switch (formName) {
            case loginFormName:
                handleLoginFormSubmit(formData)
                break;
            case registerFormName:
                handleRegisterFormSubmit(formData)
                break;
            //Todo: Add Forgot Password
            case forgotPasswordFormName:
                handleForgotPasswordFormSubmit(formData)
            default:
        }
    }

    const getPasswordFormFieldsJsx = () => {
        return <>
            <div className="form-group">
                <input type="text" name="mixed" placeholder="Enter your username / email" required/>
            </div>
        </>
    }

    const getStatusResponse = () => {
        if (changeStatus === true && formName === forgotPasswordFormName) {
            return "A reset-link is sent to your email address, please check your inbox";
        }
        if (changeStatus === false && formName === forgotPasswordFormName) {
            return "Failed 😔";
        }
        return (
            <>
                <img src="loader.gif" alt="Empowerverse Loading Spinner"/>
            </>
        );
    };

    const getFormFieldsJsx = () => {
        if (formName === loginFormName) {
            return getLoginFormFieldsJsx();
        }
        if (formName === registerFormName) {
            return getRegisterFormFieldsJsx();
        }
        return getPasswordFormFieldsJsx();
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

            <div className="forgot-password-container">
                <span onClick={() => setFormName(forgotPasswordFormName)}>Forgot your password?</span>
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
  
    const handleNavigationClick = () => {
        setIsSideNavOpen(false);
      };
    
    return (

        <>
     <MobileTopNavigation
        isSideNavOpen={isSideNavOpen}
        setIsSideNavOpen={setIsSideNavOpen}
      />
           <div className="container">
      <div style={{display : `${isSideNavOpen ? 'block' : 'none'} `}} onClick={()=> setIsSideNavOpen(false)} className="overlay"></div>
        <aside className="side-bar">
            <MobileSideNavigation
              isOpen={isSideNavOpen}
              onClose={handleNavigationClick}
            />
        </aside>
        <main className="main-container">
        <div className="auth-container">
            <LeftPaneImage/>
            <div className="form-container">
                <form onSubmit={handleFormSubmit}> 
                    {loader ? getStatusResponse() : ""}
                    <HorizontalLogo/>
                    <div className="heading-container">
                        <h2>{formName.toLowerCase()}</h2>
                        {getHeadingContainerJsx()}
                    </div>
                    <div className="interaction-container">
                        {getFormFieldsJsx()}
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
        </main>
      </div>
     
        </>

    );
}


export default Auth;