import React, { useEffect } from "react";

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    adsbygoogle: any;
  }
}

const hostname = "kakebo.pages.dev";

export const Adsense = () => {
  const adClient = process.env.REACT_APP_AD_CLIENT;
  const adSlot = process.env.REACT_APP_AD_SLOT;
  useEffect(() => {
    if (window.location.hostname === hostname) {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    }
  }, []);

  return (
    <div>
      {window.location.hostname === hostname ? (
        <ins
          className="adsbygoogle"
          style={{ display: "block", textAlign: "center" }}
          data-ad-layout="in-article"
          data-ad-format="fluid"
          data-ad-client={adClient}
          data-ad-slot={adSlot}
        ></ins>
      ) : (
        <div style={{ padding: "10px", border: "1px solid #333" }}>広告</div>
      )}
    </div>
  );
};
