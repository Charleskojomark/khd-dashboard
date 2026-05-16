import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HostageCard from '../HostageCard';
import { Hostage } from '../../../types/hostage.types';

// Mock hostage data for testing
const mockHostage: Hostage = {
  id: '1',
  severity: 'critical',
  filePath: 'saleor/discount/utils/voucher.py',
  lineNumber: 343,
  functionName: 'get_products_voucher_discount()',
  explanation: 'This function calculates how much money customers save when they use a discount voucher code.',
  recommendedAction: 'Document the business logic for why minimum price is selected.',
  codeSnippet: 'apply_once_per_order = True\ndiscount = min(prices)',
  detectedAt: new Date('2026-05-15'),
  category: 'Pricing & Discounts',
  tags: ['voucher', 'pricing', 'discount-calculation'],
  riskLevel: 'Critical (Revenue & Legal Impact)',
  businessCost: '$50K-500K+ per day',
  whyItMatters: 'If this function were deleted or changed incorrectly, customers would pay the wrong price.',
  whoDepends: [
    'Customers using promotional voucher codes',
    'Marketing teams running promotional campaigns',
    'Customer service representatives',
  ],
};

describe('HostageCard', () => {
  describe('Rendering', () => {
    it('should render the hostage card with basic information', () => {
      render(<HostageCard hostage={mockHostage} />);
      
      // Check function name is displayed
      expect(screen.getByText('get_products_voucher_discount()')).toBeInTheDocument();
      
      // Check file path is displayed
      expect(screen.getByText(/saleor\/discount\/utils\/voucher.py/)).toBeInTheDocument();
      
      // Check line number is displayed
      expect(screen.getByText(/:343/)).toBeInTheDocument();
      
      // Check explanation is displayed (truncated)
      expect(screen.getByText(/This function calculates how much money customers save/)).toBeInTheDocument();
    });

    it('should render severity badge with correct severity', () => {
      render(<HostageCard hostage={mockHostage} />);
      
      // Check severity badge is displayed
      expect(screen.getByText('Critical')).toBeInTheDocument();
    });

    it('should render all tags', () => {
      render(<HostageCard hostage={mockHostage} />);
      
      // Check all tags are displayed
      expect(screen.getByText('voucher')).toBeInTheDocument();
      expect(screen.getByText('pricing')).toBeInTheDocument();
      expect(screen.getByText('discount-calculation')).toBeInTheDocument();
    });

    it('should render without line number when not provided', () => {
      const hostageWithoutLine = { ...mockHostage, lineNumber: undefined };
      render(<HostageCard hostage={hostageWithoutLine} />);
      
      // Check that line number is not displayed
      expect(screen.queryByText(/:343/)).not.toBeInTheDocument();
    });
  });

  describe('Expand/Collapse Functionality', () => {
    it('should be collapsed by default', () => {
      render(<HostageCard hostage={mockHostage} />);
      
      // Details should not be visible initially
      expect(screen.queryByText("Bob's Analysis")).not.toBeInTheDocument();
      expect(screen.queryByText('Recommended Action')).not.toBeInTheDocument();
    });

    it('should expand when clicked', async () => {
      const user = userEvent.setup();
      render(<HostageCard hostage={mockHostage} />);
      
      // Find and click the card button
      const button = screen.getByRole('button');
      await user.click(button);
      
      // Details should now be visible
      expect(screen.getByText("Bob's Analysis")).toBeInTheDocument();
      expect(screen.getByText('Recommended Action')).toBeInTheDocument();
      expect(screen.getByText('Who Depends On This')).toBeInTheDocument();
    });

    it('should collapse when clicked again', async () => {
      const user = userEvent.setup();
      render(<HostageCard hostage={mockHostage} />);
      
      const button = screen.getByRole('button');
      
      // Expand
      await user.click(button);
      expect(screen.getByText("Bob's Analysis")).toBeInTheDocument();
      
      // Collapse
      await user.click(button);
      expect(screen.queryByText("Bob's Analysis")).not.toBeInTheDocument();
    });

    it('should toggle chevron icon rotation', async () => {
      const user = userEvent.setup();
      render(<HostageCard hostage={mockHostage} />);
      
      const button = screen.getByRole('button');
      const svg = button.querySelector('svg');
      
      // Initially not rotated
      expect(svg).not.toHaveClass('rotate-180');
      
      // Click to expand
      await user.click(button);
      expect(svg).toHaveClass('rotate-180');
      
      // Click to collapse
      await user.click(button);
      expect(svg).not.toHaveClass('rotate-180');
    });
  });

  describe('Expanded Details', () => {
    it('should show full explanation when expanded', async () => {
      const user = userEvent.setup();
      render(<HostageCard hostage={mockHostage} />);
      
      await user.click(screen.getByRole('button'));
      
      expect(screen.getByText(mockHostage.whyItMatters)).toBeInTheDocument();
    });

    it('should show code snippet when available', async () => {
      const user = userEvent.setup();
      render(<HostageCard hostage={mockHostage} />);
      
      await user.click(screen.getByRole('button'));
      
      expect(screen.getByText('Code Snippet')).toBeInTheDocument();
      expect(screen.getByText(/apply_once_per_order = True/)).toBeInTheDocument();
    });

    it('should show recommended action', async () => {
      const user = userEvent.setup();
      render(<HostageCard hostage={mockHostage} />);
      
      await user.click(screen.getByRole('button'));
      
      expect(screen.getByText('Recommended Action')).toBeInTheDocument();
      expect(screen.getByText(mockHostage.recommendedAction)).toBeInTheDocument();
    });

    it('should show who depends list', async () => {
      const user = userEvent.setup();
      render(<HostageCard hostage={mockHostage} />);
      
      await user.click(screen.getByRole('button'));
      
      expect(screen.getByText('Who Depends On This')).toBeInTheDocument();
      mockHostage.whoDepends.forEach(dep => {
        expect(screen.getByText(dep)).toBeInTheDocument();
      });
    });

    it('should show risk assessment', async () => {
      const user = userEvent.setup();
      render(<HostageCard hostage={mockHostage} />);
      
      await user.click(screen.getByRole('button'));
      
      expect(screen.getByText('Risk Assessment')).toBeInTheDocument();
      expect(screen.getByText(mockHostage.riskLevel)).toBeInTheDocument();
      expect(screen.getByText(/\$50K-500K\+ per day/)).toBeInTheDocument();
    });

    it('should show detection date and category', async () => {
      const user = userEvent.setup();
      render(<HostageCard hostage={mockHostage} />);
      
      await user.click(screen.getByRole('button'));
      
      expect(screen.getByText(/Detected:/)).toBeInTheDocument();
      expect(screen.getByText(/Category: Pricing & Discounts/)).toBeInTheDocument();
    });

    it('should show action buttons', async () => {
      const user = userEvent.setup();
      render(<HostageCard hostage={mockHostage} />);
      
      await user.click(screen.getByRole('button'));
      
      expect(screen.getByText('Generate Documentation')).toBeInTheDocument();
      expect(screen.getByText('Mark as Resolved')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<HostageCard hostage={mockHostage} />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-expanded', 'false');
      expect(button).toHaveAttribute('aria-controls', `hostage-details-${mockHostage.id}`);
    });

    it('should update aria-expanded when toggled', async () => {
      const user = userEvent.setup();
      render(<HostageCard hostage={mockHostage} />);
      
      const button = screen.getByRole('button');
      
      // Initially collapsed
      expect(button).toHaveAttribute('aria-expanded', 'false');
      
      // Expand
      await user.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'true');
      
      // Collapse
      await user.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('should be keyboard accessible', async () => {
      const user = userEvent.setup();
      render(<HostageCard hostage={mockHostage} />);
      
      const button = screen.getByRole('button');
      
      // Focus the button
      button.focus();
      expect(button).toHaveFocus();
      
      // Press Enter to expand
      await user.keyboard('{Enter}');
      expect(screen.getByText("Bob's Analysis")).toBeInTheDocument();
    });
  });

  describe('Different Severity Levels', () => {
    it('should render high severity correctly', () => {
      const highSeverityHostage = { ...mockHostage, severity: 'high' as const };
      render(<HostageCard hostage={highSeverityHostage} />);
      
      expect(screen.getByText('High')).toBeInTheDocument();
    });

    it('should render medium severity correctly', () => {
      const mediumSeverityHostage = { ...mockHostage, severity: 'medium' as const };
      render(<HostageCard hostage={mediumSeverityHostage} />);
      
      expect(screen.getByText('Medium')).toBeInTheDocument();
    });

    it('should render low severity correctly', () => {
      const lowSeverityHostage = { ...mockHostage, severity: 'low' as const };
      render(<HostageCard hostage={lowSeverityHostage} />);
      
      expect(screen.getByText('Low')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle hostage without code snippet', async () => {
      const user = userEvent.setup();
      const hostageWithoutSnippet = { ...mockHostage, codeSnippet: undefined };
      render(<HostageCard hostage={hostageWithoutSnippet} />);
      
      await user.click(screen.getByRole('button'));
      
      // Code snippet section should not be present
      expect(screen.queryByText('Code Snippet')).not.toBeInTheDocument();
    });

    it('should handle hostage without business cost', async () => {
      const user = userEvent.setup();
      const hostageWithoutCost = { ...mockHostage, businessCost: undefined };
      render(<HostageCard hostage={hostageWithoutCost} />);
      
      await user.click(screen.getByRole('button'));
      
      // Should still show risk assessment but not cost
      expect(screen.getByText('Risk Assessment')).toBeInTheDocument();
      expect(screen.queryByText(/Potential Cost:/)).not.toBeInTheDocument();
    });

    it('should handle empty tags array', () => {
      const hostageWithoutTags = { ...mockHostage, tags: [] };
      render(<HostageCard hostage={hostageWithoutTags} />);
      
      // Should render without errors
      expect(screen.getByText('get_products_voucher_discount()')).toBeInTheDocument();
    });

    it('should handle long function names', () => {
      const longName = 'very_long_function_name_that_might_cause_layout_issues_in_the_ui()';
      const hostageWithLongName = { ...mockHostage, functionName: longName };
      render(<HostageCard hostage={hostageWithLongName} />);
      
      expect(screen.getByText(longName)).toBeInTheDocument();
    });

    it('should handle long file paths', () => {
      const longPath = 'very/long/path/to/some/deeply/nested/directory/structure/file.py';
      const hostageWithLongPath = { ...mockHostage, filePath: longPath };
      render(<HostageCard hostage={hostageWithLongPath} />);
      
      expect(screen.getByText(new RegExp(longPath))).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should have hover effect classes', () => {
      const { container } = render(<HostageCard hostage={mockHostage} />);
      
      const card = container.firstChild;
      expect(card).toHaveClass('hover:shadow-lg');
      expect(card).toHaveClass('transition-shadow');
    });

    it('should apply correct severity badge styling', () => {
      render(<HostageCard hostage={mockHostage} />);
      
      const badge = screen.getByText('Critical');
      expect(badge).toHaveClass('bg-red-100');
      expect(badge).toHaveClass('text-red-800');
    });
  });
});

// Made with Bob
