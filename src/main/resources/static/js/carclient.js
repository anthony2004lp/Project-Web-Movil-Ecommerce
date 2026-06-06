const subtotalElement = document.getElementById("subtotal");
const taxElement = document.getElementById("tax");
const totalElement = document.getElementById("total");
const cartCountElement = document.getElementById("cartCount");

function formatCurrency(value) {
    return `S/ ${value.toLocaleString("es-PE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}

function updateCart() {
    const items = Array.from(document.querySelectorAll(".cart-item"));
    let subtotal = 0;
    let count = 0;
    items.forEach((item) => {
        const price = Number(item.dataset.price);
        const quantity = Number(item.querySelector(".qty-value").textContent);
        subtotal += price * quantity;
        count += quantity;
        item.querySelector(".item-price").textContent = formatCurrency(price * quantity);
    });
    const tax = subtotal * 0.18;
    const total = subtotal + tax;
    subtotalElement.textContent = formatCurrency(subtotal);
    taxElement.textContent = formatCurrency(tax);
    totalElement.textContent = formatCurrency(total);
    cartCountElement.textContent = count;
}

document.querySelectorAll(".plus").forEach((button) => {
    button.addEventListener("click", () => {
        const value = button.parentElement.querySelector(".qty-value");
        value.textContent = Number(value.textContent) + 1;
        updateCart();
    });
});

document.querySelectorAll(".minus").forEach((button) => {
    button.addEventListener("click", () => {
        const value = button.parentElement.querySelector(".qty-value");
        const current = Number(value.textContent);
        if (current > 1) {
            value.textContent = current - 1;
            updateCart();
        }
    });
});

document.querySelectorAll(".remove-btn").forEach((button) => {
    button.addEventListener("click", async () => {
        const item = button.closest(".cart-item");
        const name = item.querySelector("h2").textContent.trim();
        const confirmed = await showConfirm(`¿Eliminar <strong>${name}</strong> del carrito?`, 'danger', 'Eliminar');
        if (confirmed) {
            item.remove();
            updateCart();
            showToast(`"${name}" eliminado del carrito`, 'info');
        }
    });
});

document.querySelector(".payment-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const confirmed = await showConfirm(`¿Confirmar el pago por <strong>${totalElement.textContent}</strong>?`, 'success', 'Pagar');
    if (confirmed) {
        showToast('Pago confirmado correctamente', 'success');
    }
});

updateCart();
