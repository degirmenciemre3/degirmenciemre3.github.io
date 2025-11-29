const canvas = document.getElementById('particles-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;

if (canvas && ctx) {
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
            this.y = Math.random() * canvas.height;
            this.fadeDelay = Math.random() * 600;
            this.fadeStart = Date.now() + this.fadeDelay;
            this.fadingIn = true;
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.z = Math.random() * 4;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = 0;
            this.targetOpacity = Math.random() * 0.5 + 0.3;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.fadingIn) {
                const now = Date.now();
                if (now > this.fadeStart) {
                    this.opacity += 0.01;
                    if (this.opacity >= this.targetOpacity) {
                        this.opacity = this.targetOpacity;
                        this.fadingIn = false;
                    }
                }
            }

            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity})`;
            ctx.fill();
        }
    }

    const particles = [];
    const isMobile = window.innerWidth <= 768;
    const particleCount = isMobile ? 30 : 80;

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    let mouse = {
        x: null,
        y: null,
        radius: 100
    };

    let mouseTimeout;
    canvas.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;

        clearTimeout(mouseTimeout);
        mouseTimeout = setTimeout(() => {
            mouse.x = null;
            mouse.y = null;
        }, 100);
    });

    canvas.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
        clearTimeout(mouseTimeout);
    });

    function connectParticles() {
        const maxDistance = 120;
        const maxConnections = 3;

        for (let i = 0; i < particles.length; i++) {
            let connections = 0;

            for (let j = i + 1; j < particles.length && connections < maxConnections; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;

                const distSq = dx * dx + dy * dy;
                if (distSq < maxDistance * maxDistance) {
                    const distance = Math.sqrt(distSq);

                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(99, 102, 241, ${0.15 * (1 - distance / maxDistance)})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();

                    connections++;
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();

            if (mouse.x != null && mouse.y != null) {
                const dx = particle.x - mouse.x;
                const dy = particle.y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    particle.x += Math.cos(angle) * force * 2;
                    particle.y += Math.sin(angle) * force * 2;
                }
            }

            particle.draw();
        });

        connectParticles();
        requestAnimationFrame(animate);
    }

    animate();
}

const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

const currentTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'light') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

const langToggle = document.getElementById('lang-toggle');
const langText = langToggle.querySelector('.lang-text');

const translations = {
    tr: {
        nav: {
            home: 'Anasayfa',
            about: 'Hakkımda',
            experience: 'Deneyim',
            achievements: 'Başarılarım',
            contact: 'İletişim'
        },
        hero: {
            greeting: 'Merhaba,',
            iam: 'Ben',
            name: 'Emre',
            title: 'Senior Software Developer @ Aras Kargo',
            subtitle: 'Full Stack Developer | Angular, .NET, Microservices',
            viewExperience: 'Deneyimlerim',
            contactMe: 'Bana Ulaş',
            scrollDown: 'Aşağı Kaydır'
        },
        about: {
            title: 'Hakkımda',
            text1: 'Merhaba! Ben Emre Değirmenci. Aras Kargo\'da Senior Software Developer olarak çalışıyorum. Düzce Üniversitesi Bilgisayar Mühendisliği mezunuyum (2019-2023, 3.15/4.00).',
            text2: 'Yaklaşık 2 yıllık profesyonel deneyimle, full-stack geliştirme ve modern yazılım teknolojilerinde uzmanlaşmış durumdayım. Angular, .NET, Kafka, MongoDB ve Microservice mimarisi ile uluslararası projeler geliştiriyorum.',
            skills: 'Yeteneklerim',
            stats: {
                experience: 'Yıl Tecrübe',
                companies: 'Şirket',
                hackathon: 'Hackathon',
                gpa: 'GPA'
            }
        },
        experience: {
            title: 'Deneyimlerim',
            jobs: [
                {
                    date: 'Aralık 2024 - Şu an',
                    position: 'Senior Software Developer',
                    company: 'Aras Kargo - İstanbul, Türkiye',
                    description: 'Yazılım Geliştirici Uzmanı olarak görev yapıyorum. Uluslararası projeler yönetimi.'
                },
                {
                    date: 'Temmuz 2023 - Aralık 2024',
                    position: 'Junior Software Developer',
                    company: 'Aras Kargo - İstanbul, Türkiye',
                    description: 'Macaristan, Slovakya ve Avusturya\'daki firmalarla ortak projeler yürüttüm. Mikroservis mimarisi, Kafka ve MongoDB kullanarak backend geliştirmeleri gerçekleştirdim. Angular ile dinamik ve modern frontend uygulamaları tasarladım.'
                },
                {
                    date: 'Ocak 2023 - Temmuz 2023',
                    position: 'Frontend Web Developer',
                    company: 'Easymizy - Bursa, Türkiye',
                    description: 'Modern web uygulamaları ve kullanıcı arayüzü geliştirme.'
                },
                {
                    date: 'Ağustos 2022 - Eylül 2022',
                    position: 'Full-stack Developer',
                    company: 'TURALI GROUP - Remote',
                    description: 'Uzaktan tam yığın web geliştirme projeleri.'
                }
            ]
        },
        achievements: {
            title: 'Başarılarım',
            competitions: 'Yarışmalar',
            certificates: 'Sertifikalar'
        },
        contact: {
            title: 'İletişime Geçin',
            text: 'Heyecan verici projeler hakkında konuşmaya ya da iş birliği yapmaya mı hazırsınız? Bana ulaşmaktan çekinmeyin!',
            linkedin: 'LinkedIn',
            linkedinText: 'Beni LinkedIn\'de takip edin',
            email: 'E-Posta',
            github: 'GitHub',
            githubText: 'Benim GitHub profilim',
            namePlaceholder: 'Adınız',
            emailPlaceholder: 'E-posta adresiniz',
            messagePlaceholder: 'Mesajınız',
            send: 'Mesaj Gönder',
            sent: 'Mesaj Gönderildi! ✓'
        },
        footer: {
            rights: 'Tüm hakları saklıdır.'
        }
    },
    en: {
        nav: {
            home: 'Home',
            about: 'About',
            experience: 'Experience',
            achievements: 'Achievements',
            contact: 'Contact'
        },
        hero: {
            greeting: 'Hello,',
            iam: 'I\'m',
            name: 'Emre',
            title: 'Senior Software Developer @ Aras Kargo',
            subtitle: 'Full Stack Developer | Angular, .NET, Microservices',
            viewExperience: 'My Experience',
            contactMe: 'Contact Me',
            scrollDown: 'Scroll Down'
        },
        about: {
            title: 'About Me',
            text1: 'Hello! I\'m Emre Değirmenci. I work as a Senior Software Developer at Aras Kargo. I graduated from Düzce University Computer Engineering (2019-2023, 3.15/4.00).',
            text2: 'With approximately 2 years of professional experience, I specialize in full-stack development and modern software technologies. I develop international projects with Angular, .NET, Kafka, MongoDB and Microservice architecture.',
            skills: 'My Skills',
            stats: {
                experience: 'Years Experience',
                companies: 'Companies',
                hackathon: 'Hackathons',
                gpa: 'GPA'
            }
        },
        experience: {
            title: 'My Experience',
            jobs: [
                {
                    date: 'December 2024 - Present',
                    position: 'Senior Software Developer',
                    company: 'Aras Kargo - Istanbul, Turkey',
                    description: 'Serving as a Software Development Specialist. Managing international projects.'
                },
                {
                    date: 'July 2023 - December 2024',
                    position: 'Junior Software Developer',
                    company: 'Aras Kargo - Istanbul, Turkey',
                    description: 'Led collaborative projects with companies in Hungary, Slovakia, and Austria. Developed backend solutions using microservice architecture, Kafka, and MongoDB. Designed dynamic and modern frontend applications with Angular.'
                },
                {
                    date: 'January 2023 - July 2023',
                    position: 'Frontend Web Developer',
                    company: 'Easymizy - Bursa, Turkey',
                    description: 'Modern web application and user interface development.'
                },
                {
                    date: 'August 2022 - September 2022',
                    position: 'Full-stack Developer',
                    company: 'TURALI GROUP - Remote',
                    description: 'Remote full-stack web development projects.'
                }
            ]
        },
        achievements: {
            title: 'My Achievements',
            competitions: 'Competitions',
            certificates: 'Certificates'
        },
        contact: {
            title: 'Get In Touch',
            text: 'Ready to talk about exciting projects or collaborate? Feel free to reach out!',
            linkedin: 'LinkedIn',
            linkedinText: 'Follow me on LinkedIn',
            email: 'Email',
            github: 'GitHub',
            githubText: 'My GitHub profile',
            namePlaceholder: 'Your Name',
            emailPlaceholder: 'Your Email',
            messagePlaceholder: 'Your Message',
            send: 'Send Message',
            sent: 'Message Sent! ✓'
        },
        footer: {
            rights: 'All rights reserved.'
        }
    }
};

let currentLang = localStorage.getItem('language') || 'tr';
langText.textContent = currentLang === 'tr' ? 'EN' : 'TR';

function translatePage(lang) {
    const t = translations[lang];

    document.querySelectorAll('.nav-link').forEach((link, index) => {
        const keys = ['home', 'about', 'experience', 'achievements', 'contact'];
        if (keys[index]) {
            link.textContent = t.nav[keys[index]];
        }
    });

    const heroWords = document.querySelectorAll('.hero-title .word');
    if (heroWords.length >= 3) {
        heroWords[0].textContent = t.hero.greeting;
        heroWords[1].textContent = t.hero.iam;
        heroWords[2].textContent = t.hero.name;
    }

    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroDescription = document.querySelector('.hero-description');
    if (heroSubtitle) heroSubtitle.textContent = t.hero.title;
    if (heroDescription) heroDescription.textContent = t.hero.subtitle;

    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    if (heroButtons.length >= 2) {
        heroButtons[0].textContent = t.hero.viewExperience;
        heroButtons[1].textContent = t.hero.contactMe;
    }

    const scrollText = document.querySelector('.scroll-indicator span');
    if (scrollText) scrollText.textContent = t.hero.scrollDown;

    const sectionTitles = document.querySelectorAll('.section-title');
    const titleKeys = ['about', 'experience', 'achievements', 'contact'];
    sectionTitles.forEach((title, index) => {
        if (titleKeys[index]) {
            title.textContent = t[titleKeys[index]].title;
        }
    });

    const aboutTexts = document.querySelectorAll('.about-text p');
    if (aboutTexts.length >= 2) {
        aboutTexts[0].textContent = t.about.text1;
        aboutTexts[1].textContent = t.about.text2;
    }

    const skillsTitle = document.querySelector('.skills h3');
    if (skillsTitle) skillsTitle.textContent = t.about.skills;

    const statLabels = document.querySelectorAll('.stat-label');
    const statKeys = ['experience', 'companies', 'hackathon', 'gpa'];
    statLabels.forEach((label, index) => {
        if (statKeys[index]) {
            label.textContent = t.about.stats[statKeys[index]];
        }
    });

    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        if (t.experience.jobs[index]) {
            const job = t.experience.jobs[index];
            const dateEl = item.querySelector('.timeline-date');
            const positionEl = item.querySelector('.timeline-content h3');
            const companyEl = item.querySelector('.timeline-content h4');
            const descEl = item.querySelector('.timeline-content p');

            if (dateEl) dateEl.textContent = job.date;
            if (positionEl) positionEl.textContent = job.position;
            if (companyEl) companyEl.textContent = job.company;
            if (descEl) descEl.textContent = job.description;
        }
    });

    const contactText = document.querySelector('.contact-text p');
    if (contactText) contactText.textContent = t.contact.text;

    const contactCards = document.querySelectorAll('.contact-card h3');
    if (contactCards.length >= 3) {
        contactCards[0].textContent = t.contact.linkedin;
        contactCards[1].textContent = t.contact.email;
        contactCards[2].textContent = t.contact.github;
    }

    const contactCardTexts = document.querySelectorAll('.contact-card p');
    if (contactCardTexts.length >= 3) {
        contactCardTexts[0].textContent = t.contact.linkedinText;
        contactCardTexts[2].textContent = t.contact.githubText;
    }

    const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
    if (formInputs.length >= 3) {
        formInputs[0].placeholder = t.contact.namePlaceholder;
        formInputs[1].placeholder = t.contact.emailPlaceholder;
        formInputs[2].placeholder = t.contact.messagePlaceholder;
    }

    const submitBtn = document.querySelector('.contact-form .btn');
    if (submitBtn && submitBtn.textContent !== t.contact.sent) {
        submitBtn.textContent = t.contact.send;
    }

    const achievementCategories = document.querySelectorAll('.achievement-category-title');
    if (achievementCategories.length >= 2) {
        achievementCategories[0].innerHTML = '<i class="fas fa-trophy"></i> ' + t.achievements.competitions;
        achievementCategories[1].innerHTML = '<i class="fas fa-certificate"></i> ' + t.achievements.certificates;
    }

    const footerText = document.querySelector('.footer-content p');
    if (footerText) {
        footerText.textContent = `© 2025 Emre Degirmenci. ${t.footer.rights}`;
    }
}

langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'tr' ? 'en' : 'tr';
    langText.textContent = currentLang === 'tr' ? 'EN' : 'TR';
    localStorage.setItem('language', currentLang);
    translatePage(currentLang);
});

if (currentLang === 'en') {
    translatePage('en');
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768 && navMenu) {
            navMenu.classList.remove('active');
        }
    });
});

const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(15, 23, 42, 0.98)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(15, 23, 42, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideInUp 0.6s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.skill-item').forEach((item, index) => {
    item.style.opacity = '0';
    item.style.animationDelay = `${index * 0.1}s`;
    observer.observe(item);
});

document.querySelectorAll('.project-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.animationDelay = `${index * 0.1}s`;
    observer.observe(card);
});

document.querySelectorAll('.achievement-item').forEach((item, index) => {
    item.style.opacity = '0';
    item.style.animationDelay = `${index * 0.1}s`;
    observer.observe(item);
});

document.querySelectorAll('.stat-item').forEach((item, index) => {
    item.style.opacity = '0';
    item.style.animationDelay = `${index * 0.1}s`;
    observer.observe(item);
});

function animateCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');

    statNumbers.forEach(element => {
        const target = parseInt(element.textContent);
        const increment = target / 50;
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.ceil(current) + '+';
                setTimeout(updateCounter, 50);
            } else {
                element.textContent = target + '+';
            }
        };

        const counterObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !element.dataset.animated) {
                    element.dataset.animated = 'true';
                    updateCounter();
                    counterObserver.unobserve(element);
                }
            });
        });

        counterObserver.observe(element);
    });
}

animateCounters();

const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);

        console.log('Form submitted:', Object.fromEntries(formData));

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Mesaj Gönderildi! ✓';
        submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';

        contactForm.reset();

        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.background = '';
        }, 3000);
    });
}

const heroContent = document.querySelector('.hero-content');
if (heroContent && window.innerWidth > 768) {
    let parallaxFrame;
    window.addEventListener('mousemove', (e) => {
        if (parallaxFrame) return;

        parallaxFrame = requestAnimationFrame(() => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;

            heroContent.style.transform = `perspective(1000px) rotateX(${y * 3 - 1.5}deg) rotateY(${x * 3 - 1.5}deg)`;
            parallaxFrame = null;
        });
    });

    document.addEventListener('mouseleave', () => {
        if (heroContent) {
            heroContent.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        }
    });
}

if ('IntersectionObserver' in window) {
    const images = document.querySelectorAll('img');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.src;
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

const sections = document.querySelectorAll('section');
sections.forEach((section, index) => {
    section.style.opacity = '0';
    section.style.animation = `slideInUp 0.6s ease-out ${index * 0.2}s forwards`;
});

let currentSection = 0;
const sectionIds = ['#home', '#about', '#experience', '#achievements', '#contact'];

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
        currentSection = Math.min(currentSection + 1, sectionIds.length - 1);
        document.querySelector(sectionIds[currentSection])?.scrollIntoView({ behavior: 'smooth' });
    } else if (e.key === 'ArrowUp') {
        currentSection = Math.max(currentSection - 1, 0);
        document.querySelector(sectionIds[currentSection])?.scrollIntoView({ behavior: 'smooth' });
    }
});

window.addEventListener('scroll', () => {
    let current = '';

    sectionIds.forEach(sectionId => {
        const section = document.querySelector(sectionId);
        if (section) {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 200) {
                current = sectionId;
            }
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === current) {
            link.classList.add('active');
            link.style.color = 'var(--primary-color)';
        } else {
            link.style.color = '#cbd5e1';
        }
    });
});

document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
    });

    btn.addEventListener('mouseleave', function() {
        this.style.transition = 'all 0.3s ease';
    });
});

function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.width = '10px';
    particle.style.height = '10px';
    particle.style.background = 'rgba(99, 102, 241, 0.5)';
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '999';
    particle.style.animation = 'particleFade 1s ease-out forwards';

    document.body.appendChild(particle);

    setTimeout(() => particle.remove(), 1000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes particleFade {
        0% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateY(-30px) scale(0);
        }
    }
`;
document.head.appendChild(style);

function handleResponsive() {
    const width = window.innerWidth;

    if (width <= 768) {
        document.querySelectorAll('.hero-image').forEach(el => {
            el.style.display = 'none';
        });
    }
}

window.addEventListener('resize', handleResponsive);
handleResponsive();

console.log('Portfolio site loaded successfully!');
