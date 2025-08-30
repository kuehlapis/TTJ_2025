export type ComplianceLabel = "✅ Compliant" | "❌ Prohibited" | "⚠️ Needs Controls";

export type Severity = "HIGH" | "MED" | "OK";

export type ReviewStatus = "Confirm" | "Reject" | "Needs follow-up";

export interface Finding {
  id: string;
  geo: string;
  law: string;
  label: ComplianceLabel;
  severity: Severity;
  confidence: number;
  controls: string;
  reasoning: string;
  evidence_snippet: string;
  citations: string[];
  review?: ReviewStatus;
}

export interface AnalysisResult {
  feature_id: string;
  detected_geos: string[];
  findings: Finding[];
  summary: {
    HIGH: number;
    MED: number;
    OK: number;
  };
  latency_ms?: number;
}

export interface AnalysisRequest {
  raw_text: string;
}