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
        const sections = document.querySelectorAll('.story-section');
        const navItems = document.querySelectorAll('.sticky-nav-item');

        if (!navItems.length) return;

        if (activeScrollHandler) {
            window.removeEventListener('scroll', activeScrollHandler);
        }

        const observerOptions = {
            root: null,
            threshold: 0.1,
            rootMargin: '-10% 0px -50% 0px' // Focus upper-middle viewport
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

        // Scroll to bottom trigger fallback (for Reflection)
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
        const modal = document.getElementById('lightbox-modal');
        if (!modal) return;
        const modalImg = document.getElementById('lightbox-img');
        const captionText = document.getElementById('lightbox-caption');
        const closeBtn = document.querySelector('.lightbox-close');

        document.addEventListener('click', (e) => {
            const placeholder = e.target.closest('.image-placeholder-block');
            const targetImg = e.target.closest('.dashboard-mockup img, .annotated-screen-img, img');
            
            if (placeholder && !e.target.closest('#lightbox-modal')) {
                const textNode = placeholder.querySelector('p');
                const pathText = textNode ? textNode.textContent.trim() : 'Image Asset';
                modal.classList.add('active');
                modalImg.src = '';
                modalImg.style.display = 'none';
                captionText.innerHTML = `<span style="font-family: monospace; font-size: 0.9rem; color: #a5b4fc;">${pathText}</span>`;
            } else if (targetImg && !e.target.closest('#lightbox-modal')) {
                modal.classList.add('active');
                modalImg.src = targetImg.src;
                modalImg.style.display = 'block';
                captionText.textContent = targetImg.alt || 'Visual Asset Preview';
            }
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('active');
            });
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }
})();
