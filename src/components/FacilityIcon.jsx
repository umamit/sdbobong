export default function FacilityIcon({ name, size = 32, color = 'var(--primary)', className = '' }) {
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    className
  };

  switch (name) {
    case 'laptop':
      return (
        <svg {...props}>
          <path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16" />
          <line x1="12" y1="12" x2="12.01" y2="12" />
        </svg>
      );
    case 'book':
      return (
        <svg {...props}>
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
          <path d="M6 6h10" />
          <path d="M6 10h10" />
        </svg>
      );
    case 'firstaid':
      return (
        <svg {...props}>
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="M8 2h8" />
          <path d="M12 8v8" />
          <path d="M8 12h8" />
        </svg>
      );
    case 'toilet':
      return (
        <svg {...props}>
          <path d="M7 12h10a4 4 0 0 1 4 4v1a3 3 0 0 1-3 3h-2a6 6 0 0 1-6-6v-2Z" />
          <path d="M5 4h8a2 2 0 0 1 2 2v6H5V6a2 2 0 0 1 2-2Z" />
          <line x1="10" y1="18" x2="10" y2="22" />
          <line x1="8" y1="22" x2="12" y2="22" />
        </svg>
      );
    case 'gazebo':
      return (
        <svg {...props}>
          <path d="M3 10 12 3l9 7" />
          <path d="M5 10v10" />
          <path d="M19 10v10" />
          <path d="M12 10v10" />
          <path d="M2 20h20" />
        </svg>
      );
    case 'tent':
    case 'field':
    case 'lapangan':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      );
    case 'school':
    default:
      return (
        <svg {...props}>
          <path d="m4 6 8-4 8 4" />
          <path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2" />
          <path d="M14 22v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4" />
          <path d="M18 5v17" />
          <path d="M6 5v17" />
          <circle cx="12" cy="9" r="2" />
        </svg>
      );
  }
}
