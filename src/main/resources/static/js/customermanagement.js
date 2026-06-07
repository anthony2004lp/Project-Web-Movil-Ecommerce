async function loadCustomers() {
    try {
        const res = await fetch("/api/admin/usuarios", { headers: getAuthHeaders() });
        if (!res.ok) return;
        const users = await res.json();
        const customers = users.filter(u => u.rol === 'CLIENTE');
        const tbody = document.getElementById("customerTableBody");
        if (!tbody) return;
        tbody.innerHTML = customers.map(u => `
            <tr data-user-id="${u.idUsuario}">
                <td>${u.nombres} ${u.apellidos}</td>
                <td>${u.email}${u.telefono ? '<br>' + u.telefono : ''}</td>
                <td><span class="status-badge ${u.activo ? 'active' : 'inactive'}">${u.activo ? 'Activo' : 'Inactivo'}</span></td>
                <td>
                    <button class="edit" data-id="${u.idUsuario}" data-nombres="${u.nombres}" data-apellidos="${u.apellidos || ''}" data-email="${u.email}">✏️</button>
                    <button class="reset" data-id="${u.idUsuario}" data-email="${u.email}">🔑</button>
                    <button class="toggle-status" data-id="${u.idUsuario}" data-activo="${u.activo}">${u.activo ? '🚫' : '✅'}</button>
                </td>
            </tr>
        `).join('');

        document.querySelectorAll(".edit").forEach(btn => editCustomer(btn));
        document.querySelectorAll(".reset").forEach(btn => resetPassword(btn));
        document.querySelectorAll(".toggle-status").forEach(btn => toggleStatus(btn));
    } catch (e) {
        showToast("Error al cargar clientes", 'error');
    }
}

function editCustomer(btn) {
    btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        const nombres = btn.dataset.nombres || '';
        const apellidos = btn.dataset.apellidos || '';
        const email = btn.dataset.email;
        const data = await showFormModal('Editar Cliente', `
            <label class="field">
                <span>Nombres</span>
                <input type="text" name="nombres" value="${nombres}" placeholder="Nombres" required>
            </label>
            <label class="field">
                <span>Apellidos</span>
                <input type="text" name="apellidos" value="${apellidos}" placeholder="Apellidos">
            </label>
            <label class="field">
                <span>Correo electrónico</span>
                <input type="email" name="email" value="${email}">
            </label>
        `, 'Guardar Cambios');
        if (!data) return;
        try {
            const res = await fetch(`/api/profile?usuarioId=${id}`, {
                method: "PUT",
                headers: getAuthHeaders(),
                body: JSON.stringify({ nombres: data.nombres, apellidos: data.apellidos || '', telefono: '' })
            });
            if (res.ok) {
                showToast(`Cliente actualizado`, 'success');
                loadCustomers();
            } else {
                showToast("Error al actualizar cliente", 'error');
            }
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
            showToast(`Funcionalidad de restablecimiento no disponible en el backend`, 'info');
        }
    });
}

function toggleStatus(btn) {
    btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        const activo = btn.dataset.activo === 'true';
        const confirmed = await showConfirm(`${activo ? 'Desactivar' : 'Activar'} cliente #${id}?`, 'warning', 'Confirmar');
        if (!confirmed) return;
        try {
            const res = await fetch(`/api/admin/usuarios/${id}/activar`, {
                method: "PUT",
                headers: getAuthHeaders(),
                body: JSON.stringify({ activo: !activo })
            });
            if (res.ok) {
                showToast(`Cliente ${!activo ? 'activado' : 'desactivado'}`, 'success');
                loadCustomers();
            } else {
                showToast("Error al cambiar estado", 'error');
            }
        } catch (e) {
            showToast("Error de conexión", 'error');
        }
    });
}

document.getElementById("newUserBtn").addEventListener("click", async () => {
    const data = await showFormModal('Nuevo Cliente', `
        <label class="field">
            <span>Nombre completo</span>
            <input type="text" name="nombres" placeholder="Nombre del cliente" required>
        </label>
        <label class="field">
            <span>Apellidos</span>
            <input type="text" name="apellidos" placeholder="Apellidos" required>
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
            <span>Contraseña</span>
            <input type="password" name="password" placeholder="••••••••" minlength="8">
        </label>
    `, 'Crear Cliente');
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
                telefono: data.telefono || ''
            })
        });
        if (res.ok) {
            showToast(`Cliente "${data.nombres}" creado`, 'success');
            loadCustomers();
        } else {
            const err = await res.json().catch(() => ({}));
            showToast(err.mensaje || "Error al crear cliente", 'error');
        }
    } catch (e) {
        showToast("Error de conexión", 'error');
    }
});

document.addEventListener('DOMContentLoaded', loadCustomers);
