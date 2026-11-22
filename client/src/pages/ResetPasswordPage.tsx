import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { HiLockClosed } from 'react-icons/hi';
import { MdArrowForward, MdAutoStories, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { Input } from '@/components/ui/input';
import { BackButton } from '@/components/ui/BackButton';
import { useResetPassword } from '@/hooks/useAuth';
import { getApiErrorMessage } from '@/lib/apiError';

const resetPasswordSchema = z.object({
  password: z.string().min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'One uppercase letter required')
    .regex(/[0-9]/, 'One number required'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});
type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const resetPasswordMutation = useResetPassword();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const token = searchParams.get('token') || '';
  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = (data: ResetPasswordForm) => {
    resetPasswordMutation.mutate(
      { token, password: data.password },
      { onSuccess: () => navigate('/login') },
    );
  };

  return (
    <div className="page-shell flex min-h-[88vh] items-center justify-center">
      <div className="w-full max-w-[26rem]">
        <BackButton label="Back to sign in" fallback="/login" />
        <div className="overflow-hidden rounded-3xl border border-border shadow-2xl shadow-primary/10">
          <div className="hero-panel px-8 py-10 text-center text-white">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/20 shadow-lg">
              <MdAutoStories size={28} />
            </div>
            <h1 className="text-3xl font-black tracking-tight">Choose a new password</h1>
            <p className="mt-2 text-sm text-indigo-200">Use at least 8 characters, one uppercase letter, and one number.</p>
          </div>

          <div className="bg-card px-8 py-8">
            {!token ? (
              <div role="alert" className="space-y-4 text-center">
                <p className="text-sm text-destructive">This password reset link is invalid or has expired.</p>
                <Link to="/forgot-password" className="font-bold text-primary hover:underline">Request a new reset link</Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="new-password" className="form-label inline-flex items-center gap-1.5">
                    <HiLockClosed size={14} className="text-primary" /> New password
                    <span className="text-destructive" aria-hidden="true">*</span>
                  </label>
                  <div className="relative">
                    <Input id="new-password" type={showPassword ? 'text' : 'password'} autoComplete="new-password"
                      {...register('password')} className="form-input pr-12" required />
                    <button type="button" onClick={() => setShowPassword((visible) => !visible)}
                      aria-label={showPassword ? 'Hide new password' : 'Show new password'}
                      aria-pressed={showPassword}
                      className="absolute inset-y-0 right-0 grid w-11 place-items-center text-muted-foreground transition hover:text-primary">
                      {showPassword ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>}
                </div>
                <div>
                  <label htmlFor="confirm-password" className="form-label inline-flex items-center gap-1.5">
                    <HiLockClosed size={14} className="text-primary" /> Confirm password
                    <span className="text-destructive" aria-hidden="true">*</span>
                  </label>
                  <div className="relative">
                    <Input id="confirm-password" type={showConfirmPassword ? 'text' : 'password'} autoComplete="new-password"
                      {...register('confirmPassword')} className="form-input pr-12" required />
                    <button type="button" onClick={() => setShowConfirmPassword((visible) => !visible)}
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                      aria-pressed={showConfirmPassword}
                      className="absolute inset-y-0 right-0 grid w-11 place-items-center text-muted-foreground transition hover:text-primary">
                      {showConfirmPassword ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="mt-1 text-xs text-destructive">{errors.confirmPassword.message}</p>}
                </div>
                {resetPasswordMutation.error && (
                  <p role="alert" className="text-sm text-destructive">
                    {getApiErrorMessage(resetPasswordMutation.error, 'Unable to reset your password.')}
                  </p>
                )}
                <button type="submit" disabled={resetPasswordMutation.isPending} className="btn-primary w-full justify-center">
                  {resetPasswordMutation.isPending ? 'Updating…' : <>Update password <MdArrowForward size={16} /></>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
