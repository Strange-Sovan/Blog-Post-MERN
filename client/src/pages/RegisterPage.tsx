import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRegister } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, BookOpen, Eye, EyeOff, LockKeyhole, Mail, UserRound } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const registerMutation = useRegister();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterForm) => {
    registerMutation.mutate(
      { name: data.name, email: data.email, password: data.password },
      {
        onSuccess: () => navigate('/'),
      },
    );
  };

  return (
    <div className="page-shell flex min-h-[78vh] items-center justify-center">
      <Card className="w-full max-w-md overflow-hidden rounded-3xl border-0 shadow-2xl shadow-indigo-950/10">
        <div className="hero-panel px-8 py-8 text-center text-white">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-white/15 text-white ring-1 ring-white/20"><BookOpen size={26} /></div>
          <CardTitle className="text-3xl font-extrabold text-white">Join the conversation</CardTitle>
          <CardDescription className="mt-2 text-indigo-100">Create an account and share your story</CardDescription>
        </div>
        <CardContent className="px-7 py-7 sm:px-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="form-label inline-flex items-center gap-2"><UserRound size={14} /> Full name</label>
              <Input placeholder="John Doe" {...register('name')} className="h-11 rounded-xl" />
              {errors.name && (
                <p className="text-destructive text-xs mt-1">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label className="form-label inline-flex items-center gap-2"><Mail size={14} /> Email address</label>
              <Input
                type="email"
                placeholder="you@example.com"
                {...register('email')}
                className="h-11 rounded-xl"
              />
              {errors.email && (
                <p className="text-destructive text-xs mt-1">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="form-label inline-flex items-center gap-2"><LockKeyhole size={14} /> Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 8 characters (1 uppercase, 1 digit)"
                  {...register('password')}
                  className="h-11 rounded-xl pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute inset-y-0 right-0 grid w-11 place-items-center text-muted-foreground transition hover:text-primary"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-destructive text-xs mt-1">{errors.password.message}</p>
              )}
            </div>
            <div>
              <label className="form-label inline-flex items-center gap-2"><LockKeyhole size={14} /> Confirm password</label>
              <Input
                type="password"
                placeholder="Re-enter your password"
                {...register('confirmPassword')}
                className="h-11 rounded-xl"
              />
              {errors.confirmPassword && (
                <p className="text-destructive text-xs mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {registerMutation.error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded text-destructive text-sm text-center">
                {(registerMutation.error as any)?.response?.data?.message || 'Registration failed.'}
              </div>
            )}

            <Button type="submit" className="w-full rounded-xl" disabled={registerMutation.isPending}>
              {registerMutation.isPending ? 'Creating account...' : <>Create account <ArrowRight size={16} /></>}
            </Button>

            <p className="text-center text-sm text-muted-foreground pt-2">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Sign in here
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
