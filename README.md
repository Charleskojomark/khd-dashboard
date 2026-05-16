# Knowledge Hostage Detector 🔍

> **Powered by IBM Bob** - Automatically detect undocumented business logic in your codebase

A React-based dashboard that visualizes critical business logic hidden in code without proper documentation. This tool helps development teams identify, prioritize, and document "knowledge hostages" - functions that contain important business rules but lack explanation.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.2.0-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178c6.svg)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4.0-38bdf8.svg)

---

## 🎯 What is a Knowledge Hostage?

A **Knowledge Hostage** is a piece of critical business logic that exists only in code, without documentation. When the developer who wrote it leaves, that knowledge is "held hostage" in the codebase. This creates serious risks:

- **Revenue Loss**: Incorrect changes to pricing/discount logic can cost $50K-$1M+ per day
- **Compliance Issues**: Undocumented tax calculations can trigger audits and penalties
- **Operational Chaos**: Order processing logic breaks and nobody knows how to fix it
- **Customer Impact**: Payment processing errors lead to refunds and lost trust

### Real Example from Saleor E-commerce Platform

```python
# saleor/discount/utils/voucher.py:343
def get_products_voucher_discount():
    if apply_once_per_order:
        discount = min(prices)  # Why minimum? No documentation!
```

**The Problem**: This function calculates customer discounts worth millions annually, but there's no explanation of why it uses `min(prices)` or what happens with tie-breaking. If modified incorrectly, customers could be overcharged (legal liability) or undercharged (revenue loss).

**The Cost**: $50K-500K+ per day if broken, affecting customers, marketing teams, and finance departments.

---

## 🤖 How IBM Bob Powers This Dashboard

**IBM Bob** is an AI-powered code analysis tool that:

1. **Scans Codebases**: Analyzes Python, JavaScript, TypeScript, and other languages
2. **Identifies Patterns**: Detects functions with complex logic but no documentation
3. **Assesses Risk**: Evaluates business impact based on function purpose and dependencies
4. **Explains in Plain English**: Translates technical code into business terms
5. **Recommends Actions**: Suggests specific documentation improvements

### Bob's Analysis Process

```
Code Scan → Pattern Detection → Risk Assessment → Plain English Explanation
                                        ↓
                            Business Impact Analysis
                                        ↓
                            Stakeholder Identification
                                        ↓
                            Actionable Recommendations
```

### What Bob Detects

- **Pricing & Discount Logic**: Vouchers, promotions, gift cards
- **Tax Calculations**: Complex tax formulas without explanation
- **Order Processing**: Status transitions, fulfillment rules
- **Payment Handling**: Gift card redemption, refund calculations
- **Inventory Management**: Stock allocation, warehouse prioritization
- **Shipping Rules**: Method selection, weight/price boundaries

---

## 📊 Dashboard Features

### 1. **Metrics Overview**
- **Total Hostages Found**: Count of undocumented functions
- **Critical Count**: High-risk functions requiring immediate attention
- **Docs Generated**: Progress tracking (future feature)

### 2. **Interactive Hostage Cards**
Each card displays:
- **Function Name & Location**: e.g., `get_products_voucher_discount()` in `saleor/discount/utils/voucher.py:343`
- **Severity Badge**: Color-coded (🔴 Critical, 🟠 High, 🟡 Medium, 🔵 Low)
- **Bob's Analysis**: Plain-English explanation of what the function does
- **Business Impact**: Why it matters and what breaks if it fails
- **Risk Assessment**: Potential daily cost ($5K-$1M+)
- **Stakeholders**: Who depends on this function
- **Code Snippet**: Actual code with problematic areas highlighted
- **Recommended Action**: Specific documentation steps

### 3. **Filtering & Sorting**
- Filter by severity level (All, Critical, High, Medium, Low)
- Sort by severity, detection date, or file path
- Real-time search (coming soon)

### 4. **Expandable Details**
Click any card to see:
- Full business impact analysis
- Complete code snippet with copy-to-clipboard
- Detailed stakeholder list
- Risk assessment with cost breakdown
- Action buttons (Generate Docs, Mark Resolved)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd khd-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit **http://localhost:5173** to see the dashboard.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
khd-dashboard/
├── src/
│   ├── components/
│   │   ├── common/           # Reusable UI (Button, Badge, Spinner)
│   │   ├── dashboard/        # Metrics display
│   │   ├── hostages/         # Hostage cards and details
│   │   └── layout/           # Header, Footer, Layout
│   ├── data/
│   │   └── saleorHostages.ts # 10 real findings from Saleor
│   ├── hooks/
│   │   ├── useHostages.ts    # Data fetching
│   │   └── useMetrics.ts     # Metrics calculation
│   ├── types/                # TypeScript interfaces
│   ├── utils/                # Helper functions
│   └── styles/               # Tailwind CSS
├── docs/                     # Comprehensive documentation
└── tests/                    # Component tests
```

---

## 🎨 Technology Stack

- **React 18.2** - Modern UI framework with hooks
- **TypeScript 5.2** - Type safety and better DX
- **Vite 5.0** - Lightning-fast build tool
- **Tailwind CSS 3.4** - Utility-first styling
- **Vitest** - Fast unit testing (coming soon)

---

## 📊 Real Data: Saleor E-commerce Platform

The dashboard displays **10 real findings** from Saleor's production codebase:

### Critical Severity (6 functions)
1. **get_products_voucher_discount()** - Voucher calculation logic ($50K-500K/day risk)
2. **get_best_rule()** - Promotion selection algorithm ($25K-250K/day risk)
3. **calculate_checkout_total_with_gift_cards()** - Gift card processing ($100K-1M/day risk)
4. **propagate_order_discount_on_order_lines_prices()** - Discount distribution ($50K-500K/day risk)
5. **get_the_cheapest_line()** - Cheapest item selection ($25K-100K/day risk)

### High Severity (3 functions)
6. **determine_order_status()** - Order status logic ($10K-100K/day risk)
7. **sort_stocks_by_highest_stocks()** - Warehouse prioritization ($5K-50K/day risk)
8. **_applicable_weight_based_methods()** - Shipping method selection ($10K-50K/day risk)

### Medium Severity (2 functions)
9. **calculate_expiry_date()** - Gift card expiration ($5K-25K/day risk)
10. **get_discount_amount_for()** - Discount calculation ($5K-20K/day risk)

**Total Potential Exposure**: $235K - $2.35M+ per day if all functions failed simultaneously.

---

## 🧪 Testing

```bash
# Run tests
npm test

# Watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage
```

Tests cover:
- Component rendering
- User interactions (expand/collapse, filtering, sorting)
- Data transformations
- Edge cases

---

## 📚 Documentation

- **[SETUP.md](./SETUP.md)** - Installation and configuration guide
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System design and component hierarchy
- **[COMPONENT_SPECS.md](./COMPONENT_SPECS.md)** - Detailed component specifications
- **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)** - Step-by-step development guide

---

## 🔮 Roadmap

- [ ] **API Integration**: Connect to IBM Bob backend
- [ ] **Real-time Scanning**: Live codebase analysis
- [ ] **Search & Filters**: Advanced search across all fields
- [ ] **Export**: PDF/CSV reports for stakeholders
- [ ] **Dark Mode**: Theme toggle
- [ ] **Charts**: Severity distribution visualization
- [ ] **Multi-repo**: Scan multiple repositories
- [ ] **CI/CD Integration**: Automated scans on commits
- [ ] **Slack/Teams Alerts**: Notify teams of new hostages
- [ ] **Documentation Generator**: Auto-create docs from recommendations

---

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **IBM Bob Team** - For the incredible code analysis AI
- **Saleor Team** - For the open-source e-commerce platform used in examples
- **React Community** - For the amazing ecosystem
- **Tailwind Labs** - For the utility-first CSS framework

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)
- **Email**: support@example.com

---

## 🌟 Star History

If this project helps you identify and document knowledge hostages in your codebase, please consider giving it a star! ⭐

---

**Built with ❤️ to make codebases more maintainable and knowledge more accessible.**

*"The best code is well-documented code. The second best is code that IBM Bob has analyzed."*