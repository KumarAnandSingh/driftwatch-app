import { NextRequest } from "next/server";
import { runQueue } from "@/lib/queue";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await req.formData();
  const seedUrl = String(body.get("seedUrl") || "");
  const depth = Number(body.get("depth") || 2);
  const rate = Number(body.get("rate") || 2);
  const projectId = String(body.get("projectId") || "demo");

  const job = await runQueue.add("run", { projectId, seedUrl, depth, rate });
  return Response.json({ jobId: job.id });
}
