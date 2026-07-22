import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, Check, X, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export default function ByokControl() {
  const [status, setStatus] = useState<'idle' | 'editing' | 'saved'>('idle');
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const hasActiveFlag = typeof document !== 'undefined' && document.cookie.includes('personic_byok_active=1');
    if (hasActiveFlag) {
      setStatus('saved');
    }
    fetch(`${API_BASE_URL}/api/byok/status`, { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (data.hasKey) {
          setStatus('saved');
        } else {
          setStatus('idle');
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setErrorMsg('API key is required');
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/byok`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ apiKey: apiKey.trim() }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save API key');
      }
      setStatus('saved');
      setApiKey('');
      setShowKey(false);
      toast.success('OpenAI API key saved successfully');
    } catch (err: any) {
      const msg = err.message || 'Failed to save API key';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/deletekey`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete API key');
      }
      setStatus('idle');
      setApiKey('');
      setShowKey(false);
      toast.success('API key removed');
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove API key');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setStatus('idle');
    setApiKey('');
    setShowKey(false);
    setErrorMsg(null);
  };

  return (
    <div className="relative inline-flex items-center">
      <AnimatePresence mode="wait">
        {status === 'idle' && (
          <motion.button
            key="idle"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            type="button"
            onClick={() => {
              setErrorMsg(null);
              setStatus('editing');
            }}
            className="w-10 h-10 rounded-full border border-border-main bg-bg-surface text-text-muted hover:text-accent hover:border-accent/40 transition-colors duration-200 flex items-center justify-center cursor-pointer"
            title="Bring Your Own Key (BYOK)"
            aria-label="Bring Your Own Key"
          >
            <KeyRound className="w-4.5 h-4.5" />
          </motion.button>
        )}

        {status === 'editing' && (
          <motion.div
            key="editing"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="flex flex-col gap-1"
          >
            <form onSubmit={handleSubmit} className="flex items-center gap-1.5 bg-bg-surface border border-border-main rounded-full p-1 pl-3 shadow-sm">
              <KeyRound className="w-4 h-4 text-text-muted shrink-0" />
              <input
                type={showKey ? 'text' : 'password'}
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                disabled={loading}
                autoFocus
                className="w-36 sm:w-48 bg-transparent text-xs font-mono text-text-primary placeholder:text-text-muted focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                disabled={loading}
                className="p-1 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                title={showKey ? 'Hide key' : 'Show key'}
              >
                {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
              <button
                type="submit"
                disabled={loading || !apiKey.trim()}
                className="w-7 h-7 rounded-full bg-accent text-white hover:bg-accent/90 disabled:opacity-50 transition-colors flex items-center justify-center cursor-pointer shrink-0"
                title="Save API Key"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="w-7 h-7 rounded-full text-text-muted hover:text-text-primary hover:bg-bg-base transition-colors flex items-center justify-center cursor-pointer shrink-0"
                title="Cancel"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </form>
            {errorMsg && (
              <span className="text-[10px] text-red-500 font-medium px-3 truncate max-w-[240px]">
                {errorMsg}
              </span>
            )}
          </motion.div>
        )}

        {status === 'saved' && (
          <motion.div
            key="saved"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-2 h-10 px-3 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Key active</span>
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="ml-1 p-1 rounded-full text-text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
              title="Remove saved API key"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
