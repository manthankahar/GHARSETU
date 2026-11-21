document.addEventListener("DOMContentLoaded", function () {
    const mobileMenu = document.getElementById("mobileMenu");
    const sidebar = document.getElementById("sidebar");
    const customerModal = document.getElementById("customerModal");

    if (mobileMenu && sidebar) {
        mobileMenu.addEventListener("click", function () {
            const isOpen = sidebar.classList.toggle("open");
            mobileMenu.setAttribute("aria-expanded", String(isOpen));
        });
    }

    if (customerModal) {
        customerModal.addEventListener("click", function (event) {
            if (event.target === customerModal) {
                closeCustomerModal();
            }
        });
    }

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeCustomerModal();

            if (sidebar) {
                sidebar.classList.remove("open");
            }

            if (mobileMenu) {
                mobileMenu.setAttribute("aria-expanded", "false");
            }
        }
    });
});

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

async function viewCustomer(id) {
    const modal = document.getElementById("customerModal");
    const body = document.getElementById("customerModalBody");

    if (!modal || !body) return;

    modal.classList.add("show");
    body.textContent = "Loading customer details...";

    try {
        const response = await fetch(
            `/admin/customers/${encodeURIComponent(id)}`,
            {
                headers: {
                    Accept: "application/json"
                }
            }
        );

        const data = await response.json();

        if (!response.ok || !data.success || !data.customer) {
            throw new Error(data.message || "Failed to load customer.");
        }

        const customer = data.customer;

        const joined = customer.createdAt
            ? new Date(customer.createdAt).toLocaleDateString("en-IN")
            : "-";

        const details = [
            ["Name", customer.name || "-"],
            ["Email", customer.email || "-"],
            ["Mobile", customer.mobile || "-"],
            ["Account Status", customer.isActive ? "🟢 Active" : "🔴 Inactive"],
            ["Total Orders", customer.totalOrders ?? 0],
            ["Joined", joined]
        ];

        body.innerHTML = details.map(([label, value]) => `
            <div class="detail-row">
                <span class="detail-label">${escapeHtml(label)}</span>
                <span class="detail-value">${escapeHtml(value)}</span>
            </div>
        `).join("");
    } catch (error) {
        body.innerHTML = `
            <p role="alert" style="color:#b55343;text-align:center;padding:20px;">
                ${escapeHtml(error.message || "Something went wrong.")}
            </p>
        `;
    }
}

function closeCustomerModal() {
    const modal = document.getElementById("customerModal");

    if (modal) {
        modal.classList.remove("show");
    }
}

async function toggleCustomer(id) {
    const button = document.getElementById(`toggle-btn-${id}`);
    const statusElement = document.getElementById(`status-${id}`);

    if (!button || !statusElement || button.disabled) return;

    const previousText = button.textContent.trim();

    button.disabled = true;
    button.textContent = "Updating...";

    try {
        const response = await fetch(
            `/admin/customers/${encodeURIComponent(id)}/toggle-status`,
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                }
            }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Failed to update customer status.");
        }

        const isActive = Boolean(data.isActive);

        statusElement.className = `status ${isActive ? "active" : "inactive"}`;
        statusElement.textContent = isActive ? "● Active" : "● Inactive";

        button.className = `action-btn ${isActive ? "deactivate-btn" : "activate-btn"}`;
        button.textContent = isActive ? "Deactivate" : "Activate";
    } catch (error) {
        button.textContent = previousText;
        alert(error.message || "Something went wrong.");
    } finally {
        button.disabled = false;
    }
}