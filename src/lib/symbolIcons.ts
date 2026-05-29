/**
 * Map symbol kinds to Lucide React icons.
 */

import {
  Code2,
  Package,
  Zap,
  Database,
  Layers,
  GitBranch,
  Link2,
  Component,
  FileText,
  BarChart3,
  FileJson,
  LucideIcon,
} from "lucide-react";

export function getSymbolIcon(kind: string): LucideIcon {
  switch (kind.toLowerCase()) {
    case "function":
    case "method":
      return Code2;
    case "class":
      return Component;
    case "interface":
      return Layers;
    case "variable":
      return GitBranch;
    case "constant":
      return Zap;
    case "module":
    case "package":
      return Package;
    case "import":
      return Link2;
    case "enum":
      return BarChart3;
    case "namespace":
      return Layers;
    case "typedef":
      return FileJson;
    default:
      return FileText;
  }
}
