// Login System Variables
let isLoggedIn = false;
let isAdmin = false;

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
  hamburger.classList.remove('active');
  navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
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

// Header background on scroll
window.addEventListener('scroll', () => {
  const header = document.querySelector('.header');
  if (window.scrollY > 100) {
    header.style.background = 'rgba(255, 255, 255, 0.98)';
    header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
  } else {
    header.style.background = 'rgba(255, 255, 255, 0.95)';
    header.style.boxShadow = 'none';
  }
});

// Login System Functions
function openLoginModal() {
  document.getElementById('loginModal').style.display = 'block';
}

function closeLoginModal() {
  document.getElementById('loginModal').style.display = 'none';
}

function openAdminModal() {
  document.getElementById('adminModal').style.display = 'block';
  loadProjectsList();
}

function closeAdminModal() {
  document.getElementById('adminModal').style.display = 'none';
}

function handleLogin(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const username = formData.get('username');
  const password = formData.get('password');

  // Simple authentication (in real app, this would be server-side)
  if (username === 'admin' && password === 'admin123') {
    isLoggedIn = true;
    isAdmin = true;
    updateAuthUI();
    closeLoginModal();
    showNotification('¡Inicio de sesión exitoso!', 'success');
  } else {
    showNotification('Credenciales incorrectas. Usa: admin/admin123', 'error');
  }
}

function handleLogout() {
  isLoggedIn = false;
  isAdmin = false;
  updateAuthUI();
  showNotification('Sesión cerrada', 'info');
}

function updateAuthUI() {
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const adminLink = document.querySelector('.admin-link');
  const adminActions = document.querySelectorAll('.admin-action');
  const body = document.body;

  if (isLoggedIn && isAdmin) {
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'flex';
    adminLink.style.display = 'block';
    adminActions.forEach(action => action.classList.add('show'));
    
    // Change background to black when logged in
    body.style.background = '#000000';
    body.style.transition = 'background-color 0.5s ease';
    
    // Add dark mode class for additional styling
    body.classList.add('dark-mode');
  } else {
    loginBtn.style.display = 'flex';
    logoutBtn.style.display = 'none';
    adminLink.style.display = 'none';
    adminActions.forEach(action => action.classList.remove('show'));
    
    // Restore original background
    body.style.background = '#ffffff';
    body.style.transition = 'background-color 0.5s ease';
    
    // Remove dark mode class
    body.classList.remove('dark-mode');
  }
}

// File Upload Functions
function initializeFileUploads() {
  const documentInput = document.getElementById('projectDocument');
  
  if (documentInput) {
    documentInput.addEventListener('change', handleDocumentUpload);
    setupDragAndDrop(documentInput, 'documentPreview');
  }
}

function handleDocumentUpload(event) {
  const file = event.target.files[0];
  const preview = document.getElementById('documentPreview');
  
  if (file) {
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (allowedTypes.includes(fileExtension)) {
      const iconClass = fileExtension === '.pdf' ? 'fas fa-file-pdf' : 'fas fa-file-word';
      const iconColor = fileExtension === '.pdf' ? '#e74c3c' : '#3498db';
      
      preview.innerHTML = `
        <div class="file-info">
          <i class="${iconClass}" style="color: ${iconColor}; font-size: 2rem;"></i>
          <div>
            <span class="file-name">${file.name}</span>
            <span class="file-size">(${formatFileSize(file.size)})</span>
          </div>
        </div>
      `;
      preview.classList.add('show');
    } else {
      showNotification('Por favor selecciona un archivo PDF o Word válido', 'error');
      event.target.value = '';
    }
  }
}

function setupDragAndDrop(input, previewId) {
  const container = input.closest('.file-upload-container');
  const label = container.querySelector('.file-upload-label');
  
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    label.addEventListener(eventName, preventDefaults, false);
  });
  
  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }
  
  ['dragenter', 'dragover'].forEach(eventName => {
    label.addEventListener(eventName, highlight, false);
  });
  
  ['dragleave', 'drop'].forEach(eventName => {
    label.addEventListener(eventName, unhighlight, false);
  });
  
  function highlight(e) {
    container.classList.add('dragover');
  }
  
  function unhighlight(e) {
    container.classList.remove('dragover');
  }
  
  label.addEventListener('drop', handleDrop, false);
  
  function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    
    if (files.length > 0) {
      input.files = files;
      input.dispatchEvent(new Event('change'));
    }
  }
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function resetForm() {
  const form = document.getElementById('addProjectForm');
  form.reset();
  
  // Clear previews
  document.getElementById('documentPreview').classList.remove('show');
  
  showNotification('Formulario limpiado', 'info');
}

// Admin Functions
function showTab(tabName) {
  // Hide all tab contents
  const tabContents = document.querySelectorAll('.tab-content');
  tabContents.forEach(content => content.classList.remove('active'));
  
  // Remove active class from all tab buttons
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(btn => btn.classList.remove('active'));
  
  // Show selected tab content
  document.getElementById(tabName).classList.add('active');
  
  // Add active class to clicked button
  event.target.classList.add('active');
}

function handleAddProject(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  
  // Get file data
  const documentFile = formData.get('projectDocument');
  
  if (!documentFile) {
    showNotification('Por favor selecciona un documento', 'error');
    return;
  }
  
  // Create project object with file data
  const project = {
    id: Date.now(),
    title: formData.get('projectTitle'),
    description: formData.get('projectDescription'),
    documentFile: documentFile,
    tags: formData.get('projectTags').split(',').map(tag => tag.trim()),
    createdAt: new Date().toISOString()
  };
  
  // In a real app, this would upload files to a server
  // For now, we'll store file info in localStorage
  const projectData = {
    ...project,
    documentUrl: URL.createObjectURL(documentFile),
    documentName: documentFile.name
  };
  
  // Store in localStorage
  const projects = JSON.parse(localStorage.getItem('projects') || '[]');
  projects.push(projectData);
  localStorage.setItem('projects', JSON.stringify(projects));
  
  // Add to DOM
  addProjectToGrid(projectData);
  
  // Reset form
  resetForm();
  showNotification('Proyecto agregado exitosamente', 'success');
}

function addProjectToGrid(project) {
  const projectsGrid = document.getElementById('projectsGrid');
  
  const projectCard = document.createElement('div');
  projectCard.className = 'project-card';
  projectCard.setAttribute('data-project-id', project.id);
  
  // Get file extension for icon
  const fileExtension = '.' + project.documentName.split('.').pop().toLowerCase();
  const iconClass = fileExtension === '.pdf' ? 'fas fa-file-pdf' : 'fas fa-file-word';
  const iconColor = fileExtension === '.pdf' ? '#e74c3c' : '#3498db';
  
  projectCard.innerHTML = `
    <div class="project-image">
      <div class="document-preview">
        <i class="${iconClass}" style="color: ${iconColor}; font-size: 4rem;"></i>
        <h4>${project.documentName}</h4>
      </div>
      <div class="project-overlay">
        <div class="project-links">
          <a href="${project.documentUrl}" download="${project.documentName}" class="project-link">
            <i class="fas fa-download"></i>
          </a>
          <button class="project-link admin-action show" onclick="editProject(${project.id})">
            <i class="fas fa-edit"></i>
          </button>
          <button class="project-link admin-action show" onclick="viewProject(${project.id})">
            <i class="fas fa-eye"></i>
          </button>
          <button class="project-link admin-action show" onclick="deleteProject(${project.id})">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
    <div class="project-content">
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      <div class="project-tags">
        ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
      </div>
    </div>
  `;
  
  projectsGrid.appendChild(projectCard);
}

function loadProjectsList() {
  const projectsList = document.getElementById('projectsList');
  const projects = JSON.parse(localStorage.getItem('projects') || '[]');
  
  projectsList.innerHTML = '';
  
  projects.forEach(project => {
    const projectItem = document.createElement('div');
    projectItem.className = 'project-item';
    projectItem.innerHTML = `
      <div class="project-details">
        <h4>${project.title}</h4>
        <div class="project-meta">
          <span><i class="fas fa-calendar"></i> ${new Date(project.createdAt).toLocaleDateString()}</span>
          <span><i class="fas fa-file"></i> ${project.documentName}</span>
        </div>
      </div>
      <div class="project-actions">
        <button class="btn-edit" onclick="editProject(${project.id})">
          <i class="fas fa-edit"></i> Editar
        </button>
        <button class="btn-delete" onclick="deleteProject(${project.id})">
          <i class="fas fa-trash"></i> Eliminar
        </button>
      </div>
    `;
    projectsList.appendChild(projectItem);
  });
  
  // Initialize search functionality
  initializeSearch();
}

function initializeSearch() {
  const searchInput = document.getElementById('searchProjects');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();
      const projectItems = document.querySelectorAll('.project-item');
      
      projectItems.forEach(item => {
        const title = item.querySelector('h4').textContent.toLowerCase();
        const description = item.querySelector('.project-meta').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }
}

function editProject(projectId) {
  const projects = JSON.parse(localStorage.getItem('projects') || '[]');
  const project = projects.find(p => p.id === projectId);
  
  if (project) {
    // Populate form with project data
    document.getElementById('projectTitle').value = project.title;
    document.getElementById('projectDescription').value = project.description;
    document.getElementById('projectTags').value = project.tags.join(', ');
    
    // Show document preview
    const documentPreview = document.getElementById('documentPreview');
    const fileExtension = '.' + project.documentName.split('.').pop().toLowerCase();
    const iconClass = fileExtension === '.pdf' ? 'fas fa-file-pdf' : 'fas fa-file-word';
    const iconColor = fileExtension === '.pdf' ? '#e74c3c' : '#3498db';
    
    documentPreview.innerHTML = `
      <div class="file-info">
        <i class="${iconClass}" style="color: ${iconColor}; font-size: 2rem;"></i>
        <div>
          <span class="file-name">${project.documentName}</span>
        </div>
      </div>
    `;
    documentPreview.classList.add('show');
    
    // Switch to add project tab
    showTab('addProject');
    openAdminModal();
    
    showNotification('Modo edición activado', 'info');
  }
}

function viewProject(projectId) {
  const projects = JSON.parse(localStorage.getItem('projects') || '[]');
  const project = projects.find(p => p.id === projectId);
  
  if (project) {
    showNotification(`Viendo proyecto: ${project.title}`, 'info');
    // In a real app, this would open a detailed view modal
  }
}

function deleteProject(projectId) {
  if (confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
    // Remove from localStorage
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const updatedProjects = projects.filter(p => p.id !== projectId);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    
    // Remove from DOM
    const projectCard = document.querySelector(`[data-project-id="${projectId}"]`);
    if (projectCard) {
      projectCard.remove();
    }
    
    // Reload projects list in admin panel
    loadProjectsList();
    
    showNotification('Proyecto eliminado exitosamente', 'success');
  }
}

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in-up');
    }
  });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
  const animatedElements = document.querySelectorAll('.project-card, .skill-category, .contact-item, .stat');
  animatedElements.forEach(el => observer.observe(el));
  
  // Initialize auth UI
  updateAuthUI();
  
  // Initialize file uploads
  initializeFileUploads();
  
  // Load existing projects from localStorage
  const projects = JSON.parse(localStorage.getItem('projects') || '[]');
  projects.forEach(project => addProjectToGrid(project));
});

// Contact form handling
function handleContactSubmit(event) {
  event.preventDefault();
  
  const form = event.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  
  // Show success message
  showNotification('¡Mensaje enviado con éxito!', 'success');
  
  // Reset form
  form.reset();
}

// Notification system
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span>${message}</span>
      <button onclick="this.parentElement.parentElement.remove()">&times;</button>
    </div>
  `;
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
  `;
  
  document.body.appendChild(notification);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 5000);
}

// Add CSS for notification animation
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .notification-content {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .notification-content button {
    background: none;
    border: none;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
document.head.appendChild(style);

// Project card hover effects
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-10px)';
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0)';
  });
});

// Skill item hover effects
document.querySelectorAll('.skill-item').forEach(item => {
  item.addEventListener('mouseenter', () => {
    item.style.transform = 'translateY(-5px)';
  });
  
  item.addEventListener('mouseleave', () => {
    item.style.transform = 'translateY(0)';
  });
});

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.innerHTML = '';
  
  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  
  type();
}

// Initialize typing effect when page loads
document.addEventListener('DOMContentLoaded', () => {
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    const originalText = heroTitle.textContent;
    typeWriter(heroTitle, originalText, 50);
  }
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector('.hero');
  if (hero) {
    const rate = scrolled * -0.5;
    hero.style.transform = `translateY(${rate}px)`;
  }
});

// Active navigation link highlighting
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (window.pageYOffset >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveNavLink);

// Add active link styles
const activeLinkStyle = document.createElement('style');
activeLinkStyle.textContent = `
  .nav-link.active {
    color: #667eea !important;
  }
  
  .nav-link.active::after {
    width: 100% !important;
  }
`;
document.head.appendChild(activeLinkStyle);

// Lazy loading for images
function lazyLoadImages() {
  const images = document.querySelectorAll('img[src]');
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.style.opacity = '1';
        observer.unobserve(img);
      }
    });
  });
  
  images.forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.3s ease';
    imageObserver.observe(img);
  });
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Back to top button
function createBackToTopButton() {
  const button = document.createElement('button');
  button.innerHTML = '<i class="fas fa-arrow-up"></i>';
  button.className = 'back-to-top';
  button.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: none;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    transition: all 0.3s ease;
    z-index: 1000;
  `;
  
  button.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  button.addEventListener('mouseenter', () => {
    button.style.transform = 'translateY(-3px)';
    button.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
  });
  
  button.addEventListener('mouseleave', () => {
    button.style.transform = 'translateY(0)';
    button.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
  });
  
  document.body.appendChild(button);
  
  // Show/hide button based on scroll position
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      button.style.display = 'flex';
    } else {
      button.style.display = 'none';
    }
  });
}

// Initialize back to top button
document.addEventListener('DOMContentLoaded', createBackToTopButton);

// Preloader
function createPreloader() {
  const preloader = document.createElement('div');
  preloader.className = 'preloader';
  preloader.innerHTML = `
    <div class="preloader-content">
      <div class="spinner"></div>
      <p>Cargando...</p>
    </div>
  `;
  
  preloader.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    transition: opacity 0.5s ease;
  `;
  
  const preloaderContent = preloader.querySelector('.preloader-content');
  preloaderContent.style.cssText = `
    text-align: center;
    color: white;
  `;
  
  const spinner = preloader.querySelector('.spinner');
  spinner.style.cssText = `
    width: 50px;
    height: 50px;
    border: 3px solid rgba(255,255,255,0.3);
    border-top: 3px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  `;
  
  const spinnerAnimation = document.createElement('style');
  spinnerAnimation.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(spinnerAnimation);
  
  document.body.appendChild(preloader);
  
  // Hide preloader after page loads
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.remove();
      }, 500);
    }, 1000);
  });
}

// Initialize preloader
document.addEventListener('DOMContentLoaded', createPreloader);

// Event Listeners for Login/Logout buttons
document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const adminNavLink = document.querySelector('.admin-nav');
  
  if (loginBtn) {
    loginBtn.addEventListener('click', openLoginModal);
  }
  
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
  
  if (adminNavLink) {
    adminNavLink.addEventListener('click', (e) => {
      e.preventDefault();
      openAdminModal();
    });
  }
  
  // Close modals when clicking outside
  window.addEventListener('click', (event) => {
    const loginModal = document.getElementById('loginModal');
    const adminModal = document.getElementById('adminModal');
    
    if (event.target === loginModal) {
      closeLoginModal();
    }
    
    if (event.target === adminModal) {
      closeAdminModal();
    }
  });
}); 