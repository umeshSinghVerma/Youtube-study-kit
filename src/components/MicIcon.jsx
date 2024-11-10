import React from 'react';

const MicIcon = (props) => (
  <span className="yt-icon-shape style-scope yt-icon yt-spec-icon-shape" {...props}>
    <div style={{ width: '100%', height: '100%', display: 'block', fill: 'currentColor' }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24"
        viewBox="0 0 24 24"
        width="24"
        focusable="false"
        aria-hidden="true"
        style={{ pointerEvents: 'none', display: 'inherit', width: '100%', height: '100%' }}
      >
        <path d="M12 3c-1.66 0-3 1.37-3 3.07v5.86c0 1.7 1.34 3.07 3 3.07s3-1.37 3-3.07V6.07C15 4.37 13.66 3 12 3zm6.5 9h-1c0 3.03-2.47 5.5-5.5 5.5S6.5 15.03 6.5 12h-1c0 3.24 2.39 5.93 5.5 6.41V21h2v-2.59c3.11-.48 5.5-3.17 5.5-6.41z" />
      </svg>
    </div>
  </span>
);

export default MicIcon;
