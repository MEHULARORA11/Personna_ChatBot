/**
 * API client for interacting with the Persona ChatBot backend.
 * 
 * NOTE: Standard axios in the browser does not support true streaming chunk-by-chunk
 * rendering without completing the request. Therefore, we use native fetch() with
 * ReadableStream and TextDecoder for /api/post, and include credentials: "include" 
 * for Express cookie session tracking.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// console.log(API_BASE_URL)

export interface ChatMessage {
  id: string;
  sender: 'user' | 'persona';
  content: string;
  isError?: boolean;
}

interface SendMessageOptions {
  persona: 'hitesh' | 'piyush';
  message: string;
  onChunk: (chunk: string) => void;
  onError: (errorMsg: string) => void;
  onComplete: () => void;
}

export async function sendChatMessage({
  persona,
  message,
  onChunk,
  onError,
  onComplete
}: SendMessageOptions): Promise<void> {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    };

    // Attempt to set Transfer-Encoding: chunked. 
    // Note: Browsers consider this a forbidden request header and will drop or block it.
    // We try to set it inside a try/catch block so it fails/degrades gracefully.
    try {
      (headers as any)['Transfer-Encoding'] = 'chunked';
    } catch (e) {
      console.warn('Browser restricted setting Transfer-Encoding header. Streaming will proceed via browser default reader behavior.', e);
    }

    const response = await fetch(`${API_BASE_URL}/api/post`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ message, persona }),
      credentials: 'include' // Crucial for CORS cookies hiteshAgentId_1 / piyushAgentId_1
    });

    if (!response.ok) {
      // The backend uses guardrails or throws Express 5 errors. 
      // If it's a non-2xx status, extract text if possible or throw a standard error.
      const errText = await response.text().catch(() => 'Unknown server error');
      
      // Look for guardrail reasons in the error text
      if (errText.includes('Invalid Querry , due to Reason =>')) {
        const reason = errText.split('Reason =>')[1]?.trim() || 'off-topic query';
        throw new Error(`Guardrail restriction: ${reason}`);
      }
      throw new Error(errText || `Server responded with status ${response.status}`);
    }

    const body = response.body;
    if (!body) {
      throw new Error('Response body is empty / not streamable.');
    }

    const reader = body.getReader();
    const decoder = new TextDecoder('utf-8');
    let isFinished = false;

    while (!isFinished) {
      const { done, value } = await reader.read();
      if (done) {
        isFinished = true;
        break;
      }
      const chunk = decoder.decode(value, { stream: true });
      onChunk(chunk);
    }
    
    onComplete();
  } catch (error:unknown) {
    console.error('Streaming request failed:', error);
    onError(error?.message || 'Hmm, that didn\'t go through — try rephrasing that.');
  }
}
