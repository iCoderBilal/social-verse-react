import React, { useState } from "react";
import axios from "axios";
import HorizontalLogo from "../../components/Common/HorizontalLogo";
import { useDispatch, useSelector } from "react-redux";
import LeftPaneImage from "../../components/Common/LeftPaneImage";
import FlicToaster from "../../utils/FlicToaster";
import { setLocalStorageUser } from "../../utils/UserLocalStorageHelper";
import RightArrowIcon from "../../components/Common/RightArrowIcon";
import { Navigate, useNavigate } from "react-router-dom";
import MobileTopNavigation from "../../components/Mobile/TopNavigation";
import MobileSideNavigation from "../../components/Mobile/SideNavigation";
import { signInWithPopup, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import { auth } from '../../config/firebase';

function Auth(props) {

    const loginFormName = 'Welcome Back!';
    const registerFormName = 'Create An Account';
    const forgotPasswordFormName = "FORGOT PASSWORD"
    let navigate = useNavigate();
    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
    const [isSideNavOpen, setIsSideNavOpen] = useState(false);

    const dispatch = useDispatch();
    const { user, isLoggedIn } = useSelector(state => state.auth);

    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [formName, setFormName] = useState(loginFormName);
    const [changeStatus, setChangeStatus] = useState(null);
    const [loader, setLoader] = useState(false);
    const [signupStep, setSignupStep] = useState(1);
    const [signupData, setSignupData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        password: ''
    });

    if (isLoggedIn) {
        <Navigate to={'/admin/dashboard'} />
    }

    const handleLoginFormSubmit = (formData) => {
        setIsSubmitLoading(true);
        axios
            .post("/user/login", formData)
            .then((response) => {
                if (response.data.status === "success") {
                    FlicToaster.success("Login success! :D");
                    setLocalStorageUser(response.data);
                    window.location.replace("/profile");
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
                    setFormName(loginFormName);
                    setSignupStep(1);
                    setSignupData({
                        first_name: '',
                        last_name: '',
                        username: '',
                        email: '',
                        password: ''
                    });
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

    const handleSignupStep1Continue = (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget.closest('form'));
        
        // Validate step 1 fields
        const firstName = formData.get('first_name');
        const lastName = formData.get('last_name');
        const username = formData.get('username');
        
        if (!firstName || !lastName || !username) {
            FlicToaster.error("Please fill in all fields");
            return;
        }
        
        // Save step 1 data and clear step 2 fields
        setSignupData({
            first_name: firstName,
            last_name: lastName,
            username: username,
            email: '',
            password: ''
        });
        
        // Move to step 2
        setSignupStep(2);
    }

    const handleFormSubmit = (formSubmitEvent) => {
        formSubmitEvent.preventDefault();
        const formData = new FormData(formSubmitEvent.currentTarget);
        
        // For register form in step 2, add step 1 data
        if (formName === registerFormName && signupStep === 2) {
            formData.set('first_name', signupData.first_name);
            formData.set('last_name', signupData.last_name);
            formData.set('username', signupData.username);
        }
        
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
                <input type="text" name="mixed" placeholder="Enter your username or email address" required />
            </div>
        </>
    }

    const getStatusResponse = () => {
        if (changeStatus === true && formName === forgotPasswordFormName) {
            return "A reset-link is sent to your email address!";
        }
        if (changeStatus === false && formName === forgotPasswordFormName) {
            return "Failed 😔";
        }
        return (
            <>
                <img style={{display:"none"}} src="loader.gif" alt="Socialverse Loading Spinner" />
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
            return <p>Don't have an account? 
                <span onClick={() => {
                    setFormName(registerFormName);
                    setSignupStep(1);
                }} style={{color: '#8223F8', textDecoration: 'underline', cursor: 'pointer'}}> Sign Up</span>
            </p>
        }
        return <p>Already a member? 
            <span   style={{color: '#8223F8', textDecoration: 'underline', cursor: 'pointer'}} onClick={() => {
                setFormName(loginFormName);
               
                setSignupStep(1);
            }}> Log in</span>
        </p>
    }

    const getLoginFormFieldsJsx = () => {
        return <>
            <div className="form-group">
                <input type="text" name="mixed" placeholder="Your email or username" required />
            </div>
            <div className="form-group">
                <input type="password" name="password" placeholder="Your password" required />
            </div>

            <div className="forgot-password-container">
                <span onClick={() => setFormName(forgotPasswordFormName)}>Forgot your password?</span>
            </div>
        </>
    }

    const getRegisterFormFieldsJsx = () => {
        if (signupStep === 1) {
            return <>
                <div className="form-group many">
                    <input 
                        type="text" 
                        name="first_name" 
                        placeholder="First name" 
                        defaultValue={signupData.first_name}
                        required
                    />
                    <input 
                        type="text" 
                        name="last_name" 
                        placeholder="Last name"
                        defaultValue={signupData.last_name}
                        required
                    />
                </div>
                <div className="form-group">
                    <input 
                        type="text" 
                        name="username" 
                        placeholder="Choose username"
                        defaultValue={signupData.username}
                        required
                    />
                </div>
            </>
        }
        
        // Step 2
        return <>
            <div className="form-group">
                <input 
                    key="email-step2"
                    type="email" 
                    name="email" 
                    placeholder="Enter your email"
                    required
                />
            </div>
            <div className="form-group">
                <input 
                    key="password-step2"
                    type="password" 
                    name="password" 
                    placeholder="Enter your password"
                    required
                />
            </div>
            <div className="form-group" style={{ marginTop: '10px' }}>
                <button 
                    type="button" 
                    onClick={() => setSignupStep(1)}
                    style={{ 
                        background: 'transparent', 
                        color: '#8223F8', 
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px',
                        textDecoration: 'underline',
                        boxShadow: 'none'
                    }}
                >
                    ← Back to Step 1
                </button>
            </div>
        </>
    }

    const getFormSubmitButton = () => {
        // For register form step 1, show continue button
        if (formName === registerFormName && signupStep === 1) {
            return <div className="form-group submit-button">
                <button type="button" onClick={handleSignupStep1Continue}>Next <RightArrowIcon /></button>
            </div>
        }
        
        // For register form step 2, show sign up button
        if (formName === registerFormName && signupStep === 2) {
            return <div className={`form-group submit-button ${isSubmitLoading && "loading"}`}>
                <button type="submit" className={isSubmitLoading && "loading"}>Sign Up <RightArrowIcon /></button>
            </div>
        }
        
        // For forgot password form
        if (formName === forgotPasswordFormName) {
            return <div className={`form-group submit-button ${isSubmitLoading && "loading"}`}>
                <button type="submit" className={isSubmitLoading && "loading"}>Reset Password <RightArrowIcon /></button>
            </div>
        }
        
        // Default login button
        return <div className={`form-group submit-button ${isSubmitLoading && "loading"}`}>
            <button type="submit" className={isSubmitLoading && "loading"}>Login <RightArrowIcon /></button>
        </div>
    }

    const getFormClassName = () => {
        if (formName === loginFormName) return 'login';
        if (formName === registerFormName) return 'signup';
        if (formName === forgotPasswordFormName) return 'forgot-password';
        return '';
    }

    const handleNavigationClick = () => {
        setIsSideNavOpen(false);
    };

    const handleGoogleSignIn = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const idToken = await result.user.getIdToken();

            // Call your API with the Firebase token
            const response = await axios.post('/auth/firebase', {
                token: idToken,
                app_name: 'empowerverse'
            });

            if (response.data.status === 'success') {
                FlicToaster.success("Login success! :D");
                setLocalStorageUser(response.data);
                window.location.replace('/profile');
            } else {
                FlicToaster.error(response.data.message);
            }
        } catch (error) {
            console.error('Error during Google sign-in:', error);
            FlicToaster.error("Authentication failed. Please try again.");
        }
    };

    const handleAppleSignIn = async () => {
        try {
            const provider = new OAuthProvider('apple.com');
            const result = await signInWithPopup(auth, provider);
            const idToken = await result.user.getIdToken();

            // Call your API with the Firebase token
            const response = await axios.post('/auth/firebase', {
                token: idToken,
                app_name: 'empowerverse'
            });

            if (response.data.status === 'success') {
                FlicToaster.success("Login success! :D");
                setLocalStorageUser(response.data);
                window.location.replace('/profile');
            } else {
                FlicToaster.error(response.data.message);
            }
        } catch (error) {
            console.error('Error during Apple sign-in:', error);
            FlicToaster.error("Authentication failed. Please try again.");
        }
    };

    return (

        <>
            <MobileTopNavigation
                isSideNavOpen={isSideNavOpen}
                setIsSideNavOpen={setIsSideNavOpen}
            />
            <div className="container">
                <div style={{ display: `${isSideNavOpen ? 'block' : 'none'} ` }} onClick={() => setIsSideNavOpen(false)} className="overlay"></div>
                <aside className="side-bar">
                    <MobileSideNavigation
                        isOpen={isSideNavOpen}
                        onClose={handleNavigationClick}
                    />
                </aside>
                <main className="main-container">
                    <div className="auth-container">
                        <LeftPaneImage />
                        <div className={`form-container ${getFormClassName()}`}>
                            <form onSubmit={handleFormSubmit}>
                                {loader ? getStatusResponse() : ""}
                                <HorizontalLogo />
                                <div className="heading-container">
                                    <h2>{formName.toLowerCase()}</h2>
                                  
                                </div>

                                {formName !== forgotPasswordFormName && (
                                    <>
                                        <div className="social-login-container">
                                            <button type="button" className="google-signin-button" onClick={handleGoogleSignIn}>
                                                <img src="google-icon.svg" alt="Google" />
                                                {formName === registerFormName ? 'Create account with Google' : 'Log in with Google'}
                                            </button>
                                            <button type="button" className="apple-signin-button" onClick={handleAppleSignIn}>
                                                <img src="apple-dark-icon.svg" alt="Apple" />
                                                {formName === registerFormName ? 'Create account with Apple' : 'Log in with Apple'}
                                            </button>
                                        </div>

                                        <div className="separator">
                                            <span>Or</span>
                                        </div>
                                    </>
                                )}
                                    
                                <div className="interaction-container">
                                    {getFormFieldsJsx()}
                                    {getFormSubmitButton()}
                                 
                                </div>

                                <div style={{textAlign: 'center'}}>
                                {getHeadingContainerJsx()}
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