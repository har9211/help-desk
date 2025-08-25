// Official Village Help Desk JavaScript Enhancements

class VillageHelpDesk {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupForms();
        this.setupAnimations();
        this.setupChatbot();
        this.setupTranslations();
        this.setupLoadingStates();
    }

    // Navigation and Mobile Menu
    setupNavigation() {
        // Mobile menu toggle
        const menuToggle = document.getElementById('menu-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (menuToggle && navMenu) {
            menuToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                menuToggle.classList.toggle('active');
            });
        }

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
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

        // Active navigation highlighting
        this.highlightActiveNav();
    }

    highlightActiveNav() {
        const currentPath = window.location.pathname;
        document.querySelectorAll('.nav-link').forEach(link => {
            const linkPath = link.getAttribute('href');
            if (linkPath === currentPath ||
                (linkPath !== '/' && currentPath.includes(linkPath))) {
                link.classList.add('active');
            }
        });
    }

    // Form Enhancements
    setupForms() {
        // Enhanced form validation
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                }
            });

            // Real-time validation
            form.querySelectorAll('.form-control').forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearFieldError(input));
            });
        });
    }

    validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('.form-control[required]');

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(input) {
        const value = input.value.trim();
        const type = input.type;
        let isValid = true;
        let errorMessage = '';

        // Clear previous errors
        this.clearFieldError(input);

        // Validation rules
        if (input.required && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        } else if (type === 'email' && value && !this.isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        } else if (type === 'tel' && value && !this.isValidPhone(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }

        if (!isValid) {
            this.showFieldError(input, errorMessage);
        }

        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }

    showFieldError(input, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.cssText = `
            color: var(--danger);
            font-size: 0.875rem;
            margin-top: 0.25rem;
        `;
        errorDiv.textContent = message;

        input.style.borderColor = 'var(--danger)';
        input.parentNode.appendChild(errorDiv);
    }

    clearFieldError(input) {
        input.style.borderColor = '';
        const errorDiv = input.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    // Animation Setup
    setupAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fadeIn');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements with animation class
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });

        // Add animation classes to elements
        this.addAnimationClasses();
    }

    addAnimationClasses() {
        // Add animation classes to various elements
        const sections = document.querySelectorAll('section');
        const cards = document.querySelectorAll('.card');
        const features = document.querySelectorAll('.feature-card');

        sections.forEach((section, index) => {
            section.classList.add('animate-on-scroll');
            section.style.animationDelay = `${index * 0.1}s`;
        });

        cards.forEach((card, index) => {
            card.classList.add('animate-on-scroll');
            card.style.animationDelay = `${index * 0.05}s`;
        });

        features.forEach((feature, index) => {
            feature.classList.add('animate-on-scroll');
            feature.style.animationDelay = `${index * 0.1}s`;
        });
    }

    // Chatbot Enhancements
    setupChatbot() {
        const chatForm = document.querySelector('.chatbot-form');
        if (chatForm) {
            chatForm.addEventListener('submit', (e) => {
                this.handleChatbotSubmit(e);
            });
        }

        // Auto-scroll to bottom of chat window
        this.setupChatScroll();
    }

    handleChatbotSubmit(e) {
        const form = e.target;
        const input = form.querySelector('input[name="query"]');
        const chatWindow = document.querySelector('.chat-window');

        if (input.value.trim()) {
            this.showChatLoading();

            // Simulate typing animation
            setTimeout(() => {
                this.hideChatLoading();
                this.scrollToBottom(chatWindow);
            }, 1000);
        }
    }

    showChatLoading() {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'chat-loading';
        loadingDiv.innerHTML = `
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;

        const chatWindow = document.querySelector('.chat-window');
        chatWindow.appendChild(loadingDiv);
        this.scrollToBottom(chatWindow);
    }

    hideChatLoading() {
        const loadingDiv = document.querySelector('.chat-loading');
        if (loadingDiv) {
            loadingDiv.remove();
        }
    }

    setupChatScroll() {
        const chatWindow = document.querySelector('.chat-window');
        if (chatWindow) {
            // Auto-scroll when new messages are added
            const observer = new MutationObserver(() => {
                this.scrollToBottom(chatWindow);
            });

            observer.observe(chatWindow, { childList: true });
        }
    }

    scrollToBottom(element) {
        element.scrollTop = element.scrollHeight;
    }

    // Translation Setup
    setupTranslations() {
        const translateBtn = document.getElementById('translate-btn');
        const googleTranslateElement = document.getElementById('google_translate_element');

        if (translateBtn && googleTranslateElement) {
            translateBtn.addEventListener('click', () => {
                this.toggleTranslation(googleTranslateElement);
            });
        }
    }

    toggleTranslation(element) {
        if (element.style.display === 'none') {
            element.style.display = 'block';
            this.loadGoogleTranslate();
        } else {
            element.style.display = 'none';
        }
    }

    loadGoogleTranslate() {
        if (!window.google || !window.google.translate) {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            document.body.appendChild(script);
        }
    }

    // Loading States
    setupLoadingStates() {
        // Form submission loading states
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', () => {
                const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
                if (submitBtn) {
                    this.showButtonLoading(submitBtn);
                }
            });
        });
    }

    showButtonLoading(button) {
        const originalText = button.value || button.textContent;
        button.disabled = true;
        button.innerHTML = `
            <span class="loading-spinner"></span>
            Processing...
        `;

        // Store original text for later restoration
        button.setAttribute('data-original-text', originalText);
    }

    hideButtonLoading(button) {
        const originalText = button.getAttribute('data-original-text');
        button.disabled = false;
        button.innerHTML = originalText;
    }

    // Utility Methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Public methods for external use
    showToast(message, type = 'info') {
        this.createToast(message, type);
    }

    createToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: var(--radius-md);
            background: var(--${type});
            color: white;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Google Translate initialization
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,hi,bn,gu,kn,ml,mr,pa,ta,te',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE
    }, 'google_translate_element');
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.villageHelpDesk = new VillageHelpDesk();
});

// Additional utility functions
const Utils = {
    formatDate: (date) => {
        return new Intl.DateTimeFormat('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    },

    formatFileSize: (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    sanitizeInput: (input) => {
        return input.replace(/[<>&"']/g, (char) => {
            const replacements = {
                '<': '<',
                '>': '>',
                '&': '&amp;',
                '"': '"',
                "'": '&#x27;'
            };
            return replacements[char];
        });
    }
};

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { VillageHelpDesk, Utils };
}