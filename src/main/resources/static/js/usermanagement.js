document.getElementById("newClientBtn").addEventListener("click", async () => {
    const data = await showFormModal('Nuevo Usuario', `
        <label class="field">
            <span>Nombre completo</span>
            <input type="text" name="nombre" placeholder="Nombre del usuario" required>
        </label>
        <label class="field">
            <span>Correo electrónico</span>
            <input type="email" name="email" placeholder="usuario@ejemplo.com" required>
        </label>
        <label class="field">
            <span>Rol</span>
            <select name="rol" style="width:100%;min-height:44px;border:1px solid var(--field-border);border-radius:var(--radius-field);background:var(--field-bg);font:inherit;padding:0 14px;">
                <option value="CLIENTE">Cliente</option>
                <option value="VENDEDOR">Trabajador</option>
                <option value="ADMINISTRADOR">Administrador</option>
            </select>
        </label>
        <label class="field">
            <span>Contraseña</span>
            <input type="password" name="password" placeholder="••••••••" minlength="6">
        </label>
    `, 'Crear Usuario');
    if (data) {
        showToast(`Usuario "${data.nombre}" creado correctamente`, 'success');
    }
});

document.querySelectorAll(".reset-btn").forEach((button) => {
    button.addEventListener("click", async () => {
        const row = button.closest("tr");
        const email = row.children[1].textContent.trim();
        const confirmed = await showConfirm(`¿Restablecer contraseña de <strong>${email}</strong>?`, 'warning', 'Restablecer');
        if (confirmed) {
            showToast(`Contraseña restablecida para ${email}`, 'success');
        }
    });
});
