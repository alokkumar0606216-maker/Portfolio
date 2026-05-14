// ==========================================
// PORTFOLIO - JAVASCRIPT
// ==========================================

// DOM Elements
const loader = document.getElementById("loader");
const navbar = document.getElementById("navbar");
const navMenu = document.getElementById("nav-menu");
const hamburger = document.getElementById("hamburger");
const themeToggle = document.getElementById("theme-toggle");
const backToTop = document.getElementById("back-to-top");
const contactForm = document.getElementById("contact-form");
const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toast-message");
const typewriter = document.getElementById("typewriter");
const filterBtns = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
const statNumbers = document.querySelectorAll(".stat-number");
const navLinks = document.querySelectorAll(".nav-link");
const downloadCV = document.getElementById("download-cv");

// ==========================================
// 1. LOADER - Page Load Animation
// ==========================================
window.addEventListener("load", () => {
  setTimeout(() => {
    loader.classList.add("hidden");
  }, 1500);
});

// ==========================================
// 2. NAVBAR - Scroll Effect & Active Link
// ==========================================
window.addEventListener("scroll", () => {
  // Navbar background on scroll
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }

  // Back to top button visibility
  if (window.scrollY > 500) {
    backToTop.classList.add("visible");
  } else {
    backToTop.classList.remove("visible");
  }

  // Update active nav link based on scroll position
  updateActiveNavLink();
});

function updateActiveNavLink() {
  const sections = document.querySelectorAll("section");
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;
    if (
      window.scrollY >= sectionTop &&
      window.scrollY < sectionTop + sectionHeight
    ) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
}

// ==========================================
// 3. HAMBURGER MENU - Mobile Toggle
// ==========================================
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
});

// Close menu when clicking on nav link
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
  });
});

// ==========================================
// 4. THEME TOGGLE - Dark/Light Mode
// ==========================================
const savedTheme = localStorage.getItem("theme") || "dark";
document.documentElement.setAttribute("data-theme", savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateThemeIcon(newTheme);

  showToast(
    "theme",
    newTheme === "dark" ? "Dark mode enabled! 🌙" : "Light mode enabled! ☀️",
  );
});

function updateThemeIcon(theme) {
  const icon = themeToggle.querySelector("i");
  icon.className = theme === "dark" ? "fas fa-moon" : "fas fa-sun";
}

// ==========================================
// 5. TYPEWRITER EFFECT - Hero Section
// ==========================================
const textToType = ["Developer", "Designer", "Coder", "Learner"];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeWriter() {
  const currentText = textToType[textIndex];

  if (isDeleting) {
    typewriter.textContent = currentText.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typewriter.textContent = currentText.substring(0, charIndex + 1);
    charIndex++;
  }

  let typeSpeed = isDeleting ? 50 : 100;

  if (!isDeleting && charIndex === currentText.length) {
    typeSpeed = 2000; // Pause at end
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    textIndex = (textIndex + 1) % textToType.length;
    typeSpeed = 500; // Pause before typing next
  }

  setTimeout(typeWriter, typeSpeed);
}

typeWriter();

// ==========================================
// 7. COUNTER ANIMATION - Stats Section
// ==========================================
const heroSection = document.querySelector(".hero");
let statsAnimated = false;

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !statsAnimated) {
        animateCounters();
        statsAnimated = true;
      }
    });
  },
  { threshold: 0.5 },
);

statsObserver.observe(heroSection);

function animateCounters() {
  statNumbers.forEach((counter) => {
    const target = parseInt(counter.getAttribute("data-count"));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += step;
      if (current < target) {
        counter.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    };

    updateCounter();
  });
}

// ==========================================
// 8. PROJECT FILTER - Filter Projects
// ==========================================
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Update active button
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.getAttribute("data-filter");

    projectCards.forEach((card) => {
      const category = card.getAttribute("data-category");

      if (filter === "all" || category === filter) {
        card.classList.remove("hidden");
        card.style.animation = "fadeIn 0.5s ease";
      } else {
        card.classList.add("hidden");
      }
    });
  });
});

// Add fadeIn animation
const style = document.createElement("style");
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

// ==========================================
// 9. CONTACT FORM - Form Submission
// ==========================================
contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get form values
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const message = document.getElementById("message").value.trim();

  // Simple validation
  if (!name || !email || !subject || !message) {
    showToast("error", "Please fill all fields! ⚠️");
    return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showToast("error", "Please enter valid email! ⚠️");
    return;
  }

  // Submission to Web3Forms
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  submitBtn.disabled = true;

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: "YOUR_ACCESS_KEY_HERE", // User needs to replace this
        name: name,
        email: email,
        subject: subject,
        message: message,
      }),
    });

    const result = await response.json();

    if (result.success) {
      showToast("success", `Thanks ${name}! Message sent successfully! 🎉`);
      contactForm.reset();
    } else {
      showToast("error", "Something went wrong. Please try again! ⚠️");
    }
  } catch (error) {
    showToast("error", "Network error! Please try again later. ⚠️");
  } finally {
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
});

// ==========================================
// 10. TOAST NOTIFICATION - Show Messages
// ==========================================
function showToast(type, message) {
  const icon = toast.querySelector("i");

  if (type === "success") {
    toast.style.background = "#10b981";
    icon.className = "fas fa-check-circle";
  } else if (type === "error") {
    toast.style.background = "#ef4444";
    icon.className = "fas fa-exclamation-circle";
  } else {
    toast.style.background = "#6366f1";
    icon.className = "fas fa-info-circle";
  }

  toastMessage.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// ==========================================
// 11. BACK TO TOP - Scroll to Top
// ==========================================
backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// ==========================================
// 12. DOWNLOAD CV - Download Animation
// ==========================================
downloadCV.addEventListener("click", (e) => {
  e.preventDefault();

  const btn = downloadCV;
  const originalText = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';

  setTimeout(() => {
    showToast("success", "CV download started! 📄");
    btn.innerHTML = originalText;
  }, 1500);
});

// ==========================================
// 13. SMOOTH SCROLL - Navigation Links
// ==========================================
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.getAttribute("href");
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      const offsetTop = targetSection.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  });
});

// ==========================================
// 14. PROJECT LINKS - Demo & GitHub
// ==========================================
document.querySelectorAll(".project-link, .project-github").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const icon = link.querySelector("i");
    if (icon.classList.contains("fa-link")) {
      showToast("info", "Opening live demo! 🔗");
    } else {
      showToast("info", "Opening GitHub repository! 💻");
    }
  });
});

// ==========================================
// 15. SOCIAL LINKS - Social Icons
// ==========================================
document.querySelectorAll(".social-links a").forEach((link) => {
  link.addEventListener("click", () => {
    const title = link.getAttribute("title");
    showToast("info", `Opening ${title}! 🌐`);
  });
});

// ==========================================
// 16. TYPING FORM - Floating Labels Effect
// ==========================================
const formInputs = document.querySelectorAll(
  ".form-group input, .form-group textarea",
);
formInputs.forEach((input) => {
  input.addEventListener("focus", () => {
    input.parentElement.classList.add("focused");
  });
  input.addEventListener("blur", () => {
    if (!input.value) {
      input.parentElement.classList.remove("focused");
    }
  });
});

// ==========================================
// 17. PARALLAX EFFECT - Hero Section
// ==========================================
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  const hero = document.querySelector(".hero");
  if (hero) {
    hero.style.backgroundPositionY = `${scrollY * 0.3}px`;
  }
});

// ==========================================
// 18. KEYBOARD NAVIGATION - Accessibility
// ==========================================
document.addEventListener("keydown", (e) => {
  // Press 'T' to toggle theme
  if (e.key === "t" || e.key === "T") {
    themeToggle.click();
  }

  // Press 'Escape' to close mobile menu
  if (e.key === "Escape") {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
  }
});

// ==========================================
// 19. CONSOLE MESSAGE - Easter Egg
// ==========================================
console.log(
  "%c🚀 Welcome to my Portfolio!",
  "color: #6366f1; font-size: 20px; font-weight: bold;",
);
console.log(
  "%c💻 Built with HTML, CSS & JavaScript",
  "color: #ec4899; font-size: 14px;",
);
console.log(
  "%c📧 Want to collaborate? Get in touch!",
  "color: #10b981; font-size: 14px;",
);

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  // Preload animations trigger
  setTimeout(() => {
    document.body.style.opacity = "1";
  }, 100);
});

console.log("All JavaScript functions loaded successfully! ✅");
