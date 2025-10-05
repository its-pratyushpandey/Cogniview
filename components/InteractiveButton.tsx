'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface PrimaryButtonProps {
  href: string;
  children: React.ReactNode;
}

export function PrimaryButton({ href, children }: PrimaryButtonProps) {
  return (
    <Button asChild>
      <Link
        href={href}
        className="btn-primary-hover"
        style={{
          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
          color: 'white',
          padding: '0.75rem 2rem',
          borderRadius: '50px',
          fontWeight: 600,
          border: 'none',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          transition: 'all 0.15s',
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {children}
      </Link>
    </Button>
  );
}

interface SecondaryButtonProps {
  href: string;
  children: React.ReactNode;
}

export function SecondaryButton({ href, children }: SecondaryButtonProps) {
  return (
    <Button asChild>
      <Link
        href={href}
        className="btn-secondary-hover"
        style={{
          background: 'white',
          color: 'var(--primary-600)',
          padding: '0.75rem 1.5rem',
          borderRadius: '12px',
          fontWeight: 600,
          border: '2px solid var(--primary-600)',
          boxShadow: 'none',
          transition: 'all 0.15s',
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {children}
      </Link>
    </Button>
  );
}

interface PurpleButtonProps {
  href: string;
  children: React.ReactNode;
}

export function PurpleButton({ href, children }: PurpleButtonProps) {
  return (
    <Button asChild>
      <Link
        href={href}
        style={{
          background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
          color: 'white',
          padding: '0.75rem 1.5rem',
          borderRadius: '12px',
          fontWeight: 600,
          border: 'none',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          transition: 'all 0.15s',
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {children}
      </Link>
    </Button>
  );
}