'use client';

import React, { useMemo } from 'react';
import { generateQrMatrix } from '@/utils/qrCode';

interface QRCodeViewProps {
  value: string;
  size?: number;
  className?: string;
}

export const QRCodeView: React.FC<QRCodeViewProps> = ({
  value,
  size = 100,
  className = '',
}) => {
  const matrix = useMemo(() => {
    try {
      return generateQrMatrix(value || 'RECEIPT');
    } catch {
      return generateQrMatrix('RECEIPT');
    }
  }, [value]);

  const moduleCount = matrix.length;
  const padding = 2; // quiet zone
  const totalSize = moduleCount + padding * 2;

  return (
    <div
      className={`inline-block ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <svg
        viewBox={`0 0 ${totalSize} ${totalSize}`}
        className="w-full h-full"
        shapeRendering="crispEdges"
      >
        <rect
          x="0"
          y="0"
          width={totalSize}
          height={totalSize}
          fill="#ffffff"
        />
        {matrix.map((row, r) =>
          row.map((cell, c) =>
            cell ? (
              <rect
                key={`${r}-${c}`}
                x={c + padding}
                y={r + padding}
                width="1.02"
                height="1.02"
                fill="#000000"
              />
            ) : null
          )
        )}
      </svg>
    </div>
  );
};
