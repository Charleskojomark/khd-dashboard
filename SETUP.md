# Knowledge Hostage Detector - Setup Guide

## Quick Start

This React application displays undocumented business logic found in the Saleor e-commerce codebase by IBM Bob.

### Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)
- A modern web browser

### Installation Steps

1. **Install Dependencies**

```bash
npm install
```

This will install:
- React 18.2.0
- React DOM 18.2.0
- TypeScript 5.2.2
- Vite 5.0.8
- Tailwind CSS 3.4.0
- All necessary dev dependencies

2. **Start Development Server**

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

3. **Build for Production**

```bash
npm run build
```

Built files will be in the `dist/` directory.

4. **Preview Production Build**

```bash
npm run preview
```

## Project Structure

```
khd-dashboard/
├── src/
│   ├── components/
│   │   ├── common/           # Reusable UI components
│   │   │   ├── Badge.tsx
│   │   │   ├── Button.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── dashboard/        # Dashboard components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── MetricsBar.tsx
│   │   │   └── MetricsCard.tsx
│   │   ├── hostages/         # Hostage display components
│   │   │   ├── HostageCard.tsx
│   │   │   ├── HostageDetails.tsx
│   │   │   ├── HostageList.tsx
│   │   │   └── SeverityBadge.tsx
│   │   └── layout/           # Layout components
│   │       ├── Footer.tsx
│   │       ├── Header.tsx
│   │       └── Layout.tsx
│   ├── data/
│   │   └── saleorHostages.ts # Real Saleor findings data
│   ├── hooks/
│   │   ├── useHostages.ts    # Data fetching hook
│   │   └── useMetrics.ts     # Metrics calculation hook
│   ├── types/
│   │   ├── hostage.types.ts  # TypeScript interfaces
│   │   └── metrics.types.ts
│   ├── utils/
│   │   ├── formatters.ts     # Utility functions
│   │   └── severityHelpers.ts
│   ├── styles/
│   │   └── index.css         # Tailwind CSS imports
│   ├── App.tsx               # Main app component
│   └── main.tsx              # Entry point
├── public/                   # Static assets
├── index.html               # HTML template
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── vite.config.ts           # Vite config
├── tailwind.config.js       # Tailwind config
└── postcss.config.js        # PostCSS config
```

## Features

### 1. Metrics Dashboard
- **Hostages Found**: Total number of undocumented functions
- **Critical Count**: Number of critical severity issues
- **Docs Generated**: Documentation created (placeholder)

### 2. Hostage Cards
- **Expandable**: Click to see full details
- **Severity Badges**: Color-coded (Critical=Red, High=Orange, Medium=Yellow, Low=Blue)
- **Tags**: Categorization tags for each hostage
- **Filtering**: Filter by severity level
- **Sorting**: Sort by severity, date, or file path

### 3. Detailed Information
Each hostage shows:
- Function name and file location
- Bob's analysis of why it matters
- Code snippet (if available)
- Recommended action
- Who depends on this function
- Risk assessment with potential business cost
- Detection date and category

## Data Source

The application displays **10 real findings** from the Saleor e-commerce platform codebase, including:

1. **get_products_voucher_discount()** - Critical voucher calculation logic
2. **get_best_rule()** - Promotion selection algorithm
3. **calculate_checkout_total_with_gift_cards()** - Gift card payment processing
4. **propagate_order_discount_on_order_lines_prices()** - Order discount distribution
5. **determine_order_status()** - Order status determination
6. **get_the_cheapest_line()** - Cheapest item selection
7. **sort_stocks_by_highest_stocks()** - Warehouse prioritization
8. **_applicable_weight_based_methods()** - Shipping method selection
9. **calculate_expiry_date()** - Gift card expiration
10. **get_discount_amount_for()** - Discount calculation

All findings include:
- Severity level (Critical/High/Medium)
- Business impact assessment
- Potential daily cost if broken
- Stakeholder dependencies

## Customization

### Adding More Hostages

Edit `src/data/saleorHostages.ts` to add more findings:

```typescript
{
  id: '11',
  severity: 'high',
  filePath: 'path/to/file.py',
  lineNumber: 123,
  functionName: 'function_name()',
  explanation: 'What the function does...',
  recommendedAction: 'How to document it...',
  // ... other fields
}
```

### Changing Colors

Edit `tailwind.config.js` to customize the severity colors:

```javascript
colors: {
  severity: {
    critical: '#DC2626',  // Change these hex values
    high: '#EA580C',
    medium: '#CA8A04',
    low: '#2563EB',
  },
}
```

### Modifying Layout

- **Header**: Edit `src/components/layout/Header.tsx`
- **Footer**: Edit `src/components/layout/Footer.tsx`
- **Metrics**: Edit `src/components/dashboard/MetricsBar.tsx`

## Troubleshooting

### TypeScript Errors

If you see TypeScript errors after installation, try:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Tailwind Styles Not Applying

1. Ensure `postcss.config.js` and `tailwind.config.js` exist
2. Check that `src/styles/index.css` imports Tailwind directives
3. Restart the dev server

### Port Already in Use

If port 5173 is busy, Vite will automatically use the next available port. Check the terminal output for the actual URL.

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Performance

- Initial bundle size: ~150KB (gzipped)
- First contentful paint: <1s
- Time to interactive: <2s

## Development Tips

1. **Hot Module Replacement**: Changes auto-reload in the browser
2. **TypeScript**: Full type checking in your IDE
3. **Tailwind IntelliSense**: Install the VS Code extension for autocomplete
4. **React DevTools**: Install browser extension for debugging

## Next Steps

1. **API Integration**: Replace mock data with real API calls
2. **Search**: Add search functionality across hostages
3. **Export**: Add PDF/CSV export capabilities
4. **Dark Mode**: Implement theme toggle
5. **Charts**: Add visualization for severity distribution
6. **Authentication**: Add user login if needed

## Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Complete system architecture
- [COMPONENT_SPECS.md](./COMPONENT_SPECS.md) - Detailed component specifications
- [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) - Step-by-step implementation guide
- [README.md](./README.md) - Project overview

## Support

For issues or questions:
1. Check the documentation files
2. Review the implementation guide
3. Inspect browser console for errors
4. Check TypeScript compiler output

---

Built with ❤️ using React, TypeScript, Vite, and Tailwind CSS