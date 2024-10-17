let filterColorButton;

async function filterColoring() {
  // Get the current tab's host dynamically
  const currentHost = window.location.origin;
  const url = `${currentHost}/rest/api/2/search`;  // Use the current host in the API URL

  // Function to fetch issues by filter
  const fetchIssues = async (urgentFilterId, importantFilterId) => {
    const jqlQuery = {
      jql: `project = PCD-Cashier and sprint in openSprints() and (issuetype NOT IN (Sub-task, "Test Run")) and filter = ${urgentFilterId} and filter = ${importantFilterId}`,
      startAt: 0,
      maxResults: 100,
      fields: ['key']
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(jqlQuery),
      credentials: 'include'  // Include cookies from the current tab
    });

    if (response.ok) {
      const data = await response.json();
      return data.issues.map(issue => issue.key);  // Return list of issue keys
    } else {
      console.error(`Failed to fetch issues for filters ${urgentFilterId} and ${importantFilterId}:`, response.status, response.statusText);
      return [];
    }
  };

  // Fetch issues by categories
  const importantUrgentIssues = await fetchIssues(26655, 26657);  // Important and Urgent
  const importantNotUrgentIssues = await fetchIssues(26656, 26657);  // Important but Not Urgent
  const urgentNotImportantIssues = await fetchIssues(26655, 26658);  // Urgent but Not Important
  const notImportantNotUrgentIssues = await fetchIssues(26656, 26658);  // Not Important and Not Urgent

  // Apply background colors based on category
  document.querySelectorAll('.js-issue').forEach(issueElement => {
    const issueKey = issueElement.getAttribute('data-issue-key');
    const badgeElement = issueElement.querySelector('.ghx-statistic-badge');  // Target the aui-badge

    if (!badgeElement) return;  // If there's no badge, skip it

    if (importantUrgentIssues.includes(issueKey)) {
      badgeElement.style.backgroundColor = '#BAF3DB';  // Important and Urgent
    } else if (importantNotUrgentIssues.includes(issueKey)) {
      badgeElement.style.backgroundColor = '#C6EDFB';  // Important but Not Urgent
    } else if (urgentNotImportantIssues.includes(issueKey)) {
      badgeElement.style.backgroundColor = '#F8E6A0';  // Urgent but Not Important
    } else if (notImportantNotUrgentIssues.includes(issueKey)) {
      badgeElement.style.backgroundColor = '#FFD5D2';  // Not Important and Not Urgent
    }
  });
}

function shouldShowFilterColorButtonAvailable(document) {
  const ghxWorkElement = document.querySelector("#ghx-plan");
  return ghxWorkElement && ghxWorkElement.children.length !== 0;
}

function existedFilterColorButton(document) {
  return document.querySelector(".aui-button[filter-color='true']");
}

function removeFilterColorButton(document) {
  const existingButton = document.querySelector(".aui-button[filter-color='true']");
  if (!existingButton) {
    return;
  }
  existingButton.remove();
}

// Function to inject the custom button beside the "Board" button
function getFilterColorButton() {
  if (filterColorButton) {
    return filterColorButton;
  }
  filterColorButton = document.createElement("button");
  filterColorButton.className = "aui-button";
  filterColorButton.setAttribute("filter-color", "true");
  filterColorButton.innerText = "Filter coloring";
  filterColorButton.addEventListener("click", filterColoring);
  return filterColorButton;
}
