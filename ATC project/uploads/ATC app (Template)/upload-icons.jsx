// Icon set — Lucide-style minimal line icons.

const SW = 1.6; // stroke width
const baseProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: SW,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const Ico = ({ size = 18, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...baseProps}>{children}</svg>
);

const IconHome    = (p) => <Ico {...p}><path d="M3 11 L12 4 L21 11" /><path d="M5 10 V 20 H 19 V 10" /></Ico>;
const IconUpload  = (p) => <Ico {...p}><path d="M12 16 V 5" /><path d="M7 10 L 12 5 L 17 10" /><path d="M4 19 H 20" /></Ico>;
const IconMic     = (p) => <Ico {...p}><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11 a7 7 0 0 0 14 0" /><path d="M12 18 V 21" /></Ico>;
const IconUsers   = (p) => <Ico {...p}><circle cx="9" cy="8" r="3.2" /><path d="M3 20 a6 6 0 0 1 12 0" /><circle cx="17" cy="9" r="2.6" /><path d="M16 20 a5 5 0 0 1 5 -5" /></Ico>;
const IconClock   = (p) => <Ico {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 8 V 12 L 15 13.5" /></Ico>;
const IconSearch  = (p) => <Ico {...p}><circle cx="11" cy="11" r="6.5" /><path d="M16 16 L 20 20" /></Ico>;
const IconCal     = (p) => <Ico {...p}><rect x="3.5" y="5" width="17" height="15" rx="2.4" /><path d="M3.5 10 H 20.5" /><path d="M8 3 V 6" /><path d="M16 3 V 6" /></Ico>;
const IconChev    = (p) => <Ico {...p}><path d="M6 9 L 12 15 L 18 9" /></Ico>;
const IconCheck   = (p) => <Ico {...p}><path d="M5 12 L 10 17 L 19 7" /></Ico>;
const IconX       = (p) => <Ico {...p}><path d="M6 6 L 18 18" /><path d="M18 6 L 6 18" /></Ico>;
const IconAudio   = (p) => <Ico {...p}><path d="M9 9 V 15" /><path d="M6 10.5 V 13.5" /><path d="M12 7 V 17" /><path d="M15 9 V 15" /><path d="M18 10.5 V 13.5" /></Ico>;
const IconCloud   = (p) => <Ico {...p}><path d="M7 18 a5 5 0 0 1 -.5 -9.95 a6 6 0 0 1 11.6 1.45 A 4 4 0 0 1 17 18 Z" /><path d="M12 14 V 8" /><path d="M9 11 L 12 8 L 15 11" /></Ico>;
const IconInfo    = (p) => <Ico {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 11 V 16" /><circle cx="12" cy="8" r="0.6" fill="currentColor" stroke="none" /></Ico>;
const IconHelp    = (p) => <Ico {...p}><circle cx="12" cy="12" r="8.5" /><path d="M9.5 9.5 a 2.5 2.5 0 0 1 5 0 c 0 1.5 -2.5 1.7 -2.5 3.5" /><circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none" /></Ico>;
const IconBell    = (p) => <Ico {...p}><path d="M6 16 V 11 a 6 6 0 0 1 12 0 V 16" /><path d="M4 17 H 20" /><path d="M10 20 a 2 2 0 0 0 4 0" /></Ico>;
const IconList    = (p) => <Ico {...p}><path d="M4 7 H 20" /><path d="M4 12 H 20" /><path d="M4 17 H 20" /></Ico>;
const IconPlay    = (p) => <Ico {...p}><path d="M8 5 L 18 12 L 8 19 Z" /></Ico>;
const IconTrash   = (p) => <Ico {...p}><path d="M4 7 H 20" /><path d="M9 7 V 4 H 15 V 7" /><path d="M6 7 L 7 20 H 17 L 18 7" /></Ico>;
const IconSpark   = (p) => <Ico {...p}><path d="M12 4 L 13.6 9.5 L 19 11 L 13.6 12.5 L 12 18 L 10.4 12.5 L 5 11 L 10.4 9.5 Z" /></Ico>;
const IconHistory = (p) => <Ico {...p}><path d="M4 12 a 8 8 0 1 0 2.4 -5.6" /><path d="M4 4 V 8 H 8" /><path d="M12 8 V 12 L 15 13.5" /></Ico>;

Object.assign(window, {
  IconHome, IconUpload, IconMic, IconUsers, IconClock,
  IconSearch, IconCal, IconChev, IconCheck, IconX,
  IconAudio, IconCloud, IconInfo, IconHelp, IconBell,
  IconList, IconPlay, IconTrash, IconSpark, IconHistory,
});
