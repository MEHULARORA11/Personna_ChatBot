
import { Coffee, Terminal } from 'lucide-react';

interface MockBubbleProps {
  sender: 'user' | 'persona';
  content: string;
  avatarLabel: string;
  gradient?: string;
}

function MockBubble({ sender, content, avatarLabel, gradient }: MockBubbleProps) {
  const isUser = sender === 'user';
  return (
    <div className={`flex items-start gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className={`w-7 h-7 rounded-full bg-gradient-to-tr ${gradient || 'from-zinc-500 to-zinc-600'} flex-shrink-0 flex items-center justify-center text-white text-[10px] font-bold mt-0.5`}>
          {avatarLabel}
        </div>
      )}
      <div
        className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed border ${
          isUser
            ? 'bg-zinc-900 border-zinc-800 text-white rounded-tr-none dark:bg-zinc-100 dark:border-zinc-200 dark:text-zinc-900 ml-auto'
            : 'bg-zinc-50 border-zinc-200 text-zinc-800 rounded-tl-none dark:bg-zinc-900/40 dark:border-zinc-800/80 dark:text-zinc-200'
        }`}
      >
        <p className="whitespace-pre-wrap">{content}</p>
      </div>
      {isUser && (
        <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-800 flex-shrink-0 flex items-center justify-center text-zinc-700 dark:text-zinc-300 text-[10px] font-bold mt-0.5 border border-zinc-300/40 dark:border-zinc-700/40">
          ME
        </div>
      )}
    </div>
  );
}

export default function DocsSampleConversations() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 font-display">
          Sample Conversations
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Side-by-side comparison of conversational tone, vocabulary, and teaching styles.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: Hitesh Sir */}
        <div className="space-y-4 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 bg-white/40 dark:bg-black/40 backdrop-blur-sm">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-200 dark:border-zinc-800">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white">
              <Coffee className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 font-display">
                Hitesh Sir (Chai aur Code)
              </h3>
              <p className="text-[10px] text-zinc-500 font-mono">
                Tone: Warm, intuitive, calm mentor
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Exchange 1 */}
            <div className="space-y-2">
              <MockBubble sender="user" content="Sir coding start karni ho toh kaise karun?" avatarLabel="HC" />
              <MockBubble
                sender="persona"
                avatarLabel="HC"
                gradient="from-amber-600 to-orange-500"
                content={`Simple si baat hai:
JavaScript se start karo.

ChaiCode pe playlist freely available hai. Pehle ek language complete karo properly.

Phir gradually cheezein click karne lagti hain.`}
              />
            </div>

            {/* Exchange 2 */}
            <div className="space-y-2">
              <MockBubble sender="user" content="Sir kya main html main dsa kar sakta hun ?" avatarLabel="HC" />
              <MockBubble
                sender="persona"
                avatarLabel="HC"
                gradient="from-amber-600 to-orange-500"
                content="azaad desh hain ji. Jo marzi karo😂"
              />
            </div>

            {/* Exchange 3 */}
            <div className="space-y-2">
              <MockBubble sender="user" content="Sir App Store pe app publish kiya sir" avatarLabel="HC" />
              <MockBubble
                sender="persona"
                avatarLabel="HC"
                gradient="from-amber-600 to-orange-500"
                content={`Big big congratulations 🔥

League se alag kaam kiya hai tumne.

Aur freelancing ya contract positions mein, ab tumhare paas ek solid portfolio proof hai ki: "haan bhai, app development aata hai."

Aur App Store pe publish hona itself is a big deal.`}
              />
            </div>
          </div>
        </div>

        {/* Column 2: Piyush Sir */}
        <div className="space-y-4 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 bg-white/40 dark:bg-black/40 backdrop-blur-sm">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-200 dark:border-zinc-800">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center text-white">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 font-display">
                Piyush Sir (Code with Piyush)
              </h3>
              <p className="text-[10px] text-zinc-500 font-mono">
                Tone: Livestream chat, high-energy tech debate
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Exchange 1 */}
            <div className="space-y-2">
              <MockBubble sender="user" content="Bro Django ka future batao…" avatarLabel="PG" />
              <MockBubble
                sender="persona"
                avatarLabel="PG"
                gradient="from-cyan-500 to-blue-600"
                content={`Honestly, Django ke saath maine zyada kaam nahi kiya.
Main toh kisi bhi din NodeJS aur ExpressJS choose karunga.
Aur agar Python ecosystem ki baat karein toh mujhe FastAPI bahut pasand hai.

Django mujhe kaafi opinionated lagta hai. Isliye coding karne mein utna maza nahi aaya.`}
              />
            </div>

            {/* Exchange 2 */}
            <div className="space-y-2">
              <MockBubble sender="user" content="Sir backlog hai… kaise clear hoga" avatarLabel="PG" />
              <MockBubble
                sender="persona"
                avatarLabel="PG"
                gradient="from-cyan-500 to-blue-600"
                content={`Mere खुद 4–5 backlogs the.

Bas self-learning mat chhodo. Skills pe focus rakho.

Degree haath mein le lo. Baaki knowledge khud build karni padti hai.`}
              />
            </div>

            {/* Exchange 3 */}
            <div className="space-y-2">
              <MockBubble sender="user" content="RDBMS vs NoSQL kaise choose karte ho?" avatarLabel="PG" />
              <MockBubble
                sender="persona"
                avatarLabel="PG"
                gradient="from-cyan-500 to-blue-600"
                content={`Bahut accha question hai 👀

Mera default choice almost hamesha PostgreSQL hota hai.

Agar mujhe pata hai application kya build karni hai... Features predictable hain... Toh I go with RDBMS.

NoSQL main mostly analytics ya cache ke liye use karta hoon. Denormalize karke nested JSON format mein save kar do, fast reads mil jayenge.`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
