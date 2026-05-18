// Subtle geometric SVG patterns for the brand panel.
// Each component renders an absolutely-positioned SVG that fills its parent.

function PatternSolid() {
  return null;
}

function PatternDots() {
  return (
    <svg className="pattern" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <pattern id="p-dots" width="28" height="28" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.09)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#p-dots)" />
    </svg>
  );
}

function PatternGrid() {
  return (
    <svg className="pattern" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <pattern id="p-grid" width="56" height="56" patternUnits="userSpaceOnUse">
          <path d="M 56 0 L 0 0 0 56" fill="none" stroke="rgba(255,255,255,0.045)" strokeWidth="1" />
        </pattern>
        <pattern id="p-grid-2" width="280" height="280" patternUnits="userSpaceOnUse">
          <path d="M 280 0 L 0 0 0 280" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#p-grid)" />
      <rect width="100%" height="100%" fill="url(#p-grid-2)" />
    </svg>
  );
}

// Korean-inspired concentric arcs — calm, ceremonial
function PatternArcs() {
  return (
    <svg className="pattern" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMaxYMin slice" viewBox="0 0 800 900" aria-hidden="true">
      <g fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1">
        {Array.from({ length: 18 }).map((_, i) => (
          <circle key={i} cx="780" cy="120" r={80 + i * 70} />
        ))}
      </g>
      <g fill="none" stroke="rgba(110,168,255,0.10)" strokeWidth="1">
        {Array.from({ length: 6 }).map((_, i) => (
          <circle key={i} cx="120" cy="820" r={60 + i * 90} />
        ))}
      </g>
    </svg>
  );
}

// Diagonal hairlines — geometric, Korean editorial
function PatternLines() {
  return (
    <svg className="pattern" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <pattern id="p-lines" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <line x1="0" y1="0" x2="0" y2="14" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#p-lines)" />
    </svg>
  );
}

// A clean wordmark "K" — placeholder for K-Lab corporate mark, oversized at the bottom
function PatternKMark() {
  return (
    <svg className="pattern" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMaxYMax slice" viewBox="0 0 800 900" aria-hidden="true">
      <defs>
        <pattern id="p-fine" width="56" height="56" patternUnits="userSpaceOnUse">
          <path d="M 56 0 L 0 0 0 56" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#p-fine)" />
      <text x="780" y="900" textAnchor="end"
        fontFamily="Inter, sans-serif"
        fontSize="780" fontWeight="700"
        letterSpacing="-0.04em"
        fill="rgba(255,255,255,0.035)">K</text>
    </svg>
  );
}

function Pattern({ kind }) {
  switch (kind) {
    case 'dots':  return <PatternDots />;
    case 'grid':  return <PatternGrid />;
    case 'arcs':  return <PatternArcs />;
    case 'lines': return <PatternLines />;
    case 'kmark': return <PatternKMark />;
    case 'solid':
    default:      return <PatternSolid />;
  }
}

window.Pattern = Pattern;
