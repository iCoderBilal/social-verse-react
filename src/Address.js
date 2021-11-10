import React, {Component} from 'react';
import NavBar from "./components/NavBar";
import UserHelper from "./services/UserHelper";
import ShelterToaster from "./services/ShelterToaster";
import {QRCode} from "react-qrcode-logo";

class Address extends Component {

    state = {
        eth_address: UserHelper.getEthAddress()
    }

    copyEthAddress = () => {
        navigator.clipboard.writeText(this.state.eth_address).then(() => {
            ShelterToaster.success("Address was copied to clipboard")
        })
    };

    render() {
        return (
            <React.Fragment>
                <NavBar/>
                <div className="mt-40 mx-auto flex justify-center flex-col items-center">
                    <div>
                        <QRCode value={this.state.eth_address} qrStyle="dots" size={300} enableCORS={true} eyeRadius={[
                            5,  // top/left eye
                            10, // top/right eye
                            5,  // bottom/left eye
                        ]} logoImage="apple-touch-icon.png" />
                    </div>
                    <div className="mt-10 flex justify-center items-center flex-col md:flex-row">
                        <div className="select-all p-2 py-4 bg-gray-200 rounded-lg shadow-inner text-sm md:text-xl md:p-4 lg:text-2xl">
                            {this.state.eth_address}
                        </div>
                        <div className="cursor-pointer mt-8 p-2 bg-white shadow-md rounded md:mt-0 md:ml-2 hover:bg-gray-100 active:shadow-none active:shadow-inner active:bg-gray-400" onClick={() => this.copyEthAddress()} title="Copy address to clipboard">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10 " fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default Address;