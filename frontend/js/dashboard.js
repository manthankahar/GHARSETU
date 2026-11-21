"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const mobileMenu = document.getElementById("mobileMenu");
    const sidebar = document.getElementById("sidebar");

    // Mobile sidebar open/close
    if (mobileMenu && sidebar) {
        mobileMenu.addEventListener("click", function () {
            const isOpen = sidebar.classList.toggle("open");

            mobileMenu.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            mobileMenu.setAttribute(
                "aria-label",
                isOpen ? "Close navigation menu" : "Open navigation menu"
            );
        });

        // Close sidebar when a navigation link is clicked on mobile
        sidebar.querySelectorAll(".nav-menu a").forEach(function (link) {
            link.addEventListener("click", function () {
                if (window.innerWidth <= 760) {
                    sidebar.classList.remove("open");
                    mobileMenu.setAttribute("aria-expanded", "false");
                    mobileMenu.setAttribute("aria-label", "Open navigation menu");
                }
            });
        });

        // Close sidebar if the user moves back to desktop width
        window.addEventListener("resize", function () {
            if (window.innerWidth > 760) {
                sidebar.classList.remove("open");
                mobileMenu.setAttribute("aria-expanded", "false");
                mobileMenu.setAttribute("aria-label", "Open navigation menu");
            }
        });

        // Close sidebar when clicking outside it on mobile
        document.addEventListener("click", function (event) {
            if (
                window.innerWidth <= 760 &&
                sidebar.classList.contains("open") &&
                !sidebar.contains(event.target) &&
                !mobileMenu.contains(event.target)
            ) {
                sidebar.classList.remove("open");
                mobileMenu.setAttribute("aria-expanded", "false");
                mobileMenu.setAttribute("aria-label", "Open navigation menu");
            }
        });
    }

    // Show today's date
    const todayDate = document.getElementById("todayDate");

    if (todayDate) {
        const today = new Date();

        const formattedDate = today.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });

        todayDate.textContent = "📅 " + formattedDate;
    }
});