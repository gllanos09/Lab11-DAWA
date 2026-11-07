import React from 'react';
import styles from './Input.module.css';

export interface InputProps {
  label?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  helperText?: string;
  icon?: React.ReactNode;
}

export default function Input({
  label,
  type = 'text',
  placeholder = ' ',
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  helperText,
  icon,
}: InputProps) {
  return (
    <div className="mb-4">
      <div className={styles.inputWrapper}>
        {/* Icono opcional */}
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
            {icon}
          </div>
        )}

        {/* Input */}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          className={`
            ${styles.input}
            ${error ? styles.error : ''}
            ${icon ? 'pl-10' : 'pl-4'}
            w-full
            pr-4 py-3
            border-2 border-gray-300
            rounded-lg
            outline-none
            text-gray-800
            disabled:bg-gray-100 disabled:cursor-not-allowed
          `}
        />

        {/* Label flotante */}
        {label && (
          <label className={`${styles.floatingLabel} ${icon ? 'left-10!' : ''}`}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
      </div>

      {/* Mensaje de error o ayuda */}
      {error ? (
        <p className={styles.errorMessage}>{error}</p>
      ) : helperText ? (
        <p className="text-gray-500 text-sm mt-1">{helperText}</p>
      ) : null}
    </div>
  );
}
