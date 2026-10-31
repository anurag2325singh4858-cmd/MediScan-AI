import React from 'react';
import './Card.css';

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  workflow?: 'default' | 'tb' | 'dr';
  accentTop?: boolean;
  isInteractive?: boolean;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  header,
  footer,
  padding = 'md',
  workflow = 'default',
  accentTop = false,
  isInteractive = false,
  children,
  className = '',
  onClick,
  onKeyDown,
  ...rest
}) => {
  const hasHeader = header || title || subtitle;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (isInteractive && onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
    }
    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  const classNames = [
    'card',
    `card--padding-${padding}`,
    `card--${workflow}`,
    accentTop ? 'card--accent' : '',
    isInteractive ? 'card--interactive' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classNames}
      onClick={isInteractive ? onClick : undefined}
      onKeyDown={isInteractive ? handleKeyDown : onKeyDown}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      {...rest}
    >
      {hasHeader && (
        <header className="card__header">
          {header || (
            <>
              {title && <h3 className="card__title">{title}</h3>}
              {subtitle && <p className="card__subtitle">{subtitle}</p>}
            </>
          )}
        </header>
      )}

      <div className="card__body">{children}</div>

      {footer && <footer className="card__footer">{footer}</footer>}
    </div>
  );
};

export default Card;
