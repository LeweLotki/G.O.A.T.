import Markdown from "react-markdown";

const EXAMPLE_MARKDOWN = `# H1

## H2

### H3
`;

export function MainViewPage() {
  return (
    <article className="markdown-body">
      <Markdown>{EXAMPLE_MARKDOWN}</Markdown>
    </article>
  );
}
