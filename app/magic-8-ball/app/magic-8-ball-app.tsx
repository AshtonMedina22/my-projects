"use client";

import { History, LoaderCircle, RefreshCw, Send, Sparkles } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

type Fortune = {
  id: number;
  question: string;
  answer: string;
  mode: "openai" | "fallback";
};

type ApiResponse = {
  answer?: string;
  error?: string;
  mode?: "openai" | "fallback";
};

const exampleQuestions = [
  "Should I deploy this project tonight?",
  "Will my next portfolio project get noticed?",
  "Is my future database project going to be legendary?",
  "Should I trust the vibes from this code review?",
];

export default function Magic8BallApp() {
  const [name, setName] = useState("");
  const [question, setQuestion] = useState(exampleQuestions[0]);
  const [answer, setAnswer] = useState("");
  const [mode, setMode] = useState<"openai" | "fallback" | "idle">("idle");
  const [isLoading, setIsLoading] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [history, setHistory] = useState<Fortune[]>([]);
  const [error, setError] = useState("");

  const answeredCount = history.length;
  const openAiCount = useMemo(() => history.filter((item) => item.mode === "openai").length, [history]);

  async function askOracle(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanQuestion = question.trim();
    if (!cleanQuestion || isLoading) return;

    setError("");
    setIsLoading(true);
    setIsShaking(true);
    setAnswer("The triangle is surfacing...");
    setMode("idle");

    window.setTimeout(() => setIsShaking(false), 760);

    try {
      const response = await fetch("/api/magic-8-ball", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, question: cleanQuestion }),
      });
      const data = (await response.json()) as ApiResponse;

      if (!response.ok || !data.answer) {
        throw new Error(data.error || "The oracle refused the question.");
      }

      const sourceMode = data.mode ?? "fallback";
      setAnswer(data.answer);
      setMode(sourceMode);
      setHistory((current) => [
        {
          id: Date.now(),
          question: cleanQuestion,
          answer: data.answer ?? "",
          mode: sourceMode,
        },
        ...current.slice(0, 5),
      ]);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "The cosmic connection broke.";
      setError(message);
      setAnswer("The ball cracked. Ask again once fate finds the Wi-Fi.");
      setMode("fallback");
    } finally {
      setIsLoading(false);
    }
  }

  function clearReading() {
    setAnswer("");
    setMode("idle");
    setError("");
    setQuestion("");
  }

  return (
    <section className="magic-stage">
      <div className="magic-copy">
        <p className="eyebrow">Computer Science project upgraded</p>
        <h1>All-Knowing Magic 8-Ball</h1>
        <p>
          A beginner Python control-flow project rebuilt as a Vercel-native AI app. It keeps the original toy concept,
          then adds a serverless OpenAI fortune route, mobile-first interaction, animated feedback, and a usable public
          demo.
        </p>
        <div className="magic-signal-row" aria-label="Project capabilities">
          <span>OpenAI-ready API</span>
          <span>Deterministic fallback</span>
          <span>Animated UI</span>
        </div>
      </div>

      <div className="magic-layout">
        <section className="magic-oracle-panel" aria-label="Magic 8-Ball">
          <div className={`magic-ball ${isShaking ? "is-shaking" : ""}`}>
            <div className="magic-ball-glare" />
            <div className="magic-window">
              <div className={`magic-answer ${answer && mode !== "idle" && !isLoading ? "is-visible" : ""}`}>
                <div className="magic-triangle" />
                <p>{isLoading ? "Consulting..." : answer}</p>
              </div>
              {isLoading ? <LoaderCircle className="magic-loader" size={34} /> : null}
              {mode === "idle" && !isLoading ? <span className="magic-eight">8</span> : null}
            </div>
          </div>
          <div className="magic-oracle-status">
            <span>{mode === "openai" ? "Reading source: OpenAI" : mode === "fallback" ? "Reading source: local oracle" : "Reading source: idle"}</span>
            <span>{answeredCount} fortunes logged</span>
          </div>
        </section>

        <section className="magic-control-panel">
          <div className="magic-panel-heading">
            <Sparkles size={19} />
            <div>
              <h2>Ask the ball</h2>
              <p>Yes-or-no questions work best. Specific questions get better nonsense.</p>
            </div>
          </div>

          <form className="magic-form" onSubmit={askOracle}>
            <label>
              <span>Name</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={48}
                placeholder="Optional seeker name"
              />
            </label>
            <label>
              <span>Question</span>
              <textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                maxLength={280}
                placeholder="Should I ship this project?"
                rows={4}
                required
              />
            </label>
            {error ? <p className="magic-error">{error}</p> : null}
            <div className="magic-actions">
              <button className="magic-button primary" type="submit" disabled={isLoading || !question.trim()}>
                {isLoading ? <LoaderCircle size={17} /> : <Send size={17} />}
                {isLoading ? "Shaking" : "Shake"}
              </button>
              <button className="magic-button secondary" type="button" onClick={clearReading}>
                <RefreshCw size={17} />
                Reset
              </button>
            </div>
          </form>

          <div className="magic-examples" aria-label="Example questions">
            {exampleQuestions.map((example) => (
              <button key={example} type="button" onClick={() => setQuestion(example)}>
                {example}
              </button>
            ))}
          </div>
        </section>

        <aside className="magic-history-panel">
          <div className="magic-panel-heading">
            <History size={19} />
            <div>
              <h2>Reading log</h2>
              <p>{openAiCount} OpenAI readings this session</p>
            </div>
          </div>
          <div className="magic-history-list">
            {history.length ? (
              history.map((item) => (
                <article key={item.id}>
                  <span>{item.mode === "openai" ? "OpenAI" : "Fallback"}</span>
                  <strong>{item.question}</strong>
                  <p>{item.answer}</p>
                </article>
              ))
            ) : (
              <div className="magic-empty-history">
                <Sparkles size={22} />
                <p>No fortunes yet. Destiny is apparently taking a lunch break.</p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
