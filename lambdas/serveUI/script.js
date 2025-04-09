const form = document.getElementById("orderForm");
const submitBtn = document.getElementById("submitBtn");
const successMsg = document.getElementById("successMsg");
const failureMsg = document.getElementById("failureMsg");

const validateForm = () => {
  const name = form.name.value.trim();
  const address = form.address.value.trim();
  const coffeeOptions = form.querySelectorAll('.coffee-option');
  let coffeeSelected = false;

  coffeeOptions.forEach(option => {
    const checkbox = option.querySelector('input[type="checkbox"]');
    const qty = option.querySelector('input[type="number"]');
    if (checkbox.checked && qty.value >= 1) {
      coffeeSelected = true;
    }
  });

  const isValid = name && address && coffeeSelected;
  submitBtn.disabled = !isValid;
  submitBtn.classList.toggle('enabled', isValid);
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
    const response = await fetch(
      "http://localhost:3000/local/place-order",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      }
    );

    if (response.ok) {
      successMsg.textContent = `Your order has been placed successfully.`;
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
