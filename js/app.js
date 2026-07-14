/* 
   Shubharthi Roy - Portfolio Interaction Script
   Includes: Custom Cursor, Theme Toggle, Count-up Stats, AI Sandbox, Case Study Modal Loader
*/

document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
    initThemeToggle();
    initScrollAnimations();
    initAISandbox();
    initCaseStudies();
    initPasswordProtection();
    initPageExitTransitions();
    initFloatingActionButtons();
    initMobileNav();

    // Check if redirect query parameter exists on page load
    const urlParams = new URLSearchParams(window.location.search);
    const lockVal = urlParams.get('lock');
    if (lockVal === 'sales-to-order' || lockVal === 'operational-systems' || lockVal === 'agentic-workflows') {
        // Clean URL parameter without reloading
        window.history.replaceState({}, document.title, window.location.pathname);
        showPasswordModal(lockVal + '.html');
    }

    // Smooth scroll to hash on page load if present
    if (window.location.hash) {
        setTimeout(() => {
            const targetEl = document.querySelector(window.location.hash);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 300);
    }

});

/* ==========================================
   1. Custom Cursor
   ========================================== */
function initCustomCursor() {
    const dot = document.createElement('div');
    const circle = document.createElement('div');
    dot.className = 'custom-cursor-dot';
    circle.className = 'custom-cursor-circle';
    document.body.appendChild(dot);
    document.body.appendChild(circle);

    let mouseX = 0, mouseY = 0;
    let circleX = 0, circleY = 0;

    // Track mouse coordinates
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;
    });

    // Smooth cursor trailing
    function tick() {
        const easing = 0.15;
        circleX += (mouseX - circleX) * easing;
        circleY += (mouseY - circleY) * easing;
        
        circle.style.left = `${circleX}px`;
        circle.style.top = `${circleY}px`;
        
        requestAnimationFrame(tick);
    }
    tick();

    // Hover states for links, buttons, and case study cards
    const interactiveElements = document.querySelectorAll('a, button, .theme-toggle-btn, .case-btn, .ai-tab-btn, .mock-report-action-btn, input, textarea, select, [role="button"]');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('hovering-link');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('hovering-link');
        });
    });

    const caseCards = document.querySelectorAll('.case-card, .art-card, .category-card, .pl-flow-node, .practice-item');
    caseCards.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('hovering-card');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('hovering-card');
        });
    });
}

/* ==========================================
   2. Theme Toggle
   ========================================== */
function initThemeToggle() {
    const toggleBtn = document.querySelector('.theme-toggle-btn');
    const sunIcon = toggleBtn.querySelector('.sun-icon');
    const moonIcon = toggleBtn.querySelector('.moon-icon');
    
    // Check saved theme
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateToggleIcons(currentTheme);

    toggleBtn.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme');
        const nextTheme = theme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', nextTheme);
        localStorage.setItem('theme', nextTheme);
        updateToggleIcons(nextTheme);
    });

    function updateToggleIcons(theme) {
        if (theme === 'light') {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
    }
}

/* ==========================================
   3. Scroll Animations & Count-Up
   ========================================== */
function initScrollAnimations() {
    // Fade/Slide entrance transitions
    const elementsToReveal = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    elementsToReveal.forEach(el => revealObserver.observe(el));

    // Stats counter animation
    const statsContainer = document.querySelector('.metrics-container');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    if (statsContainer) {
        statsObserver.observe(statsContainer);
    }

    function animateCounters() {
        const counters = document.querySelectorAll('.metric-number-val');
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 1500; // ms
            const stepTime = 20;
            const steps = duration / stepTime;
            const increment = target / steps;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = target;
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current);
                }
            }, stepTime);
        });
    }
}

/* ==========================================
   4. AI Sandbox Simulation
   ========================================== */
function initAISandbox() {
    const tabs = document.querySelectorAll('.ai-tab-btn');
    const playgroundBody = document.getElementById('playground-console');
    
    if (!playgroundBody) return;
    
    // Sandbox simulation content
    const simulations = {
        agentic: [
            { type: 'user', text: '> shubharthi --mode agentic "Analyze checkout friction and implement validation pipeline"' },
            { type: 'system', text: '[System] Initializing Agentic Designer Workflow...' },
            { type: 'ai', text: '⚡ Agent: Scanning Figma layout node mappings (Optus CPQ Order Screen V4)' },
            { type: 'ai', text: '🔍 Finding: Sales operators submit orders with empty validation strings on multi-step flows' },
            { type: 'ai', text: '💡 Recommendation: Inject real-time structural feedback in the second approval phase' },
            { type: 'system', text: '[System] Generating validation logic and updating design tokens...' },
            { type: 'ai', text: '✅ Success: Validation blueprint deployed. Quote fallout errors simulated reduction: -20%.' }
        ],
        research: [
            { type: 'user', text: '> shubharthi --mode research "Synthesize 42 user interviews for care dashboard"' },
            { type: 'system', text: '[System] Processing audio transcripts and feedback logs...' },
            { type: 'ai', text: '📊 Natural Language Processing: Extracting tags...' },
            { type: 'ai', text: '🏷️ Found Core Themes: "alert fatigue" (84%), "missing logs detail" (62%), "caregiver cognitive load" (79%)' },
            { type: 'ai', text: '🧠 Mapping: Generating digital affinity model (Hubble Smart Living)' },
            { type: 'system', text: '[System] Creating UX architecture priority recommendations...' },
            { type: 'ai', text: '📈 Insight: Alert prioritization should reduce low-risk sound events by 40%.' }
        ],
        prototype: [
            { type: 'user', text: '> shubharthi --mode prototype "Create code-first mock of CPQ interface config"' },
            { type: 'system', text: '[System] Invoking rapid prototyping engine...' },
            { type: 'ai', text: '💻 Code Generation: Compiling layout grid variables (Plus Jakarta Sans)' },
            { type: 'ai', text: '🔧 Rendering components: AccordionSelector, DynamicSummary, FalloutIndicator' },
            { type: 'ai', text: '🎨 Injecting Brand Tokens: Primary Gold, Slate Background, Slate Text' },
            { type: 'system', text: '[System] Verifying mobile responsiveness & contrast ratio...' },
            { type: 'ai', text: '🚀 Demo: Hot-reloading responsive web mock. Interactive viewport ready!' }
        ]
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab buttons
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const mode = tab.getAttribute('data-mode');
            runSimulation(mode);
        });
    });

    let typingInterval = null;

    function runSimulation(mode) {
        // Clear previous intervals/content
        if (typingInterval) clearInterval(typingInterval);
        playgroundBody.innerHTML = '';
        
        const sequence = simulations[mode];
        let currentLine = 0;
        
        function printNextLine() {
            if (currentLine >= sequence.length) return;
            
            const lineData = sequence[currentLine];
            const lineElement = document.createElement('div');
            
            if (lineData.type === 'user') {
                lineElement.className = 'ai-flow-node user-node';
            } else if (lineData.type === 'ai') {
                lineElement.className = 'ai-flow-node ai-node';
            } else {
                lineElement.className = 'ai-flow-arrow';
            }
            
            playgroundBody.appendChild(lineElement);
            
            // Auto scroll console
            playgroundBody.scrollTop = playgroundBody.scrollHeight;
            
            // Typewriter effect
            let textIndex = 0;
            const textToType = lineData.text;
            
            const typewriter = setInterval(() => {
                if (textIndex >= textToType.length) {
                    clearInterval(typewriter);
                    currentLine++;
                    // Delay before next line
                    setTimeout(printNextLine, 600);
                } else {
                    lineElement.innerHTML += textToType[textIndex];
                    textIndex++;
                }
            }, 15);
        }
        
        printNextLine();
    }

    // Run first simulation on load
    runSimulation('agentic');
}

/* ==========================================
   5. Case Study Modal Content Loader
   ========================================== */
function initCaseStudies() {
    const modal = document.getElementById('case-modal');
    if (!modal) return;
    const overlay = modal.querySelector('.cs-modal-overlay');
    const closeBtn = modal.querySelector('.cs-modal-close');
    const viewButtons = document.querySelectorAll('.case-view-trigger');
    
    // Case study copy database
    const caseData = {
        'cpq': {
            tag: 'Enterprise Product Design',
            title: 'B2B CPQ & Order Management',
            client: 'Amdocs (Optus & Elisa)',
            role: 'Lead Experience Strategist',
            period: 'Nov 2022 - Present',
            challenge: 'The enterprise CPQ (Configure, Price, Quote) checkout process was highly disjointed. Sales representatives were forced to navigate through multiple nested validation tabs and complex telecom bundling rules. Order submission fallout was high, leading to significant support costs and delayed processing.',
            body: `
                <h3>The Challenge</h3>
                <p>Enterprise telecommunications platforms suffer from massive technical and business rule complexity. Sales agents had to handle complex business rules, pricing variations, and multi-step approvals. The cognitive load was immense, causing order creation to average over 8 minutes, with validation errors occurring on 25% of all configurations.</p>
                
                <div class="cs-challenge-box">
                    <h4>Primary Objective</h4>
                    <p>Streamline the configure-to-order workflow, implement a resilient error-handling UI system, and speed up transactions for commercial telecom agents across Australia (Optus) and Finland (Elisa).</p>
                </div>

                <h3>Research & System Mapping</h3>
                <p>I began by mapping out the entire system lifecycle—from initial lead intake through quote configurations to backend order fulfillment and billing queues. Conducting contextual inquiry interviews with 15 sales operations experts highlighted where they hit roadblock validators. The information architecture was redesigned to follow a progressive disclosure pattern.</p>

                <h3>Design & Systems Thinking</h3>
                <p>By restructuring the task flows, we consolidated a 12-page setup wizard into a unified 3-step dynamic experience. I introduced pre-validations and smart defaults that pre-selected configuration paths based on client intent. We also drove the adoption of a shared component library to build visual consistency across product lines.</p>

                <h3>Business Impact</h3>
                <ul>
                    <li><strong>25% faster</strong> order creation speed, dropping averages from 8 minutes down to 6 minutes.</li>
                    <li><strong>20% reduction</strong> in validation errors, lowering backend fallout and support interventions.</li>
                    <li>Established a scalable design pattern adopted by 4 distinct product engineering teams.</li>
                </ul>
            `
        },
        'backoffice': {
            tag: 'Systems Thinking & IA',
            title: 'Backoffice Complexity Redesign',
            client: 'Pristyn Care & Cognizant',
            role: 'Associate Director / Lead Consultant',
            period: '2015 - 2022',
            challenge: 'Operators managing healthcare scheduling, insurance claim processing, and merchant workflows faced fragmented dashboard environments. Information was siloed across separate applications, leading to input errors and long validation backlogs.',
            body: `
                <h3>The Challenge</h3>
                <p>Hospital backoffice managers and logistics coordinators need to make split-second decisions regarding surgical schedules, insurance eligibility checkouts, and medical transport availability. Using three distinct platforms generated high human error and delayed processing times.</p>

                <div class="cs-challenge-box">
                    <h4>Primary Objective</h4>
                    <p>Consolidate disparate data dashboards into a singular, high-performance backoffice console that minimizes cognitive strain and provides intelligent validation mechanisms.</p>
                </div>

                <h3>Research & Service Mapping</h3>
                <p>Through shadowing operational agents at medical hubs, I discovered that their workflows were circular rather than linear. They spent 40% of their time verifying data between screens. We constructed a service blueprint mapping the digital actions alongside physical steps taken by medical staffs and coordinators.</p>

                <h3>Visual Architecture & Component Standardization</h3>
                <p>We designed a high-density dashboard structured around a dual-pane workspace. The left panel lists the queue prioritized by urgency, while the right displays the active context (patient history, documents, validation checks). We built a unified library of high-density tabular displays, status badges, and inline validation flags to minimize modal dialog interruptions.</p>

                <h3>Business Impact</h3>
                <ul>
                    <li><strong>Unified Component Library:</strong> Created 45+ accessible UI components adopted across consumer and enterprise projects.</li>
                    <li><strong>Reduced Operator Ramp Time:</strong> Simplified workflow reduced new employee onboarding from 12 days to just 3 days.</li>
                    <li><strong>Error Reduction:</strong> Data input errors dropped by 18% due to localized validation feedback.</li>
                </ul>
            `
        },
        'ai-native': {
            tag: 'AI-Enabled Experiences',
            title: 'AI-Enabled Experiences & Dashboards',
            client: 'Hubble Connected / Amdocs (R&D)',
            role: 'Head of UX / AI UX Expert',
            period: '2021 - Present',
            challenge: 'Caregivers and monitoring operators had to process massive amounts of raw sensor data and log streams. Standard dashboards triggered alert fatigue, rendering critical alerts unnoticeable among hundreds of minor logs.',
            body: `
                <h3>The Challenge</h3>
                <p>In smart living (IoT) and enterprise software monitoring, alerts occur constantly. If everything is labeled high priority, nothing is. Users suffer from alarm desensitization, occasionally missing crucial milestones or service outages.</p>

                <div class="cs-challenge-box">
                    <h4>Primary Objective</h4>
                    <p>Leverage agentic workflows and AI-assisted models to pre-filter and prioritize notifications, presenting natural-language summaries rather than complex data graphs.</p>
                </div>

                <h3>Co-Design & AI Synthesis</h3>
                <p>We researched how human operators interact with complex event logs. Instead of displaying scrolling logs, we designed an AI co-pilot widget that analyzes events, aggregates anomalies into a singular issue log, and draft proposed solutions in clear language.</p>

                <h3>Interface Implementation</h3>
                <p>The UX features a side-docked chat console alongside the central monitoring grid. When an anomaly occurs (e.g. system slowdown or infant breathing anomaly), the AI highlights the affected node, displays a human-readable summary, and generates a two-click resolution path.</p>

                <h3>Business Impact</h3>
                <ul>
                    <li><strong>Alert fatigue drop:</strong> Reduced volume of false alerts displayed to users by over 50%.</li>
                    <li><strong>Resolution speedup:</strong> Incident root-cause identification time fell by 30% during user tests.</li>
                    <li>Designed standard guidelines for AI Microcopy and agent handoffs used in current AI initiatives.</li>
                </ul>
            `
        }
    };

    // Open Modal
    viewButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const id = btn.getAttribute('data-case-id');
            const data = caseData[id];
            
            if (data) {
                populateModal(data);
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Lock scroll
            }
        });
    });

    // Close Modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Unlock scroll
    }

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    
    // ESC key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    function populateModal(data) {
        modal.querySelector('.cs-header-tag').textContent = data.tag;
        modal.querySelector('.cs-header-title').textContent = data.title;
        modal.querySelector('.cs-client').textContent = data.client;
        modal.querySelector('.cs-role').textContent = data.role;
        modal.querySelector('.cs-period').textContent = data.period;
        modal.querySelector('.cs-body').innerHTML = data.body;
        
        // Reset scroll position of modal content
        modal.querySelector('.cs-modal-content').scrollTop = 0;
    }
}

/* ==========================================
   6. Case Study Password Protection
   ========================================== */
function isCaseStudyUnlocked() {
    const unlockTimeStr = sessionStorage.getItem('portfolio_unlocked_time');
    if (!unlockTimeStr) return false;
    
    const unlockTime = parseInt(unlockTimeStr, 10);
    const now = Date.now();
    const UNLOCK_DURATION = 10 * 60 * 1000; // 10 minutes in ms
    
    if (now - unlockTime < UNLOCK_DURATION) {
        return true;
    } else {
        sessionStorage.removeItem('portfolio_unlocked_time');
        return false;
    }
}

function initPasswordProtection() {
    const protectedElements = document.querySelectorAll(
        'a[href="sales-to-order.html"], [data-protected-link="sales-to-order.html"],' +
        'a[href="operational-systems.html"], [data-protected-link="operational-systems.html"],' +
        'a[href="agentic-workflows.html"], [data-protected-link="agentic-workflows.html"]'
    );
    
    // Inject custom CSS styling matching the platform theme
    injectPasswordStyles();

    protectedElements.forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            const targetUrl = el.getAttribute('href') || el.getAttribute('data-protected-link');
            
            if (isCaseStudyUnlocked()) {
                document.body.classList.add('page-exit');
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 300);
            } else {
                showPasswordModal(targetUrl);
            }
        });
    });
}

function showPasswordModal(targetUrl) {
    let overlay = document.querySelector('.pwd-modal-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'pwd-modal-overlay';
        overlay.innerHTML = `
            <div class="pwd-modal-card">
                <div class="pwd-lock-icon">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                </div>
                <h3 class="pwd-title">Protected Case Study</h3>
                <p class="pwd-desc">This case study contains proprietary B2B work. Please enter the password to view.</p>
                <div class="pwd-input-wrap">
                    <input type="password" id="case-study-pwd-input" placeholder="Enter password" autocomplete="off" />
                    <div class="pwd-error-msg" id="pwd-error-hint">Incorrect password. Please try again.</div>
                </div>
                <div class="pwd-action-buttons">
                    <button class="pwd-btn pwd-btn-cancel" id="pwd-cancel-btn">Cancel</button>
                    <button class="pwd-btn pwd-btn-submit" id="pwd-submit-btn">Unlock</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    // Bind custom cursor hover states dynamically for the overlay elements
    const pwdInteractiveEls = overlay.querySelectorAll('.pwd-btn, #case-study-pwd-input');
    pwdInteractiveEls.forEach(el => {
        el.onmouseenter = () => document.body.classList.add('hovering-link');
        el.onmouseleave = () => {
            document.body.classList.remove('hovering-link');
            // Safely verify if mouse left link
            if (el.tagName === 'BUTTON' || el.tagName === 'INPUT') {
                document.body.classList.remove('hovering-link');
            }
        };
    });

    const input = overlay.querySelector('#case-study-pwd-input');
    const submitBtn = overlay.querySelector('#pwd-submit-btn');
    const cancelBtn = overlay.querySelector('#pwd-cancel-btn');
    const errorHint = overlay.querySelector('#pwd-error-hint');
    const card = overlay.querySelector('.pwd-modal-card');

    // Reset modal states
    input.value = '';
    errorHint.style.display = 'none';
    card.classList.remove('pwd-shake');

    // Display overlay
    setTimeout(() => overlay.classList.add('active'), 10);
    input.focus();

    // Click trigger and keydown event bindings
    function handleSubmit() {
        const val = input.value.trim();
        if (val === 'tuli') {
            sessionStorage.setItem('portfolio_unlocked_time', Date.now().toString());
            overlay.classList.remove('active');
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 300);
        } else {
            // Apply shake micro-animation feedback
            card.classList.remove('pwd-shake');
            void card.offsetWidth; // Trigger redraw
            card.classList.add('pwd-shake');
            errorHint.style.display = 'block';
            input.value = '';
            input.focus();
        }
    }

    function handleCancel() {
        overlay.classList.remove('active');
    }

    submitBtn.onclick = handleSubmit;
    cancelBtn.onclick = handleCancel;
    overlay.onclick = (e) => {
        if (e.target === overlay) handleCancel();
    };

    input.onkeydown = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };
}

function injectPasswordStyles() {
    if (document.getElementById('pwd-modal-styles')) return;

    const styleEl = document.createElement('style');
    styleEl.id = 'pwd-modal-styles';
    styleEl.textContent = `
        .pwd-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(18, 22, 30, 0.4);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        .pwd-modal-overlay.active {
            opacity: 1;
        }
        .pwd-modal-card {
            background: var(--bg-primary);
            border: 1px solid var(--card-border);
            padding: 2.5rem;
            border-radius: 16px;
            width: 90%;
            max-width: 420px;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
            transform: scale(0.9);
            transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .pwd-modal-overlay.active .pwd-modal-card {
            transform: scale(1);
        }
        .pwd-lock-icon {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: rgba(239, 131, 84, 0.1);
            color: var(--accent-gold);
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0 auto 1.5rem;
        }
        .pwd-title {
            font-family: var(--font-heading);
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 0.5rem;
        }
        .pwd-desc {
            font-family: var(--font-body);
            font-size: 0.95rem;
            color: var(--text-secondary);
            line-height: 1.5;
            margin-bottom: 1.8rem;
        }
        .pwd-input-wrap {
            margin-bottom: 1.8rem;
            text-align: left;
        }
        #case-study-pwd-input {
            width: 100%;
            padding: 0.8rem 1rem;
            border-radius: 8px;
            border: 1.5px solid var(--card-border);
            background: var(--bg-secondary);
            color: var(--text-primary);
            font-family: var(--font-body);
            font-size: 0.95rem;
            transition: border-color 0.2s, box-shadow 0.2s;
        }
        #case-study-pwd-input:focus {
            outline: none;
            border-color: var(--accent-gold);
            box-shadow: 0 0 0 3px rgba(239, 131, 84, 0.15);
        }
        .pwd-error-msg {
            color: #ff5f56;
            font-size: 0.85rem;
            margin-top: 0.5rem;
            display: none;
            font-family: var(--font-body);
        }
        .pwd-action-buttons {
            display: flex;
            gap: 1rem;
        }
        .pwd-btn {
            flex: 1;
            padding: 0.8rem;
            border-radius: 8px;
            font-family: var(--font-body);
            font-size: 0.95rem;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s, transform 0.1s;
            border: none;
        }
        .pwd-btn-cancel {
            background: var(--bg-tertiary);
            color: var(--text-primary);
        }
        .pwd-btn-cancel:hover {
            background: rgba(0, 0, 0, 0.05);
        }
        [data-theme="dark"] .pwd-btn-cancel:hover {
            background: rgba(255, 255, 255, 0.05);
        }
        .pwd-btn-submit {
            background: var(--accent-gold);
            color: #ffffff;
        }
        .pwd-btn-submit:hover {
            filter: brightness(1.1);
        }
        .pwd-btn:active {
            transform: scale(0.98);
        }
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-6px); }
            40%, 80% { transform: translateX(6px); }
        }
        .pwd-shake {
            animation: shake 0.35s ease-in-out;
        }
    `;
    document.head.appendChild(styleEl);
}

/* ==========================================
   Page Exit Transitions (Seamless animations)
   ========================================== */
function initPageExitTransitions() {
    // 1. Handle regular link clicks
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.getAttribute('href') && !link.getAttribute('target')) {
            const href = link.getAttribute('href');
            
            // Skip links that start with # or are javascript:void(0)
            if (href.startsWith('#') || href.includes('javascript:void(0)')) return;
            
            // Skip current page hash links
            const currentPath = window.location.pathname.split('/').pop() || 'index.html';
            const targetPath = href.split('#')[0].split('/').pop() || 'index.html';
            if (currentPath === targetPath && href.includes('#')) return;

            e.preventDefault();
            document.body.classList.add('page-exit');
            setTimeout(() => {
                window.location.href = href;
            }, 300);
        }
    });

    // 2. Handle category card onclick redirects
    document.querySelectorAll('.category-card').forEach(card => {
        if (card.hasAttribute('onclick')) {
            const match = card.getAttribute('onclick').match(/'([^']+)'/);
            if (match && match[1]) {
                const url = match[1];
                card.removeAttribute('onclick');
                card.addEventListener('click', (e) => {
                    e.preventDefault();
                    document.body.classList.add('page-exit');
                    setTimeout(() => {
                        window.location.href = url;
                    }, 300);
                });
            }
        }
    });

    // 3. Prevent page being stuck in faded-out state when navigating using browser history
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            document.body.classList.remove('page-exit');
        }
    });
}

function initFloatingActionButtons() {
    // 1. Inject Scroll-to-Top Button
    const rightContainer = document.createElement('div');
    rightContainer.className = 'fab-container-right';
    
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.className = 'floating-btn scroll-top-fab';
    scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
    scrollTopBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="19" x2="12" y2="5"></line>
            <polyline points="5 12 12 5 19 12"></polyline>
        </svg>
    `;
    rightContainer.appendChild(scrollTopBtn);
    document.body.appendChild(rightContainer);

    // Toggle scroll top button visibility on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 2. Inject Floating Back Button (if not on Home page)
    const path = window.location.pathname;
    const isHome = path.endsWith('index.html') || path.endsWith('/') || path === '';
    
    if (!isHome) {
        const leftContainer = document.createElement('div');
        leftContainer.className = 'fab-container-left';
        
        const backBtn = document.createElement('a');
        backBtn.className = 'floating-btn back-fab';
        
        let backUrl = 'index.html';
        let backText = 'Back to Home';
        
        // Match both normal server route and absolute file path from local folder
        if (path.includes('sales-to-order.html') || path.includes('operational-systems.html') || path.includes('agentic-workflows.html')) {
            backUrl = 'work.html';
            backText = 'Back to Featured Work';
        }
        
        backBtn.setAttribute('href', backUrl);
        backBtn.setAttribute('aria-label', backText);
        backBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span class="back-fab-text">${backText}</span>
        `;
        
        // Add custom click override to support our page transition exit animations
        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.body.classList.add('page-exit');
            setTimeout(() => {
                window.location.href = backUrl;
            }, 300);
        });

        // Toggle back button visibility on scroll to avoid duplication at the top
        function checkBackFabScroll() {
            if (window.scrollY > 200) {
                backBtn.classList.add('visible');
            } else {
                backBtn.classList.remove('visible');
            }
        }
        window.addEventListener('scroll', checkBackFabScroll);
        checkBackFabScroll(); // Run immediately on load
        
        leftContainer.appendChild(backBtn);
        document.body.appendChild(leftContainer);
    }
}

/* ==========================================
   10. Mobile Responsive Navigation & Hamburger
   ========================================== */
function initMobileNav() {
    const toggleBtn = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!toggleBtn || !navLinks) return;
    
    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = navLinks.classList.contains('active');
        
        toggleBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
        toggleBtn.setAttribute('aria-expanded', !isOpen);
        
        if (!isOpen) {
            document.body.style.overflow = 'hidden'; // Prevent body scroll when menu open
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Close mobile menu when a nav link is clicked
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            toggleBtn.classList.remove('active');
            navLinks.classList.remove('active');
            toggleBtn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside of nav-links
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !toggleBtn.contains(e.target)) {
            toggleBtn.classList.remove('active');
            navLinks.classList.remove('active');
            toggleBtn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
}


