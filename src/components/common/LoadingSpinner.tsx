export function LoadingSpinner() {
  return (
    <div className="loading" role="status" aria-label="Loading">
      <div className="loading__spinner" />
      <p className="loading__text">Loading your adventures...</p>
    </div>
  );
}
