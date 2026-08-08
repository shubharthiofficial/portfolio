/**
 * Portfolio V2 - CRED-inspired Motion & Progressive Disclosure Controller
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Intersection Observer for Scroll Reveals
    const revealElements = document.querySelectorAll('.reveal-text, .reveal-up, .reveal-on-scroll');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.12
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-in-view', 'revealed');
                // Optional: keep observing or unobserve if single reveal preferred
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // 2. Progressive Disclosure Accordion/Drawer for "How I Contribute"
    const contributeCards = document.querySelectorAll('.v2-contribute-card');
    
    contributeCards.forEach(card => {
        const headerBtn = card.querySelector('.v2-contribute-header');
        if (!headerBtn) return;

        headerBtn.addEventListener('click', () => {
            const isOpen = card.classList.contains('is-open');
            
            // Close other cards for clean accordion experience (optional, can keep multi open if preferred)
            contributeCards.forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.classList.remove('is-open');
                    const otherBtn = otherCard.querySelector('.v2-contribute-header');
                    if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle current card
            if (isOpen) {
                card.classList.remove('is-open');
                headerBtn.setAttribute('aria-expanded', 'false');
            } else {
                card.classList.add('is-open');
                headerBtn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // 3. Subtle Tilt Physics on Cards (CRED-inspired micro-interaction)
    const caseCards = document.querySelectorAll('.v2-case-card, .v2-journey-card, .v2-capability-card, .v2-contribute-item, .v2-workflow-step-card');
    
    caseCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -3; // Max 3 deg tilt
            const rotateY = ((x - centerX) / centerX) * 3;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // 4. Sticky Sidebar Navigation Scroll Observer for Case Study Pages
    const storySections = document.querySelectorAll('.narrative-block[id], section[id]');
    const stickyNavItems = document.querySelectorAll('.sticky-nav-item');

    if (storySections.length > 0 && stickyNavItems.length > 0) {
        function updateStickyNav() {
            let currentId = '';
            const navThreshold = 120;
            const scrollPos = window.scrollY || document.documentElement.scrollTop;
            const windowHeight = window.innerHeight;
            const docHeight = document.documentElement.scrollHeight;

            if (scrollPos + windowHeight >= docHeight - 30) {
                const lastSec = storySections[storySections.length - 1];
                if (lastSec) currentId = lastSec.getAttribute('id');
            } else {
                storySections.forEach(section => {
                    const rect = section.getBoundingClientRect();
                    if (rect.top <= navThreshold && rect.bottom > 0) {
                        currentId = section.getAttribute('id');
                    }
                });
            }

            stickyNavItems.forEach(item => {
                const link = item.querySelector('a');
                if (currentId && link && link.getAttribute('href') === `#${currentId}`) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }

        window.addEventListener('scroll', updateStickyNav, { passive: true });
        updateStickyNav(); // Initial run
    }
});
