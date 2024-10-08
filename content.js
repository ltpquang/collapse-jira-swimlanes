// Function to collapse the toggles based on the status
function collapseToggles() {
  // Select all elements with class ghx-heading
  const headings = document.querySelectorAll(".ghx-heading");

  headings.forEach(heading => {
    const doneElement = heading.querySelector(".jira-issue-status-lozenge-done")

    if (doneElement) {
      // Find the toggle button within this heading
      const toggleButton = heading.querySelector(".aui-button.js-expander");

      // Check if the button is expanded and click if it is
      const isExpanded = toggleButton?.getAttribute("aria-expanded") === "true";

      if (isExpanded) {
        toggleButton.click();
      }
    }
  });
}

// Function to inject the custom button beside the "Board" button
function injectButton() {
  const boardButton = document.querySelector("#board-tools-section-button");
  if (!boardButton) {
    return;
  }

  const ghxWorkElement = document.querySelector("#ghx-work");
  if (!ghxWorkElement || ghxWorkElement.children.length === 0) {
    // Remove the custom button if it exists
    const existingButton = document.querySelector(".aui-button[custom-button='true']");
    if (existingButton) {
      existingButton.remove();
    }
    return;
  }

  // Create the new button element
  const newButton = document.createElement("button");
  newButton.className = "aui-button";
  newButton.setAttribute("custom-button", "true");
  newButton.innerText = "Collapse all \"Done\"";

  // Add the click event listener to collapse the toggles when clicked
  newButton.addEventListener("click", collapseToggles);

  // Insert the new button after the "Board" button
  boardButton.parentNode.insertBefore(newButton, boardButton.nextSibling);
}

// Use MutationObserver to dynamically watch for changes in the DOM
const observer = new MutationObserver((mutations) => {
  for (let mutation of mutations) {
    if (mutation.type === 'childList') {
      // Re-inject button if necessary (in case of page updates)
      if (!document.querySelector(".aui-button[custom-button='true']")) {
        injectButton();
      }
    }
  }
});

// Start observing the document for changes
observer.observe(document.body, {childList: true, subtree: true});

document.addEventListener("DOMContentLoaded", () => {
  injectButton();
});
