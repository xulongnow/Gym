// Equipment SVG illustrations - line art style
// All use consistent palette: ink #1a2236, accent #d9684c, light fill #e6e2da

const SVG_BASE = {
  stroke: "#1a2236",
  strokeLight: "#6b7385",
  fillLight: "#e6e2da",
  fillAccent: "#f3e1da",
  accent: "#d9684c",
  strokeW: 2.2,
  strokeThin: 1.2,
};

// ---- Treadmill ----
function TreadmillSvg() {
  const s = SVG_BASE;
  return (
    <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Base / frame */}
      <path d="M30 120 L210 120 L195 140 L45 140 Z" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW} strokeLinejoin="round"/>
      {/* Belt */}
      <rect x="45" y="115" width="150" height="10" rx="3" fill="#fff" stroke={s.stroke} strokeWidth={s.strokeThin}/>
      <path d="M50 120 L190 120" stroke={s.strokeLight} strokeWidth={s.strokeThin} strokeDasharray="4 3"/>
      {/* Console upright */}
      <path d="M65 120 L80 45 L125 35 L110 120" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW} strokeLinejoin="round"/>
      {/* Console */}
      <rect x="72" y="22" width="70" height="28" rx="4" fill="#fff" stroke={s.stroke} strokeWidth={s.strokeW}/>
      <rect x="80" y="29" width="42" height="10" rx="2" fill={s.fillAccent}/>
      <circle cx="132" cy="34" r="3" fill={s.accent}/>
      {/* Handrails */}
      <path d="M85 85 L145 75" stroke={s.stroke} strokeWidth={s.strokeW} strokeLinecap="round"/>
      <path d="M95 95 L155 85" stroke={s.stroke} strokeWidth={s.strokeW} strokeLinecap="round"/>
      {/* Rear support */}
      <path d="M200 120 L200 135" stroke={s.stroke} strokeWidth={s.strokeW} strokeLinecap="round"/>
    </svg>
  );
}

// ---- Elliptical ----
function EllipticalSvg() {
  const s = SVG_BASE;
  return (
    <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Base */}
      <ellipse cx="120" cy="142" rx="90" ry="8" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Main column */}
      <path d="M85 138 L75 70 L110 55" stroke={s.stroke} strokeWidth={s.strokeW} fill="none" strokeLinejoin="round"/>
      <path d="M155 138 L165 70 L130 55" stroke={s.stroke} strokeWidth={s.strokeW} fill="none" strokeLinejoin="round"/>
      {/* Console */}
      <rect x="88" y="38" width="64" height="24" rx="3" fill="#fff" stroke={s.stroke} strokeWidth={s.strokeW}/>
      <rect x="96" y="44" width="36" height="8" rx="1" fill={s.fillAccent}/>
      {/* Handlebars - moving arms */}
      <path d="M95 65 Q70 100 60 125" stroke={s.stroke} strokeWidth={s.strokeW} fill="none" strokeLinecap="round"/>
      <path d="M145 65 Q170 100 180 125" stroke={s.stroke} strokeWidth={s.strokeW} fill="none" strokeLinecap="round"/>
      {/* Handle grips */}
      <ellipse cx="60" cy="125" rx="6" ry="4" fill={s.stroke} transform="rotate(-20 60 125)"/>
      <ellipse cx="180" cy="125" rx="6" ry="4" fill={s.stroke} transform="rotate(20 180 125)"/>
      {/* Pedals / foot platforms */}
      <ellipse cx="55" cy="133" rx="22" ry="5" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      <ellipse cx="185" cy="133" rx="22" ry="5" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Flywheel hint */}
      <circle cx="120" cy="125" r="18" fill="none" stroke={s.strokeLight} strokeWidth={s.strokeThin} strokeDasharray="3 2"/>
    </svg>
  );
}

// ---- Chest Press (坐式推胸) ----
function ChestPressSvg() {
  const s = SVG_BASE;
  return (
    <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Base frame */}
      <rect x="30" y="135" width="180" height="12" rx="3" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Seat post */}
      <rect x="85" y="85" width="14" height="50" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Seat */}
      <rect x="70" y="75" width="44" height="14" rx="3" fill={s.fillAccent} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Backrest */}
      <rect x="66" y="30" width="12" height="52" rx="4" fill={s.fillAccent} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Weight stack tower */}
      <rect x="160" y="40" width="28" height="95" rx="3" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Weight plates */}
      {[55, 68, 81, 94, 107, 120].map(y => (
        <rect key={y} x="164" y={y} width="20" height="5" fill={s.stroke} opacity="0.3"/>
      ))}
      {/* Pin */}
      <circle cx="186" cy="100" r="3" fill={s.accent}/>
      {/* Arm mechanism */}
      <path d="M100 72 L140 65 L148 55" stroke={s.stroke} strokeWidth={s.strokeW} fill="none" strokeLinejoin="round" strokeLinecap="round"/>
      <path d="M100 62 L140 55 L148 45" stroke={s.stroke} strokeWidth={s.strokeW} fill="none" strokeLinejoin="round" strokeLinecap="round"/>
      {/* Handles */}
      <rect x="145" y="40" width="10" height="22" rx="3" fill={s.stroke} opacity="0.6"/>
      <rect x="145" y="50" width="10" height="22" rx="3" fill={s.stroke} opacity="0.6"/>
      {/* Cable line hint */}
      <path d="M148 50 Q155 55 174 50" stroke={s.accent} strokeWidth="1.5" strokeDasharray="3 2" fill="none"/>
    </svg>
  );
}

// ---- Incline Chest Press (阔角度推胸/上斜) ----
function InclineChestSvg() {
  const s = SVG_BASE;
  return (
    <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Base */}
      <rect x="25" y="138" width="190" height="10" rx="3" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Inclined backrest (main difference from flat press) */}
      <path d="M70 128 L100 35 L120 40 L95 130 Z" fill={s.fillAccent} stroke={s.stroke} strokeWidth={s.strokeW} strokeLinejoin="round"/>
      {/* Seat */}
      <rect x="55" y="112" width="42" height="16" rx="4" fill={s.fillAccent} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Seat post */}
      <rect x="72" y="128" width="12" height="10" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Weight tower */}
      <rect x="170" y="55" width="26" height="83" rx="3" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {[65, 76, 87, 98, 109, 120].map(y => (
        <rect key={y} x="174" y={y} width="18" height="4" fill={s.stroke} opacity="0.3"/>
      ))}
      {/* Arm mechanism - angled higher */}
      <path d="M95 85 Q135 70 155 45" stroke={s.stroke} strokeWidth={s.strokeW} fill="none" strokeLinecap="round"/>
      <path d="M95 75 Q135 60 155 35" stroke={s.stroke} strokeWidth={s.strokeW} fill="none" strokeLinecap="round"/>
      {/* Handles - upper position */}
      <rect x="150" y="28" width="10" height="18" rx="3" fill={s.stroke} opacity="0.6"/>
      <rect x="150" y="38" width="10" height="18" rx="3" fill={s.stroke} opacity="0.6"/>
      {/* Angle indicator */}
      <path d="M100 115 A 20 20 0 0 1 115 97" stroke={s.accent} strokeWidth="1.5" fill="none" strokeDasharray="2 2"/>
      <text x="115" y="112" fontSize="10" fill={s.accent} fontFamily="sans-serif">30-45°</text>
    </svg>
  );
}

// ---- Pec Fly / Reverse Fly (反飞鸟训练器) ----
function PecFlySvg() {
  const s = SVG_BASE;
  return (
    <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Base */}
      <ellipse cx="120" cy="142" rx="75" ry="7" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Center column */}
      <rect x="110" y="75" width="20" height="67" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Seat */}
      <rect x="95" y="92" width="50" height="14" rx="4" fill={s.fillAccent} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Backrest */}
      <rect x="115" y="55" width="14" height="40" rx="4" fill={s.fillAccent} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Pivot point */}
      <circle cx="120" cy="70" r="5" fill={s.stroke} opacity="0.4"/>
      {/* Swing arms (open position) */}
      <path d="M120 70 L55 55 L45 75" stroke={s.stroke} strokeWidth={s.strokeW} fill="none" strokeLinejoin="round" strokeLinecap="round"/>
      <path d="M120 70 L185 55 L195 75" stroke={s.stroke} strokeWidth={s.strokeW} fill="none" strokeLinejoin="round" strokeLinecap="round"/>
      {/* Pads */}
      <rect x="38" y="65" width="14" height="24" rx="4" fill={s.fillAccent} stroke={s.stroke} strokeWidth={s.strokeW}/>
      <rect x="188" y="65" width="14" height="24" rx="4" fill={s.fillAccent} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Weight stack */}
      <rect x="160" y="90" width="22" height="52" rx="3" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {[100, 110, 120, 130].map(y => (
        <rect key={y} x="164" y={y} width="14" height="3" fill={s.stroke} opacity="0.3"/>
      ))}
      {/* Motion arrows */}
      <path d="M50 70 Q70 80 90 72" stroke={s.accent} strokeWidth="1.5" fill="none" strokeDasharray="3 2"/>
      <path d="M190 70 Q170 80 150 72" stroke={s.accent} strokeWidth="1.5" fill="none" strokeDasharray="3 2"/>
      <polygon points="46,68 52,72 48,76" fill={s.accent}/>
      <polygon points="194,68 188,72 192,76" fill={s.accent}/>
    </svg>
  );
}

// ---- Triceps Lat Pulldown (臂下压背肌训练器) ----
function TricepsLatSvg() {
  const s = SVG_BASE;
  return (
    <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Base */}
      <rect x="30" y="138" width="180" height="10" rx="3" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Weight tower */}
      <rect x="165" y="40" width="28" height="98" rx="3" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {[52, 64, 76, 88, 100, 112, 124].map(y => (
        <rect key={y} x="170" y={y} width="18" height="4" fill={s.stroke} opacity="0.3"/>
      ))}
      {/* Top frame / pulley */}
      <path d="M179 40 L179 20 L85 20 L85 40" stroke={s.stroke} strokeWidth={s.strokeW} fill="none" strokeLinejoin="round"/>
      <circle cx="85" cy="25" r="6" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Cable */}
      <path d="M179 52 L179 26 L85 26 L85 55" stroke={s.accent} strokeWidth="1.5" fill="none" strokeDasharray="4 2"/>
      {/* Straight bar handle */}
      <rect x="70" y="55" width="30" height="5" rx="2" fill={s.stroke}/>
      {/* Seat & thigh pad */}
      <rect x="60" y="110" width="60" height="12" rx="3" fill={s.fillAccent} stroke={s.stroke} strokeWidth={s.strokeW}/>
      <rect x="82" y="75" width="16" height="38" rx="3" fill={s.fillAccent} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Thigh hold-down pad */}
      <rect x="70" y="98" width="40" height="8" rx="3" fill={s.fillAccent} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Support column */}
      <rect x="100" y="122" width="12" height="16" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
    </svg>
  );
}

// ---- Lat Pulldown (高拉背训练器) ----
function LatPulldownSvg() {
  const s = SVG_BASE;
  return (
    <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Base */}
      <rect x="20" y="138" width="200" height="10" rx="3" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Tall tower */}
      <rect x="170" y="15" width="26" height="123" rx="3" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {[30, 42, 54, 66, 78, 90, 102, 114, 126].map(y => (
        <rect key={y} x="175" y={y} width="16" height="3" fill={s.stroke} opacity="0.3"/>
      ))}
      {/* Top arm */}
      <path d="M183 15 L183 10 L70 10 L70 30" stroke={s.stroke} strokeWidth={s.strokeW} fill="none" strokeLinejoin="round"/>
      {/* Top pulley */}
      <circle cx="70" cy="18" r="7" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Cable */}
      <path d="M183 28 L183 16 L70 16 L70 42" stroke={s.accent} strokeWidth="1.5" fill="none" strokeDasharray="4 2"/>
      {/* Wide bar */}
      <path d="M40 45 Q70 38 100 45" stroke={s.stroke} strokeWidth={s.strokeW} fill="none" strokeLinecap="round"/>
      <circle cx="48" cy="47" r="3" fill={s.stroke} opacity="0.6"/>
      <circle cx="92" cy="47" r="3" fill={s.stroke} opacity="0.6"/>
      {/* Seat */}
      <rect x="50" y="110" width="70" height="12" rx="3" fill={s.fillAccent} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Thigh pad */}
      <rect x="75" y="78" width="20" height="36" rx="4" fill={s.fillAccent} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Knee hold bar */}
      <rect x="55" y="95" width="60" height="6" rx="2" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Seat post */}
      <rect x="80" y="122" width="12" height="16" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
    </svg>
  );
}

// ---- Seated Row (坐姿划船) ----
function SeatedRowSvg() {
  const s = SVG_BASE;
  return (
    <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Base */}
      <rect x="20" y="138" width="200" height="10" rx="3" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Weight tower */}
      <rect x="175" y="45" width="26" height="93" rx="3" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {[57, 69, 81, 93, 105, 117, 129].map(y => (
        <rect key={y} x="179" y={y} width="18" height="4" fill={s.stroke} opacity="0.3"/>
      ))}
      {/* Top frame */}
      <path d="M188 45 L188 30 L50 30 L50 50" stroke={s.stroke} strokeWidth={s.strokeW} fill="none" strokeLinejoin="round"/>
      {/* Cable */}
      <path d="M188 57 L188 36 L50 36 L50 72" stroke={s.accent} strokeWidth="1.5" fill="none" strokeDasharray="4 2"/>
      {/* Chest pad */}
      <rect x="55" y="55" width="14" height="45" rx="4" fill={s.fillAccent} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Seat */}
      <rect x="70" y="100" width="50" height="12" rx="3" fill={s.fillAccent} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Seat post */}
      <rect x="90" y="112" width="12" height="26" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Handle */}
      <rect x="40" y="72" width="24" height="5" rx="2" fill={s.stroke}/>
      {/* Foot platform */}
      <rect x="25" y="118" width="40" height="8" rx="2" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      <path d="M45 126 L45 138" stroke={s.stroke} strokeWidth={s.strokeW}/>
    </svg>
  );
}

// ---- Close Grip Lat / 剪刀拉背 ----
function CloseLatSvg() {
  const s = SVG_BASE;
  return (
    <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Base */}
      <rect x="40" y="140" width="160" height="8" rx="3" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Tower frame */}
      <path d="M70 140 L70 30 L170 30 L170 140" stroke={s.stroke} strokeWidth={s.strokeW} fill="none" strokeLinejoin="round"/>
      {/* Weight stack on one side */}
      <rect x="150" y="50" width="20" height="90" rx="2" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeThin}/>
      {[60, 72, 84, 96, 108, 120].map(y => (
        <rect key={y} x="154" y={y} width="12" height="3" fill={s.stroke} opacity="0.3"/>
      ))}
      {/* Pulley at top */}
      <circle cx="120" cy="35" r="6" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Cable */}
      <path d="M160 60 L160 40 L120 38 L120 65" stroke={s.accent} strokeWidth="1.5" fill="none" strokeDasharray="4 2"/>
      {/* Narrow V-handle / close grip */}
      <path d="M110 65 L130 65 L125 85 L115 85 Z" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Seat */}
      <rect x="85" y="105" width="50" height="10" rx="3" fill={s.fillAccent} stroke={s.stroke} strokeWidth={s.strokeW}/>
      <rect x="105" y="115" width="12" height="25" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Thigh pad */}
      <rect x="95" y="80" width="20" height="28" rx="3" fill={s.fillAccent} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Scissor arm hint (two arms converging) */}
      <path d="M100 50 L115 65" stroke={s.strokeLight} strokeWidth={s.strokeThin} strokeDasharray="2 2"/>
      <path d="M140 50 L125 65" stroke={s.strokeLight} strokeWidth={s.strokeThin} strokeDasharray="2 2"/>
    </svg>
  );
}

// ---- Biceps Curl Machine (二头肌训练器) ----
function BicepsCurlSvg() {
  const s = SVG_BASE;
  return (
    <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Base */}
      <ellipse cx="120" cy="142" rx="70" ry="7" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Main column */}
      <rect x="150" y="55" width="22" height="87" rx="3" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Weight stack */}
      {[68, 79, 90, 101, 112, 123, 134].map(y => (
        <rect key={y} x="154" y={y} width="14" height="3" fill={s.stroke} opacity="0.3"/>
      ))}
      {/* Seat */}
      <rect x="70" y="90" width="48" height="12" rx="4" fill={s.fillAccent} stroke={s.stroke} strokeWidth={s.strokeW}/>
      <rect x="85" y="102" width="12" height="40" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Preacher pad (斜托垫) */}
      <path d="M55 70 L100 55 L110 75 L65 90 Z" fill={s.fillAccent} stroke={s.stroke} strokeWidth={s.strokeW} strokeLinejoin="round"/>
      {/* Curling arm mechanism */}
      <path d="M115 78 Q130 70 150 68" stroke={s.stroke} strokeWidth={s.strokeW} fill="none" strokeLinecap="round"/>
      {/* Handle bar */}
      <rect x="110" y="73" width="28" height="5" rx="2" fill={s.stroke}/>
      {/* Lever arm indicator */}
      <path d="M150 68 L155 55" stroke={s.stroke} strokeWidth={s.strokeW} strokeLinecap="round"/>
      {/* Motion arc */}
      <path d="M118 78 A 30 30 0 0 1 145 60" stroke={s.accent} strokeWidth="1.5" fill="none" strokeDasharray="3 2"/>
      <polygon points="148,58 142,56 146,63" fill={s.accent}/>
    </svg>
  );
}

// ---- Biceps Curl 2 (肱二头肌训练机 - 另一款) ----
function BicepsCurl2Svg() {
  const s = SVG_BASE;
  return (
    <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Base */}
      <rect x="30" y="138" width="180" height="10" rx="3" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Tower */}
      <rect x="50" y="45" width="24" height="93" rx="3" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {[58, 70, 82, 94, 106, 118, 130].map(y => (
        <rect key={y} x="54" y={y} width="16" height="3" fill={s.stroke} opacity="0.3"/>
      ))}
      {/* Top arm */}
      <path d="M62 45 L62 28 L160 28" stroke={s.stroke} strokeWidth={s.strokeW} fill="none" strokeLinejoin="round"/>
      {/* Pulley */}
      <circle cx="160" cy="34" r="6" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Cable */}
      <path d="M62 58 L62 34 L160 34 L160 60" stroke={s.accent} strokeWidth="1.5" fill="none" strokeDasharray="4 2"/>
      {/* Seat */}
      <rect x="100" y="105" width="55" height="12" rx="4" fill={s.fillAccent} stroke={s.stroke} strokeWidth={s.strokeW}/>
      <rect x="120" y="117" width="14" height="21" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Backrest */}
      <rect x="148" y="60" width="14" height="48" rx="4" fill={s.fillAccent} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Curling bar (EZ bar style) */}
      <path d="M140 60 L150 65 L170 65 L180 60" stroke={s.stroke} strokeWidth={s.strokeW} fill="none" strokeLinejoin="round"/>
      <circle cx="144" cy="62" r="2.5" fill={s.stroke}/>
      <circle cx="176" cy="62" r="2.5" fill={s.stroke}/>
    </svg>
  );
}

// ---- Shoulder Press (坐式举肩) ----
function ShoulderPressSvg() {
  const s = SVG_BASE;
  return (
    <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Base */}
      <ellipse cx="120" cy="142" rx="75" ry="7" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Main support column */}
      <rect x="160" y="50" width="24" height="92" rx="3" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Weight stack */}
      {[62, 73, 84, 95, 106, 117, 128].map(y => (
        <rect key={y} x="164" y={y} width="16" height="3" fill={s.stroke} opacity="0.3"/>
      ))}
      {/* Seat */}
      <rect x="75" y="95" width="50" height="14" rx="4" fill={s.fillAccent} stroke={s.stroke} strokeWidth={s.strokeW}/>
      <rect x="95" y="109" width="12" height="33" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Backrest */}
      <rect x="68" y="45" width="14" height="55" rx="4" fill={s.fillAccent} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Press arms */}
      <path d="M120 85 L120 40" stroke={s.stroke} strokeWidth={s.strokeW} strokeLinecap="round"/>
      <path d="M160 85 L160 40" stroke={s.stroke} strokeWidth={s.strokeW} strokeLinecap="round"/>
      {/* Handles at shoulder height */}
      <rect x="114" y="75" width="12" height="18" rx="3" fill={s.stroke} opacity="0.6"/>
      <rect x="154" y="75" width="12" height="18" rx="3" fill={s.stroke} opacity="0.6"/>
      {/* Top crossbar */}
      <path d="M118 38 L164 38" stroke={s.stroke} strokeWidth={s.strokeW} strokeLinecap="round"/>
      {/* Motion arrow */}
      <path d="M140 65 L140 48" stroke={s.accent} strokeWidth="2" strokeDasharray="3 2" markerEnd="url(#arrUp)"/>
      <defs>
        <marker id="arrUp" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={s.accent}/>
        </marker>
      </defs>
    </svg>
  );
}

// ---- Lateral Raise (侧平举机) ----
function LateralRaiseSvg() {
  const s = SVG_BASE;
  return (
    <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Base */}
      <ellipse cx="120" cy="142" rx="70" ry="7" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Center post */}
      <rect x="112" y="75" width="16" height="67" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Seat */}
      <rect x="92" y="90" width="56" height="14" rx="4" fill={s.fillAccent} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Backrest */}
      <rect x="115" y="55" width="14" height="38" rx="4" fill={s.fillAccent} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Pivot */}
      <circle cx="120" cy="72" r="5" fill={s.stroke} opacity="0.4"/>
      {/* Side arms (raised position) */}
      <path d="M120 72 L55 50 L48 65" stroke={s.stroke} strokeWidth={s.strokeW} fill="none" strokeLinejoin="round" strokeLinecap="round"/>
      <path d="M120 72 L185 50 L192 65" stroke={s.stroke} strokeWidth={s.strokeW} fill="none" strokeLinejoin="round" strokeLinecap="round"/>
      {/* Elbow pads */}
      <ellipse cx="50" cy="58" rx="10" ry="6" fill={s.fillAccent} stroke={s.stroke} strokeWidth={s.strokeW}/>
      <ellipse cx="190" cy="58" rx="10" ry="6" fill={s.fillAccent} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Weight stack */}
      <rect x="165" y="85" width="20" height="57" rx="2" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {[95, 104, 113, 122, 131].map(y => (
        <rect key={y} x="169" y={y} width="12" height="3" fill={s.stroke} opacity="0.3"/>
      ))}
      {/* Motion arcs */}
      <path d="M60 72 A 55 55 0 0 1 78 35" stroke={s.accent} strokeWidth="1.5" fill="none" strokeDasharray="3 2"/>
      <path d="M180 72 A 55 55 0 0 0 162 35" stroke={s.accent} strokeWidth="1.5" fill="none" strokeDasharray="3 2"/>
    </svg>
  );
}

// ---- Cable Tower / 五人站 ----
function CableTowerSvg() {
  const s = SVG_BASE;
  return (
    <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Base */}
      <rect x="30" y="140" width="180" height="8" rx="3" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Left column with weights */}
      <rect x="40" y="20" width="28" height="120" rx="3" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Right column with weights */}
      <rect x="172" y="20" width="28" height="120" rx="3" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Weight stacks */}
      {[35, 47, 59, 71, 83, 95, 107, 119, 131].map(y => (
        <g key={y}>
          <rect x="44" y={y} width="20" height="4" fill={s.stroke} opacity="0.3"/>
          <rect x="176" y={y} width="20" height="4" fill={s.stroke} opacity="0.3"/>
        </g>
      ))}
      {/* Top crossbeam */}
      <rect x="36" y="14" width="168" height="10" rx="2" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Top pulleys */}
      <circle cx="54" cy="28" r="5" fill="#fff" stroke={s.stroke} strokeWidth={s.strokeW}/>
      <circle cx="186" cy="28" r="5" fill="#fff" stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Mid pulleys (adjustable) */}
      <circle cx="54" cy="80" r="5" fill="#fff" stroke={s.stroke} strokeWidth={s.strokeW}/>
      <circle cx="186" cy="80" r="5" fill="#fff" stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Cables crossing */}
      <path d="M54 33 L54 50 L186 110 L186 130" stroke={s.accent} strokeWidth="1.3" fill="none" strokeDasharray="3 2"/>
      <path d="M186 33 L186 50 L54 110 L54 130" stroke={s.accent} strokeWidth="1.3" fill="none" strokeDasharray="3 2"/>
      {/* Handles */}
      <circle cx="54" cy="132" r="6" fill={s.stroke}/>
      <circle cx="186" cy="132" r="6" fill={s.stroke}/>
      {/* Center label area */}
      <rect x="95" y="60" width="50" height="30" rx="4" fill="#fff" stroke={s.strokeLight} strokeWidth={s.strokeThin} strokeDasharray="2 2"/>
      <text x="120" y="78" fontSize="9" textAnchor="middle" fill={s.strokeLight} fontFamily="sans-serif">多功能站</text>
    </svg>
  );
}

// ---- Crunch Machine (卷腹肌) ----
function CrunchSvg() {
  const s = SVG_BASE;
  return (
    <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Base */}
      <ellipse cx="120" cy="142" rx="65" ry="7" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Main column */}
      <rect x="85" y="60" width="18" height="82" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Seat */}
      <rect x="60" y="100" width="50" height="12" rx="4" fill={s.fillAccent} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Backrest */}
      <rect x="52" y="45" width="14" height="60" rx="4" fill={s.fillAccent} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Chest pad / roller (curling forward) */}
      <path d="M103 55 L130 50 L135 65 L108 70 Z" fill={s.fillAccent} stroke={s.stroke} strokeWidth={s.strokeW} strokeLinejoin="round"/>
      {/* Pivot arm */}
      <path d="M130 58 L160 50" stroke={s.stroke} strokeWidth={s.strokeW} strokeLinecap="round"/>
      {/* Weight stack */}
      <rect x="160" y="55" width="22" height="87" rx="3" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {[68, 79, 90, 101, 112, 123, 134].map(y => (
        <rect key={y} x="164" y={y} width="14" height="3" fill={s.stroke} opacity="0.3"/>
      ))}
      {/* Weight selector pin */}
      <circle cx="178" cy="100" r="3" fill={s.accent}/>
      {/* Motion arrow (forward crunch) */}
      <path d="M130 68 Q110 72 100 62" stroke={s.accent} strokeWidth="1.5" fill="none" strokeDasharray="3 2"/>
      <polygon points="98,60 103,66 105,58" fill={s.accent}/>
    </svg>
  );
}

// ---- Leg Press / 倒蹬机 ----
function LegPressSvg() {
  const s = SVG_BASE;
  return (
    <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Base */}
      <rect x="20" y="140" width="200" height="8" rx="3" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* 45° angled frame/sled track */}
      <path d="M50 140 L130 30 L155 38 L75 140 Z" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW} strokeLinejoin="round"/>
      {/* Seat (bottom) */}
      <path d="M30 140 L30 100 L65 100 L65 125 L45 140 Z" fill={s.fillAccent} stroke={s.stroke} strokeWidth={s.strokeW} strokeLinejoin="round"/>
      {/* Backrest */}
      <path d="M30 100 L30 65 L50 62 L50 100 Z" fill={s.fillAccent} stroke={s.stroke} strokeWidth={s.strokeW} strokeLinejoin="round"/>
      {/* Moving sled / foot platform */}
      <rect x="125" y="42" width="28" height="55" rx="3" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW} transform="rotate(-56 139 69)"/>
      {/* Foot plate */}
      <rect x="145" y="35" width="12" height="70" rx="2" fill={s.stroke} opacity="0.4"/>
      {/* Weight horns with plates */}
      <circle cx="145" cy="110" r="10" fill="none" stroke={s.stroke} strokeWidth={s.strokeW}/>
      <circle cx="145" cy="110" r="6" fill={s.stroke} opacity="0.2"/>
      <circle cx="145" cy="128" r="10" fill="none" stroke={s.stroke} strokeWidth={s.strokeW}/>
      <circle cx="145" cy="128" r="6" fill={s.stroke} opacity="0.2"/>
      {/* Angle indicator */}
      <text x="85" y="80" fontSize="11" fill={s.accent} fontFamily="sans-serif" fontWeight="600">45°</text>
      {/* Motion */}
      <path d="M140 95 L155 75" stroke={s.accent} strokeWidth="2" strokeDasharray="3 2"/>
      <polygon points="158,72 152,75 157,79" fill={s.accent}/>
    </svg>
  );
}

// ---- Leg Extension / Leg Curl (坐式伸曲腿) ----
function LegExtCurlSvg() {
  const s = SVG_BASE;
  return (
    <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Base */}
      <rect x="20" y="140" width="200" height="8" rx="3" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Main frame */}
      <rect x="155" y="40" width="26" height="100" rx="3" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Weight stack */}
      {[52, 64, 76, 88, 100, 112, 124].map(y => (
        <rect key={y} x="159" y={y} width="18" height="4" fill={s.stroke} opacity="0.3"/>
      ))}
      {/* Seat */}
      <rect x="70" y="92" width="60" height="14" rx="4" fill={s.fillAccent} stroke={s.stroke} strokeWidth={s.strokeW}/>
      <rect x="95" y="106" width="12" height="34" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Backrest */}
      <rect x="60" y="48" width="16" height="50" rx="4" fill={s.fillAccent} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Leg extension roller pad (front) */}
      <rect x="125" y="98" width="18" height="28" rx="5" fill={s.fillAccent} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Leg curl roller pad (back/under) */}
      <ellipse cx="130" cy="125" rx="9" ry="5" fill={s.fillAccent} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Pivot arm */}
      <path d="M130 110 Q145 110 155 90" stroke={s.stroke} strokeWidth={s.strokeW} fill="none" strokeLinecap="round"/>
      {/* Dual-mode label */}
      <rect x="90" y="68" width="60" height="18" rx="4" fill="#fff" stroke={s.strokeLight} strokeWidth={s.strokeThin} strokeDasharray="2 2"/>
      <text x="120" y="80" fontSize="9" textAnchor="middle" fill={s.strokeLight} fontFamily="sans-serif">伸展 / 弯举 双功能</text>
      {/* Extension motion */}
      <path d="M130 108 A 20 20 0 0 0 145 88" stroke={s.accent} strokeWidth="1.5" fill="none" strokeDasharray="3 2"/>
    </svg>
  );
}

// ---- Hip Ab / Adductor (大腿内外侧) ----
function HipAbSvg() {
  const s = SVG_BASE;
  return (
    <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Base */}
      <ellipse cx="120" cy="142" rx="75" ry="7" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Center column */}
      <rect x="112" y="70" width="16" height="72" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Seat */}
      <rect x="88" y="85" width="64" height="14" rx="4" fill={s.fillAccent} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Backrest */}
      <rect x="113" y="48" width="14" height="40" rx="4" fill={s.fillAccent} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Pivot */}
      <circle cx="120" cy="68" r="5" fill={s.stroke} opacity="0.4"/>
      {/* Leg pads (outward position - abduction) */}
      <path d="M120 68 L45 50 L38 70 L110 82 Z" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW} strokeLinejoin="round"/>
      <path d="M120 68 L195 50 L202 70 L130 82 Z" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW} strokeLinejoin="round"/>
      {/* Inner thigh pads */}
      <rect x="60" y="60" width="12" height="28" rx="4" fill={s.fillAccent} stroke={s.stroke} strokeWidth={s.strokeW}/>
      <rect x="168" y="60" width="12" height="28" rx="4" fill={s.fillAccent} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Outer thigh pads */}
      <rect x="35" y="58" width="10" height="26" rx="3" fill={s.fillAccent} stroke={s.stroke} strokeWidth={s.strokeW}/>
      <rect x="195" y="58" width="10" height="26" rx="3" fill={s.fillAccent} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Weight stack */}
      <rect x="165" y="88" width="20" height="54" rx="2" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {[96, 105, 114, 123, 132].map(y => (
        <rect key={y} x="169" y={y} width="12" height="3" fill={s.stroke} opacity="0.3"/>
      ))}
      {/* In/Out arrows */}
      <path d="M65 48 L85 56" stroke={s.accent} strokeWidth="1.5" strokeDasharray="3 2" markerEnd="url(#arr1)"/>
      <path d="M175 48 L155 56" stroke={s.accent} strokeWidth="1.5" strokeDasharray="3 2" markerEnd="url(#arr2)"/>
      <defs>
        <marker id="arr1" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={s.accent}/>
        </marker>
        <marker id="arr2" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={s.accent}/>
        </marker>
      </defs>
    </svg>
  );
}

// ---- Glute Machine (臀部训练器) ----
function GluteSvg() {
  const s = SVG_BASE;
  return (
    <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Base */}
      <rect x="30" y="140" width="180" height="8" rx="3" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Main frame tower */}
      <rect x="50" y="45" width="26" height="95" rx="3" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Weight stack */}
      {[58, 70, 82, 94, 106, 118, 130].map(y => (
        <rect key={y} x="55" y={y} width="16" height="4" fill={s.stroke} opacity="0.3"/>
      ))}
      {/* Top arm / pivot */}
      <path d="M63 45 L63 28 L180 28" stroke={s.stroke} strokeWidth={s.strokeW} fill="none" strokeLinejoin="round"/>
      {/* Vertical guide */}
      <path d="M180 28 L180 110" stroke={s.stroke} strokeWidth={s.strokeW} strokeLinecap="round"/>
      {/* Cable */}
      <path d="M63 58 L63 36 L180 36 L180 65" stroke={s.accent} strokeWidth="1.5" fill="none" strokeDasharray="4 2"/>
      {/* Seat / kneeling pad */}
      <rect x="110" y="105" width="70" height="14" rx="4" fill={s.fillAccent} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Chest pad / support */}
      <rect x="175" y="60" width="14" height="45" rx="4" fill={s.fillAccent} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Rear foot platform / kick pad */}
      <rect x="165" y="120" width="25" height="8" rx="2" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Ankle strap / pad */}
      <ellipse cx="170" cy="85" rx="14" ry="7" fill={s.fillAccent} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Motion arrow */}
      <path d="M170 95 L170 115" stroke={s.accent} strokeWidth="2" strokeDasharray="3 2"/>
      <polygon points="170,120 165,112 175,112" fill={s.accent}/>
    </svg>
  );
}

// ---- Hack Squat (哈克深蹲机) ----
function HackSquatSvg() {
  const s = SVG_BASE;
  return (
    <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Base */}
      <rect x="20" y="140" width="200" height="8" rx="3" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Angled tracks (steep angle) */}
      <path d="M65 140 L95 40" stroke={s.stroke} strokeWidth={s.strokeW} strokeLinecap="round"/>
      <path d="M175 140 L145 40" stroke={s.stroke} strokeWidth={s.strokeW} strokeLinecap="round"/>
      {/* Top crossbar */}
      <path d="M95 40 L145 40" stroke={s.stroke} strokeWidth={s.strokeW} strokeLinecap="round"/>
      {/* Moving sled / carriage */}
      <path d="M80 85 L160 85 L155 110 L85 110 Z" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW} strokeLinejoin="round"/>
      {/* Back pads on sled */}
      <rect x="95" y="70" width="50" height="18" rx="4" fill={s.fillAccent} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Shoulder pads */}
      <rect x="85" y="65" width="16" height="24" rx="4" fill={s.fillAccent} stroke={s.stroke} strokeWidth={s.strokeW}/>
      <rect x="139" y="65" width="16" height="24" rx="4" fill={s.fillAccent} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Foot platform at bottom */}
      <rect x="55" y="128" width="130" height="12" rx="3" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Weight pegs with plates */}
      <circle cx="60" cy="85" r="8" fill="none" stroke={s.stroke} strokeWidth={s.strokeW}/>
      <circle cx="60" cy="100" r="8" fill="none" stroke={s.stroke} strokeWidth={s.strokeW}/>
      <circle cx="180" cy="85" r="8" fill="none" stroke={s.stroke} strokeWidth={s.strokeW}/>
      <circle cx="180" cy="100" r="8" fill="none" stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Motion arrow */}
      <path d="M120 95 L120 120" stroke={s.accent} strokeWidth="2" strokeDasharray="3 2"/>
      <polygon points="120,125 114,117 126,117" fill={s.accent}/>
    </svg>
  );
}

// ---- Tower Chest Press (塔式推胸) ----
function TowerChestSvg() {
  const s = SVG_BASE;
  return (
    <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Base */}
      <ellipse cx="120" cy="142" rx="70" ry="7" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Center tower column */}
      <rect x="112" y="40" width="16" height="102" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Weight stack at bottom */}
      <rect x="105" y="115" width="30" height="27" rx="2" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {[120, 127, 134].map(y => (
        <rect key={y} x="109" y={y} width="22" height="3" fill={s.stroke} opacity="0.3"/>
      ))}
      {/* Seat */}
      <rect x="70" y="95" width="48" height="14" rx="4" fill={s.fillAccent} stroke={s.stroke} strokeWidth={s.strokeW}/>
      <rect x="88" y="109" width="12" height="33" fill={s.fillLight} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Backrest */}
      <rect x="62" y="50" width="14" height="50" rx="4" fill={s.fillAccent} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Tower arms - converging motion (chest fly style but pushing) */}
      <path d="M120 62 L60 55 L55 75" stroke={s.stroke} strokeWidth={s.strokeW} fill="none" strokeLinejoin="round" strokeLinecap="round"/>
      <path d="M120 62 L180 55 L185 75" stroke={s.stroke} strokeWidth={s.strokeW} fill="none" strokeLinejoin="round" strokeLinecap="round"/>
      {/* Handle pads */}
      <rect x="48" y="65" width="16" height="22" rx="4" fill={s.fillAccent} stroke={s.stroke} strokeWidth={s.strokeW}/>
      <rect x="176" y="65" width="16" height="22" rx="4" fill={s.fillAccent} stroke={s.stroke} strokeWidth={s.strokeW}/>
      {/* Converging motion arrows */}
      <path d="M65 72 Q90 78 110 72" stroke={s.accent} strokeWidth="1.5" fill="none" strokeDasharray="3 2"/>
      <path d="M175 72 Q150 78 130 72" stroke={s.accent} strokeWidth="1.5" fill="none" strokeDasharray="3 2"/>
      <polygon points="113,70 107,74 111,77" fill={s.accent}/>
      <polygon points="127,70 133,74 129,77" fill={s.accent}/>
    </svg>
  );
}

// Register all on window
window.EquipmentSvgs = {
  treadmill: TreadmillSvg,
  elliptical: EllipticalSvg,
  chest_press: ChestPressSvg,
  incline_chest: InclineChestSvg,
  pec_fly: PecFlySvg,
  triceps_lat: TricepsLatSvg,
  lat_pulldown: LatPulldownSvg,
  seated_row: SeatedRowSvg,
  close_lat: CloseLatSvg,
  biceps_curl: BicepsCurlSvg,
  biceps_curl2: BicepsCurl2Svg,
  shoulder_press: ShoulderPressSvg,
  lateral_raise: LateralRaiseSvg,
  cable_tower: CableTowerSvg,
  crunch: CrunchSvg,
  leg_press: LegPressSvg,
  leg_ext_curl: LegExtCurlSvg,
  hip_ab: HipAbSvg,
  glute: GluteSvg,
  hack_squat: HackSquatSvg,
  tower_chest: TowerChestSvg,
};
