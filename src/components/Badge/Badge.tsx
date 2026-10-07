import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import './Badge.css';

export type BadgeVariant = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
export type BadgeAppearance = 'subtle' | 'solid' | 'outline';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * Semantic state. The label must state it in words; colour alone must not carry the meaning.
   * (`variant` is the tone here, while Button and Card use it for emphasis. `appearance` is the fill style.)
   */
  variant?: BadgeVariant;
  appearance?: BadgeAppearance;
  size?: BadgeSize;
  /** Leading status dot in the text colour. Its shape also varies by variant, but it is decorative. */
  dot?: boolean;
  /**
   * For a bare count, add context for assistive tech as hidden text instead of `aria-label`,
   * which is not reliably announced on a role-less span:
   * `<Badge>3<span className="badge__sr"> unread notifications</span></Badge>`
   */
  children?: ReactNode;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { variant = 'neutral', appearance = 'subtle', size = 'md', dot = false, className, children, ...rest },
  ref,
) {
  const labelRef = useRef<HTMLSpanElement>(null);
  const [truncated, setTruncated] = useState(false);

  const measure = useCallback(() => {
    const el = labelRef.current;
    if (el) setTruncated(el.scrollWidth > el.clientWidth);
  }, []);

  // Ellipsised text would otherwise be unrecoverable for pointer users.
  useEffect(() => {
    const el = labelRef.current;
    if (!el) return;
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [measure, children]);

  if (children == null || children === '' || children === false) {
    if (!dot) return null;
  }

  const classes = ['badge', `badge--${variant}`, `badge--${appearance}`, `badge--${size}`, className]
    .filter(Boolean)
    .join(' ');
  const title = truncated && typeof children === 'string' ? children : undefined;

  return (
    <span ref={ref} className={classes} {...rest}>
      {dot && <span className="badge__dot" aria-hidden="true" />}
      <span ref={labelRef} className="badge__label" title={title}>
        {children}
      </span>
    </span>
  );
});
