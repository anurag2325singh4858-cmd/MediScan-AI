import React from 'react';
import './Button.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  workflow?: 'default' | 'tb' | 'dr';
  isLoading?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  workflow = 'default',
  isLoading = false,
  leadingIcon,
  trailingIcon,
  fullWidth = false,
  disabled = false,
  type = 'button',
  className = '',
  ...rest
}) => {
  const isButtonDisabled = disabled || isLoading;

  const classNames = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    `btn--${workflow}`,
    fullWidth ? 'btn--full-width' : '',
    isLoading ? 'btn--loading' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classNames}
      disabled={isButtonDisabled}
      aria-disabled={isButtonDisabled}
      aria-busy={isLoading}
      {...rest}
    >
      {isLoading ? (
        <>
          <span className="btn__spinner" aria-hidden="true" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {leadingIcon && <span className="btn__icon btn__icon--leading">{leadingIcon}</span>}
          <span>{children}</span>
          {trailingIcon && <span className="btn__icon btn__icon--trailing">{trailingIcon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;
