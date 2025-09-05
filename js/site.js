/**
 * site.js - Main JavaScript file for Certified Texas Plumbing
 * Handles navbar toggle, smooth scroll, sticky header, animations, and forms
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initNavbar();
  initSmoothScroll();
  initScrollAnimations();
  initForms();
  initFaqAccordion();
});

/**
 * Initialize FAQ Accordion functionality
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  if (faqItems.length > 0) {
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      
      question.addEventListener('click', () => {
        // Close all other items
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
          }
        });
        
        // Toggle current item
        item.classList.toggle('active');
      });
    });
  }
}

/**
 * Initialize Navbar functionality
 * - Mobile menu toggle
 * - Sticky header on scroll
 * - Active link highlighting
 */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const navbarToggle = document.querySelector('.navbar-toggle');
  const navbarMenu = document.querySelector('.navbar-menu');
  const navbarOverlay = document.querySelector('.navbar-overlay');
  const navbarClose = document.querySelector('.navbar-close');
  const navLinks = document.querySelectorAll('.navbar-link');
  
  // Toggle mobile menu
  if (navbarToggle && navbarMenu && navbarOverlay) {
    navbarToggle.addEventListener('click', function() {
      navbarMenu.classList.add('active');
      navbarOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
    
    // Close mobile menu when clicking the overlay
    navbarOverlay.addEventListener('click', closeMenu);
    
    // Close mobile menu when clicking the close button
    if (navbarClose) {
      navbarClose.addEventListener('click', closeMenu);
    }
    
    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });
    
    function closeMenu() {
      navbarMenu.classList.remove('active');
      navbarOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
  
  // Sticky header on scroll
  if (navbar) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }
  
  // Set active link based on current page
  const currentLocation = window.location.pathname;
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (currentLocation.includes(linkPath) && linkPath !== '/') {
      link.classList.add('active');
    } else if (currentLocation === '/' && linkPath === '/') {
      link.classList.add('active');
    }
  });
}

/**
 * Initialize Smooth Scroll for anchor links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Initialize Scroll Animations using Intersection Observer
 * Adds 'visible' class to elements with animation classes when they enter viewport
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
  
  if (animatedElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Once the animation is triggered, we don't need to observe it anymore
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
      observer.observe(element);
    });
  }
}

/**
 * Initialize Form functionality
 * - Form validation
 * - Form submission handling
 * - File upload preview
 */
function initForms() {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    // Form validation
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      let isValid = true;
      const requiredFields = form.querySelectorAll('[required]');
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('is-invalid');
          
          // Add error message if it doesn't exist
          let errorMessage = field.nextElementSibling;
          if (!errorMessage || !errorMessage.classList.contains('error-message')) {
            errorMessage = document.createElement('div');
            errorMessage.classList.add('error-message');
            errorMessage.style.color = 'var(--cta)';
            errorMessage.style.fontSize = '0.875rem';
            errorMessage.style.marginTop = '0.25rem';
            errorMessage.textContent = 'This field is required';
            field.parentNode.insertBefore(errorMessage, field.nextSibling);
          }
        } else {
          field.classList.remove('is-invalid');
          
          // Remove error message if it exists
          const errorMessage = field.nextElementSibling;
          if (errorMessage && errorMessage.classList.contains('error-message')) {
            errorMessage.remove();
          }
        }
      });
      
      // If form is valid, submit it
      if (isValid) {
        // In a real implementation, you would send the form data to a server
        // For now, we'll just show a success message
        const formData = new FormData(form);
        const formValues = {};
        
        for (let [key, value] of formData.entries()) {
          formValues[key] = value;
        }
        
        console.log('Form submitted:', formValues);
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.classList.add('alert', 'alert-success');
        successMessage.style.backgroundColor = '#d4edda';
        successMessage.style.color = '#155724';
        successMessage.style.padding = '1rem';
        successMessage.style.borderRadius = 'var(--radius-sm)';
        successMessage.style.marginBottom = '1rem';
        successMessage.textContent = 'Thank you for your message! We will get back to you soon.';
        
        form.prepend(successMessage);
        form.reset();
        
        // Remove success message after 5 seconds
        setTimeout(() => {
          successMessage.remove();
        }, 5000);
      }
    });
    
    // Clear validation errors when user types
    const formFields = form.querySelectorAll('input, textarea, select');
    formFields.forEach(field => {
      field.addEventListener('input', function() {
        if (field.value.trim()) {
          field.classList.remove('is-invalid');
          
          // Remove error message if it exists
          const errorMessage = field.nextElementSibling;
          if (errorMessage && errorMessage.classList.contains('error-message')) {
            errorMessage.remove();
          }
        }
      });
    });
    
    // File upload preview
    const fileUpload = form.querySelector('.file-upload-input');
    if (fileUpload) {
      const filePreview = form.querySelector('.file-upload-preview');
      const filePreviewName = form.querySelector('.file-upload-preview-name');
      const filePreviewRemove = form.querySelector('.file-upload-preview-remove');
      
      fileUpload.addEventListener('change', function() {
        if (this.files && this.files[0]) {
          const fileName = this.files[0].name;
          filePreviewName.textContent = fileName;
          filePreview.classList.add('active');
        }
      });
      
      if (filePreviewRemove) {
        filePreviewRemove.addEventListener('click', function() {
          fileUpload.value = '';
          filePreview.classList.remove('active');
        });
      }
    }
  });
}