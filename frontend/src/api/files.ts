import { API_BASE_URL } from "../const";

export type ApiFileTreeNode = {
  name: string;
  path: string;
  kind: "dir" | "file";
  children: ApiFileTreeNode[];
};

export type FileTreeApiResponse = {
  ref: string;
  truncated: boolean;
  root: ApiFileTreeNode[];
};

export type FileContentApiResponse = {
  path: string;
  ref: string;
  content: string;
  sha: string | null;
};

async function readError(res: Response): Promise<string> {
  try {
    const data: unknown = await res.json();
    if (data && typeof data === "object" && "detail" in data) {
      const d = (data as { detail: unknown }).detail;
      return typeof d === "string" ? d : JSON.stringify(d);
    }
  } catch {
    /* fall through */
  }
  return res.statusText || `HTTP ${res.status}`;
}

export async function getFileTree(ref?: string): Promise<FileTreeApiResponse> {
  const u = new URL(`${API_BASE_URL}/api/files/tree`);
  if (ref) u.searchParams.set("ref", ref);
  const res = await fetch(u.toString());
  if (!res.ok) throw new Error(await readError(res));
  return res.json() as Promise<FileTreeApiResponse>;
}

export async function getFileContent(
  path: string,
  ref?: string,
): Promise<FileContentApiResponse> {
  const u = new URL(`${API_BASE_URL}/api/files`);
  u.searchParams.set("path", path);
  if (ref) u.searchParams.set("ref", ref);
  const res = await fetch(u.toString());
  if (!res.ok) throw new Error(await readError(res));
  return res.json() as Promise<FileContentApiResponse>;
}
