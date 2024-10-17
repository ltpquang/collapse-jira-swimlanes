const handlers = [
  {
    shouldAvailable: shouldShowCollapseButtonAvailable,
    existed: existedCollapseButton,
    remover: removeCollapseButton,
    getter: getCollapseDoneButton,
  }
];

function injectButtons() {
  const boardButton = document.querySelector("#board-tools-section-button");
  if (!boardButton) {
    console.log("not a jira board");
    return; // not a jira board
  }

  // Create a new div with class ghx-view-section and insert the buttons inside it
  const newSection = document.createElement("div");
  newSection.className = "ghx-view-section";
  newSection.setAttribute("custom-buttons", "true");

  const existingSection = document.querySelector(".ghx-view-section[custom-buttons='true']");
  if (!existingSection) {
    boardButton.parentNode.parentNode.insertBefore(newSection, boardButton.parentNode.nextSibling);
  }

  for (let handler of handlers) {
    if (!handler.shouldAvailable(document)) {
      console.log("shouldn't available");
      handler.remover(document);
    } else if (!handler.existed(document)) {
      console.log("not existed");
      newSection.appendChild(handler.getter());
    }
  }
}

const observer = new MutationObserver((mutations) => {
  for (let mutation of mutations) {
    if (mutation.type === 'childList') {
      console.log("changed, inject buttons");
      injectButtons();
    }
  }
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", run);
} else {
  run();
}

function run() {
  const toObserve = document.querySelector("#ghx-view-selector");
  observer.observe(toObserve, {childList: true, subtree: true});
  injectButtons();
}
