import React, { Component } from "react";
import CreateFlicCard from "./components/CreateFlicCard";
import MobileBottomNavigation from "./components/mobile/MobileBottomNavigation";
import MobileInformationDialogModel from "./components/mobile/MobileInformationDialogModel";

class Upload extends Component {

    state = {
        isDialogVisible: false,
    }

    openInformationDialogModal = () => {
        this.setState({
            isDialogVisible: true
        });
    }

    closeInformationDialogModal = () => {
        this.setState({
            isDialogVisible: false
        });
    }

    render() {
        return ( <React.Fragment>
            <MobileInformationDialogModel isDialogVisible={this.state.isDialogVisible} closeDialog={this.closeInformationDialogModal}/>
            <div className="desktop-f-t-b feed-container mx-auto justify-center">
                <CreateFlicCard/>
                <MobileBottomNavigation openDialog={this.openInformationDialogModal}/>
            </div>
        </React.Fragment>);
    }
}

export default Upload;