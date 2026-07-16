import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Klik Saya</Button>);
    expect(screen.getByRole('button', { name: 'Klik Saya' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Klik</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Klik</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows loading text and is disabled while loading', () => {
    render(<Button isLoading>Simpan</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Memproses...');
  });

  it('does not call onClick when disabled', async () => {
    const handleClick = jest.fn();
    render(
      <Button disabled onClick={handleClick}>
        Klik
      </Button>,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
