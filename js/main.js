/* =========================================================
   SHARED BEHAVIOUR — loaded by every page
   ---------------------------------------------------------
   Builds the parts that must be identical everywhere
   (top bar, side index, footer) and the parts that come
   from js/data.js (project cards, map carousel, map list,
   interactive maps). Nothing here needs editing to add a
   project or a map: change data.js instead.

   Placeholders in the HTML:  <div data-render="NAME"></div>
     topbar · footer · projects · project-filters
     map-carousel · map-list · overview-map · pager
   ========================================================= */

(function () {
    "use strict";

    var DRAFT_KEY = "portfolio-draft-v1";

    /* ---------- data (+ local draft from the editor) ---------- */

    function loadData() {
        try {
            var draft = localStorage.getItem(DRAFT_KEY);
            if (draft) return { data: JSON.parse(draft), isDraft: true };
        } catch (e) { /* storage blocked: ignore */ }
        return { data: JSON.parse(JSON.stringify(window.PORTFOLIO)), isDraft: false };
    }

    var loaded = loadData();
    var DATA = loaded.data;

    /* ---------- helpers ---------- */

    function esc(s) {
        return String(s == null ? "" : s)
            .replace(/&/g, "&amp;").replace(/</g, "&lt;")
            .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }
    function $(sel, root) { return (root || document).querySelector(sel); }
    function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
    function slots(name) { return $all('[data-render="' + name + '"]'); }

    var PAGE = document.body.getAttribute("data-page") || "project";
    var HOME = PAGE === "home" ? "" : "index.html";

    /* Site-wide links. Change them here once and every page follows. */
    function siteLinks() {
        return [
            { label: "About", href: HOME + "#about", key: "home" },
            { label: "Maps", href: "maps.html", key: "maps" },
            { label: "Projects", href: HOME + "#projects", key: "project" },
            { label: "Research", href: HOME + "#research", key: "research" },
            { label: "Contact", href: HOME + "#contact", key: "contact" }
        ];
    }

    /* Keep the original HTML of every placeholder so the editor
       can save a clean page later. */
    var ORIGINALS = $all("[data-render]").map(function (el) {
        return el.innerHTML;
    });

    /* ---------- top bar + mobile menu ---------- */

    function pageSections() {
        return $all("[data-index]").map(function (el, i) {
            return {
                id: el.id,
                label: el.getAttribute("data-index"),
                n: String(i + 1).padStart(2, "0")
            };
        }).filter(function (s) { return s.id; });
    }

    function renderTopbar() {
        slots("topbar").forEach(function (slot) {
            var links = siteLinks().map(function (l) {
                var current = (l.key === PAGE && PAGE !== "home") ? ' class="is-current"' : "";
                return '<a href="' + l.href + '"' + current + ">" + l.label + "</a>";
            }).join("");

            slot.innerHTML =
                '<header class="topbar"><div class="wrap">' +
                '<a class="brand" href="' + (HOME || "#about") + '">' + esc(DATA.site.short) + "</a>" +
                '<nav class="topnav" aria-label="Site">' + links + "</nav>" +
                '<button class="menu-btn" type="button" aria-expanded="false">Menu</button>' +
                "</div></header>" +
                '<div class="menu-panel" role="dialog" aria-label="Menu"></div>';

            var btn = $(".menu-btn", slot);
            var panel = $(".menu-panel", slot);
            var sections = pageSections();

            panel.innerHTML =
                (sections.length ? '<div class="label">On this page</div>' +
                    sections.map(function (s) { return '<a href="#' + s.id + '">' + s.n + " · " + esc(s.label) + "</a>"; }).join("") : "") +
                '<div class="label">Portfolio</div>' +
                siteLinks().map(function (l) { return '<a href="' + l.href + '">' + l.label + "</a>"; }).join("");

            function close() { panel.classList.remove("is-open"); btn.setAttribute("aria-expanded", "false"); }
            btn.addEventListener("click", function () {
                var open = panel.classList.toggle("is-open");
                btn.setAttribute("aria-expanded", open ? "true" : "false");
            });
            panel.addEventListener("click", function (e) { if (e.target.tagName === "A") close(); });
            document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
        });
    }

    /* ---------- side index (route with stops) ---------- */

    function renderSideIndex() {
        var sections = pageSections();
        if (sections.length < 2) return;

        document.body.classList.add("has-rail");

        var aside = document.createElement("aside");
        aside.className = "side-index";
        aside.setAttribute("aria-label", "On this page");
        aside.setAttribute("data-ui", "");
        aside.innerHTML =
            '<div class="side-index__title">' + (PAGE === "home" ? "Index" : "On this page") + "</div>" +
            "<ol>" + sections.map(function (s) {
                return '<li><a href="#' + s.id + '"><span>' + s.n + "</span>" + esc(s.label) + "</a></li>";
            }).join("") + "</ol>" +
            '<div class="side-index__progress"><i></i></div>';
        document.body.appendChild(aside);

        var links = $all("a", aside);
        var bar = $(".side-index__progress i", aside);

        function update() {
            var line = window.innerHeight * 0.35;
            var current = 0;
            sections.forEach(function (s, i) {
                var el = document.getElementById(s.id);
                if (el && el.getBoundingClientRect().top <= line) current = i;
            });
            /* reaching the bottom always activates the last stop */
            if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
                current = sections.length - 1;
            }
            links.forEach(function (a, i) { a.classList.toggle("is-active", i === current); });

            var max = document.documentElement.scrollHeight - window.innerHeight;
            bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
        }
        window.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);
        update();
    }

    /* ---------- footer ---------- */

    function renderFooter() {
        var s = DATA.site;
        slots("footer").forEach(function (slot) {
            var links = [
                '<a href="' + (HOME || "#about") + '">Portfolio</a>',
                '<a href="maps.html">Maps</a>',
                s.linkedin ? '<a href="' + esc(s.linkedin) + '" target="_blank" rel="noopener noreferrer">LinkedIn</a>' : "",
                s.github ? '<a href="' + esc(s.github) + '" target="_blank" rel="noopener noreferrer">GitHub</a>' : "",
                s.email ? '<a href="mailto:' + esc(s.email) + '">' + esc(s.email) + "</a>" : ""
            ].join("");
            slot.innerHTML =
                '<footer class="footer"><div class="wrap">' +
                '<div class="footer__top"><div><div class="footer__name">' + esc(s.name) + "</div>" +
                '<div class="footer__tag">' + esc(s.tagline) + "</div></div>" +
                '<div class="footer__links">' + links + "</div></div>" +
                '<div class="footer__bottom">© ' + new Date().getFullYear() + " " + esc(s.name) + " · Academic e-Portfolio</div>" +
                "</div></footer>";
        });
    }

    /* ---------- project cards + filters ---------- */

    function projectCard(p) {
        return (
            '<article class="card" data-kind="projects" data-id="' + esc(p.id) + '" data-category="' + esc(p.category) + '">' +
            '<div class="card__media"><img src="' + esc(p.image) + '" alt="" loading="lazy"></div>' +
            '<div class="card__body">' +
            '<div class="card__meta">' + esc(p.meta) + "</div>" +
            '<h3><a class="card__link" href="' + esc(p.url) + '">' + esc(p.title) + "</a></h3>" +
            "<p>" + (p.summary || "") + "</p>" +
            '<div class="tags">' + (p.tags || []).map(function (t) { return '<span class="tag">' + esc(t) + "</span>"; }).join("") + "</div>" +
            '<span class="card__more" aria-hidden="true">Explore project →</span>' +
            "</div></article>"
        );
    }

    function renderProjects() {
        slots("projects").forEach(function (slot) {
            slot.innerHTML = DATA.projects.map(projectCard).join("");
        });

        slots("project-filters").forEach(function (slot) {
            var cats = [];
            DATA.projects.forEach(function (p) { if (p.category && cats.indexOf(p.category) < 0) cats.push(p.category); });
            if (cats.length < 2) { slot.innerHTML = ""; return; }

            slot.innerHTML = '<div class="filters">' +
                ["All"].concat(cats).map(function (c, i) {
                    return '<button type="button" class="chip' + (i === 0 ? " is-on" : "") + '" data-filter="' + esc(c) + '">' + esc(c) + "</button>";
                }).join("") + "</div>";

            slot.addEventListener("click", function (e) {
                var b = e.target.closest(".chip");
                if (!b) return;
                $all(".chip", slot).forEach(function (c) { c.classList.toggle("is-on", c === b); });
                var f = b.getAttribute("data-filter");
                $all('[data-render="projects"] .card').forEach(function (card) {
                    card.classList.toggle("is-hidden", f !== "All" && card.getAttribute("data-category") !== f);
                });
            });
        });
    }

    /* ---------- map carousel (home) ---------- */

    function mapCard(m) {
        var interactive = m.embed || m.geojson;
        return (
            '<article class="card" data-kind="maps" data-id="' + esc(m.id) + '">' +
            (interactive ? '<span class="badge">Interactive</span>' : "") +
            '<div class="card__media"><img src="' + esc(m.image) + '" alt="" loading="lazy"></div>' +
            '<div class="card__body">' +
            '<div class="card__meta">' + esc(m.meta) + "</div>" +
            '<h3><a class="card__link" href="maps.html#' + esc(m.id) + '">' + esc(m.title) + "</a></h3>" +
            "<p>" + esc(m.short) + "</p>" +
            "</div></article>"
        );
    }

    function renderMapCarousel() {
        slots("map-carousel").forEach(function (slot) {
            slot.innerHTML =
                '<div class="carousel">' +
                '<button class="carousel__btn" type="button" data-dir="-1" aria-label="Previous maps">←</button>' +
                '<div class="carousel__track">' + DATA.maps.map(mapCard).join("") + "</div>" +
                '<button class="carousel__btn" type="button" data-dir="1" aria-label="Next maps">→</button>' +
                "</div>";

            var track = $(".carousel__track", slot);
            $all(".carousel__btn", slot).forEach(function (btn) {
                btn.addEventListener("click", function () {
                    var card = $(".card", track);
                    var step = card ? card.getBoundingClientRect().width + 18 : 290;
                    track.scrollBy({ left: Number(btn.getAttribute("data-dir")) * step, behavior: "smooth" });
                });
            });
        });
    }

    /* ---------- map list (maps.html) ---------- */

    function mapVisual(m) {
        if (m.embed) {
            return '<div class="map-entry__visual"><iframe class="webmap" src="' + esc(m.embed) + '" title="' + esc(m.title) + '" loading="lazy" allowfullscreen></iframe></div>';
        }
        if (m.geojson) {
            return '<div class="map-entry__visual"><div class="webmap" data-geojson="' + esc(m.geojson) + '" data-center="' + esc((m.coords || []).join(",")) + '"></div></div>';
        }
        if (m.gallery && m.gallery.length > 1) {
            return '<div class="map-entry__visual gallery">' +
                m.gallery.map(function (g, i) {
                    return '<figure class="' + (i === 0 ? "is-active" : "") + '"><img src="' + esc(g.src) + '" alt="' + esc(g.caption) + '" loading="lazy"><figcaption>' + esc(g.caption) + "</figcaption></figure>";
                }).join("") +
                '<button class="gallery__btn gallery__btn--prev" type="button" aria-label="Previous figure">←</button>' +
                '<button class="gallery__btn gallery__btn--next" type="button" aria-label="Next figure">→</button>' +
                '<div class="gallery__dots">' + m.gallery.map(function (g, i) {
                    return '<button type="button" class="' + (i === 0 ? "is-active" : "") + '" aria-label="Show ' + esc(g.caption) + '"></button>';
                }).join("") + "</div></div>";
        }
        return '<div class="map-entry__visual"><img src="' + esc(m.image) + '" alt="' + esc(m.title) + '" loading="lazy"></div>';
    }

    function renderMapList() {
        slots("map-list").forEach(function (slot) {
            slot.innerHTML = DATA.maps.map(function (m) {
                return (
                    '<article class="map-entry" id="' + esc(m.id) + '" data-index="' + esc(m.title) + '" data-kind="maps" data-id="' + esc(m.id) + '">' +
                    mapVisual(m) +
                    "<div>" +
                    '<div class="num">' + esc(m.meta) + "</div>" +
                    "<h2>" + esc(m.title) + "</h2>" +
                    (m.text || []).map(function (t) { return "<p>" + esc(t) + "</p>"; }).join("") +
                    '<dl class="facts facts--row">' +
                    (m.tool ? "<div><dt>Tool</dt><dd>" + esc(m.tool) + "</dd></div>" : "") +
                    (m.type ? "<div><dt>Type</dt><dd>" + esc(m.type) + "</dd></div>" : "") +
                    (m.area ? "<div><dt>Area</dt><dd>" + esc(m.area) + "</dd></div>" : "") +
                    "</dl>" +
                    '<div class="tags">' + (m.tags || []).map(function (t) { return '<span class="tag">' + esc(t) + "</span>"; }).join("") + "</div>" +
                    "</div></article>"
                );
            }).join("");
        });
        initGalleries();
    }

    function initGalleries() {
        $all(".gallery").forEach(function (g) {
            if (g.__ready) return;
            g.__ready = true;
            var figs = $all("figure", g);
            var dots = $all(".gallery__dots button", g);
            var cur = 0;
            function show(i) {
                cur = (i + figs.length) % figs.length;
                figs.forEach(function (f, k) { f.classList.toggle("is-active", k === cur); });
                dots.forEach(function (d, k) { d.classList.toggle("is-active", k === cur); });
            }
            var prev = $(".gallery__btn--prev", g), next = $(".gallery__btn--next", g);
            if (prev) prev.addEventListener("click", function () { show(cur - 1); });
            if (next) next.addEventListener("click", function () { show(cur + 1); });
            dots.forEach(function (d, k) { d.addEventListener("click", function () { show(k); }); });
        });
    }

    /* ---------- interactive maps (Leaflet) ---------- */

    /* Basemap: Esri World Light Gray Canvas (free, attribution required) */
    var BASEMAP = "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}";
    var BASEMAP_ATTR = "Tiles &copy; Esri — Esri, HERE, Garmin, &copy; OpenStreetMap contributors";

    function newMap(el, center, zoom) {
        var map = L.map(el, { scrollWheelZoom: false }).setView(center, zoom);
        L.tileLayer(BASEMAP, { attribution: BASEMAP_ATTR, maxZoom: 16 }).addTo(map);
        L.tileLayer(BASEMAP.replace("World_Light_Gray_Base", "World_Light_Gray_Reference"), { maxZoom: 16 }).addTo(map);
        /* scroll-zoom only after the user clicks the map,
           so scrolling the page never gets "stuck" in it */
        map.on("click", function () { map.scrollWheelZoom.enable(); });
        map.on("mouseout", function () { map.scrollWheelZoom.disable(); });
        return map;
    }

    var DOT = { radius: 8, color: "#fffdfa", weight: 2, fillColor: "#b8795b", fillOpacity: 1 };

    function renderOverviewMap() {
        if (!window.L) return;
        slots("overview-map").forEach(function (slot) {
            if (slot.__map) { slot.__map.remove(); }
            slot.innerHTML = "";
            var el = document.createElement("div");
            el.className = "webmap webmap--tall";
            slot.appendChild(el);

            var items = DATA.maps.filter(function (m) { return m.coords && m.coords.length === 2; });
            var map = newMap(el, [38, -1.4], 8);
            slot.__map = map;

            var markers = items.map(function (m) {
                return L.circleMarker(m.coords, DOT).addTo(map).bindPopup(
                    "<strong>" + esc(m.title) + "</strong><br>" + esc(m.meta) +
                    '<br><a href="#' + esc(m.id) + '">See the map ↓</a>'
                );
            });
            if (markers.length) map.fitBounds(L.featureGroup(markers).getBounds().pad(0.35));
        });
    }

    function renderGeojsonMaps() {
        if (!window.L) return;
        $all(".webmap[data-geojson]").forEach(function (el) {
            var c = (el.getAttribute("data-center") || "38,-1.4").split(",").map(Number);
            var map = newMap(el, c, 9);
            fetch(el.getAttribute("data-geojson"))
                .then(function (r) { return r.json(); })
                .then(function (gj) {
                    var layer = L.geoJSON(gj, {
                        style: { color: "#315f4c", weight: 2, fillColor: "#557966", fillOpacity: .35 },
                        pointToLayer: function (f, ll) { return L.circleMarker(ll, DOT); },
                        onEachFeature: function (f, l) {
                            var p = f.properties || {};
                            var keys = Object.keys(p).slice(0, 6);
                            if (keys.length) l.bindPopup(keys.map(function (k) { return "<b>" + esc(k) + ":</b> " + esc(p[k]); }).join("<br>"));
                        }
                    }).addTo(map);
                    map.fitBounds(layer.getBounds().pad(0.1));
                })
                .catch(function () {
                    var note = document.createElement("p");
                    note.className = "webmap-note";
                    note.textContent = "The GeoJSON layer loads when the site is online (browsers block it when opening the file directly).";
                    el.parentNode.appendChild(note);
                });
        });
    }

    /* ---------- previous / next project ---------- */

    function renderPager() {
        slots("pager").forEach(function (slot) {
            var id = slot.getAttribute("data-current");
            var list = DATA.projects;
            var i = list.findIndex(function (p) { return p.id === id; });
            if (i < 0 || list.length < 2) { slot.innerHTML = ""; return; }
            var prev = list[(i - 1 + list.length) % list.length];
            var next = list[(i + 1) % list.length];
            slot.innerHTML = '<nav class="pager" aria-label="More projects">' +
                '<a href="' + esc(prev.url) + '"><span>← Previous project</span><strong>' + esc(prev.title) + "</strong></a>" +
                '<a href="' + esc(next.url) + '"><span>Next project →</span><strong>' + esc(next.title) + "</strong></a></nav>";
        });
    }

    /* ---------- lightbox: click any content image to enlarge ---------- */

    function initLightbox() {
        var box = document.createElement("div");
        box.className = "lightbox";
        box.setAttribute("data-ui", "");
        box.innerHTML = '<img alt=""><p></p>';
        document.body.appendChild(box);
        var img = $("img", box), cap = $("p", box);

        function close() { box.classList.remove("is-open"); }
        box.addEventListener("click", close);
        document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });

        document.addEventListener("click", function (e) {
            if (document.body.classList.contains("is-editing")) return;
            var t = e.target;
            if (t.tagName !== "IMG" || t.closest("a, .card, .lightbox, .leaflet-container, [data-no-zoom]")) return;
            img.src = t.currentSrc || t.src;
            var fig = t.closest("figure");
            var fc = fig && $("figcaption", fig);
            cap.textContent = fc ? fc.textContent.trim().replace(/\s+/g, " ") : (t.alt || "");
            box.classList.add("is-open");
        });

        /* cursor hint (not saved: removed by the editor on save) */
        $all("main img, header img").forEach(function (i) {
            if (!i.closest("a, .card, [data-no-zoom]")) i.classList.add("zoomable");
        });
    }

    /* ---------- render everything ---------- */

    function renderData() {
        renderProjects();
        renderMapCarousel();
        renderMapList();
        renderOverviewMap();
        renderPager();
    }

    renderData();          /* first: it can add sections to the index */
    renderTopbar();
    renderFooter();
    renderGeojsonMaps();
    renderSideIndex();
    initLightbox();

    /* If the page was opened with #something, jump there now that
       the generated content exists (otherwise it stops too early). */
    if (location.hash) {
        if ("scrollRestoration" in history) history.scrollRestoration = "manual";
        var jump = function () {
            var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
            if (!target) return;
            var y = target.getBoundingClientRect().top + window.scrollY -
                (parseFloat(getComputedStyle(target).scrollMarginTop) || 0);
            window.scrollTo({ top: y, behavior: "instant" });
        };
        jump();
        /* again once images have loaded and heights are final */
        window.addEventListener("load", jump);
    }

    /* Public API used by js/editor.js */
    window.Portfolio = {
        DRAFT_KEY: DRAFT_KEY,
        data: function () { return DATA; },
        setData: function (d) { DATA = d; renderData(); renderFooter(); },
        isDraft: loaded.isDraft,
        originals: ORIGINALS,
        esc: esc
    };
})();
