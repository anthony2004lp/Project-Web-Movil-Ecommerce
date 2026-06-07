async function loadOrders() {
    const userId = getUserId();
    if (!userId) {
        document.querySelector(".orders-list").innerHTML = '<p style="text-align:center;padding:40px;color:var(--text-secondary);">Inicia sesión para ver tus pedidos</p>';
        return;
    }
    try {
        const res = await fetch(`/api/ventas/mis-ventas?clienteId=${userId}`, { headers: getAuthHeaders() });
        if (res.status === 404) {
            document.querySelector(".orders-list").innerHTML = '<p style="text-align:center;padding:40px;color:var(--text-secondary);">El endpoint de pedidos no está disponible</p>';
            return;
        }
        if (!res.ok) {
            const errText = await res.text().catch(() => '');
            document.querySelector(".orders-list").innerHTML = `<p style="text-align:center;padding:40px;color:var(--text-secondary);">Error al cargar pedidos (${res.status})</p>`;
            return;
        }
        const orders = await res.json();
        const list = document.querySelector(".orders-list");
        if (!Array.isArray(orders) || orders.length === 0) {
            list.innerHTML = '<p style="text-align:center;padding:40px;color:var(--text-secondary);">No hay pedidos aún</p>';
            return;
        }
        list.innerHTML = orders.map(o => {
            const estado = o.estado || 'PENDIENTE';
            const estadoClass = estado.toLowerCase().replace(/_/g, '-');
            const detalles = Array.isArray(o.detalles) ? o.detalles : (o.ventaDetalles || []);
            return `
            <article class="order-card" data-order-id="${o.idVenta}">
                <div class="order-header">
                    <div>
                        <h2>ORD-${String(o.idVenta).padStart(4, '0')}</h2>
                        <span>${o.fecha ? new Date(o.fecha).toLocaleDateString() : '-'}</span>
                    </div>
                    <strong class="badge ${estadoClass}">${estado}</strong>
                </div>
                ${detalles.slice(0, 3).map(d => `
                    <div class="order-product">
                        <div class="product-icon">📦</div>
                        <div>
                            <p>${d.nombreProducto || d.producto?.nombre || 'Producto'} x${d.cantidad}</p>
                            <strong>S/ ${Number(d.subtotal || d.precioUnitario * d.cantidad || 0).toFixed(2)}</strong>
                        </div>
                    </div>
                `).join('')}
                ${Number(o.costoEnvio) > 0 ? `<div style="padding:0 24px 8px;color:var(--text-secondary);font-size:0.85rem;">Envío: S/ ${Number(o.costoEnvio).toFixed(2)}</div>` : ''}
                <div style="padding:0 24px 12px;font-weight:900;font-size:1.1rem;color:var(--primary);">Total: S/ ${Number(o.total).toFixed(2)}</div>
            </article>`;
        }).join('');
    } catch (e) {
        const list = document.querySelector(".orders-list");
        if (list) list.innerHTML = `<p style="text-align:center;padding:40px;color:var(--text-secondary);">Error de conexión: ${e.message}</p>`;
    }
}

document.addEventListener('DOMContentLoaded', loadOrders);