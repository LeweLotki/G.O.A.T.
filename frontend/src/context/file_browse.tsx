import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getFileContent, getFileTree, type ApiFileTreeNode } from "../api/files";

type FileBrowseContextValue = {
  branchRef: string | null;
  treeTruncated: boolean;
  tree: ApiFileTreeNode[];
  treeLoading: boolean;
  treeError: string | null;
  selectedPath: string | null;
  selectFile: (path: string) => void;
  fileContent: string | null;
  contentPath: string | null;
  contentLoading: boolean;
  contentError: string | null;
};

const FileBrowseContext = createContext<FileBrowseContextValue | null>(null);

export function FileBrowseProvider({ children }: { children: ReactNode }) {
  const [branchRef, setBranchRef] = useState<string | null>(null);
  const [treeTruncated, setTreeTruncated] = useState(false);
  const [tree, setTree] = useState<ApiFileTreeNode[]>([]);
  const [treeLoading, setTreeLoading] = useState(true);
  const [treeError, setTreeError] = useState<string | null>(null);

  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [contentPath, setContentPath] = useState<string | null>(null);
  const [contentLoading, setContentLoading] = useState(false);
  const [contentError, setContentError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setTreeLoading(true);
    setTreeError(null);
    void (async () => {
      try {
        const data = await getFileTree();
        if (cancelled) return;
        setTree(data.root);
        setBranchRef(data.ref);
        setTreeTruncated(data.truncated);
      } catch (e) {
        if (!cancelled) {
          setTreeError(e instanceof Error ? e.message : "Failed to load file tree");
          setTree([]);
          setBranchRef(null);
        }
      } finally {
        if (!cancelled) setTreeLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedPath) {
      setFileContent(null);
      setContentPath(null);
      setContentError(null);
      setContentLoading(false);
      return;
    }

    let cancelled = false;
    setContentLoading(true);
    setContentError(null);
    void (async () => {
      try {
        const data = await getFileContent(selectedPath, branchRef ?? undefined);
        if (cancelled) return;
        setFileContent(data.content);
        setContentPath(data.path);
        setContentError(null);
      } catch (e) {
        if (!cancelled) {
          setFileContent(null);
          setContentPath(selectedPath);
          setContentError(e instanceof Error ? e.message : "Failed to load file");
        }
      } finally {
        if (!cancelled) setContentLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedPath, branchRef]);

  const selectFile = useCallback((path: string) => {
    setSelectedPath(path);
  }, []);

  const value = useMemo<FileBrowseContextValue>(
    () => ({
      branchRef,
      treeTruncated,
      tree,
      treeLoading,
      treeError,
      selectedPath,
      selectFile,
      fileContent,
      contentPath,
      contentLoading,
      contentError,
    }),
    [
      branchRef,
      treeTruncated,
      tree,
      treeLoading,
      treeError,
      selectedPath,
      selectFile,
      fileContent,
      contentPath,
      contentLoading,
      contentError,
    ],
  );

  return (
    <FileBrowseContext.Provider value={value}>{children}</FileBrowseContext.Provider>
  );
}

export function useFileBrowse(): FileBrowseContextValue {
  const ctx = useContext(FileBrowseContext);
  if (!ctx) {
    throw new Error("useFileBrowse must be used within FileBrowseProvider");
  }
  return ctx;
}
