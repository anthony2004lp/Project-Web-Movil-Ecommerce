function getProfileUserId() {
    return getUserId();
}

async function loadProfile() {
    const userId = getProfileUserId();
    if (!userId) return;
    try {
        const res = await fetch(`/api/profile?usuarioId=${userId}`, { headers: getAuthHeaders() });
        if (!res.ok) return;
        const data = await res.json();
        const rol = getUserRol() || 'CLIENTE';
        document.querySelectorAll('[data-user-field="nombre"]').forEach(el => { el.textContent = data.nombres || '-'; if (el.tagName === 'INPUT') el.value = data.nombres || '-'; });
        document.querySelectorAll('[data-user-field="apellido"]').forEach(el => { el.textContent = data.apellidos || '-'; if (el.tagName === 'INPUT') el.value = data.apellidos || '-'; });
        document.querySelectorAll('[data-user-field="email"]').forEach(el => { el.textContent = data.email || '-'; if (el.tagName === 'INPUT') el.value = data.email || '-'; });
        document.querySelectorAll('[data-user-field="telefono"]').forEach(el => { el.textContent = data.telefono || '-'; if (el.tagName === 'INPUT') el.value = data.telefono || '-'; });
        document.querySelectorAll('[data-user-field="role"]').forEach(el => {
            const roleNames = { 'ADMINISTRADOR': 'Administrador', 'VENDEDOR': 'Vendedor', 'CLIENTE': 'Cliente' };
            el.textContent = roleNames[rol] || rol;
            if (el.tagName === 'INPUT') el.value = roleNames[rol] || rol;
        });
    } catch (e) {
        console.error("Error loading profile:", e);
    }
}

async function loadAddresses() {
    const userId = getProfileUserId();
    if (!userId) return;
    try {
        const res = await fetch(`/api/direcciones?usuarioId=${userId}`, { headers: getAuthHeaders() });
        if (!res.ok) return;
        const addresses = await res.json();
        const container = document.querySelector(".addresses-grid") || document.getElementById("addressContainer");
        if (!container) return;
        container.innerHTML = addresses.map(a => `
            <article class="address-card" data-address-id="${a.idDireccion}">
                <h3>${a.alias}</h3>
                <p>${a.direccion}${a.ciudad ? '<br>' + a.ciudad : ''}</p>
                <div>
                    <button class="edit-address" data-id="${a.idDireccion}" data-alias="${a.alias}" data-direccion="${a.direccion}" data-ciudad="${a.ciudad || ''}">✏️</button>
                    <button class="delete-address" data-id="${a.idDireccion}" data-alias="${a.alias}">🗑️</button>
                </div>
            </article>
        `).join('');

        document.querySelectorAll(".edit-address").forEach(btn => editAddress(btn));
        document.querySelectorAll(".delete-address").forEach(btn => deleteAddress(btn));
    } catch (e) {
        showToast("Error al cargar direcciones", 'error');
    }
}

document.getElementById("addAddressBtn")?.addEventListener("click", async () => {
    const uid = getProfileUserId();
    if (!uid) return showToast("Debes iniciar sesión", 'error');
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
    if (!data) return;
    try {
        const res = await fetch(`/api/direcciones?usuarioId=${uid}`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        if (res.ok) {
            showToast(`Dirección "${data.alias}" agregada`, 'success');
            loadAddresses();
        } else {
            showToast("Error al agregar dirección", 'error');
        }
    } catch (e) {
        showToast("Error de conexión", 'error');
    }
});

function editAddress(btn) {
    btn.addEventListener("click", async () => {
        const uid = getProfileUserId();
        if (!uid) return;
        const id = btn.dataset.id;
        const data = await showFormModal('Editar Dirección', `
            <label class="field">
                <span>Alias</span>
                <input type="text" name="alias" value="${btn.dataset.alias}" required>
            </label>
            <label class="field">
                <span>Dirección</span>
                <input type="text" name="direccion" value="${btn.dataset.direccion}">
            </label>
            <label class="field">
                <span>Ciudad</span>
                <input type="text" name="ciudad" value="${btn.dataset.ciudad}">
            </label>
        `, 'Guardar Cambios');
        if (!data) return;
        try {
            const res = await fetch(`/api/direcciones?usuarioId=${uid}`, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify(data)
            });
            if (res.ok) {
                showToast(`Dirección "${data.alias}" actualizada`, 'success');
                loadAddresses();
            } else {
                showToast("Error al actualizar dirección", 'error');
            }
        } catch (e) {
            showToast("Error de conexión", 'error');
        }
    });
}

function deleteAddress(btn) {
    btn.addEventListener("click", async () => {
        const uid = getProfileUserId();
        if (!uid) return;
        const id = btn.dataset.id;
        const alias = btn.dataset.alias;
        const confirmed = await showConfirm(`¿Eliminar dirección <strong>${alias}</strong>?`, 'danger', 'Eliminar');
        if (!confirmed) return;
        try {
            const res = await fetch(`/api/direcciones/${id}?usuarioId=${uid}`, {
                method: "DELETE",
                headers: getAuthHeaders()
            });
            if (res.ok) {
                showToast(`Dirección "${alias}" eliminada`, 'info');
                loadAddresses();
            } else {
                showToast("Error al eliminar dirección", 'error');
            }
        } catch (e) {
            showToast("Error de conexión", 'error');
        }
    });
}

document.querySelectorAll('[data-logout]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });
});

document.addEventListener('DOMContentLoaded', () => {
    loadProfile();
    loadAddresses();
});
