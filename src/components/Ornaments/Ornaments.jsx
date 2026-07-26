import './Ornaments.css';

/**
 * The cross-and-laurel emblem used at the top of every panel. This is the
 * exact image supplied for the design — not a redrawn approximation.
 */
export function CrossEmblem({ className = '' }) {
  return (
    <img
      src="/cross-emblem.png"
      alt=""
      className={`ornament-cross ${className}`.trim()}
    />
  );
}

/**
 * A small ornamental rule: solid line — dot — diamond — dot — solid line.
 * Crisp gold throughout (no fade), matching a printed invitation's rule.
 */
export function Divider({ className = '' }) {
  return (
    <div className={`ornament-divider ${className}`.trim()} role="presentation">
      <span className="ornament-divider__line" />
      <span className="ornament-divider__dot" />
      <span className="ornament-divider__mark" aria-hidden="true" />
      <span className="ornament-divider__dot" />
      <span className="ornament-divider__line" />
    </div>
  );
}

export function HeartMark({ className = '' }) {
  return (
    <svg
      className={`ornament-heart ${className}`.trim()}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12 20.5c-.3 0-.6-.1-.8-.3C6.4 16.4 3 13.2 3 9.6 3 6.8 5.1 4.7 7.7 4.7c1.5 0 2.9.7 3.8 1.9.9-1.2 2.3-1.9 3.8-1.9 2.6 0 4.7 2.1 4.7 4.9 0 3.6-3.4 6.8-8.2 10.6-.2.2-.5.3-.8.3Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * A small gilded corner accent for the border frame — a nested curl with a
 * single jewel point, rotated per-corner by the caller.
 */
export function CornerFlourish({ className = '' }) {
  return (
    <svg
      className={`ornament-corner ${className}`.trim()}
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M3 29C3 14 14 3 29 3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M3 20C3 10.6 10.6 3 20 3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.6"
      />
      <circle cx="3" cy="29" r="2.1" fill="currentColor" />
    </svg>
  );
}

/**
 * Renders all four corner flourishes at once — drop this once as a child
 * of any `position: relative` panel to frame it.
 */
export function PanelCorners() {
  return (
    <>
      <CornerFlourish className="ornament-corner--tl" />
      <CornerFlourish className="ornament-corner--tr" />
      <CornerFlourish className="ornament-corner--bl" />
      <CornerFlourish className="ornament-corner--br" />
    </>
  );
}

const ICON_PATHS = {
  calendar: (
    <>
      <rect x="4" y="5.5" width="16" height="15" rx="2.4" />
      <path d="M4 10h16" />
      <path d="M8 3v4.5M16 3v4.5" strokeLinecap="round" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  church: (
    <>
      <path d="M12 3.2v3.3M10.3 4.8h3.4" strokeLinecap="round" />
      <path d="M12 6.5 20 12v8.5H4V12l8-5.5Z" strokeLinejoin="round" />
      <path d="M10 20.5v-6h4v6" />
      <path d="M4 20.5h16" strokeLinecap="round" />
    </>
  ),
  utensils: (
    <>
      <path d="M8 3.5v6.2a2 2 0 0 0 2 2v0a2 2 0 0 0 2-2V3.5" strokeLinecap="round" />
      <path d="M10 11.7V20.5" strokeLinecap="round" />
      <path d="M16 3.5c-1.2 0-2.1 1.6-2.1 3.6s.9 3.6 2.1 3.6v9.8" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-6.6 7-12a7 7 0 0 0-14 0c0 5.4 7 12 7 12Z" strokeLinejoin="round" />
      <circle cx="12" cy="9" r="2.4" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8.2" r="3.6" />
      <path d="M5 20c1-3.6 4-5.6 7-5.6s6 2 7 5.6" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
};

/**
 * Circular gold-outlined badge with a simple line-art icon inside,
 * matching the icon treatment on the printed invitation this is based on.
 */
export function IconBadge({ icon, className = '', size = 'md' }) {
  const path = ICON_PATHS[icon];

  return (
    <span className={`icon-badge icon-badge--${size} ${className}`.trim()} aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        {path}
      </svg>
    </span>
  );
}

/**
 * A bare line-art icon with no badge chrome, sized to sit inline inside
 * buttons and labels.
 */
export function Icon({ icon, className = '' }) {
  const path = ICON_PATHS[icon];

  return (
    <svg
      className={`ornament-icon ${className}`.trim()}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      {path}
    </svg>
  );
}
