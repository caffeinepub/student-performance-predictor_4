import { useEffect, useRef } from "react";

interface ScoreGaugeProps {
  score: number;
  size?: number;
}

const gradeConfig = [
  { min: 90, grade: "A", color: "oklch(var(--grade-a))" },
  { min: 80, grade: "B", color: "oklch(var(--grade-b))" },
  { min: 70, grade: "C", color: "oklch(var(--grade-c))" },
  { min: 60, grade: "D", color: "oklch(var(--grade-d))" },
  { min: 0, grade: "F", color: "oklch(var(--grade-f))" },
];

export function getGradeInfo(score: number) {
  return (
    gradeConfig.find((g) => score >= g.min) ??
    gradeConfig[gradeConfig.length - 1]
  );
}

export default function ScoreGauge({ score, size = 180 }: ScoreGaugeProps) {
  const circleRef = useRef<SVGCircleElement>(null);
  const gradeInfo = getGradeInfo(score);

  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.75;

  useEffect(() => {
    const el = circleRef.current;
    if (!el) return;
    const offset = arcLength - (score / 100) * arcLength;
    el.style.strokeDasharray = `${arcLength} ${circumference}`;
    el.style.strokeDashoffset = `${arcLength}`;
    el.style.transition = "none";
    requestAnimationFrame(() => {
      el.style.transition = "stroke-dashoffset 1.2s ease-out";
      el.style.strokeDashoffset = `${offset}`;
    });
  }, [score, arcLength, circumference]);

  const cx = size / 2;
  const cy = size / 2;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        style={{ transform: "rotate(135deg)" }}
        role="img"
        aria-label={`Score gauge: ${score} out of 100`}
      >
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="oklch(var(--border))"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeLinecap="round"
        />
        <circle
          ref={circleRef}
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={gradeInfo.color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-foreground">{score}</span>
        <span className="text-sm text-muted-foreground">/ 100</span>
        <span
          className="mt-1 text-xl font-bold px-3 py-0.5 rounded-lg"
          style={{ background: `${gradeInfo.color}20`, color: gradeInfo.color }}
        >
          {gradeInfo.grade}
        </span>
      </div>
    </div>
  );
}
