// Admin-specific icons. Reuses Lucide-style minimal line glyphs.

const AIco = ({ size = 18, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"
       fill="none" stroke="currentColor" strokeWidth="1.6"
       strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);

const IconDots       = (p) => <AIco {...p}><circle cx="12" cy="6"  r="1.3" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" /><circle cx="12" cy="18" r="1.3" fill="currentColor" stroke="none" /></AIco>;
const IconPlus       = (p) => <AIco {...p}><path d="M12 5 V 19" /><path d="M5 12 H 19" /></AIco>;
const IconMail       = (p) => <AIco {...p}><rect x="3.5" y="5" width="17" height="14" rx="2.2" /><path d="M3.5 7 L 12 13 L 20.5 7" /></AIco>;
const IconFilter     = (p) => <AIco {...p}><path d="M4 5 H 20" /><path d="M7 11 H 17" /><path d="M10 17 H 14" /></AIco>;
const IconSettings   = (p) => <AIco {...p}><circle cx="12" cy="12" r="3" /><path d="M19 12 L 21 12" /><path d="M3 12 L 5 12" /><path d="M12 3 L 12 5" /><path d="M12 19 L 12 21" /><path d="M5.6 5.6 L 7 7" /><path d="M17 17 L 18.4 18.4" /><path d="M5.6 18.4 L 7 17" /><path d="M17 7 L 18.4 5.6" /></AIco>;
const IconShield     = (p) => <AIco {...p}><path d="M12 3 L 19 6 V 12 C 19 16 16 19 12 21 C 8 19 5 16 5 12 V 6 Z" /></AIco>;
const IconDashboard  = (p) => <AIco {...p}><rect x="3.5" y="3.5" width="7" height="9" rx="1.5" /><rect x="13.5" y="3.5" width="7" height="5" rx="1.5" /><rect x="13.5" y="11.5" width="7" height="9" rx="1.5" /><rect x="3.5" y="15.5" width="7" height="5" rx="1.5" /></AIco>;
const IconEdit       = (p) => <AIco {...p}><path d="M4 20 H 9 L 19 10 L 14 5 L 4 15 Z" /><path d="M14 5 L 19 10" /></AIco>;
const IconEye        = (p) => <AIco {...p}><path d="M2 12 C 5 6 9 4 12 4 C 15 4 19 6 22 12 C 19 18 15 20 12 20 C 9 20 5 18 2 12 Z" /><circle cx="12" cy="12" r="3" /></AIco>;
const IconBan        = (p) => <AIco {...p}><circle cx="12" cy="12" r="8.5" /><path d="M6 6 L 18 18" /></AIco>;
const IconExt        = (p) => <AIco {...p}><path d="M14 4 H 20 V 10" /><path d="M20 4 L 12 12" /><path d="M19 14 V 19 H 5 V 5 H 10" /></AIco>;
const IconBook       = (p) => <AIco {...p}><path d="M5 4 H 12 V 20 H 5 A 1 1 0 0 1 5 19 Z" /><path d="M12 4 H 19 V 20 H 12" /><path d="M12 4 V 20" /></AIco>;
const IconArrowUp    = (p) => <AIco {...p}><path d="M12 19 V 5" /><path d="M6 11 L 12 5 L 18 11" /></AIco>;
const IconArrowDown  = (p) => <AIco {...p}><path d="M12 5 V 19" /><path d="M6 13 L 12 19 L 18 13" /></AIco>;
const IconExport     = (p) => <AIco {...p}><path d="M12 16 V 4" /><path d="M7 9 L 12 4 L 17 9" /><path d="M5 17 V 20 H 19 V 17" /></AIco>;

Object.assign(window, {
  IconDots, IconPlus, IconMail, IconFilter, IconSettings,
  IconShield, IconDashboard, IconEdit, IconEye, IconBan,
  IconExt, IconBook, IconArrowUp, IconArrowDown, IconExport,
});
