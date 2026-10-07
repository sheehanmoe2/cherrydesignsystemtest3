import { createContext, useContext } from 'react';
import type { ElementType, HTMLAttributes, MouseEventHandler, ReactNode } from 'react';
import './Card.css';

export type CardVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';
export type CardPadding = 'sm' | 'md' | 'lg';

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, 'onClick'> {
  variant?: CardVariant;
  padding?: CardPadding;
  /** Element for a non-interactive card. Ignored when `interactive` is set. */
  as?: 'div' | 'article' | 'section';
  /** Renders the whole card as one control: an `a` when `href` is given, otherwise a `button`. */
  interactive?: boolean;
  disabled?: boolean;
  href?: string;
  onClick?: MouseEventHandler<HTMLElement>;
}

// A button may only contain phrasing content, so slots render as spans inside one.
const PhrasingContext = createContext(false);

function CardRoot({
  variant = 'primary',
  padding = 'md',
  as = 'div',
  interactive = false,
  disabled = false,
  href,
  className,
  children,
  ...rest
}: CardProps) {
  const classes = [
    'card',
    `card--${variant}`,
    `card--pad-${padding}`,
    interactive && 'card--interactive',
    disabled && 'card--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (!interactive) {
    const Tag: ElementType = as;
    return (
      <Tag className={classes} {...rest}>
        {children}
      </Tag>
    );
  }

  if (href !== undefined) {
    return (
      <a
        className={classes}
        {...rest}
        href={disabled ? undefined : href}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : rest.tabIndex}
      >
        {children}
      </a>
    );
  }

  return (
    <PhrasingContext.Provider value={true}>
      <button type="button" className={classes} disabled={disabled} {...rest}>
        {children}
      </button>
    </PhrasingContext.Provider>
  );
}

function Slot({ part, className, children, ...rest }: HTMLAttributes<HTMLElement> & { part: string; children?: ReactNode }) {
  const Tag: ElementType = useContext(PhrasingContext) ? 'span' : 'div';
  return (
    <Tag className={['card__slot', `card__${part}`, className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </Tag>
  );
}

const Header = (props: HTMLAttributes<HTMLElement>) => <Slot part="header" {...props} />;
const Body = (props: HTMLAttributes<HTMLElement>) => <Slot part="body" {...props} />;
const Footer = (props: HTMLAttributes<HTMLElement>) => <Slot part="footer" {...props} />;

export const Card = Object.assign(CardRoot, { Header, Body, Footer });
