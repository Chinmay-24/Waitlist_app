import React from 'react';
import '../styles/Button.css';

const Button = ({
    children,
    onClick,
    variant = 'primary',
    size = 'medium',
    loading = false,
    disabled = false,
    startIcon,
    endIcon,
    className = '',
    ...props
}) => {
    const buttonClass = `btn-base btn-${variant} btn-${size} ${className}`;

    return (
        <button
            onClick={onClick}
            className={buttonClass}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <div className="btn-loader"></div>}
            {startIcon && <span className="btn-icon-start">{startIcon}</span>}
            <span className={loading ? 'btn-loading' : ''}>{children}</span>
            {endIcon && <span className="btn-icon-end">{endIcon}</span>}
        </button>
    );
};

export default Button;
