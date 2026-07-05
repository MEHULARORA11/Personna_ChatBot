

export default function SvgDiagram() {
  return (
    <div className="w-full bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-inner flex justify-center items-center overflow-x-auto">
      <svg
        width="860"
        height="380"
        viewBox="0 0 860 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-zinc-800 dark:text-zinc-200 font-display flex-shrink-0"
        style={{ fontFamily: '"Outfit", "Comic Sans MS", cursive, sans-serif' }}
      >
        {/* SVG Styles for hand-drawn wobble look */}
        <style>
          {`
            .sketch-line {
              stroke: currentColor;
              stroke-width: 2.2;
              stroke-linecap: round;
              stroke-linejoin: round;
            }
            .sketch-accent-hitesh {
              stroke: #F59E0B;
              stroke-width: 2;
              stroke-linecap: round;
              stroke-linejoin: round;
            }
            .sketch-accent-piyush {
              stroke: #06B6D4;
              stroke-width: 2;
              stroke-linecap: round;
              stroke-linejoin: round;
            }
            .sketch-text {
              fill: currentColor;
              font-size: 13px;
              font-weight: 500;
            }
            .sketch-header {
              fill: currentColor;
              font-size: 14px;
              font-weight: bold;
            }
            .sketch-box {
              stroke: currentColor;
              stroke-width: 2.5;
              stroke-linecap: round;
              stroke-linejoin: round;
              fill: var(--bg-surface);
            }
          `}
        </style>

        {/* 1. USER */}
        <g id="box-user">
          {/* Hand-drawn box border (two overlapping strokes for sketch feel) */}
          <rect x="25" y="145" width="100" height="60" rx="10" className="sketch-box" />
          <path d="M 23,142 L 127,146 L 123,207 L 27,203 Z" className="sketch-line opacity-40" />
          <text x="75" y="174" textAnchor="middle" className="sketch-header">User</text>
          <text x="75" y="192" textAnchor="middle" className="sketch-text" fontSize="10">Inputs Query</text>
        </g>

        {/* Arrow 1: User -> Frontend */}
        <g id="arrow-user-frontend">
          <path d="M 125,175 Q 155,170 185,175" className="sketch-line" />
          <path d="M 175,168 L 186,175 L 176,183" className="sketch-line" />
          <text x="155" y="158" textAnchor="middle" className="sketch-text" fontSize="11">clicks "Send"</text>
        </g>

        {/* 2. FRONTEND */}
        <g id="box-frontend">
          <rect x="190" y="145" width="130" height="60" rx="10" className="sketch-box" />
          <path d="M 188,148 L 322,143 L 318,208 L 192,203 Z" className="sketch-line opacity-40" />
          <text x="255" y="174" textAnchor="middle" className="sketch-header">Frontend (Vite)</text>
          <text x="255" y="192" textAnchor="middle" className="sketch-text" fontSize="10">Port 5173 / React State</text>
        </g>

        {/* Arrow 2: Frontend -> Backend */}
        <g id="arrow-frontend-backend">
          <path d="M 320,175 Q 360,178 395,175" className="sketch-line" />
          <path d="M 385,168 L 396,175 L 386,183" className="sketch-line" />
          <text x="358" y="155" textAnchor="middle" className="sketch-text" fontSize="10">POST /api/post</text>
          <text x="358" y="167" textAnchor="middle" className="sketch-text" fontSize="9" opacity="0.7">credentials: include</text>
        </g>

        {/* 3. BACKEND (Express Server) */}
        <g id="box-backend">
          <rect x="400" y="130" width="150" height="90" rx="12" className="sketch-box" />
          <path d="M 397,133 L 553,127 L 548,223 L 403,218 Z" className="sketch-line opacity-40" />
          <text x="475" y="158" textAnchor="middle" className="sketch-header">Backend (Express)</text>
          <text x="475" y="178" textAnchor="middle" className="sketch-text" fontSize="10">Check cookies (30s maxAge)</text>
          <text x="475" y="194" textAnchor="middle" className="sketch-text" fontSize="10">Retrieve conversationId</text>
        </g>

        {/* Arrow 3: Backend -> Guardrail */}
        <g id="arrow-backend-guardrail">
          <path d="M 475,130 Q 480,95 510,75 Q 540,55 580,50" className="sketch-line" />
          <path d="M 570,43 L 582,50 L 572,57" className="sketch-line" />
          <text x="500" y="90" textAnchor="middle" className="sketch-text" fontSize="10">1. Pre-Check Query</text>
        </g>

        {/* 4. GUARDRAIL AGENT */}
        <g id="box-guardrail">
          <rect x="585" y="20" width="190" height="60" rx="10" className="sketch-box" />
          <path d="M 582,23 L 778,17 L 773,82 L 587,78 Z" className="sketch-line opacity-40" />
          <text x="680" y="49" textAnchor="middle" className="sketch-header">Guardrail Agent</text>
          <text x="680" y="67" textAnchor="middle" className="sketch-text" fontSize="10">Structured Zod Schema output</text>
        </g>

        {/* Arrow 4: Guardrail -> Main Agent (or Reject) */}
        <g id="arrow-guardrail-split">
          {/* Arrow back to backend */}
          <path d="M 680,80 Q 640,115 540,135" className="sketch-line" />
          <path d="M 550,140 L 538,135 L 548,128" className="sketch-line" />
          <text x="635" y="112" textAnchor="middle" className="sketch-text" fontSize="10" fill="#EF4444">If unsafe: throw error</text>

          {/* Connects to main agent */}
          <path d="M 775,50 Q 805,80 790,130 Q 775,180 755,185" className="sketch-line" />
          <path d="M 764,192 L 752,185 L 762,178" className="sketch-line" />
          <text x="825" y="118" textAnchor="middle" className="sketch-text" fontSize="10" fill="#10B981">If valid: run agent</text>
        </g>

        {/* 5. MAIN PERSONA AGENTS */}
        <g id="box-agents">
          <rect x="585" y="160" width="190" height="90" rx="12" className="sketch-box" />
          <path d="M 581,163 L 777,157 L 773,253 L 588,248 Z" className="sketch-line opacity-40" />
          
          <text x="680" y="185" textAnchor="middle" className="sketch-header">Main Agent & Tools</text>

          {/* Hitesh Sir Sub-label */}
          <rect x="595" y="195" width="80" height="22" rx="4" className="sketch-accent-hitesh fill-none" />
          <text x="635" y="210" textAnchor="middle" className="sketch-text font-semibold" fontSize="9" fill="#F59E0B">hiteshAgent</text>

          {/* Piyush Sir Sub-label */}
          <rect x="695" y="195" width="70" height="22" rx="4" className="sketch-accent-piyush fill-none" />
          <text x="730" y="210" textAnchor="middle" className="sketch-text font-semibold" fontSize="9" fill="#06B6D4">piyushAgent</text>

          <text x="680" y="238" textAnchor="middle" className="sketch-text" fontSize="9" opacity="0.8">Tools: weather, youtube, resend email</text>
        </g>

        {/* Arrow 5: Main Agent -> Backend Stream */}
        <g id="arrow-agent-backend">
          <path d="M 585,210 Q 560,215 540,210" className="sketch-line" />
          <path d="M 550,203 L 538,210 L 549,217" className="sketch-line" />
        </g>

        {/* 6. STREAM OUTPUT */}
        <g id="arrow-stream-frontend">
          {/* Curved loop backwards from Backend to Frontend */}
          <path d="M 430,220 Q 340,320 255,208" className="sketch-line stroke-dashed" strokeDasharray="5,4" />
          <path d="M 262,217 L 254,207 L 250,218" className="sketch-line" />
          <text x="330" y="295" textAnchor="middle" className="sketch-text font-semibold" fontSize="11" fill="#D97706">
            Token-by-Token Plain Text Stream
          </text>
          <text x="330" y="310" textAnchor="middle" className="sketch-text" fontSize="9" opacity="0.7">
            res.write(chunk) &bull; client readableStream loop
          </text>
        </g>

        {/* Subtle Decorative elements */}
        {/* Coffee Cup / Chai for Hitesh decoration */}
        <path d="M 80,310 L 100,310 A 10,10 0 0 0 110,300 L 110,280 L 70,280 L 70,300 A 10,10 0 0 0 80,310 Z" className="sketch-accent-hitesh" fill="none" />
        <path d="M 110,285 Q 120,285 120,292 Q 120,298 110,298" className="sketch-accent-hitesh" />
        <path d="M 80,274 Q 83,265 80,260 M 90,274 Q 93,265 90,260 M 100,274 Q 103,265 100,260" className="sketch-accent-hitesh" />
        <text x="135" y="295" className="sketch-text text-amber-500 font-semibold" fontSize="10">Chai aur Code</text>

        {/* Server Box decoration */}
        <path d="M 720,310 L 760,310 L 760,290 L 720,290 Z M 720,290 L 735,275 L 775,275 L 760,290" className="sketch-accent-piyush" fill="none" />
        <path d="M 760,310 L 775,295 L 775,275" className="sketch-accent-piyush" />
        <circle cx="730" cy="300" r="2" fill="#06B6D4" />
        <circle cx="740" cy="300" r="2" fill="#06B6D4" />
        <text x="660" y="295" className="sketch-text text-cyan-500 font-semibold" fontSize="10">Event-driven System</text>
      </svg>
    </div>
  );
}
