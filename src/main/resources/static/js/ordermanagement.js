document.querySelectorAll(".complete-btn").forEach((button) => {
    button.addEventListener("click", async () => {
        const row = button.closest("tr");
        const orderNumber = row.querySelector("a").textContent.trim();
        const confirmed = await showConfirm(
            `¿Marcar pedido <strong>${orderNumber}</strong> como completado?`,
            'success',
            'Completar'
        );
        if (confirmed) {
            showToast(`Pedido ${orderNumber} marcado como completado`, 'success');
        }
    });
});
