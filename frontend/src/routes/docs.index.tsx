import SvgDiagram from '../components/SvgDiagram';

export default function DocsIndex() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 font-display">
          Overview & Architecture
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          How request and response flows move through the Persona ChatBot system.
        </p>
      </div>

      {/* Main Prose */}
      <div className="prose prose-zinc dark:prose-invert max-w-none text-sm md:text-base leading-relaxed space-y-4">
        <p>
          The **Persona ChatBot** is a web-based chat assistant inspired by the distinct communication styles of software educators **Hitesh Choudhary** and **Piyush Garg**.
          The application leverages a decoupled client-server architecture to provide immediate local interface state management and raw, real-time chunked responses.
        </p>

        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 font-display mt-6 mb-2">
          System Request Lifecycle
        </h2>
        <p>
          The diagram below illustrates the exact path of a message request from the client browser, through query validations, agent selection, tool triggers, and chunk-by-chunk stream returns:
        </p>
      </div>

      {/* Hand-drawn SVG Flowchart */}
      <SvgDiagram />

      {/* Lifecycle Breakdown */}
      <div className="space-y-4 pt-4">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 font-display">
          Step-by-Step Flow Breakdown
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
            <h3 className="font-bold text-zinc-800 dark:text-zinc-200 font-display text-sm">
              1. Input Submission & CORS Handshake
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
              When the user clicks "Send", the frontend instantly clears the input field and triggers a native `fetch` connection to `POST /api/post`. The request sends the user query alongside the chosen target persona. It includes credentials to enable browser-level cookie transfers.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
            <h3 className="font-bold text-zinc-800 dark:text-zinc-200 font-display text-sm">
              2. Guardrail Validation (Pre-check)
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
              Before the query reaches the main AI agent, a specialized `guardrailAgent` evaluates the query for safety, topic alignment, and constraints. If the query is off-topic (e.g. asking for direct coding solutions, homework scripts, or abusive text), it gets rejected with a detailed Zod output reason.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
            <h3 className="font-bold text-zinc-800 dark:text-zinc-200 font-display text-sm">
              3. Agent Character & Tool Evaluation
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
              If safe, the backend initializes the main agent (`hiteshAgent` or `piyushAgent`) loaded with their specific system biographies, Hinglish speech patterns, and custom sub-tools. The agent automatically decides if it needs to trigger tools like weather forecasts or YouTube video searching.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
            <h3 className="font-bold text-zinc-800 dark:text-zinc-200 font-display text-sm">
              4. Decoded Chunk-by-Chunk Stream
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
              Instead of buffering the result, the server writes raw text stream chunks directly back to the HTTP body response. The browser frontend reads the raw response stream in a loop using a `TextDecoder` reader, updating the interface character-by-character to create a smooth, typing UX.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
