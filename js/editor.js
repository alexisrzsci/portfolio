/* =========================================================
   PAGE EDITOR
   ---------------------------------------------------------
   Lets you change the portfolio from the page itself.

   • The "✎ Edit" button only appears when the site is opened
     from your computer (file://, localhost) or with ?edit in
     the address, e.g.  https://…/index.html?edit
   • Text inside areas marked  data-edit  can be typed over.
     Click an image there to change its file.
     Ctrl/Cmd + click a link there to change where it goes.
   • Click a project or map card to edit / delete / reorder it.
   • Nothing is uploaded anywhere. To make changes permanent:
       - "Download data.js"   → replace js/data.js
       - "Download this page" → replace the .html file
   ========================================================= */

(function () {
    "use strict";

    var P = window.Portfolio;
    if (!P) return;

    var allowed =
        location.protocol === "file:" ||
        /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) ||
        /[?&]edit\b/.test(location.search);
    if (!allowed) return;

    var esc = P.esc;
    var SESSION_KEY = "portfolio-editing";
    var editing = false;
    var pageDirty = false;
    var bar, banner;

    function $(s, r) { return (r || document).querySelector(s); }
    function $all(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
    function clone(o) { return JSON.parse(JSON.stringify(o)); }

    /* ---------- draft storage ---------- */

    function saveDraft(data) {
        try { localStorage.setItem(P.DRAFT_KEY, JSON.stringify(data)); } catch (e) { /* ignore */ }
        P.setData(data);
        showBanner(true);
    }
    function clearDraft() {
        try { localStorage.removeItem(P.DRAFT_KEY); } catch (e) { /* ignore */ }
    }
    function showBanner(on) {
        if (!banner) {
            banner = document.createElement("div");
            banner.className = "draft-banner";
            banner.setAttribute("data-ui", "");
            banner.textContent = "Draft: projects/maps changed on this computer only — press “Download data.js” to keep them.";
            document.body.appendChild(banner);
        }
        banner.style.display = on ? "block" : "none";
    }

    /* ---------- toggle button ---------- */

    var toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "edit-toggle";
    toggle.setAttribute("data-ui", "");
    toggle.textContent = "✎ Edit";
    toggle.addEventListener("click", function () { setEditing(true); });
    document.body.appendChild(toggle);

    if (P.isDraft) showBanner(true);

    /* ---------- edit mode on / off ---------- */

    var TEXT_SEL = "h1,h2,h3,h4,p,li,dt,dd,figcaption,blockquote,.label,.num,.eyebrow,.tag,a,strong,em,span";

    function editableTargets() {
        var out = [];
        $all("[data-edit]").forEach(function (zone) {
            $all(TEXT_SEL, zone).forEach(function (el) {
                if (el.closest("[data-render], [data-ui]")) return;
                /* skip if an ancestor inside the zone is already editable */
                var p = el.parentElement, nested = false;
                while (p && p !== zone) { if (out.indexOf(p) >= 0) { nested = true; break; } p = p.parentElement; }
                if (!nested) out.push(el);
            });
        });
        return out;
    }

    function setEditing(on) {
        editing = on;
        document.body.classList.toggle("is-editing", on);
        toggle.style.display = on ? "none" : "";
        try { on ? sessionStorage.setItem(SESSION_KEY, "1") : sessionStorage.removeItem(SESSION_KEY); } catch (e) { /* ignore */ }

        editableTargets().forEach(function (el) {
            if (on) el.setAttribute("contenteditable", "true");
            else el.removeAttribute("contenteditable");
        });

        if (on) buildBar(); else if (bar) { bar.remove(); bar = null; }
    }

    function buildBar() {
        bar = document.createElement("div");
        bar.className = "editbar";
        bar.setAttribute("data-ui", "");
        var hasCards = $('[data-render="projects"], [data-render="map-list"], [data-render="map-carousel"]');
        bar.innerHTML =
            "<strong>Edit mode</strong>" +
            (hasCards ? '<button type="button" data-act="add-project">+ Project</button><button type="button" data-act="add-map">+ Map</button>' : "") +
            '<button type="button" data-act="site">Contact details</button>' +
            '<button type="button" class="primary" data-act="download-data">Download data.js</button>' +
            '<button type="button" class="primary" data-act="download-page">Download this page</button>' +
            '<button type="button" data-act="discard">Discard draft</button>' +
            '<button type="button" data-act="exit">Exit</button>' +
            '<span class="editbar__hint">Type on dashed areas · click images to change them · Ctrl+click links to edit them</span>';
        document.body.appendChild(bar);

        bar.addEventListener("click", function (e) {
            var b = e.target.closest("button");
            if (!b) return;
            var act = b.getAttribute("data-act");
            if (act === "add-project") openForm("projects", null);
            if (act === "add-map") openForm("maps", null);
            if (act === "site") openSiteForm();
            if (act === "download-data") downloadData();
            if (act === "download-page") downloadPage();
            if (act === "discard") {
                if (confirm("Discard the projects/maps draft and go back to js/data.js?")) {
                    clearDraft(); P.setData(clone(window.PORTFOLIO)); showBanner(false);
                }
            }
            if (act === "exit") {
                if (pageDirty && !confirm("You changed text on this page. Exit without downloading it?")) return;
                setEditing(false);
            }
        });
    }

    /* ---------- clicks while editing ---------- */

    document.addEventListener("click", function (e) {
        if (!editing || e.target.closest("[data-ui], .modal")) return;

        /* card or map entry → open its form */
        var card = e.target.closest("[data-kind][data-id]");
        if (card) {
            e.preventDefault();
            openForm(card.getAttribute("data-kind"), card.getAttribute("data-id"));
            return;
        }

        var zone = e.target.closest("[data-edit]");

        /* image in an editable area → change path */
        if (zone && e.target.tagName === "IMG") {
            e.preventDefault();
            var src = prompt("Image file (put the file in the assets folder first):", e.target.getAttribute("src"));
            if (src) { e.target.setAttribute("src", src); pageDirty = true; }
            return;
        }

        /* links never navigate while editing (Ctrl/Cmd+click edits them) */
        var a = e.target.closest("a");
        if (a) {
            e.preventDefault();
            if (zone && (e.ctrlKey || e.metaKey)) {
                var href = prompt("Link address:", a.getAttribute("href"));
                if (href !== null) { a.setAttribute("href", href); pageDirty = true; }
            }
        }
    }, true);

    document.addEventListener("input", function (e) {
        if (editing && e.target.closest("[data-edit]")) pageDirty = true;
    });

    window.addEventListener("beforeunload", function (e) {
        if (editing && pageDirty) { e.preventDefault(); e.returnValue = ""; }
    });

    /* ---------- forms ---------- */

    var FIELDS = {
        projects: [
            ["title", "Title"],
            ["meta", "Small line above the title", "e.g. Marine Ecology · 2026"],
            ["category", "Category (used by the filter buttons)"],
            ["image", "Card image", "", "image"],
            ["summary", "Short description", "You can use <em>italic</em>.", "textarea"],
            ["tags", "Tags", "Separate with commas"],
            ["url", "Project page", "e.g. my-project.html — copy project-template.html to create it"],
            ["id", "Id (no spaces)", "Leave empty to create it from the title"]
        ],
        maps: [
            ["title", "Title"],
            ["meta", "Small line above the title", "e.g. SIG I · Universidad de Murcia"],
            ["image", "Image (card + map page)", "", "image"],
            ["short", "Short description (card)", "", "textarea"],
            ["text", "Long description (map page)", "Leave an empty line between paragraphs", "textarea"],
            ["tool", "Tool"], ["type", "Type of analysis"], ["area", "Area"],
            ["tags", "Tags", "Separate with commas"],
            ["coords", "Location on the overview map", "latitude, longitude — e.g. 37.99, -1.13"],
            ["coursework", "Coursework?", "Write yes to show a “Coursework” label, leave empty if not"],
            ["gallery", "Extra figures (optional)", "One per line:  assets/file.png | caption", "textarea"],
            ["embed", "Interactive web map URL (optional)", "qgis2web / ArcGIS Online / Felt link — shown instead of the image"],
            ["geojson", "GeoJSON layer (optional)", "e.g. data/my-layer.geojson (exported from QGIS in EPSG:4326)"],
            ["id", "Id (no spaces)", "Leave empty to create it from the title"]
        ]
    };

    function toField(kind, key, item) {
        var v = item[key];
        if (v == null) return "";
        if (key === "tags") return v.join(", ");
        if (key === "text") return v.join("\n\n");
        if (key === "coords") return v.join(", ");
        if (key === "coursework") return v ? "yes" : "";
        if (key === "gallery") return v.map(function (g) { return g.src + " | " + g.caption; }).join("\n");
        return v;
    }

    function fromField(key, raw) {
        raw = raw.trim();
        if (key === "coursework") return /^(yes|sí|si|true|1)$/i.test(raw) ? true : undefined;
        if (key === "tags") return raw ? raw.split(",").map(function (s) { return s.trim(); }).filter(Boolean) : [];
        if (key === "text") return raw ? raw.split(/\n\s*\n/).map(function (s) { return s.replace(/\s+/g, " ").trim(); }) : [];
        if (key === "coords") {
            var c = raw.split(",").map(Number);
            return c.length === 2 && !isNaN(c[0]) && !isNaN(c[1]) ? c : undefined;
        }
        if (key === "gallery") {
            var g = raw.split("\n").map(function (l) {
                var parts = l.split("|");
                return { src: parts[0].trim(), caption: (parts[1] || "").trim() };
            }).filter(function (x) { return x.src; });
            return g.length ? g : undefined;
        }
        return raw || undefined;
    }

    function slug(s) {
        return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
            .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "item-" + Date.now();
    }

    function modal(html) {
        var m = document.createElement("div");
        m.className = "modal";
        m.setAttribute("data-ui", "");
        m.innerHTML = '<div class="modal__box">' + html + "</div>";
        document.body.appendChild(m);
        m.addEventListener("click", function (e) { if (e.target === m) m.remove(); });
        return m;
    }

    function openForm(kind, id) {
        var data = clone(P.data());
        var list = data[kind];
        var index = list.findIndex(function (x) { return x.id === id; });
        var item = index >= 0 ? list[index] : {};
        var isNew = index < 0;

        var html =
            "<h3>" + (isNew ? "New " : "Edit ") + (kind === "projects" ? "project" : "map") + "</h3>" +
            "<p>Changes appear immediately as a draft on this computer. Press “Download data.js” to keep them.</p>" +
            FIELDS[kind].map(function (f) {
                var key = f[0], val = esc(toField(kind, key, item));
                var input = f[3] === "textarea"
                    ? '<textarea name="' + key + '">' + val + "</textarea>"
                    : '<input name="' + key + '" value="' + val + '">';
                if (f[3] === "image") {
                    input += '<input type="file" accept="image/*" data-file-for="' + key + '">' +
                        '<small>Choosing a file fills in assets/&lt;name&gt; — remember to copy that file into the assets folder.</small>' +
                        (item[key] ? '<img class="modal__preview" src="' + val + '" alt="">' : "");
                }
                return '<div class="field"><label>' + f[1] + "</label>" + input + (f[2] ? "<small>" + esc(f[2]) + "</small>" : "") + "</div>";
            }).join("") +
            '<div class="modal__actions">' +
            '<button class="btn" data-act="save">Save</button>' +
            (isNew ? "" : '<button class="btn btn--ghost" data-act="up">↑ Move up</button><button class="btn btn--ghost" data-act="down">↓ Move down</button>') +
            '<span class="spacer"></span>' +
            (isNew ? "" : '<button class="btn btn--danger" data-act="delete">Delete</button>') +
            '<button class="btn btn--ghost" data-act="cancel">Cancel</button></div>';

        var m = modal(html);

        $all("input[type=file]", m).forEach(function (fi) {
            fi.addEventListener("change", function () {
                var file = fi.files[0];
                if (!file) return;
                var key = fi.getAttribute("data-file-for");
                $('[name="' + key + '"]', m).value = "assets/" + file.name;
                var prev = $(".modal__preview", fi.parentNode);
                if (!prev) { prev = document.createElement("img"); prev.className = "modal__preview"; fi.parentNode.appendChild(prev); }
                prev.src = URL.createObjectURL(file);
            });
        });

        m.addEventListener("click", function (e) {
            var b = e.target.closest("button[data-act]");
            if (!b) return;
            var act = b.getAttribute("data-act");

            if (act === "cancel") { m.remove(); return; }

            if (act === "delete") {
                if (!confirm("Delete “" + item.title + "”?")) return;
                list.splice(index, 1);
            } else if (act === "up" || act === "down") {
                var to = index + (act === "up" ? -1 : 1);
                if (to < 0 || to >= list.length) return;
                list.splice(to, 0, list.splice(index, 1)[0]);
            } else if (act === "save") {
                var next = {};
                FIELDS[kind].forEach(function (f) {
                    var v = fromField(f[0], $('[name="' + f[0] + '"]', m).value);
                    if (v !== undefined) next[f[0]] = v;
                });
                if (!next.title) { alert("Please add a title."); return; }
                if (!next.id) next.id = slug(next.title);
                var clash = list.some(function (x, k) { return x.id === next.id && k !== index; });
                if (clash) { alert("Another item already uses the id “" + next.id + "”."); return; }
                /* keep the id first for readability in data.js */
                var ordered = { id: next.id };
                Object.keys(next).forEach(function (k) { if (k !== "id") ordered[k] = next[k]; });
                if (isNew) list.push(ordered); else list[index] = ordered;
            }
            saveDraft(data);
            m.remove();
        });
    }

    function openSiteForm() {
        var data = clone(P.data());
        var s = data.site;
        var keys = [["name", "Full name"], ["short", "Name in the top bar"], ["tagline", "Tagline"],
            ["email", "Email"], ["linkedin", "LinkedIn URL"], ["github", "GitHub URL (empty = hidden)"],
            ["cv", "CV file, e.g. assets/CV-Alexis.pdf (empty = button hidden)"]];
        var m = modal("<h3>Contact details</h3><p>Used in the top bar and footer of every page.</p>" +
            keys.map(function (k) {
                return '<div class="field"><label>' + k[1] + '</label><input name="' + k[0] + '" value="' + esc(s[k[0]] || "") + '"></div>';
            }).join("") +
            '<div class="modal__actions"><button class="btn" data-act="save">Save</button><span class="spacer"></span><button class="btn btn--ghost" data-act="cancel">Cancel</button></div>');
        m.addEventListener("click", function (e) {
            var b = e.target.closest("button[data-act]");
            if (!b) return;
            if (b.getAttribute("data-act") === "save") {
                keys.forEach(function (k) { s[k[0]] = $('[name="' + k[0] + '"]', m).value.trim(); });
                saveDraft(data);
            }
            m.remove();
        });
    }

    /* ---------- downloads ---------- */

    function download(name, text, type) {
        var blob = new Blob([text], { type: type });
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = name;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    }

    function downloadData() {
        var header =
            "/* =========================================================\n" +
            "   PORTFOLIO CONTENT — generated by the page editor.\n" +
            "   The ONLY file where projects and maps are listed.\n" +
            "   See README.md for the meaning of each field.\n" +
            "   ========================================================= */\n\n";
        download("data.js", header + "window.PORTFOLIO = " + JSON.stringify(P.data(), null, 2) + ";\n", "text/javascript");
        alert("Replace js/data.js with the downloaded file. Then press “Discard draft” (the file now contains your changes).");
    }

    function downloadPage() {
        var doc = document.documentElement.cloneNode(true);

        /* put generated areas back to their empty placeholders */
        var live = $all("[data-render]", doc);
        live.forEach(function (el, i) { el.innerHTML = P.originals[i] || ""; });

        $all("[data-ui], .leaflet-control-container", doc).forEach(function (el) { el.remove(); });
        $all("[contenteditable]", doc).forEach(function (el) { el.removeAttribute("contenteditable"); });
        $all(".zoomable, .reveal, .is-visible", doc).forEach(function (el) {
            el.classList.remove("zoomable", "reveal", "is-visible");
            if (!el.getAttribute("class")) el.removeAttribute("class");
        });
        var body = doc.querySelector("body");
        body.classList.remove("is-editing", "has-rail");
        if (!body.getAttribute("class")) body.removeAttribute("class");

        var name = decodeURIComponent(location.pathname.split("/").pop() || "index.html");
        download(name, "<!DOCTYPE html>\n" + doc.outerHTML + "\n", "text/html");
        pageDirty = false;
        alert("Replace " + name + " in your portfolio folder with the downloaded file.");
    }

    /* stay in edit mode when moving between pages */
    try { if (sessionStorage.getItem(SESSION_KEY)) setEditing(true); } catch (e) { /* ignore */ }
})();
