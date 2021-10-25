import showExternalDiff from "@/store/thunk/showExternalDiff";
import { FileCommand } from "./types";

export const diffWithParent: FileCommand = {
  id: "DiffWithParent",
  label: "Compare with parent",
  icon: "octicon:git-compare-16",
  hidden: (commit, file) => {
    if (commit.parentIds.length === 0) {
      return true;
    }
    if (file.statusCode === "A" || file.statusCode === "D") {
      return true;
    }
    return false;
  },
  handler(dispatch, commit, file) {
    dispatch(
      showExternalDiff(
        { path: file.oldPath || file.path, revspec: commit.id + "~1" },
        { path: file.path, revspec: commit.id }
      )
    );
  }
};

export const diffWithLocal: FileCommand = {
  id: "DiffWithLocal",
  label: "Compare with local",
  icon: "octicon:git-compare-16",
  hidden(_commit, file) {
    if (file.statusCode === "D") {
      return true;
    }
    return false;
  },
  handler(dispatch, commit, file, path) {
    dispatch(
      showExternalDiff({ path: file.path, revspec: commit.id }, { path, revspec: "UNSTAGED" })
    );
  }
};

export const diffUnstaged: FileCommand = {
  id: "DiffUnstaged",
  label: "Compare with Staged",
  icon: "octicon:git-compare-16",
  hidden(commit, file) {
    if (commit.id !== "--") {
      return true;
    }
    if (file.statusCode === "A" || file.statusCode === "D") {
      return true;
    }
    return false;
  },
  handler(dispatch, _, file, path) {
    dispatch(
      showExternalDiff({ path: file.path, revspec: "STAGED" }, { path, revspec: "UNSTAGED" })
    );
  }
};

export const diffStaged: FileCommand = {
  id: "DiffStaged",
  label: "Compare with HEAD",
  icon: "octicon:git-compare-16",
  hidden(commit, file) {
    if (commit.id !== "--") {
      return true;
    }
    if (file.statusCode === "A" || file.statusCode === "D") {
      return true;
    }
    return false;
  },
  handler(dispatch, _, file, path) {
    dispatch(showExternalDiff({ path: file.path, revspec: "HEAD" }, { path, revspec: "STAGED" }));
  }
};
