// Navigation functionality
document.addEventListener("DOMContentLoaded", function () {
	const navbar = document.getElementById("navbar");
	const navToggle = document.getElementById("nav-toggle");
	const navMenu = document.getElementById("nav-menu");
	const navLinks = document.querySelectorAll(".nav-link");
	const mobileNavItems = document.querySelectorAll(".mobile-bottom-nav .mobile-nav-item");

	// Initialize Lenis smooth scrolling
	const lenis = new Lenis();

	function raf(time) {
		lenis.raf(time);
		requestAnimationFrame(raf);
	}

	requestAnimationFrame(raf);

	// Mobile menu toggle
	navToggle.addEventListener("click", function () {
		navMenu.classList.toggle("active");
		navToggle.classList.toggle("active");
	});

	// Close mobile menu when clicking on a link
	navLinks.forEach((link) => {
		link.addEventListener("click", function () {
			navMenu.classList.remove("active");
			navToggle.classList.remove("active");
		});
	});

	// Navbar scroll effect
	window.addEventListener("scroll", function () {
		if (window.scrollY > 50) {
			navbar.classList.add("scrolled");
		} else {
			navbar.classList.remove("scrolled");
		}
	});

	// Smooth scrolling for navigation and other anchor links using Lenis
	document.querySelectorAll('a[href^="#"]').forEach((link) => {
		link.addEventListener("click", function (e) {
			e.preventDefault();
			const targetId = this.getAttribute("href");
			if (targetId === "#") {
				lenis.scrollTo(0);
			} else {
				const targetSection = document.querySelector(targetId);
				if (targetSection) {
					lenis.scrollTo(targetSection, {
						offset: -70
					});
				}
			}
		});
	});

	// Active navigation link highlighting
	window.addEventListener("scroll", function () {
		let current = "";
		const sections = document.querySelectorAll("section");

		sections.forEach((section) => {
			const sectionTop = section.offsetTop;
			const sectionHeight = section.clientHeight;

			if (window.scrollY >= sectionTop - 100) {
				current = section.getAttribute("id");
			}
		});

		navLinks.forEach((link) => {
			link.classList.remove("active");
			if (link.getAttribute("href").slice(1) === current) {
				link.classList.add("active");
			}
		});

		mobileNavItems.forEach((link) => {
			link.classList.remove("active");
			if (link.getAttribute("href").slice(1) === current) {
				link.classList.add("active");
			}
		});
	});

	// // Testimonials slider
	// const testimonialItems = document.querySelectorAll(".testimonial-item");
	// let currentTestimonial = 0;

	// function showTestimonial(index) {
	// 	testimonialItems.forEach((item) => item.classList.remove("active"));
	// 	testimonialItems[index].classList.add("active");
	// }

	// function nextTestimonial() {
	// 	currentTestimonial = (currentTestimonial + 1) % testimonialItems.length;
	// 	showTestimonial(currentTestimonial);
	// }

	// // Auto-rotate testimonials
	// setInterval(nextTestimonial, 5000);

	// Contact form handling
	const contactForm = document.getElementById("contact-form");

	contactForm.addEventListener("submit", function (e) {
		e.preventDefault();

		// Get form data
		const formData = new FormData(contactForm);
		const name = formData.get("name");
		const email = formData.get("email");
		const subject = formData.get("subject");
		const message = formData.get("message");

		// Simple validation
		if (!name || !email || !subject || !message) {
			showNotification("Please fill in all fields", "error");
			return;
		}

		if (!isValidEmail(email)) {
			showNotification("Please enter a valid email address", "error");
			return;
		}

		// Simulate form submission
		const submitBtn = contactForm.querySelector('button[type="submit"]');
		const originalText = submitBtn.innerHTML;
		submitBtn.innerHTML =
			'<i class="fas fa-spinner fa-spin"></i> Sending...';
		submitBtn.disabled = true;

		setTimeout(() => {
			showNotification(
				"Message sent successfully! We'll get back to you soon.",
				"success",
			);
			contactForm.reset();
			submitBtn.innerHTML = originalText;
			submitBtn.disabled = false;
		}, 2000);
	});

	// Email validation helper
	function isValidEmail(email) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	// Notification system
	function showNotification(message, type = "info") {
		// Remove existing notifications
		const existingNotification = document.querySelector(".notification");
		if (existingNotification) {
			existingNotification.remove();
		}

		// Create notification element
		const notification = document.createElement("div");
		notification.className = `notification notification-${type}`;
		notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === "success" ? "fa-check-circle" : type === "error" ? "fa-exclamation-circle" : "fa-info-circle"}"></i>
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

		// Add notification styles
		notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background: ${type === "success" ? "#10b981" : type === "error" ? "#ef4444" : "#3b82f6"};
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 400px;
        `;

		// Add notification content styles
		const notificationContent = notification.querySelector(
			".notification-content",
		);
		notificationContent.style.cssText = `
            display: flex;
            align-items: center;
            gap: 12px;
        `;

		// Add close button styles
		const closeBtn = notification.querySelector(".notification-close");
		closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            margin-left: auto;
            padding: 0;
        `;

		document.body.appendChild(notification);

		// Animate in
		setTimeout(() => {
			notification.style.transform = "translateX(0)";
		}, 100);

		// Close button functionality
		closeBtn.addEventListener("click", () => {
			notification.style.transform = "translateX(400px)";
			setTimeout(() => notification.remove(), 300);
		});

		// Auto-remove after 5 seconds
		setTimeout(() => {
			if (notification.parentNode) {
				notification.style.transform = "translateX(400px)";
				setTimeout(() => notification.remove(), 300);
			}
		}, 5000);
	}

	// Scroll animations
	const observerOptions = {
		threshold: 0.1,
		rootMargin: "0px 0px -50px 0px",
	};

	const observer = new IntersectionObserver(function (entries) {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.style.opacity = "1";
				entry.target.style.transform = "translateY(0)";
			}
		});
	}, observerOptions);

	// Observe elements for scroll animations
	const animateElements = document.querySelectorAll(
		".feature-item, .team-member, .mission-card, .stat-item",
	);
	animateElements.forEach((el) => {
		el.style.opacity = "0";
		el.style.transform = "translateY(30px)";
		// Only set opacity transition, let CSS handle transform transitions
		el.style.transition = "opacity 0.6s ease";
		observer.observe(el);
	});

	// Counter animation for stats
	function animateCounter(element, target, duration = 2000) {
		let start = 0;
		const increment = target / (duration / 16);

		function updateCounter() {
			start += increment;
			if (start < target) {
				element.textContent =
					Math.floor(start) +
					(element.textContent.includes("+") ? "+" : "");
				requestAnimationFrame(updateCounter);
			} else {
				element.textContent =
					target + (element.textContent.includes("+") ? "+" : "");
			}
		}

		updateCounter();
	}

	// Trigger counter animation when stats section is visible
	const statsObserver = new IntersectionObserver(
		function (entries) {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const statNumbers =
						entry.target.querySelectorAll(".stat-item h3");
					statNumbers.forEach((stat) => {
						const text = stat.textContent;
						const number = parseInt(text.replace(/\D/g, ""));
						animateCounter(stat, number);
					});
					statsObserver.unobserve(entry.target);
				}
			});
		},
		{ threshold: 0.5 },
	);

	const statsSection = document.querySelector(".about-stats");
	if (statsSection) {
		statsObserver.observe(statsSection);
	}

	// Add hover effect to buttons
	const buttons = document.querySelectorAll(".btn");
	buttons.forEach((button) => {
		button.addEventListener("mouseenter", function () {
			this.style.transform = "translateY(-2px)";
		});

		button.addEventListener("mouseleave", function () {
			this.style.transform = "translateY(0)";
		});
	});

	// Download button functionality
	const downloadBtn = document.querySelector(".btn-download");
	if (downloadBtn) {
		downloadBtn.addEventListener("click", function () {
			window.open(
				"https://github.com/niloyahsan1/nirapod-shobdo/releases/download/v1.1/Nirapod.Shobdo.apk",
				"_blank",
			);
		});
	}

	// Demo button functionality
	const demoBtn = document.querySelector(".btn-demo");
	if (demoBtn) {
		demoBtn.addEventListener("click", function () {
			window.open("assets/demo/Demo_Video.mp4", "_blank");
			// showNotification('Demo video coming soon! Stay tuned.', 'info');
		});
	}

	// Keyboard navigation support
	document.addEventListener("keydown", function (e) {
		// Escape key closes mobile menu
		if (e.key === "Escape" && navMenu.classList.contains("active")) {
			navMenu.classList.remove("active");
			navToggle.classList.remove("active");
		}

		// Tab navigation enhancement
		if (e.key === "Tab") {
			const focusableElements = document.querySelectorAll(
				'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])',
			);

			const firstElement = focusableElements[0];
			const lastElement = focusableElements[focusableElements.length - 1];

			if (e.shiftKey && document.activeElement === firstElement) {
				e.preventDefault();
				lastElement.focus();
			} else if (!e.shiftKey && document.activeElement === lastElement) {
				e.preventDefault();
				firstElement.focus();
			}
		}
	});

	// Performance optimization: Debounce scroll events
	function debounce(func, wait) {
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

	// Apply debouncing to scroll events
	const debouncedScroll = debounce(function () {
		// Scroll-based animations and updates
	}, 10);

	window.addEventListener("scroll", debouncedScroll);

	// Initialize page
	console.log("Nirapod Shobdo website loaded successfully!");
});
