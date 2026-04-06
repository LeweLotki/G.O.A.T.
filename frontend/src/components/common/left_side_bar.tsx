import { useState } from "react";
import { useFileBrowse } from "../../context/file_browse";
import { FileTree } from "./file_tree";

export function LeftSideBar() {
  const [expanded, setExpanded] = useState(true);
  const {
    tree,
    treeLoading,
    treeError,
    treeTruncated,
    selectedPath,
    selectFile,
  } = useFileBrowse();

  return (
    <aside
      className={`left-sidebar ${expanded ? "" : "left-sidebar--collapsed"}`}
      aria-label="Navigation"
    >
      <div className="left-sidebar__toolbar">
        <button
          type="button"
          className="sidebar-toggle"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
          title={expanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          {expanded ? "◀" : "▶"}
        </button>
      </div>
      {expanded ? (
        <div className="left-sidebar__body">
          <FileTree
            nodes={tree}
            selectedPath={selectedPath}
            onSelectFile={selectFile}
            loading={treeLoading}
            error={treeError}
            truncated={treeTruncated}
          />
        </div>
      ) : null}
    </aside>
  );
}
