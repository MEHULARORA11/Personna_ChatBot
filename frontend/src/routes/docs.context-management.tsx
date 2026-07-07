import { motion } from 'framer-motion';
import DocHeader from '../components/docs/DocHeader';
import DocsPagerFooter from '../components/docs/DocsPagerFooter';
import TableOfContents from '../components/docs/TableOfContents';
import SourceRef from '../components/docs/SourceRef';
import CodeBlock from '../components/docs/CodeBlock';
import Callout from '../components/docs/Callout';
import ComparisonGrid from '../components/docs/ComparisonGrid';
import ComparisonCard from '../components/docs/ComparisonCard';

export default function DocsContextManagement() {
  const cookieConfig = `// Express cookie configuration in backend/src/app.ts:
res.cookie("hiteshAgentId_1", id, {
  httpOnly: true,
  sameSite: 'lax',
  secure: false,
  maxAge: 30 * 1000 // 30 seconds
})`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex gap-10"
    >
      <div className="flex-1 min-w-0 docs-content space-y-6">
        <DocHeader
          title="Context & Session Management"
          subtitle="How cookies, OpenAI conversation threads, and client-side message histories are handled."
          readingTime="3 min read"
        />

        {/* Prose */}
        <div className="prose prose-zinc dark:prose-invert max-w-none text-[14px] sm:text-base leading-relaxed space-y-4">
          <p>
            Managing conversation context between a stateless web frontend and a stateful LLM agent requires coordinating both server-side cookies and client-side memory.
          </p>

          <h2 className="text-xl font-bold text-text-primary font-display mt-8 mb-4 border-b border-border-main pb-2">
            OpenAI Conversations API & Cookies
          </h2>
          <p className="text-text-muted">
            As defined in <SourceRef path="backend/src/app.ts" line={82} />, when a user sends their first message to a persona, the server checks for an existing session cookie mapping back to an active OpenAI thread.
          </p>
        </div>

        {/* Comparison Grid for isolated cookies */}
        <ComparisonGrid>
          <ComparisonCard
            persona="hitesh"
            title="Hitesh Agent Cookie"
            subtitle="hiteshAgentId_1"
          >
            <div className="text-xs text-text-muted space-y-2">
              <p>
                Used exclusively to track Hitesh Sir's conversation thread context.
              </p>
              <div className="p-3.5 bg-bg-base border border-border-main rounded-xl">
                <span className="font-semibold text-text-primary">Scope:</span>
                <p className="mt-0.5 text-text-muted">Isolated to Chai aur Code requests. Never shared with Piyush's context.</p>
              </div>
            </div>
          </ComparisonCard>

          <ComparisonCard
            persona="piyush"
            title="Piyush Agent Cookie"
            subtitle="piyushAgentId_1"
          >
            <div className="text-xs text-text-muted space-y-2">
              <p>
                Used exclusively to track Piyush Sir's conversation thread context.
              </p>
              <div className="p-3.5 bg-bg-base border border-border-main rounded-xl">
                <span className="font-semibold text-text-primary">Scope:</span>
                <p className="mt-0.5 text-text-muted">Isolated to Code with Piyush requests. Never shared with Hitesh's context.</p>
              </div>
            </div>
          </ComparisonCard>
        </ComparisonGrid>

        <p className="text-sm text-text-muted leading-relaxed">
          If the cookie is absent, the backend invokes the OpenAI client to create a fresh conversation ID, and maps it back to the client browser by setting a cookie with `httpOnly: true` and `sameSite: 'lax'`.
        </p>

        {/* The 30-Second Memory Window */}
        <div className="space-y-4 pt-4">
          <h2 className="text-xl font-bold text-text-primary font-display border-b border-border-main pb-2">
            The 30-Second Memory Window
          </h2>
          <p className="text-sm text-text-muted">
            The session cookies are configured with a brief lifespan: <strong className="font-semibold text-text-primary">`maxAge: 30 * 1000` (30 seconds)</strong>.
          </p>

          {/* Timeline Visual */}
          <div className="my-8 bg-bg-surface border border-border-main rounded-2xl p-6 shadow-sm">
            <h3 className="text-[11px] font-bold font-display text-text-muted mb-6 uppercase tracking-widest font-mono">
              Cookie Memory Lifecycle Timeline
            </h3>
            <div className="relative flex flex-col md:flex-row gap-6 md:gap-0 justify-between items-start">
              {/* Connecting horizontal line for desktop */}
              <div className="hidden md:block absolute top-[18px] left-[5%] right-[5%] h-0.5 border-t border-dashed border-border-main" />
              
              {/* Stage 1 */}
              <div className="flex flex-row md:flex-col items-start md:items-center gap-4 md:gap-3 z-10 md:w-[22%] text-left md:text-center">
                <div className="w-9 h-9 rounded-full bg-accent text-white flex items-center justify-center font-bold text-xs shadow-md shadow-accent/20 font-display shrink-0">
                  0s
                </div>
                <div>
                  <h4 className="font-bold text-text-primary text-xs md:text-sm font-display">
                    First Query
                  </h4>
                  <p className="text-[11px] md:text-xs text-text-muted mt-1 md:px-1 leading-relaxed">
                    User sends first message. Backend gets a new `conversationId` and sets the browser cookie.
                  </p>
                </div>
              </div>

              {/* Stage 2 */}
              <div className="flex flex-row md:flex-col items-start md:items-center gap-4 md:gap-3 z-10 md:w-[22%] text-left md:text-center">
                <div className="w-9 h-9 rounded-full bg-accent text-white flex items-center justify-center font-bold text-xs shadow-md shadow-accent/20 font-display shrink-0">
                  0-30s
                </div>
                <div>
                  <h4 className="font-bold text-text-primary text-xs md:text-sm font-display">
                    Active Session
                  </h4>
                  <p className="text-[11px] md:text-xs text-text-muted mt-1 md:px-1 leading-relaxed">
                    Follow-ups within 30s reuse the same cookie. Thread history is preserved.
                  </p>
                </div>
              </div>

              {/* Stage 3 */}
              <div className="flex flex-row md:flex-col items-start md:items-center gap-4 md:gap-3 z-10 md:w-[22%] text-left md:text-center">
                <div className="w-9 h-9 rounded-full bg-bg-base text-text-muted border border-border-main flex items-center justify-center font-bold text-xs font-display shrink-0">
                  30s+
                </div>
                <div>
                  <h4 className="font-bold text-text-primary text-xs md:text-sm font-display">
                    Cookie Expires
                  </h4>
                  <p className="text-[11px] md:text-xs text-text-muted mt-1 md:px-1 leading-relaxed">
                    Session cookie is automatically cleared from the browser due to maxAge expiration.
                  </p>
                </div>
              </div>

              {/* Stage 4 */}
              <div className="flex flex-row md:flex-col items-start md:items-center gap-4 md:gap-3 z-10 md:w-[22%] text-left md:text-center">
                <div className="w-9 h-9 rounded-full bg-accent/10 text-accent border border-accent/20 flex items-center justify-center font-bold text-xs font-display shrink-0">
                  Reset
                </div>
                <div>
                  <h4 className="font-bold text-text-primary text-xs md:text-sm font-display">
                    Clean Slate
                  </h4>
                  <p className="text-[11px] md:text-xs text-text-muted mt-1 md:px-1 leading-relaxed">
                    Next query invokes a fresh thread, preventing context bloat and keeping token costs low.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <CodeBlock filename="app.ts" lang="typescript">
            {cookieConfig}
          </CodeBlock>

          <p className="text-sm text-text-muted leading-relaxed">
            This short window limits server-side context memory. If a user is idle for more than 30 seconds, their cookie expires. The next message sent will invoke a brand-new, clean OpenAI conversation thread.
          </p>
        </div>

        {/* Frontend vs. Backend Decoupling */}
        <div className="space-y-4 pt-4">
          <h2 className="text-xl font-bold text-text-primary font-display border-b border-border-main pb-2">
            Frontend vs. Backend Decoupling
          </h2>
          <p className="text-sm text-text-muted leading-relaxed">
            Because the backend memory window is short-lived, <strong className="font-semibold text-text-primary">the frontend maintains its own long-lived conversation history in React state</strong> (`chatHistories` object).
          </p>
          
          <Callout tone="warning" title="Why this is important for User Experience:">
            If the user waits 45 seconds to type a message, the server-side LLM context is reset. However, the chat bubbles in the UI remain intact. This decoupling ensures the user feels a continuous conversation stream in their dashboard while the backend remains highly efficient, avoiding thread bloat.
          </Callout>
        </div>

        {/* Independent Thread Contexts */}
        <div className="space-y-4 pt-4">
          <h2 className="text-xl font-bold text-text-primary font-display border-b border-border-main pb-2">
            Independent Thread Contexts
          </h2>
          <p className="text-sm text-text-muted leading-relaxed">
            By maintaining separate cookies and local state histories for Hitesh Sir and Piyush Sir, the application prevents topic bleed. Chat context from Hitesh (like weather results or code playlists) will never leak into Piyush's chat thread, keeping the two educational advisors completely isolated.
          </p>
        </div>

        <DocsPagerFooter />
      </div>
      <TableOfContents />
    </motion.div>
  );
}
