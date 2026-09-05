import React from 'react';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  href?: string;
  target?: string;
  rel?: string;
}

export default function Button({
  variant = 'primary',
  href,
  className = '',
  children,
  target,
  rel,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:pointer-events-none';

  const variantStyles = {
    primary:
      'bg-primary text-white border-2 border-primary shadow-sm hover:brightness-85 hover:shadow-md',
    secondary:
      'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white',
  };

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className}`;

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={combinedClassName}
      >
        {children}
      </a>
    );
  }

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
}
