async function loadDashboard() {
    try {
        const res = await fetch("/api/admin/reportes/resumen", { headers: getAuthHeaders() });
        if (!res.ok) return;
        const data = await res.json();

        const ventasEl = document.querySelector("[data-admin-metric='ventasDelMes']");
        if (ventasEl) ventasEl.textContent = `S/ ${Number(data.ventasDelMes || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;

        const usuariosEl = document.querySelector("[data-admin-metric='usuariosActivos']");
        if (usuariosEl) usuariosEl.textContent = data.totalUsuarios || 0;

        const pedidosEl = document.querySelector("[data-admin-metric='pedidosPendientes']");
        if (pedidosEl) pedidosEl.textContent = data.totalVentas || 0;

        if (data.productosBajoStock && data.productosBajoStock.length > 0) {
            const bajoStock = data.productosBajoStock.map(p => `${p.nombre} (${p.stock} und.)`).join(', ');
            const pedidosTexto = document.querySelector("[data-admin-metric='pedidosTexto']");
            if (pedidosTexto) pedidosTexto.textContent = `Bajo stock: ${bajoStock}`;
        }

        const ventasTexto = document.querySelector("[data-admin-metric='ventasTexto']");
        if (ventasTexto && data.ventasPorMes && data.ventasPorMes.length > 1) {
            const actual = data.ventasPorMes[data.ventasPorMes.length - 1].total || 0;
            const anterior = data.ventasPorMes[data.ventasPorMes.length - 2].total || 0;
            if (anterior > 0) {
                const cambio = ((actual - anterior) / anterior * 100).toFixed(0);
                ventasTexto.textContent = `${cambio > 0 ? '+' : ''}${cambio}% vs mes anterior`;
            }
        }
    } catch (e) {
        console.error("Error loading dashboard:", e);
    }
}

document.addEventListener('DOMContentLoaded', loadDashboard);
