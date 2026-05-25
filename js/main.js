// ============================================
// Portfolio Main JavaScript
// ============================================

// Default Data
const defaultData = {
    profile: {
        name: "Dinesh Kumar",
        designation: "Full Stack Developer",
        bio: "Building innovative solutions with modern technologies. Passionate about creating impactful digital experiences.",
        email: "dineshredcap@gmail.com",
        phone: "+91 1234567890",
        location: "India",
        image: ""
    },
    projects: [],
    skills: [],
    experiences: [],
    social: {
        github: "",
        linkedin: "",
        twitter: "",
        instagram: "",
        whatsapp: "911234567890"
    },
    resume: null,
    messages: []
};

// Initialize siteData from localStorage
let siteData = JSON.parse(localStorage.getItem('portfolioData'));

if (!siteData || typeof siteData !== 'object') {
    siteData = JSON.parse(JSON.stringify(defaultData));
    localStorage.setItem('portfolioData', JSON.stringify(siteData));
}

if (!siteData.profile) siteData.profile = {};
if (!Array.isArray(siteData.projects)) siteData.projects = [];
if (!Array.isArray(siteData.skills)) siteData.skills = [];
if (!Array.isArray(siteData.experiences)) siteData.experiences = [];
if (!siteData.social) siteData.social = {};
if (!Array.isArray(siteData.messages)) siteData.messages = [];

function saveData() {
    localStorage.setItem('portfolioData', JSON.stringify(siteData));
}

// ============================================
// Helper Functions
// ============================================
function escapeHTML(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function setTextContent(id, text) {
    const element = document.getElementById(id);
    if (element) element.textContent = text || '';
}

function formatDate(dateString) {
    if (!dateString) return 'No date';
    try {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (e) {
        return dateString;
    }
}

// ============================================
// Initialize Application
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio initializing...');
    loadAllContent();
    initNavigation();
    initContactForm();
    initModalSystem();
    trackVisitor();
});

// ============================================
// Load All Content
// ============================================
function loadAllContent() {
    loadProfile();
    loadProjects();
    loadSkills();
    loadExperiences();
    loadSocialLinks();
    loadResumeButton();
    updateWhatsApp();
    updateFooter();
}

// ============================================
// Profile
// ============================================
function loadProfile() {
    const profile = siteData.profile || {};
    
    setTextContent('heroName', profile.name || 'Your Name');
    setTextContent('heroDesignation', profile.designation || 'Your Designation');
    setTextContent('heroBio', profile.bio || 'Your bio here');
    setTextContent('contactEmail', profile.email || 'email@example.com');
    setTextContent('contactLocation', profile.location || 'Location');
    setTextContent('contactPhone', profile.phone || 'Phone');
    
    if (profile.image) {
        const profileImg = document.getElementById('profileImageDisplay');
        const navLogo = document.getElementById('navLogo');
        if (profileImg) { profileImg.src = profile.image; profileImg.style.display = 'block'; }
        if (navLogo) { navLogo.src = profile.image; navLogo.style.display = 'block'; }
    }
}

// ============================================
// Projects
// ============================================
function loadProjects() {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;
    
    let projects = siteData.projects || [];
    
    if (projects.length === 0) {
        grid.innerHTML = '<div style="text-align:center;padding:60px 20px;color:var(--gray-400);grid-column:1/-1;"><i class="fas fa-folder-open" style="font-size:48px;margin-bottom:16px;display:block;"></i><p style="font-size:1.1rem;">No projects added yet</p></div>';
        return;
    }
    
    projects.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return (a.order || 0) - (b.order || 0);
    });
    
    grid.innerHTML = projects.map(p => `
        <div class="project-card ${p.pinned ? 'pinned' : ''}" onclick="openProjectModal('${p.id}')">
            <div class="project-image">${p.image ? `<img src="${p.image}" alt="${escapeHTML(p.title)}" loading="lazy">` : '<i class="fas fa-folder-open placeholder-icon"></i>'}</div>
            <div class="project-content">
                <h3 class="project-title">${escapeHTML(p.title)}</h3>
                <p class="project-description">${escapeHTML(p.description || '')}</p>
                <div><span class="project-date"><i class="fas fa-calendar-alt"></i> ${formatDate(p.date)}</span>${p.pinned ? '<span class="project-badge">📌 Pinned</span>' : ''}</div>
            </div>
        </div>`).join('');
}

function openProjectModal(projectId) {
    const project = siteData.projects.find(p => p.id === projectId);
    if (!project) return;
    
    const modal = document.getElementById('projectModal');
    const body = document.getElementById('projectModalBody');
    if (!modal || !body) return;
    
    body.innerHTML = `
        <div class="modal-project-image">${project.image ? `<img src="${project.image}" alt="${escapeHTML(project.title)}">` : '<i class="fas fa-folder-open" style="font-size:80px;color:var(--gray-300);"></i>'}</div>
        <div class="modal-project-info">
            <h2>${escapeHTML(project.title)}</h2>
            <p class="modal-project-date"><i class="fas fa-calendar-alt"></i> ${formatDate(project.date)}</p>
            <p class="modal-project-description">${escapeHTML(project.description)}</p>
            <div class="modal-project-links">
                ${project.docLink ? `<a href="${project.docLink}" target="_blank" class="btn btn-outline btn-sm"><i class="fas fa-file-alt"></i> Documentation</a>` : ''}
                ${project.github ? `<a href="${project.github}" target="_blank" class="btn btn-outline btn-sm"><i class="fab fa-github"></i> View Code</a>` : ''}
                ${project.video ? `<a href="${project.video}" target="_blank" class="btn btn-primary btn-sm"><i class="fas fa-play"></i> Watch Video</a>` : ''}
            </div>
        </div>`;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ============================================
// Skills
// ============================================
function loadSkills() {
    const grid = document.getElementById('skillsGrid');
    if (!grid) return;
    
    let skills = siteData.skills || [];
    
    if (skills.length === 0) {
        grid.innerHTML = '<div style="text-align:center;padding:60px 20px;color:var(--gray-400);grid-column:1/-1;"><i class="fas fa-code" style="font-size:48px;margin-bottom:16px;display:block;"></i><p style="font-size:1.1rem;">No skills added yet</p></div>';
        return;
    }
    
    skills.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return (a.order || 0) - (b.order || 0);
    });
    
    grid.innerHTML = skills.map(s => `
        <div class="skill-card ${s.pinned ? 'pinned' : ''}">
            <div class="skill-icon"><i class="fas fa-code"></i></div>
            <h3>${escapeHTML(s.title)}</h3>
            <p>${escapeHTML(s.description || '')}</p>
            <div>${(s.certLink || s.certFile) ? `<a href="${s.certLink || s.certFile}" target="_blank" class="skill-cert-badge"><i class="fas fa-certificate"></i> Certificate</a>` : ''}${s.pinned ? '<span style="display:inline-block;margin-left:8px;font-size:0.8rem;color:var(--primary);">📌 Pinned</span>' : ''}</div>
        </div>`).join('');
}

// ============================================
// Experiences
// ============================================
function loadExperiences() {
    const grid = document.getElementById('experienceGrid');
    if (!grid) return;
    
    let experiences = siteData.experiences || [];
    
    if (experiences.length === 0) {
        grid.innerHTML = '<div style="text-align:center;padding:60px 20px;color:var(--gray-400);grid-column:1/-1;"><i class="fas fa-star" style="font-size:48px;margin-bottom:16px;display:block;"></i><p style="font-size:1.1rem;">No experiences added yet</p></div>';
        return;
    }
    
    experiences.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return (a.order || 0) - (b.order || 0);
    });
    
    grid.innerHTML = experiences.map(exp => `
        <div class="experience-card ${exp.pinned ? 'pinned' : ''}" onclick="openExperienceModal('${exp.id}')">
            <div class="experience-images">${exp.images && exp.images.length > 0 ? `<img src="${exp.images[0]}" alt="${escapeHTML(exp.title)}" loading="lazy">${exp.images.length > 1 ? '<span class="image-count-badge"><i class="fas fa-images"></i> '+exp.images.length+'</span>' : ''}` : '<i class="fas fa-briefcase placeholder-icon"></i>'}</div>
            <div class="experience-content">
                <h3 class="experience-title">${escapeHTML(exp.title)}</h3>
                <p class="experience-company"><i class="fas fa-building"></i> ${escapeHTML(exp.company)}</p>
                <p class="experience-duration"><i class="fas fa-calendar-alt"></i> ${escapeHTML(exp.duration)}</p>
                <p class="experience-description">${escapeHTML(exp.description || '')}</p>
                <div>${(exp.certLink || exp.certFile) ? `<span class="experience-cert-badge" onclick="event.stopPropagation();window.open('${exp.certLink || exp.certFile}','_blank')"><i class="fas fa-certificate"></i> Certificate</span>` : ''}${exp.pinned ? '<span class="experience-badge">📌 Pinned</span>' : ''}</div>
            </div>
        </div>`).join('');
}

function openExperienceModal(experienceId) {
    const experience = siteData.experiences.find(e => e.id === experienceId);
    if (!experience) return;
    
    const modal = document.getElementById('experienceModal');
    const body = document.getElementById('experienceModalBody');
    if (!modal || !body) return;
    
    let galleryHTML = '';
    if (experience.images && experience.images.length > 0) {
        const imgs = experience.images.map((img, i) => `<img src="${img}" alt="Image ${i+1}" class="${i===0?'active':''}">`).join('');
        const dots = experience.images.length > 1 ? experience.images.map((_, i) => `<span class="image-dot ${i===0?'active':''}" onclick="event.stopPropagation();changeExperienceImage(${i})"></span>`).join('') : '';
        const nav = experience.images.length > 1 ? `<button class="image-nav prev" onclick="event.stopPropagation();navigateExperienceImage(-1)"><i class="fas fa-chevron-left"></i></button><button class="image-nav next" onclick="event.stopPropagation();navigateExperienceImage(1)"><i class="fas fa-chevron-right"></i></button><div class="image-dots">${dots}</div>` : '';
        galleryHTML = `<div class="experience-modal-images" id="expImageGallery">${imgs}${nav}</div>`;
    }
    
    body.innerHTML = `${galleryHTML}<div class="experience-modal-info"><h2>${escapeHTML(experience.title)}</h2><p class="experience-modal-company"><i class="fas fa-building"></i> ${escapeHTML(experience.company)}</p><p class="experience-modal-duration"><i class="fas fa-calendar-alt"></i> ${escapeHTML(experience.duration)}</p><p class="experience-modal-description">${escapeHTML(experience.description)}</p><div class="experience-modal-links">${experience.certLink ? `<a href="${experience.certLink}" target="_blank" class="btn btn-outline btn-sm"><i class="fas fa-certificate"></i> View Certificate</a>` : ''}${experience.certFile ? `<a href="${experience.certFile}" target="_blank" class="btn btn-outline btn-sm"><i class="fas fa-download"></i> Download Certificate</a>` : ''}</div></div>`;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function navigateExperienceImage(direction) {
    const gallery = document.getElementById('expImageGallery');
    if (!gallery) return;
    const images = gallery.querySelectorAll('img');
    const dots = gallery.querySelectorAll('.image-dot');
    let idx = Array.from(images).findIndex(img => img.classList.contains('active'));
    if (idx === -1) idx = 0;
    images[idx].classList.remove('active');
    if (dots[idx]) dots[idx].classList.remove('active');
    idx = (idx + direction + images.length) % images.length;
    images[idx].classList.add('active');
    if (dots[idx]) dots[idx].classList.add('active');
}

function changeExperienceImage(index) {
    const gallery = document.getElementById('expImageGallery');
    if (!gallery) return;
    const images = gallery.querySelectorAll('img');
    const dots = gallery.querySelectorAll('.image-dot');
    images.forEach(img => img.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    if (images[index]) images[index].classList.add('active');
    if (dots[index]) dots[index].classList.add('active');
}

// ============================================
// Modal System
// ============================================
function initModalSystem() {
    ['projectModal', 'experienceModal'].forEach(id => {
        const modal = document.getElementById(id);
        if (!modal) return;
        const closeBtn = modal.querySelector('.modal-close');
        const overlay = modal.querySelector('.modal-overlay');
        if (closeBtn) closeBtn.addEventListener('click', () => { modal.classList.remove('active'); document.body.style.overflow = ''; });
        if (overlay) overlay.addEventListener('click', () => { modal.classList.remove('active'); document.body.style.overflow = ''; });
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(m => { m.classList.remove('active'); });
            document.body.style.overflow = '';
        }
    });
}

// ============================================
// Social Links & Contact
// ============================================
function loadSocialLinks() {
    const container = document.getElementById('socialLinks');
    if (!container) return;
    const social = siteData.social || {};
    const links = [];
    if (social.github) links.push(`<a href="${social.github}" target="_blank" class="social-link" title="GitHub"><i class="fab fa-github"></i></a>`);
    if (social.linkedin) links.push(`<a href="${social.linkedin}" target="_blank" class="social-link" title="LinkedIn"><i class="fab fa-linkedin"></i></a>`);
    if (social.twitter) links.push(`<a href="${social.twitter}" target="_blank" class="social-link" title="Twitter"><i class="fab fa-twitter"></i></a>`);
    if (social.instagram) links.push(`<a href="${social.instagram}" target="_blank" class="social-link" title="Instagram"><i class="fab fa-instagram"></i></a>`);
    container.innerHTML = links.length > 0 ? links.join('') : '<p style="color:var(--gray-400);font-size:0.9rem;">No social links</p>';
}

function updateWhatsApp() {
    const link = document.getElementById('whatsappLink');
    if (!link) return;
    link.href = `https://wa.me/${(siteData.social?.whatsapp || '911234567890').replace(/[^0-9]/g, '')}`;
}

function loadResumeButton() {
    const btn = document.getElementById('downloadResume');
    if (!btn) return;
    if (siteData.resume) { btn.style.display = 'inline-flex'; btn.href = siteData.resume; }
    else { btn.style.display = 'none'; }
}

function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const orig = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        btn.disabled = true;
        
        siteData.messages.push({
            id: Date.now().toString(),
            name: document.getElementById('name')?.value || '',
            email: document.getElementById('email')?.value || '',
            subject: document.getElementById('subject')?.value || '',
            message: document.getElementById('message')?.value || '',
            timestamp: new Date().toISOString(),
            read: false
        });
        saveData();
        
        setTimeout(() => {
            alert('✅ Message sent successfully!');
            form.reset();
            btn.innerHTML = orig;
            btn.disabled = false;
        }, 1500);
    });
}

// ============================================
// Navigation - FIXED
// ============================================
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Close menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu) navMenu.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
        });
    });
    
    // Active section on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', function() {
        let current = '';
        const scrollY = window.scrollY + 100;
        
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            if (scrollY >= top && scrollY < top + height) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
        
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }
    });
    
    // Smooth scroll for internal links only
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                history.pushState(null, null, '#' + targetId);
            }
        });
    });
}

// ============================================
// Utilities
// ============================================
function trackVisitor() {
    let v = parseInt(localStorage.getItem('visitorCount') || '0');
    localStorage.setItem('visitorCount', (v + 1).toString());
}

function updateFooter() {
    const el = document.getElementById('footerText');
    if (el) el.innerHTML = `&copy; ${new Date().getFullYear()} ${siteData.profile?.name || 'Portfolio'}. All rights reserved.`;
}
