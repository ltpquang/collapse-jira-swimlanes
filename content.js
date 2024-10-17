function observes() {
  observe();
}

function injectButtons() {
  injectButton();
}

function init() {
  observes();
  injectButtons();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
