'use client';

import { DOMAINS, type DomainInfo, type Domain } from '@/types';
import styles from './domain-selector.module.css';

interface DomainSelectorProps {
  selectedDomain?: Domain;
  onSelect: (domain: Domain) => void;
}

export function DomainSelector({ selectedDomain, onSelect }: DomainSelectorProps) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>SELECT DOMAIN</h2>
        <p className={styles.subtitle}>
          Choose an impact area to investigate
        </p>
      </header>
      
      <div className={styles.grid}>
        {DOMAINS.map((domain) => (
          <DomainCard
            key={domain.id}
            domain={domain}
            isSelected={selectedDomain === domain.id}
            onSelect={() => onSelect(domain.id)}
          />
        ))}
      </div>
    </div>
  );
}

interface DomainCardProps {
  domain: DomainInfo;
  isSelected: boolean;
  onSelect: () => void;
}

function DomainCard({ domain, isSelected, onSelect }: DomainCardProps) {
  return (
    <button
      className={`${styles.card} ${isSelected ? styles.selected : ''}`}
      onClick={onSelect}
    >
      <div className={styles.icon}>{domain.icon}</div>
      <h3 className={styles.name}>{domain.name}</h3>
      <p className={styles.description}>{domain.description}</p>
      {isSelected && <div className={styles.checkmark}>✓</div>}
    </button>
  );
}
