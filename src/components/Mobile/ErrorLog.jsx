import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";

const formatDate = (date) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return new Date(date).toLocaleDateString('en-US', options);
};

function ErrorLog({ data, showAppName}) {
    const [showPopup, setShowPopup] = useState(false);
    const [popupContent, setPopupContent] = useState(null);

    // Extract the file name from the full path
    const getFileName = (filePath) => {
        return filePath.split('/').pop();
    };

    const handleFileNameClick = () => {
        setPopupContent({
            fileName: data.file_name,
            message: data.message,
        });
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
        setPopupContent(null);
    };

    return (
        <div className="log">
            <div className="log-data">
                <p className="status-code">{data.status_code}</p>
                <p>{data.path}</p>
                <p onClick={handleFileNameClick} style={{ cursor: 'pointer', color: '#000' }}> {data.line} </p>
                <p>{formatDate(data.created_at)}</p>
                {showAppName && <p>{data.app_name}</p>}
            </div>

            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <button 
                            style={{ border: 'none', color: '#000' }}
                            className="close-btn"
                            onClick={closePopup}
                        >
                            <FaTrash color="red" size={18} />
                        </button>
                        <h3>File Details</h3>
                        <p><strong>File Path:</strong> {popupContent.fileName}</p>
                        <p><strong>Error Message:</strong> {popupContent.message}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ErrorLog;