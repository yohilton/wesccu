document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Icons
    lucide.createIcons();

    // Product links lead to contact with the selected product already filled in.
    document.querySelectorAll('.service-link[data-product]').forEach(link => {
        link.addEventListener('click', () => {
            const message = document.getElementById('message');
            if (message) {
                message.value = `I'm interested in the ${link.dataset.product}. Please share more information.`;
                message.dispatchEvent(new Event('input', { bubbles: true }));
            }
        });
    });

    const requestedProduct = new URLSearchParams(window.location.search).get('product');
    if (requestedProduct) {
        const message = document.getElementById('message');
        if (message) {
            message.value = `I'm interested in ${requestedProduct}. Please share more information.`;
        }
    }

    const branchMap = document.getElementById('branch-map');
    const branchMapTitle = document.getElementById('branch-map-title');
    const branchMapOpen = document.getElementById('branch-map-open');
    document.querySelectorAll('.branch-map-select').forEach(button => {
        button.addEventListener('click', () => {
            const location = button.dataset.location;
            const label = button.dataset.label;
            const encodedLocation = encodeURIComponent(location);

            document.querySelectorAll('.branch-map-select').forEach(option => {
                const selected = option === button;
                option.classList.toggle('active', selected);
                option.setAttribute('aria-pressed', String(selected));
            });

            branchMapTitle.textContent = label;
            branchMap.title = `Map showing the ${label} area`;
            branchMap.src = `https://www.google.com/maps?q=${encodedLocation}&output=embed`;
            branchMapOpen.href = `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
        });
    });

    // 2. Preloader
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 500);
    });

    // 3. Theme Toggle (Dark/Light Mode)
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    } else if (systemDark) {
        htmlElement.setAttribute('data-theme', 'dark');
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // 4. Navbar Scroll Effect & Active Link Highlight
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        // Sticky Navbar
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active Nav Link
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // 5. Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const closeBtn = document.querySelector('.close-menu');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    const toggleMenu = () => {
        mobileMenu.classList.toggle('open');
    };

    mobileBtn.addEventListener('click', toggleMenu);
    closeBtn.addEventListener('click', toggleMenu);
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    // 6. Typewriter Effect
    const words = ['Grow', 'Invest', 'Thrive', 'Prosper'];
    let i = 0;
    let timer;
    const typewriterElement = document.getElementById('typewriter');

    function typingEffect() {
        let word = words[i].split("");
        var loopTyping = function() {
            if (word.length > 0) {
                typewriterElement.innerHTML += word.shift();
            } else {
                setTimeout(deletingEffect, 2000);
                return false;
            }
            timer = setTimeout(loopTyping, 100);
        };
        loopTyping();
    }

    function deletingEffect() {
        let word = words[i].split("");
        var loopDeleting = function() {
            if (word.length > 0) {
                word.pop();
                typewriterElement.innerHTML = word.join("");
            } else {
                if (words.length > (i + 1)) {
                    i++;
                } else {
                    i = 0;
                }
                typingEffect();
                return false;
            }
            timer = setTimeout(loopDeleting, 50);
        };
        loopDeleting();
    }
    
    // Start typewriter
    typewriterElement.innerHTML = "";
    typingEffect();

    // 7. Scroll Reveal Animations & Counters (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    const counters = document.querySelectorAll('.counter');
    let counted = false;

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Trigger counters if stat section is revealed
                if (entry.target.classList.contains('stat-card') && !counted) {
                    counters.forEach(counter => {
                        const target = +counter.getAttribute('data-target');
                        const duration = 2000;
                        const increment = target / (duration / 16); // 60fps
                        
                        let current = 0;
                        const updateCounter = () => {
                            current += increment;
                            if (current < target) {
                                counter.innerText = Math.ceil(current);
                                requestAnimationFrame(updateCounter);
                            } else {
                                counter.innerText = target;
                            }
                        };
                        updateCounter();
                    });
                    counted = true; // Prevents re-animating on every scroll
                }
                
                // Optional: unobserve after reveal
                // observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 8. Services Tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // Add active to clicked
            btn.classList.add('active');
            const target = btn.getAttribute('data-tab');
            document.getElementById(target).classList.add('active');
        });
    });

    // 9. FAQ Accordion
    const faqBtns = document.querySelectorAll('.faq-btn');
    
    faqBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const content = item.querySelector('.faq-content');
            
            // Close others
            faqBtns.forEach(otherBtn => {
                if (otherBtn !== btn) {
                    otherBtn.parentElement.classList.remove('active');
                    otherBtn.parentElement.querySelector('.faq-content').style.maxHeight = null;
                }
            });
            
            // Toggle current
            item.classList.toggle('active');
            if (item.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                content.style.maxHeight = null;
            }
        });
    });

    // 10. Scroll to Top Button
    const scrollTopBtn = document.getElementById('scroll-top');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
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

    // 11. Testimonials Infinite Scroll Clone
    const track = document.querySelector('.testimonial-track');
    if (track) {
        // Clone nodes for seamless infinite scroll
        const cards = track.querySelectorAll('.testimonial-card');
        cards.forEach(card => {
            const clone = card.cloneNode(true);
            track.appendChild(clone);
        });
    }
    
    // 12. Set Current Year in Footer
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Prepare an email draft for the contact enquiry; the visitor sends it in their email app.
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', event => {
            event.preventDefault();
            const formData = new FormData(contactForm);
            const subject = `WESCCU website enquiry from ${formData.get('name')}`;
            const body = [
                `Name: ${formData.get('name')}`,
                `Email: ${formData.get('email')}`,
                `Phone: ${formData.get('phone')}`,
                '',
                'Message:',
                formData.get('message')
            ].join('\n');
            const status = contactForm.querySelector('.contact-form-status');
            status.textContent = 'Your email app is opening with the enquiry. Review the details and press Send to deliver it.';
            window.location.href = `mailto:chambercreditunion@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        });
    }

    // Newsletter signup creates an email draft because the site has no mailing-list service configured.
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', event => {
            event.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            window.location.href = `mailto:chambercreditunion@gmail.com?subject=${encodeURIComponent('WESCCU newsletter subscription')}&body=${encodeURIComponent(`Please add ${email} to the WESCCU newsletter.`)}`;
        });
    }
});
