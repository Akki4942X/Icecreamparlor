
// Animate on scroll utility
function animateOnScroll() {
    const fadeEls = document.querySelectorAll('.fade-in, .flavour-card, .special-content, .about-text, .about-img-blob, .contact-card');
    fadeEls.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 60) {
            el.style.animationPlayState = 'running';
            el.style.opacity = 1;
        }
    });
}

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('DOMContentLoaded', () => {
    animateOnScroll();
});

// Floating chat button opens modal
const chatBtn = document.getElementById('open-contact');
const contactModal = document.getElementById('contact-modal');
const closeModal = document.querySelector('.close-modal');

if (chatBtn && contactModal && closeModal) {
  chatBtn.addEventListener('click', () => {
    contactModal.classList.add('active');
  });
  closeModal.addEventListener('click', () => {
    contactModal.classList.remove('active');
  });
  contactModal.addEventListener('click', (e) => {
    if (e.target === contactModal) contactModal.classList.remove('active');
  });
}

// Prevent contact form from reloading page
const contactForm = document.querySelector('.contact-bubble form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for reaching out! We will get back to you soon.');
    contactModal.classList.remove('active');
  });
}

// Animate hero headline and image on load
window.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('.hero-gallery');
  if (hero) {
    hero.classList.add('show');
  }
});
// Flavour Parade arrow scroll
const parade = document.querySelector('.flavour-parade');
const leftArrow = document.querySelector('.flavour-arrow.left');
const rightArrow = document.querySelector('.flavour-arrow.right');
if (parade && leftArrow && rightArrow) {
  leftArrow.addEventListener('click', () => {
    parade.scrollBy({ left: -250, behavior: 'smooth' });
  });
  rightArrow.addEventListener('click', () => {
    parade.scrollBy({ left: 250, behavior: 'smooth' });
  });
 
  // Touch events
  parade.addEventListener('touchstart', (e) => {
    isDown = true;
    startX = e.touches[0].pageX - parade.offsetLeft;
    scrollLeft = parade.scrollLeft;
  });
  parade.addEventListener('touchend', () => {
    isDown = false;
  });
  parade.addEventListener('touchmove', (e) => {
    if (!isDown) return;
    const x = e.touches[0].pageX - parade.offsetLeft;
    const walk = (x - startX) * 1.5;
    parade.scrollLeft = scrollLeft - walk;
  });
}

// Animate modal opening
if (contactModal) {
  contactModal.addEventListener('transitionend', () => {
    if (contactModal.classList.contains('active')) {
      contactModal.querySelector('.glassy-modal').style.animation = 'fadein 0.7s';
    }
  });
}

// Function declarations (utility, confetti, etc.) can remain outside
function showToast(msg) {
  let toast = document.createElement('div');
  toast.className = 'cart-toast';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => { toast.classList.add('show'); }, 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 1800);
}
function showConfetti() {
  const confetti = document.createElement('div');
  confetti.className = 'confetti-container';
  for (let i = 0; i < 40; i++) {
    const dot = document.createElement('div');
    dot.className = 'confetti-dot';
    dot.style.left = Math.random() * 100 + '%';
    dot.style.background = `hsl(${Math.random()*360},90%,70%)`;
    dot.style.animationDelay = (Math.random()*0.7)+'s';
    confetti.appendChild(dot);
  }
  document.body.appendChild(confetti);
  setTimeout(() => confetti.remove(), 1800);
}

// Main interactive logic

// Remove all DOMContentLoaded and direct event code below, and wrap in one block:
document.addEventListener('DOMContentLoaded', function() {
  // --- Dark Mode Toggle Logic ---
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  if (darkModeToggle) {
    const darkModeIcon = darkModeToggle.querySelector('i');
    function setDarkMode(on) {
      document.body.classList.toggle('dark-mode', on);
      darkModeIcon.className = on ? 'fa fa-sun' : 'fa fa-moon';
      localStorage.setItem('darkMode', on ? '1' : '0');
    }
    darkModeToggle.addEventListener('click', () => {
      const isDark = !document.body.classList.contains('dark-mode');
      setDarkMode(isDark);
    });
    if (localStorage.getItem('darkMode') === '1') setDarkMode(true);
  }

  // --- Add to Cart Functionality ---
  let cart = [];
  const cartIcon = document.querySelector('.cart-icon');
  function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) cartCount.textContent = count;
  }
  const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
  addToCartBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const flavour = this.getAttribute('data-flavour');
      const price = parseInt(this.getAttribute('data-price'));
      const existing = cart.find(item => item.flavour === flavour);
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ flavour, price, qty: 1 });
      }
      updateCartCount();
      showToast(`${flavour} added to cart!`);
    });
  });

  // --- Cart Modal Logic ---
  const cartModal = document.getElementById('cart-modal');
  const closeCartModalBtn = document.querySelector('.close-cart-modal');
  const cartModalBackdrop = document.querySelector('.cart-modal-backdrop');
  const cartItemsDiv = document.querySelector('.cart-items');
  const cartTotalSpan = document.querySelector('.cart-total');
  const checkoutBtn = document.querySelector('.checkout-btn');
  function renderCart() {
    cartItemsDiv.innerHTML = '';
    let total = 0;
    if (cart.length === 0) {
      cartItemsDiv.innerHTML = '<div style="text-align:center;color:#aaa;">Your cart is empty.</div>';
    } else {
      cart.forEach((item, idx) => {
        const row = document.createElement('div');
        row.className = 'cart-item-row';
        row.innerHTML = `
          <span class="cart-item-name">${item.flavour}</span>
          <span class="cart-item-qty">x${item.qty}</span>
          <span class="cart-item-price">₹${item.price * item.qty}</span>
          <button class="remove-cart-item" aria-label="Remove ${item.flavour}" data-idx="${idx}">&times;</button>
        `;
        cartItemsDiv.appendChild(row);
        total += item.price * item.qty;
      });
    }
    cartTotalSpan.textContent = `₹${total}`;
  }
  if (cartIcon) {
    cartIcon.addEventListener('click', () => {
      renderCart();
      cartModal.style.display = 'flex';
      setTimeout(() => cartModal.classList.add('active'), 10);
      cartModal.focus();
    });
  }
  if (closeCartModalBtn) {
    closeCartModalBtn.addEventListener('click', () => {
      cartModal.classList.remove('active');
      setTimeout(() => cartModal.style.display = 'none', 300);
    });
  }
  if (cartModalBackdrop) {
    cartModalBackdrop.addEventListener('click', () => {
      cartModal.classList.remove('active');
      setTimeout(() => cartModal.style.display = 'none', 300);
    });
  }
  cartModal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      cartModal.classList.remove('active');
      setTimeout(() => cartModal.style.display = 'none', 300);
    }
  });
  cartItemsDiv.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-cart-item')) {
      const idx = parseInt(e.target.getAttribute('data-idx'));
      cart.splice(idx, 1);
      updateCartCount();
      renderCart();
    }
  });
  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) return;
    showConfetti();
    setTimeout(() => {
      cart = [];
      updateCartCount();
      renderCart();
      cartModal.classList.remove('active');
      setTimeout(() => cartModal.style.display = 'none', 300);
    }, 1800);
  });

  // --- Modal open/close for Contact ---
  const contactModal = document.getElementById('contact-modal');
  const contactLink = document.querySelector('a[href="#contact"]');
  const closeModalBtn = document.querySelector('.close-modal');
  if (contactLink) {
    contactLink.addEventListener('click', (e) => {
      e.preventDefault();
      contactModal.classList.add('active');
    });
  }
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      contactModal.classList.remove('active');
    });
  }
  window.addEventListener('click', (e) => {
    if (e.target === contactModal) {
      contactModal.classList.remove('active');
    }
  });

  // --- Animate on scroll for cards ---
  function animateOnScroll() {
    const animatedCards = document.querySelectorAll('.flavour-card, .timeline-card');
    const triggerBottom = window.innerHeight * 0.92;
    animatedCards.forEach(card => {
      const cardTop = card.getBoundingClientRect().top;
      if (cardTop < triggerBottom) {
        card.classList.add('show');
      }
    });
  }
  window.addEventListener('scroll', animateOnScroll);
  animateOnScroll();
}); 