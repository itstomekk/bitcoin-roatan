export function BTCMapEmbed() {
  return (
    <div className="-mx-4 sm:-mx-6 md:-mx-8 lg:-mx-12 xl:-mx-16 2xl:-mx-20">
      <iframe
        id="btcmap"
        title="BTC Map"
        width="100%"
        height="520"
        allowFullScreen
        allow="geolocation"
        src="https://btcmap.org/map#16/16.3650/-86.4650"
        className="border-0"
      />
    </div>
  );
}
