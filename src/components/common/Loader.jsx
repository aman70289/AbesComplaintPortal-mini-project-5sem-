/* ============================================
   Loader — spinner and full-page loader
   ============================================ */

export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12', xl: 'w-16 h-16' };

  return (
    <div className={`${sizes[size]} ${className}`} role="status" aria-label="Loading">
      <svg className="animate-spin w-full h-full text-primary-600" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

const Loader = ({ text = 'Loading...' }) => (
  <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[var(--bg-primary)]/80 backdrop-blur-sm">
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary-200 rounded-full" />
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary-600 rounded-full border-t-transparent animate-spin" />
      </div>
      <p className="text-sm font-medium text-[var(--text-secondary)]">{text}</p>
    </div>
  </div>
);

export default Loader;
