// main.js - portfolio interactions, typing effect, sliders, modal, navbar
document.addEventListener('DOMContentLoaded', () => {
  // ---------------------- Typing Animation ----------------------
  const roles = ["Embedded System Engineer", "IoT Developer", "Electronics Enthusiast", "EV Tech Specialist"];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typedElement = document.getElementById('typed-role');
  
  function typeEffect() {
    const currentRole = roles[roleIndex];
    if (isDeleting) {
      typedElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typedElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }
    
    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      setTimeout(typeEffect, 1800);
      return;
    }
    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(typeEffect, 300);
      return;
    }
    setTimeout(typeEffect, isDeleting ? 60 : 100);
  }
  typeEffect();

  // ---------------------- Project Sliders (using placeholder images) ----------------------
  const projectImages = [
    [
    "assets/projects/project1/img1.jpeg",
    "assets/projects/project1/img2.jpeg"
    ],
    [
    "assets/projects/project2/img1.jpeg",
    "assets/projects/project2/img2.jpeg"
    ]
  ];
  
  let currentProjectIndex = [0, 0];
  
  function updateSlider(projectId) {
    const imgElement = document.getElementById(`project${projectId+1}-img`);
    const counterSpan = document.getElementById(`project${projectId+1}-index`);
    const dotsContainer = document.querySelector(`#slider-project${projectId+1} .slider-dots`);
    if (imgElement) {
      imgElement.src = projectImages[projectId][currentProjectIndex[projectId]];
    }
    if (counterSpan) counterSpan.innerText = currentProjectIndex[projectId] + 1;
    // update active dot
    const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];
    dots.forEach((dot, idx) => {
      if (idx === currentProjectIndex[projectId]) dot.classList.add('active-dot');
      else dot.classList.remove('active-dot');
    });
  }
  
  function nextImage(projectId) {
    currentProjectIndex[projectId] = (currentProjectIndex[projectId] + 1) % projectImages[projectId].length;
    updateSlider(projectId);
  }
  
  function prevImage(projectId) {
    currentProjectIndex[projectId] = (currentProjectIndex[projectId] - 1 + projectImages[projectId].length) % projectImages[projectId].length;
    updateSlider(projectId);
  }
  
  // attach event listeners for sliders
  document.querySelectorAll('.slider-next').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const project = parseInt(btn.getAttribute('data-project'));
      nextImage(project);
    });
  });
  document.querySelectorAll('.slider-prev').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const project = parseInt(btn.getAttribute('data-project'));
      prevImage(project);
    });
  });
  // dot click handlers
  document.querySelectorAll('.slider-dots').forEach((dotsContainer, idx) => {
    const projectId = idx;
    const dots = dotsContainer.querySelectorAll('.dot');
    dots.forEach((dot, dotIdx) => {
      dot.addEventListener('click', () => {
        currentProjectIndex[projectId] = dotIdx;
        updateSlider(projectId);
      });
    });
  });
  // initial sliders update
  updateSlider(0);
  updateSlider(1);
  
  // ---------------------- Certificate Modal ----------------------
  const modal = document.getElementById('certModal');
  const modalImg = document.getElementById('modalImage');
  const modalCaption = document.getElementById('modalCaption');
  const closeModal = document.querySelector('.modal-close');
  
  document.querySelectorAll('.cert-card').forEach(card => {
    card.addEventListener('click', () => {
      const imgSrc = card.getAttribute('data-cert-src');
      const title = card.querySelector('h3')?.innerText || 'Certificate';
      modalImg.src = imgSrc;
      modalCaption.innerText = title;
      modal.style.display = 'flex';
    });
  });
  // ---------------------- Experience Modal ----------------------
  document.querySelectorAll('.exp-card').forEach(card => {
    card.addEventListener('click', () => {

      const imgSrc = card.getAttribute('data-cert-src');

      const title =
        card.querySelector('h3')?.innerText || 'Experience Certificate';

      modalImg.src = imgSrc;
      modalCaption.innerText = title;

      modal.style.display = 'flex';
    });
  });
  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });
  
  // ---------------------- Mobile Navbar Toggle ----------------------
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
  });
  
  // smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === "#" || targetId === "") return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
  
  // dynamic navbar background on scroll
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('.glass-nav');
    if (window.scrollY > 50) {
      nav.style.background = 'rgba(15, 23, 42, 0.9)';
      nav.style.backdropFilter = 'blur(20px)';
    } else {
      nav.style.background = 'rgba(15, 23, 42, 0.7)';
    }
  });
});
