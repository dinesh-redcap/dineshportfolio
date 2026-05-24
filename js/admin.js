// ============================================
// Admin Panel JavaScript - FIXED
// ============================================

// Admin Credentials
const ADMIN_CREDENTIALS = {
    username: 'dineshredcap@gmail.com',
    password: 'DINESH@ECE'
};

// Check Authentication
let isAuthenticated = sessionStorage.getItem('adminAuth') === 'true';

if (!isAuthenticated) {
    showLoginPage();
} else {
    initializeAdmin();
}

// ============================================
// Login System
// ============================================
function showLoginPage() {
    document.body.innerHTML = `
        <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #eff6ff 0%, #ffffff 100%); padding: 20px;">
            <div style="background: white; border-radius: 16px; padding: 40px; max-width: 420px; width: 100%; box-shadow: 0 20px 60px rgba(0,0,0,0.1); border: 1px solid #e2e8f0;">
                <div style="text-align: center; margin-bottom: 32px;">
                    <div style="width: 64px; height: 64px; background: linear-gradient(135deg, #1e40af, #3b82f6); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
                        <i class="fas fa-lock" style="font-size: 28px; color: white;"></i>
                    </div>
                    <h2 style="font-size: 1.5rem; color: #1e293b; margin-bottom: 4px; font-weight: 700;">Admin Login</h2>
                    <p style="color: #64748b; font-size: 0.9rem;">Sign in to manage your portfolio</p>
                </div>
                <form id="loginForm">
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 6px; font-weight: 600; color: #334155; font-size: 0.9rem;">Email Address</label>
                        <input type="email" id="loginEmail" required placeholder="Enter your email" 
                               style="width: 100%; padding: 12px 16px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; font-family: 'Inter', sans-serif; background: #f8fafc;">
                    </div>
                    <div style="margin-bottom: 24px; position: relative;">
                        <label style="display: block; margin-bottom: 6px; font-weight: 600; color: #334155; font-size: 0.9rem;">Password</label>
                        <input type="password" id="loginPassword" required placeholder="Enter your password" 
                               style="width: 100%; padding: 12px 16px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; font-family: 'Inter', sans-serif; background: #f8fafc;">
                        <i class="fas fa-eye" onclick="togglePassword()" 
                           style="position: absolute; right: 14px; top: 40px; cursor: pointer; color: #94a3b8; font-size: 16px;"></i>
                    </div>
                    <button type="submit" 
                            style="width: 100%; padding: 14px; background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; box-shadow: 0 4px 12px rgba(30,64,175,0.3);">
                        <i class="fas fa-sign-in-alt"></i> Login
                    </button>
                    <button type="button" onclick="showForgotPassword()" 
                            style="width: 100%; padding: 12px; background: none; border: none; color: #3b82f6; cursor: pointer; font-size: 14px; font-weight: 500; margin-top: 12px; font-family: 'Inter', sans-serif;">
                        Forgot Password?
                    </button>
                </form>
            </div>
        </div>
    `;
    
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (email === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        sessionStorage.setItem('adminAuth', 'true');
        alert('✅ Login successful!');
        location.reload();
    } else {
        alert('❌ Invalid credentials! Please try again.');
    }
}

function togglePassword() {
    const input = document.getElementById('loginPassword');
    if (input) {
        input.type = input.type === 'password' ? 'text' : 'password';
    }
}

function showForgotPassword() {
    const email = prompt('Enter your registered email address:');
    if (email) {
        const otp = Math.floor(100000 + Math.random() * 900000);
        alert('OTP: ' + otp + '\n\n(In production, this OTP would be sent to ' + email + ')');
        
        const userOTP = prompt('Enter the OTP:');
        if (userOTP === otp.toString()) {
            const newPassword = prompt('Enter new password:');
            if (newPassword) {
                ADMIN_CREDENTIALS.password = newPassword;
                alert('✅ Password reset successful! Please login.');
            }
        } else {
            alert('❌ Invalid OTP!');
        }
    }
}

function logout() {
    sessionStorage.removeItem('adminAuth');
    window.location.href = 'index.html';
}

// ============================================
// Initialize Admin
// ============================================
function initializeAdmin() {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Admin panel initializing...');
        initAdminNavigation();
        loadDashboardStats();
        loadProfileData();
        loadAdminProjects();
        loadAdminSkills();
        loadMessages();
        loadResumeInfo();
        initEventListeners();
        initSidebarToggle();
    });
}

// ============================================
// Data Management
// ============================================
let siteData = JSON.parse(localStorage.getItem('portfolioData')) || {
    profile: {},
    projects: [],
    skills: [],
    social: {},
    messages: [],
    resume: null
};

// Ensure all arrays exist
if (!siteData.projects) siteData.projects = [];
if (!siteData.skills) siteData.skills = [];
if (!siteData.social) siteData.social = {};
if (!siteData.messages) siteData.messages = [];

function saveData() {
    localStorage.setItem('portfolioData', JSON.stringify(siteData));
    alert('✅ Changes saved successfully!');
    console.log('Data saved:', siteData);
    
    // Reload relevant sections
    loadDashboardStats();
}

// ============================================
// Admin Navigation
// ============================================
function initAdminNavigation() {
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            const targetId = this.dataset.section;
            document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
            
            const target = document.getElementById(targetId);
            if (target) {
                target.classList.add('active');
            }
            
            // Close mobile sidebar
            const sidebar = document.getElementById('adminSidebar');
            if (sidebar) sidebar.classList.remove('mobile-open');
        });
    });
}

function initSidebarToggle() {
    const toggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('adminSidebar');
    
    if (toggle && sidebar) {
        toggle.addEventListener('click', function() {
            sidebar.classList.toggle('mobile-open');
        });
    }
}

// ============================================
// Dashboard Stats
// ============================================
function loadDashboardStats() {
    const visitorEl = document.getElementById('visitorCount');
    const messageEl = document.getElementById('messageCount');
    const projectEl = document.getElementById('projectCount');
    const skillEl = document.getElementById('skillCount');
    
    if (visitorEl) visitorEl.textContent = localStorage.getItem('visitorCount') || '0';
    if (messageEl) messageEl.textContent = (siteData.messages?.length) || 0;
    if (projectEl) projectEl.textContent = (siteData.projects?.length) || 0;
    if (skillEl) skillEl.textContent = (siteData.skills?.length) || 0;
}

// ============================================
// Profile Management
// ============================================
function loadProfileData() {
    const profile = siteData.profile || {};
    const social = siteData.social || {};
    
    setInputValue('editName', profile.name);
    setInputValue('editDesignation', profile.designation);
    setInputValue('editBio', profile.bio);
    setInputValue('editEmail', profile.email);
    setInputValue('editPhone', profile.phone);
    setInputValue('editLocation', profile.location);
    
    setInputValue('editGithub', social.github);
    setInputValue('editLinkedin', social.linkedin);
    setInputValue('editTwitter', social.twitter);
    setInputValue('editInstagram', social.instagram);
    setInputValue('editWhatsapp', social.whatsapp);
    
    if (profile.image) {
        const preview = document.getElementById('imagePreview');
        if (preview) preview.src = profile.image;
    }
}

function setInputValue(id, value) {
    const element = document.getElementById(id);
    if (element && value !== undefined) {
        element.value = value;
    }
}

function initEventListeners() {
    const profileForm = document.getElementById('profileForm');
    const singleImage = document.getElementById('singleImage');
    const projectForm = document.getElementById('projectForm');
    const skillForm = document.getElementById('skillForm');
    const resumeForm = document.getElementById('resumeForm');
    
    if (profileForm) profileForm.addEventListener('submit', saveProfile);
    if (singleImage) singleImage.addEventListener('change', handleImageUpload);
    if (projectForm) projectForm.addEventListener('submit', saveProject);
    if (skillForm) skillForm.addEventListener('submit', saveSkill);
    if (resumeForm) resumeForm.addEventListener('submit', saveResume);
}

function saveProfile(e) {
    e.preventDefault();
    
    if (!siteData.profile) siteData.profile = {};
    if (!siteData.social) siteData.social = {};
    
    siteData.profile.name = document.getElementById('editName')?.value || '';
    siteData.profile.designation = document.getElementById('editDesignation')?.value || '';
    siteData.profile.bio = document.getElementById('editBio')?.value || '';
    siteData.profile.email = document.getElementById('editEmail')?.value || '';
    siteData.profile.phone = document.getElementById('editPhone')?.value || '';
    siteData.profile.location = document.getElementById('editLocation')?.value || '';
    
    siteData.social.github = document.getElementById('editGithub')?.value || '';
    siteData.social.linkedin = document.getElementById('editLinkedin')?.value || '';
    siteData.social.twitter = document.getElementById('editTwitter')?.value || '';
    siteData.social.instagram = document.getElementById('editInstagram')?.value || '';
    siteData.social.whatsapp = document.getElementById('editWhatsapp')?.value || '';
    
    saveData();
}

function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            if (!siteData.profile) siteData.profile = {};
            siteData.profile.image = event.target.result;
            
            const preview = document.getElementById('imagePreview');
            if (preview) preview.src = event.target.result;
            
            saveData();
        };
        reader.readAsDataURL(file);
    }
}

// ============================================
// Projects Management
// ============================================
function loadAdminProjects() {
    const container = document.getElementById('adminProjectsList');
    if (!container) {
        console.error('Admin projects list container not found!');
        return;
    }
    
    let projects = siteData.projects || [];
    
    if (projects.length === 0) {
        container.innerHTML = '<p style="color: #64748b; padding: 20px; text-align: center;">No projects added yet. Click "Add Project" to create one.</p>';
        return;
    }
    
    // Sort: pinned first, then by order
    projects.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return (a.order || 0) - (b.order || 0);
    });
    
    container.innerHTML = projects.map((project, index) => `
        <div class="admin-project-item ${project.pinned ? 'pinned' : ''}">
            <div class="item-info">
                <h4>${project.pinned ? '📌 ' : ''}${escapeHTML(project.title)}</h4>
                <p>${escapeHTML((project.description || '').substring(0, 60))}... | ${project.date || 'No date'}</p>
            </div>
            <div class="item-actions">
                <button class="btn btn-sm btn-outline" onclick="moveProject('${project.id}', 'up')" ${index === 0 ? 'disabled' : ''} title="Move Up">
                    <i class="fas fa-arrow-up"></i>
                </button>
                <button class="btn btn-sm btn-outline" onclick="moveProject('${project.id}', 'down')" ${index === projects.length - 1 ? 'disabled' : ''} title="Move Down">
                    <i class="fas fa-arrow-down"></i>
                </button>
                <button class="btn btn-sm btn-outline" onclick="togglePinProject('${project.id}')" title="${project.pinned ? 'Unpin' : 'Pin'}">
                    <i class="fas fa-thumbtack" style="color: ${project.pinned ? 'var(--primary)' : 'inherit'}"></i>
                </button>
                <button class="btn btn-sm btn-outline" onclick="editProject('${project.id}')" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm" style="background: #ef4444; color: white;" onclick="deleteProject('${project.id}')" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
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

function showAddProjectForm() {
    const container = document.getElementById('projectFormContainer');
    const title = document.getElementById('projectFormTitle');
    const form = document.getElementById('projectForm');
    
    if (container) container.style.display = 'block';
    if (title) title.textContent = 'Add New Project';
    if (form) form.reset();
    setInputValue('projectId', '');
}

function hideProjectForm() {
    const container = document.getElementById('projectFormContainer');
    if (container) container.style.display = 'none';
}

function saveProject(e) {
    e.preventDefault();
    
    const projectId = document.getElementById('projectId')?.value;
    const imageFile = document.getElementById('projectImage')?.files[0];
    const docFile = document.getElementById('projectDoc')?.files[0];
    
    const processProject = function(imageData, docData) {
        const projectData = {
            id: projectId || Date.now().toString(),
            title: document.getElementById('projectTitle')?.value || '',
            description: document.getElementById('projectDesc')?.value || '',
            date: document.getElementById('projectDate')?.value || '',
            image: imageData || '',
            docFile: docData || '',
            docLink: document.getElementById('projectDocLink')?.value || '',
            github: document.getElementById('projectGithub')?.value || '',
            video: document.getElementById('projectVideo')?.value || '',
            pinned: projectId ? (siteData.projects.find(p => p.id === projectId)?.pinned || false) : false,
            order: projectId ? (siteData.projects.find(p => p.id === projectId)?.order) : siteData.projects.length
        };
        
        if (!siteData.projects) siteData.projects = [];
        
        if (projectId) {
            const index = siteData.projects.findIndex(p => p.id === projectId);
            if (index !== -1) {
                // Preserve image if no new image uploaded
                if (!imageData && siteData.projects[index].image) {
                    projectData.image = siteData.projects[index].image;
                }
                if (!docData && siteData.projects[index].docFile) {
                    projectData.docFile = siteData.projects[index].docFile;
                }
                siteData.projects[index] = projectData;
            }
        } else {
            siteData.projects.push(projectData);
        }
        
        saveData();
        loadAdminProjects();
        hideProjectForm();
    };
    
    // Handle file uploads
    if (imageFile || docFile) {
        let imageData = null;
        let docData = null;
        let filesProcessed = 0;
        const totalFiles = (imageFile ? 1 : 0) + (docFile ? 1 : 0);
        
        const checkComplete = function() {
            filesProcessed++;
            if (filesProcessed >= totalFiles) {
                processProject(imageData, docData);
            }
        };
        
        if (imageFile) {
            const reader = new FileReader();
            reader.onload = function(e) { imageData = e.target.result; checkComplete(); };
            reader.readAsDataURL(imageFile);
        } else {
            checkComplete();
        }
        
        if (docFile) {
            const reader = new FileReader();
            reader.onload = function(e) { docData = e.target.result; checkComplete(); };
            reader.readAsDataURL(docFile);
        } else if (!imageFile) {
            processProject(null, null);
        }
    } else {
        processProject(null, null);
    }
}

function editProject(projectId) {
    const project = siteData.projects.find(p => p.id === projectId);
    if (!project) return;
    
    const container = document.getElementById('projectFormContainer');
    const title = document.getElementById('projectFormTitle');
    
    if (container) container.style.display = 'block';
    if (title) title.textContent = 'Edit Project';
    
    setInputValue('projectId', project.id);
    setInputValue('projectTitle', project.title);
    setInputValue('projectDesc', project.description);
    setInputValue('projectDate', project.date);
    setInputValue('projectDocLink', project.docLink || '');
    setInputValue('projectGithub', project.github || '');
    setInputValue('projectVideo', project.video || '');
}

function deleteProject(projectId) {
    if (confirm('Are you sure you want to delete this project?')) {
        siteData.projects = siteData.projects.filter(p => p.id !== projectId);
        saveData();
        loadAdminProjects();
    }
}

function moveProject(projectId, direction) {
    let projects = [...siteData.projects];
    projects.sort((a, b) => (a.order || 0) - (b.order || 0));
    
    const index = projects.findIndex(p => p.id === projectId);
    if (index === -1) return;
    
    if (direction === 'up' && index > 0) {
        [projects[index], projects[index - 1]] = [projects[index - 1], projects[index]];
    } else if (direction === 'down' && index < projects.length - 1) {
        [projects[index], projects[index + 1]] = [projects[index + 1], projects[index]];
    }
    
    projects.forEach((p, i) => p.order = i);
    siteData.projects = projects;
    saveData();
    loadAdminProjects();
}

function togglePinProject(projectId) {
    const project = siteData.projects.find(p => p.id === projectId);
    if (project) {
        project.pinned = !project.pinned;
        saveData();
        loadAdminProjects();
    }
}

// ============================================
// Skills Management
// ============================================
function loadAdminSkills() {
    const container = document.getElementById('adminSkillsList');
    if (!container) {
        console.error('Admin skills list container not found!');
        return;
    }
    
    let skills = siteData.skills || [];
    
    if (skills.length === 0) {
        container.innerHTML = '<p style="color: #64748b; padding: 20px; text-align: center;">No skills added yet. Click "Add Skill" to create one.</p>';
        return;
    }
    
    // Sort: pinned first, then by order
    skills.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return (a.order || 0) - (b.order || 0);
    });
    
    container.innerHTML = skills.map((skill, index) => `
        <div class="admin-skill-item ${skill.pinned ? 'pinned' : ''}">
            <div class="item-info">
                <h4>${skill.pinned ? '📌 ' : ''}${escapeHTML(skill.title)}</h4>
                <p>${escapeHTML((skill.description || '').substring(0, 60))}...</p>
            </div>
            <div class="item-actions">
                <button class="btn btn-sm btn-outline" onclick="moveSkill('${skill.id}', 'up')" ${index === 0 ? 'disabled' : ''} title="Move Up">
                    <i class="fas fa-arrow-up"></i>
                </button>
                <button class="btn btn-sm btn-outline" onclick="moveSkill('${skill.id}', 'down')" ${index === skills.length - 1 ? 'disabled' : ''} title="Move Down">
                    <i class="fas fa-arrow-down"></i>
                </button>
                <button class="btn btn-sm btn-outline" onclick="togglePinSkill('${skill.id}')" title="${skill.pinned ? 'Unpin' : 'Pin'}">
                    <i class="fas fa-thumbtack" style="color: ${skill.pinned ? 'var(--primary)' : 'inherit'}"></i>
                </button>
                <button class="btn btn-sm btn-outline" onclick="editSkill('${skill.id}')" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm" style="background: #ef4444; color: white;" onclick="deleteSkill('${skill.id}')" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function showAddSkillForm() {
    const container = document.getElementById('skillFormContainer');
    const title = document.getElementById('skillFormTitle');
    const form = document.getElementById('skillForm');
    
    if (container) container.style.display = 'block';
    if (title) title.textContent = 'Add New Skill';
    if (form) form.reset();
    setInputValue('skillId', '');
}

function hideSkillForm() {
    const container = document.getElementById('skillFormContainer');
    if (container) container.style.display = 'none';
}

function saveSkill(e) {
    e.preventDefault();
    
    const skillId = document.getElementById('skillId')?.value;
    const certFile = document.getElementById('skillCert')?.files[0];
    
    const processSkill = function(certData) {
        const skillData = {
            id: skillId || Date.now().toString(),
            title: document.getElementById('skillTitle')?.value || '',
            description: document.getElementById('skillDesc')?.value || '',
            certFile: certData || '',
            certLink: document.getElementById('skillCertLink')?.value || '',
            pinned: skillId ? (siteData.skills.find(s => s.id === skillId)?.pinned || false) : false,
            order: skillId ? (siteData.skills.find(s => s.id === skillId)?.order) : siteData.skills.length
        };
        
        if (!siteData.skills) siteData.skills = [];
        
        if (skillId) {
            const index = siteData.skills.findIndex(s => s.id === skillId);
            if (index !== -1) {
                if (!certData && siteData.skills[index].certFile) {
                    skillData.certFile = siteData.skills[index].certFile;
                }
                siteData.skills[index] = skillData;
            }
        } else {
            siteData.skills.push(skillData);
        }
        
        saveData();
        loadAdminSkills();
        hideSkillForm();
    };
    
    if (certFile) {
        const reader = new FileReader();
        reader.onload = function(e) { processSkill(e.target.result); };
        reader.readAsDataURL(certFile);
    } else {
        processSkill(null);
    }
}

function editSkill(skillId) {
    const skill = siteData.skills.find(s => s.id === skillId);
    if (!skill) return;
    
    const container = document.getElementById('skillFormContainer');
    const title = document.getElementById('skillFormTitle');
    
    if (container) container.style.display = 'block';
    if (title) title.textContent = 'Edit Skill';
    
    setInputValue('skillId', skill.id);
    setInputValue('skillTitle', skill.title);
    setInputValue('skillDesc', skill.description);
    setInputValue('skillCertLink', skill.certLink || '');
}

function deleteSkill(skillId) {
    if (confirm('Are you sure you want to delete this skill?')) {
        siteData.skills = siteData.skills.filter(s => s.id !== skillId);
        saveData();
        loadAdminSkills();
    }
}

function moveSkill(skillId, direction) {
    let skills = [...siteData.skills];
    skills.sort((a, b) => (a.order || 0) - (b.order || 0));
    
    const index = skills.findIndex(s => s.id === skillId);
    if (index === -1) return;
    
    if (direction === 'up' && index > 0) {
        [skills[index], skills[index - 1]] = [skills[index - 1], skills[index]];
    } else if (direction === 'down' && index < skills.length - 1) {
        [skills[index], skills[index + 1]] = [skills[index + 1], skills[index]];
    }
    
    skills.forEach((s, i) => s.order = i);
    siteData.skills = skills;
    saveData();
    loadAdminSkills();
}

function togglePinSkill(skillId) {
    const skill = siteData.skills.find(s => s.id === skillId);
    if (skill) {
        skill.pinned = !skill.pinned;
        saveData();
        loadAdminSkills();
    }
}

// ============================================
// Messages
// ============================================
function loadMessages() {
    const container = document.getElementById('messagesList');
    if (!container) return;
    
    const messages = siteData.messages || [];
    
    if (messages.length === 0) {
        container.innerHTML = '<p style="color: #64748b; padding: 20px; text-align: center;">No messages received yet.</p>';
        return;
    }
    
    container.innerHTML = messages.slice().reverse().map(msg => `
        <div class="admin-project-item" style="${msg.read ? '' : 'border-left: 4px solid var(--primary);'}">
            <div class="item-info">
                <h4>${escapeHTML(msg.subject || 'No Subject')}</h4>
                <p><strong>${escapeHTML(msg.name)}</strong> (${escapeHTML(msg.email)})</p>
                <p>${escapeHTML((msg.message || '').substring(0, 80))}...</p>
                <small>${new Date(msg.timestamp).toLocaleString()}</small>
            </div>
            <div class="item-actions">
                <button class="btn btn-sm btn-outline" onclick="viewMessage('${msg.id}')">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="btn btn-sm" style="background: #ef4444; color: white;" onclick="deleteMessage('${msg.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function viewMessage(messageId) {
    const msg = siteData.messages.find(m => m.id === messageId);
    if (msg) {
        msg.read = true;
        saveData();
        alert(`From: ${msg.name}\nEmail: ${msg.email}\nSubject: ${msg.subject}\n\nMessage:\n${msg.message}`);
        loadMessages();
    }
}

function deleteMessage(messageId) {
    if (confirm('Delete this message?')) {
        siteData.messages = siteData.messages.filter(m => m.id !== messageId);
        saveData();
        loadMessages();
    }
}

// ============================================
// Resume Management
// ============================================
function loadResumeInfo() {
    const container = document.getElementById('currentResume');
    if (!container) return;
    
    if (siteData.resume) {
        container.innerHTML = `
            <p style="color: #10b981;">
                <i class="fas fa-check-circle"></i> Resume uploaded. 
                <a href="${siteData.resume}" target="_blank" style="color: var(--primary);">View Resume</a>
            </p>`;
    } else {
        container.innerHTML = '<p style="color: #64748b;">No resume uploaded yet.</p>';
    }
}

function saveResume(e) {
    e.preventDefault();
    
    const file = document.getElementById('resumeFile')?.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            siteData.resume = event.target.result;
            saveData();
            loadResumeInfo();
        };
        reader.readAsDataURL(file);
    } else {
        alert('Please select a PDF file.');
    }
}

// Debug function
window.debugAdmin = function() {
    console.log('=== Admin Data Debug ===');
    console.log('siteData:', siteData);
    console.log('Projects:', siteData.projects);
    console.log('Skills:', siteData.skills);
    console.log('=========================');
};
