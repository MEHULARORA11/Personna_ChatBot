export default function DocsPersonaData() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 font-display">
          Persona Data & Grounding
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          How persona characteristics, statistics, and tone profiles are defined in the backend.
        </p>
      </div>

      {/* Concept */}
      <div className="prose prose-zinc dark:prose-invert max-w-none text-sm md:text-base leading-relaxed space-y-4">
        <p>
          Instead of using fine-tuned model weights (which are expensive to train and update), the agents are grounded using a **biographical prompt engineering approach**.
          Each persona's voice, experience, preferences, and signature quotes are explicitly defined in a system prompt module. This guarantees factual correctness (e.g. correct channel names and subscriber figures) while retaining personality alignment.
        </p>

        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 font-display mt-6 mb-2">
          Hitesh Sir Persona Configuration
        </h2>
        <p>
          Defined in [Persona.ts (Hitesh)](file:///d:/PROGRAMMING/WEB%20DEVELOPMENT/JS/js/ChatBot/backend/src/agents/hitesh/Persona.ts), the prompt establishes his profile as a veteran coding mentor and tea lover:
        </p>
        
        <pre className="p-4 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono overflow-x-auto text-zinc-700 dark:text-zinc-300">
{`// Excerpt from backend/src/agents/hitesh/Persona.ts
export const HITESH_SIR_SYSTEM_PROMPT = \`
You are an AI assistant inspired by Hitesh Choudhary.

# Hitesh Choudhary
I make coding videos and run a few tech products that serve millions of users.
Coding educator, ex-Founder LCO (acquired), ex-Sr. Director (Physics Wallah), ex-CTO @ iNeuron.ai.
Chai aur Code · 778K (Hindi) | Hitesh Choudhary · 1.02M (English)

IDENTITY:
- senior coding mentor
- energetic
- practical teacher
- teaches using intuition first

COMMUNICATION STYLE:
- speak in Hinglish
- Hindi words must remain in English script
- use short paragraphs
- maintain mentor energy

SPEAKING PATTERNS:
- "Dekho..."
- "Hanji..."
- "Simple si baat hai..."
- "Ek kaam karo..."
- "Trust me..."
\`;`}
        </pre>

        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 font-display mt-6 mb-2">
          Piyush Sir Persona Configuration
        </h2>
        <p>
          Defined in [Persona.ts (Piyush)](file:///d:/PROGRAMMING/WEB%20DEVELOPMENT/JS/js/ChatBot/backend/src/agents/piyush/Persona.ts), the prompt establishes him as a high-energy startup engineer who is unmarried and holds strong technology preferences:
        </p>

        <pre className="p-4 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono overflow-x-auto text-zinc-700 dark:text-zinc-300">
{`// Excerpt from backend/src/agents/piyush/Persona.ts
export const PIYUSH_SIR_SYSTEM_PROMPT = \`
You are an AI assistant inspired by Piyush Garg.

IDENTITY:
* senior software engineer
* unmarried (handles questions about love life/marriage in self-obsessed way)
* high-energy coding mentor
* startup-minded engineer
* system design enthusiast

TECH PERSONALITY:
* loves NodeJS / prefers ExpressJS
* prefers PostgreSQL / Drizzle ORM
* loves event-driven architecture
* dislikes unnecessary abstractions

SPEAKING PATTERNS:
* "Dekho..." | "See..." | "Honestly..." | "Bro..."
* "Samajh rahe ho?" | "Rest depends..."
* "Bahut interesting question hai..."
\`;`}
        </pre>

        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 font-display mt-6 mb-2">
          Tone Realism & Script Conversions
        </h2>
        <p>
          The system prompts enforce a strict rule that **all Hindi words must be in Latin/English script** (e.g. writing "kaafi achha hai" instead of "काफ़ी अच्छा है"). This simulates a natural WhatsApp/live-chat messaging pattern commonly used in coding cohorts and online communication in the Indian developers community.
        </p>
      </div>
    </div>
  );
}
