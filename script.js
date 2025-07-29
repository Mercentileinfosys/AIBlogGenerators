// DOM Elements
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const themeToggle = document.getElementById('theme-toggle');

// Mobile Navigation Toggle
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        
        // Add haptic feedback on mobile
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
    });
}

// Advanced Options Toggle
const advancedToggle = document.querySelector('.advanced-toggle');
const advancedOptions = document.querySelector('.advanced-options');

if (advancedToggle && advancedOptions) {
    advancedToggle.addEventListener('click', () => {
        advancedOptions.classList.toggle('open');
        
        // Add haptic feedback
        if ('vibrate' in navigator) {
            navigator.vibrate(30);
        }
        
        // Track analytics
        trackEvent('advanced_options_toggle', { 
            isOpen: advancedOptions.classList.contains('open') 
        });
    });
}

// Close mobile menu when clicking on links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Theme Toggle Functionality
let currentTheme = localStorage.getItem('theme') || 'light';

// Apply saved theme on load
document.documentElement.setAttribute('data-theme', currentTheme);
if (themeToggle) {
    themeToggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);
        localStorage.setItem('theme', currentTheme);
        themeToggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
        
        // Add bounce animation
        themeToggle.style.transform = 'scale(1.2)';
        setTimeout(() => {
            themeToggle.style.transform = 'scale(1)';
        }, 150);
        
        // Add haptic feedback
        if ('vibrate' in navigator) {
            navigator.vibrate(30);
        }
    });
}

// FAQ Accordion Functionality
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const isActive = faqItem.classList.contains('active');
        
        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Toggle current item
        if (!isActive) {
            faqItem.classList.add('active');
        }
        
        // Add haptic feedback
        if ('vibrate' in navigator) {
            navigator.vibrate(25);
        }
    });
});

// Smooth Scrolling for Anchor Links
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

// Navbar Scroll Effect
let lastScrollY = window.scrollY;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    if (navbar) {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        // Add background opacity based on scroll
        const opacity = Math.min(currentScrollY / 100, 0.95);
        navbar.style.backgroundColor = `rgba(${currentTheme === 'dark' ? '15, 23, 42' : '255, 255, 255'}, ${opacity})`;
    }
    
    lastScrollY = currentScrollY;
});

// Intersection Observer for Animations
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

// Observe elements for animation
document.querySelectorAll('.feature-card, .step, .benefit-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Toast Notification System
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-in forwards';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
    
    // Add haptic feedback
    if ('vibrate' in navigator) {
        navigator.vibrate(type === 'error' ? [100, 50, 100] : 50);
    }
}

// Copy to Clipboard Function
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Content copied to clipboard!');
        }).catch(() => {
            fallbackCopyTextToClipboard(text);
        });
    } else {
        fallbackCopyTextToClipboard(text);
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showToast('Content copied to clipboard!');
    } catch (err) {
        showToast('Failed to copy content', 'error');
    }
    
    document.body.removeChild(textArea);
}

// Word Counter Function
function countWords(text) {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

// Blog Generator Functionality
class BlogGenerator {
    constructor() {
        this.isGenerating = false;
        this.currentWebSocket = null;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const blogForm = document.getElementById('blogForm');
        if (blogForm) {
            blogForm.addEventListener('submit', this.handleFormSubmit.bind(this));
        }

        // Auto-resize textarea
        const topicTextarea = document.getElementById('topic');
        if (topicTextarea) {
            topicTextarea.addEventListener('input', this.autoResizeTextarea);
        }

        // Add action button listeners
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('action-btn')) {
                this.handleActionClick(e.target);
            }
        });
    }

    autoResizeTextarea(e) {
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';
    }

    handleFormSubmit(event) {
        event.preventDefault();

        if (this.isGenerating) {
            this.stopGeneration();
            return;
        }

        const topic = document.getElementById('topic').value.trim();
        const tone = document.getElementById('tone').value;
        const length = document.getElementById('length').value;

        if (!topic) {
            showToast('Please enter a blog topic', 'error');
            document.getElementById('topic').focus();
            return;
        }

        this.startGeneration(topic, tone, length);
    }

    startGeneration(topic, tone, length) {
        this.isGenerating = true;
        const generateBtn = document.querySelector('.generate-btn');
        const output = document.getElementById('output');
        
        // Update button state
        generateBtn.innerHTML = '<span class="loading-spinner"></span>Generating...';
        generateBtn.disabled = true;
        
        // Clear previous output
        output.innerHTML = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Create WebSocket connection
        this.connectWebSocket(topic, tone, length);
        
        // Add haptic feedback
        if ('vibrate' in navigator) {
            navigator.vibrate([50, 25, 50]);
        }
    }

    showTypingIndicator() {
        const output = document.getElementById('output');
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-dots';
        typingIndicator.innerHTML = '<span></span><span></span><span></span>';
        output.appendChild(typingIndicator);
        
        // Auto-scroll to output
        output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    connectWebSocket(topic, tone, length) {
        const substitutedPrompt = `Generate a ${tone} blog post on "${topic}" that is approximately ${length} words long. Include proper headings, subheadings, and make it SEO-optimized with engaging content.`;
        
        try {
            this.currentWebSocket = new WebSocket("wss://backend.buildpicoapps.com/ask_ai_streaming_v2");

            this.currentWebSocket.addEventListener("open", () => {
                this.currentWebSocket.send(
                    JSON.stringify({
                        appId: "economic-light",
                        prompt: substitutedPrompt,
                    })
                );
            });

            this.currentWebSocket.addEventListener("message", (event) => {
                this.handleWebSocketMessage(event.data);
            });

            this.currentWebSocket.addEventListener("close", (event) => {
                this.handleWebSocketClose(event);
            });

            this.currentWebSocket.addEventListener("error", (error) => {
                this.handleWebSocketError(error);
            });

        } catch (error) {
            this.handleWebSocketError(error);
        }
    }

    handleWebSocketMessage(data) {
        const output = document.getElementById('output');
        
        // Remove typing indicator if present
        const typingIndicator = output.querySelector('.typing-dots');
        if (typingIndicator) {
            typingIndicator.remove();
        }
        
        // Append new content
        output.textContent = `${output.textContent}${data}`;
        
        // Update word count
        this.updateWordCount();
        
        // Auto-scroll to bottom
        output.scrollTop = output.scrollHeight;
    }

    handleWebSocketClose(event) {
        this.resetGeneratorState();
        
        if (event.code !== 1000) {
            showToast("Connection lost. Please try again.", 'error');
        } else {
            showToast("Blog post generated successfully!");
            
            // Add completion haptic feedback
            if ('vibrate' in navigator) {
                navigator.vibrate([100, 50, 100, 50, 200]);
            }
        }
    }

    handleWebSocketError(error) {
        console.error('WebSocket error:', error);
        this.resetGeneratorState();
        showToast("Error generating content. Please try again.", 'error');
    }

    stopGeneration() {
        if (this.currentWebSocket) {
            this.currentWebSocket.close();
        }
        this.resetGeneratorState();
        showToast("Generation stopped", 'warning');
    }

    resetGeneratorState() {
        this.isGenerating = false;
        const generateBtn = document.querySelector('.generate-btn');
        
        if (generateBtn) {
            generateBtn.innerHTML = 'Generate Blog Post';
            generateBtn.disabled = false;
        }
        
        // Remove typing indicator
        const typingIndicator = document.querySelector('.typing-dots');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    updateWordCount() {
        const output = document.getElementById('output');
        const wordCountElement = document.querySelector('.word-count');
        
        if (output && wordCountElement) {
            const wordCount = countWords(output.textContent);
            wordCountElement.textContent = `Word count: ${wordCount}`;
        }
    }

    handleActionClick(button) {
        const action = button.dataset.action;
        const output = document.getElementById('output');
        
        switch (action) {
            case 'copy':
                if (output.textContent.trim()) {
                    copyToClipboard(output.textContent);
                } else {
                    showToast('No content to copy', 'warning');
                }
                break;
                
            case 'download':
                this.downloadContent();
                break;
                
            case 'regenerate':
                const topic = document.getElementById('topic').value.trim();
                const tone = document.getElementById('tone').value;
                const length = document.getElementById('length').value;
                
                if (topic) {
                    this.startGeneration(topic, tone, length);
                } else {
                    showToast('Please enter a topic first', 'warning');
                }
                break;
                
            case 'clear':
                this.clearOutput();
                break;
        }
        
        // Add button bounce animation
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
    }

    downloadContent() {
        const output = document.getElementById('output');
        const topic = document.getElementById('topic').value.trim() || 'blog-post';
        
        if (!output.textContent.trim()) {
            showToast('No content to download', 'warning');
            return;
        }
        
        const content = output.textContent;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${topic.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.txt`;
        a.style.display = 'none';
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
        showToast('Content downloaded successfully!');
    }

    clearOutput() {
        const output = document.getElementById('output');
        const wordCountElement = document.querySelector('.word-count');
        
        output.textContent = '';
        if (wordCountElement) {
            wordCountElement.textContent = 'Word count: 0';
        }
        
        showToast('Output cleared');
    }
}

// Performance Optimization: Lazy Loading Images
const lazyImages = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

// Initialize Blog Generator
let blogGenerator;
document.addEventListener('DOMContentLoaded', () => {
    blogGenerator = new BlogGenerator();
    
    // Add typing animation to hero text
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const texts = [
            'Creating amazing blog content...',
            'Generating SEO-optimized posts...',
            'Writing engaging articles...',
            'Crafting professional content...'
        ];
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        function typeWriter() {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                typingText.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingText.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }
            
            let typeSpeed = isDeleting ? 50 : 100;
            
            if (!isDeleting && charIndex === currentText.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typeSpeed = 500;
            }
            
            setTimeout(typeWriter, typeSpeed);
        }
        
        typeWriter();
    }
});

// Service Worker Registration for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to generate
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const generateBtn = document.querySelector('.generate-btn');
        if (generateBtn && !generateBtn.disabled) {
            generateBtn.click();
        }
        e.preventDefault();
    }
    
    // Escape to stop generation
    if (e.key === 'Escape' && blogGenerator && blogGenerator.isGenerating) {
        blogGenerator.stopGeneration();
    }
    
    // Ctrl/Cmd + K to focus on topic input
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        const topicInput = document.getElementById('topic');
        if (topicInput) {
            topicInput.focus();
            topicInput.select();
        }
        e.preventDefault();
    }
});

// Add CSS animations keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOutRight {
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .lazy {
        opacity: 0;
        transition: opacity 0.3s;
    }
    
    .lazy.loaded {
        opacity: 1;
    }
`;
document.head.appendChild(style);

// Analytics and Performance Monitoring
function trackEvent(eventName, eventData = {}) {
    // Add your analytics tracking here
    console.log('Event tracked:', eventName, eventData);
}

// Track page load performance
window.addEventListener('load', () => {
    const loadTime = performance.now();
    trackEvent('page_load', { loadTime: Math.round(loadTime) });
});

// Error Handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    showToast('An unexpected error occurred', 'error');
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    showToast('An unexpected error occurred', 'error');
});

// Online/Offline Status
window.addEventListener('online', () => {
    showToast('Connection restored');
});

window.addEventListener('offline', () => {
    showToast('Connection lost. Some features may not work.', 'warning');
});

// Export functions for use in other modules
window.BlogGeneratorUtils = {
    showToast,
    copyToClipboard,
    countWords,
    trackEvent
};
