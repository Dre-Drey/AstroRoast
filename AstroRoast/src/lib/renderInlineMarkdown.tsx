import type { ReactNode } from "react";

import { Text } from "react-native";

export const renderInlineMarkdown = (text?: string | null): ReactNode[] => {
  if (!text) return [];

  const parts: ReactNode[] = [];
  const markdownPattern = /(\*\*[^*]+?\*\*|\*[^*]+?\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  markdownPattern.lastIndex = 0;

  while ((match = markdownPattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    const isBold = token.startsWith("**");
    const content = token.slice(isBold ? 2 : 1, isBold ? -2 : -1);

    parts.push(
      <Text
        key={`${match.index}-${token}`}
        style={isBold ? { fontWeight: "800" } : { fontStyle: "italic" }}
      >
        {content}
      </Text>,
    );

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
};
