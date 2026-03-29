// Simple in-memory job cache
// In production, replace with Redis or Supabase database

export interface JobData {
  status: "queued" | "processing" | "completed" | "failed";
  voiceoverUrl?: string;
  influencerVideoUrl?: string;
  finalVideoUrl?: string;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const jobCache = new Map<string, JobData>();

export function setJob(jobId: string, data: JobData) {
  jobCache.set(jobId, data);
}

export function getJob(jobId: string): JobData | undefined {
  return jobCache.get(jobId);
}

export function updateJob(jobId: string, updates: Partial<JobData>) {
  const existing = jobCache.get(jobId);
  if (existing) {
    jobCache.set(jobId, {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    });
  }
}
