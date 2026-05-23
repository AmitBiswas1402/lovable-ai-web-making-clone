"use client";

import { Project } from "@/types/projects";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const ProjectPreview = dynamic(
  () =>
    import("./project-preview").then((mod) => ({
      default: mod.ProjectPreview,
    })),
  { ssr: false },
);

const VIRTUAL_WIDTH = 1024;
const VIRTUAL_HEIGHT = 160;

export interface ProjectCardProps {
  project: Project;
  files: Record<string, string>;
  onRename: (id: string) => void;
  onDelete: (id: string) => void;
}

function getRelativeTime(dateString: string): string {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diffInSeconds = Math.floor((now - then) / 1000);

  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["week", 60 * 60 * 24 * 7],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
    ["second", 1],
  ];

  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  for (const [unit, secondsInUnit] of units) {
    if (diffInSeconds >= secondsInUnit) {
      const value = Math.floor(diffInSeconds / secondsInUnit);
      return formatter.format(-value, unit);
    }
  }

  return "just now";
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export function ProjectCard({
    project,
    files,
    onRename,
    onDelete,
}: ProjectCardProps) {
    const router = useRouter();
    const initials = getInitials(project.name);
    const thumbnailRef = useRef<HTMLDivElement>(null);
    const[scale, setScale] = useState(0);
    const hasFiles = files && Object.keys(files).length > 0;
    const[previewReady, setPreviewReady] = useState(false);
    
    useEffect(() => {
        if (!thumbnailRef.current) return;

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const containerWidth = entry.contentRect.width;
                setScale(containerWidth / VIRTUAL_WIDTH);
            }
        })

        observer.observe(thumbnailRef.current);
        return () => observer.disconnect();
    }, [])

    return (
        <div onClick={() => router.push(`/projects/${project.id}`)}>
                        
        </div>
    )
}