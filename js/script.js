document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar scroll shadow effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Accessible Mobile Menu Toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        // Close mobile menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('open')) {
                    navLinks.classList.remove('open');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    // 3. Intersection Observer for Fade-In Animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));

    // 4. Interactive Hero Architecture Layer Switcher & Live Telemetry
    const archTabs = document.querySelectorAll('.arch-tab');
    const archDetailText = document.getElementById('arch-detail-text');
    const plcNodes = document.querySelectorAll('.node-plc');
    const scadaNodes = document.querySelectorAll('.node-scada');
    const iiotNodes = document.querySelectorAll('.node-iiot');

    const layerDescriptions = {
        overview: '<strong>End-to-End Integration:</strong> Seamless data flow from shop-floor PLC/Drive control loops up to SCADA supervision and cloud IIoT dashboards.',
        plc: '<strong>Level 1 — Field PLC, Redundancy &amp; Motion:</strong> High-speed deterministic control using Rockwell ControlLogix, Siemens S7, AC/DC/Servo drives, load cells, and safety I/O.',
        scada: '<strong>Level 2 — PlantPAx DCS &amp; SCADA Supervision:</strong> Centralized operator visualization, alarm management, and network validation across EtherNet/IP, PROFINET, and DeviceNet.',
        iiot: '<strong>Level 3 — Industry 4.0 IIoT &amp; Cloud Analytics:</strong> Python &amp; Node.js edge data logging, SPC quality tracking, barcode validation, and real-time power/solar monitoring.'
    };

    archTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const layer = tab.getAttribute('data-layer');

            archTabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');

            if (archDetailText && layerDescriptions[layer]) {
                archDetailText.innerHTML = layerDescriptions[layer];
            }

            // Highlight selected architecture tier
            const allNodes = [...plcNodes, ...scadaNodes, ...iiotNodes];
            if (layer === 'overview') {
                allNodes.forEach(n => n.classList.remove('dimmed'));
            } else {
                allNodes.forEach(n => n.classList.add('dimmed'));
                if (layer === 'plc') plcNodes.forEach(n => n.classList.remove('dimmed'));
                if (layer === 'scada') scadaNodes.forEach(n => n.classList.remove('dimmed'));
                if (layer === 'iiot') iiotNodes.forEach(n => n.classList.remove('dimmed'));
            }
        });
    });

    // Subtle simulated live telemetry readout in Hero
    const oeeEl = document.getElementById('telemetry-oee');
    const scanEl = document.getElementById('telemetry-scan');
    const kwEl = document.getElementById('telemetry-kw');

    if (oeeEl && scanEl && kwEl) {
        setInterval(() => {
            const oee = (96.1 + Math.random() * 0.7).toFixed(1);
            const scan = (3.9 + Math.random() * 0.6).toFixed(1);
            const kw = (410 + Math.random() * 6.5).toFixed(1);
            oeeEl.textContent = `${oee}%`;
            scanEl.textContent = `${scan} ms`;
            kwEl.textContent = `${kw} kW`;
        }, 3200);
    }

    // 5. Project Reference Table Industry Filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectRows = document.querySelectorAll('#project-table-body tr');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');

            filterBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');

            projectRows.forEach(row => {
                const category = row.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    row.removeAttribute('hidden');
                } else {
                    row.setAttribute('hidden', '');
                }
            });
        });
    });

    // 6. Accessible Form Validation (:user-invalid ARIA sync + WeakMap fallback)
    const syncAriaInvalid = (el) => {
        if (!el || typeof el.matches !== 'function') return;
        if (CSS.supports('selector(:user-invalid)')) {
            el.setAttribute('aria-invalid', el.matches(':user-invalid') ? 'true' : 'false');
        }
    };

    document.addEventListener('blur', (e) => {
        if (e.target && e.target.closest('#contact-form')) {
            syncAriaInvalid(e.target);
        }
    }, true);

    document.addEventListener('input', (e) => {
        if (e.target && e.target.hasAttribute('aria-invalid')) {
            syncAriaInvalid(e.target);
        }
    });

    const UserInvalidFallback = (() => {
        const dirtyState = new WeakMap();

        const updateState = (input) => {
            const isValid = input.checkValidity();
            input.classList.toggle('user-invalid-fallback', !isValid);
            input.classList.toggle('user-valid-fallback', isValid);
            if (!isValid) {
                input.setAttribute('aria-invalid', 'true');
            } else {
                input.removeAttribute('aria-invalid');
            }
        };

        const handleEvent = (event) => {
            const input = event.target;
            if (event.type === 'reset') {
                const controls = input.elements || [];
                for (const control of controls) {
                    dirtyState.delete(control);
                    control.classList.remove('user-invalid-fallback', 'user-valid-fallback');
                    control.removeAttribute('aria-invalid');
                }
                return;
            }

            if (!input || !input.checkValidity) return;

            if (event.type === 'input' || event.type === 'change') {
                const state = dirtyState.get(input) || { hasInteracted: false, hasBlurred: false };
                state.hasInteracted = true;
                dirtyState.set(input, state);
                if (state.hasBlurred) updateState(input);
            } else if (event.type === 'blur') {
                const state = dirtyState.get(input) || { hasInteracted: false, hasBlurred: false };
                state.hasBlurred = true;
                dirtyState.set(input, state);
                if (state.hasInteracted) updateState(input);
            }
        };

        const init = (root = document) => {
            if (CSS.supports('selector(:user-invalid)')) return;
            root.addEventListener('blur', handleEvent, true);
            root.addEventListener('input', handleEvent);
            root.addEventListener('change', handleEvent);
            root.addEventListener('reset', handleEvent, true);
        };

        return { init };
    })();

    // 7. Serverless Contact Form Submission (FormSubmit -> thumwh.ost@gmail.com)
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        UserInvalidFallback.init(contactForm);

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending Inquiry...';
            formStatus.textContent = '';
            formStatus.className = 'form-status';

            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    formStatus.textContent = 'Thank you! Your inquiry has been sent to thumwh.ost@gmail.com. Our engineering team will respond shortly.';
                    formStatus.classList.add('success');
                    contactForm.reset();
                } else {
                    throw new Error('Form service returned non-OK status');
                }
            } catch (err) {
                // Fallback to pre-filled mailto so no lead is ever lost
                const name = formData.get('name') || '';
                const company = formData.get('company') || '';
                const email = formData.get('email') || '';
                const phone = formData.get('phone') || '';
                const scope = formData.get('scope') || 'Engineering Inquiry';
                const message = formData.get('message') || '';

                const subject = encodeURIComponent(`[Website Inquiry] ${scope} — ${company || name}`);
                const body = encodeURIComponent(
                    `Name: ${name}\nCompany: ${company}\nEmail: ${email}\nPhone: ${phone}\nScope: ${scope}\n\nProject Details:\n${message}`
                );

                window.location.href = `mailto:thumwh.ost@gmail.com?subject=${subject}&body=${body}`;
                formStatus.textContent = 'Opening your email client to send directly to thumwh.ost@gmail.com...';
                formStatus.classList.add('success');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }
});
