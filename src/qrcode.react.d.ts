declare module 'qrcode.react' {
  import React from 'react';

  interface QRCodeProps {
    value: string;
    size?: number;
    bgColor?: string;
    fgColor?: string;
    level?: 'L' | 'M' | 'Q' | 'H';
    includeMargin?: boolean;
    imageSettings?: {
      src: string;
      x?: number;
      y?: number;
      height?: number;
      width?: number;
      excavate?: boolean;
    };
    style?: React.CSSProperties;
    quietZone?: number;
    title?: string;
    className?: string;
  }

  export const QRCode: React.ComponentType<QRCodeProps>;
  export default QRCode;
}
