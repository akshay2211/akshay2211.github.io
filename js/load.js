var socialtags = [
    { img: "/img/github.svg",   link: "https://github.com/akshay2211",                     label: "GitHub" },
    { img: "/img/linkedin.svg", link: "https://www.linkedin.com/in/akshay-sharma-80478448/", label: "LinkedIn" },
    { img: "/img/gitlab.svg",   link: "https://gitlab.com/akshay2211",                     label: "GitLab" },
    { img: "/img/twitter.svg",  link: "https://twitter.com/_akshay22",                     label: "Twitter" }
];

function loadSocialIcons() {
    var el = document.getElementById("social-list");
    if (!el) return;
    var html = "";
    for (var i = 0; i < socialtags.length; i++) {
        var s = socialtags[i];
        html += '<a class="social-link" href="' + s.link + '" rel="me noopener" target="_blank" aria-label="' + s.label + '">' +
                '<span class="social-icon" style="-webkit-mask-image:url(' + s.img + ');mask-image:url(' + s.img + ')"></span>' +
                '</a>';
    }
    el.innerHTML = html;
}

function applyThemeToggle() {
    document.body.classList.toggle("light-mode");
    if (window.localStorage.getItem("light-mode") == "light") {
        window.localStorage.clear();
    } else {
        window.localStorage.setItem("light-mode", "light");
    }
    var themes = window.__giscusThemes;
    if (themes) {
        var theme = document.body.classList.contains("light-mode") ? themes.light : themes.dark;
        window.dispatchEvent(new CustomEvent("giscus-theme-change", { detail: { theme: theme } }));
    }
}

// Origin-aware theme change: the new theme expands as a circle from the
// toggle button. Falls back to an instant swap where View Transitions or
// reduced-motion apply. (MOTION.md §3)
function dayNightToggle(event) {
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduced) {
        applyThemeToggle();
        return;
    }
    var x = event && event.clientX ? event.clientX : window.innerWidth - 34;
    var y = event && event.clientY ? event.clientY : 34;
    var radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
    );
    var root = document.documentElement;
    root.setAttribute("data-theme-transition", "");
    var transition = document.startViewTransition(function () { applyThemeToggle(); });
    transition.ready.then(function () {
        root.animate(
            { clipPath: ["circle(0px at " + x + "px " + y + "px)", "circle(" + radius + "px at " + x + "px " + y + "px)"] },
            { duration: 500, easing: "cubic-bezier(0.65, 0, 0.35, 1)", pseudoElement: "::view-transition-new(root)" }
        );
    });
    transition.finished.finally(function () { root.removeAttribute("data-theme-transition"); });
}

function checkDayNight() {
    var mode = window.localStorage.getItem("light-mode");
    var body = document.body;
    if (mode == "light") {
        body.classList.add("light-mode");
    } else {
        body.classList.remove("light-mode");
    }
}

function updateHeaderScrollState() {
    var scrolled = window.scrollY > 8;
    document.body.classList.toggle("scrolled", scrolled);
}

function initCopyButtons() {
    document.addEventListener("click", function (e) {
        var btn = e.target.closest(".copy-btn");
        if (!btn) return;
        var text = btn.getAttribute("data-copy");
        if (!text) return;
        var done = function () {
            btn.classList.add("copied");
            btn.setAttribute("aria-label", "Copied");
            window.setTimeout(function () {
                btn.classList.remove("copied");
                btn.setAttribute("aria-label", "Copy install command");
            }, 1400);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(done).catch(function () {});
        } else {
            var ta = document.createElement("textarea");
            ta.value = text;
            ta.style.position = "fixed";
            ta.style.opacity = "0";
            document.body.appendChild(ta);
            ta.select();
            try { document.execCommand("copy"); done(); } catch (err) {}
            document.body.removeChild(ta);
        }
    });
}

checkDayNight();
loadSocialIcons();
updateHeaderScrollState();
initCopyButtons();
window.addEventListener("scroll", updateHeaderScrollState, { passive: true });
