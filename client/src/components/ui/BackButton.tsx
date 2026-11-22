import * as React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  label?: string;
  fallback?: string;
  className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  label = 'Back',
  fallback = '/',
  className = '',
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`mb-5 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-primary ${className}`}
    >
      <ArrowLeft size={16} />
      {label}
    </button>
  );
};
