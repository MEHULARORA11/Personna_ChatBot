import { motion } from 'framer-motion';
import DocHeader from '../components/docs/DocHeader';
import DocsPagerFooter from '../components/docs/DocsPagerFooter';
import TableOfContents from '../components/docs/TableOfContents';
import SvgDiagram from '../components/SvgDiagram';

export default function DocsIndex() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex gap-10"
    >
      <div className="flex-1 min-w-0 docs-content space-y-8">
        <DocHeader
          title="Overview & Architecture"
          subtitle="How request and response flows move through the Persona ChatBot system."
          readingTime="2 min read"
        />

        {/* Main Prose */}
        <div className="prose prose-zinc dark:prose-invert max-w-none text-[14px] sm:text-base leading-relaxed space-y-4">
          <p>
            The{' '}
            <strong className="font-semibold text-text-primary">Persona ChatBot</strong>{' '}
            is a web-based chat assistant inspired by the distinct communication styles of software educators{' '}
            <strong className="font-semibold text-text-primary">Hitesh Choudhary</strong>{' '}
            and{' '}
            <strong className="font-semibold text-text-primary">Piyush Garg</strong>.
            The application leverages a decoupled client-server architecture to provide immediate local interface state management and raw, real-time chunked responses.
          </p>

          <h2 className="text-xl font-bold text-text-primary font-display mt-8 mb-4 border-b border-border-main pb-2">
            System Request Lifecycle
          </h2>
          <p className="text-text-muted">
            The diagram below illustrates the exact path of a message request from the client browser, through query validations, agent selection, tool triggers, and chunk-by-chunk stream returns:
          </p>
        </div>

        {/* Hand-drawn SVG Flowchart */}
        <SvgDiagram />

        {/* Lifecycle Breakdown */}
        <div className="space-y-6 pt-4">
          <h2 className="text-xl font-bold text-text-primary font-display border-b border-border-main pb-2">
            Step-by-Step Flow Breakdown
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 rounded-2xl border border-border-main bg-bg-surface hover:border-accent/30 hover:shadow-sm transition-all duration-200">
              <span className="inline-block px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-[9px] font-mono text-accent uppercase tracking-wider mb-2">
                Step 1
              </span>
              <h3 className="font-bold text-text-primary font-display text-[15px]">
                Input Submission & CORS Handshake
              </h3>
              <p className="text-xs text-text-muted mt-1.5 leading-relaxed">
                When the user clicks "Send", the frontend instantly clears the input field and triggers a native `fetch` connection to `POST /api/post`. The request sends the user query alongside the chosen target persona. It includes credentials to enable browser-level cookie transfers.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-border-main bg-bg-surface hover:border-accent/30 hover:shadow-sm transition-all duration-200">
              <span className="inline-block px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-[9px] font-mono text-accent uppercase tracking-wider mb-2">
                Step 2
              </span>
              <h3 className="font-bold text-text-primary font-display text-[15px]">
                Guardrail Validation (Pre-check)
              </h3>
              <p className="text-xs text-text-muted mt-1.5 leading-relaxed">
                Before the query reaches the main AI agent, a specialized `guardrailAgent` evaluates the query for safety, topic alignment, and constraints. If the query is off-topic (e.g. asking for direct coding solutions, homework scripts, or abusive text), it gets rejected with a detailed Zod output reason.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-border-main bg-bg-surface hover:border-accent/30 hover:shadow-sm transition-all duration-200">
              <span className="inline-block px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-[9px] font-mono text-accent uppercase tracking-wider mb-2">
                Step 3
              </span>
              <h3 className="font-bold text-text-primary font-display text-[15px]">
                Agent Character & Tool Evaluation
              </h3>
              <p className="text-xs text-text-muted mt-1.5 leading-relaxed">
                If safe, the backend initializes the main agent (`hiteshAgent` or `piyushAgent`) loaded with their specific system biographies, Hinglish speech patterns, and custom sub-tools. The agent automatically decides if it needs to trigger tools like weather forecasts or YouTube video searching.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-border-main bg-bg-surface hover:border-accent/30 hover:shadow-sm transition-all duration-200">
              <span className="inline-block px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-[9px] font-mono text-accent uppercase tracking-wider mb-2">
                Step 4
              </span>
              <h3 className="font-bold text-text-primary font-display text-[15px]">
                Decoded Chunk-by-Chunk Stream
              </h3>
              <p className="text-xs text-text-muted mt-1.5 leading-relaxed">
                Instead of buffering the result, the server writes raw text stream chunks directly back to the HTTP body response. The browser frontend reads the raw response stream in a loop using a `TextDecoder` reader, updating the interface character-by-character to create a smooth, typing UX.
              </p>
            </div>
          </div>
        </div>

        <DocsPagerFooter />
      </div>
      <TableOfContents />
    </motion.div>
  );
}
