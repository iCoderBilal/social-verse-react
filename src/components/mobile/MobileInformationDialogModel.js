import React, {Component, Fragment} from 'react';
import {ArrowNarrowRightIcon, XCircleIcon} from "@heroicons/react/outline";
import Confetti from "../../images/confetti.png";
import axios from "axios";
import FlicToaster from "../../services/FlicToaster";

class MobileInformationDialogModel extends Component {

    state = {
        isDownloadVisible:  true,
        isWaitlistVisible: false,
        wasPhoneNumberCollected: false,
        phoneInputRef: React.createRef()
    }

    moveToWaitListScreen = () => {
        this.setState({
            isDownloadVisible:  false,
            isWaitlistVisible: true,
        })
    }

    handlePhoneInputFocus = () => {
        const input = this.state.phoneInputRef.current;
        if(!(input.value.startsWith('+'))){
            input.value = "+1" + input.value;
        }
    }

    moveToThankYouScreen = () => {

        const input = this.state.phoneInputRef.current;

        const value = input.value ?? '';

        if(/^([+][0-9]{9,15})$/.test(value) !== true){
            FlicToaster.notify("Please enter a valid phone number with country prefix")
            return;
        }

        let formData = new FormData();
        formData.append('phone', input.value);

        this.setState({
            isWaitlistVisible: false,
            wasPhoneNumberCollected: true
        }, () => axios.post('/waitlist/phone/add', formData).then(()=>{
            FlicToaster.success("Thanks for joining! :D")
        }))
    }

    getDownloadDialogScreen = () => {
        return (
           <React.Fragment>
               <h2 className="information-dialog-model__heading">Get the full experience on the app</h2>
               <p className="information-dialog-model__description">Follow your favorite accounts, explore new trends, and create your own videos!</p>
               <a className="information-dialog-model__waitlist-link" onClick={()=>this.moveToWaitListScreen()}>
                   Download Flic <ArrowNarrowRightIcon className="information-dialog-model__waitlist-link__arrow-right"/>
               </a>
               <span className="information-dialog-model__close" onClick={()=>this.props.closeDialog()}>
                <XCircleIcon/>
            </span>
           </React.Fragment>
        );
    }

    getWaitListCollectionScreen = () => {
        return (
           <React.Fragment>
               <h2 className="information-dialog-model__heading">Uh...Oh! 😮</h2>
               <p className="information-dialog-model__description">Flic is not ready to download yet, but we wanted to get some metrics on how many people were going to click on download link! Enter your phone number below to be added to the waitlist!</p>
               <input maxLength={15} onFocus={() => this.handlePhoneInputFocus()} ref={this.state.phoneInputRef} className="information-dialog-model__number-input" placeholder="Enter your number"/>
               <a className="information-dialog-model__waitlist-link" onClick={()=>this.moveToThankYouScreen()}>
                   Join the waitlist! <ArrowNarrowRightIcon className="information-dialog-model__waitlist-link__arrow-right"/>
               </a>
               <span className="information-dialog-model__close" onClick={()=>this.props.closeDialog()}>
                    <XCircleIcon/>
                </span>
           </React.Fragment>
        );
    }

    getThankYouScreen = () => {
        return (
              <React.Fragment>
                  <img className="information-dialog-model__confetti" src={Confetti} alt={`Thank you`}/>
                  <span className="information-dialog-model__close" onClick={()=>this.props.closeDialog()}>
                    <XCircleIcon/>
                  </span>
              </React.Fragment>
        );
    }

    getDialog = () =>{
        if(this.state.wasPhoneNumberCollected){
           return this.getThankYouScreen();
        } else if(this.state.isWaitlistVisible){
            return this.getWaitListCollectionScreen();
        }
        return this.getDownloadDialogScreen();
    }

    render() {
        return (
            <div className={`information-dialog-model ${this.props.isDialogVisible ? 'information-dialog-model--active':''}`}>
                {this.getDialog()}
             </div>);
    }
}

export default MobileInformationDialogModel;