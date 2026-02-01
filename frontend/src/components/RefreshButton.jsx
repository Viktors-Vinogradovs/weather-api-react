export default function RefreshButton({ onClick, loading, title = 'Refresh', variant = 'light' }) {
  const styles = variant === 'light'
    ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
    : 'bg-white/20 hover:bg-white/30 text-white';
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg disabled:opacity-50 transition-colors text-sm font-medium ${styles}`}
      title={title}
      aria-label={title}
    >
      <svg
        className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
      <span className="hidden sm:inline">{title}</span>
    </button>
  );
}
