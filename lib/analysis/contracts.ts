export type SemanticChange = {
  commit: string;
  signals: {
    locDelta: number;
    exportDelta: number;
    functionDelta: number;
    dependencyDelta: number;
  };
  predictedLabel: "major" | "minor";
};
