import classNames from "classnames";
import { Typography } from "@material-ui/core";
import React, { memo, useMemo } from "react";
import { FileStatusIcon } from "./FileStatusIcon";
import { useSelectedIndex } from "@/hooks/useSelectedIndex";
import { FileCommand, IconActionItem } from "@/commands/types";
import { fileCommandsToActions } from "@/commands";
import { useDispatch } from "@/store";
import { RowActionButtons } from "./RowActionButtons";

export interface FileListRowProps {
  commit: Commit;
  file: FileEntry;
  index: number;
  height: number;
  actionCommands?: readonly FileCommand[];
}

const getFileType = (item: FileEntry) => {
  if (item.delta === undefined) {
    return "unknown";
  } else {
    return item.delta.type;
  }
};

const FileType: React.VFC<{ file: FileEntry }> = ({ file }) => (
  <div className="font-bold px-0.5 text-greytext mx-1 my-auto uppercase">{getFileType(file)}</div>
);

const NumStat: React.VFC<{ file: FileEntry }> = ({ file }) => (
  <>
    {file.delta?.type === "text" && (
      <>
        <div className="mx-1 my-auto text-[lightgreen]">+{file.delta.insertions}</div>
        <div className="mx-1 my-auto text-[hotpink]">-{file.delta.deletions}</div>
      </>
    )}
  </>
);

const OldPath: React.VFC<{ file: FileEntry }> = ({ file }) =>
  file.oldPath ? (
    <>
      <div className="font-bold leading-4 mx-1 my-auto px-0.5 py-0 text-background bg-greytext">
        {file.statusCode.startsWith("R") ? "Rename from" : "Copy from"}
      </div>
      <div className="flex-1 font-bold ellipsis text-greytext">{file.oldPath}</div>
    </>
  ) : (
    <></>
  );

const FileListRow_: React.VFC<FileListRowProps> = ({
  commit,
  file,
  index,
  height,
  actionCommands
}) => {
  const selectedIndex = useSelectedIndex();
  const dispatch = useDispatch();
  const actions = useMemo(
    () =>
      fileCommandsToActions(dispatch, actionCommands, commit, file).filter(
        (a) => a.icon
      ) as IconActionItem[],
    [dispatch, actionCommands, commit, file]
  );
  return (
    <div
      className={classNames(
        "group relative flex overflow-hidden box-border cursor-pointer py-1",
        "border-b border-solid border-highlight",
        index === selectedIndex ? "bg-highlight" : "hover:bg-hoverHighlight"
      )}
      style={{ height }}
    >
      <div className="mx-2 my-auto">
        <FileStatusIcon statusCode={file.statusCode} />
      </div>
      <div className="flex-1 flex-col-nowrap pl-1 overflow-hidden font-mono">
        <Typography variant="subtitle1" component="div" className="ellipsis h-6 leading-6">
          {file.path}
        </Typography>
        <Typography
          variant="body2"
          component="div"
          className="flex-row-nowrap whitespace-nowrap h-4 leading-4"
        >
          <FileType file={file} />
          <NumStat file={file} />
          <OldPath file={file} />
        </Typography>
      </div>
      <RowActionButtons actions={actions} size={height * 0.6} />
    </div>
  );
};

export const FileListRow = memo(FileListRow_);
