import { forwardRef, useCallback, useMemo } from "react";
import { GraphFragment } from "@/grapher";
import CommitListRow from "./CommitListRow";
import VirtualList, { VirtualListMethods } from "../VirtualList";

export interface CommitListProps {
  commits: Commit[];
  refs: Refs;
  graph: Record<string, GraphFragment>;
  fontSize: FontSize;
  onRowClick?: (event: React.MouseEvent, index: number, item: Commit) => void;
}

let nextId = 0;

const CommitList: React.ForwardRefRenderFunction<VirtualListMethods, CommitListProps> = (
  { commits, graph, refs, fontSize, onRowClick },
  ref
) => {
  const rowHeight = fontSize === "medium" ? 52 : 46;
  const instanceId = useMemo(() => (nextId++).toString(), []);
  const getItemKey = useCallback((item: Commit) => item.id, []);
  const renderRow = useCallback(
    ({ index, item }: { index: number; item: Commit }) => {
      return (
        <CommitListRow
          commit={item}
          index={index}
          head={item.id === refs.head}
          graph={graph[item.id]}
          refs={refs.refsById[item.id]}
          height={rowHeight}
          parentId={instanceId}
        />
      );
    },
    [commits, graph, refs, rowHeight]
  );
  return (
    <VirtualList<Commit>
      ref={ref}
      items={commits}
      itemSize={rowHeight}
      getItemKey={getItemKey}
      onRowClick={onRowClick}
    >
      {renderRow}
    </VirtualList>
  );
};

export default forwardRef(CommitList);
