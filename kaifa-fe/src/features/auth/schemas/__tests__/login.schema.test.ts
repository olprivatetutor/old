import { loginSchema } from '../login.schema';

describe('loginSchema', () => {
  const valid = { email: 'user@example.com', password: 'password123' };

  it('accepts valid credentials', () => {
    expect(loginSchema.safeParse(valid).success).toBe(true);
  });

  describe('email validation', () => {
    it('rejects missing email', () => {
      const result = loginSchema.safeParse({ ...valid, email: '' });
      expect(result.success).toBe(false);
    });

    it('rejects malformed email', () => {
      const result = loginSchema.safeParse({ ...valid, email: 'not-an-email' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe('Format email tidak valid');
      }
    });
  });

  describe('password validation', () => {
    it('rejects missing password', () => {
      const result = loginSchema.safeParse({ ...valid, password: '' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe('Password wajib diisi');
      }
    });

    it('accepts short password values', () => {
      expect(loginSchema.safeParse({ ...valid, password: '123' }).success).toBe(true);
    });
  });
});
