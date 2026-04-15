// Google Analytics initialization
export const initGA = () => {
  if (!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  (window as any).dataLayer = (window as any).dataLayer || [];
  function gtag(...args: any[]) {
    (window as any).dataLayer.push(arguments);
  }
  gtag('js', new Date());
  gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);
  (window as any).gtag = gtag;
};

// Meta Pixel initialization
export const initMetaPixel = () => {
  if (!process.env.NEXT_PUBLIC_META_PIXEL_ID) return;

  const script = document.createElement('script');
  script.innerHTML = `
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
    fbq('track', 'PageView');
  `;
  document.head.appendChild(script);

  const noscript = document.createElement('noscript');
  noscript.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_META_PIXEL_ID}&ev=PageView&noscript=1" />`;
  document.body.appendChild(noscript);
};

// Tawk.to initialization - handled by TawkToChat component
export const initTawkTo = () => {
  // Deprecated - Tawk.to is now loaded via TawkToChat component
  return;
};

// Track page views for Meta Pixel
export const trackMetaPixelPageView = () => {
  if ((window as any).fbq) {
    (window as any).fbq('track', 'PageView');
  }
};

// Track GA page views
export const trackGAPageView = (path: string) => {
  if ((window as any).gtag) {
    (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
      page_path: path,
    });
  }
};
