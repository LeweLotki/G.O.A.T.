from typing import Literal

from pydantic import BaseModel, Field


class FileTreeNode(BaseModel):
    name: str
    path: str
    kind: Literal["dir", "file"]
    children: list["FileTreeNode"] = Field(default_factory=list)


class FileTreeResponse(BaseModel):
    ref: str
    truncated: bool
    root: list[FileTreeNode]


class FileContentResponse(BaseModel):
    path: str
    ref: str
    content: str
    sha: str | None = None
