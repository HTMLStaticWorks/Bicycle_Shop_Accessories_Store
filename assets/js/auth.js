/**
 * CycleNest - Auth page interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // Password reveal toggles
  document.querySelectorAll('.password-toggle').forEach(toggle => {
    const field = toggle.closest('.password-field').querySelector('input');
    const icon = toggle.querySelector('i');
    if (!field || !icon) return;

    toggle.addEventListener('click', () => {
      const reveal = field.type === 'password';
      field.type = reveal ? 'text' : 'password';

      icon.className = reveal ? 'ph ph-eye-slash' : 'ph ph-eye';
      toggle.setAttribute('aria-pressed', String(reveal));
      toggle.setAttribute('aria-label', reveal ? 'Hide password' : 'Show password');

      // Swapping the type drops focus — put the caret back where it was
      const caret = field.value.length;
      field.focus({ preventScroll: true });
      try {
        field.setSelectionRange(caret, caret);
      } catch (e) {
        /* setSelectionRange is unsupported on some password inputs */
      }
    });
  });

  // Confirm-password matching. The mismatch goes through setCustomValidity so
  // the browser blocks submit for it exactly like it does for `required`.
  document.querySelectorAll('[data-match]').forEach(confirmField => {
    const source = document.getElementById(confirmField.dataset.match);
    if (!source) return;

    const group = confirmField.closest('.form-group');
    const error = group ? group.querySelector('.form-error') : null;

    const check = () => {
      // An empty box is already covered by `required` — don't shout at someone
      // who simply hasn't started typing yet.
      const mismatch = confirmField.value !== '' && confirmField.value !== source.value;

      confirmField.setCustomValidity(mismatch ? 'Passwords do not match' : '');
      confirmField.classList.toggle('error', mismatch);
      if (error) error.style.display = mismatch ? 'block' : 'none';
    };

    confirmField.addEventListener('input', check);
    source.addEventListener('input', check);
  });
});
