import { Queue } from "bullmq";
import { redis } from "./redis";

export interface RunPayload {
  runId: string;
  projectId: string;
  seedUrl: string;
  maxDepth?: number;
  maxPages?: number;
  enableAccessibility?: boolean;
  enablePerformance?: boolean;
  enableVisualRegression?: boolean;
  enableAICritique?: boolean;
}

export const runQueue = new Queue<RunPayload>("driftwatch-run", { connection: redis });
