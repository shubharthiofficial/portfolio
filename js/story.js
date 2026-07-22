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
    // Select elements inside the active tab only to avoid cross-tab overlap triggers
    const activeTab = document.querySelector('.tab-content-block.active');
    if (!activeTab) return;

    const sections = activeTab.querySelectorAll('.story-section');
    const navItems = activeTab.querySelectorAll('.sticky-nav-item');

    if (!navItems.length) return;

    if (activeScrollHandler) {
        window.removeEventListener('scroll', activeScrollHandler);
    }

    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '-10% 0px -50% 0px' // Wider active scanning area
    };

    activeSectionObserver = new IntersectionObserver((entries) => {
        // Bypass observer standard checks if we are already scrolled near the bottom of the page
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;
        if (scrollTop + windowHeight >= docHeight - 80) return;

        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                
                navItems.forEach(item => {
                    const link = item.querySelector('a');
                    if (link && link.getAttribute('href') === `#${activeId}`) {
                        navItems.forEach(i => i.classList.remove('active'));
                        item.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(sec => activeSectionObserver.observe(sec));

    // Scroll to bottom trigger fallback (for short final sections like Reflection)
    activeScrollHandler = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;
        
        if (scrollTop + windowHeight >= docHeight - 80) {
            const lastItem = navItems[navItems.length - 1];
            if (lastItem && !lastItem.classList.contains('active')) {
                navItems.forEach(i => i.classList.remove('active'));
                lastItem.classList.add('active');
            }
        }
    };
    window.addEventListener('scroll', activeScrollHandler);
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
    const modal = document.getElementById('lightbox-modal');
    const modalImg = document.getElementById('lightbox-img');
    const captionText = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');

    if (!modal || !modalImg) return;

    document.addEventListener('click', (e) => {
        const targetImg = e.target.closest('.comparison-image-container img, .story-section img');
        if (targetImg && !e.target.closest('#lightbox-modal')) {
            modal.classList.add('active');
            modalImg.src = targetImg.src;
            captionText.innerText = targetImg.alt || '';
            document.body.style.overflow = 'hidden';
        }
    });

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            modalImg.src = '';
        }, 350);
    };

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}
