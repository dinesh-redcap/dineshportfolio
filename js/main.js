// ============================================
// Portfolio Main JavaScript - FIXED
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

// Initialize data from localStorage or use default
let siteData = JSON.parse(localStorage.getItem('portfolioData'));

// If no data or data is empty, use default
if (!siteData || !siteData.profile || Object.keys(siteData.profile).length === 0) {
    siteData = defaultData;
    localStorage.setItem('portfolioData', JSON.stringify(siteData));
}

// Ensure all properties exist
if (!siteData.projects) siteData.projects = [];
if (!siteData.skills) siteData.skills = [];
if (!siteData.social) siteData.social = {};
if (!siteData.messages) siteData.messages = [];

function saveData() {
    localStorage.setItem('portfolioData', JSON.stringify(siteData));
}

// ============================================
// Initialize Application
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing portfolio...');
    console.log('Current data:', siteData);
    console.log('Skills count:', siteData.skills?.length || 0);
    console.log('Projects count:', siteData.projects?.length || 0);
    
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
    
    // Set hero content
    setTextContent('heroName', profile.name || 'Your Name');
    setTextContent('heroDesignation', profile.designation || 'Your Designation');
    setTextContent('heroBio', profile.bio || 'Your bio here');
    setTextContent('contactEmail', profile.email || 'email@example.com');
    setTextContent('contactLocation', profile.location || 'Location');
    setTextContent('contactPhone', profile.phone || 'Phone');
    
    // Load single image for both logo and profile
    if (profile.image) {
        const profileImg = document.getElementById('profileImageDisplay');
        const navLogo = document.getElementById('navLogo');
        
        if (profileImg) {
            profileImg.src = profile.image;
            profileImg.style.display = 'block';
        }
        if (navLogo) {
            navLogo.src = profile.image;
            navLogo.style.display = 'block';
        }
    }
}

function setTextContent(id, text) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = text;
    }
}

// ============================================
// Projects
// ============================================
function loadProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    if (!projectsGrid) {
        console.error('Projects grid not found!');
        return;
    }
    
    let projects = siteData.projects || [];
    
    if (projects.length === 0) {
        projectsGrid.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: var(--gray-400); grid-column: 1/-1;">
                <i class="fas fa-folder-open" style="font-size: 48px; margin-bottom: 16px; display: block;"></i>
                <p style="font-size: 1.1rem;">No projects added yet</p>
                <p style="font-size: 0.9rem; margin-top: 8px;">Add projects from the admin panel</p>
            </div>`;
        return;
    }
    
    // Sort: pinned first, then by order
    projects.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return (a.order || 0) - (b.order || 0);
    });
    
    projectsGrid.innerHTML = projects.map(project => `
        <div class="project-card ${project.pinned ? 'pinned' : ''}" onclick="openProjectModal('${project.id}')">
            <div class="project-image">
                ${project.image ? 
                    `<img src="${project.image}" alt="${escapeHTML(project.title)}" loading="lazy">` :
                    `<i class="fas fa-folder-open placeholder-icon"></i>`
                }
            </div>
            <div class="project-content">
                <h3 class="project-title">${escapeHTML(project.title)}</h3>
                <p class="project-description">${escapeHTML(project.description || '')}</p>
                <div>
                    <span class="project-date">
                        <i class="fas fa-calendar-alt"></i> ${formatDate(project.date)}
                    </span>
                    ${project.pinned ? '<span class="project-badge">📌 Pinned</span>' : ''}
                </div>
            </div>
        </div>
    `).join('');
}

function escapeHTML(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
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
// Project Modal
// ============================================
function openProjectModal(projectId) {
    const project = siteData.projects.find(p => p.id === projectId);
    if (!project) return;
    
    const modal = document.getElementById('projectModal');
    const modalBody = document.getElementById('projectModalBody');
    
    if (!modal || !modalBody) return;
    
    modalBody.innerHTML = `
        <div class="modal-project-image">
            ${project.image ? 
                `<img src="${project.image}" alt="${escapeHTML(project.title)}">` :
                `<i class="fas fa-folder-open" style="font-size: 80px; color: var(--gray-300);"></i>`
            }
        </div>
        <div class="modal-project-info">
            <h2>${escapeHTML(project.title)}</h2>
            <p class="modal-project-date">
                <i class="fas fa-calendar-alt"></i> ${formatDate(project.date)}
            </p>
            <p class="modal-project-description">${escapeHTML(project.description)}</p>
            <div class="modal-project-links">
                ${project.docLink ? `
                    <a href="${project.docLink}" target="_blank" class="btn btn-outline btn-sm">
                        <i class="fas fa-file-alt"></i> View Documentation
                    </a>` : ''
                }
                ${project.docFile ? `
                    <a href="${project.docFile}" target="_blank" class="btn btn-outline btn-sm">
                        <i class="fas fa-download"></i> Download Doc
                    </a>` : ''
                }
                ${project.github ? `
                    <a href="${project.github}" target="_blank" class="btn btn-outline btn-sm">
                        <i class="fab fa-github"></i> View Code
                    </a>` : ''
                }
                ${project.video ? `
                    <a href="${project.video}" target="_blank" class="btn btn-primary btn-sm">
                        <i class="fas fa-play"></i> Watch Video
                    </a>` : ''
                }
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function initModalSystem() {
    const modal = document.getElementById('projectModal');
    if (!modal) return;
    
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    if (overlay) {
        overlay.addEventListener('click', closeModal);
    }
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

function closeModal() {
    const modal = document.getElementById('projectModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ============================================
// Skills - FIXED
// ============================================
function loadSkills() {
    const skillsGrid = document.getElementById('skillsGrid');
    if (!skillsGrid) {
        console.error('Skills grid element not found!');
        return;
    }
    
    let skills = siteData.skills || [];
    
    console.log('Loading skills:', skills);
    
    if (skills.length === 0) {
        skillsGrid.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: var(--gray-400); grid-column: 1/-1;">
                <i class="fas fa-code" style="font-size: 48px; margin-bottom: 16px; display: block;"></i>
                <p style="font-size: 1.1rem;">No skills added yet</p>
                <p style="font-size: 0.9rem; margin-top: 8px;">Add skills from the admin panel</p>
            </div>`;
        return;
    }
    
    // Sort: pinned first
    skills.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return (a.order || 0) - (b.order || 0);
    });
    
    skillsGrid.innerHTML = skills.map(skill => `
        <div class="skill-card ${skill.pinned ? 'pinned' : ''}">
            <div class="skill-icon">
                <i class="fas fa-code"></i>
            </div>
            <h3>${escapeHTML(skill.title)}</h3>
            <p>${escapeHTML(skill.description || '')}</p>
            <div>
                ${(skill.certLink || skill.certFile) ? `
                    <a href="${skill.certLink || skill.certFile}" target="_blank" class="skill-cert-badge">
                        <i class="fas fa-certificate"></i> View Certificate
                    </a>` : ''
                }
                ${skill.pinned ? '<span style="display: inline-block; margin-left: 8px; font-size: 0.8rem; color: var(--primary);">📌 Pinned</span>' : ''}
            </div>
        </div>
    `).join('');
    
    console.log('Skills loaded successfully. Count:', skills.length);
}

// ============================================
// Social Links
// ============================================
function loadSocialLinks() {
    const socialLinks = document.getElementById('socialLinks');
    if (!socialLinks) return;
    
    const social = siteData.social || {};
    
    const links = [];
    if (social.github) {
        links.push(createSocialLink(social.github, 'github', 'GitHub'));
    }
    if (social.linkedin) {
        links.push(createSocialLink(social.linkedin, 'linkedin', 'LinkedIn'));
    }
    if (social.twitter) {
        links.push(createSocialLink(social.twitter, 'twitter', 'Twitter'));
    }
    if (social.instagram) {
        links.push(createSocialLink(social.instagram, 'instagram', 'Instagram'));
    }
    
    socialLinks.innerHTML = links.length > 0 ? links.join('') : 
        '<p style="color: var(--gray-400); font-size: 0.9rem;">No social links added</p>';
}

function createSocialLink(url, icon, title) {
    return `<a href="${url}" target="_blank" class="social-link" title="${title}" rel="noopener noreferrer">
        <i class="fab fa-${icon}"></i>
    </a>`;
}

// ============================================
// WhatsApp
// ============================================
function updateWhatsApp() {
    const whatsappLink = document.getElementById('whatsappLink');
    if (!whatsappLink) return;
    
    const phone = (siteData.social?.whatsapp || '911234567890').replace(/[^0-9]/g, '');
    whatsappLink.href = `https://wa.me/${phone}`;
}

// ============================================
// Resume
// ============================================
function loadResumeButton() {
    const resumeBtn = document.getElementById('downloadResume');
    if (!resumeBtn) return;
    
    if (siteData.resume) {
        resumeBtn.style.display = 'inline-flex';
        resumeBtn.href = siteData.resume;
        resumeBtn.download = 'Resume.pdf';
    } else {
        resumeBtn.style.display = 'none';
    }
}

// ============================================
// Contact Form
// ============================================
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) {
        console.error('Contact form not found!');
        return;
    }
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        if (!submitBtn) return;
        
        const originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        const messageData = {
            id: Date.now().toString(),
            name: document.getElementById('name')?.value || '',
            email: document.getElementById('email')?.value || '',
            subject: document.getElementById('subject')?.value || '',
            message: document.getElementById('message')?.value || '',
            timestamp: new Date().toISOString(),
            read: false
        };
        
        // Store message
        if (!siteData.messages) siteData.messages = [];
        siteData.messages.push(messageData);
        saveData();
        
        // Simulate sending
        setTimeout(function() {
            alert('✅ Message sent successfully! I will get back to you soon.');
            form.reset();
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled = false;
        }, 1500);
    });
}

// ============================================
// Navigation
// ============================================
function initNavigation() {
    // Mobile menu
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
        const scrollY = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
        
        // Navbar shadow on scroll
        if (navbar) {
            if (scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });
    
    // Logo click for admin
    const logo = document.getElementById('logoTrigger');
    if (logo) {
        logo.addEventListener('click', function() {
            window.location.href = 'admin.html';
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }
        });
    });
}

// ============================================
// Visitor Tracking
// ============================================
function trackVisitor() {
    let visitors = parseInt(localStorage.getItem('visitorCount') || '0');
    visitors++;
    localStorage.setItem('visitorCount', visitors.toString());
}

// ============================================
// Footer
// ============================================
function updateFooter() {
    const footerText = document.getElementById('footerText');
    if (!footerText) return;
    
    const year = new Date().getFullYear();
    const name = siteData.profile?.name || 'Portfolio';
    footerText.innerHTML = `&copy; ${year} ${name}. All rights reserved.`;
}

// Debug function - call from console if needed
window.debugData = function() {
    console.log('=== Portfolio Data Debug ===');
    console.log('localStorage data:', localStorage.getItem('portfolioData'));
    console.log('Parsed siteData:', siteData);
    console.log('Profile:', siteData.profile);
    console.log('Projects:', siteData.projects);
    console.log('Skills:', siteData.skills);
    console.log('Social:', siteData.social);
    console.log('Messages:', siteData.messages);
    console.log('===========================');
};
