import React from 'react';
import './Badge.css';

export type BadgeVariant =
  | 'tb'
  | 'dr'
  | 'success'
  | 'warning'
  | 'error'
  | 'neutral'
  | 'simulated'
  | 'technical';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  dot = false,
  children,
  className = '',
  ...rest
}) => {
  const classNames = [
    'badge',
    `badge--${variant}`,
    `badge--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classNames} {...rest}>
      {dot && <span className="badge__dot" aria-hidden="true" />}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
