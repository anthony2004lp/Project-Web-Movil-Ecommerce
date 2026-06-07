async function loadReports() {
    try {
        const res = await fetch("/api/admin/reportes/resumen", { headers: getAuthHeaders() });
        if (!res.ok) return;
        const data = await res.json();

        const summaryBody = document.querySelector('[data-report-summary]');
        if (summaryBody) {
            summaryBody.innerHTML = `
                <tr>
                    <td>${data.totalUsuarios ?? 0}</td>
                    <td>${data.totalProductos ?? 0}</td>
                    <td>${data.totalVentas ?? 0}</td>
                    <td>S/ ${Number(data.ventasDelMes ?? 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}</td>
                </tr>
            `;
        }
    } catch (e) {
        showToast("Error al cargar reportes", 'error');
    }
}

async function loadReportOrders() {
    try {
        const res = await fetch("/api/admin/ventas", { headers: getAuthHeaders() });
        if (!res.ok) return;
        const orders = await res.json();
        const tbody = document.querySelector('[data-report-orders]');
        if (!tbody) return;
        if (!Array.isArray(orders) || orders.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">No hay pedidos registrados</td></tr>';
            return;
        }
        tbody.innerHTML = orders.slice(0, 10).map(o => `
            <tr>
                <td>ORD-${String(o.idVenta).padStart(4, '0')}</td>
                <td>${o.cliente?.nombres ? o.cliente.nombres + ' ' + (o.cliente.apellidos || '') : 'Cliente #' + o.idCliente}</td>
                <td>${o.fecha ? new Date(o.fecha).toLocaleDateString() : '-'}</td>
                <td>${o.detalles ? o.detalles.length + ' producto(s)' : '-'}</td>
                <td><span class="badge-status ${(o.estado || '').toLowerCase()}">${o.estado}</span></td>
                <td>S/ ${Number(o.total).toFixed(2)}</td>
            </tr>
        `).join('');
    } catch (e) {
        const tbody = document.querySelector('[data-report-orders]');
        if (tbody) tbody.innerHTML = '<tr><td colspan="6">Error al cargar pedidos</td></tr>';
    }
}

async function loadLowStockProducts() {
    try {
        const res = await fetch("/api/admin/reportes/resumen", { headers: getAuthHeaders() });
        if (!res.ok) return;
        const data = await res.json();
        const tbody = document.querySelector('[data-report-low-stock]');
        if (!tbody) return;
        const lowStock = data.productosBajoStock || [];
        if (lowStock.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4">No hay productos con stock bajo</td></tr>';
            return;
        }
        tbody.innerHTML = lowStock.map(p => `
            <tr>
                <td>${p.nombre}</td>
                <td>ID: ${p.idProducto}</td>
                <td>-</td>
                <td>${p.stock} und.</td>
            </tr>
        `).join('');
    } catch (e) {
        showToast("Error al cargar stock bajo", 'error');
    }
}

async function loadInactiveProducts() {
    try {
        const res = await fetch("/api/admin/productos", { headers: getAuthHeaders() });
        if (!res.ok) return;
        const products = await res.json();
        const tbody = document.querySelector('[data-report-inactive-products]');
        if (!tbody) return;
        const inactive = Array.isArray(products) ? products.filter(p => !p.activo) : [];
        if (inactive.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="empty">No hay productos desactivados</td></tr>';
            return;
        }
        tbody.innerHTML = inactive.map(p => `
            <tr>
                <td>${p.nombre}</td>
                <td>ID: ${p.idProducto}</td>
                <td>${p.categoria?.nombre || '-'}</td>
                <td>S/ ${Number(p.precio).toFixed(2)}</td>
                <td><span class="status-badge inactive">Inactivo</span></td>
            </tr>
        `).join('');
    } catch (e) {
        showToast("Error al cargar productos", 'error');
    }
}

document.querySelectorAll(".export-btn").forEach((button) => {
    button.addEventListener("click", () => {
        const type = button.classList.contains("excel") ? "Excel" : "PDF";
        const card = button.closest(".report-card");
        const title = card ? card.querySelector("h2")?.textContent?.trim() : "Reporte";
        showToast(`Exportando ${title} en formato ${type}...`, 'info');
        setTimeout(() => showToast(`${title} exportado en ${type}`, 'success'), 1500);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    loadReports();
    loadReportOrders();
    loadLowStockProducts();
    loadInactiveProducts();
});