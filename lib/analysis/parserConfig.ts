export const BABEL_PARSER_CONFIG = {
  sourceType: "module" as const,
  plugins: [
    "typescript",
    "decorators-legacy",
    "classProperties",
    "classPrivateProperties",
    "classPrivateMethods",
    "jsx",
    "dynamicImport",
    "optionalChaining",
    "nullishCoalescingOperator",
    "objectRestSpread",
  ] as const,
};
