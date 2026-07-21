import Magic8BallApp from "./magic-8-ball-app";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "All-Knowing Magic 8-Ball | Live AI App",
  description:
    "Ask a mystical AI Magic 8-Ball a yes-or-no question and get a short, custom fortune from a Vercel-powered app.",
};

export default function Magic8BallPage() {
  return (
    <main className="magic-page">
      <Magic8BallApp />
    </main>
  );
}
