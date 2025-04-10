const form = document.getElementById("orderForm");
const submitBtn = document.getElementById("submitBtn");
const successMsg = document.getElementById("successMsg");
const failureMsg = document.getElementById("failureMsg");
const ordersTable = document
  .getElementById("ordersTable")
  .getElementsByTagName("tbody")[0];

const validateForm = () => {
  const name = form.name.value.trim();
  const address = form.address.value.trim();
  const coffeeOptions = form.querySelectorAll(".coffee-option");
  let coffeeSelected = false;

  coffeeOptions.forEach((option) => {
    const checkbox = option.querySelector('input[type="checkbox"]');
    const qty = option.querySelector('input[type="number"]');
    if (checkbox.checked && qty.value >= 1) {
      coffeeSelected = true;
    }
  });

  const isValid = name && address && coffeeSelected;
  submitBtn.disabled = !isValid;
  submitBtn.classList.toggle("enabled", isValid);
};

const fetchOrders = async () => {
  try {
    const response = await fetch("http://localhost:3000/local/get-orders");
    const result = await response.json();

    if (response.ok) {
      result.orders.forEach((order) => {
        const row = ordersTable.insertRow();
        row.dataset.id = order.orderId;
        row.innerHTML = `
          <td>${order.name}</td>
          <td>${order.address}</td>
          <td>${order.coffeeTypes
            .map((coffee) => `${coffee.type} | ${coffee.quantity}`)
            .join(", ")}</td>
          <td>
            <button>Update</button>
            <button>Cancel</button>
          </td>
        `;
      });
    } else {
      console.error("Failed to fetch orders:", result.message);
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
};

let editingOrderId = null;

// Handle edit click
ordersTable.addEventListener("click", async (e) => {
  const row = e.target.closest("tr");

  if (e.target.textContent === "Update") {
    const name = row.cells[0].textContent;
    const address = row.cells[1].textContent;
    const coffeeDetails = row.cells[2].textContent.split(", ");

    const coffeeMap = coffeeDetails.reduce((acc, item) => {
      const [type, qty] = item.split(" | ");
      acc[type] = qty;
      return acc;
    }, {});

    document.getElementById("name").value = name;
    document.getElementById("address").value = address;

    document.querySelectorAll(".coffee-option").forEach((option) => {
      const checkbox = option.querySelector('input[type="checkbox"]');
      const quantity = option.querySelector('input[type="number"]');
      if (coffeeMap[checkbox.value]) {
        checkbox.checked = true;
        quantity.value = coffeeMap[checkbox.value];
      } else {
        checkbox.checked = false;
        quantity.value = 1;
      }
    });

    editingOrderId = row.dataset.id;
    submitBtn.textContent = "Update Order";
    submitBtn.classList.add("enabled");
    submitBtn.disabled = false;
  }

  if (e.target.textContent === "Cancel") {
    const orderId = row.dataset.id;
    const confirmCancel = confirm(
      "Are you sure you want to cancel this order?"
    );
    if (!confirmCancel) return;

    try {
      const response = await fetch("http://localhost:3000/local/cancel-order", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      const result = await response.json();

      if (response.ok) {
        row.remove();
        successMsg.textContent = "Order cancelled successfully!";
        failureMsg.textContent = "";
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      failureMsg.textContent = error.message || "Failed to cancel order.";
      successMsg.textContent = "";
      console.error("Cancel error:", error);
    }
  }
});

// Handle create/edit form submission
orderForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const address = document.getElementById("address").value.trim();
  const coffeeTypes = Array.from(document.querySelectorAll(".coffee-option"))
    .filter((opt) => opt.querySelector('input[type="checkbox"]').checked)
    .map((opt) => ({
      type: opt.querySelector('input[type="checkbox"]').value,
      quantity: parseInt(opt.querySelector('input[type="number"]').value),
    }));

  const body = JSON.stringify({ name, address, coffeeTypes });

  const url = editingOrderId
    ? `http://localhost:3000/local/update-order/${editingOrderId}`
    : "http://localhost:3000/local/place-order";

  const method = editingOrderId ? "PUT" : "POST";

  try {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body,
    });

    const result = await response.json();

    if (response.ok) {
      successMsg.textContent = editingOrderId
        ? "Order Updated Successfully!"
        : "Order Placed Successfully!";
      failureMsg.textContent = "";
      orderForm.reset();
      editingOrderId = null;
      submitBtn.textContent = "Place Order";
      submitBtn.classList.remove("enabled");
      submitBtn.disabled = true;
      ordersTable.innerHTML = "";
      fetchOrders();
    } else {
      failureMsg.textContent = result.message;
      successMsg.textContent = "";
    }
  } catch (error) {
    failureMsg.textContent = "Error submitting order";
    successMsg.textContent = "";
    console.error("Error submitting order:", error);
  }
});
form.addEventListener("input", validateForm);

// Fetch and display all orders when the page loads
fetchOrders();
