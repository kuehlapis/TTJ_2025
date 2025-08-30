import { AnalysisRequest, AnalysisResult } from "@/types/compliance";
import { MOCK_ANALYSIS_RESULT } from "@/data/mockData";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
const API_BASE = "/api";

export async function analyzeFeature(request: AnalysisRequest): Promise<AnalysisResult> {
  if (USE_MOCK) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    return MOCK_ANALYSIS_RESULT;
  }

  try {
    // Call backend /api/analyze?text=...
    const response = await fetch(`${API_BASE}/analyze?text=${encodeURIComponent(request.raw_text)}`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    if (result.status !== "success" || !result.data) {
      throw new Error(result.message || "Analysis failed");
    }
    return result.data;
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
}

export async function exportToCsv(featureId: string): Promise<string> {
  if (USE_MOCK) {
    // Generate CSV client-side
    const headers = ["Geo", "Law", "Label", "Severity", "Confidence", "Controls", "Reasoning", "Evidence", "Citations"];
    const rows = MOCK_ANALYSIS_RESULT.findings.map(finding => [
      finding.geo,
      finding.law,
      finding.label,
      finding.severity,
      `${finding.confidence}%`,
      finding.controls,
      finding.reasoning,
      finding.evidence_snippet,
      finding.citations.join("; ")
    ]);
    
    const csv = [headers, ...rows].map(row => 
      row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(",")
    ).join("\n");
    
    return csv;
  }

  const response = await fetch(`${API_BASE}/export/csv?feature_id=${featureId}`);
  if (!response.ok) {
    throw new Error(`Export failed: ${response.status}`);
  }
  return response.text();
}

export async function exportToJson(featureId: string): Promise<string> {
  if (USE_MOCK) {
    return JSON.stringify(MOCK_ANALYSIS_RESULT, null, 2);
  }

  const response = await fetch(`${API_BASE}/export/json?feature_id=${featureId}`);
  if (!response.ok) {
    throw new Error(`Export failed: ${response.status}`);
  }
  return response.text();
}