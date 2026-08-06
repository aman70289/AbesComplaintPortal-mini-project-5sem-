/* ============================================
   Breadcrumb — auto-generated from route path
   ============================================ */
import { Link, useLocation } from 'react-router-dom';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import HomeIcon from '@mui/icons-material/Home';

const Breadcrumb = ({ items, className = '' }) => {
  const location = useLocation();

  // Auto-generate from path if no items provided
  const breadcrumbs = items || location.pathname
    .split('/')
    .filter(Boolean)
    .map((segment, index, arr) => ({
      label: segment
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase()),
      path: '/' + arr.slice(0, index + 1).join('/'),
      isLast: index === arr.length - 1,
    }));

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb" className={`flex items-center gap-1.5 text-sm ${className}`}>
      <Link
        to="/"
        className="text-[var(--text-tertiary)] hover:text-primary-600 transition-colors"
        aria-label="Home"
      >
        <HomeIcon style={{ fontSize: 18 }} />
      </Link>

      {breadcrumbs.map((crumb, i) => (
        <div key={crumb.path} className="flex items-center gap-1.5">
          <ChevronRightIcon className="text-[var(--text-tertiary)]" style={{ fontSize: 16 }} />
          {crumb.isLast ? (
            <span className="font-medium text-[var(--text-primary)]" aria-current="page">
              {crumb.label}
            </span>
          ) : (
            <Link
              to={crumb.path}
              className="text-[var(--text-tertiary)] hover:text-primary-600 transition-colors"
            >
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;
