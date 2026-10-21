// Click-to-activate the DrawBox WebAssembly demo. The wasm payload is heavy,
// so it is only fetched when the visitor chooses to launch it.
(function () {
    var launch = document.getElementById("demo-launch");
    var stage = document.getElementById("demo-stage");
    if (!launch || !stage) return;

    var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    launch.addEventListener("click", function () {
        var src = launch.getAttribute("data-src");
        if (!src) return;

        stage.classList.add("is-loading");
        launch.setAttribute("disabled", "");

        var dotsAnim = null;
        if (window.anime && !reducedMotion) {
            dotsAnim = anime({
                targets: stage.querySelectorAll(".demo-loading-dot"),
                translateY: [0, -5],
                opacity: [0.3, 1],
                easing: "easeInOutSine",
                duration: 480,
                delay: anime.stagger(130),
                direction: "alternate",
                loop: true
            });
        }

        var frame = document.createElement("iframe");
        frame.className = "demo-frame";
        frame.title = "DrawBox interactive demo";
        frame.setAttribute("allow", "fullscreen");
        frame.src = src;

        frame.addEventListener("load", function () {
            if (dotsAnim) dotsAnim.pause();
            stage.classList.remove("is-loading");
            stage.classList.add("is-active");
            if (launch.parentNode) launch.parentNode.removeChild(launch);
        });

        stage.appendChild(frame);
    });
})();
