document.querySelectorAll(".order-card").forEach((card) => {
    card.addEventListener("click", () => {
        const order = card.querySelector("h2").textContent.trim();
        showToast(`Pedido ${order} seleccionado`, 'info');
    });
});
