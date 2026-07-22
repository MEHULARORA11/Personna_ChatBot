import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner"; // adjust import if you're using a different shadcn toast setup

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ByokManager() {
  const [apiKey, setApiKey] = useState("");
  const [keySaved, setKeySaved] = useState(false); // gates delete button
  const [loading, setLoading] = useState(false);

  // function 1: submit the key
  async function onClick() {
    if (!apiKey.trim()) {
      toast.error("Please enter an API key");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/byok`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ apiKey }),
        credentials: "include", // sends/receives cookies cross-origin
      });

      if (!response.ok) {
        const errText = await response.text().catch(() => "Unknown server error");
        throw new Error(errText || `Server responded with status ${response.status}`);
      }

      setKeySaved(true); // unlocks delete button
      setApiKey("");
      toast.success("API key saved successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save API key");
    } finally {
      setLoading(false);
    }
  }

  // function 2: delete the saved key/cookie
  async function deleteBtn() {
    if (!keySaved) return; // safety guard, button should already be disabled

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/byok`, {
        method: "DELETE",
        credentials: "include", // sends the cookie so backend knows what to delete
      });

      if (!response.ok) {
        const errText = await response.text().catch(() => "Unknown server error");
        throw new Error(errText || `Server responded with status ${response.status}`);
      }

      setKeySaved(false);
      toast.success("API key deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete API key");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* function 3: toggle between input+submit and delete, based on keySaved */}
      {!keySaved ? (
        <>
          <Input
            type="text"
            placeholder="Enter your API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            disabled={loading}
          />
          <Button onClick={onClick} disabled={loading}>
            {loading ? "Saving..." : "Submit"}
          </Button>
        </>
      ) : (
        <Button
          variant="destructive"
          onClick={deleteBtn}
          disabled={!keySaved || loading}
        >
          {loading ? "Deleting..." : "Delete Key"}
        </Button>
      )}
    </div>
  );
}