import { AnalysisResult, Finding } from "@/types/compliance";

export const MOCK_FINDINGS: Finding[] = [
  {
    id: "finding_1",
    geo: "EU",
    law: "Digital Services Act (DSA)",
    label: "⚠️ Needs Controls",
    severity: "HIGH",
    confidence: 92,
    controls: "Implement age verification, content moderation policies, and transparency reporting",
    reasoning: "User-generated content features require robust content moderation and transparency measures under DSA Article 14-17",
    evidence_snippet: "allows users to upload and share content with minimal restrictions",
    citations: ["DSA Art 14", "DSA Art 15", "Transparency Reporting Requirements"],
    review: "Confirm"
  },
  {
    id: "finding_2", 
    geo: "US-CA",
    law: "California Age-Appropriate Design Code",
    label: "❌ Prohibited",
    severity: "HIGH",
    confidence: 88,
    controls: "Remove data collection from minors, implement privacy-by-design principles",
    reasoning: "Feature collects personal data without explicit AADC compliance measures for users under 18",
    evidence_snippet: "automatically collects user behavior data and preferences",
    citations: ["AADC Section 1798.99.31", "Privacy by Design Requirements"],
    review: "Confirm"
  },
  {
    id: "finding_3",
    geo: "US-UT", 
    law: "Utah Social Media Regulation",
    label: "⚠️ Needs Controls",
    severity: "MED",
    confidence: 76,
    controls: "Age verification system, parental controls, time limits for minors",
    reasoning: "Social features may require parental consent and usage controls for Utah minors",
    evidence_snippet: "social interaction features including messaging and content sharing",
    citations: ["Utah Code 13-60-101", "Parental Consent Requirements"],
    review: "Confirm"
  },
  {
    id: "finding_4",
    geo: "US-FL",
    law: "Florida Social Media for Minors",
    label: "❌ Prohibited",
    severity: "HIGH", 
    confidence: 84,
    controls: "Block access for users under 14, require parental consent for 14-15 year olds",
    reasoning: "Social media features prohibited for users under 14 without specific compliance measures",
    evidence_snippet: "social networking capabilities with user profiles and friend connections",
    citations: ["FL Stat 501.2041", "Age Verification Requirements"],
    review: "Confirm"
  },
  {
    id: "finding_5",
    geo: "US Federal",
    law: "NCMEC Reporting Requirements", 
    label: "✅ Compliant",
    severity: "OK",
    confidence: 95,
    controls: "Maintain existing CSAM detection and reporting systems",
    reasoning: "Current content moderation appears adequate for NCMEC compliance",
    evidence_snippet: "includes automated content scanning and moderation tools",
    citations: ["18 USC 2258A", "NCMEC Reporting Guidelines"],
    review: "Confirm"
  }
];

export const MOCK_ANALYSIS_RESULT: AnalysisResult = {
  feature_id: "feature_12345",
  detected_geos: ["EU", "US-CA", "US-UT", "US-FL", "US Federal"],
  findings: MOCK_FINDINGS,
  summary: {
    HIGH: 3,
    MED: 1, 
    OK: 1
  },
  latency_ms: 2847
};

export const EXAMPLE_PROMPTS = [
  "A social media platform where users can create profiles, post content, and interact with friends through messaging and comments.",
  "An AI-powered recommendation system that analyzes user behavior to suggest personalized content and products.",
  "A video streaming service with user-generated content, live streaming capabilities, and integrated chat features."
];