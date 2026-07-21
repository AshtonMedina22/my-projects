"use client";

import { FileText, RotateCcw, Send, Wrench } from "lucide-react";
import { useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ToolCall = {
  function_name: string;
  function_args: Record<string, unknown>;
  result: Record<string, unknown>;
};

const starterSections: Record<string, string> = {
  "1": "Hi Joe\n\nSection 1: Welcome to Our Lovely Company!\n\nWelcome to the team! This training manual will help you get oriented and become productive in your new role.",
  "2": "Section 2: IT Setup and Security\n\nYour technology setup is crucial for productivity and security. Contact IT Support if you encounter any issues.",
};

const prompts = [
  "Read section 1 and summarize it.",
  "Read section 2 and summarize the IT setup requirements.",
  "Look up Sarah Chen.",
  "Write section 3 about badge access and facilities.",
  "Delete section 3.",
];

export default function TrainingManualApp() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sections, setSections] = useState<Record<string, string>>(starterSections);
  const [toolCalls, setToolCalls] = useState<Record<number, ToolCall>>({});
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendPrompt(prompt: string) {
    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: prompt }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    try {
      const response = await fetch("/api/training-manual-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages, sections }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Training manual API failed.");
      const finalMessages: ChatMessage[] = [...nextMessages, { role: "assistant", content: data.reply }];
      setMessages(finalMessages);
      setSections(data.sections || sections);
      if (data.toolCall) {
        setToolCalls((current) => ({ ...current, [finalMessages.length - 1]: data.toolCall }));
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Training manual API failed.";
      setMessages([...nextMessages, { role: "assistant", content: message }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="llm-product">
      <aside className="llm-tools-panel">
        <div className="panel-title-row">
          <Wrench size={19} />
          <div>
            <p className="eyebrow">Tool Library</p>
            <h2>Actions</h2>
          </div>
        </div>
        {prompts.map((prompt) => (
          <button
            className={`prompt-chip ${prompt.toLowerCase().includes("delete") ? "danger" : ""}`}
            key={prompt}
            type="button"
            onClick={() => sendPrompt(prompt)}
          >
            {prompt}
          </button>
        ))}
        <button
          className="button secondary wide-button"
          type="button"
          onClick={() => {
            setMessages([]);
            setSections(starterSections);
            setToolCalls({});
          }}
        >
          <RotateCcw size={16} />
          Reset Session
        </button>
      </aside>

      <section className="chat-workspace" aria-label="Training manual chat workspace">
        <div className="chat-log">
          {!messages.length ? (
            <div className="empty-chat">
              <FileText size={32} />
              <h2>Ask the assistant to work on the manual.</h2>
              <p>Try reading a section, writing section 3, or looking up Sarah Chen.</p>
            </div>
          ) : null}
          {messages.map((message, index) => (
            <div className={`chat-message ${message.role}`} key={`${message.role}-${index}`}>
              <span>{message.role}</span>
              <p>{message.content}</p>
              {toolCalls[index] ? (
                <details className="tool-detail">
                  <summary>Tool executed: {toolCalls[index].function_name}</summary>
                  <pre>{JSON.stringify(toolCalls[index], null, 2)}</pre>
                </details>
              ) : null}
            </div>
          ))}
        </div>
        <form
          className="chat-form"
          onSubmit={(event) => {
            event.preventDefault();
            if (input.trim()) sendPrompt(input.trim());
          }}
        >
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask to read, write, revise, delete, or look up a contact..."
          />
          <button className="button primary" type="submit" disabled={loading}>
            <Send size={16} />
            {loading ? "Working..." : "Send"}
          </button>
        </form>
      </section>

      <aside className="manual-preview">
        <div className="panel-title-row">
          <FileText size={19} />
          <div>
            <p className="eyebrow">Document State</p>
            <h2>Manual Preview</h2>
          </div>
        </div>
        {Object.entries(sections).map(([number, content]) => (
          <div className="manual-section" key={number}>
            <h3>Section {number}</h3>
            <pre>{content}</pre>
          </div>
        ))}
      </aside>
    </section>
  );
}
