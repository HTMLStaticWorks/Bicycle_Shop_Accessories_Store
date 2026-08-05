/**
 * CycleNest - Booking & Contact Form Validation
 */

document.addEventListener('DOMContentLoaded', () => {
  const bookingForm = document.getElementById('bookingForm');

  if (bookingForm) {
    const dateInput = document.getElementById('bookingDate');
    const serviceSelect = document.getElementById('bookingService');

    // Set min date to today
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.setAttribute('min', today);
    }

    // --- Live estimate strip (only present where the markup provides one) ----
    const estimate = document.getElementById('bookingEstimate');

    const updateEstimate = () => {
      if (!estimate || !serviceSelect) return;
      const option = serviceSelect.options[serviceSelect.selectedIndex];
      const price = option ? option.dataset.price : '';
      const duration = option ? option.dataset.time : '';
      const valueEl = estimate.querySelector('.estimate-value');
      const metaEl = estimate.querySelector('.estimate-meta');

      if (price) {
        valueEl.textContent = price;
        metaEl.innerHTML = '<i class="ph ph-clock"></i> ' + duration;
        estimate.classList.add('is-set');
      } else {
        valueEl.textContent = '--';
        metaEl.textContent = 'Pick a service to see pricing';
        estimate.classList.remove('is-set');
      }
    };

    if (serviceSelect) {
      serviceSelect.addEventListener('change', updateEstimate);
      updateEstimate();
    }

    // --- "Book this" shortcuts on the service rows -------------------------
    document.querySelectorAll('[data-book-service]').forEach(trigger => {
      trigger.addEventListener('click', () => {
        if (serviceSelect) {
          serviceSelect.value = trigger.dataset.bookService;
          serviceSelect.classList.remove('error');
          updateEstimate();
        }
        const nameField = document.getElementById('bookingName');
        if (nameField) {
          // Wait for the smooth scroll to settle before pulling focus
          setTimeout(() => nameField.focus({ preventScroll: true }), 600);
        }
      });
    });

    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Reset errors
      const errorMsgEls = bookingForm.querySelectorAll('.form-error');
      errorMsgEls.forEach(el => el.style.display = 'none');
      const errorInputs = bookingForm.querySelectorAll('.form-control.error');
      errorInputs.forEach(el => el.classList.remove('error'));
      const errorGroups = bookingForm.querySelectorAll('.choice-grid.error');
      errorGroups.forEach(el => el.classList.remove('error'));

      let isValid = true;
      let firstInvalid = null;

      const showError = (el, errorEl, message) => {
        isValid = false;
        if (!firstInvalid) firstInvalid = el;
        if (errorEl && errorEl.classList.contains('form-error')) {
          errorEl.textContent = message;
          errorEl.style.display = 'block';
        }
      };

      const validateField = (id, message) => {
        const field = document.getElementById(id);
        if (!field) return;
        if (!field.value.trim()) {
          field.classList.add('error');
          showError(field, field.nextElementSibling, message);
        }
      };

      // Pill-style radio groups (time slot, drop-off method)
      const validateChoiceGroup = (name, message) => {
        const group = bookingForm.querySelector(`.choice-grid[data-group="${name}"]`);
        if (!group) return;
        if (!group.querySelector('input:checked')) {
          group.classList.add('error');
          showError(group, group.nextElementSibling, message);
        }
      };

      validateField('bookingName', 'Full Name is required');
      validateField('bookingContact', 'Phone / Email is required');
      validateField('bookingBike', 'Please select a bike type');
      validateField('bookingService', 'Please select a service');
      validateField('bookingDate', 'Please choose a date');
      validateField('bookingTime', 'Please choose a time');
      validateChoiceGroup('time', 'Please choose a time slot');
      validateChoiceGroup('dropoff', 'Please choose how the bike reaches us');

      // Date validation for past dates
      if (dateInput && dateInput.value) {
        const selectedDate = new Date(dateInput.value);
        const todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0);
        if (selectedDate < todayDate) {
          dateInput.classList.add('error');
          showError(dateInput, dateInput.nextElementSibling, 'Date cannot be in the past');
        }
      }

      if (isValid) {
        // Show success message, hide form
        const successMessage = document.getElementById('bookingSuccess');
        if (successMessage) {
          bookingForm.style.display = 'none';
          successMessage.style.display = 'block';
          successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          // Fallback if success message element not found
          alert('Booking Request Sent Successfully!');
          bookingForm.reset();
        }
      } else if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (typeof firstInvalid.focus === 'function') {
          firstInvalid.focus({ preventScroll: true });
        }
      }
    });
  }
});
