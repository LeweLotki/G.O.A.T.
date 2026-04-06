from fastapi import HTTPException, status

from api.files import github_client
from api.files.schemas import FileContentResponse, FileTreeResponse
from api.files.utils import (
    is_markdown_blob_path,
    markdown_paths_to_tree_nodes,
    normalize_repo_path,
    require_github_config,
)
from core.settings import settings


async def fetch_markdown_tree(ref: str | None = None) -> FileTreeResponse:
    branch = ref or settings.github_default_branch
    require_github_config(
        settings.github_token,
        settings.github_owner,
        settings.github_repo,
    )

    tree_sha = await github_client.get_branch_tree_sha(settings, branch)
    raw_entries, truncated = await github_client.get_git_tree_recursive(settings, tree_sha)

    md_paths: list[str] = []
    for entry in raw_entries:
        if entry.get("type") != "blob":
            continue
        path = entry.get("path")
        if not isinstance(path, str):
            continue
        if is_markdown_blob_path(path):
            md_paths.append(path)

    md_paths.sort()
    root = markdown_paths_to_tree_nodes(md_paths)
    return FileTreeResponse(ref=branch, truncated=truncated, root=root)


async def fetch_markdown_file(path: str, ref: str | None = None) -> FileContentResponse:
    branch = ref or settings.github_default_branch
    require_github_config(
        settings.github_token,
        settings.github_owner,
        settings.github_repo,
    )

    repo_path = normalize_repo_path(path)
    if not is_markdown_blob_path(repo_path):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only .md / .markdown paths are allowed",
        )

    content, sha = await github_client.get_file_raw_content(settings, repo_path, branch)
    return FileContentResponse(path=repo_path, ref=branch, content=content, sha=sha)
