export interface AccessibilityIssue {
  nodeId: string;
  type: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  guideline: string;
}

export class AccessibilityChecker {
  private contrastThreshold = 4.5; // WCAG AA standard for normal text

  checkPage(page: PageNode): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];

    const traverse = (node: SceneNode) => {
      issues.push(...this.checkNode(node));

      if ('children' in node) {
        node.children.forEach(child => traverse(child));
      }
    };

    page.children.forEach(child => traverse(child));
    return issues;
  }

  private checkNode(node: SceneNode): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];

    if (node.type === 'TEXT') {
      issues.push(...this.checkTextNode(node as TextNode));
    } else if (node.type === 'COMPONENT' || node.type === 'INSTANCE') {
      issues.push(...this.checkComponentNode(node));
    } else if ('fills' in node || 'strokes' in node) {
      issues.push(...this.checkColorContrast(node as any));
    }

    return issues;
  }

  private checkTextNode(node: TextNode): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];

    try {
      // Check for too small font sizes
      if (node.fontSize < 12) {
        issues.push({
          nodeId: node.id,
          type: 'Small Font Size',
          severity: 'warning',
          message: `Font size is ${node.fontSize}px. Minimum recommended is 12px for body text.`,
          guideline: 'WCAG 2.1 AA - 1.4.4 Resize Text'
        });
      }

      // Check for missing text
      if (!node.characters || node.characters.trim().length === 0) {
        issues.push({
          nodeId: node.id,
          type: 'Empty Text Node',
          severity: 'info',
          message: 'Text node appears to be empty.',
          guideline: 'Best Practice'
        });
      }

      // Check for very long lines of text without breaks
      if (node.fontSize && node.width && node.fontSize > 0) {
        const charsPerLine = Math.floor(node.width / (node.fontSize * 0.6));
        if (charsPerLine > 75) {
          issues.push({
            nodeId: node.id,
            type: 'Long Text Lines',
            severity: 'warning',
            message: `Lines are approximately ${charsPerLine} characters wide. Recommended maximum is 75 characters.`,
            guideline: 'WCAG 2.1 AA - 1.4.8 Visual Presentation'
          });
        }
      }
    } catch (e) {
      console.log('Error checking text node:', e);
    }

    return issues;
  }

  private checkComponentNode(node: SceneNode): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];

    // Check if component has description
    if ('description' in node && (!node.description || node.description.trim().length === 0)) {
      issues.push({
        nodeId: node.id,
        type: 'Missing Component Description',
        severity: 'warning',
        message: 'Component lacks a description for accessibility context.',
        guideline: 'Best Practice - Component Documentation'
      });
    }

    return issues;
  }

  private checkColorContrast(node: any): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];

    try {
      if (node.fills && Array.isArray(node.fills) && node.fills.length > 0) {
        const fill = node.fills[0];
        if (fill.type === 'SOLID' && fill.color) {
          // Basic contrast check - in production, compare with background
          const brightness = this.getColorBrightness(fill.color);
          
          if (brightness > 0.9 || brightness < 0.1) {
            issues.push({
              nodeId: node.id,
              type: 'Potential Contrast Issue',
              severity: 'info',
              message: 'Color may have contrast issues. Verify against background.',
              guideline: 'WCAG 2.1 AA - 1.4.3 Contrast (Minimum)'
            });
          }
        }
      }
    } catch (e) {
      console.log('Error checking color contrast:', e);
    }

    return issues;
  }

  private getColorBrightness(color: { r: number; g: number; b: number }): number {
    return (color.r * 299 + color.g * 587 + color.b * 114) / 1000 / 255;
  }
}