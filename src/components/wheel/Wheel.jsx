import React, { useRef, useState } from "react";

const values = [
  "930", "1430", "2040", "1575", "420",
  "325","550","840","1210","192","675","88","114","250"
];
const segmentAngle = 360 / values.length;

function getTransformAngle(e, center) {
  const x = e.clientX - center.x;
  const y = e.clientY - center.y;
  return Math.atan2(y, x) * (180 / Math.PI);
}

export default function RotatableWheel({onClick}) {
  const [angle, setAngle]     = useState(0);
  const [selected, setSelected] = useState(null);
  const wheelRef = useRef(null);
  const dragging  = useRef(false);
  const startAngle = useRef(0);

  const onPointerDown = (e) => {
    dragging.current = true;
    const rect = wheelRef.current.getBoundingClientRect();
    const center = {
      x: rect.left + rect.width / 2,
      y: rect.top  + rect.height / 2,
    };
    startAngle.current = getTransformAngle(e, center) - angle;
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup",   onPointerUp);
  };

  const onPointerMove = (e) => {
    if (!dragging.current) return;
    const rect = wheelRef.current.getBoundingClientRect();
    const center = {
      x: rect.left + rect.width / 2,
      y: rect.top  + rect.height / 2,
    };
    const newAngle = getTransformAngle(e, center) - startAngle.current;
    setAngle(newAngle);
  };

  const onPointerUp = () => {
    dragging.current = false;
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup",   onPointerUp);

    // ——— FIXED SELECTION LOGIC ———
    const normalized = ((-angle % 360) + 360) % 360;
    const idx        = Math.floor(normalized / segmentAngle);
    setSelected(idx == 0 ? values[values.length -1] : values[idx-1]);
    onClick(idx == 0 ? values[values.length -1] : values[idx-1]);
  };

  // draw the wedges
  const segments = values.map((val, i) => {
    const start = (i * segmentAngle + 90) * (Math.PI / 180);
    const end   = ((i + 1) * segmentAngle + 90) * (Math.PI / 180);
    const x1 = 150 + 120 * Math.cos(start);
    const y1 = 150 + 120 * Math.sin(start);
    const x2 = 150 + 120 * Math.cos(end);
    const y2 = 150 + 120 * Math.sin(end);
    return (
      <path
        key={i}
        d={`M150,150 L${x1},${y1} A120,120 0 0,1 ${x2},${y2} Z`}
        fill={i % 2 === 0 ? "#6F826A" : "#F0F1C5"}
        stroke="#fff"
        strokeWidth={2}
      />
    );
  });

  // draw the labels
  const labels = values.map((val, i) => {
    const ang = ((i + 0.5) * segmentAngle + 90) * (Math.PI / 180);
    const x = 150 +  80 * Math.cos(ang);
    const y = 150 +  80 * Math.sin(ang);
    return (
      <text
        key={i}
        x={x} y={y}
        textAnchor="middle"
        alignmentBaseline="middle"
        fontSize={20}
        fill="#333"
        transform={`rotate(${i * segmentAngle + 90 + 180}, ${x}, ${y})`}
        style={{fontWeight:"600"}}
      >
        {val}
      </text>
    );
  });

  return (
    <div style={{ position: "relative", width: 300, height: 300 }}>
      <svg
        ref={wheelRef}
        width={300}
        height={300}
        onPointerDown={onPointerDown}
        style={{ cursor:"grab", userSelect:"none", touchAction:"none" }}
      >
        {/* rotate the whole wheel about its centre */}
        <g transform={`rotate(${angle}, 150,150)`}>
          {segments}
          {labels}
        </g>
      </svg>

      {/* Bottom-pointing arrow */}
      <div
        style={{
          position: "absolute",
          left:   140,
          bottom: 5,
          width:  20,
          height: 40,
          pointerEvents: "none",
        }}
      >
        <svg width={20} height={40}>
          <polygon points="10,0 0,40 20,40" fill="white" />
        </svg>
      </div>

      <div style={{ textAlign: "center", marginTop: 10 }}>
        {selected
          ? <h2 style={{fontSize:"25px" , fontWeight:"600"}}>RPM: {selected}</h2>
          : <h2 style={{fontSize:"25px" , fontWeight:"600"}}>Select the RPM</h2>}
      </div>
    </div>
  );
}