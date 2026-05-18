const form = document.getElementById("registerForm");
const message = document.getElementById("formMessage");
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const navActions = document.querySelector(".nav-actions");

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const fields = [...form.querySelectorAll("input")];
    fields.forEach((field) => field.classList.remove("invalid"));
    message.textContent = "";
    message.classList.remove("success");

    let hasErrors = false;

    fields.forEach((field) => {
        if (!field.checkValidity()) {
            field.classList.add("invalid");
            hasErrors = true;
        }
        if (menuToggle && mainNav && navActions) {
            menuToggle.addEventListener("click", () => {
                const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
                menuToggle.setAttribute("aria-expanded", String(!isOpen));
                mainNav.classList.toggle("open");
                navActions.classList.toggle("open");
            });

            const password = form.elements.password;
            const confirmPassword = form.elements.confirmPassword;

            if (password.value !== confirmPassword.value) {
                password.classList.add("invalid");
                confirmPassword.classList.add("invalid");
                message.textContent = "Las contraseñas no coinciden.";
                return;
            }

            if (hasErrors) {
                message.textContent = "Completa correctamente todos los campos.";
                return;
            }

            message.textContent = "Formulario listo para conectar con tu backend Spring Boot.";
            message.classList.add("success");
        });

form.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", () => {
        input.classList.remove("invalid");
        if (message.textContent) {
            message.textContent = "";
            message.classList.remove("success");
        }
    });
});
})
