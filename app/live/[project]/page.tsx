import { redirect } from "next/navigation";

const projectRouteMap: Record<string, string> = {
  "esg-classifier": "esg-classifier",
  payflow: "payflow",
  "reg-triage": "reg-triage",
  "self-healing-sre": "self-healing-sre",
  "rbac-graph": "rbac-graph",
  "slm-edge": "slm-edge",
  banking: "banking",
  rag: "rag",
  recommendations: "recommendations",
};

export default async function LiveProjectRedirect({ params }: { params: Promise<{ project: string }> }) {
  const { project } = await params;
  redirect(`/live?project=${projectRouteMap[project] ?? project}`);
}

