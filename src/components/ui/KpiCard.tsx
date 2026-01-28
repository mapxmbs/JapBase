'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  trend?: {
    value: string;
    color: string;
    icon: LucideIcon;
  };
  progress?: number;
  delay?: number;
}

export default function KpiCard({
  title,
  value,
  icon: Icon,
  iconBgColor,
  iconColor,
  trend,
  progress,
  delay = 0,
}: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="bg-japura-white p-6 rounded-japura shadow-sm border border-gray-300 hover:shadow-md hover:border-japura-dark transition-all"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 ${iconBgColor} rounded-lg ${iconColor}`}>
          <Icon size={24} />
        </div>
      </div>
      <p className="text-xs font-bold text-japura-grey uppercase tracking-wider mb-1">
        {title}
      </p>
      <p className="text-3xl font-black text-japura-black tabular-nums">{value}</p>
      {trend && (
        <div className={`mt-4 flex items-center text-xs ${trend.color}`}>
          <trend.icon size={14} className="mr-1" />
          <span>{trend.value}</span>
        </div>
      )}
      {progress !== undefined && (
        <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-japura-dark h-2 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </motion.div>
  );
}
