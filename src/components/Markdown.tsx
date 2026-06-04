import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

interface MarkdownProps {
  children: string;
  className?: string;
  inline?: boolean;
}

export function Markdown({ children, className, inline }: MarkdownProps) {
  return (
    <ReactMarkdown
      components={{
        p: ({ node, ...props }) =>
          inline ? (
            <span {...props} className={cn(className)} />
          ) : (
            <p {...props} className={cn(className)} />
          ),
        a: ({ node, ...props }) => (
          <a
            {...props}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline-offset-4 hover:underline"
          />
        ),
        strong: ({ node, ...props }) => (
          <strong {...props} className="font-bold text-foreground" />
        ),
        em: ({ node, ...props }) => <em {...props} className="italic" />,
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
