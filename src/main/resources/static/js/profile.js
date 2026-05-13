document.getElementById("addAddressBtn").addEventListener("click", () => {
    alert("Abrir formulario para agregar dirección");
});

document.querySelectorAll(".address-card button").forEach((button) => {
    button.addEventListener("click", () => {
        const card = button.closest(".address-card");
        const title = card.querySelector("h3").textContent.trim();

        if (button.classList.contains("delete")) {
            alert(`Eliminar dirección: ${title}`);
            return;
        }

        alert(`Editar dirección: ${title}`);
    });
});
