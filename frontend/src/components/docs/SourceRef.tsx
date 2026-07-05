import { FileCode2 } from 'lucide-react';

interface SourceRefProps {
  path: string;
  line?: number;
}

export default function SourceRef({ path, line }: SourceRefProps) {
  // Extract filename from the end of path
  const filename = path.split('/').pop() || path;

  return (
    <code 
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/50 dark:border-zinc-700/50 text-[13px] font-mono text-amber-700 dark:text-amber-400 font-medium"
      title={`${path}${line ? ` (line ${line})` : ''}`}
    >
      <FileCode2 className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 flex-shrink-0" />
      <span>{filename}</span>
      {line && <span className="opacity-65 text-[11px] font-sans">:{line}</span>}
    </code>
  );
}
