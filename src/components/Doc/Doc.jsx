import React, { useState, useEffect, useRef } from "react";
import DocButton from "../DocButton/DocButton";
import DocContent from "../DocContent/DocContent";
import './Doc.css';

const Doc = ({ buttonText, content }) => {
  const [open, setOpen] = useState(false);
  const [dropdownTop, setDropdownTop] = useState(0);

  const docRef = useRef();
  const buttonRef = useRef();
  const contentRef = useRef();

  const toggleDropdown = () => {
    if (!open) {
      const spaceRemaining =
        window.innerHeight - buttonRef.current.getBoundingClientRect().bottom;
      const contentHeight = contentRef.current.clientHeight;

      const topPosition =
        spaceRemaining > contentHeight
          ? null
          : -(contentHeight - spaceRemaining); // move up by height clipped by window
      setDropdownTop(topPosition);
    }

    setOpen((open) => !open);
  };


  const toggleDoc = () => {
    setOpen((prevOpen) => !prevOpen); // This works, but you can also use 'prevOpen' instead of 'open' for better clarity
  };
  useEffect(() => {
    const handler = (event) => {
      if (docRef.current &&
        !docRef.current.contains(event.target)) {
        setOpen(false);
      }

    };
    document.addEventListener("click", handler);
    return () => {
      document.removeEventListener("click", handler);
    };
  }, [docRef]);


  return (
    <div className="doc" ref={docRef}>
      <DocButton ref={buttonRef} toggle={toggleDoc} open={open}>{buttonText}</DocButton>
      <DocContent top={dropdownTop} ref ={contentRef} open={open}>{content}</DocContent>
    </div>
  );
};

export default Doc;
