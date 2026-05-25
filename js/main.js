// ============================================
// Admin Panel JavaScript - File-based Storage
// ============================================

const ADMIN_CREDENTIALS = { username: 'dineshredcap@gmail.com', password: 'DINESH@ECE' };
const isAuthenticated = sessionStorage.getItem('adminAuth') === 'true';

if (!isAuthenticated) {
    showLoginPage();
} else {
    let siteData = JSON.parse(localStorage.getItem('portfolioData'));
    if (!siteData || typeof siteData !== 'object') {
        siteData = { profile: {}, projects: [], skills: [], experiences: [], social: {}, messages: [], resume: "" };
        localStorage.setItem('portfolioData', JSON.stringify(siteData));
    }
    if (!siteData.profile) siteData.profile = {};
    if (!Array.isArray(siteData.projects)) siteData.projects = [];
    if (!Array.isArray(siteData.skills)) siteData.skills = [];
    if (!Array.isArray(siteData.experiences)) siteData.experiences = [];
    if (!siteData.social) siteData.social = {};
    if (!Array.isArray(siteData.messages)) siteData.messages = [];
    
    window.siteData = siteData;
    
    document.addEventListener('DOMContentLoaded', function() {
        initAdminNavigation();
        loadDashboardStats();
        loadProfileData();
        loadAdminProjects();
        loadAdminSkills();
        loadAdminExperiences();
        loadMessages();
        loadResumeInfo();
        initEventListeners();
        initSidebarToggle();
    });
}

// ============================================
// Helper Functions
// ============================================
function escapeHTML(str) { if(!str) return ''; const d = document.createElement('div'); d.textContent = str; return d.innerHTML; }
function setInputValue(id, val) { const el = document.getElementById(id); if(el && val !== undefined) el.value = val; }
function setTextContent(id, val) { const el = document.getElementById(id); if(el) el.textContent = val; }
function saveData() { 
    localStorage.setItem('portfolioData', JSON.stringify(window.siteData)); 
    alert('✅ Saved successfully!'); 
    loadDashboardStats(); 
}

/**
 * Generate a file path for storage reference
 * Files should be manually placed in these folders
 */
function generateFilePath(folder, fileName) {
    // Clean filename
    const cleanName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_').toLowerCase();
    const timestamp = Date.now();
    return folder + '/' + timestamp + '_' + cleanName;
}

// ============================================
// Login System
// ============================================
function showLoginPage() {
    document.body.innerHTML = `<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#eff6ff,#fff);padding:20px;"><div style="background:#fff;border-radius:16px;padding:40px;max-width:420px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.1);border:1px solid #e2e8f0;"><div style="text-align:center;margin-bottom:32px;"><div style="width:64px;height:64px;background:linear-gradient(135deg,#1e40af,#3b82f6);border-radius:16px;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;"><i class="fas fa-lock" style="font-size:28px;color:#fff;"></i></div><h2 style="font-size:1.5rem;color:#1e293b;margin-bottom:4px;font-weight:700;">Admin Login</h2><p style="color:#64748b;font-size:0.9rem;">Sign in to manage your portfolio</p></div><form id="loginForm"><div style="margin-bottom:20px;"><label style="display:block;margin-bottom:6px;font-weight:600;color:#334155;font-size:0.9rem;">Email</label><input type="email" id="loginEmail" required placeholder="Enter your email" style="width:100%;padding:12px 16px;border:1px solid #e2e8f0;border-radius:8px;font-size:14px;font-family:Inter,sans-serif;background:#f8fafc;"></div><div style="margin-bottom:24px;position:relative;"><label style="display:block;margin-bottom:6px;font-weight:600;color:#334155;font-size:0.9rem;">Password</label><input type="password" id="loginPassword" required placeholder="Enter your password" style="width:100%;padding:12px 16px;border:1px solid #e2e8f0;border-radius:8px;font-size:14px;font-family:Inter,sans-serif;background:#f8fafc;"><i class="fas fa-eye" onclick="window.togglePwd()" style="position:absolute;right:14px;top:40px;cursor:pointer;color:#94a3b8;"></i></div><button type="submit" style="width:100%;padding:14px;background:linear-gradient(135deg,#1e40af,#3b82f6);color:#fff;border:none;border-radius:8px;font-size:16px;font-weight:600;cursor:pointer;font-family:Inter,sans-serif;box-shadow:0 4px 12px rgba(30,64,175,0.3);"><i class="fas fa-sign-in-alt"></i> Login</button><button type="button" onclick="window.forgotPwd()" style="width:100%;padding:12px;background:none;border:none;color:#3b82f6;cursor:pointer;font-size:14px;font-weight:500;margin-top:12px;font-family:Inter,sans-serif;">Forgot Password?</button></form></div></div>`;
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        if (document.getElementById('loginEmail').value === ADMIN_CREDENTIALS.username && document.getElementById('loginPassword').value === ADMIN_CREDENTIALS.password) {
            sessionStorage.setItem('adminAuth', 'true');
            alert('✅ Login successful!');
            location.reload();
        } else { alert('❌ Invalid credentials!'); }
    });
    window.togglePwd = function() { const i = document.getElementById('loginPassword'); if(i) i.type = i.type === 'password' ? 'text' : 'password'; };
    window.forgotPwd = function() {
        const email = prompt('Enter your email:');
        if(email) {
            const otp = Math.floor(100000 + Math.random() * 900000);
            alert('OTP: ' + otp);
            const uotp = prompt('Enter OTP:');
            if(uotp === otp.toString()) {
                const np = prompt('New password:');
                if(np) { ADMIN_CREDENTIALS.password = np; alert('✅ Password reset!'); }
            } else { alert('❌ Invalid OTP!'); }
        }
    };
}

function logout() { sessionStorage.removeItem('adminAuth'); window.location.href = 'index.html'; }

// ============================================
// Navigation
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
            if(target) target.classList.add('active');
            document.getElementById('adminSidebar')?.classList.remove('mobile-open');
        });
    });
}

function initSidebarToggle() {
    document.getElementById('sidebarToggle')?.addEventListener('click', () => {
        document.getElementById('adminSidebar')?.classList.toggle('mobile-open');
    });
}

// ============================================
// Dashboard
// ============================================
function loadDashboardStats() {
    const d = window.siteData;
    setTextContent('visitorCount', localStorage.getItem('visitorCount') || '0');
    setTextContent('messageCount', d.messages?.length || 0);
    setTextContent('projectCount', d.projects?.length || 0);
    setTextContent('skillCount', d.skills?.length || 0);
    setTextContent('experienceCount', d.experiences?.length || 0);
}

// ============================================
// Profile Management
// ============================================
function loadProfileData() {
    const p = window.siteData.profile || {};
    const s = window.siteData.social || {};
    setInputValue('editName', p.name); setInputValue('editDesignation', p.designation);
    setInputValue('editBio', p.bio); setInputValue('editEmail', p.email);
    setInputValue('editPhone', p.phone); setInputValue('editLocation', p.location);
    setInputValue('editGithub', s.github); setInputValue('editLinkedin', s.linkedin);
    setInputValue('editTwitter', s.twitter); setInputValue('editInstagram', s.instagram);
    setInputValue('editWhatsapp', s.whatsapp);
    
    // Show preview if image exists
    if(p.image) {
        const preview = document.getElementById('imagePreview');
        if(preview) preview.src = p.image;
    }
}

function initEventListeners() {
    // Profile Form
    document.getElementById('profileForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const d = window.siteData;
        if(!d.profile) d.profile = {}; 
        if(!d.social) d.social = {};
        d.profile.name = document.getElementById('editName')?.value || '';
        d.profile.designation = document.getElementById('editDesignation')?.value || '';
        d.profile.bio = document.getElementById('editBio')?.value || '';
        d.profile.email = document.getElementById('editEmail')?.value || '';
        d.profile.phone = document.getElementById('editPhone')?.value || '';
        d.profile.location = document.getElementById('editLocation')?.value || '';
        d.social.github = document.getElementById('editGithub')?.value || '';
        d.social.linkedin = document.getElementById('editLinkedin')?.value || '';
        d.social.twitter = document.getElementById('editTwitter')?.value || '';
        d.social.instagram = document.getElementById('editInstagram')?.value || '';
        d.social.whatsapp = document.getElementById('editWhatsapp')?.value || '';
        saveData();
    });
    
    // Single Image Upload - Saves file path reference
    document.getElementById('singleImage')?.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if(file) {
            // Generate the expected file path
            const filePath = generateFilePath('images', file.name);
            
            // Store the path in data
            window.siteData.profile.image = filePath;
            
            // Show preview from the selected file
            const preview = document.getElementById('imagePreview');
            if(preview) {
                preview.src = URL.createObjectURL(file);
            }
            
            // Show instructions
            alert(`📁 Please save this image file to your project:\n\nFolder: images/\nFilename: ${filePath.replace('images/', '')}\n\nFull path: ${filePath}\n\nThe path has been saved. Place the file there for it to display.`);
            
            saveData();
        }
    });
    
    // Project Form
    document.getElementById('projectForm')?.addEventListener('submit', saveProject);
    
    // Skill Form
    document.getElementById('skillForm')?.addEventListener('submit', saveSkill);
    
    // Experience Form
    document.getElementById('experienceForm')?.addEventListener('submit', saveExperience);
    
    // Resume Form
    document.getElementById('resumeForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const file = document.getElementById('resumeFile')?.files[0];
        if(file) {
            const filePath = generateFilePath('documents', file.name);
            window.siteData.resume = filePath;
            alert(`📁 Please save your resume to:\n\n${filePath}`);
            saveData(); 
            loadResumeInfo(); 
        } else {
            alert('Please select a PDF file.');
        }
    });
    
    // Experience image preview
    document.getElementById('experienceImages')?.addEventListener('change', function(e) {
        const preview = document.getElementById('experienceImagePreview');
        if (!preview) return;
        preview.innerHTML = '';
        for (let i = 0; i < e.target.files.length; i++) {
            const file = e.target.files[i];
            const url = URL.createObjectURL(file);
            const img = document.createElement('img');
            img.src = url;
            img.alt = 'Preview ' + (i + 1);
            preview.appendChild(img);
        }
    });
}

// ============================================
// Projects CRUD
// ============================================
function loadAdminProjects() {
    const c = document.getElementById('adminProjectsList'); if(!c) return;
    let p = window.siteData.projects || [];
    if(p.length === 0) { c.innerHTML = '<p style="color:#64748b;padding:20px;text-align:center;">No projects yet.</p>'; return; }
    p.sort((a,b) => { if(a.pinned&&!b.pinned) return -1; if(!a.pinned&&b.pinned) return 1; return (a.order||0)-(b.order||0); });
    c.innerHTML = p.map((pr,i) => `<div class="admin-project-item ${pr.pinned?'pinned':''}"><div class="item-info"><h4>${pr.pinned?'📌 ':''}${escapeHTML(pr.title)}</h4><p>${escapeHTML((pr.description||'').substring(0,60))}... | ${pr.date||'No date'}</p><small>Image: ${pr.image||'None'}</small></div><div class="item-actions"><button class="btn btn-sm btn-outline" onclick="window.moveProject('${pr.id}','up')" ${i===0?'disabled':''}><i class="fas fa-arrow-up"></i></button><button class="btn btn-sm btn-outline" onclick="window.moveProject('${pr.id}','down')" ${i===p.length-1?'disabled':''}><i class="fas fa-arrow-down"></i></button><button class="btn btn-sm btn-outline" onclick="window.togglePinProject('${pr.id}')"><i class="fas fa-thumbtack" style="color:${pr.pinned?'var(--primary)':'inherit'}"></i></button><button class="btn btn-sm btn-outline" onclick="window.editProject('${pr.id}')"><i class="fas fa-edit"></i></button><button class="btn btn-sm" style="background:#ef4444;color:#fff;" onclick="window.deleteProject('${pr.id}')"><i class="fas fa-trash"></i></button></div></div>`).join('');
}

function showAddProjectForm() { 
    document.getElementById('projectFormContainer').style.display='block'; 
    document.getElementById('projectFormTitle').textContent='Add New Project'; 
    document.getElementById('projectForm').reset(); 
    setInputValue('projectId',''); 
}

function hideProjectForm() { document.getElementById('projectFormContainer').style.display='none'; }

function saveProject(e) {
    e.preventDefault();
    const d = window.siteData;
    const pid = document.getElementById('projectId')?.value;
    const imageFile = document.getElementById('projectImage')?.files[0];
    const docFile = document.getElementById('projectDoc')?.files[0];
    
    // Handle image - store file path
    let imagePath = pid ? (d.projects.find(p => p.id === pid)?.image || '') : '';
    if (imageFile) {
        imagePath = generateFilePath('images', imageFile.name);
        alert(`📁 Please save the project image to:\n\n${imagePath}`);
    }
    
    // Handle document - store file path
    let docFilePath = pid ? (d.projects.find(p => p.id === pid)?.docFile || '') : '';
    if (docFile) {
        docFilePath = generateFilePath('documents', docFile.name);
        alert(`📁 Please save the project document to:\n\n${docFilePath}`);
    }
    
    const pd = { 
        id: pid || Date.now().toString(), 
        title: document.getElementById('projectTitle')?.value || '', 
        description: document.getElementById('projectDesc')?.value || '', 
        date: document.getElementById('projectDate')?.value || '', 
        docLink: document.getElementById('projectDocLink')?.value || '', 
        docFile: docFilePath,
        github: document.getElementById('projectGithub')?.value || '', 
        video: document.getElementById('projectVideo')?.value || '', 
        pinned: pid ? (d.projects.find(p => p.id === pid)?.pinned || false) : false, 
        order: pid ? d.projects.find(p => p.id === pid)?.order : d.projects.length, 
        image: imagePath
    };
    
    if(!d.projects) d.projects = [];
    if(pid) { 
        const idx = d.projects.findIndex(p => p.id === pid); 
        if(idx !== -1) d.projects[idx] = pd; 
    } else { 
        d.projects.push(pd); 
    }
    
    saveData(); 
    loadAdminProjects(); 
    hideProjectForm();
}

function editProject(pid) {
    const p = window.siteData.projects.find(pr => pr.id === pid); 
    if(!p) return;
    document.getElementById('projectFormContainer').style.display = 'block';
    document.getElementById('projectFormTitle').textContent = 'Edit Project';
    setInputValue('projectId', p.id); 
    setInputValue('projectTitle', p.title);
    setInputValue('projectDesc', p.description); 
    setInputValue('projectDate', p.date);
    setInputValue('projectDocLink', p.docLink || ''); 
    setInputValue('projectGithub', p.github || '');
    setInputValue('projectVideo', p.video || '');
}

function deleteProject(pid) { 
    if(confirm('Delete this project?')) { 
        window.siteData.projects = window.siteData.projects.filter(p => p.id !== pid); 
        saveData(); 
        loadAdminProjects(); 
    } 
}

function moveProject(pid, dir) {
    let p = [...window.siteData.projects]; 
    p.sort((a,b) => (a.order||0)-(b.order||0));
    const i = p.findIndex(pr => pr.id === pid); 
    if(i === -1) return;
    if(dir === 'up' && i > 0) [p[i], p[i-1]] = [p[i-1], p[i]];
    else if(dir === 'down' && i < p.length-1) [p[i], p[i+1]] = [p[i+1], p[i]];
    p.forEach((pr, idx) => pr.order = idx); 
    window.siteData.projects = p; 
    saveData(); 
    loadAdminProjects();
}

function togglePinProject(pid) { 
    const p = window.siteData.projects.find(pr => pr.id === pid); 
    if(p) { p.pinned = !p.pinned; saveData(); loadAdminProjects(); } 
}

// ============================================
// Skills CRUD
// ============================================
function loadAdminSkills() {
    const c = document.getElementById('adminSkillsList'); if(!c) return;
    let s = window.siteData.skills || [];
    if(s.length===0) { c.innerHTML='<p style="color:#64748b;padding:20px;text-align:center;">No skills yet.</p>'; return; }
    s.sort((a,b)=>{ if(a.pinned&&!b.pinned) return -1; if(!a.pinned&&b.pinned) return 1; return (a.order||0)-(b.order||0); });
    c.innerHTML = s.map((sk,i)=>`<div class="admin-skill-item ${sk.pinned?'pinned':''}"><div class="item-info"><h4>${sk.pinned?'📌 ':''}${escapeHTML(sk.title)}</h4><p>${escapeHTML((sk.description||'').substring(0,60))}...</p></div><div class="item-actions"><button class="btn btn-sm btn-outline" onclick="window.moveSkill('${sk.id}','up')" ${i===0?'disabled':''}><i class="fas fa-arrow-up"></i></button><button class="btn btn-sm btn-outline" onclick="window.moveSkill('${sk.id}','down')" ${i===s.length-1?'disabled':''}><i class="fas fa-arrow-down"></i></button><button class="btn btn-sm btn-outline" onclick="window.togglePinSkill('${sk.id}')"><i class="fas fa-thumbtack" style="color:${sk.pinned?'var(--primary)':'inherit'}"></i></button><button class="btn btn-sm btn-outline" onclick="window.editSkill('${sk.id}')"><i class="fas fa-edit"></i></button><button class="btn btn-sm" style="background:#ef4444;color:#fff;" onclick="window.deleteSkill('${sk.id}')"><i class="fas fa-trash"></i></button></div></div>`).join('');
}

function showAddSkillForm() { document.getElementById('skillFormContainer').style.display='block'; document.getElementById('skillFormTitle').textContent='Add Skill'; document.getElementById('skillForm').reset(); setInputValue('skillId',''); }
function hideSkillForm() { document.getElementById('skillFormContainer').style.display='none'; }

function saveSkill(e) {
    e.preventDefault();
    const d = window.siteData;
    const sid = document.getElementById('skillId')?.value;
    const certFile = document.getElementById('skillCert')?.files[0];
    
    let certPath = sid ? (d.skills.find(s=>s.id===sid)?.certFile || '') : '';
    if (certFile) {
        certPath = generateFilePath('documents', certFile.name);
        alert(`📁 Please save the certificate to:\n\n${certPath}`);
    }
    
    const sd = { 
        id: sid || Date.now().toString(), 
        title: document.getElementById('skillTitle')?.value||'', 
        description: document.getElementById('skillDesc')?.value||'', 
        certLink: document.getElementById('skillCertLink')?.value||'', 
        certFile: certPath,
        pinned: sid ? (d.skills.find(s=>s.id===sid)?.pinned||false) : false, 
        order: sid ? d.skills.find(s=>s.id===sid)?.order : d.skills.length 
    };
    if(!d.skills) d.skills = [];
    if(sid) { const idx = d.skills.findIndex(s=>s.id===sid); if(idx!==-1) d.skills[idx] = sd; }
    else d.skills.push(sd);
    saveData(); loadAdminSkills(); hideSkillForm();
}

function editSkill(sid) {
    const s = window.siteData.skills.find(sk=>sk.id===sid); if(!s) return;
    document.getElementById('skillFormContainer').style.display='block';
    document.getElementById('skillFormTitle').textContent='Edit Skill';
    setInputValue('skillId',s.id); setInputValue('skillTitle',s.title);
    setInputValue('skillDesc',s.description); setInputValue('skillCertLink',s.certLink||'');
}

function deleteSkill(sid) { if(confirm('Delete?')) { window.siteData.skills = window.siteData.skills.filter(s=>s.id!==sid); saveData(); loadAdminSkills(); } }
function moveSkill(sid, dir) {
    let s = [...window.siteData.skills]; s.sort((a,b)=>(a.order||0)-(b.order||0));
    const i = s.findIndex(sk=>sk.id===sid); if(i===-1) return;
    if(dir==='up'&&i>0) [s[i],s[i-1]]=[s[i-1],s[i]];
    else if(dir==='down'&&i<s.length-1) [s[i],s[i+1]]=[s[i+1],s[i]];
    s.forEach((sk,idx)=>sk.order=idx); window.siteData.skills = s; saveData(); loadAdminSkills();
}
function togglePinSkill(sid) { const s = window.siteData.skills.find(sk=>sk.id===sid); if(s) { s.pinned=!s.pinned; saveData(); loadAdminSkills(); } }

// ============================================
// Experiences CRUD
// ============================================
function loadAdminExperiences() {
    const c = document.getElementById('adminExperienceList'); if(!c) return;
    let e = window.siteData.experiences || [];
    if(e.length===0) { c.innerHTML='<p style="color:#64748b;padding:20px;text-align:center;">No experiences yet.</p>'; return; }
    e.sort((a,b)=>{ if(a.pinned&&!b.pinned) return -1; if(!a.pinned&&b.pinned) return 1; return (a.order||0)-(b.order||0); });
    c.innerHTML = e.map((ex,i)=>`<div class="admin-experience-item ${ex.pinned?'pinned':''}"><div class="item-info"><h4>${ex.pinned?'📌 ':''}${escapeHTML(ex.title)}</h4><p>${escapeHTML(ex.company)} | ${escapeHTML(ex.duration)}</p><p>${escapeHTML((ex.description||'').substring(0,60))}...</p><small>${ex.images?ex.images.length:0} image(s)</small></div><div class="item-actions"><button class="btn btn-sm btn-outline" onclick="window.moveExperience('${ex.id}','up')" ${i===0?'disabled':''}><i class="fas fa-arrow-up"></i></button><button class="btn btn-sm btn-outline" onclick="window.moveExperience('${ex.id}','down')" ${i===e.length-1?'disabled':''}><i class="fas fa-arrow-down"></i></button><button class="btn btn-sm btn-outline" onclick="window.togglePinExperience('${ex.id}')"><i class="fas fa-thumbtack" style="color:${ex.pinned?'var(--primary)':'inherit'}"></i></button><button class="btn btn-sm btn-outline" onclick="window.editExperience('${ex.id}')"><i class="fas fa-edit"></i></button><button class="btn btn-sm" style="background:#ef4444;color:#fff;" onclick="window.deleteExperience('${ex.id}')"><i class="fas fa-trash"></i></button></div></div>`).join('');
}

function showAddExperienceForm() { document.getElementById('experienceFormContainer').style.display='block'; document.getElementById('experienceFormTitle').textContent='Add Experience'; document.getElementById('experienceForm').reset(); document.getElementById('experienceImagePreview').innerHTML=''; setInputValue('experienceId',''); }
function hideExperienceForm() { document.getElementById('experienceFormContainer').style.display='none'; }

function saveExperience(e) {
    e.preventDefault();
    const d = window.siteData;
    const eid = document.getElementById('experienceId')?.value;
    const files = document.getElementById('experienceImages')?.files;
    const certFile = document.getElementById('experienceCert')?.files[0];
    
    let imagePaths = eid ? (d.experiences.find(ex => ex.id === eid)?.images || []) : [];
    
    if (files && files.length > 0) {
        imagePaths = [];
        for (let i = 0; i < files.length; i++) {
            const path = generateFilePath('images', files[i].name);
            imagePaths.push(path);
        }
        alert(`📁 Please save ${files.length} image(s) to the images/ folder:\n\n${imagePaths.join('\n')}`);
    }
    
    let certPath = eid ? (d.experiences.find(ex => ex.id === eid)?.certFile || '') : '';
    if (certFile) {
        certPath = generateFilePath('documents', certFile.name);
        alert(`📁 Please save the certificate to:\n\n${certPath}`);
    }
    
    const ed = { 
        id: eid || Date.now().toString(), 
        title: document.getElementById('experienceTitle')?.value || '', 
        company: document.getElementById('experienceCompany')?.value || '', 
        duration: document.getElementById('experienceDuration')?.value || '', 
        description: document.getElementById('experienceDesc')?.value || '', 
        images: imagePaths, 
        certLink: document.getElementById('experienceCertLink')?.value || '', 
        certFile: certPath,
        pinned: eid ? (d.experiences.find(e => e.id === eid)?.pinned || false) : false, 
        order: eid ? d.experiences.find(e => e.id === eid)?.order : d.experiences.length 
    };
    
    if(!d.experiences) d.experiences = [];
    if(eid) { 
        const idx = d.experiences.findIndex(e => e.id === eid); 
        if(idx !== -1) d.experiences[idx] = ed; 
    } else { 
        d.experiences.push(ed); 
    }
    
    saveData(); 
    loadAdminExperiences(); 
    hideExperienceForm();
}

function editExperience(eid) {
    const e = window.siteData.experiences.find(ex => ex.id === eid); 
    if(!e) return;
    document.getElementById('experienceFormContainer').style.display = 'block';
    document.getElementById('experienceFormTitle').textContent = 'Edit Experience';
    setInputValue('experienceId', e.id); 
    setInputValue('experienceTitle', e.title);
    setInputValue('experienceCompany', e.company); 
    setInputValue('experienceDuration', e.duration);
    setInputValue('experienceDesc', e.description); 
    setInputValue('experienceCertLink', e.certLink || '');
}

function deleteExperience(eid) { 
    if(confirm('Delete?')) { 
        window.siteData.experiences = window.siteData.experiences.filter(ex => ex.id !== eid); 
        saveData(); 
        loadAdminExperiences(); 
    } 
}

function moveExperience(eid, dir) {
    let e = [...window.siteData.experiences]; e.sort((a,b)=>(a.order||0)-(b.order||0));
    const i = e.findIndex(ex => ex.id === eid); if(i === -1) return;
    if(dir === 'up' && i > 0) [e[i], e[i-1]] = [e[i-1], e[i]];
    else if(dir === 'down' && i < e.length-1) [e[i], e[i+1]] = [e[i+1], e[i]];
    e.forEach((ex, idx) => ex.order = idx); window.siteData.experiences = e; saveData(); loadAdminExperiences();
}
function togglePinExperience(eid) { const e = window.siteData.experiences.find(ex => ex.id === eid); if(e) { e.pinned = !e.pinned; saveData(); loadAdminExperiences(); } }

// ============================================
// Messages
// ============================================
function loadMessages() {
    const c = document.getElementById('messagesList'); if(!c) return;
    const m = window.siteData.messages || [];
    if(m.length===0) { c.innerHTML='<p style="color:#64748b;padding:20px;text-align:center;">No messages.</p>'; return; }
    c.innerHTML = m.slice().reverse().map(msg=>`<div class="admin-project-item" style="${msg.read?'':'border-left:4px solid var(--primary)'}"><div class="item-info"><h4>${escapeHTML(msg.subject||'No Subject')}</h4><p><strong>${escapeHTML(msg.name)}</strong> (${escapeHTML(msg.email)})</p><p>${escapeHTML((msg.message||'').substring(0,80))}...</p><small>${new Date(msg.timestamp).toLocaleString()}</small></div><div class="item-actions"><button class="btn btn-sm btn-outline" onclick="window.viewMessage('${msg.id}')"><i class="fas fa-eye"></i></button><button class="btn btn-sm" style="background:#ef4444;color:#fff;" onclick="window.deleteMessage('${msg.id}')"><i class="fas fa-trash"></i></button></div></div>`).join('');
}

function viewMessage(mid) { const msg = window.siteData.messages.find(m=>m.id===mid); if(msg) { msg.read=true; saveData(); alert(`From: ${msg.name}\nEmail: ${msg.email}\nSubject: ${msg.subject}\n\n${msg.message}`); loadMessages(); } }
function deleteMessage(mid) { if(confirm('Delete?')) { window.siteData.messages = window.siteData.messages.filter(m=>m.id!==mid); saveData(); loadMessages(); } }

// ============================================
// Resume
// ============================================
function loadResumeInfo() {
    const c = document.getElementById('currentResume'); if(!c) return;
    c.innerHTML = window.siteData.resume ? `<p style="color:#10b981;"><i class="fas fa-check-circle"></i> Resume path: ${window.siteData.resume}. <a href="${window.siteData.resume}" target="_blank" style="color:var(--primary);">View</a></p>` : '<p style="color:#64748b;">No resume uploaded.</p>';
}

// ============================================
// Expose to window
// ============================================
window.showAddProjectForm = showAddProjectForm; window.hideProjectForm = hideProjectForm;
window.editProject = editProject; window.deleteProject = deleteProject;
window.moveProject = moveProject; window.togglePinProject = togglePinProject;
window.showAddSkillForm = showAddSkillForm; window.hideSkillForm = hideSkillForm;
window.editSkill = editSkill; window.deleteSkill = deleteSkill;
window.moveSkill = moveSkill; window.togglePinSkill = togglePinSkill;
window.showAddExperienceForm = showAddExperienceForm; window.hideExperienceForm = hideExperienceForm;
window.editExperience = editExperience; window.deleteExperience = deleteExperience;
window.moveExperience = moveExperience; window.togglePinExperience = togglePinExperience;
window.viewMessage = viewMessage; window.deleteMessage = deleteMessage;
window.logout = logout;
