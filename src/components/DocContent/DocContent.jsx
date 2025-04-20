import React, { forwardRef } from "react";
import './DocContent.css';

const DocContent = forwardRef((props, ref) => {
  const { children, open, top } = props;
  return (
    <div
      className={`doc-content ${open ? "content-open" : null}`}
      style={{ top: top ? `${top}px` : "100%" }}
      ref={ref}
    >
      {children}
    </div>
  );
});


export default DocContent;
