// =====================
// Global Variables
// =====================
let cart = [];
const cartCountElements = document.querySelectorAll('.cart-count');

// Add preloader-active class to html element initially
document.documentElement.classList.add('preloader-active');

//when user press or click refeash or close the page, scroll to top
// This ensures the page always starts at the top when reloaded or closed
window.onbeforeunload = function() {
    window.scrollTo(0, 0);
};

// =====================
// Initialization
// =====================
document.addEventListener('DOMContentLoaded', function() {
    // Load cart from localStorage first
    loadCartFromStorage();
    
    // Then initialize all other components
    initPreloader();
    initScrollProgress();
    initMobileMenu();
    initFloatingAnimations();
    initScrollAnimations();
    initSmoothScrolling();
    initBackToTop();
    initFloatingCTA();
    initProductCardHover();
    initNewsletterForm();
    initFloatingButtons();
    initParallaxEffect();
    initTeaLeafInteraction();
    initPageNavigation();
    initAddToCartButtons();
    
    // Update cart count after everything is loaded
    updateCartCount();
});

// =====================
// Cart Storage Functions
// =====================

function loadCartFromStorage() {
    try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            console.log('Cart loaded from localStorage:', cart);
        } else {
            cart = [];
            console.log('No cart found in localStorage, initializing empty cart');
        }
    } catch (e) {
        console.error('Error loading cart from localStorage:', e);
        cart = [];
    }
}

function saveCartToStorage() {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
        console.log('Cart saved to localStorage:', cart);
    } catch (e) {
        console.error('Error saving cart to localStorage:', e);
    }
}

// =====================
// Component Initializers
// =====================

function initPreloader() {
    window.addEventListener('load', function() {
        const preloader = document.getElementById('preloader');
        setTimeout(() => {
            preloader.classList.add('fade-out');
            
            // Remove preloader-active class to show scrollbar
            document.documentElement.classList.remove('preloader-active');
            
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 1500);
    });
}

function initScrollProgress() {
    window.addEventListener('scroll', function() {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollProgress = (scrollTop / scrollHeight) * 100;
        document.getElementById('progressBar').style.width = scrollProgress + '%';
    });
}

function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.innerHTML = navLinks.classList.contains('active') ? 
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });
}

function initFloatingAnimations() {
    // Floating Tea Leaves
    const teaLeavesContainer = document.getElementById('teaLeaves');
    for (let i = 0; i < 20; i++) {
        const leaf = document.createElement('div');
        leaf.classList.add('tea-leaf');
        leaf.style.left = Math.random() * 100 + 'vw';
        leaf.style.top = Math.random() * 100 + 'vh';
        leaf.style.width = (Math.random() * 20 + 20) + 'px';
        leaf.style.height = (Math.random() * 20 + 20) + 'px';
        leaf.style.animationDuration = (Math.random() * 15 + 10) + 's';
        leaf.style.animationDelay = Math.random() * 5 + 's';
        leaf.style.transform = `rotate(${Math.random() * 360}deg)`;
        teaLeavesContainer.appendChild(leaf);
    }

    // Floating Bubbles
    const bubblesContainer = document.getElementById('bubbles');
    for (let i = 0; i < 25; i++) {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        bubble.style.left = Math.random() * 100 + 'vw';
        bubble.style.top = Math.random() * 100 + 'vh';
        const size = Math.random() * 30 + 10;
        bubble.style.width = size + 'px';
        bubble.style.height = size + 'px';
        bubble.style.animationDuration = (Math.random() * 20 + 10) + 's';
        bubble.style.animationDelay = Math.random() * 5 + 's';
        bubble.style.opacity = Math.random() * 0.5 + 0.1;
        bubblesContainer.appendChild(bubble);
    }
}

function initScrollAnimations() {
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                
                if (entry.target.id === 'aboutTitle') {
                    animateCounters();
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = [
        document.getElementById('aboutTitle'),
        document.getElementById('aboutImage'),
        document.getElementById('aboutText'),
        document.getElementById('productsTitle'),
        document.getElementById('featuredImage'),
        document.getElementById('featuredContent'),
        document.getElementById('testimonialsTitle'),
        document.getElementById('newsletter'),
        ...document.querySelectorAll('.product-card'),
        ...document.querySelectorAll('.testimonial-card')
    ];

    animatedElements.forEach(element => {
        if (element) observer.observe(element);
    });
}

function animateCounters() {
    const stat1 = document.getElementById('stat1');
    const stat2 = document.getElementById('stat2');
    const stat3 = document.getElementById('stat3');

    const target1 = 42;
    const target2 = 13;
    const target3 = 8500;

    let count1 = 0;
    let count2 = 0;
    let count3 = 0;

    const duration = 2000;
    const interval = 20;
    const steps = duration / interval;
    const increment1 = target1 / steps;
    const increment2 = target2 / steps;
    const increment3 = target3 / steps;

    const counter = setInterval(() => {
        count1 += increment1;
        count2 += increment2;
        count3 += increment3;
        
        stat1.textContent = Math.floor(count1);
        stat2.textContent = Math.floor(count2);
        stat3.textContent = Math.floor(count3);
        
        if (count1 >= target1 && count2 >= target2 && count3 >= target3) {
            stat1.textContent = target1 + '+';
            stat2.textContent = target2 + '+';
            stat3.textContent = target3 + '+';
            clearInterval(counter);
        }
    }, interval);
}

function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Account for fixed header height
                const offset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navLinks = document.getElementById('navLinks');
                const menuToggle = document.getElementById('menuToggle');
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
        });
    });
}

function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function initFloatingCTA() {
    const floatingCta = document.getElementById('floatingCta');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            floatingCta.classList.add('visible');
        } else {
            floatingCta.classList.remove('visible');
        }
    });
}

function initProductCardHover() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const angleX = (y - centerY) / 20;
            const angleY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-10px) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
    });
}

function initNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = newsletterForm.querySelector('button');
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
            submitBtn.style.backgroundColor = '#4CAF50';
            
            setTimeout(() => {
                submitBtn.innerHTML = 'Subscribe <i class="fas fa-paper-plane"></i>';
                submitBtn.style.backgroundColor = '';
                newsletterForm.reset();
            }, 2000);
        });
    }
}

function initFloatingButtons() {
    // WhatsApp button
    document.getElementById('floatingWhatsapp').addEventListener('click', () => {
        window.open('https://wa.me/911234567890', '_blank');
    });

    // Cart button
    document.getElementById('floatingCart').addEventListener('click', () => {
        if (cart.length > 0) {
            window.location.href = 'cart.html';
        } else {
            showNotification('Your cart is empty. Add some teas first!');
        }
    });
}

function initParallaxEffect() {
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        window.addEventListener('scroll', () => {
            const scrollValue = window.scrollY;
            heroImage.style.transform = `translateX(100px) rotate(0deg) translateY(${scrollValue * 0.2}px)`;
        });
    }
}

function initTeaLeafInteraction() {
    document.addEventListener('mousemove', (e) => {
        const leaves = document.querySelectorAll('.tea-leaf');
        leaves.forEach(leaf => {
            const x = (e.clientX / window.innerWidth) * 20 - 10;
            const y = (e.clientY / window.innerHeight) * 20 - 10;
            leaf.style.transform = `translate(${x}px, ${y}px) rotate(${x}deg)`;
        });
    });
}

function initPageNavigation() {
    const pageNav = document.getElementById('pageNav');
    const pageNavItems = document.querySelectorAll('.page-nav-item');
    const sections = ['home', 'about', 'products', 'featured', 'testimonials', 'cta'];

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            pageNav.classList.add('visible');
        } else {
            pageNav.classList.remove('visible');
        }

        // Highlight current section in page nav
        sections.forEach((section, index) => {
            const element = document.getElementById(section);
            if (element) {
                const rect = element.getBoundingClientRect();
                if (rect.top <= 150 && rect.bottom >= 150) {
                    pageNavItems.forEach(item => item.classList.remove('active'));
                    pageNavItems[index].classList.add('active');
                }
            }
        });
    });

    pageNavItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            const section = document.getElementById(sections[index]);
            if (section) {
                window.scrollTo({
                    top: section.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// =====================
// Cart Functionality
// =====================

function initAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const product = {
                name: productCard.querySelector('.product-title').textContent,
                price: productCard.querySelector('.product-price').textContent,
                image: productCard.querySelector('.product-image img').src,
                quantity: 1
            };
            
            // Check if product already exists in cart
            const existingItemIndex = cart.findIndex(item => 
                item.name === product.name && item.price === product.price
            );
            
            if (existingItemIndex >= 0) {
                // If exists, increase quantity
                cart[existingItemIndex].quantity += 1;
            } else {
                // Otherwise add new item
                cart.push(product);
            }
            
            saveCartToStorage();
            
            // Show notification
            showNotification(`${product.name} added to cart`);
            
            // Update cart count
            updateCartCount();
        });
    });
}

function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    cartCountElements.forEach(element => {
        element.textContent = totalItems;
        element.style.display = totalItems > 0 ? 'flex' : 'none';
    });
}

function showNotification(message) {
    // Remove any existing notifications first
    const existingNotifications = document.querySelectorAll('.custom-notification');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = 'custom-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle" style="color: #4CAF50;"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'fadeInUp 0.5s ease reverse';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}
