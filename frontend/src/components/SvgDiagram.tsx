import { Coffee, Terminal } from 'lucide-react';

export default function SvgDiagram() {
  return (
    <div className="w-full bg-zinc-50/50 dark:bg-zinc-900/10 p-4 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 shadow-sm flex justify-center items-center overflow-hidden">
      <svg
        viewBox="0 0 860 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto text-text-primary flex-shrink"
        style={{ maxWidth: '860px' }}
      >
        <defs>
          {/* Arrow markers for clean flowchart pointers */}
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="currentColor" className="opacity-80" />
          </marker>
          <marker
            id="arrow-accent"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="var(--accent)" />
          </marker>
          <marker
            id="arrow-danger"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#EF4444" />
          </marker>
          <marker
            id="arrow-success"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#10B981" />
          </marker>

          {/* Gradients for modern nodes */}
          <linearGradient id="userGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--bg-surface)" />
            <stop offset="100%" stopColor="var(--bg-base)" />
          </linearGradient>
          <linearGradient id="hiteshGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.08" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="piyushGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--engine)" stopOpacity="0.08" />
            <stop offset="100%" stopColor="var(--engine)" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        <style>
          {`
            .flow-node-bg {
              fill: var(--bg-surface);
              stroke: var(--border);
              stroke-width: 1.5;
            }
            .flow-node-accent-hitesh {
              fill: url(#hiteshGrad);
              stroke: var(--accent);
              stroke-width: 1.5;
            }
            .flow-node-accent-piyush {
              fill: url(#piyushGrad);
              stroke: var(--engine);
              stroke-width: 1.5;
            }
            .flow-text-title {
              font-family: var(--font-sans), system-ui, -apple-system, sans-serif;
              font-size: 13px;
              font-weight: 600;
              fill: var(--text-primary);
            }
            .flow-text-subtitle {
              font-family: var(--font-mono), monospace;
              font-size: 10px;
              fill: var(--text-muted);
            }
            .flow-text-label {
              font-family: var(--font-sans), system-ui, -apple-system, sans-serif;
              font-size: 10.5px;
              font-weight: 500;
              fill: var(--text-muted);
            }
            .flow-connection {
              stroke: var(--border);
              stroke-width: 1.5;
              fill: none;
            }
            .flow-connection-accent {
              stroke: var(--accent);
              stroke-width: 1.5;
              fill: none;
            }
            .flow-connection-engine {
              stroke: var(--engine);
              stroke-width: 1.5;
              fill: none;
            }
            .flow-connection-dashed {
              stroke-dasharray: 4 3;
            }
          `}
        </style>

        {/* 1. USER NODE */}
        <g id="node-user">
          <rect x="20" y="145" width="100" height="56" rx="12" className="flow-node-bg" style={{ fill: 'url(#userGrad)' }} />
          <text x="70" y="171" textAnchor="middle" className="flow-text-title">User</text>
          <text x="70" y="187" textAnchor="middle" className="flow-text-subtitle">Inputs Query</text>
        </g>

        {/* Connection: User -> Frontend */}
        <path d="M 120 173 L 180 173" className="flow-connection" markerEnd="url(#arrow)" />
        <text x="150" y="162" textAnchor="middle" className="flow-text-label" fontSize="9.5">clicks "Send"</text>

        {/* 2. FRONTEND NODE */}
        <g id="node-frontend">
          <rect x="180" y="145" width="130" height="56" rx="12" className="flow-node-bg" style={{ fill: 'url(#userGrad)' }} />
          <text x="245" y="171" textAnchor="middle" className="flow-text-title">Frontend (React)</text>
          <text x="245" y="187" textAnchor="middle" className="flow-text-subtitle">port:5173 / router</text>
        </g>

        {/* Connection: Frontend -> Backend */}
        <path d="M 310 173 L 360 173" className="flow-connection" markerEnd="url(#arrow)" />
        <text x="335" y="153" textAnchor="middle" className="flow-text-subtitle" style={{ fontSize: '9px' }}>POST /api/chat</text>
        <text x="335" y="164" textAnchor="middle" className="flow-text-subtitle" style={{ fontSize: '8px' }}>with credentials</text>

        {/* 3. BACKEND NODE */}
        <g id="node-backend">
          <rect x="360" y="130" width="150" height="86" rx="14" className="flow-node-bg" />
          <text x="435" y="156" textAnchor="middle" className="flow-text-title">Backend (Express)</text>
          <text x="435" y="176" textAnchor="middle" className="flow-text-subtitle" style={{ fontSize: '9px' }}>1. Read Thread Cookie</text>
          <text x="435" y="192" textAnchor="middle" className="flow-text-subtitle" style={{ fontSize: '9px' }}>2. If null, start thread</text>
        </g>

        {/* Connection: Backend -> Guardrail */}
        <path d="M 435 130 C 435 70, 500 60, 550 60" className="flow-connection" markerEnd="url(#arrow)" />
        <text x="480" y="80" textAnchor="middle" className="flow-text-label">1. Pre-Check Safety</text>

        {/* 4. GUARDRAIL NODE */}
        <g id="node-guardrail">
          <rect x="550" y="32" width="190" height="56" rx="12" className="flow-node-bg" />
          <text x="645" y="58" textAnchor="middle" className="flow-text-title" fill="#EF4444">Guardrail Agent</text>
          <text x="645" y="74" textAnchor="middle" className="flow-text-subtitle">Structured Schema Check</text>
        </g>

        {/* Connections from Guardrail */}
        {/* Branch A: Reject/Error -> back to Backend */}
        <path d="M 550 75 Q 490 100 455 130" stroke="#EF4444" strokeWidth="1.5" fill="none" markerEnd="url(#arrow-danger)" />
        <text x="495" y="116" textAnchor="middle" className="flow-text-label" fill="#EF4444" style={{ fontSize: '9.5px', fontWeight: 600 }}>If Unsafe: Reject</text>

        {/* Branch B: Accept -> down to main agent */}
        <path d="M 645 88 L 645 152" stroke="#10B981" strokeWidth="1.5" fill="none" markerEnd="url(#arrow-success)" />
        <text x="695" y="120" textAnchor="middle" className="flow-text-label" fill="#10B981" style={{ fontSize: '9.5px', fontWeight: 600 }}>If Valid: Dispatch</text>

        {/* 5. MAIN AGENTS CONTAINER */}
        <g id="node-main-agents">
          <rect x="550" y="152" width="190" height="110" rx="16" className="flow-node-bg" style={{ strokeDasharray: '6 4' }} />
          <text x="645" y="174" textAnchor="middle" className="flow-text-title">Persona Agent Hub</text>
          
          {/* Hitesh Sir Sub-Node */}
          <rect x="560" y="188" width="80" height="40" rx="8" className="flow-node-accent-hitesh" />
          <text x="600" y="206" textAnchor="middle" className="flow-text-title" style={{ fontSize: '11px' }}>Hitesh Agent</text>
          <text x="600" y="219" textAnchor="middle" className="flow-text-subtitle" style={{ fontSize: '8px' }}>Chai aur Code</text>

          {/* Piyush Sir Sub-Node */}
          <rect x="650" y="188" width="80" height="40" rx="8" className="flow-node-accent-piyush" />
          <text x="690" y="206" textAnchor="middle" className="flow-text-title" style={{ fontSize: '11px' }}>Piyush Agent</text>
          <text x="690" y="219" textAnchor="middle" className="flow-text-subtitle" style={{ fontSize: '8px' }}>System Design</text>

          <text x="645" y="250" textAnchor="middle" className="flow-text-subtitle" style={{ fontSize: '8px' }}>weatherTool &bull; playlistSearchingTool</text>
        </g>

        {/* Connection: Agent -> Backend */}
        <path d="M 550 220 Q 480 220 455 216" className="flow-connection" markerEnd="url(#arrow)" />
        <text x="502" y="235" textAnchor="middle" className="flow-text-label" fontSize="9">Return data results</text>

        {/* 6. STREAM BACK TO FRONTEND */}
        <path
          d="M 385 216 Q 285 305 245 201"
          stroke="var(--accent)"
          strokeWidth="1.6"
          strokeDasharray="4 3"
          fill="none"
          markerEnd="url(#arrow-accent)"
        />
        <text x="310" y="282" textAnchor="middle" className="flow-text-title" style={{ fontSize: '11px', fill: 'var(--accent)', fontWeight: 600 }}>
          Chunk-by-Chunk Token Stream
        </text>
        <text x="310" y="296" textAnchor="middle" className="flow-text-subtitle" style={{ fontSize: '9px' }}>
          res.write() &bull; TextDecoder client loop
        </text>

        {/* Decorative elements representing Chai / System Code */}
        {/* Orange Coffee Icon Indicator */}
        <g transform="translate(60, 275)" opacity="0.8">
          <rect x="0" y="0" width="110" height="26" rx="6" stroke="var(--accent)" strokeWidth="1" fill="var(--bg-surface)" />
          <text x="55" y="16" textAnchor="middle" className="flow-text-title" style={{ fill: 'var(--accent)', fontSize: '10px' }}>☕ Chai aur Code</text>
        </g>

        {/* Teal Terminal Icon Indicator */}
        <g transform="translate(690, 275)" opacity="0.8">
          <rect x="0" y="0" width="110" height="26" rx="6" stroke="var(--engine)" strokeWidth="1" fill="var(--bg-surface)" />
          <text x="55" y="16" textAnchor="middle" className="flow-text-title" style={{ fill: 'var(--engine)', fontSize: '10px' }}>⚡ System Design</text>
        </g>
      </svg>
    </div>
  );
}
