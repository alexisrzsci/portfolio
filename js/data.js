/* =========================================================
   PORTFOLIO CONTENT
   ---------------------------------------------------------
   This is the ONLY file where projects and maps are listed.
   The home page cards, the map carousel, maps.html and the
   interactive overview map are all built from it.

   You can edit it by hand, or use the page editor
   (open the site and click "✎ Edit") and then press
   "Download data.js" to replace this file.

   Fields
     site:       name, short, tagline, email, linkedin, github,
                 cv (path to your CV PDF, e.g. assets/CV-Alexis.pdf;
                 empty = the "Download CV" button stays hidden)
     projects[]: id, title, meta, category, image, summary,
                 tags[], url
     maps[]:     id, title, meta, image, short, text[],
                 tool, type, area, tags[], coords [lat, lng],
                 coursework (true = shows a "Coursework" label)
                 gallery[] {src, caption}  (optional, 2+ images)
                 embed     (optional: URL of a web map / qgis2web
                            export / ArcGIS map to show instead
                            of the image)
                 geojson   (optional: path to a .geojson file in
                            /data — drawn on an interactive map)
   ========================================================= */

window.PORTFOLIO = {
  "site": {
    "name": "Alexis Daniel Rodríguez Zambrano",
    "short": "ALEXIS RODRÍGUEZ",
    "tagline": "Environmental Sciences · GIS · Spatial Analysis · Environmental Data",
    "email": "alexisrz.sci@gmail.com",
    "linkedin": "https://www.linkedin.com/in/alexisdanielrodriguez",
    "github": "",
    "cv": ""
  },

  "projects": [
    {
      "id": "ecuador",
      "title": "Food Sovereignty in Ecuador",
      "meta": "Team research project · April 2026",
      "category": "GIS & Society",
      "image": "assets/ecuador-food-sovereignty.png",
      "summary": "An ArcGIS StoryMap connecting Ecuadorian geography, Indigenous food systems, land relations and environmental change, with a proposal for the Pitzer in Ecuador program.",
      "tags": ["ArcGIS StoryMaps", "GIS", "Spatial Storytelling"],
      "url": "ecuador.html"
    },
    {
      "id": "beetles",
      "title": "10-Year Assessment of Beetle Assemblages",
      "meta": "Research assistant · Poster co-author · SCAS 2026",
      "category": "Ecology",
      "image": "assets/beetle-specimens.webp",
      "summary": "Specimen processing, family-level identification and data organisation for a decadal study at the Robert J. Bernard Field Station.",
      "tags": ["Field Ecology", "Taxonomy", "Data Management"],
      "url": "collaborative-research.html"
    },
    {
      "id": "hermit-crab",
      "title": "Hermit Crabs & Microplastic Exposure",
      "meta": "Marine ecology experiment · 2026",
      "category": "Ecology",
      "image": "assets/hermit-crab-photo.jpeg",
      "summary": "Behavioural responses of <em>Pagurus samuelis</em> to nominal microplastic levels. My part: results, figures and statistical interpretation in R.",
      "tags": ["Experimental Design", "R / RStudio", "Statistics"],
      "url": "hermit-crab.html"
    }
  ],

  "maps": [
    {
      "id": "climathon",
      "title": "Renaturalising the Río Segura",
      "meta": "Climathon Murcia · 2025",
      "image": "assets/climathon-map.webp",
      "short": "Multi-criteria distance surface to screen river stretches for renaturalisation.",
      "text": [
        "A multi-criteria distance surface built to find stretches of the Segura river network suited for renaturalisation — far enough from urban núcleos and roads, on workable terrain.",
        "Combines distance rasters from urban centres and the road network with slope, land use, and the river's own drainage layers to screen candidate zones."
      ],
      "tool": "QGIS",
      "type": "Multi-criteria suitability",
      "area": "Segura river, Región de Murcia",
      "tags": ["QGIS", "Raster Analysis", "Hydrology"],
      "coords": [37.99, -1.13]
    },
    {
      "id": "land-suitability",
      "title": "Land Suitability with AHP & TOPSIS",
      "meta": "SIG I · Universidad de Murcia",
      "coursework": true,
      "image": "assets/sigi-land-suitability.png",
      "short": "Weighted multi-criteria model turning terrain, settlement access and land use into a suitability index.",
      "text": [
        "A continuous suitability index built to compare territory through slope, distance to urban areas and land-use conditions.",
        "Criteria were weighted through an Analytic Hierarchy Process (AHP) and combined with TOPSIS in R to map the relative suitability of each location."
      ],
      "tool": "R / QGIS",
      "type": "Multi-criteria decision analysis",
      "area": "Región de Murcia, Spain",
      "tags": ["AHP", "TOPSIS", "R"],
      "coords": [38.1, -1.6]
    },
    {
      "id": "least-cost-route",
      "title": "Least-cost Route Modelling",
      "meta": "SIG I · Universidad de Murcia",
      "coursework": true,
      "image": "assets/sigi-least-cost-route.png",
      "short": "A friction surface from slope and land use to trace the lowest-cost corridor between Caravaca and Cartagena.",
      "text": [
        "A route model between Caravaca and Cartagena that finds the lowest-cost path across the region by treating terrain and land cover as a continuous friction surface.",
        "Land-use classes were reclassified by traversal cost and combined with slope; accumulated cost and movement direction were then used to derive the optimal corridor."
      ],
      "tool": "GRASS GIS / QGIS",
      "type": "Least-cost path analysis",
      "area": "Región de Murcia, Spain",
      "tags": ["Cost Surface", "Terrain Analysis", "Routing"],
      "coords": [37.86, -1.42]
    },
    {
      "id": "forest-connectivity",
      "title": "Forest Fragmentation & Connectivity",
      "meta": "SIG I · Universidad de Murcia",
      "coursework": true,
      "image": "assets/sigi-forest-connectivity.png",
      "short": "Forest-patch identification, area filtering and terrain-based connectivity analysis.",
      "text": [
        "An analysis of forest fragmentation that identifies individual woodland patches and filters those larger than 500 hectares.",
        "The work also models urban proximity and a terrain-cost route between Santomera and Mazarrón, linking patch structure with territorial connectivity."
      ],
      "tool": "GRASS GIS / QGIS",
      "type": "Landscape connectivity analysis",
      "area": "Región de Murcia, Spain",
      "tags": ["Landscape Ecology", "Fragmentation", "Raster Analysis"],
      "coords": [37.84, -1.2]
    },
    {
      "id": "recreation-centre",
      "title": "Locating a Recreational Centre",
      "meta": "SIG I · Universidad de Murcia",
      "coursework": true,
      "image": "assets/sigi-recreation-centre.png",
      "short": "Constraint-based site selection combining land use, slope, runoff, proximity and minimum area.",
      "text": [
        "A multi-layer suitability model developed to identify parcels for a recreational facility in Lorca, Bajo Guadalentín and Mazarrón.",
        "It combines compatible land use, proximity to towns over 10,000 inhabitants, slopes below 15%, runoff below 20%, and a minimum site area of 50 hectares."
      ],
      "tool": "GRASS GIS / QGIS",
      "type": "Constraint suitability analysis",
      "area": "Región de Murcia, Spain",
      "tags": ["Map Algebra", "Site Selection", "Raster Analysis"],
      "coords": [37.62, -1.55]
    },
    {
      "id": "gis-toolkit",
      "title": "Spatial SQL & Terrain Statistics in R",
      "meta": "SIG I · Universidad de Murcia",
      "coursework": true,
      "image": "assets/sigi-sql-result-map.png",
      "short": "Spatial database queries in QGIS DB Manager and a reproducible terrain-statistics workflow in RStudio.",
      "text": [
        "Spatial SQL queries in QGIS DB Manager (SpatiaLite) to filter, relate and create new layers from municipal and hydrological datasets — for example, the aquifers crossed by the Segura river network.",
        "A reproducible RStudio workflow mapping the terrain raster with municipal boundaries and comparing slope distributions across land-use categories. Use the arrows to move through the four figures."
      ],
      "tool": "SQL · R / RStudio",
      "type": "Spatial database & statistical analysis",
      "area": "Segura Basin & Región de Murcia",
      "tags": ["Spatial SQL", "R", "Spatial Statistics"],
      "coords": [38.25, -1.75],
      "gallery": [
        { "src": "assets/sigi-sql-query.png", "caption": "Spatial SQL query in QGIS DB Manager" },
        { "src": "assets/sigi-sql-result-map.png", "caption": "Result: aquifers crossed by the Segura river network" },
        { "src": "assets/sigi-rstudio-interface.webp", "caption": "Terrain analysis workflow in RStudio" },
        { "src": "assets/sigi-rstudio-figure10.png", "caption": "Terrain raster with municipal boundaries" }
      ]
    }
  ]
};
