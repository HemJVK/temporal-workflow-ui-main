import { useState, useEffect } from "react";

export function useWorkflowStatus(workflowId: string, runId: string) {
  const [statuses, setStatuses] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!workflowId) return;

    console.log(`Starting poll for ${workflowId}`);
    let errorCount = 0;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/workflows/${workflowId}/status?runId=${runId}`
        );

        if (res.ok) {
          errorCount = 0; // reset on success
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
        } else {
           if (res.status === 404) {
             console.log('Workflow not found. Stopping poll.');
             clearInterval(interval);
           }
        }
      } catch (err) {
        console.error("Polling error:", err);
        errorCount++;
        if (errorCount >= 5) {
          console.error("Too many polling errors. Stopping poll.");
          clearInterval(interval);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [workflowId, runId]);

  return statuses;
}
