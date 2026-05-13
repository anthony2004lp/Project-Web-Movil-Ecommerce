document.querySelectorAll(".export-btn").forEach((button) => {
    button.addEventListener("click", () => {
        const type = button.classList.contains("excel") ? "Excel" : "PDF";
        const card = button.closest(".report-card");
        const title = card.querySelector("h2").textContent.trim();

        alert(`Exportando ${title} en ${type}`);
    });
});
