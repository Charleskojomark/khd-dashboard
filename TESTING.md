# Testing Guide - Knowledge Hostage Detector

This document explains the testing setup and how to run tests for the Knowledge Hostage Detector dashboard.

## Testing Stack

- **Vitest** - Fast unit test framework (Vite-native)
- **React Testing Library** - Component testing utilities
- **@testing-library/user-event** - User interaction simulation
- **@testing-library/jest-dom** - Custom matchers for DOM assertions
- **jsdom** - DOM implementation for Node.js

## Installation

Testing dependencies are already included in `package.json`. To install them:

```bash
npm install
```

## Running Tests

### Run All Tests

```bash
npm test
```

### Watch Mode (Auto-rerun on changes)

```bash
npm test -- --watch
```

### Run Tests with UI

```bash
npm run test:ui
```

This opens an interactive UI in your browser showing test results, coverage, and more.

### Generate Coverage Report

```bash
npm run test:coverage
```

Coverage reports will be generated in the `coverage/` directory.

## Test Structure

Tests are located next to the components they test:

```
src/components/hostages/
├── HostageCard.tsx
├── HostageDetails.tsx
├── HostageList.tsx
└── __tests__/
    ├── HostageCard.test.tsx
    ├── HostageDetails.test.tsx
    └── HostageList.test.tsx
```

## HostageCard Component Tests

The `HostageCard.test.tsx` file contains comprehensive tests covering:

### 1. Rendering Tests
- ✅ Renders basic information (function name, file path, line number)
- ✅ Renders severity badge with correct severity
- ✅ Renders all tags
- ✅ Handles missing line numbers gracefully

### 2. Expand/Collapse Functionality
- ✅ Card is collapsed by default
- ✅ Expands when clicked
- ✅ Collapses when clicked again
- ✅ Chevron icon rotates correctly

### 3. Expanded Details
- ✅ Shows full explanation
- ✅ Shows code snippet (when available)
- ✅ Shows recommended action
- ✅ Shows who depends list
- ✅ Shows risk assessment with costs
- ✅ Shows detection date and category
- ✅ Shows action buttons

### 4. Accessibility
- ✅ Proper ARIA attributes (aria-expanded, aria-controls)
- ✅ ARIA attributes update on toggle
- ✅ Keyboard accessible (Enter key works)
- ✅ Focus management

### 5. Different Severity Levels
- ✅ Critical severity renders correctly
- ✅ High severity renders correctly
- ✅ Medium severity renders correctly
- ✅ Low severity renders correctly

### 6. Edge Cases
- ✅ Handles missing code snippet
- ✅ Handles missing business cost
- ✅ Handles empty tags array
- ✅ Handles long function names
- ✅ Handles long file paths

### 7. Styling
- ✅ Hover effects applied
- ✅ Severity badge styling correct

## Test Example

Here's a simple test from the suite:

```typescript
it('should expand when clicked', async () => {
  const user = userEvent.setup();
  render(<HostageCard hostage={mockHostage} />);
  
  // Find and click the card button
  const button = screen.getByRole('button');
  await user.click(button);
  
  // Details should now be visible
  expect(screen.getByText("Bob's Analysis")).toBeInTheDocument();
  expect(screen.getByText('Recommended Action')).toBeInTheDocument();
});
```

## Writing New Tests

### Basic Test Structure

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import YourComponent from '../YourComponent';

describe('YourComponent', () => {
  it('should render correctly', () => {
    render(<YourComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
  
  it('should handle user interaction', async () => {
    const user = userEvent.setup();
    render(<YourComponent />);
    
    await user.click(screen.getByRole('button'));
    expect(screen.getByText('Result')).toBeInTheDocument();
  });
});
```

### Common Testing Patterns

#### 1. Query Elements

```typescript
// By role (preferred)
screen.getByRole('button')
screen.getByRole('heading', { name: 'Title' })

// By text
screen.getByText('Click me')
screen.getByText(/partial match/i)

// By label
screen.getByLabelText('Email')

// By test ID (last resort)
screen.getByTestId('custom-element')
```

#### 2. User Interactions

```typescript
const user = userEvent.setup();

// Click
await user.click(element);

// Type
await user.type(input, 'text to type');

// Keyboard
await user.keyboard('{Enter}');
await user.keyboard('{Escape}');

// Hover
await user.hover(element);
```

#### 3. Assertions

```typescript
// Existence
expect(element).toBeInTheDocument();
expect(element).not.toBeInTheDocument();

// Visibility
expect(element).toBeVisible();
expect(element).not.toBeVisible();

// Text content
expect(element).toHaveTextContent('text');

// Attributes
expect(element).toHaveAttribute('aria-expanded', 'true');
expect(element).toHaveClass('active');

// Focus
expect(element).toHaveFocus();
```

## Mock Data

Tests use mock data that matches the `Hostage` interface:

```typescript
const mockHostage: Hostage = {
  id: '1',
  severity: 'critical',
  filePath: 'path/to/file.py',
  lineNumber: 123,
  functionName: 'function_name()',
  explanation: 'What it does...',
  recommendedAction: 'How to fix...',
  // ... other fields
};
```

## Coverage Goals

Aim for:
- **Statements**: 80%+
- **Branches**: 75%+
- **Functions**: 80%+
- **Lines**: 80%+

## Continuous Integration

Tests should run automatically on:
- Pull requests
- Commits to main branch
- Pre-commit hooks (optional)

### GitHub Actions Example

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm test
      - run: npm run test:coverage
```

## Debugging Tests

### Run Single Test File

```bash
npm test -- HostageCard.test.tsx
```

### Run Single Test

```bash
npm test -- -t "should expand when clicked"
```

### Debug in VS Code

Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Tests",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["test", "--", "--run"],
  "console": "integratedTerminal"
}
```

## Best Practices

### ✅ DO

- Test user behavior, not implementation details
- Use semantic queries (getByRole, getByLabelText)
- Test accessibility (ARIA attributes, keyboard navigation)
- Keep tests simple and focused
- Use descriptive test names
- Mock external dependencies
- Test edge cases and error states

### ❌ DON'T

- Test internal state directly
- Use implementation-specific queries (querySelector)
- Test styling details (use visual regression tests instead)
- Write tests that depend on other tests
- Mock everything (test real behavior when possible)
- Ignore accessibility

## Troubleshooting

### Tests Fail with "Cannot find module"

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Tests Timeout

Increase timeout in `vitest.config.ts`:

```typescript
export default defineConfig({
  test: {
    testTimeout: 10000, // 10 seconds
  },
})
```

### DOM Not Available

Ensure `jsdom` is configured in `vitest.config.ts`:

```typescript
export default defineConfig({
  test: {
    environment: 'jsdom',
  },
})
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [User Event API](https://testing-library.com/docs/user-event/intro)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)

## Next Steps

1. **Install test dependencies**: `npm install`
2. **Run tests**: `npm test`
3. **View coverage**: `npm run test:coverage`
4. **Add more tests**: Create test files for other components
5. **Set up CI**: Add tests to your CI/CD pipeline

---

**Note**: Test dependencies will be installed when you run `npm install`. The TypeScript errors you see are expected until dependencies are installed.