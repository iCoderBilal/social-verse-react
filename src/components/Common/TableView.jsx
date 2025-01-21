import React, { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { solarizedlight } from "react-syntax-highlighter/dist/esm/styles/prism"; // Using a valid theme like "solarizedlight"

// Function to safely render the value of a cell (handling objects and truncating data)
const renderCellValue = (value) => {
    if (value === undefined || value === null) {
        return "-";  // Fallback for undefined or null values
    }

    // Handle case when value is an object or array
    if (typeof value === "object" && value !== null) {
        return JSON.stringify(value); // Convert the object to a string
    }

    // Truncate text longer than 20 characters
    return value && value.length > 20 ? value.substring(0, 20) + "..." : value; // Truncate long text
};

const TableView = ({ header, data, renderCustomCell }) => {
    const [selectedRow, setSelectedRow] = useState(null);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleRowClick = (item) => {
        // Since the data passed to TableView is already filtered, 
        // we need to use the original unfiltered item
        setSelectedRow(item._original || item);
    };
    

    const handleClosePopup = () => {
        setSelectedRow(null);
    };

    const renderCell = (key, value) => {
        if (renderCustomCell) {
            return renderCustomCell(key, value);
        }
        return renderCellValue(value);
    };

    return (
        <div>
            <div style={styles.tableWrapper}>
                {isMobileView ? (
                    <div style={styles.mobileList}>
                        {data && data.length > 0 ? (
                            data.map((item, index) => (
                                <div 
                                    key={index} 
                                    style={styles.mobileCard}
                                    onClick={() => handleRowClick(item)}
                                >
                                    <div style={styles.mobileCardHeader}>
                                        #{index + 1}
                                    </div>
                                    {header.map((column, colIndex) => (
                                        <div key={colIndex} style={styles.mobileRow}>
                                            <span style={styles.mobileLabel}>{column.label}:</span>
                                            <span style={styles.mobileValue}>
                                                {renderCell(column.key, item[column.key])}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ))
                        ) : (
                            <div style={styles.noData}>No data available</div>
                        )}
                    </div>
                ) : (
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.tableHeader}>Sr.No</th>
                                {header.map((column, index) => (
                                    <th key={index} style={styles.tableHeader}>{column.label}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data && data.length > 0 ? (
                                data.map((item, index) => (
                                    <tr key={index} onClick={() => handleRowClick(item)} style={styles.tableRow}>
                                        <td style={styles.tableCell}>{index + 1}</td>
                                        {header.map((column, colIndex) => (
                                            <td key={colIndex} style={styles.tableCell}>
                                                {renderCell(column.key, item[column.key])}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={header.length + 1} style={styles.tableCell}>No data available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modified popup to display all fields */}
            {selectedRow && (
                <div style={styles.popup}>
                    <div style={styles.popupContent}>
                        <h2>Full Data</h2>
                        <div style={styles.syntaxWrapper}>
                            <SyntaxHighlighter 
                                language="json" 
                                style={solarizedlight}
                                customStyle={{
                                    wordBreak: 'break-all',
                                    whiteSpace: 'pre-wrap',
                                }}
                                wrapLines={true}
                                lineProps={{
                                    style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' }
                                }}
                            >
                                {JSON.stringify(selectedRow, null, 2)
                                    .match(/.{1,100}(?:\s|$)/g)
                                    .join('\n')}
                            </SyntaxHighlighter>
                        </div>
                        <button onClick={handleClosePopup} style={styles.popupButton}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    tableWrapper: {
        maxHeight: "80vh",  // Set the height of the scrollable table content
        overflowY: "auto",   // Enable vertical scroll for table body
        marginBottom: "20px", // Add some space at the bottom for better UI
        width: "100%",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        tableLayout: "auto", // Adjust table layout to auto to let content determine column width
        backgroundColor: "#fff", // Ensure white background for table
        border: "1px solid #ddd", // Border for the table
    },
    tableHeader: {
        position: "sticky",
        top: 0,
        backgroundColor: "#f2f2f2", // Light gray for better contrast
        border: "1px solid #ddd",
        padding: "8px",
        textAlign: "left",
        zIndex: 1,  // Make sure header stays on top
        fontSize: "14px",  // Adjust font size for readability
        color: "#333", // Dark text color for visibility
    },
    tableRow: {
        cursor: "pointer",
        borderBottom: "1px solid #ddd",  // Add a bottom border to rows for better separation
        backgroundColor: "#fff", // White background for rows
    },
    tableCell: {
        border: "1px solid #ddd",
        padding: "8px",
        textOverflow: "ellipsis",  // Ensure long content is truncated with ellipsis
        overflow: "hidden",
        whiteSpace: "normal", // Allow text wrapping in cells
        fontSize: "14px", // Adjust font size for readability
        color: "#333", // Ensure text is dark for visibility
        backgroundColor: "#f9f9f9", // Light gray background for cells
    },
    popup: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },
    popupContent: {
        background: "white",
        padding: "20px",
        borderRadius: "5px",
        width: "80%",
        maxWidth: "600px",
        maxHeight: "80%",
        overflowY: "auto",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Added shadow for better visibility
    },
    popupButton: {
        padding: "10px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        cursor: "pointer",
        marginTop: "10px",
        fontSize: "14px",
        borderRadius: "4px",
    },
    syntaxWrapper: {
        maxWidth: '100%',
        overflowX: 'auto',
    },
    mobileList: {
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    mobileCard: {
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '15px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        border: '1px solid #ddd',
    },
    mobileCardHeader: {
        fontSize: '16px',
        fontWeight: 'bold',
        marginBottom: '10px',
        padding: '5px',
        backgroundColor: '#f2f2f2',
        borderRadius: '4px',
    },
    mobileRow: {
        display: 'flex',
        padding: '8px 0',
        borderBottom: '1px solid #eee',
        flexDirection: 'column',
        gap: '4px',
    },
    mobileLabel: {
        fontWeight: 'bold',
        color: '#666',
        fontSize: '14px',
    },
    mobileValue: {
        color: '#333',
        fontSize: '14px',
        wordBreak: 'break-word',
    },
    noData: {
        textAlign: 'center',
        padding: '20px',
        color: '#666',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
    },
};

export default TableView;
