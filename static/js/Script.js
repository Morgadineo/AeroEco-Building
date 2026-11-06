"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector(".menu-toggle");
    const mainNav = document.querySelector(".main-nav");
    const navLinks = document.querySelectorAll(".main-nav a");

    const contactForm = document.querySelector("#form-contato");
    const formFeedback = document.querySelector("#form-feedback");

    const yearElement = document.querySelector("#ano-atual");
    const flashMessages = document.querySelectorAll(".flash-message");

    const mobileBreakpoint = window.matchMedia("(max-width: 1023px)");
    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    /*
     * Ano dinâmico.
     */
    if (yearElement) {
        yearElement.textContent = String(new Date().getFullYear());
    }

    /*
     * Menu responsivo.
     */
    function closeMenu() {
        if (!menuToggle || !mainNav) {
            return;
        }

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menu de navegação");
        mainNav.classList.remove("is-open");
        document.body.classList.remove("menu-open");
    }

    function openMenu() {
        if (!menuToggle || !mainNav) {
            return;
        }

        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Fechar menu de navegação");
        mainNav.classList.add("is-open");
        document.body.classList.add("menu-open");
    }

    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", () => {
            const isExpanded =
                menuToggle.getAttribute("aria-expanded") === "true";

            if (isExpanded) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        navLinks.forEach((link) => {
            link.addEventListener("click", () => {
                closeMenu();
            });
        });

        document.addEventListener("keydown", (event) => {
            if (
                event.key === "Escape" &&
                menuToggle.getAttribute("aria-expanded") === "true"
            ) {
                closeMenu();
                menuToggle.focus();
            }
        });

        document.addEventListener("click", (event) => {
            if (
                menuToggle.getAttribute("aria-expanded") === "true" &&
                !mainNav.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                closeMenu();
            }
        });

        mobileBreakpoint.addEventListener("change", (event) => {
            if (!event.matches) {
                closeMenu();
            }
        });
    }

    /*
     * Navegação suave para âncoras da própria página.
     * O navegador mantém o comportamento nativo quando o usuário
     * prefere movimento reduzido.
     */
    document.querySelectorAll('a[href*="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const destination = new URL(link.href, window.location.href);

            const isSamePage =
                destination.origin === window.location.origin &&
                destination.pathname === window.location.pathname &&
                destination.hash.length > 1;

            if (!isSamePage) {
                return;
            }

            const target = document.querySelector(
                `#${CSS.escape(
                    decodeURIComponent(destination.hash.slice(1))
                )}`
            );

            if (!target) {
                return;
            }

            event.preventDefault();
            closeMenu();

            if (window.location.hash !== destination.hash) {
                window.history.pushState(null, "", destination.hash);
            }

            target.scrollIntoView({
                behavior: reducedMotion.matches ? "auto" : "smooth",
                block: "start",
            });
        });
    });

    /*
     * Animações de entrada com IntersectionObserver.
     * Se não houver suporte, o conteúdo permanece visível.
     */
    const revealElements = document.querySelectorAll(".reveal");

    if (
        "IntersectionObserver" in window &&
        !reducedMotion.matches &&
        revealElements.length > 0
    ) {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -35px 0px",
            }
        );

        /*
         * Só ocultamos os elementos quando o observador está pronto.
         */
        document.documentElement.classList.add("motion-ready");

        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });
    }

    /*
     * Fechamento de mensagens flash.
     */
    flashMessages.forEach((message) => {
        const closeButton = message.querySelector(".flash-close");

        if (!closeButton) {
            return;
        }

        closeButton.addEventListener("click", () => {
            message.remove();
        });
    });

    /*
     * Validação client-side do formulário.
     * Os dados válidos seguem para o Flask, que valida novamente.
     */
    if (contactForm) {
        const fields = [
            {
                input: contactForm.querySelector("#nome"),
                error: contactForm.querySelector("#erro-nome"),
                validate(value) {
                    if (!value) {
                        return "Informe seu nome.";
                    }

                    if (value.length > 100) {
                        return "O nome deve ter no máximo 100 caracteres.";
                    }

                    return "";
                },
            },
            {
                input: contactForm.querySelector("#email"),
                error: contactForm.querySelector("#erro-email"),
                validate(value) {
                    if (!value) {
                        return "Informe seu e-mail.";
                    }

                    if (value.length > 254) {
                        return "O e-mail deve ter no máximo 254 caracteres.";
                    }

                    const emailPattern =
                        /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;

                    if (!emailPattern.test(value)) {
                        return "Informe um endereço de e-mail válido.";
                    }

                    return "";
                },
            },
            {
                input: contactForm.querySelector("#mensagem"),
                error: contactForm.querySelector("#erro-mensagem"),
                validate(value) {
                    if (!value) {
                        return "Escreva uma mensagem.";
                    }

                    if (value.length < 10) {
                        return "A mensagem deve ter pelo menos 10 caracteres.";
                    }

                    if (value.length > 3000) {
                        return "A mensagem deve ter no máximo 3000 caracteres.";
                    }

                    return "";
                },
            },
        ];

        function validateField(field) {
            const value = field.input.value.trim();
            const errorMessage = field.validate(value);

            field.error.textContent = errorMessage;

            if (errorMessage) {
                field.input.setAttribute("aria-invalid", "true");
            } else {
                field.input.removeAttribute("aria-invalid");
            }

            return errorMessage.length === 0;
        }

        fields.forEach((field) => {
            field.input.addEventListener("blur", () => {
                validateField(field);
            });

            field.input.addEventListener("input", () => {
                if (field.input.hasAttribute("aria-invalid")) {
                    validateField(field);
                }

                if (formFeedback) {
                    formFeedback.textContent = "";
                    formFeedback.className = "form-feedback";
                }
            });
        });

        contactForm.addEventListener("submit", (event) => {
            let firstInvalidField = null;

            if (formFeedback) {
                formFeedback.textContent = "";
                formFeedback.className = "form-feedback";
            }

            fields.forEach((field) => {
                const isValid = validateField(field);

                if (!isValid && !firstInvalidField) {
                    firstInvalidField = field.input;
                }
            });

            if (firstInvalidField) {
                event.preventDefault();

                if (formFeedback) {
                    formFeedback.textContent =
                        "Revise os campos destacados antes de continuar.";
                    formFeedback.classList.add("feedback-error");
                }

                firstInvalidField.focus();
                return;
            }

            /*
             * Não interceptamos o envio válido.
             * O navegador envia os campos por POST ao Flask,
             * que realiza a validação server-side.
             *
             * O backend não envia e-mails neste MVP.
             */
        });
    }
});