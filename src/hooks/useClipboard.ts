import { useCallback, useState } from 'react';
import type { Node, Edge } from '@xyflow/react';

interface ClipboardState {
    nodes: Node[];
    edges: Edge[];
}

export function useClipboard(
    setNodes: (nodes: Node[] | ((nds: Node[]) => Node[])) => void,
    setEdges: (edges: Edge[] | ((eds: Edge[]) => Edge[])) => void,
    takeSnapshot: () => void
) {
    const [clipboard, setClipboard] = useState<ClipboardState>({ nodes: [], edges: [] });

    const copy = useCallback((selectedNodes: Node[], selectedEdges: Edge[]) => {
        if (selectedNodes.length === 0) return;
        setClipboard({
            nodes: structuredClone(selectedNodes),
            edges: structuredClone(selectedEdges),
        });
    }, []);

    const paste = useCallback((offset = { x: 50, y: 50 }) => {
        if (clipboard.nodes.length === 0) return;

        takeSnapshot();

        const idMap = new Map<string, string>();
        const newNodes: Node[] = clipboard.nodes.map((node) => {
            const newId = `${node.type}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
            idMap.set(node.id, newId);
            return {
                ...node,
                id: newId,
                position: {
                    x: node.position.x + offset.x,
                    y: node.position.y + offset.y,
                },
                selected: true,
            };
        });

        const newEdges: Edge[] = [];
        clipboard.edges.forEach((edge) => {
            if (idMap.has(edge.source) && idMap.has(edge.target)) {
                newEdges.push({
                    ...edge,
                    id: `e_${idMap.get(edge.source)}_${idMap.get(edge.target)}`,
                    source: idMap.get(edge.source)!,
                    target: idMap.get(edge.target)!,
                    selected: true,
                });
            }
        });

        setNodes((nds) => nds.map((n) => ({ ...n, selected: false } as Node)).concat(newNodes));
        setEdges((eds) => eds.map((e) => ({ ...e, selected: false } as Edge)).concat(newEdges));
    }, [clipboard, setNodes, setEdges, takeSnapshot]);

    const cut = useCallback((selectedNodes: Node[], selectedEdges: Edge[]) => {
        if (selectedNodes.length === 0) return;

        // Copy first
        setClipboard({
            nodes: structuredClone(selectedNodes),
            edges: structuredClone(selectedEdges),
        });

        // Then remove
        takeSnapshot();
        const nodeIdsToRemove = new Set(selectedNodes.map((n) => n.id));
        const edgeIdsToRemove = new Set(selectedEdges.map((e) => e.id));

        setNodes((nds) => nds.filter((n) => !nodeIdsToRemove.has(n.id)));
        setEdges((eds) => eds.filter((e) => !edgeIdsToRemove.has(e.id)));
    }, [setNodes, setEdges, takeSnapshot]);

    const duplicate = useCallback((selectedNodes: Node[], selectedEdges: Edge[]) => {
        if (selectedNodes.length === 0) return;

        takeSnapshot();

        const idMap = new Map<string, string>();
        const newNodes: Node[] = selectedNodes.map((node) => {
            const newId = `${node.type}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
            idMap.set(node.id, newId);
            return {
                ...node,
                id: newId,
                position: {
                    x: node.position.x + 50,
                    y: node.position.y + 50,
                },
                selected: true,
            };
        });

        const newEdges: Edge[] = [];
        selectedEdges.forEach((edge) => {
            if (idMap.has(edge.source) && idMap.has(edge.target)) {
                newEdges.push({
                    ...edge,
                    id: `e_${idMap.get(edge.source)}_${idMap.get(edge.target)}`,
                    source: idMap.get(edge.source)!,
                    target: idMap.get(edge.target)!,
                    selected: true,
                });
            }
        });

        setNodes((nds) => nds.map((n) => ({ ...n, selected: false } as Node)).concat(newNodes));
        setEdges((eds) => eds.map((e) => ({ ...e, selected: false } as Edge)).concat(newEdges));
    }, [setNodes, setEdges, takeSnapshot]);

    return { copy, paste, cut, duplicate };
}
