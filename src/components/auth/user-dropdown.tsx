'use client';

import { useState, useRef, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface UserDropdownProps {
  user: {
    email?: string;
    user_metadata?: {
      name?: string;
      avatar_url?: string;
    };
  };
}

export function UserDropdown({ user }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef} style={{ position: 'relative' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="brutalist-button"
        style={{ 
          padding: '0.5rem 1rem', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem',
          minWidth: '200px',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {user.user_metadata?.avatar_url && (
             // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={user.user_metadata.avatar_url} 
              alt="Profile" 
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                border: '2px solid #000'
              }}
            />
          )}
          <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>
            {user.user_metadata?.name || user.email}
          </span>
        </div>
        <span style={{ fontSize: '0.75rem', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: '0.5rem',
          width: '100%',
          background: '#fff',
          border: '2px solid #000',
          boxShadow: '4px 4px 0 #000',
          borderRadius: '6px',
          zIndex: 50,
          overflow: 'hidden'
        }}>
          <div style={{ padding: '0.75rem', borderBottom: '2px solid #000', background: '#f4f4f5' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#52525b', textTransform: 'uppercase' }}>Signed in as</p>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '0.75rem',
              textAlign: 'left',
              background: 'none',
              border: 'none',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#ef4444' // Red color for sign out
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#f4f4f5'}
            onMouseOut={(e) => e.currentTarget.style.background = 'none'}
          >
            <span>🚪</span> Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
