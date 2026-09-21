// Click-to-activate the DrawBox WebAssembly demo. The wasm payload is heavy,
// so it is only fetched when the visitor chooses to launch it.
(function () {
    var launch = document.getElementById("demo-launch");
    var stage = document.getElementById("demo-stage");
    if (!launch || !stage) return;

    launch.addEventListener("click", function () {
        var src = launch.getAttribute("data-src");
        if (!src) return;

        stage.classList.add("is-loading");
        launch.setAttribute("disabled", "");

        var frame = document.createElement("iframe");
        frame.className = "demo-frame";
        frame.title = "DrawBox interactive demo";
        frame.setAttribute("allow", "fullscreen");
        frame.src = src;

        frame.addEventListener("load", function () {
            stage.classList.remove("is-loading");
            stage.classList.add("is-active");
            if (launch.parentNode) launch.parentNode.removeChild(launch);
        });

        stage.appendChild(frame);
    });
})();
