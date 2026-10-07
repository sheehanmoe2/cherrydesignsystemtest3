import type { ButtonHTMLAttributes } from 'react';
import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({
  variant = 'primary',
  size = 'md',
  type = 'button',
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = ['btn', `btn--${variant}`, `btn--${size}`, className].filter(Boolean).join(' ');
  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}
