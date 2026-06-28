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

function dayNightToggle() {
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

checkDayNight();
loadSocialIcons();
updateHeaderScrollState();
window.addEventListener("scroll", updateHeaderScrollState, { passive: true });
