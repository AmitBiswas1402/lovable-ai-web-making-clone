import { FolderOpen } from "lucide-react";
import { Button } from "../ui/button";

export interface EmptyStateProps {
    onCreateProject: () => void;
}

const EmptyState = ({ onCreateProject }: EmptyStateProps) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-20">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
            <FolderOpen />
        </div>
        <h2 className="mt-6 text-xl font-semibold tracking-tight">No projects yet</h2>
        <p className="mt-2 text-sm text-muted-foreground">Get started by creating a new project.</p>
        <Button
            onClick={onCreateProject}
            className="mt-4 rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary/90"
        >
            Create Project
        </Button>
    </div>
  )
}
export default EmptyState