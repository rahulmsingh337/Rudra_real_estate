/* Content the client controls. Edit this file only; no other code changes needed. */
window.SITE = {
  /* RERA registration number. Leave empty to hide. Shown under the stats and in the footer. */
  rera: '',

  /* Business stats. Set to null to keep the defaults in index.html, or provide verified figures:
     [{ value: '12+', label: 'Years in business' }, ...]  (4 items look best) */
  stats: null,

  /* Project / property photos. The "Projects" section appears automatically when there are 3 or more.
     Put WebP files in assets/photos/ (run scripts/optimize-photos.py to prepare them), then list them:
     { src: 'assets/photos/sector-137-tower.webp', title: 'Tower name', place: 'Sector 137, Noida', alt: 'Describe the photo' } */
  photos: []
};
