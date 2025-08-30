// Village Help Desk - Common JavaScript Functions

// API Base URL
const API_BASE_URL = '/api';

// Authentication functions
class AuthService {
    static getToken() {
        return localStorage.getItem('userToken');
    }

    static setToken(token) {
        localStorage.setItem('userToken', token);
    }

    static removeToken() {
        localStorage.removeItem('userToken');
    }

    static isAuthenticated() {
        return !!this.getToken();
    }

    static async getCurrentUser() {
        const token = this.getToken();
        if (!token) return null;

        try {
            const response = await fetch(`${API_BASE_URL}/auth/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                return data.data;
            } else {
                this.removeToken();
                return null;
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
            return null;
        }
    }

    static async logout() {
        try {
            await fetch(`${API_BASE_URL}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.getToken()}`
                }
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.removeToken();
            window.location.href = 'login.html';
        }
    }
}

// API Service
class ApiService {
    static async request(endpoint, options = {}) {
        const token = AuthService.getToken();
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
                ...options.headers
            }
        };

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...defaultOptions,
                ...options
            });

            if (response.status === 401) {
                AuthService.removeToken();
                window.location.href = 'login.html';
                return null;
            }

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'API request failed');
            }

            return data;
        } catch (error) {
            console.error('API Request error:', error);
            throw error;
        }
    }

    // Auth endpoints
    static async login(credentials) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    }

    static async register(userData) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    // Other API endpoints would be added here as needed
}

// Form validation utilities
class FormValidator {
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static validatePassword(password) {
        return password.length >= 8;
    }

    static validateRequired(value) {
        return value && value.trim().length > 0;
    }

    static validatePhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return !phone || phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }

    static showError(element, message) {
        const formGroup = element.closest('.form-group');
        if (!formGroup) return;

        formGroup.classList.add('error');
        
        let errorElement = formGroup.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message form-text error';
            formGroup.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }

    static clearError(element) {
        const formGroup = element.closest('.form-group');
        if (!formGroup) return;

        formGroup.classList.remove('error');
        const errorElement = formGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }
}

// UI Utilities
class UIUtils {
    static showLoading(button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner loading"></i> Loading...';
        button.disabled = true;
        return originalText;
    }

    static hideLoading(button, originalText) {
        button.innerHTML = originalText;
        button.disabled = false;
    }

    static showAlert(message, type = 'info', container = document.body) {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} fade-in`;
        alert.innerHTML = `
            ${message}
            <button type="button" class="close-alert" style="float: right; background: none; border: none; cursor: pointer;">
                <i class="fas fa-times"></i>
            </button>
        `;

        container.insertBefore(alert, container.firstChild);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (alert.parentNode) {
                alert.remove();
            }
        }, 5000);

        // Manual close
        alert.querySelector('.close-alert').addEventListener('click', () => {
            alert.remove();
        });
    }

    static formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    static debounce(func, wait) {
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
}

// Local Storage utilities
class StorageService {
    static set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    static get(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    }

    static remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing from localStorage:', error);
        }
    }
}

// Event handling utilities
class EventManager {
    static on(element, event, selector, handler) {
        element.addEventListener(event, function(e) {
            if (e.target.matches(selector)) {
                handler.call(e.target, e);
            }
        });
    }

    static once(element, event, handler) {
        const onceHandler = function(e) {
            handler(e);
            element.removeEventListener(event, onceHandler);
        };
        element.addEventListener(event, onceHandler);
    }
}

// Responsive utilities
class ResponsiveUtils {
    static isMobile() {
        return window.innerWidth <= 768;
    }

    static isTablet() {
        return window.innerWidth > 768 && window.innerWidth <= 1024;
    }

    static isDesktop() {
        return window.innerWidth > 1024;
    }

    static onResize(callback) {
        let ticking = false;
        
        const update = () => {
            callback();
            ticking = false;
        };
        
        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(update);
                ticking = true;
            }
        };
        
        window.addEventListener('resize', requestTick);
        
        // Return cleanup function
        return () => window.removeEventListener('resize', requestTick);
    }
}

// News Service
class NewsService {
    static async getNews(category = 'all', page = 1, limit = 10) {
        try {
            const params = new URLSearchParams();
            if (category !== 'all') params.append('category', category);
            params.append('page', page);
            params.append('limit', limit);
            
            const response = await ApiService.request(`/news?${params}`);
            return response.data || [];
        } catch (error) {
            console.error('Error fetching news:', error);
            throw error;
        }
    }

    static async searchNews(query, category = 'all') {
        try {
            const params = new URLSearchParams();
            params.append('q', query);
            if (category !== 'all') params.append('category', category);
            
            const response = await ApiService.request(`/news/search?${params}`);
            return response.data || [];
        } catch (error) {
            console.error('Error searching news:', error);
            throw error;
        }
    }

    static getBookmarkedNews() {
        return StorageService.get('bookmarkedNews') || [];
    }

    static toggleBookmark(article) {
        const bookmarked = this.getBookmarkedNews();
        const existingIndex = bookmarked.findIndex(a => a.id === article.id);
        
        if (existingIndex > -1) {
            bookmarked.splice(existingIndex, 1);
        } else {
            bookmarked.push(article);
        }
        
        StorageService.set('bookmarkedNews', bookmarked);
        return existingIndex === -1; // Returns true if bookmarked, false if removed
    }

    static isBookmarked(articleId) {
        const bookmarked = this.getBookmarkedNews();
        return bookmarked.some(a => a.id === articleId);
    }
}

// News Utilities
class NewsUtils {
    static formatArticleDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        const diffMinutes = Math.floor(diffTime / (1000 * 60));

        if (diffMinutes < 1) return 'Just now';
        if (diffMinutes < 60) return `${diffMinutes}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    static highlightText(text, query) {
        if (!query) return text;
        
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    static debounceSearch(func, wait) {
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

    static createPagination(currentPage, totalPages, maxVisible = 5) {
        const pages = [];
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);
        
        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }
        
        if (startPage > 1) {
            pages.push({ page: 1, label: '1' });
            if (startPage > 2) pages.push({ page: null, label: '...' });
        }
        
        for (let i = startPage; i <= endPage; i++) {
            pages.push({ page: i, label: i.toString() });
        }
        
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) pages.push({ page: null, label: '...' });
            pages.push({ page: totalPages, label: totalPages.toString() });
        }
        
        return pages;
    }
}

// Export for global access
window.VillageHelpDesk = {
    AuthService,
    ApiService,
    FormValidator,
    UIUtils,
    StorageService,
    EventManager,
    ResponsiveUtils,
    NewsService,
    NewsUtils
};

// Initialize common functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add loading state to all forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitButton = this.querySelector('button[type="submit"]');
            if (submitButton) {
                const originalText = UIUtils.showLoading(submitButton);
                
                // Store original text for potential restoration
                submitButton.dataset.originalText = originalText;
            }
        });
    });

    // Handle form validation errors
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            FormValidator.clearError(this);
        });
    });

    // Add accessibility features
    document.addEventListener('keydown', function(e) {
        // Escape key closes modals/alerts
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                if (modal.style.display === 'block') {
                    modal.style.display = 'none';
                }
            });
            
            const alerts = document.querySelectorAll('.alert');
            alerts.forEach(alert => alert.remove());
        }
    });

    // Initialize responsive behaviors
    const cleanupResize = ResponsiveUtils.onResize(() => {
        // Add responsive behaviors here
    });

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        cleanupResize();
    });
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    UIUtils.showAlert('An unexpected error occurred. Please try again.', 'error');
});

// Unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    UIUtils.showAlert('An unexpected error occurred. Please try again.', 'error');
    e.preventDefault();
});
