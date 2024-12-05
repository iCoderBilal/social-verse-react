import React from "react";

const formatDate = (date) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return new Date(date).toLocaleDateString('en-US', options);
};

function ErrorLog({ data }) {
    return (
        <div className="log">
            <div className="log-data">
                <p className="status-code">{data.status_code}</p>
                <p>{data.path}</p>
                <p>{data.line}</p>
                <p>{formatDate(data.created_at)}</p>
            </div>
        </div>
    );
}

export default ErrorLog;