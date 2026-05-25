"use client";

import { Project } from "@/types/projects";
import { Card } from "../ui/card";
import { Plus } from "lucide-react";
import { ProjectCard } from "./project-card";

export interface ProjectGridProps {
  projects: Project[];
  // map of projectId -> files map (path -> content)
  projectFiles?: Record<string, Record<string, string>>;
  onNewProject: () => void;
  onRename: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ProjectGrid({
  projects,
  projectFiles,
  onNewProject,
  onRename,
  onDelete,
}: ProjectGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <Card
        className="flex h-32 cursor-pointer items-center justify-center border-dashed hover:bg-muted"
        onClick={onNewProject}
      >
        <Plus className="size-5 text-muted-foreground" />
        <span className="text-sm text-medium font-semibold text-muted-foreground">
          New Project
        </span>
      </Card>
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          files={projectFiles?.[project.id]}
          onRename={onRename}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
