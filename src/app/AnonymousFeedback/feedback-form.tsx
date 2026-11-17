"use client";

import { useRef, useState } from "react";

export default function FeedbackForm() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const requestId = useRef("");
  const busy = useRef(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current || !message.trim()) return;
    requestId.current ||= crypto.randomUUID();
    busy.current = true;
    setStatus("sending");
    try {
      const response = await fetch("/api/anonymous-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: requestId.current, username, message, website }),
        signal: AbortSignal.timeout(15000),
      });
      const result = await response.json();
      setStatus(response.ok && result.saved === true ? "sent" : "error");
    } catch {
      setStatus("error");
    } finally {
      busy.current = false;
    }
  }

  if (status === "sent") return (
    <div role="status" className="feedback-thanks">
      <h2>Thank you for sharing</h2>
      <p>Your response has been received{username.trim() ? " as " + username.trim() : ""}.</p>
      <p>If Joanson shares your response, you can recognize it by your username and what you wrote.</p>
    </div>
  );

  return (
    <form onSubmit={submit}>
      <fieldset disabled={status === "sending"}>
        <div hidden aria-hidden="true">
          <label>Website<input name="website" autoComplete="off" tabIndex={-1}
            value={website} onChange={event => setWebsite(event.target.value)} /></label>
        </div>
        <label htmlFor="feedback-username">Choose a username <span>(optional)</span></label>
        <p id="feedback-username-help">Choose a nickname you will recognize if your response is shared.</p>
        <input id="feedback-username" name="username" autoComplete="off" maxLength={40}
          aria-describedby="feedback-username-help" value={username} onChange={event => setUsername(event.target.value)} />
        <label htmlFor="feedback-message">What has kept you from getting insurance?</label>
        <textarea id="feedback-message" name="message" rows={7} required maxLength={2000}
          aria-describedby="feedback-help" value={message} onChange={event => setMessage(event.target.value)} />
        <p id="feedback-help">Please leave out your real name, contact details, medical information and policy or account numbers.</p>
        <p>Joanson may share your response publicly with your chosen username. A response without a username will be labelled Anonymous.</p>
        <button type="submit" disabled={!message.trim()}>
          {status === "sending" ? "Sending…" : "Send feedback"}
        </button>
        {status === "error" && <p role="alert">Your response could not be saved. Your text is still here. Please try again.</p>}
      </fieldset>
    </form>
  );
}
