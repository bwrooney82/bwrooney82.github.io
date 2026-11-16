// Theme preference: URL override, saved choice, then local time of day.
function applyTheme(theme) {
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(theme + '-theme');
    const button = document.querySelector('.toggle-theme-button');
    if (button) button.textContent = theme === 'dark' ? '☀️' : '🌙';
}

function toggleTheme() {
    const next = document.body.classList.contains('dark-theme') ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('theme', next); } catch (error) {}
}

(function () {
    function initializeTheme() {
        let theme = new URLSearchParams(window.location.search).get('theme');
        if (theme !== 'dark' && theme !== 'light') {
            try { theme = localStorage.getItem('theme'); } catch (error) {}
        }
        if (theme !== 'dark' && theme !== 'light') {
            const hour = new Date().getHours();
            theme = hour > 19 || hour <= 7 ? 'dark' : 'light';
        }
        applyTheme(theme);
    }

    function initializeScrollControls() {
        const backToTop = document.getElementById('back-to-top-button');
        const themeButton = document.querySelector('.toggle-theme-button');
        const progress = document.getElementById('progressBar');

        function update() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            if (backToTop) backToTop.classList.toggle('show', scrollTop > 300);
            if (themeButton) themeButton.style.display = scrollTop > 0 ? 'none' : 'flex';
            if (progress) {
                const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const percentage = height > 0 ? Math.min(100, scrollTop / height * 100) : 0;
                progress.style.width = percentage + '%';
            }
        }

        if (backToTop) {
            backToTop.addEventListener('click', function (event) {
                event.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);
        window.addEventListener('load', update);
        update();
    }

    // Isotope is the only feature that requires jQuery and its plugin.
    function initializeProjects() {
        const container = document.getElementById('projects');
        const $ = window.jQuery;
        if (!container || !$ || !$.fn.isotope) return function () {};

        const $projects = $(container).isotope({
            itemSelector: '.project',
            layoutMode: 'vertical',
            filter: '*'
        });
        const buttons = document.querySelectorAll('#filters-project .filter-button');
        function selectCategory(category) {
            buttons.forEach(function (button) {
                const active = button.getAttribute('data-filter') === category;
                button.classList.toggle('active', active);
                button.setAttribute('aria-pressed', String(active));
            });
            $projects.isotope({
                filter: function () {
                    return category === '*' || this.getAttribute('data-filter') === category;
                }
            });
        }
        selectCategory('*');
        buttons.forEach(function (button) {
            button.addEventListener('click', function () {
                selectCategory(button.getAttribute('data-filter'));
            });
        });

        function relayout() {
            $projects.isotope('layout');
        }
        container.querySelectorAll('img').forEach(function (image) {
            if (!image.complete) {
                image.addEventListener('load', relayout, { once: true });
                image.addEventListener('error', relayout, { once: true });
            }
        });
        container.querySelectorAll('video').forEach(function (video) {
            if (video.readyState === 0) {
                video.addEventListener('loadedmetadata', relayout, { once: true });
                video.addEventListener('error', relayout, { once: true });
            }
        });
        if (document.fonts) document.fonts.ready.then(relayout);
        window.addEventListener('load', relayout);
        return relayout;
    }

    // Fade the News list only when more content remains below the visible area.
    function initializeNews() {
        const list = document.querySelector('.news-list');
        if (!list) return;
        function update() {
            const overflows = list.scrollHeight - list.clientHeight > 2;
            const atEnd = list.scrollTop + list.clientHeight >= list.scrollHeight - 2;
            list.classList.toggle('is-scrollable', overflows && !atEnd);
        }
        list.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);
        if (document.fonts) document.fonts.ready.then(update);
        update();
    }

    function initializeParticles() {
        const canvas = document.getElementById('canvas');
        if (!canvas) return;
        const context = canvas.getContext('2d');
        if (!context) return;
        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 2;
                this.vy = (Math.random() - 0.5) * 2;
                this.lifespan = 100;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.lifespan -= 1;
                if (this.lifespan <= 0) this.reset();
            }
            draw() {
                context.fillStyle = 'rgba(255, 255, 255, ' + this.lifespan / 100 + ')';
                context.beginPath();
                context.arc(this.x, this.y, 2, 0, Math.PI * 2);
                context.fill();
            }
        }
        const particles = Array.from({ length: 101 }, function () { return new Particle(); });
        function animate() {
            context.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(function (particle) {
                particle.update();
                particle.draw();
            });
            requestAnimationFrame(animate);
        }
        animate();
    }

    // GitHub API counts are grouped by repository and cached for six hours.
    function initializeGithubStars(relayoutProjects) {
        var CACHE_KEY = 'github-stars';
        var TTL = 6 * 60 * 60 * 1000;   // re-check a repo at most every 6 hours

        // Octicon mark-github, inlined so it does not depend on the icon font
        var GITHUB_MARK =
            '<svg class="repo-stars-mark" viewBox="0 0 16 16" aria-hidden="true">' +
            '<path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 ' +
            '0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 ' +
            '1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 ' +
            '0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 ' +
            '2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 ' +
            '3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/>' +
            '</svg>';

        var cache = {};
        try { cache = JSON.parse(localStorage.getItem(CACHE_KEY)) || {}; } catch (e) {}

        function format(n) {
            if (n < 1000) return String(n);
            return (n / 1000).toFixed(n < 10000 ? 1 : 0).replace(/\.0$/, '') + 'k';
        }

        function render(links, count) {
            links.forEach(function (link) {
                if (link.querySelector('.repo-stars')) return;
                var span = document.createElement('span');
                span.className = 'repo-stars';
                span.innerHTML = GITHUB_MARK + '<span class="repo-stars-count">★ ' + format(count) + '</span>';
                span.title = count + ' stars on GitHub';
                link.appendChild(span);
            });
            relayoutProjects();
        }

        // Group by repo first: the same repo can back more than one project
        var byRepo = {};
        document.querySelectorAll('.project-links a[href*="github.com/"]').forEach(function (link) {
            var match = link.getAttribute('href').match(/github\.com\/([^\/]+)\/([^\/?#]+)/);
            if (!match) return;
            var repo = match[1] + '/' + match[2].replace(/\.git$/, '');
            (byRepo[repo] = byRepo[repo] || []).push(link);
        });

        Object.keys(byRepo).forEach(function (repo) {
            var cached = cache[repo];
            if (cached && Date.now() - cached.time < TTL) {
                render(byRepo[repo], cached.stars);
                return;
            }
            fetch('https://api.github.com/repos/' + repo)
                .then(function (response) { return response.ok ? response.json() : null; })
                .then(function (data) {
                    if (!data || typeof data.stargazers_count !== 'number') return;
                    cache[repo] = { stars: data.stargazers_count, time: Date.now() };
                    try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); } catch (e) {}
                    render(byRepo[repo], data.stargazers_count);
                })
                .catch(function () {});
        });

    }

    function initialize() {
        initializeTheme();
        initializeScrollControls();
        const relayoutProjects = initializeProjects();
        initializeNews();
        initializeGithubStars(relayoutProjects);
        initializeParticles();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize, { once: true });
    } else {
        initialize();
    }
})();
