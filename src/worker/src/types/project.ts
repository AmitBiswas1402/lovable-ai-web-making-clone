/**
 * worker/src/types/project.ts
 *
 * Types for project files and versions used by the worker.
 */

export interface ProjectFile {
  path: string;
  content: string;
}

export interface Version {
  versionNumber: number;
  prompt: string;
  model: string;
  files: ProjectFile[];
  changedFiles: string[];
  type: "ai" | "manual" | "restore";
  createdAt: string;
  fileCount: number;
  restoredFrom?: number;
}

export {};
