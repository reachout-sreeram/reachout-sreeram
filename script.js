document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================================================
       Rotating Role Typewriter (sidebar + hero)
       ========================================================================== */
    const ROLES = [
        'AI/ML Engineer',
        'Agentic Systems Builder',
        'LLMOps Engineer',
        'GenAI Product Engineer',
        'Problem Solver'
    ];

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function startRoleRotation(el, speed = {}) {
        if (!el) return;
        if (prefersReducedMotion) {
            el.textContent = ROLES[0];
            return;
        }

        const typeMs = speed.type || 70;
        const eraseMs = speed.erase || 35;
        const holdMs = speed.hold || 1600;

        let roleIndex = 0;
        let charIndex = 0;
        let erasing = false;

        function tick() {
            const current = ROLES[roleIndex];

            if (!erasing) {
                charIndex++;
                el.textContent = current.slice(0, charIndex);
                if (charIndex === current.length) {
                    erasing = true;
                    return setTimeout(tick, holdMs);
                }
                return setTimeout(tick, typeMs);
            }

            charIndex--;
            el.textContent = current.slice(0, charIndex);
            if (charIndex === 0) {
                erasing = false;
                roleIndex = (roleIndex + 1) % ROLES.length;
                return setTimeout(tick, 350);
            }
            return setTimeout(tick, eraseMs);
        }

        tick();
    }

    startRoleRotation(document.getElementById('roleRotator'));
    startRoleRotation(document.getElementById('heroRoleRotator'), { type: 80, hold: 2000 });

    // Navigation / Tab Switching Elements
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');
    
    // Mobile Drawer Elements
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    // Project Filter Elements
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    // Contact Form Elements
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    /* ==========================================================================
       Tab Switching Logic
       ========================================================================== */
    function switchTab(tabId) {
        // Remove active class from all nav items
        navItems.forEach(item => {
            if (item.getAttribute('data-tab') === tabId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Hide all sections, display target section
        sections.forEach(section => {
            if (section.id === tabId) {
                section.classList.add('active');
                // Scroll to top of content window when section switches
                window.scrollTo({ top: 0, behavior: 'instant' });
            } else {
                section.classList.remove('active');
            }
        });

        // Close sidebar if open (mobile)
        closeMobileSidebar();
    }

    // Attach click events to navbar items
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = item.getAttribute('data-tab');
            switchTab(tabId);
            // Update hash without triggering hashchange scroll jumping
            history.pushState(null, null, `#${tabId}`);
        });
    });

    // Support home page shortcut buttons
    const navShortcuts = document.querySelectorAll('.nav-shortcut');
    navShortcuts.forEach(shortcut => {
        shortcut.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = shortcut.getAttribute('data-target');
            switchTab(targetId);
            history.pushState(null, null, `#${targetId}`);
        });
    });

    // Check URL hash on initial load to route correctly
    const initialHash = window.location.hash.substring(1);
    if (initialHash) {
        const validSection = Array.from(sections).some(s => s.id === initialHash);
        if (validSection) {
            switchTab(initialHash);
        }
    }

    /* ==========================================================================
       Mobile Menu Toggle (Drawer)
       ========================================================================== */
    function openMobileSidebar() {
        sidebar.classList.add('open');
        sidebarOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeMobileSidebar() {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore background scrolling
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', openMobileSidebar);
    }
    
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeMobileSidebar);
    }

    /* ==========================================================================
       Project Filtering
       ========================================================================== */
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from other buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    // Force a tiny reflow for fade-in effect if needed
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(4px)';
                    card.style.display = 'none';
                }
            });
        });
    });

    /* ==========================================================================
       Contact Form Submission
       ========================================================================== */
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalBtnText = submitBtn.textContent;
            
            // Set loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            formStatus.className = 'form-status';
            formStatus.textContent = '';

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            try {
                // Post directly to FormSubmit's AJAX endpoint
                const response = await fetch("https://formsubmit.co/ajax/reachout.sreeram@gmail.com", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({
                        Name: name,
                        Email: email,
                        Message: message
                    })
                });

                if (response.ok) {
                    formStatus.className = 'form-status success';
                    formStatus.textContent = 'Thank you! Your message has been sent directly to Saketh.';
                    contactForm.reset();
                } else {
                    throw new Error("API failed");
                }
            } catch (error) {
                // Fail-safe fallback: let the user know and open the local mail client
                formStatus.className = 'form-status error';
                formStatus.textContent = 'Unable to send background message. Opening mail client instead...';
                
                setTimeout(() => {
                    const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
                    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
                    const mailtoUrl = `mailto:reachout.sreeram@gmail.com?subject=${subject}&body=${body}`;
                    window.location.href = mailtoUrl;
                    contactForm.reset();
                }, 1500);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }
});
