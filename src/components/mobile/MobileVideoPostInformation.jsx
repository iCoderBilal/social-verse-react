import React from 'react';
import {MusicNoteIcon} from "@heroicons/react/solid";
import VinylRecord from "../../images/vinyl.png";
import VerifiedTick from "../../images/verified.png";

function MobileVideoPostInformation(props) {
    return (
        <div className="video__post-information">
           <div className="video__post-information__text">
               <p className="video__post-information__text__username">
                   <span>{props.username}</span>
                   {
                       props.isVerified ? <img src={VerifiedTick} alt={props.username}/> : ''
                   }
               </p>
               <p className="video__post-information__text__description">{props.description}</p>
               <div className="video__post-information__text__music">
                <MusicNoteIcon className="video__post-information__text__music__icon"/>
                <span>{props.musicName}</span>
               </div>
           </div>
            <div className="video__post-information__vinyl">
                <img src={VinylRecord} className={props.isVideoPlaying ? 'spin': ''} alt="Music Vinyl Record"/>
            </div>
        </div>
    );
}

export default MobileVideoPostInformation;