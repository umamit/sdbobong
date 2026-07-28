"use client";

import React from 'react';

/**
 * Apple HIG — Segmented Control Component
 * Segmen tab navigasi ala iOS dengan indikator melayang (sliding active pill).
 * 
 * @param {Array<{id: string, label: string, icon?: React.ReactNode}>} options - Daftar opsi tab
 * @param {string} value - ID opsi yang terpilih
 * @param {function(string): void} onChange - Callback saat opsi dipilih
 * @param {string} [className] - Class CSS opsional
 */
export default function SegmentedControl({ options = [], value, onChange, className = '' }) {
  const activeIndex = options.findIndex((opt) => opt.id === value);
  const selectedIndex = activeIndex >= 0 ? activeIndex : 0;
  const count = options.length || 1;

  // Calculate sliding pill width and offset
  const itemWidthPercent = 100 / count;
  const translatePercent = selectedIndex * 100;

  return (
    <div
      className={`relative flex items-center p-1 select-none ${className}`}
      style={{
        display: 'flex',
        position: 'relative',
        borderRadius: 'var(--radius-xl, 18px)',
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(0, 0, 0, 0.06)',
        padding: '3px',
      }}
    >
      {/* Active Sliding Pill Indicator */}
      <div
        style={{
          position: 'absolute',
          top: '3px',
          bottom: '3px',
          left: '3px',
          width: `calc(${itemWidthPercent}% - 6px)`,
          transform: `translateX(${translatePercent * (count > 1 ? 1 : 0)}%)`,
          backgroundColor: 'var(--bg-card, #ffffff)',
          borderRadius: 'calc(var(--radius-xl, 18px) - 3px)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.06)',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          zIndex: 1,
        }}
      />

      {/* Options */}
      {options.map((option) => {
        const isSelected = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange && onChange(option.id)}
            style={{
              position: 'relative',
              zIndex: 2,
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px 12px',
              fontSize: '0.875rem',
              fontWeight: isSelected ? 700 : 500,
              color: isSelected ? 'var(--primary, #12A5B8)' : 'var(--text-muted, #515154)',
              background: 'transparent',
              border: 'none',
              borderRadius: 'calc(var(--radius-xl, 18px) - 3px)',
              cursor: 'pointer',
              transition: 'color 0.2s ease',
            }}
          >
            {option.icon && (
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '16px', height: '16px' }}>
                {option.icon}
              </span>
            )}
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
