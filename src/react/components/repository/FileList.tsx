import { forwardRef, useCallback } from "react";
import FileListRow from "./FileListRow";
import VirtualList, { VirtualListEvents, VirtualListMethods } from "../VirtualList";
import { FileCommand } from "@/commands/types";
import { useDispatch } from "@/store";
import { executeFileCommand } from "@/commands";
import { useTheme } from "@material-ui/core";

export interface FileListProps extends VirtualListEvents<FileEntry> {
  files: FileEntry[];
}

const getFileListKey = (item: FileEntry) => `${item.path}:${item.statusCode}`;

export const useFileListRowEventHandler = (command: FileCommand, commit: DagNode | undefined) => {
  const dispatch = useDispatch();
  return useCallback(
    (_e: unknown, _index: number, item: FileEntry) => {
      if (!commit) {
        return;
      }
      executeFileCommand(command, dispatch, commit, item);
    },
    [commit, command, dispatch]
  );
};

const FileList: React.ForwardRefRenderFunction<VirtualListMethods, FileListProps> = (
  { files, ...rest },
  ref
) => {
  const theme = useTheme();
  const rowHeight = theme.custom.baseFontSize * 3;
  const renderRow = useCallback(
    ({ index, item }: { index: number; item: FileEntry }) => {
      return <FileListRow file={item} index={index} height={rowHeight} />;
    },
    [rowHeight]
  );
  return (
    <VirtualList<FileEntry>
      ref={ref}
      items={files}
      itemSize={rowHeight}
      getItemKey={getFileListKey}
      {...rest}
    >
      {renderRow}
    </VirtualList>
  );
};

export default forwardRef(FileList);
