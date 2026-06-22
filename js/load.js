var socialtags = [
    { img: "/img/github.svg",   link: "https://github.com/akshay2211",                     label: "GitHub" },
    { img: "/img/linkedin.svg", link: "https://www.linkedin.com/in/akshay-sharma-80478448/", label: "LinkedIn" },
    { img: "/img/gitlab.svg",   link: "https://gitlab.com/akshay2211",                     label: "GitLab" },
    { img: "/img/twitter.svg",  link: "https://twitter.com/_akshay22",                     label: "Twitter" }
];

var sponsorsListWithIcons = [
    { img: "/img/github.svg", name: "hello", link: "https://github.com/akshay2211" },
    { img: "/img/github.svg", name: "hello", link: "https://github.com/akshay2211" },
    { img: "/img/github.svg", name: "hello", link: "https://github.com/akshay2211" },
    { img: "/img/github.svg", name: "hello", link: "https://github.com/akshay2211" },
    { img: "/img/github.svg", name: "hello", link: "https://github.com/akshay2211" }
];

var sponsorsList = [{ name: "hello", link: "https://github.com/akshay2211" }];

function sponsorsIconItem(i) {
    return '<a class="center" href="' + i.link + '"><div class="sponsor-item"><img style="padding: 5px!important;width: 40px;" src="' + i.img + '" alt="' + (i.name || '') + '"><h5>' + i.name + '</h5></div></a>';
}

function loadSocialIcons() {
    var el = document.getElementById("social-list");
    if (!el) return;
    var html = "";
    for (var i = 0; i < socialtags.length; i++) {
        var s = socialtags[i];
        html += '<a class="center" href="' + s.link + '" rel="me noopener" target="_blank" aria-label="' + s.label + '">' +
                '<img class="center" style="padding: 5px!important;width: 40px;" src="' + s.img + '" alt="' + s.label + '">' +
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

checkDayNight();
loadSocialIcons();
