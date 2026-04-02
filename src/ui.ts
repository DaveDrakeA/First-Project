interface Issue {
  nodeId: string;
  type: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  guideline: string;
}

interface Suggestion {
  issueId: string;
  nodeId: string;
  action: string;
  details: string;
  autoFixable: boolean;
}

let currentIssues: Issue[] = [];
let currentSuggestions: Suggestion[] = [];

const checkBtn = document.getElementById('checkBtn') as HTMLButtonElement;
const suggestBtn = document.getElementById('suggestBtn') as HTMLButtonElement;
const applyAllBtn = document.getElementById('applyAllBtn') as HTMLButtonElement;
const issuesList = document.getElementById('issuesList') as HTMLDivElement;
const summary = document.getElementById('summary') as HTMLDivElement;
const errorMessage = document.getElementById('errorMessage') as HTMLDivElement;
const fixButtonGroup = document.getElementById('fixButtonGroup') as HTMLDivElement;

checkBtn.addEventListener('click', () => {
  parent.postMessage({ pluginMessage: { type: 'check-accessibility' } }, '*');
  showLoading();
});

suggestBtn.addEventListener('click', () => {
  parent.postMessage({ pluginMessage: { type: 'get-suggestions' } }, '*');
});

applyAllBtn.addEventListener('click', () => {
  if (confirm('Apply all automatic fixes? This cannot be undone.')) {
    parent.postMessage({ pluginMessage: { type: 'apply-all-fixes' } }, '*');
  }
});

window.onmessage = (event) => {
  const { type, ...data } = event.data.pluginMessage;

  switch (type) {
    case 'accessibility-check-complete':
      handleCheckComplete(data);
      break;
    case 'suggestions-generated':
      handleSuggestionsGenerated(data);
      break;
    case 'fix-applied':
      handleFixApplied(data);
      break;
    case 'all-fixes-applied':
      handleAllFixesApplied(data);
      break;
    case 'error':
      handleError(data);
      break;
  }
};

function handleCheckComplete(data: any) {
  currentIssues = data.issues;
  const { summary: summaryData } = data;

  // Update summary
  (document.getElementById('totalIssues') as HTMLElement).textContent = summaryData.totalIssues;
  (document.getElementById('errorCount') as HTMLElement).textContent = summaryData.errors;
  (document.getElementById('warningCount') as HTMLElement).textContent = summaryData.warnings;
  (document.getElementById('infoCount') as HTMLElement).textContent = summaryData.info;

  summary.classList.add('visible');
  suggestBtn.disabled = summaryData.totalIssues === 0;

  renderIssues();
  clearError();
}

function handleSuggestionsGenerated(data: any) {
  currentSuggestions = data.suggestions;
  suggestBtn.textContent = `Generate Suggestions (${data.autoFixableCount} fixable)`;
  
  if (data.autoFixableCount > 0) {
    fixButtonGroup.style.display = 'flex';
  }

  renderSuggestions();
}

function handleFixApplied(data: any) {
  showMessage(`✓ ${data.message}`);
}

function handleAllFixesApplied(data: any) {
  showMessage(`✓ ${data.message}`);
  setTimeout(() => {
    checkBtn.click();
  }, 1000);
}

function handleError(data: any) {
  showError(data.message);
}

function renderIssues() {
  if (currentIssues.length === 0) {
    issuesList.innerHTML = '<div class="empty-state">✓ No accessibility issues found!</div>';
    return;
  }

  issuesList.innerHTML = currentIssues
    .map(
      (issue, index) => `
    <div class="issue-item ${issue.severity}">
      <div class="issue-header">
        <span class="issue-title">${issue.type}</span>
        <span class="issue-badge ${issue.severity}">${issue.severity}</span>
      </div>
      <div class="issue-message">${issue.message}</div>
      <div class="issue-guideline">${issue.guideline}</div>
    </div>
  `
    )
    .join('');
}

function renderSuggestions() {
  const suggestionsHtml = currentSuggestions
    .map(
      (suggestion) => `
    <div class="issue-item info">
      <div class="issue-header">
        <span class="issue-title">${suggestion.action}</span>
        ${suggestion.autoFixable ? '<span class="issue-badge success">Auto-fixable</span>' : ''}
      </div>
      <div class="issue-message">${suggestion.details}</div>
      ${suggestion.autoFixable ? `<button class="fix-btn" data-id="${suggestion.issueId}">Apply Fix</button>` : ''}
    </div>
  `
    )
    .join('');

  issuesList.innerHTML = suggestionsHtml;

  document.querySelectorAll('.fix-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const suggestionId = (e.target as HTMLElement).getAttribute('data-id');
      if (suggestionId) {
        parent.postMessage({ pluginMessage: { type: 'apply-fix', suggestionId } }, '*');
      }
    });
  });
}

function showLoading() {
  issuesList.innerHTML = '<div class="loading">Checking accessibility...</div>';
  checkBtn.disabled = true;
}

function showError(message: string) {
  errorMessage.textContent = message;
  errorMessage.classList.add('visible');
}

function clearError() {
  errorMessage.classList.remove('visible');
}

function showMessage(message: string) {
  const messageEl = document.createElement('div');
  messageEl.style.cssText =
    'position: fixed; top: 10px; right: 10px; background: #1bc47d; color: white; padding: 12px 16px; border-radius: 4px; font-size: 12px; z-index: 1000;';
  messageEl.textContent = message;
  document.body.appendChild(messageEl);
  setTimeout(() => messageEl.remove(), 3000);
}