import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  icon: ReactNode;
  variant?: 'default' | 'primary' | 'danger' | 'danger-quiet' | 'edit' | 'ghost';
  size?: 'xs' | 'sm' | 'md';
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
        : variant === 'danger-quiet'
          ? 'btn-danger-quiet'
          : variant === 'edit'
            ? 'btn-edit'
            : variant === 'ghost'
              ? 'btn-ghost'
              : '';
  const sizeClass = size === 'xs' ? 'btn-xs' : size === 'sm' ? 'btn-sm' : '';

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
