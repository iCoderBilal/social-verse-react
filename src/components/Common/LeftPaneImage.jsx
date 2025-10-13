import React from 'react';
import SocialVerseImage from '../../images/login-left-main.png';
import SocialVerseVectorImage from '../../images/login-left-vector.svg';

function LeftPaneImage() {

    return (
    <div className="login-left">
        <img alt="SocialVerse Vector Image" className="login-left-vector-img" src={SocialVerseVectorImage}/>
        <img alt="SocialVerse Image" className="login-left-main-img" src={SocialVerseImage}/>
    </div>

    )
}

export default LeftPaneImage;