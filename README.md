# Figma Accessibility Checker Plugin

A comprehensive Figma plugin that checks design files for accessibility compliance and suggests automated improvements.

## Features

- **Accessibility Auditing**: Automatically scan your Figma designs for accessibility issues
  - Text contrast verification
  - Font size checks
  - Component documentation validation
  - Text line length analysis

- **Smart Suggestions**: Get actionable recommendations for improvements
  - Categorized by severity (errors, warnings, info)
  - WCAG 2.1 AA guideline references
  - Detailed explanations for each issue

- **Automated Fixes**: Apply fixes with one click
  - Auto-fixable issues are clearly marked
  - Bulk apply all fixes at once
  - Manual review before applying

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Figma desktop app

### Setup

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the plugin:
   ```bash
   npm run build
   ```

4. Open Figma and go to Menu > Plugins > Development > Import plugin from manifest...
5. Select the `manifest.json` file from this project directory

## Development

To develop with hot reloading:

```bash
npm run dev
```

For type checking:
```bash
npm run type-check
```

For linting:
```bash
npm run lint
```

## Usage

1. Open a Figma file and run the plugin (Menu > Plugins > Accessibility Checker)
2. Click "Check Accessibility" to scan the current page
3. Review issues listed by severity
4. Click "Generate Suggestions" to get recommendations
5. Apply individual fixes or click "Apply All Fixes" for auto-fixable issues

## Architecture

### Core Components

- **main.ts**: Plugin entry point, handles communication between UI and checker
- **accessibility-checker.ts**: Core scanning engine for accessibility issues
- **suggestion-engine.ts**: Generates suggestions based on issues found
- **auto-fixer.ts**: Implements automatic fixes for accessibility problems
- **ui.ts**: Frontend UI controller and message handling
- **ui.html**: Plugin interface markup and styling

## Supported Checks

### Text & Typography
- ✓ Minimum font size (12px)
- ✓ Line length (75 characters max)
- ✓ Empty text nodes

### Components
- ✓ Component descriptions for documentation
- ✓ Missing accessibility metadata

### Color & Contrast
- ✓ Potential contrast issues
- ✓ Brightness detection

## Accessibility Standards

This plugin follows **WCAG 2.1 Level AA** guidelines:
- 1.4.3 Contrast (Minimum)
- 1.4.4 Resize Text
- 1.4.8 Visual Presentation

## Future Enhancements

- [ ] Interactive color contrast calculator
- [ ] Custom rule creation
- [ ] Design system integration
- [ ] Bulk export reports
- [ ] Team collaboration features
- [ ] Integration with design tokens
- [ ] WCAG 2.1 AAA support
- [ ] Keyboard navigation validation
- [ ] ARIA attribute checking
- [ ] Animation duration validation

## Contributing

Contributions are welcome! Please ensure all code passes linting and type checking before submitting pull requests.

## License

MIT

## Support

For issues or feature requests, please create an issue in the GitHub repository.
