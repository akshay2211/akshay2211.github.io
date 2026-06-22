(function () {
    var content = document.getElementById('post-content');
    var nav = document.getElementById('post-toc-nav');
    var aside = document.querySelector('.post-toc');
    if (!content || !nav || !aside) return;

    var headings = content.querySelectorAll('h2, h3');
    if (!headings.length) {
        aside.style.display = 'none';
        return;
    }

    var slugify = function (text) {
        return text.toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    };

    var usedIds = {};
    var items = [];
    headings.forEach(function (h) {
        var base = h.id || slugify(h.textContent);
        var id = base;
        var i = 2;
        while (usedIds[id]) { id = base + '-' + i; i++; }
        usedIds[id] = true;
        h.id = id;
        items.push({ id: id, level: h.tagName === 'H2' ? 2 : 3, text: h.textContent });
    });

    var html = items.map(function (it) {
        return '<a href="#' + it.id + '" class="toc-link toc-level-' + it.level + '" data-toc-id="' + it.id + '">' + it.text + '</a>';
    }).join('');
    nav.innerHTML = html;

    var links = nav.querySelectorAll('.toc-link');
    var byId = {};
    links.forEach(function (l) { byId[l.getAttribute('data-toc-id')] = l; });

    if ('IntersectionObserver' in window) {
        var active = null;
        var visible = {};
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                visible[entry.target.id] = entry.isIntersecting;
            });
            var firstVisible = null;
            for (var k = 0; k < items.length; k++) {
                if (visible[items[k].id]) { firstVisible = items[k].id; break; }
            }
            if (!firstVisible) {
                var top = window.scrollY + 120;
                for (var j = items.length - 1; j >= 0; j--) {
                    var el = document.getElementById(items[j].id);
                    if (el && el.offsetTop <= top) { firstVisible = items[j].id; break; }
                }
            }
            if (firstVisible && firstVisible !== active) {
                if (active && byId[active]) byId[active].classList.remove('is-active');
                active = firstVisible;
                if (byId[active]) byId[active].classList.add('is-active');
            }
        }, { rootMargin: '-90px 0px -65% 0px', threshold: [0, 1] });
        headings.forEach(function (h) { io.observe(h); });
    }

    links.forEach(function (link) {
        link.addEventListener('click', function (e) {
            var id = link.getAttribute('data-toc-id');
            var target = document.getElementById(id);
            if (!target) return;
            e.preventDefault();
            var top = target.getBoundingClientRect().top + window.scrollY - 90;
            window.scrollTo({ top: top, behavior: 'smooth' });
            if (history.replaceState) history.replaceState(null, '', '#' + id);
        });
    });
})();
