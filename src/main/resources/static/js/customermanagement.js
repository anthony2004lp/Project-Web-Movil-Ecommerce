document.getElementById("newUserBtn").addEventListener("click", () => {
    alert("Abrir formulario para crear nuevo usuario");
});

document.querySelectorAll(".reset").forEach((button) => {
    button.addEventListener("click", () => {
        const row = button.closest("tr");
        const email = row.children[1].textContent.trim();

        alert(`Restablecer contraseña de ${email}`);
    });
});

document.querySelectorAll(".edit").forEach((button) => {
    button.addEventListener("click", () => {
        const row = button.closest("tr");
        const name = row.children[0].textContent.trim();

        alert(`Editar usuario: ${name}`);
    });
});
