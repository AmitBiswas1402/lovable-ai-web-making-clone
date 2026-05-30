"use client";

import { createApiClient } from "@/lib/api-client";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ProjectGrid } from "@/components/dashboard/project-grid";
import { CreateProjectDialog, CreateProjectData } from "@/components/dashboard/create-project-dialog";
import { Project } from "@/types/projects";

const Dashboard = () => {
  const { getToken } = useAuth();
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [projectFiles, setProjectFiles] = useState<Record<string, Record<string, string>> | undefined>(undefined);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const client = createApiClient(getToken);
      const data = await client.projects.list();
      setProjects(data.projects || []);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  async function handleCreate(data: CreateProjectData) {
    try {
      const client = createApiClient(getToken);
      const res = await client.projects.create({ name: data.name, modelId: data.model });
      // refresh list
      await fetchProjects();
      setDialogOpen(false);
      if (res?.project?.id) {
        router.push(`/projects/${res.project.id}`);
      }
    } catch (e) {
      console.error("Create project failed", e);
    }
  }

  async function handleDelete(id: string) {
    try {
      const client = createApiClient(getToken);
      await client.projects.delete(id);
      setProjects((p) => p.filter((x) => x.id !== id));
    } catch (e) {
      console.error("Delete project failed", e);
      await fetchProjects();
    }
  }

  async function handleRename(id: string) {
    const newName = prompt("New project name");
    if (!newName) return;
    try {
      const client = createApiClient(getToken);
      const res = await client.projects.update(id, { name: newName });
      setProjects((p) => p.map((pr) => (pr.id === id ? res.project : pr)));
    } catch (e) {
      console.error("Rename project failed", e);
      await fetchProjects();
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Dashboard</h1>
      </div>

      <CreateProjectDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleCreate} />

      <ProjectGrid
        projects={projects}
        projectFiles={projectFiles}
        onNewProject={() => setDialogOpen(true)}
        onRename={handleRename}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Dashboard;