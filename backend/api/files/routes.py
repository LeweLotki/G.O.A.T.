from fastapi import APIRouter, Query

from api.files import crud
from api.files.schemas import FileContentResponse, FileTreeResponse

router = APIRouter()


@router.get("/tree", response_model=FileTreeResponse)
async def get_markdown_tree(
    ref: str | None = Query(
        default=None,
        description="Branch, tag, or commit (default from settings, usually main)",
    ),
) -> FileTreeResponse:
    return await crud.fetch_markdown_tree(ref=ref)


@router.get("", response_model=FileContentResponse)
async def get_markdown_file(
    path: str = Query(..., description="Repository-relative path to a .md / .markdown file"),
    ref: str | None = Query(
        default=None,
        description="Branch, tag, or commit (default from settings, usually main)",
    ),
) -> FileContentResponse:
    return await crud.fetch_markdown_file(path=path, ref=ref)
