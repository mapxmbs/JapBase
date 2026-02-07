'use client';

import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    icon: LucideIcon;
  };
  progress?: number;
}

export default function KpiCard({
  title,
  value,
  icon: Icon,
  trend,
  progress,
}: KpiCardProps) {
  return (
    <div className="bg-japura-white p-2 rounded border border-gray-400 hover:border-japura-dark transition-colors">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 bg-japura-bg rounded border border-gray-200 shrink-0">
            <Icon size={14} className="text-japura-dark" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-japura-grey uppercase truncate">{title}</p>
            <p className="text-base font-semibold text-japura-black tabular-nums">{value}</p>
          </div>
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-[11px] text-japura-grey shrink-0">
            <trend.icon size={12} />
            <span className="truncate max-w-[80px]">{trend.value}</span>
          </div>
        )}
      </div>
      {progress !== undefined && (
        <div className="mt-1.5 w-full bg-gray-200 rounded-sm h-1.5">
          <div
            className="bg-japura-dark h-1.5 rounded-sm"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}
