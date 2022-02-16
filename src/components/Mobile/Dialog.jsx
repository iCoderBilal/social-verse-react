import React from 'react';
import PropTypes from "prop-types";

function Dialog(props) {

    if (!props.isVisible) {
        return <></>
    }

    const getClassName = () => {
        return `dialog dialog-${props.position.toLowerCase()} ${props.customClassName ? props.customClassName : ''}`
    }

    const getButtons = () => {
        if (props.secondaryButton) {
            return (<>
                <button type={`button`} className={`primary`}
                        onClick={props.primaryButton.clickCallback}>{props.primaryButton.text}</button>
                <button type={`button`} className={`secondary`}
                        onClick={props.secondaryButton.clickCallback}>{props.secondaryButton.text}</button>
            </>)
        }

        return <button type={`button`} className={`primary`}
                       onClick={props.primaryButton.clickCallback}>{props.primaryButton.text}</button>
    }

    return (
        <div className={getClassName()}>
            <div className={`img-container`}>
                <img
                    width={56}
                    height={56}
                    src={`https://cdn-asset.watchflic.com/images/flic_dialog_logo.svg`}
                    alt={`Flic Logo`}/>
            </div>
            <div className={`info`}>
                <p className={`title`}>{props.title}</p>
                <p className={`description`}>{props.description}</p>
            </div>
            <div className={`buttons`}>
                {getButtons()}
            </div>
        </div>
    );
}

Dialog.propTypes = {
    position: PropTypes.oneOf(['Middle', 'Bottom']).isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    customClassName: PropTypes.string,
    isVisible: PropTypes.bool.isRequired,
    primaryButton: PropTypes.exact({
        text: PropTypes.string.isRequired,
        clickCallback: PropTypes.func.isRequired
    }).isRequired,
    secondaryButton: PropTypes.exact({
        text: PropTypes.string.isRequired,
        clickCallback: PropTypes.func.isRequired
    }),
}


export default Dialog;