// Main JavaScript file for Abundant Life Laboratory website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initMobileNavigation();
    initContactForm();
    initSmoothScrolling();
    initAnimationOnScroll();
    
    // Page-specific initializations
    if (window.location.pathname.includes('contact.html')) {
        initContactPage();
    }
});

// Mobile Navigation Toggle
function initMobileNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// Contact Form Handling
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            handleFormSubmission(this);
        });
    }
}

function handleFormSubmission(form) {
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Validate form
    if (!validateForm(form)) {
        showFormMessage('Please fill in all required fields correctly.', 'error');
        return;
    }
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="loading"></span> Sending...';
    
    // Simulate form submission (replace with actual endpoint)
    setTimeout(() => {
        // Reset form and show success message
        form.reset();
        submitButton.disabled = false;
        submitButton.textContent = originalText;
        showFormMessage('Thank you for your message! We will get back to you within 24 hours.', 'success');
        
        // Log form data (for development purposes)
        console.log('Form submitted with data:', Object.fromEntries(formData));
    }, 2000);
}

function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        const value = field.value.trim();
        
        // Remove existing error styling
        field.classList.remove('error');
        
        if (!value) {
            field.classList.add('error');
            isValid = false;
        } else if (field.type === 'email' && !isValidEmail(value)) {
            field.classList.add('error');
            isValid = false;
        }
    });
    
    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFormMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.form-success, .form-error');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message element
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'success' ? 'form-success' : 'form-error';
    messageDiv.textContent = message;
    
    // Insert message before the form
    const form = document.getElementById('contactForm');
    if (form) {
        form.parentNode.insertBefore(messageDiv, form);
        
        // Auto-remove message after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
        
        // Scroll to message
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Smooth Scrolling for Anchor Links
function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                event.preventDefault();
                
                const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Animation on Scroll (Simple Intersection Observer)
function initAnimationOnScroll() {
    const animatedElements = document.querySelectorAll('.feature-card, .service-card, .category-card, .step');
    
    if (!animatedElements.length) return;
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Contact Page Specific Functions
function initContactPage() {
    // Add click-to-call functionality for phone numbers
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Track phone clicks (for analytics)
            console.log('Phone number clicked:', this.getAttribute('href'));
        });
    });
    
    // Add email link functionality
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Track email clicks (for analytics)
            console.log('Email link clicked:', this.getAttribute('href'));
        });
    });
}

// Utility Functions
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Header scroll behavior
window.addEventListener('scroll', debounce(function() {
    const header = document.querySelector('.header');
    if (header) {
        if (window.scrollY > 100) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.backgroundColor = 'white';
            header.style.backdropFilter = 'none';
        }
    }
}, 10));

// Keyboard navigation support
document.addEventListener('keydown', function(event) {
    // Escape key closes mobile menu
    if (event.key === 'Escape') {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (navToggle && navMenu) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});

// Service worker registration (for potential future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Service worker would be registered here for offline functionality
        console.log('Service Worker support detected');
    });
}

// Performance monitoring (basic)
window.addEventListener('load', function() {
    if ('performance' in window) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log('Page load time:', loadTime + 'ms');
    }
});

// Error handling for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            // Handle broken images gracefully
            this.style.display = 'none';
            console.warn('Failed to load image:', this.src);
        });
    });
});

// Analytics helper function (placeholder for future integration)
function trackEvent(category, action, label) {
    console.log('Analytics Event:', { category, action, label });
    
    // Future Google Analytics or other tracking service integration
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label
        });
    }
}

// Form field enhancements
document.addEventListener('DOMContentLoaded', function() {
    // Add floating label effect to form inputs
    const formInputs = document.querySelectorAll('input, textarea, select');
    
    formInputs.forEach(input => {
        // Add focus/blur event listeners for enhanced UX
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Check if input has value on page load
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
});

// Export functions for potential testing
window.LabApp = {
    validateForm,
    isValidEmail,
    showFormMessage,
    trackEvent
};
