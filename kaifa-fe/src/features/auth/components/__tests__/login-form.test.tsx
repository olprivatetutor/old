import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '../login-form';

const mockLogin = jest.fn();
const mockLogout = jest.fn();
let mockSearchParams = new URLSearchParams();

jest.mock('../../hooks/use-auth', () => ({
  useAuth: () => ({
    login: mockLogin,
    logout: mockLogout,
    isLoading: false,
    error: null,
    user: null,
    isAuthenticated: false,
  }),
}));

jest.mock('next/navigation', () => ({
  useSearchParams: () => mockSearchParams,
}));

describe('LoginForm', () => {
  beforeEach(() => {
    mockLogin.mockClear();
    mockSearchParams = new URLSearchParams();
  });

  it('prefills email from the "email" query param', () => {
    mockSearchParams = new URLSearchParams({ email: 'prefill@kaifa.id' });
    render(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toHaveValue('prefill@kaifa.id');
  });

  it('renders email and password fields', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/masukkan password/i)).toBeInTheDocument();
  });

  it('toggles password visibility', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const passwordInput = screen.getByPlaceholderText(/masukkan password/i);
    expect(passwordInput).toHaveAttribute('type', 'password');

    await user.click(screen.getByRole('button', { name: /show password/i }));
    expect(passwordInput).toHaveAttribute('type', 'text');

    await user.click(screen.getByRole('button', { name: /hide password/i }));
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('renders submit button', () => {
    render(<LoginForm />);
    expect(screen.getByRole('button', { name: /masuk/i })).toBeInTheDocument();
  });

  it('shows validation errors on empty submit', async () => {
    render(<LoginForm />);
    await userEvent.click(screen.getByRole('button', { name: /masuk/i }));
    await waitFor(() => {
      expect(screen.getByText(/format email tidak valid/i)).toBeInTheDocument();
    });
  });

  it('allows short password values', async () => {
    render(<LoginForm />);
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByPlaceholderText(/masukkan password/i), '123');
    await userEvent.click(screen.getByRole('button', { name: /masuk/i }));
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(
        { email: 'test@example.com', password: '123' },
        expect.anything(),
      );
    });
  });

  it('calls login with correct credentials on valid submit', async () => {
    render(<LoginForm />);
    await userEvent.type(screen.getByLabelText(/email/i), 'demo@kaifa.id');
    await userEvent.type(screen.getByPlaceholderText(/masukkan password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /masuk/i }));
    await waitFor(() => {
      // react-hook-form calls the handler with (data, event)
      expect(mockLogin).toHaveBeenCalledWith(
        { email: 'demo@kaifa.id', password: 'password123' },
        expect.anything(),
      );
    });
  });
});
