document.addEventListener("DOMContentLoaded", () => {

    console.log("GharSetu Home Loaded");

    const searchInput = document.querySelector("#homeSearch");

    if (searchInput) {

        searchInput.addEventListener("keypress", (e) => {

            if (e.key === "Enter") {

                const query = searchInput.value.trim();

                if (query) {
                    window.location.href =
                        `/customer/search?q=${encodeURIComponent(query)}`;
                }

            }

        });

    }

});