import { render, screen } from '@testing-library/react';
import HowItWorks from '../HowItWorks';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

describe('HowItWorks Component', () => {
  it('should render the component', () => {
    render(<HowItWorks />);
    expect(screen.getByText(/How it works/i)).toBeInTheDocument();
  });

  it('should display the main heading', () => {
    render(<HowItWorks />);
    expect(screen.getByText(/Start Your Child's Therapy Journey/i)).toBeInTheDocument();
  });

  it('should display all four cards', () => {
    render(<HowItWorks />);
    
    // Use getAllByText since cards appear in both mobile and desktop views
    expect(screen.getAllByText(/Tell Us What's Important/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Explore Your Matches/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Schedule Your Visit/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Join Online Session/i).length).toBeGreaterThan(0);
  });

  it('should have a "Get started" button', () => {
    render(<HowItWorks />);
    // Use getAllByText since button appears in multiple places
    const buttons = screen.getAllByText(/Get started/i);
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should display card numbers', () => {
    render(<HowItWorks />);
    
    // Use getAllByText since numbers appear in both mobile and desktop views
    expect(screen.getAllByText('01').length).toBeGreaterThan(0);
    expect(screen.getAllByText('02').length).toBeGreaterThan(0);
    expect(screen.getAllByText('03').length).toBeGreaterThan(0);
    expect(screen.getAllByText('04').length).toBeGreaterThan(0);
  });
});
