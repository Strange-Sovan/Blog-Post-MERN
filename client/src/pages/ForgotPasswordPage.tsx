import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { HiMail } from 'react-icons/hi';
import { MdArrowForward, MdAutoStories } from 'react-icons/md';
import { Input } from '@/components/ui/input';
import { BackButton } from '@/components/ui/BackButton';
import { useForgotPassword } from '@/hooks/useAuth';
import { getApiErrorMessage } from '@/lib/apiError';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});
type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const forgotPasswordMutation = useForgotPassword();
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordForm) => {
    forgotPasswordMutation.mutate(data, { onSuccess: () => setSubmitted(true) });
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
            <h1 className="text-3xl font-black tracking-tight">Forgot your password?</h1>
            <p className="mt-2 text-sm text-indigo-200">We&apos;ll email you a secure reset link.</p>
          </div>

          <div className="bg-card px-8 py-8">
            {submitted ? (
              <div role="status" className="space-y-4 text-center">
                <p className="text-sm text-muted-foreground">
                  If an account exists for that email, a password reset link has been sent.
                </p>
                <Link to="/login" className="font-bold text-primary hover:underline">Return to sign in</Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="forgot-email" className="form-label inline-flex items-center gap-1.5">
                    <HiMail size={14} className="text-primary" /> Email address
                    <span className="text-destructive" aria-hidden="true">*</span>
                  </label>
                  <Input id="forgot-email" type="email" placeholder="you@example.com"
                    {...register('email')} className="form-input" required />
                  {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
                </div>

                {forgotPasswordMutation.error && (
                  <p role="alert" className="text-sm text-destructive">
                    {getApiErrorMessage(forgotPasswordMutation.error, 'Unable to send a password reset email.')}
                  </p>
                )}

                <button type="submit" disabled={forgotPasswordMutation.isPending} className="btn-primary w-full justify-center">
                  {forgotPasswordMutation.isPending ? 'Sending…' : <>Send reset link <MdArrowForward size={16} /></>}
                </button>
                <p className="text-center text-sm text-muted-foreground">
                  Remembered your password? <Link to="/login" className="font-bold text-primary hover:underline">Sign in</Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
