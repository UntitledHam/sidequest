// Init the toasts.
document.addEventListener("DOMContentLoaded", function() {
  const toastEls = document.querySelectorAll(".toast");
  toastEls.forEach((toastEl) => {
    new bootstrap.Toast(toastEl, { delay: 4000 }).show();
  });
});

// Init the tooltips
document.addEventListener("DOMContentLoaded", function() {
  const popoverTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="popover"]'),
  );
  popoverTriggerList.map(function(el) {
    return new bootstrap.Popover(el);
  });
});
