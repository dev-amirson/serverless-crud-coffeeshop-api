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

form.addEventListener("submit", (e) => {
  e.preventDefault();
  successMsg.textContent = "Your order has been successfully placed. Thanks!";
  form.reset();
  submitBtn.disabled = true;
  submitBtn.classList.remove('enabled');
});
