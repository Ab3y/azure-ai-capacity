import { getUtilizationColor, formatNumber } from '@/utils/formatters';

interface UsageGaugeProps {
  label: string;
  used: number;
  limit: number;
  region: string;
}

export function UsageGauge({ label, used, limit, region }: UsageGaugeProps) {
  const percent = limit > 0 ? Math.min((used / limit) * 100, 100) : 0;
  const color = getUtilizationColor(percent);
  
  // SVG circle properties
  const size = 100;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-4 flex flex-col items-center hover:shadow-md transition-shadow">
      {/* Circular Gauge */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold" style={{ color }}>
            {Math.round(percent)}%
          </span>
        </div>
      </div>

      {/* Label */}
      <p className="text-sm font-medium text-[hsl(var(--foreground))] mt-2 text-center truncate w-full">
        {label}
      </p>
      <p className="text-xs text-[hsl(var(--muted-foreground))]">
        {formatNumber(used)} / {formatNumber(limit)} TPM
      </p>
      <p className="text-xs text-[hsl(var(--muted-foreground))]">{region}</p>
    </div>
  );
}
