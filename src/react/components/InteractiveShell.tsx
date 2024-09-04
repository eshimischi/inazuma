import AutoSizer from "react-virtualized-auto-sizer";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useXterm } from "@/hooks/useXterm";
import { useAlert } from "@/context/AlertContext";
import { invokeTauriCommand } from "@/invokeTauriCommand";

export interface InteractiveShellProps {
  open: boolean;
  commandLine: string;
  hide: () => void;
  repoPath: string;
  fontFamily?: string;
  fontSize?: number;
}

const InteractiveShellInner: React.FC<
  InteractiveShellProps & { width: number; height: number }
> = ({
  open,
  commandLine,
  hide,
  repoPath,
  fontFamily = "monospace",
  fontSize = 16,
  width,
  height
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const handleExit = useCallback(
    (succeeded: boolean) => {
      console.log("pty-result:", succeeded);
      hide();
    },
    [hide]
  );
  const { open: openXterm, fit, changeFont, dispose } = useXterm({ onExit: handleExit });

  useEffect(() => dispose, [dispose]);

  useEffect(() => {
    if (open) {
      fit();
    }
  }, [width, height, fit, open]);

  const { reportError } = useAlert();
  const openShell = useCallback(async () => {
    const openPty = (rows: number, cols: number) =>
      invokeTauriCommand("open_pty", { commandLine, cwd: repoPath, rows, cols });
    try {
      await openXterm(wrapperRef.current!, {
        openPty,
        fontFamily,
        fontSize
      });
    } catch (error) {
      reportError({ error });
      hide();
    }
  }, [openXterm, hide, commandLine, repoPath, fontFamily, fontSize, reportError]);

  useEffect(() => {
    if (open) {
      void openShell();
      // don't dispose on cleanup.
      // keep shell opened during hidden.
    }
  }, [open, openShell]);

  useEffect(() => {
    changeFont(fontFamily, fontSize);
  }, [changeFont, fontFamily, fontSize]);

  return <div ref={wrapperRef} className="relative flex-1 overflow-hidden p-0.5" tabIndex={0} />;
};

const nope = () => <></>;

const InteractiveShell_: React.FC<InteractiveShellProps> = (props) => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  // AutoSizer's children will be unmounted during 'display:none'.
  // InteractiveShellInner must be kept mounted, so we put it out of AutoSizer.
  return (
    <>
      <InteractiveShellInner {...props} {...size} />
      <AutoSizer className="absolute flex-1" onResize={setSize}>
        {nope}
      </AutoSizer>
    </>
  );
};

export const InteractiveShell = memo(InteractiveShell_);
