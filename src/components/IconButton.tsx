import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  icon: ReactNode;
  variant?: 'default' | 'primary' | 'danger' | 'ghost';
  size?: 'sm' | 'md';
};

export function IconButton({
  label,
  icon,
  variant = 'default',
  size = 'md',
  className = '',
  type = 'button',
  ...rest
}: Props) {
  const variantClass =
    variant === 'primary'
      ? 'btn-primary'
      : variant === 'danger'
        ? 'btn-danger'
        : variant === 'ghost'
          ? 'btn-ghost'
          : '';
  const sizeClass = size === 'sm' ? 'btn-sm' : '';

  return (
    <button
      type={type}
      className={`btn btn-icon ${variantClass} ${sizeClass} ${className}`.trim()}
      aria-label={label}
      title={label}
      data-tooltip={label}
      {...rest}
    >
      <span className="btn-icon-glyph" aria-hidden="true">
        {icon}
      </span>
    </button>
  );
}
