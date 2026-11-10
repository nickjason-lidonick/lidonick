(function () {
  var endpoint = "https://formspree.io/f/mpqbobry";

  document.querySelectorAll("form.call-form").forEach(function (form) {
    var alertEl = form.querySelector("[role='alert']");
    var button = form.querySelector("button[type='submit']");
    var statusEl = form.parentElement.querySelector("[role='status']");

    function showError(message) {
      alertEl.hidden = false;
      alertEl.textContent = message;
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var name = form.elements.name.value.trim();
      var phone = form.elements.phone.value.trim();
      var email = form.elements.email.value.trim();
      var emailInput = form.elements.email;
      var missingName = !name;
      var missingContact = !phone && !email;

      if (missingName || missingContact) {
        if (missingName && missingContact) {
          showError("Add your name, and a phone or email.");
        } else if (missingName) {
          showError("Add your name.");
        } else {
          showError("Add a phone or email.");
        }
        return;
      }

      if (
        email &&
        emailInput &&
        typeof emailInput.checkValidity === "function" &&
        !emailInput.checkValidity()
      ) {
        showError("Enter a valid email.");
        return;
      }

      alertEl.hidden = true;
      button.disabled = true;

      var body = {
        name: name,
        _subject: "New Lidonick call request",
        _gotcha: form.elements._gotcha ? form.elements._gotcha.value : "",
      };
      if (phone) {
        body.phone = phone;
      }
      if (email) {
        body.email = email;
      }

      fetch(endpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
        .then(function (response) {
          if (!response.ok) {
            throw new Error("Request failed");
          }
          form.hidden = true;
          statusEl.hidden = false;
        })
        .catch(function () {
          button.disabled = false;
          showError("Something went wrong. Please try again.");
        });
    });
  });
})();
