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

form.addEventListener("input", validateForm);

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Gather the form data
  const name = form.name.value.trim();
  const address = form.address.value.trim();
  const coffeeOptions = form.querySelectorAll(".coffee-option");
  const coffeeTypes = [];

  coffeeOptions.forEach((option) => {
    const checkbox = option.querySelector('input[type="checkbox"]');
    const qty = option.querySelector('input[type="number"]');
    if (checkbox.checked && qty.value >= 1) {
      coffeeTypes.push({
        type: checkbox.value,
        quantity: qty.value,
      });
    }
  });

  const orderData = {
    name,
    address,
    coffeeTypes,
  };

  try {
    const response = await fetch("http://localhost:3000/local/place-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    if (response.ok) {
      successMsg.textContent = `Your order has been placed successfully.`;
      const result = await response.json();
      const newOrder = result.order; // Assuming the response includes the new order

      // Append new order to the table
      const row = ordersTable.insertRow(0);
      row.innerHTML = `
        <td>${newOrder.name}</td>
        <td>${newOrder.address}</td>
        <td>${newOrder.coffeeTypes
          .map((coffee) => `${coffee.type} | ${coffee.quantity}`)
          .join(", ")}</td>
        <td>
          <button>Update</button>
          <button>Cancel</button>
        </td>
      `;
    } else {
      failureMsg.textContent = `Failed to place order.`;
    }

    form.reset();
    submitBtn.disabled = true;
    submitBtn.classList.remove("enabled");
  } catch (error) {
    console.error("Error placing order:", error);
    successMsg.textContent = "Error placing order";
  }
});

// Fetch and display all orders when the page loads
fetchOrders();
