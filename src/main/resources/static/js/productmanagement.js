const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const products = Array.from(document.querySelectorAll(".admin-product-card"));

function filterProducts() {
    const search = searchInput.value.trim().toLowerCase();
    const status = statusFilter.value;

    products.forEach((product) => {
        const name = product.dataset.name.toLowerCase();
        const productStatus = product.dataset.status;

        const matchesSearch = name.includes(search);
        const matchesStatus = status === "todos" || productStatus === status;

        product.classList.toggle("hidden", !(matchesSearch && matchesStatus));
    });
}

searchInput.addEventListener("input", filterProducts);
statusFilter.addEventListener("change", filterProducts);

document.getElementById("newProductBtn").addEventListener("click", () => {
    alert("Abrir formulario para crear producto");
});

document.querySelectorAll(".edit-btn").forEach((button) => {
    button.addEventListener("click", () => {
        const card = button.closest(".admin-product-card");
        const name = card.querySelector("h2").textContent.trim();

        alert(`Editar producto: ${name}`);
    });
});

document.querySelectorAll(".activate-btn, .deactivate-btn").forEach((button) => {
    button.addEventListener("click", () => {
        const card = button.closest(".admin-product-card");
        const badge = card.querySelector(".status-badge");

        if (button.classList.contains("activate-btn")) {
            card.dataset.status = "activo";
            badge.className = "status-badge active";
            badge.textContent = "Activo";
            button.className = "deactivate-btn";
            button.textContent = "Desactivar";
        } else {
            card.dataset.status = "inactivo";
            badge.className = "status-badge inactive";
            badge.textContent = "Inactivo";
            button.className = "activate-btn";
            button.textContent = "Activar";
        }

        filterProducts();
    });
});

filterProducts();
