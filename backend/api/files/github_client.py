from __future__ import annotations

import base64
from typing import Any
from urllib.parse import quote

import httpx
from fastapi import HTTPException, status

from core.settings import Settings

GITHUB_API_BASE = "https://api.github.com"
GITHUB_API_VERSION = "2022-11-28"
ACCEPT = "application/vnd.github+json"
TIMEOUT = 30.0


def _headers(settings: Settings) -> dict[str, str]:
    return {
        "Accept": ACCEPT,
        "Authorization": f"Bearer {settings.github_token}",
        "X-GitHub-Api-Version": GITHUB_API_VERSION,
    }


def _map_github_error(exc: httpx.HTTPStatusError) -> HTTPException:
    status_code = exc.response.status_code
    try:
        body = exc.response.json()
        msg = body.get("message", exc.response.text)
    except Exception:
        msg = exc.response.text or str(exc)
    if status_code == 404:
        return HTTPException(status.HTTP_404_NOT_FOUND, detail=msg)
    if status_code in (401, 403):
        return HTTPException(status.HTTP_502_BAD_GATEWAY, detail=f"GitHub API: {msg}")
    return HTTPException(
        status.HTTP_502_BAD_GATEWAY,
        detail=f"GitHub API error ({status_code}): {msg}",
    )


async def get_branch_tree_sha(settings: Settings, branch: str) -> str:
    url = f"{GITHUB_API_BASE}/repos/{settings.github_owner}/{settings.github_repo}/branches/{quote(branch, safe='')}"
    async with httpx.AsyncClient(timeout=TIMEOUT) as client:
        resp = await client.get(url, headers=_headers(settings))
        try:
            resp.raise_for_status()
        except httpx.HTTPStatusError as e:
            raise _map_github_error(e) from e
        data = resp.json()
    try:
        return str(data["commit"]["commit"]["tree"]["sha"])
    except (KeyError, TypeError) as e:
        raise HTTPException(
            status.HTTP_502_BAD_GATEWAY,
            detail="Unexpected GitHub branch response shape",
        ) from e


async def get_git_tree_recursive(
    settings: Settings, tree_sha: str
) -> tuple[list[dict[str, Any]], bool]:
    url = f"{GITHUB_API_BASE}/repos/{settings.github_owner}/{settings.github_repo}/git/trees/{tree_sha}"
    async with httpx.AsyncClient(timeout=TIMEOUT) as client:
        resp = await client.get(url, headers=_headers(settings), params={"recursive": "1"})
        try:
            resp.raise_for_status()
        except httpx.HTTPStatusError as e:
            raise _map_github_error(e) from e
        data = resp.json()
    tree = data.get("tree") or []
    truncated = bool(data.get("truncated"))
    if not isinstance(tree, list):
        raise HTTPException(
            status.HTTP_502_BAD_GATEWAY,
            detail="Unexpected GitHub tree response shape",
        )
    return tree, truncated


async def get_file_raw_content(
    settings: Settings, repo_path: str, ref: str
) -> tuple[str, str | None]:
    """Returns (decoded text, blob sha)."""
    encoded = "/".join(quote(seg, safe="") for seg in repo_path.split("/"))
    url = f"{GITHUB_API_BASE}/repos/{settings.github_owner}/{settings.github_repo}/contents/{encoded}"
    async with httpx.AsyncClient(timeout=TIMEOUT) as client:
        resp = await client.get(
            url,
            headers=_headers(settings),
            params={"ref": ref},
        )
        try:
            resp.raise_for_status()
        except httpx.HTTPStatusError as e:
            raise _map_github_error(e) from e
        data = resp.json()

    if isinstance(data, list):
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            detail="Path is a directory, not a file",
        )
    if data.get("type") != "file":
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            detail="Path is not a file blob",
        )
    encoding = data.get("encoding")
    content_b64 = data.get("content")
    if encoding != "base64" or not isinstance(content_b64, str):
        raise HTTPException(
            status.HTTP_502_BAD_GATEWAY,
            detail="GitHub returned non-base64 file content",
        )
    # GitHub joins base64 with newlines
    raw = base64.b64decode(content_b64.replace("\n", "")).decode("utf-8")
    sha = data.get("sha")
    if sha is not None:
        sha = str(sha)
    return raw, sha
