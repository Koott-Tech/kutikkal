import { render, screen } from '@testing-library/react';
import ConsultationBanner from '../ConsultationBanner';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('ConsultationBanner Component', () => {
  it('should render the component', () => {
    render(<ConsultationBanner />);
    expect(screen.getByText(/Confused where to start/i)).toBeInTheDocument();
  });

  it('should display the main message', () => {
    render(<ConsultationBanner />);
    expect(screen.getByText(/Book a free 20 minutes session/i)).toBeInTheDocument();
  });

  it('should have a "Book Your Slot Now" button', () => {
    render(<ConsultationBanner />);
    const button = screen.getByText(/Book Your Slot Now/i);
    expect(button).toBeInTheDocument();
  });

  it('should display consultation image', () => {
    render(<ConsultationBanner />);
    const images = screen.getAllByAltText(/Consultation/i);
    expect(images.length).toBeGreaterThan(0);
  });
});
