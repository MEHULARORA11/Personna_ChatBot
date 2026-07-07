import { motion } from 'framer-motion';
import DocHeader from '../components/docs/DocHeader';
import DocsPagerFooter from '../components/docs/DocsPagerFooter';
import TableOfContents from '../components/docs/TableOfContents';
import SourceRef from '../components/docs/SourceRef';
import CodeBlock from '../components/docs/CodeBlock';
import Callout from '../components/docs/Callout';
import ComparisonGrid from '../components/docs/ComparisonGrid';
import ComparisonCard from '../components/docs/ComparisonCard';

export default function DocsPersonaData() {
  const hiteshPrompt = `// Excerpt from backend/src/agents/hitesh/Persona.ts
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
\`;`;

  const piyushPrompt = `// Excerpt from backend/src/agents/piyush/Persona.ts
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
\`;`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex gap-10"
    >
      <div className="flex-1 min-w-0 docs-content space-y-6">
        <DocHeader
          title="Persona Data & Grounding"
          subtitle="How persona characteristics, statistics, and tone profiles are defined in the backend."
          readingTime="3 min read"
        />

        {/* Concept */}
        <div className="prose prose-zinc dark:prose-invert max-w-none text-[14px] sm:text-base leading-relaxed space-y-4">
          <p>
            Instead of using fine-tuned model weights (which are expensive to train and update), the agents are grounded using a{' '}
            <strong className="font-semibold text-text-primary">biographical prompt engineering approach</strong>.
            Each persona's voice, experience, preferences, and signature quotes are explicitly defined in a system prompt module. This guarantees factual correctness (e.g. correct channel names and subscriber figures) while retaining personality alignment.
          </p>

          <h2 className="text-xl font-bold text-text-primary font-display mt-8 mb-4 border-b border-border-main pb-2">
            Persona Configurations
          </h2>
          <p className="text-text-muted">
            The two main personalities in the system are configured through individual system prompt definitions.
            Below is a side-by-side breakdown of the profiles established in the backend codebase:
          </p>
        </div>

        {/* Comparison Grid */}
        <ComparisonGrid>
          <ComparisonCard
            persona="hitesh"
            title="Hitesh Sir Persona Configuration"
            subtitle="backend/src/agents/hitesh/Persona.ts"
          >
            <div className="text-xs text-text-muted space-y-2">
              <p>
                Established as a veteran coding mentor, community builder, and tea lover. Teaches concepts with intuition first and uses encouraging language.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/10 font-mono text-[10px]">Chai aur Code</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/10 font-mono text-[10px]">Mentor Energy</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/10 font-mono text-[10px]">Hinglish</span>
              </div>
            </div>
            <CodeBlock filename="hitesh/Persona.ts" lang="typescript">
              {hiteshPrompt}
            </CodeBlock>
          </ComparisonCard>

          <ComparisonCard
            persona="piyush"
            title="Piyush Sir Persona Configuration"
            subtitle="backend/src/agents/piyush/Persona.ts"
          >
            <div className="text-xs text-text-muted space-y-2">
              <p>
                Established as a high-energy software engineer, startup advisor, and system design enthusiast. Self-obsessed, unmarried, and highly opinionated about tech stacks.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-500/10 font-mono text-[10px]">Code with Piyush</span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-500/10 font-mono text-[10px]">Startup Minded</span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-500/10 font-mono text-[10px]">System Design</span>
              </div>
            </div>
            <CodeBlock filename="piyush/Persona.ts" lang="typescript">
              {piyushPrompt}
            </CodeBlock>
          </ComparisonCard>
        </ComparisonGrid>

        {/* Tone Realism & Script Conversions */}
        <div className="space-y-4 pt-4">
          <h2 className="text-xl font-bold text-text-primary font-display border-b border-border-main pb-2">
            Tone Realism & Script Conversions
          </h2>
          
          <Callout tone="info" title="Why Script Conversions Matter">
            The system prompts enforce a strict rule that{' '}
            <strong className="font-semibold text-amber-900 dark:text-amber-200">all Hindi words must be in Latin/English script</strong>{' '}
            (e.g., writing "kaafi achha hai" instead of "काफ़ी अच्छा है"). This simulates a natural WhatsApp/live-chat messaging pattern commonly used in coding cohorts and online communication in the Indian developer community.
          </Callout>

          <p className="text-sm text-text-muted leading-relaxed">
            For code details, check the source file configs in{' '}
            <SourceRef path="backend/src/agents/hitesh/Persona.ts" /> and{' '}
            <SourceRef path="backend/src/agents/piyush/Persona.ts" />.
          </p>
        </div>

        <DocsPagerFooter />
      </div>
      <TableOfContents />
    </motion.div>
  );
}
