import { NextRequest } from "next/server";
import { runQueue } from "@/lib/queue";

export const dynamic = 'force-dynamic';

function headers(){
  return new Headers({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    "Connection": "keep-alive"
  });
}

export async function GET(req: NextRequest, { params }: { params: { id: string }}) {
  const jobId = params.id;
  const stream = new ReadableStream({
    async start(controller) {
      const enc = new TextEncoder();
      const send = (evt: string, data: any) =>
        controller.enqueue(enc.encode(`event: ${evt}\ndata: ${JSON.stringify(data)}\n\n`));

      const q = runQueue;
      const poll = async () => {
        const job = await q.getJob(jobId);
        if (!job) { send("error", { message: "job not found" }); controller.close(); return; }
        const state = await job.getState();
        const progress = job.progress as number;
        send("progress", { state, progress });
        if (state === "completed" || state === "failed") {
          send("done", { state });
          controller.close();
          return;
        }
        setTimeout(poll, 800);
      };
      poll();
    }
  });
  return new Response(stream, { headers: headers() });
}
