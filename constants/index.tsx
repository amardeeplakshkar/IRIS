import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeBlock, CodeBlockGroup, CodeBlockCode } from "@/components/ui/code-block";
import { TableHeader, TableBody, TableRow, TableHead, TableCell, Table } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Copy } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { generateText, UIMessage } from "ai";
import { myProvider } from "@/lib/ai/providers";
import { MessageMermaid } from "@/components/widgets/MermaidDisplay";
import { copyToClipboard } from "@/lib/utils";

export const components = {
  code: ({ node, inline, className, children, ...props }: any) => {
    const { theme } = useTheme();
    const match = /language-(\w+)/.exec(className || "") || "";
    const codeContent = String(children).replace(/\n$/, "");
    let contentToShow;
    switch (match[1]) {
      case "mermaid":
        contentToShow = <div className="text-sm w-full overflow-x-auto dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-700 rounded-xl dark:text-zinc-50 text-zinc-900 flex items-center justify-center">
            <MessageMermaid source={codeContent} theme={"light"} />
        </div>
        break;
      default:
        contentToShow = (
          <>
            <CodeBlock>
              <CodeBlockGroup className="border-border border-b px-4 py-2">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 text-primary rounded px-2 py-1 text-xs font-medium">
                    {match![1]}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={() => copyToClipboard(codeContent)}
                >
                  <Copy className="size-4" />
                </Button>
              </CodeBlockGroup>
              <CodeBlockCode
                code={codeContent}
                language={match![1] || "text"}
                theme={theme === "dark" ? "dracula" : "github-light"}
              />
            </CodeBlock>
          </>
        );

        break;
    }
    return !inline && match ? (
      <>{contentToShow}</>
    ) : (
      <Badge className="whitespace-pre-wrap" {...props}>
        {children}
      </Badge>
    );
  },
  pre: ({ children }: any) => <>{children}</>,
  ol: ({ node, children, ...props }: any) => {
    return (
      <ol className="list-decimal list-outside ml-4" {...props}>
        {children}
      </ol>
    );
  },
  li: ({ node, children, ...props }: any) => {
    return (
      <li className="py-1" {...props}>
        {children}
      </li>
    );
  },
  ul: ({ node, children, ...props }: any) => {
    return (
      <ul className="list-decimal list-outside ml-4" {...props}>
        {children}
      </ul>
    );
  },
  strong: ({ node, children, ...props }: any) => {
    return (
      <span className="font-semibold" {...props}>
        {children}
      </span>
    );
  },
  a: ({ node, children, ...props }: any) => {
    return (
      <Link
        className="text-blue-500 hover:underline"
        target="_blank"
        {...props}
      >
        {children}
      </Link>
    );
  },
  h1: ({ node, children, ...props }: any) => {
    return (
      <h1 className="text-3xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h1>
    );
  },
  h2: ({ node, children, ...props }: any) => {
    return (
      <h2 className="text-2xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h2>
    );
  },
  h3: ({ node, children, ...props }: any) => {
    return (
      <h3 className="text-xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h3>
    );
  },
  h4: ({ node, children, ...props }: any) => {
    return (
      <h4 className="text-lg font-semibold mt-6 mb-2" {...props}>
        {children}
      </h4>
    );
  },
  h5: ({ node, children, ...props }: any) => {
    return (
      <h5 className="text-base font-semibold mt-6 mb-2" {...props}>
        {children}
      </h5>
    );
  },
  h6: ({ node, children, ...props }: any) => {
    return (
      <h6 className="text-sm font-semibold mt-6 mb-2" {...props}>
        {children}
      </h6>
    );
  },
  table({ node, className, children, ...props }: any) {
    return (
      <div className="my-4 w-full overflow-x-auto">
        <Table className="rounded overflow-hidden" {...props}>
          {children}
        </Table>
      </div>
    );
  },
  thead({ node, ...props }: any) {
    return <TableHeader {...props} />;
  },
  tbody({ node, ...props }: any) {
    return <TableBody {...props} />;
  },
  tr({ node, ...props }: any) {
    return <TableRow {...props} />;
  },
  th({ node, ...props }: any) {
    return <TableHead className="" {...props} />;
  },
  td({ node, ...props }: any) {
    return <TableCell className="" {...props} />;
  },
  blockquote({ node, ...props }: any) {
    return (
      <blockquote
        className="border-l-4 pl-4 italic text-muted-foreground"
        {...props}
      />
    );
  },

  hr({ node, ...props }: any) {
    return <Separator className="my-6" {...props} />;
  },

  em({ node, ...props }: any) {
    return <em className="italic" {...props} />;
  },

  del({ node, ...props }: any) {
    return <del className="line-through text-muted-foreground" {...props} />;
  },
};

export async function generateTitleFromUserMessage({
  message,
}: {
  message: UIMessage;
}) {
  const { text: title } = await generateText({
    model: myProvider.languageModel('title-model'),
    system: `\n
        - you will generate a short title based on the first message a user begins a conversation with
        - ensure it is not more than 80 characters long
        - the title should be a summary of the user's message
        - do not use quotes or colons`,
    prompt: JSON.stringify(message),
  });

  return title;
}