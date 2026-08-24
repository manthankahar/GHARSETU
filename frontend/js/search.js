document.addEventListener("DOMContentLoaded", () => {

    const form =
        document.querySelector("#searchForm");

    const input =
        document.querySelector("#searchInput");

    if (!form || !input) return;

    form.addEventListener("submit", (e) => {

        const query =
            input.value.trim();

        if (!query) {

            e.preventDefault();

            alert(
                "Please enter something to search."
            );

        }

    });

});