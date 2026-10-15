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
     projects[]: id, title, meta, category, image, summary,
                 tags[], url
     maps[]:     id, title, meta, image, short, text[],
                 tool, type, area, tags[], coords [lat, lng],
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
    "tagline": "Geospatial · GIS · Data Science · Environmental Research",
    "email": "alexisrz.sci@gmail.com",
    "linkedin": "https://www.linkedin.com/in/alexisdanielrodriguez",
    "github": ""
  },

  "projects": [
    {
      "id": "ecuador",
      "title": "Food Sovereignty in Ecuador",
      "meta": "Interdisciplinary Research · April 2026",
      "category": "GIS & Society",
      "image": "assets/ecuador-food-sovereignty.png",
      "summary": "Food sovereignty through Ecuadorian geography, Indigenous food systems, land relations, environmental change and grassroots organizing.",
      "tags": ["ArcGIS StoryMaps", "GIS", "Spatial Visualization"],
      "url": "ecuador.html"
    },
    {
      "id": "hermit-crab",
      "title": "Hermit Crabs & Microplastic Exposure",
      "meta": "Marine Ecology · Experimental Research · 2026",
      "category": "Ecology",
      "image": "assets/hermit-crab-photo.jpeg",
      "summary": "A controlled experiment on the behavioural responses of <em>Pagurus samuelis</em> to nominal microplastic exposure levels, analysed and visualised in R.",
      "tags": ["Marine Ecology", "R / RStudio", "Data Analysis"],
      "url": "hermit-crab.html"
    },
    {
      "id": "beetles",
      "title": "10-Year Assessment of Beetle Assemblages",
      "meta": "Collaborative Research · Arthropod Ecology · 2026",
      "category": "Ecology",
      "image": "assets/beetle-specimens.jpeg",
      "summary": "Research assistant and poster co-author: specimen processing, family-level identification and data management for a decadal study at the Robert J. Bernard Field Station.",
      "tags": ["Field Research", "Taxonomy", "Data Management"],
      "url": "collaborative-research.html"
    }
  ],

  "maps": [
    {
      "id": "climathon",
      "title": "Renaturalising the Río Segura",
      "meta": "Climathon Murcia · 2025",
      "image": "assets/climathon-map.png",
      "short": "Multi-criteria suitability analysis for river renaturalisation zones.",
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
      "id": "recreation-centre",
      "title": "Locating a Recreational Centre",
      "meta": "SIG I · Universidad de Murcia",
      "image": "assets/sigi-recreation-centre.png",
      "short": "Multi-layer suitability analysis to identify viable sites for a new recreational facility.",
      "text": [
        "A multi-layer suitability model developed to identify parcels for a recreational facility in Lorca, Bajo Guadalentín and Mazarrón.",
        "It combines compatible land use, proximity to towns over 10,000 inhabitants, slopes below 15%, runoff below 20%, and a minimum site area of 50 hectares."
      ],
      "tool": "GRASS GIS / QGIS",
      "type": "Constraint suitability analysis",
      "area": "Región de Murcia, Spain",
      "tags": ["Raster Analysis", "Map Algebra", "Site Selection"],
      "coords": [37.62, -1.55]
    },
    {
      "id": "least-cost-route",
      "title": "Least-cost Route Modelling",
      "meta": "SIG I · Universidad de Murcia",
      "image": "assets/sigi-least-cost-route.png",
      "short": "A friction surface combining slope and land use to trace the lowest-cost corridor.",
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
      "id": "land-suitability",
      "title": "Land Suitability Assessment",
      "meta": "SIG I · Universidad de Murcia",
      "image": "assets/sigi-land-suitability.png",
      "short": "Weighted multi-criteria model translating terrain, settlement access and land use into a suitability index.",
      "text": [
        "A continuous suitability index built to compare territory through slope, distance to urban areas and land-use conditions.",
        "Criteria were weighted through an Analytic Hierarchy Process (AHP) and combined with TOPSIS in R to map the relative suitability of each location."
      ],
      "tool": "R / QGIS",
      "type": "Multi-criteria decision analysis",
      "area": "Región de Murcia, Spain",
      "tags": ["AHP", "TOPSIS", "Suitability Modelling"],
      "coords": [38.1, -1.6]
    },
    {
      "id": "forest-connectivity",
      "title": "Forest Fragmentation & Connectivity",
      "meta": "SIG I · Universidad de Murcia",
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
      "id": "sql-queries",
      "title": "Spatial SQL Queries",
      "meta": "SIG I · Universidad de Murcia",
      "image": "assets/sigi-sql-spatial-query.png",
      "short": "Database queries and spatial relationships analysed with QGIS DB Manager.",
      "text": [
        "A set of database queries developed in QGIS DB Manager to filter, relate and create new geographic layers from municipal and environmental datasets.",
        "Use the arrows or dots to switch between the SQL interface and the final selected layer."
      ],
      "tool": "QGIS DB Manager / SQL",
      "type": "Spatial database analysis",
      "area": "Segura Basin, Spain",
      "tags": ["SQL", "Spatial Queries", "PostGIS Concepts"],
      "coords": [38.25, -1.75],
      "gallery": [
        { "src": "assets/sigi-sql-query.png", "caption": "SQL query in DB Manager" },
        { "src": "assets/sigi-sql-result-map.png", "caption": "Final spatial query result" }
      ]
    },
    {
      "id": "rstudio-analysis",
      "title": "Terrain Statistics in R",
      "meta": "SIG I · Universidad de Murcia",
      "image": "assets/sigi-rstudio-analysis.png",
      "short": "R-based exploration of slope distributions across land-use categories.",
      "text": [
        "A reproducible RStudio workflow mapping the terrain raster with municipal boundaries and comparing slope distributions across land-use categories.",
        "Use the arrows or dots to switch between the RStudio workflow and its final map output."
      ],
      "tool": "R / RStudio",
      "type": "Spatial statistical analysis",
      "area": "Región de Murcia, Spain",
      "tags": ["RStudio", "Spatial Statistics", "Data Visualisation"],
      "coords": [37.95, -1.85],
      "gallery": [
        { "src": "assets/sigi-rstudio-interface.png", "caption": "Analysis in RStudio" },
        { "src": "assets/sigi-rstudio-figure10.png", "caption": "Final terrain map" }
      ]
    }
  ]
};
