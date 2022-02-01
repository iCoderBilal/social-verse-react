import React from 'react';
import {ArrowNarrowRightIcon, XCircleIcon} from "@heroicons/react/outline";

const MobileDownloadDialogModel = (props) => {
    return (
        <div className={`download-dialog-model ${props.isDialogVisible ? 'download-dialog-model--active':''}`}>
            <h2 className="download-dialog-model__heading">Get the full experience on the Flic app</h2>
            <p className="download-dialog-model__description">Follow your favorite accounts, explore new trends, and create your own videos</p>
            <a className="download-dialog-model__waitlist-link">
                Download <ArrowNarrowRightIcon className="download-dialog-model__waitlist-link__arrow-right"/>
            </a>
            <span className="download-dialog-model__close" onClick={()=>props.closeDialog()}>
                <XCircleIcon/>
            </span>
        </div>
    );
};

export default MobileDownloadDialogModel;