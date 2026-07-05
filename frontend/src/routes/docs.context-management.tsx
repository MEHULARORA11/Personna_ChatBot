export default function DocsContextManagement() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 font-display">
          Context & Session Management
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          How cookies, OpenAI conversation threads, and client-side message histories are handled.
        </p>
      </div>

      {/* Prose */}
      <div className="prose prose-zinc dark:prose-invert max-w-none text-sm md:text-base leading-relaxed space-y-4">
        <p>
          Managing conversation context between a stateless web frontend and a stateful LLM agent requires coordinating both server-side cookies and client-side memory.
        </p>

        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 font-display mt-6 mb-2">
          OpenAI Conversations API & Cookies
        </h2>
        <p>
          As defined in [app.ts](file:///d:/PROGRAMMING/WEB%20DEVELOPMENT/JS/js/ChatBot/backend/src/app.ts#L82), when a user sends their first message to a persona, the server checks for an existing session cookie:
        </p>
        <ul className="list-disc list-inside text-xs md:text-sm pl-2 space-y-1">
          <li><strong>Hitesh Sir Agent Cookie:</strong> `hiteshAgentId_1`</li>
          <li><strong>Piyush Sir Agent Cookie:</strong> `piyushAgentId_1`</li>
        </ul>
        <p>
          If the cookie is absent, the backend invokes the OpenAI client to create a fresh conversation ID, and maps it back to the client browser by setting a cookie with `httpOnly: true` and `sameSite: 'lax'`.
        </p>

        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 font-display mt-6 mb-2">
          The 30-Second Memory Window
        </h2>
        <p>
          The session cookies are configured with a brief lifespan: **`maxAge: 30 * 1000` (30 seconds)**.
        </p>
        
        <pre className="p-4 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono overflow-x-auto text-zinc-700 dark:text-zinc-300">
{`// Express cookie configuration in backend/src/app.ts:
res.cookie("hiteshAgentId_1", id, {
  httpOnly: true,
  sameSite: 'lax',
  secure: false,
  maxAge: 30 * 1000 // 30 seconds
})`}
        </pre>

        <p>
          This short window limits server-side context memory. If a user is idle for more than 30 seconds, their cookie expires. The next message sent will invoke a brand-new, clean OpenAI conversation thread.
        </p>

        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 font-display mt-6 mb-2">
          Frontend vs. Backend Decoupling
        </h2>
        <p>
          Because the backend memory window is short-lived, **the frontend maintains its own long-lived conversation history in React state** (`chatHistories` object).
        </p>
        <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-xs md:text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          <strong>Why this is important for User Experience:</strong>
          <p className="mt-1">
            If the user waits 45 seconds to type a message, the server-side LLM context is reset. However, the chat bubbles in the UI remain intact. This decoupling ensures the user feels a continuous conversation stream in their dashboard while the backend remains highly efficient, avoiding thread bloat.
          </p>
        </div>

        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 font-display mt-6 mb-2">
          Independent Thread Contexts
        </h2>
        <p>
          By maintaining separate cookies and local state histories for Hitesh Sir and Piyush Sir, the application prevents topic bleed. Chat context from Hitesh (like weather results or code playlists) will never leak into Piyush's chat thread, keeping the two educational advisors completely isolated.
        </p>
      </div>
    </div>
  );
}
