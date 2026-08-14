// Back-to-top button
var btn = $('#back-to-top-button');

$(window).scroll(function() {
    if ($(window).scrollTop() > 300) {
        btn.addClass('show');
    } else {
        btn.removeClass('show');
    }
});

btn.on('click', function(e) {
    e.preventDefault();
    const speechBalloon = document.querySelector('.speech-balloon');
    const clickSound = new Audio('assets/sounds/collision_sound.wav');
    $('html, body').animate({scrollTop:0}, '300');
    if (speechBalloon) speechBalloon.innerText = 'back to top!';
    clickSound.play().catch(function() {});
});


// Play pronunciation audio when the emoji is clicked (element is optional)
const volumeEmojiEl = document.getElementById('volumeEmoji');
if (volumeEmojiEl) {
    volumeEmojiEl.addEventListener('click', function() {
        const pronunicationAudio = new Audio('assets/sounds/khang.mp3');
        pronunicationAudio.play();
    });
}


// Toggle navigation menu bar
function toggleNav() {
    document.querySelector('nav').classList.toggle('animated-menu');
    document.querySelector('.nav-toggle-btn').classList.toggle('active');
}


// Change the text interchangably "See More" and "See Less"
function toggleText(linkElement) {
    var collapseId = linkElement.getAttribute('href').substring(1);
    var collapseElement = document.getElementById(collapseId);

    $(collapseElement).on('hidden.bs.collapse', function () {
        linkElement.textContent = '... See More';
    });
    $(collapseElement).on('shown.bs.collapse', function () {
        linkElement.textContent = '... See Less';
    });
}


// Initialize the toggleText function for each link
document.querySelectorAll('[data-toggle="collapse"]').forEach(function (linkElement) {
    toggleText(linkElement);
});


// Scroll to top of a div based on its tag
function scrollToTopDiv(divTag) {
    $(divTag)[0].scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}


// Button for toggle theme (dark/light)
function applyTheme(theme) {
    const bodyEl = document.body;
    const buttonEl = document.querySelector('.toggle-theme-button');

    bodyEl.classList.remove('light-theme', 'dark-theme');
    bodyEl.classList.add(theme + '-theme');
    if (buttonEl) buttonEl.innerText = theme === 'dark' ? '☀️' : '🌙';
}

function toggleTheme() {
    const speechBalloon = document.querySelector('.speech-balloon');
    const clickSound = new Audio('assets/sounds/switch_sound.wav');
    const next = document.body.classList.contains('dark-theme') ? 'light' : 'dark';

    applyTheme(next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    if (speechBalloon) speechBalloon.innerText = next === 'dark' ? 'lights turned off!' : 'lights turned on!';
    clickSound.play().catch(function() {});
}


// Handle scroll event to hide/show back-to-top and toggle theme button
window.addEventListener('scroll', function() {
    const buttonEl = document.querySelector('.toggle-theme-button');
    if (!buttonEl) return;
    if (window.scrollY > 0) {
        buttonEl.style.display = 'none';
    } else {
        buttonEl.style.display = 'flex';
    }
});


// Owl carousel for updates
function initializeOwlCarousel() {
    $('.owl-carousel').owlCarousel({
        loop: false,
        rewind: false,
        margin: 10,
        nav: true,
        dots: false,
        lazyLoad: false,
        slideBy: 'page',
        responsive: {
            0: {items: 1.75},
            600: {items: 3},
            900: {items: 5},
            1200: {items: 6}
        }
    });
}

// Touch and mouse event listeners (popup icon is optional)
let isDragging = false;
let isMobile = 'ontouchstart' in window;
let startEvent = isMobile ? 'touchstart' : 'mousedown';
let moveEvent = isMobile ? 'touchmove' : 'mousemove';
let endEvent = isMobile ? 'touchend' : 'mouseup';
var popupIconContainer = document.querySelector('.popup-icon-container');
var dismissalArea = document.querySelector('.dismissal-area');

if (popupIconContainer && dismissalArea) {

// Capture mouse down (desktop) or touch start (mobile) events
popupIconContainer.addEventListener(startEvent, (e) => {
    e.preventDefault();
    isDragging = true;
    let clientX = isMobile ? e.touches[0].clientX : e.clientX;
    let clientY = isMobile ? e.touches[0].clientY : e.clientY;

    startX = clientX;
    startY = clientY;
    originalX = popupIconContainer.getBoundingClientRect().left;
    originalY = popupIconContainer.getBoundingClientRect().top;
    dismissalArea.style.display = 'flex';
    
    // Hide the speech balloon as users start dragging and drag the icon
    document.querySelector('.speech-balloon').classList.add('hidden');
});


// Capture mouse move (desktop) or touch move (mobile) events
document.addEventListener(moveEvent, (e) => {
    if (!isDragging) {
        return;
    }
    
    let clientX = isMobile ? e.touches[0].clientX : e.clientX;
    let clientY = isMobile ? e.touches[0].clientY : e.clientY;

    let x = originalX + (clientX - startX);
    let y = originalY + (clientY - startY);
    popupIconContainer.style.left = `${x}px`;
    popupIconContainer.style.bottom = `calc(100% - ${y}px - ${popupIconContainer.offsetHeight}px)`;
});


// Capture mouse up (desktop) or touch end (mobile) events
document.addEventListener(endEvent, (e) => {
    const clickSound = new Audio('assets/sounds/disappear_sound.wav');

    if (!isDragging) {
        return;
    }

    let clientX = isMobile ? e.changedTouches[0].clientX : e.clientX;
    let clientY = isMobile ? e.changedTouches[0].clientY : e.clientY;
    let centerX = window.innerWidth / 2;
    let centerY = window.innerHeight;

    // Check if icon is near the middle bottom dismissal area
    if (Math.abs(clientX - centerX) < 50 && Math.abs(clientY - centerY) < 100) {
        popupIconContainer.classList.add('hidden');
        clickSound.play();
    }

    dismissalArea.style.display = 'none';
    isDragging = false;
});

}  // end popup-icon guard


// Hide speech balloon when scrolling down
window.addEventListener('scroll', function() {
    const balloon = document.querySelector('.speech-balloon');
    if (!balloon) return;
    let scrollPosition = window.scrollY || document.documentElement.scrollTop;
    if (scrollPosition > 300) {
        balloon.classList.add('hidden');
    } else {
        balloon.classList.remove('hidden');
    }
});


// Update progress bar as user scrolls down
window.onscroll = function() {progressBar()};

function progressBar() {
    var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrolled = (winScroll / height) * 100;
    document.getElementById("progressBar").style.width = scrolled + "%";
}


// Scripts to activate/deactivate contact info card (trigger icon is optional)
var overlaybg = document.getElementById('overlay-bg');
var contactCardTrigger = document.getElementById('contact-card-trigger');

if (overlaybg && contactCardTrigger) {
    contactCardTrigger.onclick = function() {
        overlaybg.style.display = 'flex';
    };

    overlaybg.addEventListener('click', function(event) {
        if (event.target === overlaybg) {
            overlaybg.style.display = 'none';
        }
    });
}


// Play the flipping-card sound when user flips the contact info card
var frontEndCard = document.getElementById('front_end_card');
if (frontEndCard) {
    frontEndCard.addEventListener('click', function() {
        this.classList.toggle('flip');
        const flipAudio = new Audio('assets/sounds/flipcard_sound.mp3');
        flipAudio.play().catch(function() {});
    });
}


// Get all filter buttons and change their active status as user clicks
var filterButtonsProject = document.querySelectorAll('#filters-project .filter-button'); 
var filterButtonsGithub = document.querySelectorAll('#filters-resources .filter-button'); 
var speechBalloon = document.querySelector('.speech-balloon');

filterButtonsProject.forEach(function(filterButtonProject) {
    filterButtonProject.addEventListener('click', function() {
        filterButtonsProject.forEach(function(flrbtn) {
            flrbtn.classList.remove('active');
        });
        this.classList.add('active');
        if (!speechBalloon) return;
        if (this.textContent === "perception + manipulation") {
            speechBalloon.innerText = 'see RoPM projects!';
        } else {
            speechBalloon.innerText = 'see ' + this.textContent + ' projects!';
        }
        speechBalloon.classList.remove('hidden');
    });
});

filterButtonsGithub.forEach(function(filterButtonGithub) {
    filterButtonGithub.addEventListener('click', function() {
        filterButtonsGithub.forEach(function(flrbtn) {
            flrbtn.classList.remove('active');
        });
        this.classList.add('active');
        if (!speechBalloon) return;
        speechBalloon.innerText = 'see ' + this.textContent + ' repos!';
        speechBalloon.classList.remove('hidden');
    });
});


// Function to update Isotope layout with smooth transitions
function updateLayout(collapseElement, isExpanding) {
    
    // Initialize Isotope with vertical layout
    var iso = new Isotope('#projects', {
        itemSelector: '.project',
        layoutMode: 'vertical'
    });

    if (isExpanding) {
        $(collapseElement).css('display', 'none');
        iso.arrange();
        setTimeout(function() {
            $(collapseElement).css('display', '');
            iso.arrange();
        }, 300);
    } else {
        iso.arrange();
        setTimeout(function() {
            $(collapseElement).css('display', 'none');
            iso.arrange();
        }, 300);
    }
}


// Bind updateLayout function to the collapsible elements' events
$('.collapse').on('show.bs.collapse', function () {
    updateLayout(this, true);
}).on('hide.bs.collapse', function () {
    updateLayout(this, false);
});


// Modified from https://codepen.io/SohRonery/pen/wvvBLyP
var itemsPerPageDefault = 5;
var currentNumberPages = 1;
var currentPage = 1;
var currentFilter = '*';
var filterAtribute = 'data-filter';
var pageAtribute = 'data-page-project';
var pagerClass = 'isotope-pager-project';
var $projects = $('#projects').isotope({
    itemcategory: '.project',
    layoutMode: 'vertical'
});


// Filter based on input category
function filterCategoryProjects(category) {
    $projects.isotope({
        filter: category
    });
}


// Determine items to be categorized and displayed per page
function showPageProjects(n) {
    currentPage = n;
    var category = '.project';
        category += ( currentFilter != '*' ) ? '[' + filterAtribute + '="' + currentFilter + '"]' : '';
        category += '[' + pageAtribute + '="' + currentPage+'"]';
    filterCategoryProjects(category);
}


// Update pager indicator when user clicks previous or next button, and disable buttons as needed
function updatePagerProjects() {
    var $isotopePager = ($('.' + pagerClass).length == 0 ) ? $('<div class="' + pagerClass + '"></div>') : $('.' + pagerClass);
    $isotopePager.html('');

    var $previous = $('<button class="pager" id="previous-page">&#8592; previous</button>');
    $previous.click(function() {
        if (currentPage > 1) {
            showPageProjects(currentPage - 1);
            updatePagerProjects();
            scrollToTopDiv('#research');
        }
    });
    if (currentPage === 1) {
        $previous.prop('disabled', true);
    }
    
    var $next = $('<button class="pager" id="next-page">next &#8594;</button>');
    $next.click(function() {
        if (currentPage < currentNumberPages) {
            showPageProjects(currentPage + 1);
            updatePagerProjects();
            scrollToTopDiv('#research');
        }
    });
    if (currentPage === currentNumberPages) {
        $next.prop('disabled', true);
    }

    var $currentPageIndicator = $('<span class="current-page">&nbsp; page ' + currentPage + ' of ' + currentNumberPages + ' &nbsp; </span>');

    $previous.appendTo($isotopePager);
    $currentPageIndicator.appendTo($isotopePager);
    $next.appendTo($isotopePager);
    $projects.after($isotopePager);
    $isotopePager.toggle(currentNumberPages > 1);  // hide pager when single page
}


// Set pagination
function setPaginationProjects() {
    var SettingsPagesOnItems = function() {
        var itemsLength = $projects.children('.project').length;
        var pages = Math.ceil(itemsLength / itemsPerPageDefault);
        var item = 1;
        var page = 1;
        var category = '.project';
            category += ( currentFilter != '*' ) ? '[' + filterAtribute + '="' + currentFilter + '"]' : '';
        
        $projects.children(category).each(function() {
            if (item > itemsPerPageDefault) {
                page++;
                item = 1;
            }
            $(this).attr(pageAtribute, page);
            item++;
        });
        currentNumberPages = page;
    }();

    updatePagerProjects();
}


function initializeIsotopeProjects() {
    // Set number of pages, return to first page,
    setPaginationProjects();
    showPageProjects(1);


    // Filter projects based on category, including change active buttons, filter projects, 
    // set the number of pages, return to the first page, and update the pager indicator 
    $('#filters-project .filter-button').click(function() {
        $('#filters-project .filter-button').removeClass('active');
        $(this).addClass('active');
        var filter = $(this).attr('data-filter');
        currentFilter = filter;
        setPaginationProjects();
        showPageProjects(1);
        updatePagerProjects();
    });
}


// Function load GitHub repositories
document.addEventListener('DOMContentLoaded', () => {

    const container = document.getElementById('github-cards');
    if (!container) return;
    const repoElements = container.querySelectorAll('div[data-url]');

    repoElements.forEach(repoElement => {
        const repoUrl = repoElement.getAttribute('data-url');
        
        axios.get(repoUrl)
            .then(response => {
                const { name, description, html_url, stargazers_count, forks_count, language } = response.data;
                const cardHtml = `
                        <div class="repo-header">
                            <i class="far fa-bookmark bookmark-icon"></i>
                            <a href="${html_url}" target="_blank" class="repo-name">${name}</a>
                        </div>
                        <div class="repo-description">${description || 'No description provided.'}</div>
                        <div class="repo-stats">
                            <i class="fas fa-code language-icon"></i>
                            <span class="language">${language}</span>
                            <div>
                                <i class="fas fa-star star-icon"></i>
                                <span class="stats-number">${stargazers_count}</span>
                            </div>
                            <div>
                                <i class="fas fa-code-branch fork-icon"></i>
                                <span class="stats-number">${forks_count}</span>
                            </div>
                        </div>
                `;

                repoElement.outerHTML = cardHtml;
                
                // Refresh GitHub cards isotope layout
                $cards.isotope('layout');
                
            })
            .catch(error => {
                console.error('Error fetching repository data for', repoUrl, error);
            });
    });
});


// Modified from https://codepen.io/SohRonery/pen/wvvBLyP
var itemsPerPageDefault_1 = 6;
var currentNumberPages_1 = 1;
var currentPage_1 = 1;
var currentFilter_1 = '*';
var filterAtribute_1 = 'data-filter';
var pageAtribute_1 = 'data-page-github';
var pagerClass_1 = 'isotope-pager-github';
var $cards = $('#github-cards').isotope({
    itemcategory: '.github-card',
    layoutMode: 'fitRows'
});


// Filter based on input category
function filterCategoryGithub(category) {
    $cards.isotope({
        filter: category
    });
}


// Determine items to be categorized and displayed per page
function showPageGithub(n) {
    currentPage_1 = n;
    var category = '.github-card';
        category += ( currentFilter_1 != '*' ) ? '[' + filterAtribute_1 + '="' + currentFilter_1 + '"]' : '';
        category += '[' + pageAtribute_1 + '="' + currentPage_1+'"]';
    filterCategoryGithub(category);
}


// Update pager indicator when user clicks previous or next button, and disable buttons as needed
function updatePagerGithub() {
    var $isotopePager = ($('.' + pagerClass_1).length == 0 ) ? $('<div class="' + pagerClass_1 + '"></div>') : $('.' + pagerClass_1);
    $isotopePager.html('');

    var $previous = $('<button class="pager" id="previous-page">&#8592; previous</button>');
    $previous.click(function() {
        if (currentPage_1 > 1) {
            showPageGithub(currentPage_1 - 1);
            updatePagerGithub();
            scrollToTopDiv('#resources');
        }
    });
    if (currentPage_1 === 1) {
        $previous.prop('disabled', true);
    }
    
    var $next = $('<button class="pager" id="next-page">next &#8594;</button>');
    $next.click(function() {
        if (currentPage_1 < currentNumberPages_1) {
            showPageGithub(currentPage_1 + 1);
            updatePagerGithub();
            scrollToTopDiv('#resources');
        }
    });
    if (currentPage_1 === currentNumberPages_1) {
        $next.prop('disabled', true);
    }

    var $currentPage_1Indicator = $('<span class="current-page">&nbsp; page ' + currentPage_1 + ' of ' + currentNumberPages_1 + ' &nbsp; </span>');

    $previous.appendTo($isotopePager);
    $currentPage_1Indicator.appendTo($isotopePager);
    $next.appendTo($isotopePager);
    $cards.after($isotopePager);
    $isotopePager.toggle(currentNumberPages_1 > 1);  // hide pager when single page
}


// Set pagination
function setPaginationGithub() {
    var SettingsPagesOnItems = function() {
        var itemsLength = $cards.children('.github-card').length;
        var pages = Math.ceil(itemsLength / itemsPerPageDefault_1);
        var item = 1;
        var page = 1;
        var category = '.github-card';
            category += ( currentFilter_1 != '*' ) ? '[' + filterAtribute_1 + '="' + currentFilter_1 + '"]' : '';
        
        $cards.children(category).each(function() {
            if (item > itemsPerPageDefault_1) {
                page++;
                item = 1;
            }
            $(this).attr(pageAtribute_1, page);
            item++;
        });
        currentNumberPages_1 = page;
    }();

    updatePagerGithub();
}


function initializeIsotopeGithub() {
    // Set number of pages, return to first page,
    setPaginationGithub();
    showPageGithub(1);


    // Filter cards based on category, including change active buttons, filter cards, 
    // set the number of pages, return to the first page, and update the pager indicator 
    $('#filters-resources .filter-button').click(function() {
        $('#filters-resources .filter-button').removeClass('active');
        $(this).addClass('active');
        var filter = $(this).attr('data-filter');
        currentFilter_1 = filter;
        setPaginationGithub();
        showPageGithub(1);
        updatePagerGithub();
    });
}


// // Guarantee correct layouts when all web resources are fully loaded 
// This version is slow --> only re-layout when all the gifs are fully loaded
// $(window).on('load', function() {
//     initializeOwlCarousel();
//     initializeIsotopeProjects();
// });
// This version is faster --> re-layout when all the images are fully loaded not neccessarily all the gifs
$(document).ready(function() {
    var Images = $('img[src$=".jpg"], img[src$=".jpeg"], img[src$=".png"]').get();
    var imageLoadPromises = Images.map(function(img) {
        return new Promise(function(resolve) {
            if (img.complete) {
                resolve();
            } else {
                img.onload = resolve;
            }
        });
    });

    Promise.all(imageLoadPromises).then(function() {
        initializeOwlCarousel();
        initializeIsotopeProjects();
        initializeIsotopeGithub();
    });
});


// Initial theme: URL ?theme= param > saved preference > time of day
document.addEventListener('DOMContentLoaded', function() {
    const speechBalloon = document.querySelector('.speech-balloon');
    var theme = null;

    var param = new URLSearchParams(window.location.search).get('theme');
    if (param === 'dark' || param === 'light') theme = param;
    if (!theme) {
        try { theme = localStorage.getItem('theme'); } catch (e) {}
    }
    if (theme !== 'dark' && theme !== 'light') {
        // Dark theme between 7 PM and 7 AM, otherwise light
        var currentHour = new Date().getHours();
        theme = (currentHour > 19 || currentHour <= 7) ? 'dark' : 'light';
    }

    applyTheme(theme);
    if (speechBalloon) speechBalloon.innerText = theme === 'dark' ? 'lights off!' : 'lights on!';
});


// Footer year (optional element)
const currentYearEl = document.getElementById("currentYear");
if (currentYearEl) currentYearEl.textContent = new Date().getFullYear();


// Canvas for particle moves
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const particles = [];


// Resize canvas width and height
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();


// Class for Particle
class Particle {
    
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.color = 'rgba(255, 255, 255, ' + 0.7 + ')';
        this.lifespan = 100;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.color = 'rgba(255, 255, 255, ' + this.lifespan--/100 + ')';

        if (this.lifespan <= 0) {
            this.reset();
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fill();
    }
}


// Initialize 101 particles
for (let i = 0; i < 101; i++) {
    particles.push(new Particle());
}


// Make the particles move
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
        particle.update();
        particle.draw(ctx);
    });

    requestAnimationFrame(animate);
}

// Animate the particles
animate();


// News list: mark it scrollable so the CSS can fade the cut-off bottom item,
// and drop the fade once the reader has scrolled to the end
(function () {
    var list = document.querySelector('.news-list');
    if (!list) return;

    function update() {
        var overflows = list.scrollHeight - list.clientHeight > 2;
        var atEnd = list.scrollTop + list.clientHeight >= list.scrollHeight - 2;
        list.classList.toggle('is-scrollable', overflows && !atEnd);
    }

    update();
    list.addEventListener('scroll', update);
    window.addEventListener('resize', update);
})();


// Star counts on the project "code" links, read from the GitHub API at view
// time and cached in localStorage so a revisit costs no requests. Silent on
// failure (offline, rate limit, renamed repo) — the link just stays as it was.
(function () {
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
})();
