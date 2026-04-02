export interface Suggestion {
  issueId: string;
  nodeId: string;
  action: string;
  details: string;
  autoFixable: boolean;
}

export interface AccessibilityIssue {
  nodeId: string;
  type: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  guideline: string;
}

export class SuggestionEngine {
  generateSuggestions(issues: AccessibilityIssue[]): Suggestion[] {
    const suggestions: Suggestion[] = [];

    issues.forEach((issue, index) => {
      switch (issue.type) {
        case 'Small Font Size':
          suggestions.push({
            issueId: `${index}`,
            nodeId: issue.nodeId,
            action: 'Increase Font Size',
            details: 'Increase font size to at least 12px for better readability and WCAG compliance.',
            autoFixable: true
          });
          break;
        case 'Empty Text Node':
          suggestions.push({
            issueId: `${index}`,
            nodeId: issue.nodeId,
            action: 'Remove Empty Text Node',
            details: 'This text node is empty and can be safely removed to clean up your design.',
            autoFixable: true
          });
          break;
        case 'Long Text Lines':
          suggestions.push({
            issueId: `${index}`,
            nodeId: issue.nodeId,
            action: 'Review Text Line Length',
            details: 'Consider breaking text into multiple lines or reducing the container width. Optimal line length is 45-75 characters.',
            autoFixable: false
          });
          break;
        case 'Missing Component Description':
          suggestions.push({
            issueId: `${index}`,
            nodeId: issue.nodeId,
            action: 'Add Component Description',
            details: 'Add a description to this component to document its purpose and usage for accessibility and team collaboration.',
            autoFixable: false
          });
          break;
        case 'Potential Contrast Issue':
          suggestions.push({
            issueId: `${index}`,
            nodeId: issue.nodeId,
            action: 'Review Color Contrast',
            details: 'Verify this color meets WCAG AA contrast requirements (4.5:1 for normal text, 3:1 for large text) against its background.',
            autoFixable: false
          });
          break;
        default:
          suggestions.push({
            issueId: `${index}`,
            nodeId: issue.nodeId,
            action: 'Review Issue',
            details: issue.message,
            autoFixable: false
          });
      }
    });

    return suggestions;
  }

  prioritizeSuggestions(suggestions: Suggestion[]): Suggestion[] {
    // Sort by auto-fixable first, then by issueId
    return [...suggestions].sort((a, b) => {
      if (a.autoFixable !== b.autoFixable) {
        return a.autoFixable ? -1 : 1;
      }
      return parseInt(a.issueId) - parseInt(b.issueId);
    });
  }
}