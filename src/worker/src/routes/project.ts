import { Hono } from "hono";
import { AppVariables, Env } from "../types";

interface Project {
  id: string;
  createdAt: string;
  [key: string]: unknown;
}

const projectRoutes = new Hono<{ Bindings: Env; Variables: AppVariables }>();

projectRoutes.get("/", async (c) => {
  const userId = c.get("userId");

  if (!userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  if (typeof c.env.METADATA.get !== "function") {
    return c.json({ projects: [] });
  }

  const rawProjectIds = await c.env.METADATA.get(`user-projects:${userId}`);
  const projectIds: string[] = rawProjectIds
    ? (JSON.parse(rawProjectIds) as string[])
    : [];

  if (projectIds.length === 0) {
    return c.json({ projects: [] });
  }

  const projects = await Promise.all(
    projectIds.map(async (projectId: string): Promise<Project | null> => {
      const rawProject = await c.env.METADATA.get?.(`project:${projectId}`);
      if (!rawProject) {
        return null;
      }

      try {
        return JSON.parse(rawProject) as Project;
      } catch {
        return null;
      }
    }),
  );

  const validProjects = projects
    .filter((p): p is Project => p !== null)
    .sort(
      (a: Project, b: Project) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  return c.json({ projects: validProjects });
});

export default projectRoutes;
