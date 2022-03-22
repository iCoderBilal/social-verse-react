import React from 'react';
import PropTypes from "prop-types";

function UploadProgressCircle(props) {


    const {radius, stroke, progress, startTime = -1} = props;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - progress / 100 * circumference;

    const getETAJsx = () => {

        if (startTime === -1) {
            return <></>
        }

        const currentTimestamp = +new Date(); //ms
        const elapsedTime = currentTimestamp - startTime;
        const expectedEndTimestamp = startTime + ((100 * elapsedTime) / Math.floor(progress + 1));
        const timeLeft = Math.floor((expectedEndTimestamp - currentTimestamp) / 1000);
        if (timeLeft > 60) {
            return <span>{Math.floor(timeLeft / 60)} mins left</span>
        }

        return <span>{Math.max(0, timeLeft)} secs left</span>
    }

    return (
        <div className="upload-progress-circle">
            <svg
                height={radius * 2}
                width={radius * 2}
            >
                <circle
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeDasharray={circumference + ' ' + circumference}
                    style={{strokeDashoffset}}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
            </svg>
            <div className="upload-text">
                <h1>{Math.floor(progress)}%</h1>
                {getETAJsx()}
            </div>
        </div>
    );
}


UploadProgressCircle.propTypes = {
    progress: PropTypes.number.isRequired,
    radius: PropTypes.number.isRequired,
    stroke: PropTypes.number.isRequired,
    startTime: PropTypes.number
};

export default UploadProgressCircle;