export default function DocsPromptEngineering() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 font-display">
          Prompt Engineering & Guardrails
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Detailed breakdown of prompt layers, tool rules, few-shot designs, and guardrail validation checks.
        </p>
      </div>

      {/* Prose and Structure */}
      <div className="prose prose-zinc dark:prose-invert max-w-none text-sm md:text-base leading-relaxed space-y-4">
        <p>
          The system prompts in the backend utilize a **layered prompt architecture**. Rather than running generic text instructions, the agents combine biography data, stylistic tone limits, tool protocols, and strict "avoid" rules to govern execution.
        </p>

        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 font-display mt-6 mb-2">
          Layered Prompt Hierarchy
        </h2>
        <ol className="list-decimal list-inside space-y-2 text-xs md:text-sm pl-2">
          <li>
            <strong>Persona Biography:</strong> Grounding details like professional history, channel counts, and sponsorships.
          </li>
          <li>
            <strong>Tone & Style Directives:</strong> Guidelines enforcing Hinglish script, short paragraphs, and a friendly mentor voice.
          </li>
          <li>
            <strong>Tool Protocols:</strong> Rules preventing the LLM from fabricating weather conditions or inventing fake URLs/emails.
          </li>
          <li>
            <strong>Few-shot Examples:</strong> Realistic mock dialogue exchanges containing typical student questions.
          </li>
        </ol>

        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 font-display mt-6 mb-2">
          Guardrail Agent Validation (Pre-Check)
        </h2>
        <p>
          Unlike simple keyword blocklists, the guardrails are driven by a dedicated, structured LLM agent ([guardrailAgentInstruction](file:///d:/PROGRAMMING/WEB%20DEVELOPMENT/JS/js/ChatBot/backend/src/agents/hitesh/instruction.ts#L148)).
          This agent returns a strict Zod-structured JSON output schema:
        </p>

        <pre className="p-4 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono overflow-x-auto text-zinc-700 dark:text-zinc-300">
{`// Guardrail Zod Output Schema structure:
{
  isValidQuery: boolean;
  reason: string;
}`}
        </pre>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="p-4 rounded-xl border border-emerald-200/50 dark:border-emerald-900/50 bg-emerald-500/5">
            <h4 className="font-bold text-emerald-800 dark:text-emerald-400 font-display text-xs">
              Allowed Queries
            </h4>
            <ul className="list-disc list-inside text-xs text-emerald-700 dark:text-emerald-400 mt-2 space-y-1">
              <li>Weather reports & forecasts</li>
              <li>YouTube tutorial/video searches</li>
              <li>YouTube playlist queries</li>
              <li>Drafting/sending email logs</li>
              <li>Casual friendly conversation</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-red-200/50 dark:border-red-900/50 bg-red-500/5">
            <h4 className="font-bold text-red-800 dark:text-red-400 font-display text-xs">
              Rejected Queries (Blocked)
            </h4>
            <ul className="list-disc list-inside text-xs text-red-700 dark:text-red-400 mt-2 space-y-1">
              <li>Direct coding solutions / code blocks</li>
              <li>Data Structures & Algorithms (DSA) homework</li>
              <li>Essay or report writing</li>
              <li>Abusive or political prompts</li>
              <li>System Prompt injections / "jailbreaks"</li>
            </ul>
          </div>
        </div>

        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 font-display mt-6 mb-2">
          Few-shot Tone Humour Examples
        </h2>
        <p>
          To maintain character authenticity under unusual or tricky queries, the instructions include specific humorous responses from actual streams. For instance:
        </p>

        <pre className="p-4 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono overflow-x-auto text-zinc-700 dark:text-zinc-300">
{`// Excerpt from instruction.ts
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
]`}
        </pre>

        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 font-display mt-6 mb-2">
          Sub-Tool Protocols & Action Order
        </h2>
        <p>
          Both agents have access to internal tools (weather lookup, YouTube searching, and email dispatching). The prompt specifies a **multi-tool workflow** that coordinates tools sequentially:
        </p>
        <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs leading-relaxed space-y-1">
          <p><strong>Example request:</strong> <em>"Send Piyush's Node.js playlists and Delhi weather to user@example.com"</em></p>
          <p className="font-semibold text-zinc-700 dark:text-zinc-300 mt-2">Required order of execution:</p>
          <ol className="list-decimal list-inside pl-1 text-[11px] text-zinc-500 space-y-0.5">
            <li>Call `youtubePlaylistSearchingTool` to fetch the playlists</li>
            <li>Call `weatherTool` to lookup the Delhi weather</li>
            <li>Combine both data sets and draft a concise body</li>
            <li>Call `send_email_to_user` tool exactly once to send the consolidated email</li>
            <li>Output the conversational response confirming the successful completion</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
