// DOM Elements
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contactForm');

// Mobile Navigation Toggle
mobileMenu.addEventListener('click', () => {
   mobileMenu.classList.toggle('active');
   navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on nav links
navLinks.forEach(link => {
   link.addEventListener('click', () => {
       mobileMenu.classList.remove('active');
       navMenu.classList.remove('active');
   });
});

// Smooth scrolling function
function scrollToSection(sectionId) {
   const section = document.getElementById(sectionId);
   if (section) {
       section.scrollIntoView({ 
           behavior: 'smooth',
           block: 'start'
       });
   }
}

// Add active class to nav links based on scroll position
function updateActiveNavLink() {
   const sections = document.querySelectorAll('section');
   const scrollPosition = window.scrollY + 100;

   sections.forEach(section => {
       const sectionTop = section.offsetTop;
       const sectionHeight = section.offsetHeight;
       const sectionId = section.getAttribute('id');
       
       if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
           navLinks.forEach(link => {
               link.classList.remove('active');
               if (link.getAttribute('href') === `#${sectionId}`) {
                   link.classList.add('active');
               }
           });
       }
   });
}

// Navbar background change on scroll
function handleNavbarScroll() {
   const navbar = document.querySelector('.navbar');
   if (window.scrollY > 50) {
       navbar.style.background = 'rgba(255, 255, 255, 0.95)';
       navbar.style.backdropFilter = 'blur(10px)';
   } else {
       navbar.style.background = '#fff';
       navbar.style.backdropFilter = 'none';
   }
}

// Contact form submission
contactForm.addEventListener('submit', (e) => {
   e.preventDefault();
   
   // Get form data
   const formData = new FormData(contactForm);
   const name = formData.get('name');
   const email = formData.get('email');
   const message = formData.get('message');
   
   // Basic validation
   if (!name || !email || !message) {
       showNotification('Please fill in all fields.', 'error');
       return;
   }
   
   if (!isValidEmail(email)) {
       showNotification('Please enter a valid email address.', 'error');
       return;
   }
   
   // Simulate form submission
   showNotification('Thank you! Your message has been sent successfully.', 'success');
   contactForm.reset();
});

// Email validation function
function isValidEmail(email) {
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
   // Remove existing notifications
   const existingNotification = document.querySelector('.notification');
   if (existingNotification) {
       existingNotification.remove();
   }
   
   // Create notification element
   const notification = document.createElement('div');
   notification.className = `notification notification-${type}`;
   notification.innerHTML = `
       <span>${message}</span>
       <button class="notification-close">&times;</button>
   `;
   
   // Add notification styles
   notification.style.cssText = `
       position: fixed;
       top: 90px;
       right: 20px;
       background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
       color: white;
       padding: 15px 20px;
       border-radius: 8px;
       box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
       z-index: 10000;
       display: flex;
       align-items: center;
       gap: 10px;
       max-width: 300px;
       animation: slideInRight 0.3s ease;
   `;
   
   // Add animation keyframes if not already added
   if (!document.querySelector('#notification-styles')) {
       const style = document.createElement('style');
       style.id = 'notification-styles';
       style.textContent = `
           @keyframes slideInRight {
               from { transform: translateX(100%); opacity: 0; }
               to { transform: translateX(0); opacity: 1; }
           }
           @keyframes slideOutRight {
               from { transform: translateX(0); opacity: 1; }
               to { transform: translateX(100%); opacity: 0; }
           }
           .notification-close {
               background: none;
               border: none;
               color: white;
               font-size: 18px;
               cursor: pointer;
               padding: 0;
               margin-left: auto;
           }
       `;
       document.head.appendChild(style);
   }
   
   // Add to page
   document.body.appendChild(notification);
   
   // Close button functionality
   const closeBtn = notification.querySelector('.notification-close');
   closeBtn.addEventListener('click', () => {
       notification.style.animation = 'slideOutRight 0.3s ease';
       setTimeout(() => notification.remove(), 300);
   });
   
   // Auto remove after 5 seconds
   setTimeout(() => {
       if (notification.parentNode) {
           notification.style.animation = 'slideOutRight 0.3s ease';
           setTimeout(() => notification.remove(), 300);
       }
   }, 5000);
}

// Intersection Observer for animations
function setupScrollAnimations() {
   const observerOptions = {
       threshold: 0.1,
       rootMargin: '0px 0px -50px 0px'
   };
   
   const observer = new IntersectionObserver((entries) => {
       entries.forEach(entry => {
           if (entry.isIntersecting) {
               entry.target.style.opacity = '1';
               entry.target.style.transform = 'translateY(0)';
           }
       });
   }, observerOptions);
   
   // Observe elements that should animate on scroll
   const animatedElements = document.querySelectorAll('.feature, .service-card, .contact-info, .contact-form');
   animatedElements.forEach(el => {
       el.style.opacity = '0';
       el.style.transform = 'translateY(30px)';
       el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
       observer.observe(el);
   });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
   setupScrollAnimations();
   
   // Add scroll event listeners
   window.addEventListener('scroll', () => {
       updateActiveNavLink();
       handleNavbarScroll();
   });
   
   // Add click events to all nav links for smooth scrolling
   navLinks.forEach(link => {
       link.addEventListener('click', (e) => {
           e.preventDefault();
           const targetId = link.getAttribute('href').substring(1);
           scrollToSection(targetId);
       });
   });
   
   // Add keyboard navigation
   document.addEventListener('keydown', (e) => {
       if (e.key === 'Escape') {
           mobileMenu.classList.remove('active');
           navMenu.classList.remove('active');
       }
   });
});

// Service worker registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
   window.addEventListener('load', () => {
       // This would register a service worker if we had one
       // navigator.serviceWorker.register('/sw.js');
   });
}

// Add some fun interactive features
function addEasterEgg() {
   let clickCount = 0;
   const logo = document.querySelector('.nav-logo h2');
   
   logo.addEventListener('click', () => {
       clickCount++;
       if (clickCount === 5) {
           showNotification('🎉 You found the easter egg! Thanks for exploring iBoxen!', 'success');
           logo.style.animation = 'bounce 0.5s ease';
           setTimeout(() => {
               logo.style.animation = '';
               clickCount = 0;
           }, 500);
       }
   });
}

// Initialize easter egg
document.addEventListener('DOMContentLoaded', addEasterEgg);

// Export functions for testing (if in Node.js environment)
if (typeof module !== 'undefined' && module.exports) {
   module.exports = {
       scrollToSection,
       isValidEmail,
       showNotification
   };
}