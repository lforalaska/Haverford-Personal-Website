interface EssayContentProps {
  htmlContent: string;
}

export function EssayContent({ htmlContent }: EssayContentProps) {
  return (
    <article
      className="prose prose-lg prose-gray mx-auto max-w-none"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
