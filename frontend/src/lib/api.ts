const BASE_URL = 'http://127.0.0.1:8000';

export interface AnalysisResult {
  status: string;
  data: {
    geolocation: string;
    law: string;
    severity: 'High' | 'Medium' | 'Low';
    reasoning: string;
    potential_violations: string;
    evidence: string;
    recommendations: string;
    legal_references: string;
  };
  message: string;
}

export interface ComplianceResult {
  geo_compliance_flag: boolean;
  reasoning: string;
  severity: 'High' | 'Medium' | 'Low';
  law: string;
  potential_violations: string;
  recommendations: string;
  legal_references: string;
  context: string;
}

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export const api = {
async analyze(featureText: string): Promise<AnalysisResult> {
  try {
    const response = await fetch(`${BASE_URL}/analyze?text=${encodeURIComponent(featureText)}`, {
      method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new ApiError(`HTTP error! status: ${response.status}`, response.status);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to connect to the server. Please ensure the backend is running.');
    }
  },

  async getResult(): Promise<ComplianceResult[]> {
    try {
      const response = await fetch(`${BASE_URL}/result`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new ApiError(`HTTP error! status: ${response.status}`, response.status);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to fetch results from the server.');
    }
  },

  async getSummaryCSV(): Promise<Blob> {
    try {
      const response = await fetch(`${BASE_URL}/summary`, {
        method: 'GET',
        headers: {
          'Accept': 'text/csv',
        },
      });

      if (!response.ok) {
        throw new ApiError(`HTTP error! status: ${response.status}`, response.status);
      }

      return await response.blob();
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to download CSV summary.');
    }
  },
};