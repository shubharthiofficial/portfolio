/**
 * Portfolio V2 - Context-Aware Project Guide Modal Controller
 * Intelligent Project Guide: Dynamically renders Story-Specific Briefings vs. Global Executive Briefings.
 */

document.addEventListener('DOMContentLoaded', () => {
    initExecutiveGuide();
});

function initExecutiveGuide() {
    if (!window.CASE_STUDY_AI_DATA) return;

    const data = window.CASE_STUDY_AI_DATA;
    let activeContextKey = 'global';

    // Create Modal Backdrop & Window DOM if not already present
    let modalBackdrop = document.getElementById('cs-ai-modal-backdrop');
    if (!modalBackdrop) {
        modalBackdrop = document.createElement('div');
        modalBackdrop.id = 'cs-ai-modal-backdrop';
        modalBackdrop.className = 'ai-modal-backdrop';
        modalBackdrop.innerHTML = `
            <div class="ai-modal-window" style="width: 90%; max-width: 1050px; max-height: 85vh;">
                <div class="ai-modal-header" style="padding: 1.25rem 1.75rem; border-bottom: 1px solid var(--card-border);">
                    <div class="ai-modal-title-wrap">
                        <svg class="ai-doc-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" stroke-width="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                            <line x1="16" y1="13" x2="8" y2="13"/>
                            <line x1="16" y1="17" x2="8" y2="17"/>
                        </svg>
                        <div>
                            <div style="display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap;">
                                <div class="ai-modal-title" style="font-size: 1.2rem; font-weight: 700; color: var(--text-primary);">Executive Summary</div>
                            </div>
                            <div class="ai-modal-subtitle" id="cs-ai-subtitle" style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 0.25rem;">
                                ${data.subtitle || 'Understand this project in under two minutes.'}
                            </div>
                        </div>
                    </div>
                    <button type="button" class="ai-modal-close-btn" id="cs-ai-modal-close" aria-label="Close modal">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>

                <div class="ai-modal-body" id="cs-ai-modal-body" style="padding: 1.5rem 1.75rem;">
                    <!-- DYNAMIC SUMMARY BOX (GLOBAL VS STORY SPECIFIC) -->
                    <div class="ai-summary-box" id="cs-ai-summary-container" style="margin-bottom: 1.5rem;"></div>

                    <!-- CONTINUE EXPLORING QUESTIONS BLOCK -->
                    <div class="ai-questions-block" id="cs-ai-questions-block" style="margin-bottom: 1.5rem;">
                        <div class="ai-questions-section-title" id="cs-ai-questions-title" style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; color: var(--text-tertiary); margin-bottom: 0.75rem;">
                            SUGGESTED QUESTIONS (CLICK TO ASK)
                        </div>
                        <div class="ai-question-pills-grid" id="cs-ai-pills-grid" style="display: flex; flex-wrap: wrap; gap: 0.65rem;"></div>
                    </div>

                    <!-- CONVERSATION HISTORY THREAD -->
                    <div class="ai-chat-thread" id="cs-ai-chat-thread" style="margin-top: 1rem;"></div>
                </div>
            </div>
        `;
        document.body.appendChild(modalBackdrop);
    }

    const modalBody = document.getElementById('cs-ai-modal-body');
    const summaryContainer = document.getElementById('cs-ai-summary-container');
    const pillsGrid = document.getElementById('cs-ai-pills-grid');
    const chatThread = document.getElementById('cs-ai-chat-thread');
    const closeBtn = document.getElementById('cs-ai-modal-close');
    const contextBadge = document.getElementById('cs-ai-context-badge');

    // Render Dynamic Summary Box based on Active Context
    function renderSummaryBox(ctxKey) {
        if (!summaryContainer) return;

        if (ctxKey === 'global' || !data.contexts || !data.contexts[ctxKey]) {
            // Render Global Executive Briefing Box
            summaryContainer.innerHTML = `
                <span class="ai-summary-badge">EXECUTIVE BRIEFING (~150 WORDS)</span>
                <p class="ai-summary-paragraph" style="font-size: 0.92rem; line-height: 1.6; color: var(--text-primary); margin-top: 0.5rem;">
                    ${data.executiveSummaryParagraph || ''}
                </p>
                <div class="ai-executive-tags-row" style="margin-top: 1rem;">
                    ${(data.executiveTags || []).map(tag => `
                        <div class="ai-executive-tag-pill">
                            <span class="ai-tag-label">${tag.label}:</span>
                            <span class="ai-tag-val">${tag.text}</span>
                        </div>
                    `).join('')}
                </div>
                <div style="margin-top: 1.5rem; border-top: 1px solid var(--card-border); padding-top: 1.25rem;">
                    <span style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; color: var(--accent-gold); display: block; margin-bottom: 0.75rem;">
                        CASE STUDY OVERVIEW
                    </span>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
                        ${(data.storyOverviews || []).map(so => `
                            <div class="ai-overview-card" style="border: 1px solid var(--card-border); border-radius: 8px; padding: 0.85rem 1rem;">
                                <h5 style="font-size: 0.85rem; font-weight: 600; color: var(--accent-gold); margin: 0 0 0.35rem 0;">${so.title}</h5>
                                <p style="font-size: 0.82rem; line-height: 1.45; color: var(--text-secondary); margin: 0;">${so.desc}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        } else {
            // Render Story-Specific Focus Briefing Box
            const ctxObj = data.contexts[ctxKey];
            summaryContainer.innerHTML = `
                <span class="ai-summary-badge" style="color: var(--accent-gold); border-color: rgba(252, 163, 17, 0.4);">${ctxObj.badge || 'STORY BRIEFING'}</span>
                <h4 style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin: 0.5rem 0 0.4rem 0;">${ctxObj.title || ''}</h4>
                <p class="ai-summary-paragraph" style="font-size: 0.92rem; line-height: 1.6; color: var(--text-primary); margin-top: 0.25rem;">
                    ${ctxObj.summaryParagraph || ''}
                </p>
                <div class="ai-executive-tags-row" style="margin-top: 1rem;">
                    ${(ctxObj.tags || []).map(tag => `
                        <div class="ai-executive-tag-pill">
                            <span class="ai-tag-label">${tag.label}:</span>
                            <span class="ai-tag-val">${tag.text}</span>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }

    // Helper to get question list for current context
    function getQuestionsForContext(ctxKey) {
        const ctxObj = (data.contexts && data.contexts[ctxKey]) || (data.contexts && data.contexts['global']);
        if (ctxObj && ctxObj.questions) {
            return Object.keys(ctxObj.questions);
        }
        return Object.keys(data.questions || {});
    }

    // Populate question pills for active context
    function renderPillsForContext(ctxKey) {
        if (!pillsGrid) return;
        pillsGrid.innerHTML = '';
        const questionsList = getQuestionsForContext(ctxKey);

        questionsList.forEach(qText => {
            const pill = document.createElement('button');
            pill.type = 'button';
            pill.className = 'ai-question-pill';
            pill.textContent = qText;
            pill.addEventListener('click', () => handleQuestionClick(qText, ctxKey));
            pillsGrid.appendChild(pill);
        });
    }

    // Switch Modal Active Context
    function setModalContext(ctxKey) {
        activeContextKey = ctxKey || 'global';
        const ctxObj = (data.contexts && data.contexts[activeContextKey]) || (data.contexts && data.contexts['global']);

        if (contextBadge) {
            contextBadge.textContent = ctxObj ? (ctxObj.badge || ctxObj.title) : 'Global Briefing';
        }

        renderSummaryBox(activeContextKey);
        renderPillsForContext(activeContextKey);
    }

    // Attach Event Listeners to Top Trigger Button
    const globalTriggerBtn = document.getElementById('btn-ask-ai-trigger');
    if (globalTriggerBtn) {
        globalTriggerBtn.addEventListener('click', () => {
            setModalContext('global');
            openModal();
        });
    }

    // Attach Event Listeners to Story-Specific Context Buttons
    function initStoryTriggers() {
        const storyBtns = document.querySelectorAll('.btn-ask-ai-story');
        storyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const storyId = btn.getAttribute('data-story-id') || 'global';
                setModalContext(storyId);
                openModal();
            });
        });
    }
    initStoryTriggers();

    function openModal() {
        modalBackdrop.classList.add('is-active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modalBackdrop.classList.remove('is-active');
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalBackdrop.classList.contains('is-active')) closeModal();
    });

    // Handle Question Click & Thread Append (Maintains conversation history while open)
    function handleQuestionClick(qText, ctxKey) {
        const ctxObj = (data.contexts && data.contexts[ctxKey]) || (data.contexts && data.contexts['global']);
        let answerText = '';

        if (ctxObj && ctxObj.questions && ctxObj.questions[qText]) {
            answerText = ctxObj.questions[qText];
        } else if (data.questions && data.questions[qText]) {
            answerText = typeof data.questions[qText] === 'string' ? data.questions[qText] : data.questions[qText].answer;
        } else {
            answerText = "In this case study, we prioritized cross-application consistency and non-blocking interaction models to reduce enterprise cognitive friction.";
        }

        // Append User Question Bubble
        const userMsg = document.createElement('div');
        userMsg.className = 'ai-msg user-q';
        userMsg.innerHTML = `<div class="ai-msg-bubble">${qText}</div>`;
        chatThread.appendChild(userMsg);

        // Append Answer Bubble with smooth animation
        setTimeout(() => {
            const aiMsg = document.createElement('div');
            aiMsg.className = 'ai-msg ai-a';
            aiMsg.innerHTML = `<div class="ai-msg-bubble">${answerText}</div>`;
            chatThread.appendChild(aiMsg);

            modalBody.scrollTo({ top: modalBody.scrollHeight, behavior: 'smooth' });
        }, 150);

        modalBody.scrollTo({ top: modalBody.scrollHeight, behavior: 'smooth' });
    }
}
