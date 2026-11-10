import React, { useMemo, useEffect, useRef } from "react";
import { marked } from "marked";
import katex from "katex";
import markedKatex from "marked-katex-extension";

// Configure marked with KaTeX extension once
marked.setOptions({
  breaks: true,
  gfm: true
});
marked.use(markedKatex({
  throwOnError: false,
  nonStandard: true
}));

export default function MarkdownMath({ content }) {
  const containerRef = useRef(null);

  const rawHtml = useMemo(() => {
    if (!content) return "";
    return marked.parse(content);
  }, [content]);

  useEffect(() => {
    // Also run renderMathInElement if available on window for delimiters like \( ... \)
    if (window.renderMathInElement && containerRef.current) {
      try {
        window.renderMathInElement(containerRef.current, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\(', right: '\\)', display: false },
            { left: '\\[', right: '\\]', display: true }
          ],
          throwOnError: false
        });
      } catch (_) {}
    }
  }, [rawHtml]);

  return (
    <div
      ref={containerRef}
      className="chat-prose text-xs sm:text-sm text-slate-200 leading-relaxed overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: rawHtml }}
    />
  );
}

