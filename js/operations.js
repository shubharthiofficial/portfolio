/* 
   Shubharthi Roy - Backoffice Operations Hub Case Study Logic
   Handles: Scroll outline tracking, Accordion chapters, Animated timelines, and Lightbox binds
   Wrapped in an IIFE to prevent variable declaration namespace collisions in the global scope.
*/

(() => {
    let activeSectionObserver = null;
    let activeScrollHandler = null;

    document.addEventListener('DOMContentLoaded', () => {
        initChaptersAccordion();
        initStickyNavTracker();
        initOpsScrollReveals();
        initOpsLightbox();
        
        // Refresh scroll triggers for any elements immediately in viewport
        window.dispatchEvent(new Event('scroll'));
    });

    /* ==========================================
       1. Chapters Accordion Controller
       ========================================== */
    function initChaptersAccordion() {
        const triggers = document.querySelectorAll('.chapter-trigger');
        triggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                const accordion = trigger.parentElement;
                
                // Toggle active state
                accordion.classList.toggle('active');
                
                // Force redraw/re-observe since layout bounds changed
                setTimeout(() => {
                    window.dispatchEvent(new Event('scroll'));
                }, 100);
            });
        });
    }

    /* ==========================================
       2. Sticky Left Navigation Tracker
       ========================================== */
    function initStickyNavTracker() {
        const navItems = document.querySelectorAll('.sticky-nav-item');
        if (!navItems.length) return;

        // Map nav links directly to target section elements in DOM
        const navMap = [];
        navItems.forEach(item => {
            const link = item.querySelector('a');
            if (link) {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    const target = document.querySelector(href);
                    if (target) {
                        navMap.push({ item, target });
                    }
                }
            }
        });

        if (!navMap.length) return;

        if (activeScrollHandler) {
            window.removeEventListener('scroll', activeScrollHandler);
        }

        activeScrollHandler = () => {
            const scrollPosition = window.scrollY || document.documentElement.scrollTop;
            const windowHeight = window.innerHeight;
            const docHeight = document.documentElement.scrollHeight;
            const headerOffset = 180; // Distance from top of viewport for trigger point

            let currentActive = null;

            // Check if reached bottom of page
            if (scrollPosition + windowHeight >= docHeight - 40) {
                currentActive = navMap[navMap.length - 1].item;
            } else {
                // Find section whose top is closest above or at current scroll trigger threshold
                for (let i = navMap.length - 1; i >= 0; i--) {
                    const { item, target } = navMap[i];
                    const rect = target.getBoundingClientRect();
                    const top = rect.top + window.scrollY;

                    if (scrollPosition + headerOffset >= top) {
                        currentActive = item;
                        break;
                    }
                }
            }

            if (!currentActive && navMap.length > 0) {
                currentActive = navMap[0].item;
            }

            navItems.forEach(item => {
                if (item === currentActive) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        };

        window.addEventListener('scroll', activeScrollHandler, { passive: true });
        activeScrollHandler();
    }

    /* ==========================================
       3. Scroll Reveal Observer for Operations Page
       ========================================== */
    function initOpsScrollReveals() {
        const reveals = document.querySelectorAll('.story-reveal');
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.05, rootMargin: '0px 0px -50% 0px' });

        reveals.forEach(r => revealObserver.observe(r));
    }

    /* ==========================================
       4. Lightbox Modal Controller
       ========================================== */
    function initOpsLightbox() {
        // Delegated to initUniversalLightbox() in app.js
    }

    // 5. Progressive Accordion Toggle Listener
    document.querySelectorAll('details.progressive-accordion').forEach(details => {
        details.addEventListener('toggle', () => {
            const label = details.querySelector('.accordion-toggle-label');
            if (label) {
                label.textContent = details.open ? '- Collapse Details' : '+ Expand Details';
            }
        });
    });
})();
