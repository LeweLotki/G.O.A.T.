import Markdown from "react-markdown";
import { useFileBrowse } from "../context/file_browse";

export function MainViewPage() {
  const {
    selectedPath,
    fileContent,
    contentPath,
    contentLoading,
    contentError,
  } = useFileBrowse();

  if (!selectedPath) {
    return (
      <div className="main-view__empty">
        <p className="main-view__empty-title">No file selected</p>
        <p className="main-view__empty-hint">
          Choose a markdown file in the sidebar to view it from GitHub.
        </p>
      </div>
    );
  }

  if (contentLoading) {
    return (
      <div className="main-view__state">
        <p className="caption">Loading <code className="inline-code">{selectedPath}</code>…</p>
      </div>
    );
  }

  if (contentError) {
    return (
      <div className="main-view__state main-view__state--error">
        <p className="lead">Could not load file</p>
        <p className="caption">
          <code className="inline-code">{contentPath ?? selectedPath}</code>
        </p>
        <p className="main-view__error-detail">{contentError}</p>
      </div>
    );
  }

  return (
    <article className="markdown-body">
      <Markdown>{fileContent ?? ""}</Markdown>
    </article>
  );
}
