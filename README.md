# Portfolio — how it is organised

```
portfolio/
├── index.html                  Home: About me → Maps → Projects → Research → Contact
├── maps.html                   Interactive overview map + every map in detail
├── ecuador.html                ┐
├── hermit-crab.html            ├ Project pages
├── collaborative-research.html ┘
├── project-template.html       Copy this to start a new project page
├── css/style.css               ONE stylesheet for every page
├── js/data.js                  ONE list of projects, maps and contact details
├── js/main.js                  Top bar, side index, footer, cards, maps, lightbox
├── js/editor.js                The "✎ Edit" mode
├── data/                       GeoJSON layers for interactive maps
└── assets/                     All images
```

## Rules that avoid the old problems

* The top bar, side index and footer are written **once** (in `js/main.js`) and
  drawn on every page, so they can never get out of sync between pages.
* Every card is **one** link that covers the whole card (image, title, text).
  There are no links inside links, so a click always goes where you expect.
* Anything with an `id` stops below the top bar, so headings are never hidden.
* Every file starts with `<!DOCTYPE html>`. (The old files had the word
  `Portfolio` before it and a stray ```` ``` ```` at the end; that switches the
  browser into "quirks mode" and can break the layout.)

## After changing css/ or js/ files

Browsers keep old CSS/JS for a while. In every `.html`, raise the number in
`style.css?v=3`, `main.js?v=3`, etc. (e.g. to `?v=4`) so visitors get the new
version straight away.

## Editing from the page

1. Open `index.html` on your computer (double-click) and press **✎ Edit**
   (bottom-left). Online, add `?edit` to the address to see the button.
2. **Text** in dashed areas: just type. Click an image to change its file,
   Ctrl+click a link to change its address.
3. **Projects / maps**: click a card (or **+ Project / + Map**) to edit, delete or
   reorder. Images must be copied into `assets/`.
4. Make it permanent:
   * **Download data.js** → replace `js/data.js` (projects, maps, contact).
   * **Download this page** → replace that `.html` file (text on the page).
5. Commit and push to GitHub as usual.

## Adding your CV

Put the PDF in `assets/` (e.g. `assets/CV-Alexis.pdf`), then in the editor
open **Contact details** and fill in **CV file** (or set `"cv"` in `js/data.js`).
The "Download CV" button on the home page appears automatically.

## Exporting a map properly from QGIS

A GIS portfolio is judged on cartography. For each map:

1. **Project → New Print Layout**, add the map.
2. Add **title, legend, scale bar, north arrow, source/CRS note** (EPSG:25830).
3. **Layout → Export as Image** (PNG, 200–300 dpi), save into `assets/`.
4. In the editor, click the map card and change **Image**.

## Adding an interactive map

* In the editor, a map has three options: an image, a **GeoJSON** file
  (QGIS → right-click layer → Export → Save Features As → GeoJSON, CRS
  **EPSG:4326**, save into `data/`), or an **embed** URL (qgis2web export
  published online, ArcGIS Online web map, Felt…).
* Its `coords` place a point on the overview map in `maps.html`.
* GeoJSON files load when the site is online (GitHub Pages). Browsers block
  them when you open the file by double-clicking — use the online site or
  VS Code's "Live Server" to preview them.
