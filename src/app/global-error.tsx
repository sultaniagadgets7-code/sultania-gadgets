'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', padding: '20px' }}>
          <div style={{ textAlign: 'center', maxWidth: '400px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Something went wrong</h1>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '16px' }}>
              {error?.message || 'An unexpected error occurred.'}
            </p>
            {error?.digest && (
              <p style={{ color: '#999', fontSize: '12px', fontFamily: 'monospace', marginBottom: '16px' }}>
                Error ID: {error.digest}
              </p>
            )}
            <button
              onClick={reset}
              style={{ background: '#0a0a0a', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '999px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
