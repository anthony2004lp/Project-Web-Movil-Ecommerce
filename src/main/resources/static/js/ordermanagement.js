document.querySelectorAll(".complete-btn").forEach((button) => {
    button.addEventListener("click", () => {
        const row = button.closest("tr");
        const orderNumber = row.querySelector("a").textContent.trim();

        alert(`Pedido ${orderNumber} marcado como completo`);
    });
});
