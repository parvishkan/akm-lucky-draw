import React from 'react';
import PrizeCard, { PrizeItem } from './PrizeCard';

interface PrizeGridProps {
  prizes: PrizeItem[];
  onEdit: (prize: PrizeItem) => void;
  onViewDetails: (prize: PrizeItem) => void;
  onDelete: (prize: PrizeItem) => void;
}

export const PrizeGrid: React.FC<PrizeGridProps> = ({
  prizes,
  onEdit,
  onViewDetails,
  onDelete
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {prizes.map((prize) => (
        <PrizeCard
          key={prize.id}
          prize={prize}
          onEdit={onEdit}
          onViewDetails={onViewDetails}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default PrizeGrid;
