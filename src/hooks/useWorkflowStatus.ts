import { useState, useEffect } from "react";

export function useWorkflowStatus(workflowId: string, runId: string) {
  const [statuses, setStatuses] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!workflowId) return;

    console.log(`Starting poll for ${workflowId}`);

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/workflows/${workflowId}/status?runId=${runId}`
        );

        if (res.ok) {
          const data = await res.json();

          // 1. Update the UI with node colors
          setStatuses(data.nodes);

          // 2. Check if we should stop polling
          if (
            data.workflowStatus === "COMPLETED" ||
            data.workflowStatus === "FAILED"
          ) {
            console.log(`Workflow ${data.workflowStatus}. Stopping poll.`);
            clearInterval(interval);
          }
        }
      } catch (err) {
        console.error("Polling error:", err);
        // Optional: stop polling on 404/500 errors to prevent spamming
        clearInterval(interval);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [workflowId]);

  return statuses;
}
