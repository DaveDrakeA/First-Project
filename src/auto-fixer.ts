import { Suggestion } from './suggestion-engine';

export class AutoFixer {
  applySuggestion(node: SceneNode, suggestion: Suggestion): void {
    try {
      switch (suggestion.action) {
        case 'Increase Font Size':
          this.increaseFontSize(node);
          break;
        case 'Remove Empty Text Node':
          this.removeNode(node);
          break;
        default:
          console.log('No auto-fix available for:', suggestion.action);
      }
    } catch (error) {
      console.error('Error applying suggestion:', error);
      throw error;
    }
  }

  private increaseFontSize(node: SceneNode): void {
    if (node.type === 'TEXT') {
      const textNode = node as TextNode;
      const currentSize = typeof textNode.fontSize === 'number' ? textNode.fontSize : 12;
      const newSize = Math.max(12, currentSize * 1.2);
      textNode.fontSize = newSize;
    }
  }

  private removeNode(node: SceneNode): void {
    if (node.parent && 'children' in node.parent) {
      node.remove();
    }
  }
}