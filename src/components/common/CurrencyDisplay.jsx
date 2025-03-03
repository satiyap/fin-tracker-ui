import React from 'react';
import { formatIndianRupee } from '../../utils/currencyFormatter';

const CurrencyDisplay = ({ amount, className = '', negative = false }) => {
  const displayAmount = negative ? -Math.abs(amount) : amount;
  const colorClass = displayAmount < 0 ? 'text-danger' : 'text-success';
  
  return (
    <span className={`${colorClass} ${className}`}>
      {formatIndianRupee(displayAmount)}
    </span>
  );
};

export default CurrencyDisplay;