import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';

export type CalloutTone = 'info' | 'warning' | 'success' | 'danger';

interface CalloutProps {
  tone?: CalloutTone;
  title?: string;
  children: React.ReactNode;
}

export default function Callout({ tone = 'info', title, children }: CalloutProps) {
  let bgClass = '';
  let borderClass = '';
  let textClass = '';
  let iconColor = '';
  let Icon = Info;

  switch (tone) {
    case 'success':
      bgClass = 'bg-emerald-50/50 dark:bg-emerald-950/20';
      borderClass = 'border-emerald-200 dark:border-emerald-900/50';
      textClass = 'text-emerald-800 dark:text-emerald-300';
      iconColor = 'text-emerald-500 dark:text-emerald-400';
      Icon = CheckCircle2;
      break;
    case 'warning':
      bgClass = 'bg-yellow-50/50 dark:bg-yellow-950/20';
      borderClass = 'border-yellow-200 dark:border-yellow-900/50';
      textClass = 'text-yellow-800 dark:text-yellow-300';
      iconColor = 'text-yellow-500 dark:text-yellow-400';
      Icon = AlertTriangle;
      break;
    case 'danger':
      bgClass = 'bg-red-50/50 dark:bg-red-950/20';
      borderClass = 'border-red-200 dark:border-red-900/50';
      textClass = 'text-red-800 dark:text-red-300';
      iconColor = 'text-red-500 dark:text-red-400';
      Icon = XCircle;
      break;
    case 'info':
    default:
      bgClass = 'bg-amber-50/50 dark:bg-amber-950/10';
      borderClass = 'border-amber-200 dark:border-amber-900/40';
      textClass = 'text-amber-900 dark:text-amber-300';
      iconColor = 'text-amber-500 dark:text-amber-400';
      Icon = AlertCircle;
      break;
  }

  return (
    <div className={`p-4 rounded-xl border ${bgClass} ${borderClass} flex gap-3 text-sm leading-relaxed my-4`}>
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
      <div className={`flex-1 ${textClass}`}>
        {title && <h5 className="font-bold font-display mb-1 text-[15px]">{title}</h5>}
        <div className="prose-sm dark:prose-invert leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
