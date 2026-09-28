/**
 * Parth Solanki Portfolio - Main Interactions & Cyber Visuals
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. Matrix / Cyber Node Canvas Animation
    // ----------------------------------------------------
    const canvas = document.getElementById('cyber-canvas');
    let ctx = canvas ? canvas.getContext('2d') : null;
    let animationFrameId = null;
    let isCanvasActive = true;

    if (canvas && ctx) {
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        });

        // Cyber Grid & Floating Hex/Node Particles
        const particles = [];
        const particleCount = Math.min(Math.floor(width / 25), 65);

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.7;
                this.vy = (Math.random() - 0.5) * 0.7;
                this.radius = Math.random() * 2 + 1;
                this.alpha = Math.random() * 0.5 + 0.2;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 240, 255, ${this.alpha})`;
                ctx.fill();
            }
        }

        function initParticles() {
            particles.length = 0;
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function renderCanvas() {
            if (!isCanvasActive) return;
            ctx.clearRect(0, 0, width, height);

            // Connect nearby particles
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 120) {
                        const linkAlpha = (1 - dist / 120) * 0.22;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0, 240, 255, ${linkAlpha})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }

            animationFrameId = requestAnimationFrame(renderCanvas);
        }

        initParticles();
        renderCanvas();

        // Canvas Toggle Button
        const toggleBtn = document.getElementById('canvas-toggle-btn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                isCanvasActive = !isCanvasActive;
                if (isCanvasActive) {
                    renderCanvas();
                    toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
                    toggleBtn.setAttribute('title', 'Disable Background Animation');
                } else {
                    cancelAnimationFrame(animationFrameId);
                    ctx.clearRect(0, 0, width, height);
                    toggleBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
                    toggleBtn.setAttribute('title', 'Enable Background Animation');
                }
            });
        }
    }

    // ----------------------------------------------------
    // 2. Typewriter Effect in Hero Terminal
    // ----------------------------------------------------
    const typedTextElem = document.querySelector('.typing-target .typed-text');
    if (typedTextElem) {
        const phrases = [
            'nmap -sV -sC -T4 target.infra',
            'nuclei -u https://api.target.com -t critical',
            'python3 race_condition_exploit.py --concurrency 50',
            'curl -H "X-Forwarded-For: 127.0.0.1" -k https://admin',
            'burp --collaborator poll --active'
        ];
        let phraseIdx = 0;
        let charIdx = 0;
        let isDeleting = false;
        const typingSpeed = 70;
        const deletingSpeed = 40;
        const pauseTime = 1800;

        function typeLoop() {
            const current = phrases[phraseIdx];
            if (isDeleting) {
                typedTextElem.textContent = current.substring(0, charIdx - 1);
                charIdx--;
            } else {
                typedTextElem.textContent = current.substring(0, charIdx + 1);
                charIdx++;
            }

            let nextSpeed = isDeleting ? deletingSpeed : typingSpeed;

            if (!isDeleting && charIdx === current.length) {
                nextSpeed = pauseTime;
                isDeleting = true;
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                nextSpeed = 400;
            }

            setTimeout(typeLoop, nextSpeed);
        }

        typeLoop();
    }

    // ----------------------------------------------------
    // 3. Stats Counter Animation on Scroll
    // ----------------------------------------------------
    const statCards = document.querySelectorAll('.stat-number');
    let hasAnimatedStats = false;

    function animateStats() {
        statCards.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            const duration = 1800;
            const stepTime = 30;
            const totalSteps = duration / stepTime;
            const increment = target / totalSteps;
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.textContent = target;
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current);
                }
            }, stepTime);
        });
    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimatedStats) {
                hasAnimatedStats = true;
                animateStats();
            }
        });
    }, { threshold: 0.4 });

    const statsStrip = document.querySelector('.stats-strip');
    if (statsStrip) {
        statsObserver.observe(statsStrip);
    }

    // ----------------------------------------------------
    // 4. Research / Case Studies Category Filtering
    // ----------------------------------------------------
    const filterButtons = document.querySelectorAll('.filter-btn');
    const researchCards = document.querySelectorAll('.research-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-filter');

            researchCards.forEach(card => {
                const cardCat = card.getAttribute('data-category');
                if (category === 'all' || cardCat === category) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 250);
                }
            });
        });
    });

    // ----------------------------------------------------
    // 5. Case Study Modal Dialogs
    // ----------------------------------------------------
    const modalContainer = document.getElementById('modal-container');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    const modalTriggers = document.querySelectorAll('.modal-trigger-btn');
    const modalCloses = document.querySelectorAll('.modal-close-btn, .modal-backdrop');

    const abstracts = {
        'modal-oauth': {
            title: 'CASE-#0194: OAuth 2.0 Account Takeover Abstract',
            html: `
                <p><strong>Vector:</strong> Open Redirect coupled with Unvalidated OAuth State Parameter</p>
                <p><strong>Impact:</strong> Unauthorized takeover of client accounts without credential requirement.</p>
                <br>
                <p><strong>Technical Overview:</strong> During testing of a high-profile multi-tenant portal, analysis of the SSO flow revealed the client omitted the RFC 6749 <code>state</code> parameter. Concurrently, an open redirect existed on the asset's whitelisted domain.</p>
                <p>By chaining the open redirect to receive the authorization code callback, an attacker could force a victim to authenticate with attacker-controlled tokens or hijack victim authorization tokens.</p>
                <br>
                <p><strong>Remediation:</strong> Implemented cryptographically secure, unpredictable <code>state</code> parameter with session binding, and strict regex validation for OAuth redirect URIs.</p>
            `
        },
        'modal-idor': {
            title: 'CASE-#0241: Blind BOLA/IDOR in GraphQL Abstract',
            html: `
                <p><strong>Vector:</strong> Broken Object Level Authorization (BOLA/IDOR)</p>
                <p><strong>Impact:</strong> Bulk unauthorized retrieval of corporate accounts, ledgers, and transaction logs.</p>
                <br>
                <p><strong>Technical Overview:</strong> An introspected GraphQL endpoint revealed an internal query named <code>getCompanyStatement(companyUUID: String!)</code>. The service resolved queries directly against the database without verifying that the requesting user's tenant ID matched the requested companyUUID.</p>
                <br>
                <p><strong>Remediation:</strong> Added authorization middleware at the resolver level that derives tenant scope directly from validated JWT claims rather than client-supplied arguments.</p>
            `
        },
        'modal-race': {
            title: 'CASE-#0312: Concurrency & Race Condition Abstract',
            html: `
                <p><strong>Vector:</strong> Time-of-Check to Time-of-Use (TOCTOU) / Race Condition</p>
                <p><strong>Impact:</strong> Multiple coupon redemptions & negative checkout balance generation.</p>
                <br>
                <p><strong>Technical Overview:</strong> The application checked the validity of a one-time coupon in memory before recording its used state in PostgreSQL. By sending parallel burst requests synchronized with HTTP/2 multiplexing, 12 concurrent requests passed the validation step before the first database write locked the coupon.</p>
                <br>
                <p><strong>Remediation:</strong> Enforced atomic transactions with Redis distributed locks and database-level unique constraints.</p>
            `
        },
        'modal-ssrf': {
            title: 'CASE-#0388: SSRF to Cloud Metadata Abstract',
            html: `
                <p><strong>Vector:</strong> Server-Side Request Forgery via Custom Webhook Engine</p>
                <p><strong>Impact:</strong> Extraction of temporary cloud instance credentials (AWS IAM roles).</p>
                <br>
                <p><strong>Technical Overview:</strong> A webhook notification feature allowed users to provide an endpoint for event alerts. While private IPv4 ranges (10.0.0.0/8, 192.168.0.0/16) were blacklisted via simple string matching, the parser was susceptible to decimal/hex IP representation and IPv6-mapped IPv4 addresses, enabling requests to <code>http://169.254.169.254/latest/meta-data/</code>.</p>
                <br>
                <p><strong>Remediation:</strong> Transitioned to AWS IMDSv2 (requiring token-based session headers) and implemented robust DNS resolution validation prior to connection initiation.</p>
            `
        }
    };

    modalTriggers.forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.getAttribute('data-modal');
            if (abstracts[key]) {
                modalTitle.textContent = abstracts[key].title;
                modalContent.innerHTML = abstracts[key].html;
                modalContainer.classList.add('active');
            }
        });
    });

    modalCloses.forEach(btn => {
        btn.addEventListener('click', () => {
            modalContainer.classList.remove('active');
        });
    });

    // ----------------------------------------------------
    // 6. Copy PGP Fingerprint to Clipboard
    // ----------------------------------------------------
    const copyPgpBtn = document.getElementById('copy-pgp-btn');
    if (copyPgpBtn) {
        copyPgpBtn.addEventListener('click', () => {
            const fingerprint = "9A82 4B5F 1C73 8E90 D421 5683 2419 BCFE 8092 1A3E";
            navigator.clipboard.writeText(fingerprint).then(() => {
                copyPgpBtn.textContent = 'Copied!';
                copyPgpBtn.style.borderColor = 'var(--accent-green)';
                copyPgpBtn.style.color = 'var(--accent-green)';
                setTimeout(() => {
                    copyPgpBtn.textContent = 'Copy Key';
                    copyPgpBtn.style.borderColor = '';
                    copyPgpBtn.style.color = '';
                }, 2200);
            });
        });
    }

    // ----------------------------------------------------
    // 7. Contact Form Simulation & Feedback
    // ----------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');

    if (contactForm && formFeedback) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            formFeedback.style.display = 'block';
            formFeedback.style.color = 'var(--accent-cyan)';
            formFeedback.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Encrypting payload and establishing handshake...';

            setTimeout(() => {
                formFeedback.style.color = 'var(--accent-green)';
                formFeedback.innerHTML = '<i class="fas fa-check-circle"></i> Transmission successful. Parth Solanki will decrypt and review your inquiry.';
                contactForm.reset();
            }, 1200);
        });
    }

    // ----------------------------------------------------
    // 8. Mobile Navigation Toggle & Smooth Scrolling
    // ----------------------------------------------------
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.getElementById('nav-links');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close menu upon clicking any nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // Header shadow on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
});
