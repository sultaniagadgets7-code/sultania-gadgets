import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a0a0f 0%, #1a0505 50%, #0f0505 100%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
        }}
      >
        {/* Grid pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(220,38,38,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.15) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        {/* Red glow */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '800px',
            height: '400px',
            background: 'radial-gradient(ellipse, rgba(220,38,38,0.3) 0%, transparent 70%)',
          }}
        />

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
          {/* Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(220,38,38,0.2)',
              border: '1px solid rgba(220,38,38,0.4)',
              borderRadius: '100px',
              padding: '8px 20px',
              marginBottom: '32px',
            }}
          >
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#dc2626' }} />
            <span style={{ color: '#fca5a5', fontSize: '14px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Trusted Tech · Pakistan
            </span>
          </div>

          {/* Brand name */}
          <div
            style={{
              fontSize: '72px',
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '-0.04em',
              lineHeight: 1,
              marginBottom: '8px',
            }}
          >
            SULTANIA
          </div>
          <div
            style={{
              fontSize: '72px',
              fontWeight: 900,
              background: 'linear-gradient(135deg, #ef4444, #dc2626, #f97316)',
              backgroundClip: 'text',
              color: 'transparent',
              letterSpacing: '-0.04em',
              lineHeight: 1,
              marginBottom: '32px',
            }}
          >
            GADGETS
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: '24px',
              color: 'rgba(255,255,255,0.6)',
              fontWeight: 500,
              marginBottom: '48px',
              textAlign: 'center',
            }}
          >
            Chargers · Earbuds · Cables · Power Banks
          </div>

          {/* Trust badges */}
          <div style={{ display: 'flex', gap: '24px' }}>
            {['✓ Cash on Delivery', '✓ Tested Before Dispatch', '✓ Ships Nationwide'].map((badge) => (
              <div
                key={badge}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '100px',
                  padding: '10px 20px',
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '16px',
                  fontWeight: 600,
                }}
              >
                {badge}
              </div>
            ))}
          </div>
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '32px',
            color: 'rgba(255,255,255,0.3)',
            fontSize: '16px',
            fontWeight: 600,
            letterSpacing: '0.05em',
          }}
        >
          sultaniagadgets.com
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
