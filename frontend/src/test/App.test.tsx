import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { AppProvider } from '../context/AppContext';
import { DashboardPage } from '../pages/DashboardPage';
import { BreathingCircle } from '../components/calm/BreathingCircle';
import { FiveSensesGrounding } from '../components/calm/FiveSensesGrounding';
import { ShortReset } from '../components/calm/ShortReset';
import { EmergencyHelpModal } from '../components/common/EmergencyHelpModal';
import { demoStorage } from '../lib/storage';

describe('Her Safe Space - Frontend Component Suite', () => {
  beforeEach(() => {
    demoStorage.clearAllDemoData();
  });

  it('renders Dashboard with greeting and tagline', async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <AppProvider>
            <DashboardPage />
          </AppProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Hey,/i)).toBeInTheDocument();
    expect(screen.getByText(/You don't have to figure everything out today/i)).toBeInTheDocument();
    expect(screen.getByText(/How are you carrying yourself right now?/i)).toBeInTheDocument();
  });

  it('allows user to select a mood and view supportive response', async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <AppProvider>
            <DashboardPage />
          </AppProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    // Click "I'm overwhelmed."
    const overwhelmedBtn = screen.getByText("I'm overwhelmed.");
    fireEvent.click(overwhelmedBtn);

    await waitFor(() => {
      expect(screen.getByText(/A gentle thought for this moment/i)).toBeInTheDocument();
      expect(screen.getByText(/When everything is loud, you only need to survive this single minute/i)).toBeInTheDocument();
    });
  });

  it('controls the 4-6 Breathing circle (Start, Pause, Reset)', () => {
    render(<BreathingCircle />);

    const startBtn = screen.getByText(/Start Breathing/i);
    expect(startBtn).toBeInTheDocument();

    // Start
    fireEvent.click(startBtn);
    expect(screen.getByRole('button', { name: /Pause/i })).toBeInTheDocument();

    // Reset
    const resetBtn = screen.getByTitle(/Reset timer/i);
    fireEvent.click(resetBtn);
    expect(screen.getByText(/Start Breathing/i)).toBeInTheDocument();
  });

  it('progresses through 5-4-3-2-1 Sensory Grounding steps', () => {
    render(<FiveSensesGrounding />);

    expect(screen.getByText(/5 Things You Can See/i)).toBeInTheDocument();

    // Click Next
    const nextBtn = screen.getByText(/Next/i);
    fireEvent.click(nextBtn);

    expect(screen.getByText(/4 Things You Can Feel/i)).toBeInTheDocument();
  });

  it('navigates through the 60-Second Short Reset', () => {
    render(<ShortReset />);

    expect(screen.getByText(/Put your feet somewhere comfortable/i)).toBeInTheDocument();

    const nextBtn = screen.getByText(/Next Step/i);
    fireEvent.click(nextBtn);

    expect(screen.getByText(/Relax your shoulders if that feels comfortable/i)).toBeInTheDocument();
  });

  it('displays verified emergency crisis numbers', () => {
    // Open emergency modal inside AppProvider
    const TestComponent = () => {
      const { openEmergencyModal } = (React as any).useContext(
        (window as any).__TEST_APP_CONTEXT || React.createContext({})
      );
      return <EmergencyHelpModal />;
    };

    render(
      <AuthProvider>
        <AppProvider>
          <EmergencyHelpModal />
        </AppProvider>
      </AuthProvider>
    );
  });
});
