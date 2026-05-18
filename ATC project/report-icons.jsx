// Additional icons for the Session Report screen. Re-uses upload-icons.jsx for shared glyphs.

const RIco = ({ size = 18, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"
       fill="none" stroke="currentColor" strokeWidth="1.6"
       strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);

const IconDownload  = (p) => <RIco {...p}><path d="M12 4 V 15" /><path d="M7 11 L 12 16 L 17 11" /><path d="M4 20 H 20" /></RIco>;
const IconChevR     = (p) => <RIco {...p}><path d="M9 6 L 15 12 L 9 18" /></RIco>;
const IconChevD     = (p) => <RIco {...p}><path d="M6 9 L 12 15 L 18 9" /></RIco>;
const IconMessage   = (p) => <RIco {...p}><path d="M4 5 H 20 V 17 H 12 L 7 21 V 17 H 4 Z" /></RIco>;
const IconBarChart  = (p) => <RIco {...p}><path d="M4 20 H 20" /><path d="M7 16 V 10" /><path d="M12 16 V 6" /><path d="M17 16 V 13" /></RIco>;
const IconFile      = (p) => <RIco {...p}><path d="M6 3 H 14 L 19 8 V 21 H 6 Z" /><path d="M14 3 V 8 H 19" /><path d="M9 13 H 16" /><path d="M9 17 H 14" /></RIco>;
const IconPlay2     = (p) => <RIco {...p}><circle cx="12" cy="12" r="8.5" /><path d="M10 8.5 L 16 12 L 10 15.5 Z" /></RIco>;
const IconLightbulb = (p) => <RIco {...p}><path d="M9 17 H 15" /><path d="M10 20 H 14" /><path d="M8 13 A 5 5 0 1 1 16 13 C 15 14 14.5 14.8 14.5 16 H 9.5 C 9.5 14.8 9 14 8 13 Z" /></RIco>;
const IconTrend     = (p) => <RIco {...p}><path d="M3 17 L 9 11 L 13 15 L 21 7" /><path d="M15 7 H 21 V 13" /></RIco>;
const IconSparkle   = (p) => <RIco {...p}><path d="M12 4 V 8" /><path d="M12 16 V 20" /><path d="M4 12 H 8" /><path d="M16 12 H 20" /><path d="M7 7 L 9.5 9.5" /><path d="M14.5 14.5 L 17 17" /><path d="M7 17 L 9.5 14.5" /><path d="M14.5 9.5 L 17 7" /></RIco>;

Object.assign(window, {
  IconDownload, IconChevR, IconChevD, IconMessage,
  IconBarChart, IconFile, IconPlay2, IconLightbulb,
  IconTrend, IconSparkle,
});
