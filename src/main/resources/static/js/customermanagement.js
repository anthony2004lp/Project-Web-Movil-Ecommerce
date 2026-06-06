document.getElementById("newUserBtn").addEventListener("click", async () => {
    const data = await showFormModal('Nuevo Cliente', `
        <label class="field">
            <span>Nombre completo</span>
            <input type="text" name="nombre" placeholder="Nombre del cliente" required>
        </label>
        <label class="field">
            <span>Correo electrónico</span>
            <input type="email" name="email" placeholder="cliente@ejemplo.com" required>
        </label>
        <label class="field">
            <span>Teléfono</span>
            <input type="tel" name="telefono" placeholder="+51 999 999 999">
        </label>
        <label class="field">
            <span>Dirección</span>
            <input type="text" name="direccion" placeholder="Dirección completa">
        </label>
    `, 'Crear Cliente');
    if (data) {
        showToast(`Cliente "${data.nombre}" creado correctamente`, 'success');
    }
});

document.querySelectorAll(".reset").forEach((button) => {
    button.addEventListener("click", async () => {
        const row = button.closest("tr");
        const email = row.children[1].textContent.trim();
        const confirmed = await showConfirm(`¿Restablecer contraseña de <strong>${email}</strong>?`, 'warning', 'Restablecer');
        if (confirmed) {
            showToast(`Contraseña restablecida para ${email}`, 'success');
        }
    });
});

document.querySelectorAll(".edit").forEach((button) => {
    button.addEventListener("click", async () => {
        const row = button.closest("tr");
        const name = row.children[0].textContent.trim();
        const data = await showFormModal('Editar Cliente', `
            <label class="field">
                <span>Nombre completo</span>
                <input type="text" name="nombre" value="${name}" required>
            </label>
            <label class="field">
                <span>Correo electrónico</span>
                <input type="email" name="email" value="${row.children[1].textContent.trim()}">
            </label>
        `, 'Guardar Cambios');
        if (data) {
            showToast(`Cliente "${data.nombre}" actualizado`, 'success');
        }
    });
});
