document.addEventListener('DOMContentLoaded', () => {

    // ── Init Lucide Icons ──────────────────────────────────────
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // ── Sticky Navbar ─────────────────────────────────────────
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
    });

    // ── Mobile Hamburger ──────────────────────────────────────
    const hamburger = document.getElementById('hamburger');
    const navMenu   = document.getElementById('nav-menu');
    hamburger.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('open');
        hamburger.innerHTML = isOpen
            ? '<i data-lucide="x"></i>'
            : '<i data-lucide="menu"></i>';
        lucide.createIcons();
    });
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            hamburger.innerHTML = '<i data-lucide="menu"></i>';
            lucide.createIcons();
        });
    });

    // ── Scroll Reveal ─────────────────────────────────────────
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                revealObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

    // ── Animated Number Counters ──────────────────────────────
    function animateCount(el, target, suffix, duration = 1800) {
        let start = 0;
        const step = timestamp => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target;
        };
        requestAnimationFrame(step);
    }

    const counterObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const el = e.target.querySelector('.result-num');
                if (el && !el.dataset.animated) {
                    el.dataset.animated = 'true';
                    animateCount(el, parseInt(el.dataset.target), '');
                }
                counterObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.4 });

    document.querySelectorAll('.result-stat').forEach(el => counterObs.observe(el));

    // ── Live Dashboard Animation ───────────────────────────────
    const dashTasks = document.getElementById('dash-tasks');
    const tasksDoneEl = document.getElementById('tasks-done');
    const hoursSavedEl = document.getElementById('hours-saved');

    const taskPool = [
        { icon: '📧', cls: 'green',  label: 'Email reply sent to new lead',       status: 'Done',    isDone: true  },
        { icon: '✅', cls: 'green',  label: 'Lead scored & added to CRM',          status: 'Done',    isDone: true  },
        { icon: '📊', cls: 'indigo', label: 'Weekly sales report generating...',   status: 'Working', isDone: false },
        { icon: '💬', cls: 'green',  label: 'Customer query answered instantly',   status: 'Done',    isDone: true  },
        { icon: '📅', cls: 'amber',  label: 'Booking confirmation sent',           status: 'Done',    isDone: true  },
        { icon: '🔍', cls: 'indigo', label: 'Analysing inbound document...',       status: 'Working', isDone: false },
        { icon: '📩', cls: 'green',  label: 'Follow-up email dispatched',          status: 'Done',    isDone: true  },
        { icon: '💡', cls: 'amber',  label: 'New lead flagged as high priority',   status: 'Done',    isDone: true  },
    ];

    let tasksDone = 47;
    let hoursSaved = 6;
    let taskIdx = 0;

    function addDashTask() {
        if (!dashTasks) return;

        // Keep max 4 rows visible
        while (dashTasks.children.length >= 4) {
            dashTasks.removeChild(dashTasks.firstChild);
        }

        const t = taskPool[taskIdx % taskPool.length];
        taskIdx++;

        const row = document.createElement('div');
        row.className = `task-row${t.isDone ? ' done' : ''}`;
        row.innerHTML = `
            <div class="task-icon ${t.cls}">${t.icon}</div>
            <span class="task-text">${t.label}</span>
            <span class="task-status ${t.isDone ? 'done' : 'working'}">${t.status}</span>
        `;
        dashTasks.appendChild(row);

        if (t.isDone) {
            tasksDone++;
            if (tasksDoneEl) tasksDoneEl.textContent = tasksDone;
            if (taskIdx % 3 === 0) {
                hoursSaved++;
                if (hoursSavedEl) hoursSavedEl.textContent = hoursSaved;
            }
        }
    }

    // Start with 3 initial tasks
    addDashTask(); addDashTask(); addDashTask();
    setInterval(addDashTask, 2400);

    // ── Before vs After Simulator ─────────────────────────────
    const scenarios = {
        leads: {
            title: '📥 New Lead Comes In',
            without: [
                { time: 'Day 1 — 9am',  text: 'Lead submits a form on your website.' },
                { time: 'Day 1 — 2pm',  text: 'You finally see the email between meetings.' },
                { time: 'Day 2 — 10am', text: 'You write a personalised reply manually.' },
                { time: 'Day 3 — 9am',  text: 'No follow-up. Lead has gone cold.' },
            ],
            with: [
                { time: '0 seconds',   text: 'Lead submits form. AI reads it instantly.' },
                { time: '5 seconds',   text: 'Personalised reply sent automatically.' },
                { time: '2 minutes',   text: 'Lead profile created and scored in your CRM.' },
                { time: '24 hours',    text: 'AI sends a follow-up. Lead books a call.' },
            ],
            without_result: '❌ Lead lost. No response after 48+ hours.',
            with_result:    '✅ Lead booked a meeting — with zero manual effort.',
            metrics: [
                { num: '130x', label: 'Faster first response' },
                { num: '40%',  label: 'More leads converted' },
                { num: '0',    label: 'Hours spent by your team' },
            ]
        },
        support: {
            title: '💬 Customer Has a Problem',
            without: [
                { time: 'Monday 10am',  text: 'Customer emails asking about their order.' },
                { time: 'Monday 3pm',   text: 'Support team sees it. Checks the system.' },
                { time: 'Monday 4pm',   text: 'Reply sent after researching the issue.' },
                { time: 'Next day',     text: 'Customer had already complained online.' },
            ],
            with: [
                { time: '0 seconds',  text: 'Customer emails with their issue.' },
                { time: '3 seconds',  text: 'AI reads the email and checks their account.' },
                { time: '8 seconds',  text: 'Accurate, helpful reply sent automatically.' },
                { time: '30 seconds', text: 'Ticket logged and closed. Customer happy.' },
            ],
            without_result: '❌ Customer frustrated. May leave a bad review.',
            with_result:    '✅ Customer delighted. Problem solved in under a minute.',
            metrics: [
                { num: '10x',  label: 'Faster response' },
                { num: '70%',  label: 'Tickets resolved automatically' },
                { num: '24/7', label: 'Always available' },
            ]
        },
        reports: {
            title: '📊 Monthly Report Needed',
            without: [
                { time: 'Week 1',       text: 'You remind staff to compile data.' },
                { time: 'Week 2',       text: 'Data arrives in 4 different spreadsheets.' },
                { time: 'Week 3',       text: 'Someone manually merges and formats it.' },
                { time: 'End of month', text: 'Report ready. Took 3 weeks of back-and-forth.' },
            ],
            with: [
                { time: 'Day 1 — 8am', text: 'AI automatically pulls data from all systems.' },
                { time: 'Day 1 — 8:02am', text: 'Data validated and inconsistencies flagged.' },
                { time: 'Day 1 — 8:05am', text: 'Full report drafted with charts and insights.' },
                { time: 'Day 1 — 8:10am', text: 'Report emailed to stakeholders automatically.' },
            ],
            without_result: '❌ 3 weeks wasted. Data often outdated by the time it arrives.',
            with_result:    '✅ Complete report ready in 10 minutes. Every single month.',
            metrics: [
                { num: '99%',  label: 'Time saved on reports' },
                { num: '100%', label: 'Data accuracy' },
                { num: '0',    label: 'Hours of manual work' },
            ]
        },
        followup: {
            title: '📧 Following Up With a Quote',
            without: [
                { time: 'Day 1',   text: 'You send a quote to a potential client.' },
                { time: 'Day 5',   text: 'You mean to follow up, but forget.' },
                { time: 'Day 14',  text: 'You remember and send a belated email.' },
                { time: 'Day 15',  text: 'Client says they already went with someone else.' },
            ],
            with: [
                { time: 'Day 1',  text: 'Quote sent. AI schedules a follow-up automatically.' },
                { time: 'Day 3',  text: 'Friendly follow-up email sent by AI.' },
                { time: 'Day 5',  text: 'Client opens the email. AI detects interest.' },
                { time: 'Day 6',  text: 'AI alerts you: "This lead is ready to close."' },
            ],
            without_result: '❌ Deal lost. Competitor followed up faster.',
            with_result:    '✅ Deal won. You were alerted at the perfect moment.',
            metrics: [
                { num: '40%', label: 'More deals closed' },
                { num: '3x',  label: 'Faster follow-up' },
                { num: '0',   label: 'Leads forgotten' },
            ]
        }
    };

    let activeScene = 'leads';

    function renderScenario(id) {
        const s = scenarios[id];
        if (!s) return;

        // Update without timeline
        const withoutTL = document.getElementById('without-timeline');
        const withTL    = document.getElementById('with-timeline');
        const withoutRes = document.getElementById('without-result');
        const withRes    = document.getElementById('with-result');
        const outBar     = document.getElementById('outcome-bar');

        if (!withoutTL) return;

        withoutTL.innerHTML = '';
        withTL.innerHTML    = '';

        s.without.forEach((item, i) => {
            const el = document.createElement('div');
            el.className = 'tl-item';
            el.style.animationDelay = `${i * 0.12}s`;
            el.innerHTML = `
                <div class="tl-dot red"></div>
                <div class="tl-content">
                    <div class="tl-time red">${item.time}</div>
                    <div class="tl-desc">${item.text}</div>
                </div>`;
            withoutTL.appendChild(el);
        });

        s.with.forEach((item, i) => {
            const el = document.createElement('div');
            el.className = 'tl-item';
            el.style.animationDelay = `${i * 0.12}s`;
            el.innerHTML = `
                <div class="tl-dot green"></div>
                <div class="tl-content">
                    <div class="tl-time green">${item.time}</div>
                    <div class="tl-desc">${item.text}</div>
                </div>`;
            withTL.appendChild(el);
        });

        if (withoutRes) withoutRes.textContent = s.without_result;
        if (withRes)    withRes.textContent    = s.with_result;

        if (outBar) {
            outBar.innerHTML = s.metrics.map(m => `
                <div class="outcome-metric">
                    <div class="om-num">${m.num}</div>
                    <div class="om-label">${m.label}</div>
                </div>`).join('');
        }

        lucide.createIcons();
    }

    // Bind scenario tabs
    document.querySelectorAll('.scen-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.scen-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeScene = btn.dataset.scene;
            renderScenario(activeScene);
        });
    });

    // Initial render
    renderScenario('leads');

    // ── ROI Calculator ────────────────────────────────────────
    const teamSlider = document.getElementById('team-size');
    const hoursSlider = document.getElementById('manual-hours');
    const teamValue = document.getElementById('team-value');
    const hoursValue = document.getElementById('hours-value');
    const hoursSavedCalc = document.getElementById('hours-saved-calc');
    const moneySavedCalc = document.getElementById('money-saved-calc');

    function updateCalculator() {
        if (!teamSlider || !hoursSlider) return;
        const team = parseInt(teamSlider.value);
        const hours = parseInt(hoursSlider.value);

        if (teamValue) teamValue.textContent = team + (team === 1 ? ' member' : ' members');
        if (hoursValue) hoursValue.textContent = hours + 'h';

        // Math: Monthly hours saved = Team * Hours/week * 4.33 weeks/month * 80% automated
        const monthlyHours = Math.round(team * hours * 4.33 * 0.8);
        // Annual Savings = Monthly hours saved * 12 months * loaded labor rate of $35/hour
        const annualSavings = Math.round(monthlyHours * 12 * 35);

        if (hoursSavedCalc) hoursSavedCalc.textContent = monthlyHours.toLocaleString() + 'h';
        if (moneySavedCalc) moneySavedCalc.textContent = '$' + annualSavings.toLocaleString();
    }

    if (teamSlider && hoursSlider) {
        teamSlider.addEventListener('input', updateCalculator);
        hoursSlider.addEventListener('input', updateCalculator);
        // Initialize values
        updateCalculator();
    }

    // ── Contact Form ──────────────────────────────────────────
    const form        = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');

    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const btn = document.getElementById('submit-btn');
            btn.textContent = 'Sending...';
            btn.disabled = true;

            setTimeout(() => {
                form.style.display = 'none';
                formSuccess.style.display = 'block';
                lucide.createIcons();
            }, 1200);
        });
    }
});
