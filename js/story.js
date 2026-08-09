/* 
   Shubharthi Roy - Category "Sales-to-Order" Design Stories Logic
   Handles: Segmented tab toggling, Scroll reveals, Left sticky progress trackers, and Custom cursors
*/

document.addEventListener('DOMContentLoaded', () => {
    initTabsController();
    initScrollReveals();
    initStoryCursorHooks();
    initLightbox();
    
    // Initial load of tracker on active default tab
    initStickyNavTracker();
});

/* ==========================================
   1. Segmented Tabs Controller
   ========================================== */
let activeSectionObserver = null;
let activeRevealObserver = null;
let activeScrollHandler = null;

function initTabsController() {
    const tabBtns = document.querySelectorAll('.segment-tab-btn');
    const tabContents = document.querySelectorAll('.tab-content-block');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.disabled || btn.classList.contains('active')) return;

            const targetId = btn.getAttribute('data-target');

            // Toggle Active Tab Buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            tabContents.forEach(content => {
                if (content.id === `tab-${targetId}`) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
            
            // Dynamic Title & Subtitle updates for Category 3 Tabs
            const heroTitle = document.querySelector('.story-hero-title');
            const heroSubtitle = document.querySelector('.story-hero-subtitle');
            if (heroTitle && heroSubtitle) {
                if (targetId === 'augmented-workflow') {
                    heroTitle.textContent = 'AI & Design Innovation';
                    heroSubtitle.textContent = 'Exploring how AI can support enterprise UX teams across research, design and documentation while keeping designers in control.';
                } else if (targetId === 'telecom-genai') {
                    heroTitle.textContent = 'AI-Assisted Commercial Decision Making';
                    heroSubtitle.textContent = 'Exploring how GenAI can augment enterprise sales by analyzing commercial scenarios, optimizing proposal quality and generating contextual business recommendations directly within the existing workflow.';
                }
            }
            
            // Clean up and rebuild Intersection Observers for the newly activated tab
            if (activeSectionObserver) {
                activeSectionObserver.disconnect();
            }
            if (activeRevealObserver) {
                activeRevealObserver.disconnect();
            }
            if (activeScrollHandler) {
                window.removeEventListener('scroll', activeScrollHandler);
                activeScrollHandler = null;
            }
            
            // Defer execution slightly to let the browser repaint display/layout states
            setTimeout(() => {
                initStickyNavTracker();
                initScrollReveals();
                // Force scroll triggers for items in viewport
                window.dispatchEvent(new Event('scroll'));
            }, 50);
        });
    });
}

/* ==========================================
   2. Scroll Reveal Animations
   ========================================== */
function initScrollReveals() {
    // Select reveal tags inside the active tab only
    const activeTab = document.querySelector('.tab-content-block.active');
    if (!activeTab) return;
    
    const reveals = activeTab.querySelectorAll('.story-reveal');
    
    if (activeRevealObserver) {
        activeRevealObserver.disconnect();
    }

    activeRevealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                activeRevealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05, rootMargin: '0px 0px -50px 0px' });

    reveals.forEach(r => activeRevealObserver.observe(r));
}

/* ==========================================
   3. Sticky Left Navigation Tracker
   ========================================== */
function initStickyNavTracker() {
    const navItems = document.querySelectorAll('.sticky-nav-item');
    if (!navItems.length) return;

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
        const navThreshold = 120; // 120px threshold so section highlights right when scroll reaches top of section

        let currentActive = null;

        if (scrollPosition + windowHeight >= docHeight - 30) {
            currentActive = navMap[navMap.length - 1].item;
        } else {
            for (let i = navMap.length - 1; i >= 0; i--) {
                const { item, target } = navMap[i];
                const rect = target.getBoundingClientRect();
                // Highlight ONLY when scroll top has reached or passed the section top
                if (rect.top <= navThreshold && rect.bottom > 0) {
                    currentActive = item;
                    break;
                }
            }
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
   4. Custom Cursor Hover Events
   ========================================== */
function initStoryCursorHooks() {
    // Set listeners globally
    const elementsToScale = '.challenge-card, .insight-card, .solution-card, .impact-card, .reflection-card, .annotation-dot, .segment-tab-btn';
    
    document.body.addEventListener('mouseover', (e) => {
        if (e.target.closest(elementsToScale)) {
            document.body.classList.add('hovering-card');
        } else {
            document.body.classList.remove('hovering-card');
        }

        if (e.target.closest('.back-link, .sticky-nav-item a, .nav-links a, .logo')) {
            document.body.classList.add('hovering-link');
        } else {
            document.body.classList.remove('hovering-link');
        }
    });
}

/* ==========================================
   5. Premium Lightbox Modal Controller
   ========================================== */
function initLightbox() {
    // Delegated to initUniversalLightbox() in app.js
}
