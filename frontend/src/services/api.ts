/**
 * API Service Client
 * Handles authenticated communication with the FastAPI backend.
 * Falls back gracefully to local demo storage if backend is unavailable.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || '';

export async function getAuthHeader(): Promise<Record<string, string>> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase.auth.getSession();
    if (data.session?.access_token) {
      return {
        Authorization: `Bearer ${data.session.access_token}`,
      };
    }
  }
  // If in demo mode, send demo token
  return {
    Authorization: 'Bearer demo-token-her-safe-space',
  };
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data: T | null; error: string | null; isDemoFallback?: boolean }> {
  try {
    const authHeaders = await getAuthHeader();
    const url = `${BASE_URL}${endpoint}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...(options.headers || {}),
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errJson = await response.json().catch(() => null);
      const message = errJson?.detail || `Server responded with status ${response.status}`;
      return { data: null, error: message };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err: any) {
    // Network failure or backend not running yet
    return {
      data: null,
      error: err.name === 'AbortError' ? 'Request timed out' : 'Backend connection unavailable',
      isDemoFallback: true,
    };
  }
}
