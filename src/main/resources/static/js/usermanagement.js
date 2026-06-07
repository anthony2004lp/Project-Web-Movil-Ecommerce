async function loadUsers() {
    try {
        const res = await fetch("/api/admin/usuarios", { headers: getAuthHeaders() });
        if (!res.ok) return;
        const users = await res.json();
        const tbody = document.getElementById("userTableBody");
        if (!tbody) return;
        tbody.innerHTML = users.map(u => `
            <tr data-user-id="${u.idUsuario}">
                <td>${u.nombres} ${u.apellidos}</td>
                <td>${u.email}${u.telefono ? '<br>' + u.telefono : ''}</td>
                <td>${u.rol} · <span class="status-badge ${u.activo ? 'active' : 'inactive'}">${u.activo ? 'Activo' : 'Inactivo'}</span></td>
                <td>
                    <button class="edit-btn" data-id="${u.idUsuario}" data-nombre="${u.nombres} ${u.apellidos}" data-email="${u.email}" data-rol="${u.rol}">✏️</button>
                    <button class="reset-btn" data-id="${u.idUsuario}" data-email="${u.email}">🔑</button>
                    <button class="toggle-active" data-id="${u.idUsuario}" data-activo="${u.activo}">${u.activo ? '🚫' : '✅'}</button>
                </td>
            </tr>
        `).join('');

        document.querySelectorAll(".edit-btn").forEach(btn => editUser(btn));
        document.querySelectorAll(".reset-btn").forEach(btn => resetPassword(btn));
        document.querySelectorAll(".toggle-active").forEach(btn => toggleActive(btn));
    } catch (e) {
        showToast("Error al cargar usuarios", 'error');
    }
}

function editUser(btn) {
    btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        const nombre = btn.dataset.nombre;
        const email = btn.dataset.email;
        const currentRol = btn.dataset.rol;
        const data = await showFormModal('Editar Usuario', `
            <label class="field">
                <span>Nombre completo</span>
                <input type="text" name="nombres" value="${nombre}" required>
            </label>
            <label class="field">
                <span>Correo electrónico</span>
                <input type="email" name="email" value="${email}">
            </label>
            <label class="field">
                <span>Nuevo Rol</span>
                <select name="rol" style="width:100%;min-height:44px;border:1px solid var(--field-border);border-radius:var(--radius-field);background:var(--field-bg);font:inherit;padding:0 14px;">
                    <option value="1" ${currentRol === 'ADMINISTRADOR' ? 'selected' : ''}>Administrador</option>
                    <option value="2" ${currentRol === 'VENDEDOR' ? 'selected' : ''}>Vendedor</option>
                    <option value="3" ${currentRol === 'CLIENTE' ? 'selected' : ''}>Cliente</option>
                </select>
            </label>
        `, 'Guardar Cambios');
        if (!data) return;
        try {
            await fetch(`/api/admin/usuarios/${id}/rol`, {
                method: "PUT",
                headers: getAuthHeaders(),
                body: JSON.stringify({ idRol: Number(data.rol) })
            });
            showToast(`Usuario actualizado`, 'success');
            loadUsers();
        } catch (e) {
            showToast("Error de conexión", 'error');
        }
    });
}

function resetPassword(btn) {
    btn.addEventListener("click", async () => {
        const email = btn.dataset.email;
        const confirmed = await showConfirm(`¿Restablecer contraseña de <strong>${email}</strong>?`, 'warning', 'Restablecer');
        if (confirmed) {
            showToast(`Funcionalidad no disponible en el backend`, 'info');
        }
    });
}

function toggleActive(btn) {
    btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        const activo = btn.dataset.activo === 'true';
        const confirmed = await showConfirm(`${activo ? 'Desactivar' : 'Activar'} usuario #${id}?`, 'warning', 'Confirmar');
        if (!confirmed) return;
        try {
            const res = await fetch(`/api/admin/usuarios/${id}/activar`, {
                method: "PUT",
                headers: getAuthHeaders(),
                body: JSON.stringify({ activo: !activo })
            });
            if (res.ok) {
                showToast(`Usuario ${!activo ? 'activado' : 'desactivado'}`, 'success');
                loadUsers();
            } else {
                showToast("Error al cambiar estado", 'error');
            }
        } catch (e) {
            showToast("Error de conexión", 'error');
        }
    });
}

document.getElementById("newClientBtn").addEventListener("click", async () => {
    const data = await showFormModal('Nuevo Usuario', `
        <label class="field">
            <span>Nombres</span>
            <input type="text" name="nombres" placeholder="Nombres" required>
        </label>
        <label class="field">
            <span>Apellidos</span>
            <input type="text" name="apellidos" placeholder="Apellidos" required>
        </label>
        <label class="field">
            <span>Correo electrónico</span>
            <input type="email" name="email" placeholder="usuario@ejemplo.com" required>
        </label>
        <label class="field">
            <span>Rol</span>
            <select name="rol" style="width:100%;min-height:44px;border:1px solid var(--field-border);border-radius:var(--radius-field);background:var(--field-bg);font:inherit;padding:0 14px;">
                <option value="3">Cliente</option>
                <option value="2">Vendedor</option>
                <option value="1">Administrador</option>
            </select>
        </label>
        <label class="field">
            <span>Contraseña</span>
            <input type="password" name="password" placeholder="••••••••" minlength="8">
        </label>
    `, 'Crear Usuario');
    if (!data) return;
    try {
        const res = await fetch("/api/usuarios/registro", {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({
                email: data.email,
                password: data.password,
                nombres: data.nombres,
                apellidos: data.apellidos,
                telefono: ''
            })
        });
        if (res.status === 201) {
            showToast(`Usuario "${data.nombres}" creado`, 'success');
            loadUsers();
        } else {
            const err = await res.json().catch(() => ({}));
            showToast(err.mensaje || "Error al crear usuario", 'error');
        }
    } catch (e) {
        showToast("Error de conexión", 'error');
    }
});

document.addEventListener('DOMContentLoaded', loadUsers);
