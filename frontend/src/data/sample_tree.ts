export type FileTreeNode =
  | { kind: "file"; name: string }
  | { kind: "dir"; name: string; children: FileTreeNode[] };

/** Hardcoded tree until the API is wired. */
export const SAMPLE_FILE_TREE: FileTreeNode[] = [
  {
    kind: "dir",
    name: "docs",
    children: [
      { kind: "file", name: "overview.md" },
      {
        kind: "dir",
        name: "guides",
        children: [
          { kind: "file", name: "getting-started.md" },
          { kind: "file", name: "editing.md" },
        ],
      },
    ],
  },
  {
    kind: "dir",
    name: "notes",
    children: [{ kind: "file", name: "todo.md" }],
  },
  { kind: "file", name: "README.md" },
];
