document.getElementById("newClientBtn").addEventListener("click", () => {
    alert("Abrir formulario para crear cliente");
});

document.querySelectorAll(".reset-btn").forEach((button) => {
    button.addEventListener("click", () => {
        const row = button.closest("tr");
        const email = row.children[1].textContent.trim();

        alert(`Restablecer contraseña de ${email}`);
    });
});
