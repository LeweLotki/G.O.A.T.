import { useState, type ReactNode } from "react";
import { SAMPLE_FILE_TREE, type FileTreeNode } from "../../data/sample_tree";

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

function TreeNodes({ nodes, depth }: { nodes: FileTreeNode[]; depth: number }) {
  return (
    <>
      {nodes.map((node, i) => {
        const key = `${depth}-${i}-${node.name}`;
        if (node.kind === "file") {
          return (
            <div
              key={key}
              className="file-tree__file"
              style={{ paddingLeft: 22 + depth * 14 }}
            >
              {node.name}
            </div>
          );
        }
        return (
          <TreeDir key={key} name={node.name} depth={depth}>
            <TreeNodes nodes={node.children} depth={depth + 1} />
          </TreeDir>
        );
      })}
    </>
  );
}

export function FileTree() {
  return (
    <nav className="file-tree" aria-label="Repository files">
      <div className="file-tree__title">Files</div>
      <TreeNodes nodes={SAMPLE_FILE_TREE} depth={0} />
    </nav>
  );
}
