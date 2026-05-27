import { Hono } from "hono";
import { AppVariables, Env, Project } from "../types";
import { sanitizeProjectName } from "../services/sanitize";

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

projectRoutes.post("/:id", async (c) => {
  const userId = c.var.userId;
  const projectId = c.req.param("id");
  if (!userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  if (typeof c.env.METADATA.get !== "function") {
    return c.json({ error: "Project not found", code: "PROJECT_NOT_FOUND" }, 404);
  }

  const rawProject = await c.env.METADATA.get?.(`project:${projectId}`);
  if (!rawProject) {
    return c.json({ error: "Project not found", code: "PROJECT_NOT_FOUND" }, 404);
  }

  let project: Project | null = null;
  try {
    project = JSON.parse(rawProject) as Project;
  } catch (e) {
    return c.json({ error: "Project parse error", code: "PROJECT_PARSE_ERROR" }, 500);
  }

  if ((project as any).userId !== userId) {
    return c.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, 403);
  }

  return c.json({ project });
})

projectRoutes.get("/:id/files", async (c) => {
  const userId = c.var.userId;
  const projectId = c.req.param("id");
  if (!userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  if (typeof c.env.METADATA.get !== "function") {
    return c.json({ error: "Project not found", code: "PROJECT_NOT_FOUND" }, 404);
  }

  const rawProject = await c.env.METADATA.get?.(`project:${projectId}`);
  if (!rawProject) {
    return c.json({ error: "Project not found", code: "PROJECT_NOT_FOUND" }, 404);
  }

  let project: Project;
  try {
    project = JSON.parse(rawProject) as Project;
  } catch (e) {
    return c.json({ error: "Project parse error", code: "PROJECT_PARSE_ERROR" }, 500);
  }

  if ((project as any).userId !== userId) {
    return c.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, 403);
  }

  const versionKey = `${projectId}/version`;
  const rawVersion = await c.env.METADATA.get?.(versionKey);

  if (!rawVersion) {
    return c.json({ error: "Project version not found", code: "VERSION_NOT_FOUND" }, 404);
  }

  let version: { files: Array<{ path: string; content: string }> };
  try {
    version = JSON.parse(rawVersion) as { files: Array<{ path: string; content: string }> };
  } catch (e) {
    return c.json({ error: "Version parse error", code: "VERSION_PARSE_ERROR" }, 500);
  }

  return c.json({ files: version.files, version: project.currentVersion });
})

projectRoutes.patch("/:id", async (c) => {
  const userId = c.var.userId;
  const projectId = c.req.param("id");
  if (!userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  if (typeof c.env.METADATA.get !== "function") {
    return c.json({ error: "Project not found", code: "PROJECT_NOT_FOUND" }, 404);
  }

  const rawProject = await c.env.METADATA.get?.(`project:${projectId}`);
  if (!rawProject) {
    return c.json({ error: "Project not found", code: "PROJECT_NOT_FOUND" }, 404);
  }

  let project: Project;
  try {
    project = JSON.parse(rawProject) as Project;
  } catch (e) {
    return c.json({ error: "Project parse error", code: "PROJECT_PARSE_ERROR" }, 500);
  }

  if ((project as any).userId !== userId) {
    return c.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, 403);
  }

  const body = await c.req.json<{ name?: string; model?: string }>();

  if (body.name) {
    const sanitized = sanitizeProjectName(body.name);
    if (sanitized) {
      (project as any).name = sanitized;
    }
  }

  if (body.model) {
    (project as any).model = body.model;
  }

  (project as any).updatedAt = new Date().toISOString();

  if (typeof c.env.METADATA.put !== "function") {
    return c.json({ error: "KV put not available", code: "KV_PUT_UNAVAILABLE" }, 500);
  }

  await c.env.METADATA.put(`project:${projectId}`, JSON.stringify(project));

  return c.json({ project });
})

projectRoutes.delete("/:id", async (c) => {
  const userId = c.var.userId;
  const projectId = c.req.param("id");
  if (!userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  if (typeof c.env.METADATA.get !== "function") {
    return c.json({ error: "Project not found", code: "PROJECT_NOT_FOUND" }, 404);
  }

  const rawProject = await c.env.METADATA.get?.(`project:${projectId}`);
  if (!rawProject) {
    return c.json({ error: "Project not found", code: "PROJECT_NOT_FOUND" }, 404);
  }

  let project: Project;
  try {
    project = JSON.parse(rawProject) as Project;
  } catch (e) {
    return c.json({ error: "Project parse error", code: "PROJECT_PARSE_ERROR" }, 500);
  }

  if ((project as any).userId !== userId) {
    return c.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, 403);
  }

  const rawExistingIds = await c.env.METADATA.get?.(`user-projects:${userId}`);
  const existingIds: string[] = rawExistingIds ? (JSON.parse(rawExistingIds) as string[]) : [];
  const updatedIds = existingIds.filter((id) => id !== projectId);

  const deletePromises: Promise<unknown>[] = [];

  if (typeof c.env.FILES.list === "function") {
    const r2objects = await c.env.FILES.list({ prefix: `${projectId}/` });
    if (r2objects && Array.isArray(r2objects.objects)) {
      for (const obj of r2objects.objects) {
        if (typeof c.env.FILES.delete === "function") {
          deletePromises.push(c.env.FILES.delete(obj.key));
        }
      }
    }
  }

  const ops: Promise<unknown>[] = [];
  if (typeof c.env.METADATA.delete === "function") {
    ops.push(c.env.METADATA.delete(`project:${projectId}`));
    ops.push(c.env.METADATA.delete(`${projectId}/version`));
  }
  if (typeof c.env.METADATA.put === "function") {
    ops.push(c.env.METADATA.put(`user-projects:${userId}`, JSON.stringify(updatedIds)));
  }

  await Promise.all([...ops, ...deletePromises]);

  return c.json({ message: "Project deleted successfully", success: true });
})

export { projectRoutes };
