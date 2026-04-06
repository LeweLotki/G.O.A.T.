import { useState, type ReactNode } from "react";
import type { ApiFileTreeNode } from "../../api/files";

function TreeDir({
  name,
  depth,
  children,
}: {
  name: string;
  depth: number;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="file-tree__node">
      <button
        type="button"
        className="file-tree__dir"
        style={{ paddingLeft: 8 + depth * 14 }}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="file-tree__chevron" aria-hidden>
          {open ? "▾" : "▸"}
        </span>
        <span className="file-tree__label">{name}</span>
      </button>
      {open ? <div className="file-tree__children">{children}</div> : null}
    </div>
  );
}

function TreeNodes({
  nodes,
  depth,
  selectedPath,
  onSelectFile,
}: {
  nodes: ApiFileTreeNode[];
  depth: number;
  selectedPath: string | null;
  onSelectFile: (path: string) => void;
}) {
  return (
    <>
      {nodes.map((node, i) => {
        const key = `${depth}-${i}-${node.path}`;
        if (node.kind === "file") {
          const selected = selectedPath === node.path;
          return (
            <button
              key={key}
              type="button"
              className={`file-tree__file${selected ? " file-tree__file--selected" : ""}`}
              style={{ paddingLeft: 22 + depth * 14 }}
              onClick={() => onSelectFile(node.path)}
            >
              {node.name}
            </button>
          );
        }
        return (
          <TreeDir key={key} name={node.name} depth={depth}>
            <TreeNodes
              nodes={node.children}
              depth={depth + 1}
              selectedPath={selectedPath}
              onSelectFile={onSelectFile}
            />
          </TreeDir>
        );
      })}
    </>
  );
}

type FileTreeProps = {
  nodes: ApiFileTreeNode[];
  selectedPath: string | null;
  onSelectFile: (path: string) => void;
  loading: boolean;
  error: string | null;
  truncated: boolean;
};

export function FileTree({
  nodes,
  selectedPath,
  onSelectFile,
  loading,
  error,
  truncated,
}: FileTreeProps) {
  return (
    <nav className="file-tree" aria-label="Repository files">
      <div className="file-tree__title">Files</div>
      {loading ? (
        <p className="file-tree__meta">Loading…</p>
      ) : error ? (
        <p className="file-tree__error">{error}</p>
      ) : nodes.length === 0 ? (
        <p className="file-tree__meta">No markdown files in this branch.</p>
      ) : (
        <>
          {truncated ? (
            <p className="file-tree__warn">Tree may be incomplete (truncated on GitHub).</p>
          ) : null}
          <TreeNodes
            nodes={nodes}
            depth={0}
            selectedPath={selectedPath}
            onSelectFile={onSelectFile}
          />
        </>
      )}
    </nav>
  );
}
