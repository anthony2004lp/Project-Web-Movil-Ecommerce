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
    button.addEventListener("click", () => {
        button.closest(".cart-item").remove();
        updateCart();
    });
});

document.querySelector(".payment-form").addEventListener("submit", (event) => {
    event.preventDefault();
    alert("Pago confirmado correctamente");
});

updateCart();
