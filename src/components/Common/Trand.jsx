import React from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

function Trand({ trand }) {
    const formattedTrand = new Intl.NumberFormat('en', { notation: "compact" }).format(trand);

    return (
        <div className="tranding" style={{
            color: `${trand > 0 ? 'green' : 'red'}`
            }}>
            <span className="trand-count">
                {trand > 0 ? <FaCaretUp /> : <FaCaretDown />}{formattedTrand}
            </span>
            <p className="trand-text">Last 30 Days</p>
        </div>
    )
}

export default Trand;