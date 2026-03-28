import { useCallback, useEffect, useState } from 'react';
import type { Node, Edge } from '@xyflow/react';

interface HistoryState {
    nodes: Node[];
    edges: Edge[];
}

export function useUndoRedo(
    nodes: Node[],
    edges: Edge[],
    setNodes: (nodes: Node[] | ((nds: Node[]) => Node[])) => void,
    setEdges: (edges: Edge[] | ((eds: Edge[]) => Edge[])) => void,
    maxHistorySize: number = 50
) {
    const [past, setPast] = useState<HistoryState[]>([]);
    const [future, setFuture] = useState<HistoryState[]>([]);
    // Use a flag to avoid saving history sequentially while undoing/redoing
    const [, setIsUndoRedoAction] = useState(false);

    // Function to take a manual snapshot. Best called on drag start, connect end, node delete, etc.
    const takeSnapshot = useCallback(() => {
        setPast((prevPast) => {
            const newPast = [
                ...prevPast,
                { nodes: structuredClone(nodes), edges: structuredClone(edges) },
            ];
            // Keep within the max limit
            if (newPast.length > maxHistorySize) {
                return newPast.slice(newPast.length - maxHistorySize);
            }
            return newPast;
        });
        // Whenever a new action occurs, the future is obliterated
        setFuture([]);
    }, [nodes, edges, maxHistorySize]);

    const undo = useCallback(() => {
        if (past.length === 0) return;

        setIsUndoRedoAction(true);

        const previous = past[past.length - 1];
        const newPast = past.slice(0, past.length - 1);

        // Save current state into future
        setFuture((prevFuture) => [
            { nodes: structuredClone(nodes), edges: structuredClone(edges) },
            ...prevFuture,
        ]);

        setPast(newPast);
        setNodes(previous.nodes);
        setEdges(previous.edges);

        // Reset flag after a tick
        setTimeout(() => setIsUndoRedoAction(false), 0);
    }, [past, nodes, edges, setNodes, setEdges]);

    const redo = useCallback(() => {
        if (future.length === 0) return;

        setIsUndoRedoAction(true);

        const next = future[0];
        const newFuture = future.slice(1);

        // Save current state into past
        setPast((prevPast) => [
            ...prevPast,
            { nodes: structuredClone(nodes), edges: structuredClone(edges) },
        ]);

        setFuture(newFuture);
        setNodes(next.nodes);
        setEdges(next.edges);

        // Reset flag after a tick
        setTimeout(() => setIsUndoRedoAction(false), 0);
    }, [future, nodes, edges, setNodes, setEdges]);

    // Expose keybind effect in the hook
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Prevent running if user is typing in form inputs
            const target = e.target as HTMLElement;
            if (
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.tagName === 'SELECT' ||
                target.isContentEditable
            ) {
                return;
            }

            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            const cmdKey = isMac ? e.metaKey : e.ctrlKey;

            if (cmdKey && e.key.toLowerCase() === 'z') {
                if (e.shiftKey) {
                    redo(); // Cmd+Shift+Z
                } else {
                    undo(); // Cmd+Z
                }
            } else if (cmdKey && e.key.toLowerCase() === 'y') {
                redo(); // Cmd+Y
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [undo, redo]);

    return { undo, redo, takeSnapshot };
}
