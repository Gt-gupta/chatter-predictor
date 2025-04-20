import React, { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import './depthbutton.css';

function Depthbutton({onClick}) {
    const [depth, setDepth] = useState(0.1);

    const decreaseDepth = () => {
        if (depth - 0.1 > 0) {
            const p = depth;
            setDepth((prevDepth) => Math.round((prevDepth - 0.1) * 10) / 10); // Round to 1 decimal place
            onClick(Math.round((p - 0.1) * 10) / 10);
        }
    };

    const increaseDepth = () => {
        if (depth + 0.1 < 3) {
            const p = depth;
            setDepth((prevDepth) => Math.round((prevDepth + 0.1) * 10) / 10); // Round to 1 decimal place
            onClick(Math.round((p + 0.1) * 10) / 10);
        }
    };

    return (
        <div>
            <h3 style={{ marginLeft: "46%", marginTop: "13vh" }}>Select depth of cut(mm)</h3>
            <div className="box">
                <div className="plus" onClick={decreaseDepth}>
                    <FaMinus />
                </div>
                <div className="depth">
                    <h2>{depth}</h2>
                </div>
                <div className="plus" onClick={increaseDepth}>
                    <FaPlus />
                </div>
            </div>
        </div>




    );
};

export default Depthbutton;