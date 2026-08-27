import { motion } from 'motion/react';
import mascotUrl from '@/assets/mmx.png';

interface Props {
  refreshing: boolean;
  size: number;
  className?: string;
}

export function MascotImage({ refreshing, size, className }: Props) {
  return (
    <motion.img
      src={mascotUrl}
      alt=""
      draggable={false}
      width={size}
      height={size}
      className={`relative z-10 select-none ${className ?? ''}`}
      transition={
        refreshing
          ? { duration: 1.1, ease: [0.45, 0.05, 0.2, 1.2] }
          : { duration: 4, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }
      }
    />
  );
}
