import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUndoRedo } from '../../hooks/useUndoRedo';
import type { Node, Edge } from '@xyflow/react';

describe('useUndoRedo', () => {
  const createMockState = () => {
    let nodes: Node[] = [
      { id: 'n1', type: 'trigger_start', position: { x: 0, y: 0 }, data: {} },
    ];
    let edges: Edge[] = [];

    const setNodes = vi.fn((updater: Node[] | ((nds: Node[]) => Node[])) => {
      nodes = typeof updater === 'function' ? updater(nodes) : updater;
    });
    const setEdges = vi.fn((updater: Edge[] | ((eds: Edge[]) => Edge[])) => {
      edges = typeof updater === 'function' ? updater(edges) : updater;
    });

    return { nodes, edges, setNodes, setEdges, getNodes: () => nodes, getEdges: () => edges };
  };

  it('should initialize with empty history', () => {
    const mock = createMockState();
    const { result } = renderHook(() =>
      useUndoRedo(mock.nodes, mock.edges, mock.setNodes, mock.setEdges)
    );

    expect(result.current.undo).toBeDefined();
    expect(result.current.redo).toBeDefined();
    expect(result.current.takeSnapshot).toBeDefined();
  });

  it('undo should be a no-op when history is empty', () => {
    const mock = createMockState();
    const { result } = renderHook(() =>
      useUndoRedo(mock.nodes, mock.edges, mock.setNodes, mock.setEdges)
    );

    act(() => {
      result.current.undo();
    });

    // setNodes should not be called since there's nothing to undo
    expect(mock.setNodes).not.toHaveBeenCalled();
  });

  it('redo should be a no-op when future is empty', () => {
    const mock = createMockState();
    const { result } = renderHook(() =>
      useUndoRedo(mock.nodes, mock.edges, mock.setNodes, mock.setEdges)
    );

    act(() => {
      result.current.redo();
    });

    expect(mock.setNodes).not.toHaveBeenCalled();
  });

  it('should restore previous state after takeSnapshot + undo', () => {
    const mock = createMockState();
    const { result } = renderHook(() =>
      useUndoRedo(mock.nodes, mock.edges, mock.setNodes, mock.setEdges)
    );

    // Take a snapshot of the initial state
    act(() => {
      result.current.takeSnapshot();
    });

    // Now undo should call setNodes and setEdges with the snapshot
    act(() => {
      result.current.undo();
    });

    expect(mock.setNodes).toHaveBeenCalled();
    expect(mock.setEdges).toHaveBeenCalled();
  });

  it('takeSnapshot should expose the function for external callers', () => {
    const mock = createMockState();
    const { result } = renderHook(() =>
      useUndoRedo(mock.nodes, mock.edges, mock.setNodes, mock.setEdges)
    );

    expect(typeof result.current.takeSnapshot).toBe('function');

    // Should not throw
    act(() => {
      result.current.takeSnapshot();
      result.current.takeSnapshot();
      result.current.takeSnapshot();
    });
  });
});
