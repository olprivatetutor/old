'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '../hooks/use-auth';
import { loginSchema, type LoginFormValues } from '../schemas/login.schema';

export function LoginForm() {
  const { login, isLoading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form onSubmit={handleSubmit(login)} className="space-y-4" noValidate>
      {error && (
        <div
          className="bg-destructive/10 text-destructive rounded-lg px-4 py-3 text-sm"
          role="alert"
          aria-live="polite"
        >
          {error}
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="email" required>
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="demo@kaifa.id"
          autoComplete="email"
          inputMode="email"
          className="min-h-12 text-base sm:text-sm"
          error={errors.email?.message}
          {...register('email')}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password" required>
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Masukkan password"
            autoComplete="current-password"
            className="min-h-12 pr-12 text-base sm:text-sm"
            error={errors.password?.message}
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword}
            className="absolute top-1/2 right-3 inline-flex -translate-y-1/2 items-center justify-center rounded-md p-2 text-[#75644f] transition hover:bg-black/5 hover:text-[#49321d] focus-visible:ring-2 focus-visible:ring-[#7154b7]/40 focus-visible:outline-none"
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
      </div>

      <Button type="submit" size="lg" className="min-h-12 w-full" isLoading={isLoading}>
        Masuk
      </Button>
    </form>
  );
}

function EyeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d="M3.5 4.5 20.5 19.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M10.6 6.4A9.8 9.8 0 0 1 12 6c6 0 9.5 6 9.5 6s-1.3 2.2-3.8 4.1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 8.1A4.5 4.5 0 0 0 7 12c0 2.5 2 4.5 4.5 4.5.7 0 1.4-.2 2-.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
