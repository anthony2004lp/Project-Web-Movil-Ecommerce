const searchInput = document.getElementById("searchInput");
const products = Array.from(document.querySelectorAll(".product-card"));
const cartCount = document.getElementById("cartCount");
const filterButtons = Array.from(document.querySelectorAll(".filter-option"));

let selectedCategory = "Todos";
let selectedPrice = "Todos";
let selectedStock = "con";
let count = 0;

function matchesPrice(price, range) {
    if (range === "Todos") return true;

    if (range === "0-1500") {
        return price >= 500 && price <= 1500;
    }

    if (range === "1500-3000") {
        return price >= 1500 && price <= 3000;
    }

    if (range === "3000") {
        return price >= 3000;
    }

    return true;
}

function filterProducts() {
    const search = searchInput.value.trim().toLowerCase();

    products.forEach((product) => {
        const name = product.dataset.name.toLowerCase();
        const category = product.dataset.category;
        const price = Number(product.dataset.price);
        const stock = product.dataset.stock;

        const bySearch = name.includes(search) || category.toLowerCase().includes(search);
        const byCategory = selectedCategory === "Todos" || category === selectedCategory;
        const byPrice = matchesPrice(price, selectedPrice);
        const byStock = selectedStock === "Todos" || stock === selectedStock;

        product.classList.toggle("hidden", !(bySearch && byCategory && byPrice && byStock));
    });
}

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const group = button.closest(".filter-group");

        group.querySelectorAll(".filter-option").forEach((item) => {
            item.classList.remove("active");
        });

        button.classList.add("active");

        if (button.dataset.category) {
            selectedCategory = button.dataset.category;
        }

        if (button.dataset.price) {
            selectedPrice = button.dataset.price;
        }

        if (button.dataset.stock) {
            selectedStock = button.dataset.stock;
        }

        filterProducts();
    });
});

document.querySelectorAll(".add-btn").forEach((button) => {
    button.addEventListener("click", () => {
        count += 1;
        cartCount.textContent = count;
    });
});

searchInput.addEventListener("input", filterProducts);
filterProducts();
