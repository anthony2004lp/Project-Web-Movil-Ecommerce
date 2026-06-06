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

document.getElementById("newProductBtn").addEventListener("click", async () => {
    const data = await showFormModal('Nuevo Producto', `
        <label class="field">
            <span>Nombre del producto</span>
            <input type="text" name="nombre" placeholder="Nombre del producto" required>
        </label>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <label class="field">
                <span>SKU</span>
                <input type="text" name="sku" placeholder="PRO-001" required>
            </label>
            <label class="field">
                <span>Categoría</span>
                <select name="categoria" style="width:100%;min-height:44px;border:1px solid var(--field-border);border-radius:var(--radius-field);background:var(--field-bg);font:inherit;padding:0 14px;">
                    <option value="Panel HMI">Panel HMI</option>
                    <option value="PLC">PLC</option>
                    <option value="Modulo Remoto">Módulo Remoto</option>
                </select>
            </label>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <label class="field">
                <span>Precio (S/)</span>
                <input type="number" name="precio" placeholder="0.00" step="0.01" required>
            </label>
            <label class="field">
                <span>Stock</span>
                <input type="number" name="stock" placeholder="0" required>
            </label>
        </div>
    `, 'Crear Producto');
    if (data) {
        showToast(`Producto "${data.nombre}" creado correctamente`, 'success');
    }
});

document.querySelectorAll(".edit-btn").forEach((button) => {
    button.addEventListener("click", async () => {
        const card = button.closest(".admin-product-card");
        const name = card.querySelector("h2").textContent.trim();
        const data = await showFormModal('Editar Producto', `
            <label class="field">
                <span>Nombre del producto</span>
                <input type="text" name="nombre" value="${name}" required>
            </label>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                <label class="field">
                    <span>Precio (S/)</span>
                    <input type="number" name="precio" placeholder="0.00" step="0.01">
                </label>
                <label class="field">
                    <span>Stock</span>
                    <input type="number" name="stock" placeholder="0">
                </label>
            </div>
        `, 'Guardar Cambios');
        if (data) {
            showToast(`Producto "${data.nombre}" actualizado`, 'success');
        }
    });
});

document.querySelectorAll(".activate-btn, .deactivate-btn").forEach((button) => {
    button.addEventListener("click", async () => {
        const card = button.closest(".admin-product-card");
        const name = card.querySelector("h2").textContent.trim();
        const isActive = button.classList.contains("activate-btn");
        const confirmed = await showConfirm(
            `¿${isActive ? 'Activar' : 'Desactivar'} producto <strong>${name}</strong>?`,
            'warning',
            isActive ? 'Activar' : 'Desactivar'
        );
        if (!confirmed) return;
        const badge = card.querySelector(".status-badge");
        if (isActive) {
            card.dataset.status = "activo";
            badge.className = "status-badge active";
            badge.textContent = "Activo";
            button.className = "deactivate-btn";
            button.textContent = "Desactivar";
            showToast(`Producto "${name}" activado`, 'success');
        } else {
            card.dataset.status = "inactivo";
            badge.className = "status-badge inactive";
            badge.textContent = "Inactivo";
            button.className = "activate-btn";
            button.textContent = "Activar";
            showToast(`Producto "${name}" desactivado`, 'info');
        }
        filterProducts();
    });
});

filterProducts();
