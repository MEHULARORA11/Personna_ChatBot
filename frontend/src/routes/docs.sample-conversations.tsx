import { Coffee, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';
import DocHeader from '../components/docs/DocHeader';
import DocsPagerFooter from '../components/docs/DocsPagerFooter';
import TableOfContents from '../components/docs/TableOfContents';

interface MockBubbleProps {
  sender: 'user' | 'persona';
  content: string;
  avatarLabel: string;
  avatarUrl: string;
}

function MockBubble({ sender, content, avatarLabel, avatarUrl }: MockBubbleProps) {
  const isUser = sender === 'user';
  return (
    <div className={`flex items-start gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full overflow-hidden border border-border-main shrink-0 mt-0.5">
          <img src={avatarUrl} alt={avatarLabel} className="w-full h-full object-cover" />
        </div>
      )}
      <div
        className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
          isUser
            ? 'text-white rounded-tr-none ml-auto'
            : 'bg-bg-base border border-border-main text-text-primary rounded-tl-none'
        }`}
        style={isUser ? { backgroundColor: 'var(--bubble-user)' } : undefined}
      >
        <p className="whitespace-pre-wrap">{content}</p>
      </div>
      {isUser && (
        <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-800 flex-shrink-0 flex items-center justify-center text-text-primary text-[9px] font-bold mt-0.5 border border-border-main">
          ME
        </div>
      )}
    </div>
  );
}

export default function DocsSampleConversations() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex gap-10"
    >
      <div className="flex-1 min-w-0 docs-content space-y-6">
        <DocHeader
          title="Sample Conversations"
          subtitle="Side-by-side comparison of conversational tone, vocabulary, and teaching styles."
          readingTime="2 min read"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Column 1: Hitesh Sir */}
          <div className="space-y-4 border border-border-main rounded-2xl p-5 bg-bg-surface hover:shadow-sm transition-shadow duration-200">
            <div className="flex items-center gap-2.5 pb-3 border-b border-border-main">
              <div className="w-8.5 h-8.5 rounded-lg overflow-hidden border border-border-main shrink-0">
                <img src="/hitesh.png" alt="Hitesh Choudhary" className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-text-primary font-display flex items-center gap-1.5">
                  Hitesh Sir (Chai aur Code)
                  <span className="text-xs">☕</span>
                </h2>
                <p className="text-[10px] text-text-muted font-mono">
                  Tone: Warm, intuitive, Hinglish mentor
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Exchange 1 */}
              <div className="space-y-2">
                <MockBubble sender="user" content="Sir coding start karni ho toh kaise karun?" avatarLabel="ME" avatarUrl="" />
                <MockBubble
                  sender="persona"
                  avatarLabel="HC"
                  avatarUrl="/hitesh.png"
                  content={`Simple si baat hai:
JavaScript se start karo.

ChaiCode pe playlist freely available hai. Pehle ek language complete karo properly.

Phir gradually cheezein click karne lagti hain.`}
                />
              </div>

              {/* Exchange 2 */}
              <div className="space-y-2">
                <MockBubble sender="user" content="Sir kya main html main dsa kar sakta hun ?" avatarLabel="ME" avatarUrl="" />
                <MockBubble
                  sender="persona"
                  avatarLabel="HC"
                  avatarUrl="/hitesh.png"
                  content="azaad desh hain ji. Jo marzi karo😂"
                />
              </div>

              {/* Exchange 3 */}
              <div className="space-y-2">
                <MockBubble sender="user" content="Sir App Store pe app publish kiya sir" avatarLabel="ME" avatarUrl="" />
                <MockBubble
                  sender="persona"
                  avatarLabel="HC"
                  avatarUrl="/hitesh.png"
                  content={`Big big congratulations 🔥

League se alag kaam kiya hai tumne.

Aur freelancing ya contract positions mein, ab tumhare paas ek solid portfolio proof hai ki: "haan bhai, app development aata hai."

Aur App Store pe publish hona itself is a big deal.`}
                />
              </div>
            </div>
          </div>

          {/* Column 2: Piyush Sir */}
          <div className="space-y-4 border border-border-main rounded-2xl p-5 bg-bg-surface hover:shadow-sm transition-shadow duration-200">
            <div className="flex items-center gap-2.5 pb-3 border-b border-border-main">
              <div className="w-8.5 h-8.5 rounded-lg overflow-hidden border border-border-main shrink-0">
                <img src="/piyush.jpg" alt="Piyush Garg" className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-text-primary font-display flex items-center gap-1.5">
                  Piyush Sir (Code with Piyush)
                  <span className="text-xs">🚀</span>
                </h2>
                <p className="text-[10px] text-text-muted font-mono">
                  Tone: High-energy tech livestreamer
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Exchange 1 */}
              <div className="space-y-2">
                <MockBubble sender="user" content="Bro Django ka future batao…" avatarLabel="ME" avatarUrl="" />
                <MockBubble
                  sender="persona"
                  avatarLabel="PG"
                  avatarUrl="/piyush.jpg"
                  content={`Honestly, Django ke saath maine zyada kaam nahi kiya.
Main toh kisi bhi din NodeJS aur ExpressJS choose karunga.
Aur agar Python ecosystem ki baat karein toh mujhe FastAPI bahut pasand hai.

Django mujhe kaafi opinionated lagta hai. Isliye coding karne mein utna maza nahi aaya.`}
                />
              </div>

              {/* Exchange 2 */}
              <div className="space-y-2">
                <MockBubble sender="user" content="Sir backlog hai… kaise clear hoga" avatarLabel="ME" avatarUrl="" />
                <MockBubble
                  sender="persona"
                  avatarLabel="PG"
                  avatarUrl="/piyush.jpg"
                  content={`Mere khud 4–5 backlogs the.

Bas self-learning mat chhodo. Skills pe focus rakho.

Degree haath mein le lo. Baaki knowledge khud build karni padti hai.`}
                />
              </div>

              {/* Exchange 3 */}
              <div className="space-y-2">
                <MockBubble sender="user" content="RDBMS vs NoSQL kaise choose karte ho?" avatarLabel="ME" avatarUrl="" />
                <MockBubble
                  sender="persona"
                  avatarLabel="PG"
                  avatarUrl="/piyush.jpg"
                  content={`Bahut accha question hai 👀

Mera default choice almost hamesha PostgreSQL hota hai.

Agar mujhe pata hai application kya build karni hai... Features predictable hain... Toh I go with RDBMS.

NoSQL main mostly analytics ya cache ke liye use karta hoon. Denormalize karke nested JSON format mein save kar do, fast reads mil jayenge.`}
                />
              </div>
            </div>
          </div>
        </div>

        <DocsPagerFooter />
      </div>
      <TableOfContents />
    </motion.div>
  );
}
