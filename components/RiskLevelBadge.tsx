
import React from 'react';

interface Props {
  level: '상' | '중' | '하';
}

export const RiskLevelBadge: React.FC<Props> = ({ level }) => {
  const colors = {
    '상': 'bg-red-100 text-red-700 border-red-200',
    '중': 'bg-orange-100 text-orange-700 border-orange-200',
    '하': 'bg-green-100 text-green-700 border-green-200',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-bold border ${colors[level]}`}>
      {level}
    </span>
  );
};
