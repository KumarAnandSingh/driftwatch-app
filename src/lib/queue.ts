import { Queue, Worker, Job } from "bullmq";
import { redis } from "./redis";

export type RunPayload = {
  projectId: string;
  seedUrl: string;
  depth: number;
  rate: number;
};

export const runQueue = new Queue<RunPayload>("driftwatch-run", { connection: redis });

// Worker example (can be run in a separate process)
export function createRunWorker() {
  const worker = new Worker<RunPayload>("driftwatch-run", async (job: Job<RunPayload>) => {
    // Simulated progress (replace with Playwright/Lighthouse/axe, etc.)
    for (let p = 0; p <= 100; p += 10) {
      await job.updateProgress(p);
      await new Promise(r => setTimeout(r, 300));
    }
    return { ok: true };
  }, { connection: redis });
  return worker;
}
