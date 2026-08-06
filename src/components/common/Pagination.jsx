/* ============================================
   Pagination — page navigation component
   ============================================ */
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  totalItems,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
  className = '',
}) => {
  if (totalPages <= 1) return null;

  // Generate page numbers with ellipsis
  const getPages = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (currentPage > 3) pages.push('...');

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push('...');

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      {/* Info */}
      <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="px-2 py-1 rounded-md border border-[var(--border-color)] bg-[var(--input-bg)] text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        )}
        {totalItems !== undefined && (
          <span>
            Showing {Math.min((currentPage - 1) * pageSize + 1, totalItems)} - {Math.min(currentPage * pageSize, totalItems)} of {totalItems}
          </span>
        )}
      </div>

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeftIcon style={{ fontSize: 20 }} />
        </button>

        {getPages().map((page, i) => (
          <button
            key={i}
            onClick={() => typeof page === 'number' ? onPageChange(page) : null}
            disabled={page === '...'}
            className={`
              min-w-[36px] h-9 px-2 rounded-lg text-sm font-medium transition-all duration-200
              ${page === currentPage
                ? 'bg-primary-600 text-white shadow-sm'
                : page === '...'
                  ? 'cursor-default text-[var(--text-tertiary)]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]'
              }
            `}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <ChevronRightIcon style={{ fontSize: 20 }} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
