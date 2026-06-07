// Component Loader & Interactions for Nirapod Shobdo
document.addEventListener("DOMContentLoaded", function () {
	// Initialize Lenis smooth scrolling
	const lenis = new Lenis();

	function raf(time) {
		lenis.raf(time);
		requestAnimationFrame(raf);
	}

	requestAnimationFrame(raf);

	// Load HTML Components dynamically
	function loadComponents() {
		const components = [
			{ id: "navbar-placeholder", file: "navbar.html" },
			{ id: "mobile-nav-placeholder", file: "mobile-nav.html" },
			{ id: "footer-placeholder", file: "footer.html" },
			{ id: "scroll-up-placeholder", file: "scroll-up.html" }
		];

		const isSubPage = window.location.pathname.includes("/pages/") || window.location.pathname.includes("\\pages\\");
		let loadedCount = 0;
		const totalComponents = components.length;

		components.forEach(comp => {
			const placeholder = document.getElementById(comp.id);
			if (!placeholder) {
				loadedCount++;
				if (loadedCount === totalComponents) {
					initializeInteractions(lenis);
				}
				return;
			}

			const fetchPath = isSubPage ? comp.file : `pages/${comp.file}`;

			fetch(fetchPath)
				.then(res => {
					if (!res.ok) throw new Error(`Failed to load ${fetchPath}`);
					return res.text();
				})
				.then(html => {
					if (isSubPage) {
						const parser = new DOMParser();
						const doc = parser.parseFromString(html, "text/html");

						// Adjust relative links for pages in subfolder
						doc.querySelectorAll("a").forEach(a => {
							const href = a.getAttribute("href");
							if (href && !href.startsWith("http") && !href.startsWith("mailto:") && !href.startsWith("tel:") && !href.startsWith("#")) {
								if (href.startsWith("pages/")) {
									a.setAttribute("href", href.substring(6));
								} else {
									a.setAttribute("href", "../" + href);
								}
							}
						});

						// Adjust relative image sources for pages in subfolder
						doc.querySelectorAll("img").forEach(img => {
							const src = img.getAttribute("src");
							if (src && !src.startsWith("http") && !src.startsWith("data:")) {
								const cleanSrc = src.startsWith("./") ? src.substring(2) : src;
								img.setAttribute("src", "../" + cleanSrc);
							}
						});

						placeholder.outerHTML = doc.body.innerHTML;
					} else {
						placeholder.outerHTML = html;
					}

					loadedCount++;
					if (loadedCount === totalComponents) {
						initializeInteractions(lenis);
					}
				})
				.catch(err => {
					console.error("Error loading component:", err);
					loadedCount++;
					if (loadedCount === totalComponents) {
						initializeInteractions(lenis);
					}
				});
		});
	}

	// Trigger the loader
	loadComponents();
});

// Initialize event listeners and page animations after component loading
function initializeInteractions(lenis) {
	const navbar = document.getElementById("navbar");
	const navToggle = document.getElementById("nav-toggle");
	const navMenu = document.getElementById("nav-menu");
	const mobileNavItems = document.querySelectorAll(".mobile-bottom-nav .mobile-nav-item");

	// Active link styling based on URL pathname
	function highlightActiveNavLink() {
		const path = window.location.pathname;
		const page = path.replace(/\\/g, "/").split("/").pop() || "index.html";

		const navLinks = document.querySelectorAll(".nav-link");
		const joinBtn = document.querySelector(".btn-nav-join");

		navLinks.forEach(link => {
			const href = link.getAttribute("href") || "";
			const hrefPage = href.split("#")[0].replace(/\\/g, "/").split("/").pop();
			if (hrefPage === page || (page === "index.html" && (hrefPage === "index.html" || hrefPage === "" || href === "#home"))) {
				link.classList.add("active");
			} else {
				link.classList.remove("active");
			}
		});

		mobileNavItems.forEach(link => {
			const href = link.getAttribute("href") || "";
			const hrefPage = href.split("#")[0].replace(/\\/g, "/").split("/").pop();
			if (hrefPage === page || (page === "index.html" && (hrefPage === "index.html" || hrefPage === "" || href === "#home"))) {
				link.classList.add("active");
			} else {
				link.classList.remove("active");
			}
		});

		if (joinBtn) {
			const href = joinBtn.getAttribute("href") || "";
			const hrefPage = href.split("#")[0].replace(/\\/g, "/").split("/").pop();
			if (hrefPage === page) {
				joinBtn.classList.add("active");
			} else {
				joinBtn.classList.remove("active");
			}
		}
	}

	highlightActiveNavLink();

	// Mobile menu toggling behavior
	if (navToggle && navMenu) {
		navToggle.addEventListener("click", function () {
			navMenu.classList.toggle("active");
			navToggle.classList.toggle("active");
		});

		const navLinks = document.querySelectorAll(".nav-link");
		navLinks.forEach((link) => {
			link.addEventListener("click", function () {
				navMenu.classList.remove("active");
				navToggle.classList.remove("active");
			});
		});
	}

	// Navbar scroll capsule transition
	window.addEventListener("scroll", function () {
		if (navbar) {
			if (window.scrollY > 50) {
				navbar.classList.add("scrolled");
			} else {
				navbar.classList.remove("scrolled");
			}
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

	// Scroll to Top Button (Tap to Go Up) functionality
	const scrollToTopBtn = document.querySelector(".scroll-to-top");
	if (scrollToTopBtn) {
		window.addEventListener("scroll", function () {
			if (window.scrollY > 300) {
				scrollToTopBtn.classList.add("show");
			} else {
				scrollToTopBtn.classList.remove("show");
			}
		});

		scrollToTopBtn.addEventListener("click", function () {
			lenis.scrollTo(0);
		});
	}

	// Contact form handler
	const contactForm = document.getElementById("contact-form");
	if (contactForm) {
		contactForm.addEventListener("submit", function (e) {
			e.preventDefault();

			const formData = new FormData(contactForm);
			const name = formData.get("name");
			const email = formData.get("email");
			const subject = formData.get("subject");
			const message = formData.get("message");

			if (!name || !email || !subject || !message) {
				showNotification("Please fill in all fields", "error");
				return;
			}

			if (!isValidEmail(email)) {
				showNotification("Please enter a valid email address", "error");
				return;
			}

			const submitBtn = contactForm.querySelector('button[type="submit"]');
			const originalText = submitBtn.innerHTML;
			submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
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
	}

	// Email validator helper
	function isValidEmail(email) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	// Notification system
	function showNotification(message, type = "info") {
		const existingNotification = document.querySelector(".notification");
		if (existingNotification) {
			existingNotification.remove();
		}

		const notification = document.createElement("div");
		notification.className = `notification notification-${type}`;
		notification.innerHTML = `
			<div class="notification-content">
				<i class="fas ${type === "success" ? "fa-check-circle" : type === "error" ? "fa-exclamation-circle" : "fa-info-circle"}"></i>
				<span>${message}</span>
				<button class="notification-close">&times;</button>
			</div>
		`;

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

		const notificationContent = notification.querySelector(
			".notification-content",
		);
		notificationContent.style.cssText = `
			display: flex;
			align-items: center;
			gap: 12px;
		`;

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

		setTimeout(() => {
			notification.style.transform = "translateX(0)";
		}, 100);

		closeBtn.addEventListener("click", () => {
			notification.style.transform = "translateX(400px)";
			setTimeout(() => notification.remove(), 300);
		});

		setTimeout(() => {
			if (notification.parentNode) {
				notification.style.transform = "translateX(400px)";
				setTimeout(() => notification.remove(), 300);
			}
		}, 5000);
	}

	// Scroll Animations using IntersectionObserver
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

	const animateElements = document.querySelectorAll(
		".feature-item, .team-member, .mission-card, .stat-item",
	);
	animateElements.forEach((el) => {
		el.style.opacity = "0";
		el.style.transform = "translateY(30px)";
		el.style.transition = "opacity 0.6s ease";
		observer.observe(el);
	});

	// Counter animation logic
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

	// Keyboard controls support
	document.addEventListener("keydown", function (e) {
		if (e.key === "Escape" && navMenu && navMenu.classList.contains("active")) {
			navMenu.classList.remove("active");
			navToggle.classList.remove("active");
		}

		if (e.key === "Tab") {
			const focusableElements = document.querySelectorAll(
				'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])',
			);
			if (focusableElements.length > 0) {
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
		}
	});

	console.log("Nirapod Shobdo interactive page features loaded.");
}
