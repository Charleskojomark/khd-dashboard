import { Hostage } from '../types/hostage.types';

export const saleorHostages: Hostage[] = [
  {
    id: '1',
    severity: 'critical',
    filePath: 'saleor/discount/utils/voucher.py',
    lineNumber: 343,
    functionName: 'get_products_voucher_discount()',
    explanation: 'This function calculates how much money customers save when they use a discount voucher code on products. It handles two scenarios: vouchers that apply once to the cheapest item only, or vouchers that apply to all eligible items in the cart. The `apply_once_per_order` uses `min(prices)` with no explanation why minimum price is chosen.',
    recommendedAction: 'Document the business logic for why minimum price is selected when apply_once_per_order is true. Add inline comments explaining the tie-breaking logic and edge cases. Create unit tests covering various price scenarios.',
    codeSnippet: 'apply_once_per_order = True\ndiscount = min(prices)  # Why minimum? No documentation',
    detectedAt: new Date('2026-05-15'),
    category: 'Pricing & Discounts',
    tags: ['voucher', 'pricing', 'discount-calculation'],
    riskLevel: 'Critical (Revenue & Legal Impact)',
    businessCost: '$50K-500K+ per day',
    whyItMatters: 'If this function were deleted or changed incorrectly, customers would either pay the wrong price at checkout (potentially being overcharged or undercharged), or voucher codes would stop working entirely. The shopping cart would show incorrect discount amounts, leading to customer complaints and potential revenue loss.',
    whoDepends: [
      'Customers using promotional voucher codes',
      'Marketing teams running promotional campaigns',
      'Customer service representatives handling pricing disputes',
      'Finance teams tracking promotional spending'
    ]
  },
  {
    id: '2',
    severity: 'critical',
    filePath: 'saleor/discount/utils/promotion.py',
    lineNumber: 272,
    functionName: 'get_best_rule()',
    explanation: 'This function acts as a "promotion judge" that looks at all active promotional offers (like "20% off" or "free gift with purchase") and determines which single promotion gives the customer the best deal. It compares discount amounts and even considers free gift values to pick the winner. Complex gift vs discount comparison using `max()` on discount amounts with no business justification.',
    recommendedAction: 'Document the algorithm for comparing different promotion types (percentage vs fixed vs gift). Explain how gift values are calculated and compared to monetary discounts. Add decision tree documentation for edge cases.',
    codeSnippet: 'best_rule = max(rules, key=lambda r: r.discount_amount)\n# No explanation of gift vs discount comparison logic',
    detectedAt: new Date('2026-05-15'),
    category: 'Pricing & Discounts',
    tags: ['promotion', 'discount-calculation', 'gift-logic'],
    riskLevel: 'Critical (Revenue & Legal Impact)',
    businessCost: '$25K-250K+ per day',
    whyItMatters: 'If deleted or broken, customers might receive the wrong promotion (a worse deal instead of the best one), or no promotion at all. Free gift promotions could fail to appear. The system would lose its ability to automatically select the most valuable offer for customers.',
    whoDepends: [
      'Customers expecting to automatically receive the best available deal',
      'Marketing teams running multiple concurrent promotions',
      'Sales leadership tracking promotion effectiveness',
      'E-commerce managers preventing customer confusion'
    ]
  },
  {
    id: '3',
    severity: 'critical',
    filePath: 'saleor/checkout/calculations.py',
    lineNumber: 123,
    functionName: 'calculate_checkout_total_with_gift_cards()',
    explanation: 'This function calculates the final amount a customer needs to pay after applying any gift card balances they have. It subtracts the gift card value from the order total while maintaining proper accounting between the gross amount (with tax) and net amount (without tax). Lines 148-160 use proportional gift card application with complex tax calculation: `gross_percentage = total.gross / total.net` with no explanation.',
    recommendedAction: 'Document the proportional tax calculation formula and why it\'s necessary. Explain edge cases like when gift card exceeds order total. Add examples of the calculation with different tax rates.',
    codeSnippet: 'gross_percentage = total.gross / total.net\ngift_card_amount = balance * gross_percentage\n# Complex tax math with no documentation',
    detectedAt: new Date('2026-05-14'),
    category: 'Checkout',
    tags: ['gift-card', 'tax-calculation', 'payment'],
    riskLevel: 'Critical (Revenue, Legal & Compliance Impact)',
    businessCost: '$100K-1M+ per day',
    whyItMatters: 'If this function failed, customers with gift cards would be charged the full order amount without the gift card being applied, or the system might crash during checkout. Gift card holders would essentially lose their stored value, leading to serious customer service issues and potential legal problems.',
    whoDepends: [
      'Customers with gift cards expecting balance reduction',
      'Customer service teams handling gift card issues',
      'Finance/accounting teams tracking gift card liability',
      'Legal/compliance teams ensuring gift card regulations are followed'
    ]
  },
  {
    id: '4',
    severity: 'critical',
    filePath: 'saleor/order/base_calculations.py',
    lineNumber: 239,
    functionName: 'propagate_order_discount_on_order_lines_prices()',
    explanation: 'When a store manager applies a discount to an entire order (like "$50 off your order" or "20% off everything"), this function distributes that discount proportionally across all items in the order. Lines 242-256 show proportional discount distribution with rounding handled on last line, but no explanation of rounding strategy or why this approach was chosen.',
    recommendedAction: 'Document the proportional distribution formula and rounding strategy. Explain why the last line item absorbs rounding differences. Add examples showing how $50 off is split across 3 items with different prices.',
    codeSnippet: 'for i, line in enumerate(lines):\n    line_discount = (total_discount * line.price) / subtotal\n    if i == len(lines) - 1:\n        line_discount += rounding_diff  # Why last line?',
    detectedAt: new Date('2026-05-14'),
    category: 'Order Processing',
    tags: ['order-discount', 'calculation', 'rounding'],
    riskLevel: 'Critical (Compliance & Financial Reporting Impact)',
    businessCost: '$50K-500K+ in penalties',
    whyItMatters: 'If broken, order-level discounts would either not apply at all, or would be incorrectly distributed across items. Financial reports showing "revenue by product" would be wrong. Tax calculations could fail because they depend on accurate line-item prices.',
    whoDepends: [
      'Finance/accounting teams needing accurate per-item revenue',
      'Inventory managers tracking profitability per product',
      'Customer service representatives processing returns/refunds',
      'Business analysts making product performance decisions'
    ]
  },
  {
    id: '5',
    severity: 'high',
    filePath: 'saleor/order/utils.py',
    lineNumber: 210,
    functionName: 'determine_order_status()',
    explanation: 'This function looks at an order\'s fulfillment numbers (how many items were ordered, shipped, returned, etc.) and determines the order\'s current status label: "Unfulfilled," "Partially Fulfilled," "Fulfilled," "Partially Returned," or "Returned." Lines 216-226 contain complex status determination logic with multiple thresholds but no business rule documentation for status transitions.',
    recommendedAction: 'Create a state diagram showing all possible status transitions. Document the thresholds for each status (e.g., what percentage fulfilled = "Partially Fulfilled"). Add examples of edge cases.',
    codeSnippet: 'if fulfilled_count == 0:\n    return "UNFULFILLED"\nelif fulfilled_count < total_count:\n    return "PARTIALLY_FULFILLED"\n# No documentation of threshold logic',
    detectedAt: new Date('2026-05-13'),
    category: 'Order Processing',
    tags: ['order-status', 'fulfillment', 'state-machine'],
    riskLevel: 'High (Operational Disruption)',
    businessCost: '$10K-100K per day',
    whyItMatters: 'If this function broke, order statuses would be wrong or missing throughout the system. Warehouse staff wouldn\'t know which orders need shipping. Customer service couldn\'t accurately tell customers their order status. Automated emails about order updates would send incorrect information.',
    whoDepends: [
      'Warehouse/fulfillment teams knowing which orders to ship',
      'Customer service representatives answering order status questions',
      'Customers receiving automated status update emails',
      'Operations managers monitoring fulfillment metrics',
      'Automated systems triggering workflows'
    ]
  },
  {
    id: '6',
    severity: 'critical',
    filePath: 'saleor/discount/utils/voucher.py',
    lineNumber: 256,
    functionName: 'get_the_cheapest_line()',
    explanation: 'This function identifies the cheapest line item in a cart when applying vouchers that should only discount the lowest-priced item. Uses `min()` on `variant_discounted_price` with no tie-breaking logic documented. What happens when multiple items have the same price?',
    recommendedAction: 'Document tie-breaking logic when multiple items have identical prices. Specify whether it uses first occurrence, random selection, or another method. Add unit tests for tie scenarios.',
    codeSnippet: 'cheapest = min(lines, key=lambda l: l.variant_discounted_price)\n# No tie-breaking logic documented',
    detectedAt: new Date('2026-05-13'),
    category: 'Pricing & Discounts',
    tags: ['voucher', 'min-price', 'tie-breaking'],
    riskLevel: 'Critical (Revenue Impact)',
    businessCost: '$25K-100K+ per day',
    whyItMatters: 'Inconsistent behavior when multiple items have the same price could lead to customer confusion and complaints about which item received the discount.',
    whoDepends: [
      'Customers using "cheapest item" vouchers',
      'Marketing teams designing promotional campaigns',
      'Customer service handling discount disputes'
    ]
  },
  {
    id: '7',
    severity: 'high',
    filePath: 'saleor/warehouse/management.py',
    lineNumber: 280,
    functionName: 'sort_stocks_by_highest_stocks()',
    explanation: 'This function sorts warehouse locations by available stock levels to determine fulfillment priority. Uses `math.inf` for collection point priority - a magic value with no business justification. Why does collection point get infinite priority?',
    recommendedAction: 'Document why collection points receive infinite priority in stock sorting. Explain the business rule behind this decision and any exceptions. Consider using a named constant instead of magic number.',
    codeSnippet: 'if warehouse.is_collection_point:\n    priority = math.inf  # Why infinite priority?\nelse:\n    priority = available_stock',
    detectedAt: new Date('2026-05-12'),
    category: 'Warehouse & Inventory',
    tags: ['warehouse', 'stock-sorting', 'magic-number'],
    riskLevel: 'High (Operational Impact)',
    businessCost: '$5K-50K per day',
    whyItMatters: 'Incorrect warehouse prioritization could lead to inefficient fulfillment, higher shipping costs, or stockouts at preferred locations.',
    whoDepends: [
      'Warehouse operations teams',
      'Logistics managers optimizing fulfillment',
      'Finance teams tracking shipping costs'
    ]
  },
  {
    id: '8',
    severity: 'high',
    filePath: 'saleor/shipping/models.py',
    lineNumber: 33,
    functionName: '_applicable_weight_based_methods()',
    explanation: 'This function determines which shipping methods are available based on order weight. Lines 36-42 show weight range matching with NULL handling, but no business rule for NULL boundaries is documented. Does NULL mean unlimited?',
    recommendedAction: 'Document the meaning of NULL values in min_weight and max_weight fields. Specify whether NULL means "no limit" or has other semantics. Add examples of edge cases.',
    codeSnippet: 'if method.min_weight is None or weight >= method.min_weight:\n    if method.max_weight is None or weight <= method.max_weight:\n        # NULL handling not documented',
    detectedAt: new Date('2026-05-12'),
    category: 'Shipping',
    tags: ['shipping', 'weight-calculation', 'null-handling'],
    riskLevel: 'High (Customer Experience Impact)',
    businessCost: '$10K-50K per day',
    whyItMatters: 'Incorrect shipping method availability could prevent customers from completing checkout or offer inappropriate shipping options.',
    whoDepends: [
      'Customers selecting shipping methods',
      'Operations teams configuring shipping rules',
      'Customer service handling shipping issues'
    ]
  },
  {
    id: '9',
    severity: 'medium',
    filePath: 'saleor/giftcard/utils.py',
    lineNumber: 219,
    functionName: 'calculate_expiry_date()',
    explanation: 'This function calculates when a gift card expires based on issuance date and expiry settings. Lines 223-226 use `relativedelta` with dynamic period type, but no explanation of expiry calculation business rules. How are partial periods handled?',
    recommendedAction: 'Document the expiry calculation formula for different period types (days, months, years). Explain how partial periods are handled and timezone considerations. Add examples.',
    codeSnippet: 'expiry = issue_date + relativedelta(**{period_type: period_value})\n# Dynamic period calculation not explained',
    detectedAt: new Date('2026-05-11'),
    category: 'Gift Cards',
    tags: ['gift-card', 'expiry', 'date-calculation'],
    riskLevel: 'Medium (Compliance Risk)',
    businessCost: '$5K-25K per day',
    whyItMatters: 'Incorrect expiry calculations could violate gift card regulations or cause customer complaints about premature expiration.',
    whoDepends: [
      'Customers with gift cards',
      'Legal/compliance teams',
      'Customer service handling expiry disputes'
    ]
  },
  {
    id: '10',
    severity: 'medium',
    filePath: 'saleor/discount/models.py',
    lineNumber: 171,
    functionName: 'get_discount_amount_for()',
    explanation: 'This function calculates the discount amount for a given price. Lines 173-175 return full price if `after_discount.amount < 0`, but there\'s no explanation of negative discount handling. Is this a safety check or business rule?',
    recommendedAction: 'Document why negative discounts return the full price. Explain if this is a safety check or intentional business logic. Add logging for when this occurs.',
    codeSnippet: 'after_discount = price - discount\nif after_discount.amount < 0:\n    return price  # Why return full price?',
    detectedAt: new Date('2026-05-11'),
    category: 'Pricing & Discounts',
    tags: ['discount', 'negative-handling', 'edge-case'],
    riskLevel: 'Medium (Revenue Protection)',
    businessCost: '$5K-20K per day',
    whyItMatters: 'Unclear negative discount handling could lead to unexpected pricing behavior or missed revenue protection opportunities.',
    whoDepends: [
      'Finance teams tracking discount costs',
      'Marketing teams setting discount limits',
      'Developers maintaining pricing logic'
    ]
  }
];

// Made with Bob
