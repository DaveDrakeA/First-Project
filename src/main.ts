// Main plugin entry point
import { AccessibilityChecker } from './accessibility-checker';
import { SuggestionEngine } from './suggestion-engine';
import { AutoFixer } from './auto-fixer';

figma.showUI(__html__, { width: 400, height: 600 });

interface AccessibilityIssue {
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

let currentIssues: AccessibilityIssue[] = [];
let currentSuggestions: Suggestion[] = [];
const checker = new AccessibilityChecker();
const suggestionEngine = new SuggestionEngine();
const autoFixer = new AutoFixer();

// Listen for messages from UI
figma.ui.onmessage = (msg: any) => {
  if (msg.type === 'check-accessibility') {
    runAccessibilityCheck();
  } else if (msg.type === 'get-suggestions') {
    generateSuggestions();
  } else if (msg.type === 'apply-fix') {
    applyAutoFix(msg.suggestionId);
  } else if (msg.type === 'apply-all-fixes') {
    applyAllFixes();
  }
};

function runAccessibilityCheck() {
  try {
    const page = figma.currentPage;
    currentIssues = checker.checkPage(page);
    
    figma.ui.postMessage({
      type: 'accessibility-check-complete',
      issues: currentIssues,
      summary: {
        totalIssues: currentIssues.length,
        errors: currentIssues.filter(i => i.severity === 'error').length,
        warnings: currentIssues.filter(i => i.severity === 'warning').length,
        info: currentIssues.filter(i => i.severity === 'info').length
      }
    });
  } catch (error: any) {
    figma.ui.postMessage({
      type: 'error',
      message: error.message || 'Error during accessibility check'
    });
  }
}

function generateSuggestions() {
  try {
    currentSuggestions = suggestionEngine.generateSuggestions(currentIssues);
    
    figma.ui.postMessage({
      type: 'suggestions-generated',
      suggestions: currentSuggestions,
      autoFixableCount: currentSuggestions.filter(s => s.autoFixable).length
    });
  } catch (error: any) {
    figma.ui.postMessage({
      type: 'error',
      message: error.message || 'Error generating suggestions'
    });
  }
}

function applyAutoFix(suggestionId: string) {
  try {
    const suggestion = currentSuggestions.find(s => s.issueId === suggestionId);
    if (!suggestion) {
      throw new Error('Suggestion not found');
    }
    
    const node = figma.getNodeById(suggestion.nodeId);
    if (!node) {
      throw new Error('Node not found');
    }
    
    autoFixer.applySuggestion(node, suggestion);
    
    figma.ui.postMessage({
      type: 'fix-applied',
      suggestionId: suggestionId,
      message: `Applied fix: ${suggestion.action}`
    });
  } catch (error: any) {
    figma.ui.postMessage({
      type: 'error',
      message: error.message || 'Error applying fix'
    });
  }
}

function applyAllFixes() {
  try {
    let successCount = 0;
    const autoFixableSuggestions = currentSuggestions.filter(s => s.autoFixable);
    
    autoFixableSuggestions.forEach(suggestion => {
      const node = figma.getNodeById(suggestion.nodeId);
      if (node) {
        autoFixer.applySuggestion(node, suggestion);
        successCount++;
      }
    });
    
    figma.ui.postMessage({
      type: 'all-fixes-applied',
      count: successCount,
      message: `Applied ${successCount} automatic fixes`
    });
  } catch (error: any) {
    figma.ui.postMessage({
      type: 'error',
      message: error.message || 'Error applying fixes'
    });
  }
}