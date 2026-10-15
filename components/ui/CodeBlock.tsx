"use client";

import { useMemo, useState } from "react";
import { Check, Copy, TerminalSquare } from "@/components/ui/icons";

type TokenKind =
  | "comment"
  | "string"
  | "number"
  | "keyword"
  | "fn"
  | "type"
  | "plain";

interface Token {
  kind: TokenKind;
  text: string;
}

const KEYWORDS: Record<string, string[]> = {
  shell: [
    "cd","ls","mkdir","git","npm","node","curl","echo","export","source","sudo","apt",
    "brew","run","cargo","chmod","cp","mv","rm","cd","then","fi","if","for","do","done",
    "cargo","tar","wget","npm","npx","pnpm","yarn","git","sudo","docker","flatpak","snap",
    "winget","scoop","choco","install","pull","init","add","commit","push","status",
  ],
  powershell: [
    "npm","node","git","cargo","powershell","Get-ChildItem","New-Item","Set-Location",
    "cd","ls","Copy-Item","if","else","param","function","return","Start-Process",
  ],
  rust: [
    "use","fn","let","mut","pub","struct","enum","impl","match","if","else","for","in",
    "while","return","await","async","move","ref","mod","type","const","static","where",
    "Self","self","crate","as","loop","break","continue","dyn","unsafe",
  ],
  typescript: [
    "import","from","export","default","const","let","var","function","return","async",
    "await","if","else","for","while","new","class","extends","interface","type","enum",
    "implements","try","catch","finally","throw","typeof","instanceof","as","of","in",
    "public","private","readonly","static","void","null","undefined","true","false","this",
    "string","number","boolean","any",
  ],
  json: ["true", "false", "null"],
};

function commentPattern(lang: string): string {
  switch (lang) {
    case "shell":
    case "powershell":
      return "#[^\\n]*";
    case "rust":
    case "typescript":
      return "//[^\\n]*";
    default:
      return "(?!)";
  }
}

function buildRegex(lang: string): RegExp | null {
  const kws = KEYWORDS[lang];
  if (!kws) return null;
  const comment = commentPattern(lang);
  const alt = kws.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const source = [
    `(?<comment>${comment})`,
    `(?<string>"(?:\\\\.|[^"\\\\])*"|'(?:\\\\.|[^'\\\\])*'|\`(?:\\\\[\\s\\S]|[^\\\`])*\`)`,
    `(?<number>\\b\\d+(?:\\.\\d+)?\\b)`,
    `(?<keyword>\\b(?:${alt})\\b)`,
    `(?<fn>\\b[a-zA-Z_][\\w]*(?=\\())`,
    `(?<type>\\b[A-Z][A-Za-z0-9_]*)`,
  ].join("|");
  return new RegExp(source, "g");
}

function tokenize(code: string, lang: string): Token[] {
  const re = buildRegex(lang);
  if (!re) return [{ kind: "plain", text: code }];

  const tokens: Token[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  re.lastIndex = 0;

  while ((match = re.exec(code)) !== null) {
    if (match.index > last) {
      tokens.push({ kind: "plain", text: code.slice(last, match.index) });
    }
    const groups = match.groups ?? {};
    const kind = (Object.keys(groups).find((k) => groups[k] !== undefined) ?? "plain") as TokenKind;
    tokens.push({ kind, text: match[0] });
    last = match.index + match[0].length;
    if (match[0].length === 0) re.lastIndex++;
  }
  if (last < code.length) tokens.push({ kind: "plain", text: code.slice(last) });

  return tokens;
}

const tokenColor: Record<TokenKind, string> = {
  comment: "var(--muted-foreground)",
  string: "var(--tip)",
  number: "var(--warning)",
  keyword: "var(--primary)",
  fn: "var(--note)",
  type: "var(--accent)",
  plain: "inherit",
};

function Highlighted({ code, lang }: { code: string; lang: string }) {
  const tokens = useMemo(() => tokenize(code, lang), [code, lang]);
  return (
    <>
      {tokens.map((t, i) =>
        t.kind === "plain" ? (
          <span key={i}>{t.text}</span>
        ) : (
          <span
            key={i}
            style={{ color: tokenColor[t.kind], fontStyle: t.kind === "comment" ? "italic" : undefined }}
          >
            {t.text}
          </span>
        )
      )}
    </>
  );
}

export function CodeBlock({
  code,
  lang = "shell",
  filename,
  showLang = true,
}: {
  code: string;
  lang?: string;
  filename?: string;
  showLang?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="group/code my-5 overflow-hidden rounded-xl border border-code-border bg-code">
      <div className="flex items-center justify-between border-b border-code-border bg-[color-mix(in_srgb,var(--muted)_60%,transparent)] px-3.5 py-2">
        <div className="flex items-center gap-2 font-mono text-[0.72rem] uppercase tracking-wider text-muted-foreground">
          <TerminalSquare size={13} className="text-primary" />
          {showLang && <span>{lang}</span>}
          {filename && (
            <span className="rounded bg-[color-mix(in_srgb,var(--border)_70%,transparent)] px-1.5 py-0.5 text-[0.7rem] normal-case tracking-normal text-muted-foreground">
              {filename}
            </span>
          )}
        </div>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-[0.72rem] font-medium text-muted-foreground transition-all hover:border-border hover:bg-[color-mix(in_srgb,var(--background)_70%,transparent)] hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
        >
          {copied ? (
            <>
              <Check size={13} className="text-tip" />
              <span className="text-tip">Copied</span>
            </>
          ) : (
            <>
              <Copy size={13} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-3.5 font-mono text-[0.84rem] leading-[1.7]">
        <code>
          <Highlighted code={code} lang={lang} />
        </code>
      </pre>
    </div>
  );
}
