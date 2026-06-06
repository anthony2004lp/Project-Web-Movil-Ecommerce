document.getElementById("addAddressBtn").addEventListener("click", async () => {
    const data = await showFormModal('Agregar Dirección', `
        <label class="field">
            <span>Alias</span>
            <input type="text" name="alias" placeholder="Ej: Casa, Trabajo" required>
        </label>
        <label class="field">
            <span>Dirección</span>
            <input type="text" name="direccion" placeholder="Dirección completa" required>
        </label>
        <label class="field">
            <span>Ciudad</span>
            <input type="text" name="ciudad" placeholder="Ciudad">
        </label>
    `, 'Agregar');
    if (data) {
        showToast(`Dirección "${data.alias}" agregada`, 'success');
    }
});

document.querySelectorAll(".address-card button").forEach((button) => {
    button.addEventListener("click", async () => {
        const card = button.closest(".address-card");
        const title = card.querySelector("h3").textContent.trim();
        if (button.classList.contains("delete")) {
            const confirmed = await showConfirm(`¿Eliminar dirección <strong>${title}</strong>?`, 'danger', 'Eliminar');
            if (confirmed) {
                card.remove();
                showToast(`Dirección "${title}" eliminada`, 'info');
            }
            return;
        }
        const data = await showFormModal('Editar Dirección', `
            <label class="field">
                <span>Alias</span>
                <input type="text" name="alias" value="${title}" required>
            </label>
            <label class="field">
                <span>Dirección</span>
                <input type="text" name="direccion" placeholder="Dirección completa">
            </label>
        `, 'Guardar Cambios');
        if (data) {
            showToast(`Dirección "${data.alias}" actualizada`, 'success');
        }
    });
});
