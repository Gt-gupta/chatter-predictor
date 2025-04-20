import React from "react";
import "./Check.css";

function Check({onClick}){
    return(
        <div className="check" onClick={() => onClick()}>
            <h2>Predict Chatter</h2>
        </div>
    )
};

export default Check;