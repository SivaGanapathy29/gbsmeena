document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    body.dataset.motion = "ready";

    const header = document.querySelector(".site-header");
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    const closeMenu = () => {
        if (!hamburger || !navLinks) return;
        navLinks.classList.remove("active");
        hamburger.classList.remove("active");
    };

    if (hamburger && navLinks) {
        hamburger.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            hamburger.classList.toggle("active");
        });

        navLinks.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("click", (event) => {
            if (!navLinks.classList.contains("active")) return;
            if (navLinks.contains(event.target) || hamburger.contains(event.target)) return;
            closeMenu();
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") closeMenu();
        });
    }

    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a, body:not(.home) nav a").forEach((link) => {
        const href = link.getAttribute("href");
        if (!href || href.startsWith("http") || href.startsWith("#")) return;
        const linkPath = href.split("/").pop();
        if (linkPath === currentPath) {
            link.classList.add("is-active");
        }
    });

    const updateHeaderState = () => {
        if (!header) return;
        header.classList.toggle("is-scrolled", window.scrollY > 18);
    };

    const heroOverlay = document.querySelector(".hero-overlay, .page-hero-content");
    const heroScene = document.querySelector(".hero, .page-hero");

    const updateScrollEffects = () => {
        updateHeaderState();
    };

    updateScrollEffects();
    window.addEventListener("scroll", updateScrollEffects, { passive: true });

    const whatsappButton = document.querySelector(".whatsapp-button");
    const chatbotButton = document.querySelector(".chatbot-button");
    const chatbotPopup = document.querySelector(".chatbot-popup");
    const chatbotClose = document.querySelector(".chatbot-close");
    const chatbotMessages = document.querySelector(".chatbot-messages");
    const chatbotInput = document.querySelector(".chatbot-input input");
    const chatbotSendButton = document.querySelector(".chatbot-input button");
    let locationButton = document.querySelector(".location-button");
    let locationPopup = document.querySelector(".location-popup");

    if (!locationButton && whatsappButton) {
        locationButton = document.createElement("button");
        locationButton.type = "button";
        locationButton.className = "location-button";
        locationButton.setAttribute("aria-label", "View company location");
        locationButton.setAttribute("aria-expanded", "false");
        locationButton.innerHTML = '<i class="fas fa-map-marker-alt" aria-hidden="true"></i>';
        whatsappButton.insertAdjacentElement("beforebegin", locationButton);
    }

    if (!locationPopup && locationButton) {
        locationPopup = document.createElement("div");
        locationPopup.className = "location-popup";
        locationPopup.setAttribute("role", "dialog");
        locationPopup.setAttribute("aria-label", "Company location details");
        locationPopup.innerHTML = `
            <h4>GBS MENA</h4>
            <p>C-Ring Road, Umm Ghuwailina,<br>Doha, Qatar.</p>
            <a href="https://www.google.com/maps/search/?api=1&query=C-Ring+Road,+Umm+Ghuwailina,+Doha,+Qatar" target="_blank" rel="noopener noreferrer">
                <i class="fas fa-location-arrow" aria-hidden="true"></i>
                Open in Google Maps
            </a>
        `;
        document.body.appendChild(locationPopup);
    }

    if (locationButton && locationPopup) {
        const openLocationPopup = () => {
            locationPopup.classList.add("is-open");
            locationButton.setAttribute("aria-expanded", "true");
        };

        const closeLocationPopup = () => {
            locationPopup.classList.remove("is-open");
            locationButton.setAttribute("aria-expanded", "false");
        };

        locationButton.addEventListener("click", (event) => {
            event.stopPropagation();
            if (locationPopup.classList.contains("is-open")) {
                closeLocationPopup();
            } else {
                openLocationPopup();
            }
        });

        locationPopup.addEventListener("click", (event) => {
            event.stopPropagation();
        });

        document.addEventListener("click", (event) => {
            if (!locationPopup.classList.contains("is-open")) return;
            if (locationButton.contains(event.target) || locationPopup.contains(event.target)) return;
            closeLocationPopup();
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeLocationPopup();
            }
        });
    }

    if (chatbotButton && chatbotPopup && chatbotClose && chatbotMessages && chatbotInput && chatbotSendButton) {
        const addMessage = (text, sender) => {
            const messageDiv = document.createElement("div");
            messageDiv.className = `chatbot-message ${sender}`;
            messageDiv.textContent = text;
            chatbotMessages.appendChild(messageDiv);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        };

        const addBotMessage = (text) => addMessage(text, "bot");
        const addUserMessage = (text) => addMessage(text, "user");
        const chatbotKnowledge = [
            {
                keywords: ["open position", "open positions", "vacancy", "vacancies", "job opening", "job openings", "hiring", "available roles", "current roles"],
                answer: "The current GBS Careers page does not list specific open positions or job titles. It highlights the work culture and growth opportunities instead. For the latest openings, please contact GBS directly at info@gbsmena.com or +974 66800948, or use the Contact page to ask about current vacancies."
            },
            {
                keywords: ["apply", "application", "how to apply", "submit cv", "send cv", "resume"],
                answer: "The website does not show a direct online application form for careers right now. The best next step is to contact GBS through info@gbsmena.com or +974 66800948 and ask how to apply for current opportunities."
            },
            {
                keywords: ["career", "careers", "job", "jobs", "join", "work"],
                answer: "GBS Careers highlights professional growth, global exposure, collaborative culture, impactful work, innovation, and work-life balance. If you want current openings, the site does not list exact roles, so it is best to contact GBS directly through the Careers or Contact page."
            },
            {
                keywords: ["about", "company", "gbs", "gbsmena", "who are you", "who we are", "tell me about"],
                answer: "Grow Business Solutions WLL, also known as GBS MENA, is an advisory and consulting firm that helps organizations achieve sustainable growth, operational efficiency, governance improvement, and digital advancement through practical business and technology solutions."
            },
            {
                keywords: ["mission"],
                answer: "GBS mission is to empower organizations with innovative solutions, strategic insight, and technology-driven capabilities that enable sustainable business growth."
            },
            {
                keywords: ["vision"],
                answer: "GBS vision is to be a trusted global advisory partner recognized for excellence in consulting, digital innovation, and business transformation."
            },
            {
                keywords: ["service", "services", "what do you do"],
                answer: "GBS provides Business Technology Solutions, Digital Transformation, Accounting and Auditing, Operational Excellence, Human Capital Development, Process Optimization, Governance and Compliance, Business Consulting, and Financial Advisory."
            },
            {
                keywords: ["business technology", "technology solutions", "enterprise systems", "analytics"],
                answer: "GBS Business Technology Solutions focus on enterprise systems, automation, and analytics to improve efficiency, collaboration, and scalability."
            },
            {
                keywords: ["digital transformation", "transformation", "automation", "cloud", "ai"],
                answer: "GBS supports digital transformation through modernization, automation, cloud and data strategies, and technology integration that improve efficiency, innovation, and decision-making."
            },
            {
                keywords: ["accounting", "auditing", "finance", "financial", "budgeting"],
                answer: "GBS provides accounting, auditing, and financial advisory support to strengthen reporting, compliance, governance, budgeting, and financial performance."
            },
            {
                keywords: ["operational excellence", "process", "optimization", "lean", "six sigma", "kaizen", "productivity"],
                answer: "GBS helps organizations improve operational excellence through process redesign, Lean, Six Sigma, Kaizen, performance systems, and productivity-focused optimization."
            },
            {
                keywords: ["human capital", "leadership", "team development", "workforce", "talent"],
                answer: "GBS strengthens human capital through leadership development, workforce capability-building, performance improvement, and employee engagement programs."
            },
            {
                keywords: ["governance", "compliance", "risk", "regulation", "ethics"],
                answer: "GBS helps clients build governance, compliance, ethics, and risk management frameworks that support accountability, resilience, and regulatory alignment."
            },
            {
                keywords: ["academy", "grow academy", "training", "learning", "courses", "workshop"],
                answer: "Grow Academy is the professional learning platform of GBS. It offers training and workshops in leadership and management development, digital transformation and technology, strategic planning, operational excellence, and risk management and compliance."
            },
            {
                keywords: ["insights", "thought leadership", "articles", "trends", "industry"],
                answer: "The GBS Insights section covers digital transformation strategies, business innovation and emerging technology, governance and regulatory developments, leadership and workforce trends, operational excellence, global market outlook, and financial advisory insights."
            },
            {
                keywords: ["contact", "phone", "email", "address", "location", "office", "map", "doha"],
                answer: "You can contact GBS at info@gbsmena.com or call +974 66800948. The office is located at C-Ring Road, Umm Ghuwailina, Doha, Qatar."
            },
            {
                keywords: ["clients", "trusted by", "customers"],
                answer: "GBS showcases trusted relationships with organizations such as GE, Cisco, PwC, HSBC, and Deloitte."
            },
            {
                keywords: ["experience", "years", "awards", "retention", "metrics"],
                answer: "GBS highlights 15+ years of experience, 500+ clients worldwide, 95% client retention, and 40+ industry awards."
            }
        ];

        const normalizeMessage = (messageText) =>
            messageText
                .toLowerCase()
                .replace(/[^\w\s+&-]/g, " ")
                .replace(/\s+/g, " ")
                .trim();

        const getChatbotReply = (messageText) => {
            const lowered = normalizeMessage(messageText);
            let bestMatch = null;
            let bestScore = 0;

            chatbotKnowledge.forEach((item) => {
                const score = item.keywords.reduce((total, keyword) => {
                    if (!lowered.includes(keyword)) return total;
                    return total + (keyword.includes(" ") ? 3 : 1);
                }, 0);

                if (score > bestScore) {
                    bestScore = score;
                    bestMatch = item;
                }
            });

            if (bestMatch) {
                return bestMatch.answer;
            }

            if (lowered.includes("hello") || lowered.includes("hi")) {
                return "Hello! I can help with GBS company details, services, careers, Grow Academy, insights, contact details, and more.";
            }

            return "I can help with GBS MENA company details, services, careers, current vacancies, contact information, Grow Academy, insights, mission, vision, and client information. Please ask a specific question about GBS.";
        };

        const openChatbot = () => {
            chatbotPopup.style.display = "flex";
            if (chatbotMessages.children.length === 0) {
                addBotMessage("Hi there! Ask me about GBS, our services, contact details, Grow Academy, insights, or careers.");
            }
        };

        const closeChatbot = () => {
            chatbotPopup.style.display = "none";
        };

        chatbotButton.addEventListener("click", () => {
            if (chatbotPopup.style.display === "flex") {
                closeChatbot();
            } else {
                openChatbot();
            }
        });

        chatbotClose.addEventListener("click", closeChatbot);

        const handleSendMessage = () => {
            const messageText = chatbotInput.value.trim();
            if (!messageText) return;

            addUserMessage(messageText);
            chatbotInput.value = "";

            window.setTimeout(() => {
                addBotMessage(getChatbotReply(messageText));
            }, 800);
        };

        chatbotSendButton.addEventListener("click", handleSendMessage);
        chatbotInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                handleSendMessage();
            }
        });
    }

    const testimonialSlides = document.querySelector(".testimonial-slides");
    const dotsContainer = document.querySelector(".slider-dots");
    if (testimonialSlides && dotsContainer) {
        let currentIndex = 0;
        let autoAdvanceId = null;
        const slides = Array.from(document.querySelectorAll(".testimonial-card"));
        const totalSlides = slides.length;

        const updateSlider = () => {
            testimonialSlides.style.transform = `translateX(-${currentIndex * 100}%)`;
            dotsContainer.querySelectorAll(".dot").forEach((dot, index) => {
                dot.classList.toggle("active", index === currentIndex);
            });
        };

        const goToSlide = (index) => {
            currentIndex = index;
            updateSlider();
        };

        const nextSlide = () => {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateSlider();
        };

        slides.forEach((_, index) => {
            const dot = document.createElement("div");
            dot.classList.add("dot");
            dot.addEventListener("click", () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        if (!prefersReducedMotion && totalSlides > 1) {
            autoAdvanceId = window.setInterval(nextSlide, 5000);
            testimonialSlides.addEventListener("mouseenter", () => {
                if (autoAdvanceId) {
                    window.clearInterval(autoAdvanceId);
                    autoAdvanceId = null;
                }
            });
            testimonialSlides.addEventListener("mouseleave", () => {
                if (!autoAdvanceId) {
                    autoAdvanceId = window.setInterval(nextSlide, 5000);
                }
            });
        }

        updateSlider();
    }

    const keyMetricsSection = document.querySelector(".key-metrics");
    if (keyMetricsSection) {
        const animateCounter = (element) => {
            const originalText = element.dataset.originalValue || element.textContent.trim();
            const target = parseInt(originalText.replace(/\D/g, ""), 10);
            const suffix = originalText.replace(/[0-9,\s]/g, "");
            if (Number.isNaN(target)) return;

            element.dataset.originalValue = originalText;

            if (prefersReducedMotion) {
                element.textContent = `${target.toLocaleString()}${suffix}`;
                return;
            }

            const start = performance.now();
            const duration = 1800;

            const tick = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                element.textContent = `${Math.round(target * eased).toLocaleString()}${suffix}`;
                if (progress < 1) {
                    requestAnimationFrame(tick);
                }
            };

            requestAnimationFrame(tick);
        };

        const metricsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                keyMetricsSection.querySelectorAll(".metric-item h3").forEach(animateCounter);
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.35 });

        metricsObserver.observe(keyMetricsSection);
    }

    const insightsTree = document.querySelector("body.page-insights .tree");
    if (insightsTree) {
        const originalNodes = Array.from(insightsTree.children);

        if (originalNodes.length > 1) {
            originalNodes.forEach((node) => {
                const clone = node.cloneNode(true);
                clone.setAttribute("aria-hidden", "true");
                insightsTree.appendChild(clone);
            });

            let isPaused = prefersReducedMotion;
            let animationFrameId = null;
            let lastTime = 0;
            let loopWidth = 0;

            const updateLoopWidth = () => {
                loopWidth = insightsTree.scrollWidth / 2;
            };

            const step = (time) => {
                if (!lastTime) lastTime = time;
                const delta = time - lastTime;
                lastTime = time;

                if (!isPaused && loopWidth > 0) {
                    const speed = window.innerWidth < 768 ? 0.035 : 0.05;
                    insightsTree.scrollLeft += delta * speed;

                    if (insightsTree.scrollLeft >= loopWidth) {
                        insightsTree.scrollLeft -= loopWidth;
                    }
                }

                animationFrameId = window.requestAnimationFrame(step);
            };

            updateLoopWidth();
            window.addEventListener("resize", updateLoopWidth);

            insightsTree.addEventListener("mouseenter", () => {
                isPaused = true;
            });

            insightsTree.addEventListener("mouseleave", () => {
                if (!prefersReducedMotion) {
                    isPaused = false;
                }
            });

            insightsTree.addEventListener("focusin", () => {
                isPaused = true;
            });

            insightsTree.addEventListener("focusout", () => {
                if (!prefersReducedMotion) {
                    isPaused = false;
                }
            });

            if (!prefersReducedMotion) {
                animationFrameId = window.requestAnimationFrame(step);
            }

            window.addEventListener("beforeunload", () => {
                if (animationFrameId) {
                    window.cancelAnimationFrame(animationFrameId);
                }
            });
        }
    }

    const animateElements = Array.from(document.querySelectorAll(".animate-on-scroll"));
    animateElements.forEach((element, index) => {
        const baseDelay = Math.min(index % 6, 5) * 90;
        element.style.setProperty("--reveal-delay", `${baseDelay}ms`);
    });

    if (body.classList.contains("page-what-we-do")) {
        const serviceCards = Array.from(document.querySelectorAll(".services .card-grid .info-card"));
        serviceCards.forEach((card, index) => {
            card.classList.add("animate-on-scroll");
            card.style.setProperty("--reveal-delay", `${180 + (index * 120)}ms`);
        });
        animateElements.push(...serviceCards);
    }

    if (animateElements.length > 0) {
        if (prefersReducedMotion) {
            animateElements.forEach((element) => element.classList.add("in-view"));
        } else {
            const animationObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add("in-view");
                    observer.unobserve(entry.target);
                });
            }, {
                root: null,
                rootMargin: "0px 0px -10%",
                threshold: 0.18
            });

            animateElements.forEach((element) => animationObserver.observe(element));
        }
    }

    document.querySelectorAll(".letter-hover").forEach((element) => {
        if (element.dataset.lettersDone === "true") return;
        const text = element.textContent.trim();
        element.textContent = "";
        element.setAttribute("aria-label", text);

        text.split(/\s+/).forEach((word, wordIndex, words) => {
            const wordSpan = document.createElement("span");
            wordSpan.classList.add("word");

            [...word].forEach((char) => {
                const letterSpan = document.createElement("span");
                letterSpan.classList.add("letter");
                letterSpan.textContent = char;
                wordSpan.appendChild(letterSpan);
            });

            element.appendChild(wordSpan);
            if (wordIndex < words.length - 1) {
                element.appendChild(document.createTextNode(" "));
            }
        });

        element.dataset.lettersDone = "true";
    });

    const interactiveCards = document.querySelectorAll(
        ".metric-item, .service-item, .mv-card, .testimonial-card, .info-card, .tree-node, .detail-card, .contact-panel, .video-card"
    );

    if (!prefersReducedMotion && finePointer) {
        interactiveCards.forEach((card) => {
            card.classList.add("interactive-card");

            card.addEventListener("pointermove", (event) => {
                const rect = card.getBoundingClientRect();
                const offsetX = (event.clientX - rect.left) / rect.width;
                const offsetY = (event.clientY - rect.top) / rect.height;
                const rotateY = (offsetX - 0.5) * 8;
                const rotateX = (0.5 - offsetY) * 8;

                card.style.setProperty("--card-rotate-x", `${rotateX.toFixed(2)}deg`);
                card.style.setProperty("--card-rotate-y", `${rotateY.toFixed(2)}deg`);
                card.style.setProperty("--card-shift", "-6px");
            });

            card.addEventListener("pointerleave", () => {
                card.style.setProperty("--card-rotate-x", "0deg");
                card.style.setProperty("--card-rotate-y", "0deg");
                card.style.setProperty("--card-shift", "0px");
            });
        });
    }
});
