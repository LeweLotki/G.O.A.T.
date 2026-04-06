from __future__ import annotations

from dataclasses import dataclass, field

from fastapi import HTTPException, status


def require_github_config(github_token: str, owner: str, repo: str) -> None:
    if not github_token.strip() or not owner.strip() or not repo.strip():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="GitHub integration is not configured (GITHUB_TOKEN, OWNER, REPO).",
        )


def normalize_repo_path(path: str) -> str:
    p = path.strip().strip("/")
    if not p:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="path is required")
    segments = [s for s in p.split("/") if s]
    if not segments or any(s in ("", ".", "..") for s in segments) or ".." in segments:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid path")
    return "/".join(segments)


def is_markdown_blob_path(path: str) -> bool:
    lower = path.lower()
    return lower.endswith(".md") or lower.endswith(".markdown")


@dataclass
class _Trie:
    subdirs: dict[str, _Trie] = field(default_factory=dict)
    """Filenames (with extension) in this directory segment."""
    files_here: list[str] = field(default_factory=list)


def _trie_add_file(root: _Trie, repo_relative_path: str) -> None:
    parts = repo_relative_path.split("/")
    *dir_parts, filename = parts
    node = root
    for d in dir_parts:
        if d not in node.subdirs:
            node.subdirs[d] = _Trie()
        node = node.subdirs[d]
    node.files_here.append(filename)


def _trie_to_nodes(node: _Trie, prefix: str) -> list[FileTreeNode]:
    from api.files.schemas import FileTreeNode

    out: list[FileTreeNode] = []
    for dirname in sorted(node.subdirs):
        child = node.subdirs[dirname]
        child_path = f"{prefix}/{dirname}" if prefix else dirname
        out.append(
            FileTreeNode(
                name=dirname,
                path=child_path,
                kind="dir",
                children=_trie_to_nodes(child, child_path),
            )
        )
    for fname in sorted(node.files_here):
        file_path = f"{prefix}/{fname}" if prefix else fname
        out.append(
            FileTreeNode(
                name=fname,
                path=file_path,
                kind="file",
                children=[],
            )
        )
    return out


def markdown_paths_to_tree_nodes(paths: list[str]) -> list[FileTreeNode]:
    root = _Trie()
    for p in paths:
        _trie_add_file(root, p)
    return _trie_to_nodes(root, "")
