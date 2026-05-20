/**
 * DermaStation API Service
 * Handles all communication with the backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const DJANGO_URL = 'http://localhost:8001';

// ── DB types ─────────────────────────────────────────────────────────────────

export interface DBAnalysis {
  id: number;
  user: string;
  image: string | null;       // absolute URL served by Django media
  created_at: string;         // ISO datetime
  skin_type: string;
  skin_type_confidence: number;
  prob_dry: number;
  prob_normal: number;
  prob_oily: number;
  has_acne: boolean;
  has_dark_spots: boolean;
  has_wrinkles: boolean;
  has_redness: boolean;
  has_large_pores: boolean;
  score_acne: number;
  score_dark_spots: number;
  score_wrinkles: number;
  score_redness: number;
  score_large_pores: number;
  detected_issues: string[];
}

export interface BackendAnalysisResponse {
  skin_type: string;
  skin_type_confidence: number;
  type_probs: {
    dry: number;
    normal: number;
    oily: number;
  };
  issues: string[];
  issue_scores: {
    acne: number;
    dark_spots: number;
    wrinkles: number;
    redness: number;
    large_pores: number;
  };
}

export interface AnalysisData {
  skinType: {
    type: string;
    confidence: number;
    probabilities: {
      dry: number;
      normal: number;
      oily: number;
    };
  };
  issues: {
    name: string;
    score: number;
    detected: boolean;
    icon: string;
  }[];
  uploadedImage: string;
}

/**
 * Convert base64 data URL to File object
 */
function dataURLtoFile(dataUrl: string, filename: string): File {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

/**
 * Transform backend response to frontend format
 */
function transformBackendResponse(
  backendData: BackendAnalysisResponse,
  imageDataUrl: string
): AnalysisData {
  // Capitalize first letter
  const capitalize = (str: string) => 
    str.charAt(0).toUpperCase() + str.slice(1);

  // Map issue names to display names
  const issueNameMap: Record<string, string> = {
    acne: 'Acne',
    dark_spots: 'Dark Spots',
    wrinkles: 'Wrinkles',
    redness: 'Redness',
    large_pores: 'Large Pores'
  };

  const issueIconMap: Record<string, string> = {
    acne: 'acne',
    dark_spots: 'spots',
    wrinkles: 'wrinkles',
    redness: 'redness',
    large_pores: 'pores'
  };

  return {
    skinType: {
      type: capitalize(backendData.skin_type),
      confidence: Math.round(backendData.skin_type_confidence * 100),
      probabilities: {
        dry: Math.round(backendData.type_probs.dry * 100),
        normal: Math.round(backendData.type_probs.normal * 100),
        oily: Math.round(backendData.type_probs.oily * 100)
      }
    },
    issues: Object.entries(backendData.issue_scores).map(([key, score]) => ({
      name: issueNameMap[key] || capitalize(key.replace('_', ' ')),
      score: Math.round(score * 100),
      detected: backendData.issues.includes(key),
      icon: issueIconMap[key] || key
    })),
    uploadedImage: imageDataUrl
  };
}

/**
 * Check if backend is available
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) return false;
    
    const data = await response.json();
    return data.status === 'healthy';
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
}

/**
 * Analyze skin image.
 * Returns both the display-ready AnalysisData and the raw backend response
 * (rawBackend) so callers can pass it to saveAnalysisToDB.
 */
export async function analyzeSkin(
  imageDataUrl: string
): Promise<{ data: AnalysisData; rawBackend: BackendAnalysisResponse }> {
  const file = dataURLtoFile(imageDataUrl, 'skin-image.jpg');
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Server error: ${response.status} ${response.statusText}`);
  }

  const rawBackend: BackendAnalysisResponse = await response.json();
  return { data: transformBackendResponse(rawBackend, imageDataUrl), rawBackend };
}

// ── Django DB functions ───────────────────────────────────────────────────────

/**
 * Save a completed analysis (image + results) to the Django database.
 * Sends multipart/form-data so the image file is stored on the server.
 */
export async function saveAnalysisToDB(
  imageDataUrl: string,
  backend: BackendAnalysisResponse,
  accessToken: string
): Promise<DBAnalysis> {
  const formData = new FormData();
  formData.append('image', dataURLtoFile(imageDataUrl, 'skin-analysis.jpg'));
  formData.append('skin_type', backend.skin_type);
  formData.append('skin_type_confidence', String(backend.skin_type_confidence));
  formData.append('prob_dry', String(backend.type_probs.dry));
  formData.append('prob_normal', String(backend.type_probs.normal));
  formData.append('prob_oily', String(backend.type_probs.oily));
  formData.append('has_acne', String(backend.issues.includes('acne')));
  formData.append('has_dark_spots', String(backend.issues.includes('dark_spots')));
  formData.append('has_wrinkles', String(backend.issues.includes('wrinkles')));
  formData.append('has_redness', String(backend.issues.includes('redness')));
  formData.append('has_large_pores', String(backend.issues.includes('large_pores')));
  formData.append('score_acne', String(backend.issue_scores.acne));
  formData.append('score_dark_spots', String(backend.issue_scores.dark_spots));
  formData.append('score_wrinkles', String(backend.issue_scores.wrinkles));
  formData.append('score_redness', String(backend.issue_scores.redness));
  formData.append('score_large_pores', String(backend.issue_scores.large_pores));

  const res = await fetch(`${DJANGO_URL}/api/analyses/`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to save analysis to database.');
  return res.json();
}

/**
 * Save using the frontend AnalysisData format — works for both real AI and mock results.
 * Converts percentages (0-100) back to fractions (0-1) before sending to Django.
 */
export async function saveAnalysisData(
  imageDataUrl: string,
  data: AnalysisData,
  accessToken: string
): Promise<DBAnalysis> {
  const nameToKey: Record<string, string> = {
    Acne: 'acne',
    'Dark Spots': 'dark_spots',
    Wrinkles: 'wrinkles',
    Redness: 'redness',
    'Large Pores': 'large_pores',
  };

  const issueMap: Record<string, { detected: boolean; score: number }> = {};
  data.issues.forEach((issue) => {
    const key = nameToKey[issue.name] ?? issue.icon;
    issueMap[key] = { detected: issue.detected, score: issue.score / 100 };
  });

  const fd = new FormData();
  fd.append('image', dataURLtoFile(imageDataUrl, 'skin-analysis.jpg'));
  fd.append('skin_type', data.skinType.type.toLowerCase());
  fd.append('skin_type_confidence', String(data.skinType.confidence / 100));
  fd.append('prob_dry',    String(data.skinType.probabilities.dry    / 100));
  fd.append('prob_normal', String(data.skinType.probabilities.normal / 100));
  fd.append('prob_oily',   String(data.skinType.probabilities.oily   / 100));
  fd.append('has_acne',        String(issueMap['acne']?.detected       ?? false));
  fd.append('has_dark_spots',  String(issueMap['dark_spots']?.detected ?? false));
  fd.append('has_wrinkles',    String(issueMap['wrinkles']?.detected   ?? false));
  fd.append('has_redness',     String(issueMap['redness']?.detected    ?? false));
  fd.append('has_large_pores', String(issueMap['large_pores']?.detected ?? false));
  fd.append('score_acne',        String(issueMap['acne']?.score        ?? 0));
  fd.append('score_dark_spots',  String(issueMap['dark_spots']?.score  ?? 0));
  fd.append('score_wrinkles',    String(issueMap['wrinkles']?.score    ?? 0));
  fd.append('score_redness',     String(issueMap['redness']?.score     ?? 0));
  fd.append('score_large_pores', String(issueMap['large_pores']?.score ?? 0));

  const res = await fetch(`${DJANGO_URL}/api/analyses/`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: fd,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(JSON.stringify(err));
  }
  return res.json();
}

/** Fetch all saved analyses for the current user. */
export async function fetchAnalysisHistory(accessToken: string): Promise<DBAnalysis[]> {
  const res = await fetch(`${DJANGO_URL}/api/analyses/`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error('Failed to fetch history.');
  const data = await res.json();
  // DRF pagination wraps results in { count, results }
  return Array.isArray(data) ? data : data.results ?? [];
}

/** Delete a saved analysis by ID. */
export async function deleteAnalysis(id: number, accessToken: string): Promise<void> {
  const res = await fetch(`${DJANGO_URL}/api/analyses/${id}/`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error('Failed to delete analysis.');
}

/**
 * Generate mock data for offline/fallback mode
 */
export function generateMockAnalysis(imageDataUrl: string): AnalysisData {
  // Random but consistent mock data
  const skinTypes = ['Dry', 'Normal', 'Oily'];
  const randomType = skinTypes[Math.floor(Math.random() * skinTypes.length)];
  
  return {
    skinType: {
      type: randomType,
      confidence: 85 + Math.floor(Math.random() * 10),
      probabilities: {
        dry: Math.floor(Math.random() * 30),
        normal: Math.floor(Math.random() * 30),
        oily: Math.floor(Math.random() * 30)
      }
    },
    issues: [
      { name: 'Acne', score: Math.floor(Math.random() * 100), detected: Math.random() > 0.5, icon: 'acne' },
      { name: 'Dark Spots', score: Math.floor(Math.random() * 100), detected: Math.random() > 0.5, icon: 'spots' },
      { name: 'Wrinkles', score: Math.floor(Math.random() * 100), detected: Math.random() > 0.5, icon: 'wrinkles' },
      { name: 'Redness', score: Math.floor(Math.random() * 100), detected: Math.random() > 0.5, icon: 'redness' },
      { name: 'Large Pores', score: Math.floor(Math.random() * 100), detected: Math.random() > 0.5, icon: 'pores' }
    ],
    uploadedImage: imageDataUrl
  };
}
