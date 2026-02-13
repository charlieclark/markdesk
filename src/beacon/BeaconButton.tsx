/** @jsxImportSource preact */
import { h } from 'preact';
import { X, MessageCircle } from 'lucide-react';

interface BeaconButtonProps {
  onClick: () => void;
  badgeCount: number;
  isOpen: boolean;
}

export default function BeaconButton({ onClick, badgeCount, isOpen }: BeaconButtonProps) {
  return (
    <div class="mdb-button-wrap">
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <clipPath id="mdb-squircle" clipPathUnits="objectBoundingBox">
            <path d="M 0.5 0 C 0.67 0, 0.8 0.03, 0.89 0.11 C 0.97 0.2, 1 0.33, 1 0.5 C 1 0.67, 0.97 0.8, 0.89 0.89 C 0.8 0.97, 0.67 1, 0.5 1 C 0.33 1, 0.2 0.97, 0.11 0.89 C 0.03 0.8, 0 0.67, 0 0.5 C 0 0.33, 0.03 0.2, 0.11 0.11 C 0.2 0.03, 0.33 0, 0.5 0 Z" />
          </clipPath>
        </defs>
      </svg>
      <button class="mdb-button" onClick={onClick} aria-label="Help">
        {isOpen ? (
          <X size={24} color="#ffffff" />
        ) : (
          <MessageCircle size={24} color="#ffffff" />
        )}
      </button>
      {badgeCount > 0 && !isOpen && (
        <span class="mdb-badge">{badgeCount > 9 ? '9+' : badgeCount}</span>
      )}
    </div>
  );
}
