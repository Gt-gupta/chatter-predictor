import React from "react";
import './DocItem.css'

const DocItem = ({children, onClick}) => {
    return(
        <div className="doc-item" onClick={() => onClick(children)}>{children}</div>
    )
};
export default DocItem;