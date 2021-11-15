import browserApi from "@/browserApi";
import { serializeError } from "@/util";
import { Dispatch, RootState } from "..";
import { SHOW_ALERT, SHOW_ERROR } from "../misc";
import { RELOAD_REPOSITORY } from "./reloadRepository";

const commit = (options: CommitOptions) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    try {
      if (!options.amend && !options.message) {
        dispatch(SHOW_ALERT({ type: "warning", message: "Input commit message" }));
        return false;
      }
      const state = getState();
      const repoPath = state.repository.path;
      if (!repoPath) {
        return false;
      }
      await browserApi.commit({ repoPath, options });
      await dispatch(RELOAD_REPOSITORY());
      return true;
    } catch (error) {
      dispatch(SHOW_ERROR({ error: serializeError(error) }));
      return false;
    }
  };
};

export const COMMIT = commit;
