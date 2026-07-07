'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { LOCALITIES } from '@/lib/localities';

type Props = {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  name?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
};

/**
 * Searchable locality picker that ALSO accepts a free-typed value.
 * Renders a plain text input styled like `.pf-input` plus a filtered
 * suggestion dropdown. Suggestions come from LOCALITIES; anything the
 * user types is accepted as-is so no one is blocked by the starter list.
 */
export default function LocalityCombobox({
  value,
  onChange,
  id,
  name,
  required,
  placeholder = 'e.g. Vidyanagar, Gokul Road',
  className = 'pf-input',
}: Props) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const wrapRef = useRef<HTMLDivElement>(null);

  const matches = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return LOCALITIES.slice(0, 8);
    return LOCALITIES.filter((l) => l.toLowerCase().includes(q)).slice(0, 8);
  }, [value]);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  function pick(loc: string) {
    onChange(loc);
    setOpen(false);
    setHighlight(-1);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setOpen(true);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, matches.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter' && highlight >= 0 && open) {
      e.preventDefault();
      pick(matches[highlight]);
    } else if (e.key === 'Escape') {
      setOpen(false);
      setHighlight(-1);
    }
  }

  const showList = open && matches.length > 0;

  return (
    <div ref={wrapRef} className="loc-combo">
      <input
        id={id}
        name={name}
        value={value}
        required={required}
        placeholder={placeholder}
        className={className}
        autoComplete="off"
        role="combobox"
        aria-expanded={showList}
        aria-autocomplete="list"
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
          setHighlight(-1);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
      />
      {showList && (
        <ul className="loc-combo-list" role="listbox">
          {matches.map((loc, i) => (
            <li
              key={loc}
              role="option"
              aria-selected={i === highlight}
              className={`loc-combo-item${i === highlight ? ' is-active' : ''}`}
              // onMouseDown (not onClick) so it fires before the input blur.
              onMouseDown={(e) => {
                e.preventDefault();
                pick(loc);
              }}
              onMouseEnter={() => setHighlight(i)}
            >
              {loc}
            </li>
          ))}
        </ul>
      )}
      <style>{`
        .loc-combo { position: relative; width: 100%; }
        .loc-combo-list {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          right: 0;
          z-index: 30;
          margin: 0;
          padding: 4px;
          list-style: none;
          background: var(--surface, #fff);
          border: 1px solid var(--line, #dedbd2);
          border-radius: 10px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          max-height: 260px;
          overflow-y: auto;
        }
        .loc-combo-item {
          padding: 8px 10px;
          border-radius: 7px;
          font-size: 0.95rem;
          color: var(--ink, #20201d);
          cursor: pointer;
        }
        .loc-combo-item.is-active {
          background: var(--page-soft, #f5f1e8);
          color: var(--brand-dark, #9f4a22);
        }
      `}</style>
    </div>
  );
}
