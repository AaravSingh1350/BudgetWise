'use client';

import type { LucideProps } from 'lucide-react';
import dynamic from 'next/dynamic';
import { icons } from 'lucide-react';

interface IconProps extends LucideProps {
  name: string;
}

const Icon = ({ name, ...props }: IconProps) => {
  const LucideIcon = icons[name as keyof typeof icons];

  if (!LucideIcon) {
    return null;
  }

  return <LucideIcon {...props} />;
};

export default Icon;
