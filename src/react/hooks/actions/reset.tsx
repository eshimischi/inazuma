import { useAtomValue } from "jotai";
import { useCallback } from "react";
import { useCallbackWithErrorHandler } from "@/hooks/useCallbackWithErrorHandler";
import { currentBranchAtom, repoPathAtom } from "../../state/repository";
import { useReloadRepository } from "@/hooks/actions/openRepository";
import { useDialog } from "@/context/DialogContext";
import { ResetDialogBody } from "@/components/repository/ResetBranchDialogBody";
import { ResetOptions } from "@backend/ResetOptions";
import { invokeTauriCommand } from "@/invokeTauriCommand";

export const useBeginReset = () => {
  const repoPath = useAtomValue(repoPathAtom);
  const currentBranch = useAtomValue(currentBranchAtom);
  const dialog = useDialog();

  return useCallback(
    async (commit: Commit) => {
      if (!repoPath) {
        return;
      }
      if (!currentBranch) {
        return;
      }
      return await dialog.showModal({
        content: <ResetDialogBody branchName={currentBranch.name} destination={commit} />,
        defaultActionKey: "Enter"
      });
    },
    [repoPath, currentBranch, dialog]
  );
};

export const useReset = () => {
  const repoPath = useAtomValue(repoPathAtom);
  const reloadRepository = useReloadRepository();
  return useCallbackWithErrorHandler(
    async (options: ResetOptions) => {
      if (!repoPath) {
        return false;
      }
      await invokeTauriCommand("reset", { repoPath, options });
      await reloadRepository();
      return true;
    },
    [repoPath, reloadRepository]
  );
};
