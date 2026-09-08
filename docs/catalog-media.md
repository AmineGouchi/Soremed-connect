# Product media and editorial workflow

Only the experience section and product-media presentation were changed.

## Sources

No manufacturer/product photography was present in `public/`. No external image was scraped or imported. The unbranded SVG pack is original UI artwork, deliberately identical across products: it is a placeholder, never an identification aid or representation of actual packaging.

The existing catalog is demonstration data, not a verified pharmaceutical database. Names, laboratories, prices and stock must be validated before a real launch. No patient, prescription or health-history data was added. Public workflow examples contain only fictional account/document references and order status. Selection of an editorial chapter is ephemeral React state.

## Adding authorized media

`Product.media` accepts `src`, `alt`, `sourceUrl`, `usageRights` and `reviewedAt`. Verify permission independently before filling these fields; a public manufacturer image is not automatically licensed for reuse. Host the approved file locally under `public/products/` and set `src` to its root-relative path. Remote URLs are rejected by the component so browsing a catalog does not send requests to third-party image hosts.

`ProductThumbnail` handles a fixed-ratio loading surface, loaded image, missing asset and image-error fallback. Media changes remount the state by source. `ProductMediaPreview` adds a native modal dialog (Escape, focus containment and focus restoration) to catalog/favorite thumbnails. Reorder and cart share the same renderer.

The public `PharmacyWorkflow` uses three selectable chapters with Up/Down/Home/End keyboard support, labeled tab panels and reduced-motion handling. No autoplay, tracking, additional storage or new animation library.
