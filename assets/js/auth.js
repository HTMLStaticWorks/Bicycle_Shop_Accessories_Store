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
});
