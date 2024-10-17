let collapseDoneButton;

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

function shouldShowCollapseButtonAvailable(document) {
  const ghxWorkElement = document.querySelector("#ghx-work");
  return ghxWorkElement && ghxWorkElement.children.length !== 0;
}

function existedCollapseButton(document) {
  return document.querySelector(".aui-button[collapse-done='true']");
}

function removeCollapseButton(document) {
  const existingButton = document.querySelector(".aui-button[collapse-done='true']");
  if (!existingButton) {
    return;
  }
  existingButton.remove();
}

// Function to inject the custom button beside the "Board" button
function getCollapseDoneButton() {
  if (collapseDoneButton) {
    return collapseDoneButton;
  }
  collapseDoneButton = document.createElement("button");
  collapseDoneButton.className = "aui-button";
  collapseDoneButton.setAttribute("collapse-done", "true");
  collapseDoneButton.innerText = "Collapse all \"Done\"";
  collapseDoneButton.addEventListener("click", collapseToggles);
  return collapseDoneButton;
}
