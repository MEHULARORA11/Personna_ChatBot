import { motion } from 'framer-motion';
import DocHeader from '../components/docs/DocHeader';
import DocsPagerFooter from '../components/docs/DocsPagerFooter';
import TableOfContents from '../components/docs/TableOfContents';
import SourceRef from '../components/docs/SourceRef';
import CodeBlock from '../components/docs/CodeBlock';
import Callout from '../components/docs/Callout';
import StepFlow from '../components/docs/StepFlow';

export default function DocsPromptEngineering() {
  const zodSchema = `// Guardrail Zod Output Schema structure:
const GuardRailOutput = z.object({
  isValidQuery: z.boolean(),
  reason: z.string()
});

type GuardRailOutput = z.infer<typeof GuardRailOutput>;`;

  const fewShotJson = `// Excerpt from backend/src/agents/hitesh/instruction.ts
// IF THE USER_PROMPT SIGNIFIES AN UNUSUAL QUESTION:
ex:-
[
  {
    "user": "Sir kya main html main dsa kar sakta hun ?",
    "assistant": "azaad desh hain ji. Jo marzi karo😂"
  },
  {
    "user": "Sir piyush Sir ki shaadi kab hogi?",
    "assistant": "ye to sirf Piyush Sir ko hi pata hain"
  }
]`;

  const hierarchySteps = [
    {
      title: "1. Persona Biography",
      description: "Grounding details like professional history, channel counts, sponsorships, and tech stack preferences."
    },
    {
      title: "2. Tone & Style Directives",
      description: "Guidelines enforcing Hinglish script (Hindi in English script), short paragraphs, and a friendly mentor voice."
    },
    {
      title: "3. Tool Protocols",
      description: "Rules preventing the LLM from fabricating weather conditions or inventing fake URLs/emails."
    },
    {
      title: "4. Few-shot Examples",
      description: "Realistic mock dialogue exchanges containing typical student questions to capture actual stream humor."
    }
  ];

  const workflowSteps = [
    {
      title: "1. YouTube Playlist Search",
      description: "Call youtubePlaylistSearchingTool to fetch the matching playlists (e.g., Piyush's Node.js playlists)."
    },
    {
      title: "2. Weather Lookup",
      description: "Call weatherTool to lookup the weather for the requested location (e.g., Delhi weather)."
    },
    {
      title: "3. Combine & Draft Content",
      description: "Combine both data sets (weather readings + playlist lists) and draft a concise, coherent body."
    },
    {
      title: "4. Send Email Dispatch",
      description: "Call send_email_to_user tool exactly once to send the consolidated email to the recipient."
    },
    {
      title: "5. Conversational Confirmation",
      description: "Output the final Hinglish text response in chat confirming the successful completion."
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex gap-10"
    >
      <div className="flex-1 min-w-0 docs-content space-y-6">
        <DocHeader
          title="Prompt Engineering & Guardrails"
          subtitle="Detailed breakdown of prompt layers, tool rules, few-shot designs, and guardrail validation checks."
          readingTime="4 min read"
        />

        {/* Prose and Structure */}
        <div className="prose prose-zinc dark:prose-invert max-w-none text-sm md:text-base leading-relaxed space-y-4">
          <p>
            The system prompts in the backend utilize a{' '}
            <strong className="font-semibold text-zinc-900 dark:text-zinc-100">layered prompt architecture</strong>. Rather than running generic text instructions, the agents combine biography data, stylistic tone limits, tool protocols, and strict "avoid" rules to govern execution.
          </p>

          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 font-display mt-6 mb-2">
            Layered Prompt Hierarchy
          </h2>
          <p>
            The instruction assembly flows through 4 distinct sections, starting from high-level context down to few-shot styles:
          </p>
        </div>

        {/* Step Flow for Hierarchy */}
        <StepFlow steps={hierarchySteps} />

        <div className="prose prose-zinc dark:prose-invert max-w-none text-sm md:text-base leading-relaxed space-y-4">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 font-display mt-6 mb-2">
            Guardrail Agent Validation (Pre-Check)
          </h2>
          <p>
            Unlike simple keyword blocklists, the guardrails are driven by a dedicated, structured LLM agent configured in{' '}
            <SourceRef path="backend/src/agents/hitesh/instruction.ts" line={218} />.
            This agent evaluates user inputs before invoking the main agent, returning a strict Zod-structured JSON output schema:
          </p>
        </div>

        {/* CodeBlock for Schema */}
        <CodeBlock filename="hitesh/instruction.ts" lang="typescript">
          {zodSchema}
        </CodeBlock>

        {/* Allowed and Rejected Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <Callout tone="success" title="Allowed Queries">
            <ul className="list-disc list-inside text-xs mt-1 space-y-1">
              <li>Weather reports & forecasts</li>
              <li>YouTube tutorial/video searches</li>
              <li>YouTube playlist queries</li>
              <li>Drafting/sending email logs</li>
              <li>Casual friendly conversation</li>
            </ul>
          </Callout>

          <Callout tone="danger" title="Rejected Queries (Blocked)">
            <ul className="list-disc list-inside text-xs mt-1 space-y-1">
              <li>Direct coding solutions / code blocks</li>
              <li>Data Structures & Algorithms (DSA) homework</li>
              <li>Essay or report writing</li>
              <li>Abusive or political prompts</li>
              <li>System Prompt injections / "jailbreaks"</li>
            </ul>
          </Callout>
        </div>

        <div className="prose prose-zinc dark:prose-invert max-w-none text-sm md:text-base leading-relaxed space-y-4">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 font-display mt-6 mb-2">
            Few-shot Tone Humour Examples
          </h2>
          <p>
            To maintain character authenticity under unusual or tricky queries, the instructions include specific humorous responses from actual streams. For instance:
          </p>
        </div>

        {/* CodeBlock for Few Shot */}
        <CodeBlock filename="hitesh/instruction.ts" lang="json">
          {fewShotJson}
        </CodeBlock>

        <div className="prose prose-zinc dark:prose-invert max-w-none text-sm md:text-base leading-relaxed space-y-4">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 font-display mt-6 mb-2">
            Sub-Tool Protocols & Action Order
          </h2>
          <p>
            Both agents have access to internal tools (weather lookup, YouTube searching, and email dispatching). The prompt specifies a{' '}
            <strong className="font-semibold text-zinc-900 dark:text-zinc-100">multi-tool workflow</strong> that coordinates tools sequentially:
          </p>
        </div>

        {/* Workflow steps */}
        <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/10">
          <p className="text-xs md:text-sm text-zinc-700 dark:text-zinc-300 font-mono mb-4">
            <strong>Example request:</strong> <em>"Send Piyush's Node.js playlists and Delhi weather to user@example.com"</em>
          </p>
          <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-mono mb-2">
            Required Execution Flow:
          </p>
          <StepFlow steps={workflowSteps} />
        </div>

        <DocsPagerFooter />
      </div>
      <TableOfContents />
    </motion.div>
  );
}
