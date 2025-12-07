/**
 * Knuffelboek API Client
 *
 * Endpoints gebaseerd op de backend specificaties:
 * - POST /api/analyze-toy - Knuffel analyseren (Gemini)
 * - POST /api/books/create - Boek genereren (verhaal + illustraties)
 * - GET /api/books - Lijst met boeken van gebruiker
 * - GET /api/books/{id} - Boek details
 * - GET /api/books/{id}/pdf - PDF downloaden
 * - POST /api/books/{id}/quote - Prijs offerte (Peecho)
 * - POST /api/books/{id}/order - Bestelling aanmaken
 * - GET /api/orders/{id}/status - Order status
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Types
export interface ToyAnalysis {
  toyType: string;
  toyName: string;
  colors: string[];
  features: string[];
  suggestedName: string;
  confidence: number;
}

export interface BookPage {
  pageNumber: number;
  text: string;
  illustrationUrl?: string;
}

export interface Book {
  id: string;
  title: string;
  childName: string;
  childAge: number;
  toyName: string;
  toyType: string;
  theme: string;
  status: 'generating' | 'ready' | 'ordered' | 'shipped' | 'delivered';
  pages: BookPage[];
  coverImageUrl?: string;
  pdfUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookRequest {
  toyImage: string; // base64 encoded
  childName: string;
  childAge: number;
  toyName: string;
  theme: string;
  siblings?: { name: string; age: number }[];
  petName?: string;
  parent1Name?: string;
  parent2Name?: string;
}

export interface Quote {
  bookId: string;
  softcoverPrice: number;
  hardcoverPrice: number;
  shippingCost: number;
  currency: string;
  validUntil: string;
}

export interface Order {
  id: string;
  bookId: string;
  status: 'pending' | 'paid' | 'production' | 'shipped' | 'delivered';
  trackingNumber?: string;
  trackingUrl?: string;
  totalAmount: number;
  createdAt: string;
}

export interface ApiError {
  message: string;
  code?: string;
}

// Helper function for API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Add auth token if available
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      (defaultHeaders as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({
      message: 'Er is een fout opgetreden',
    }));
    throw new Error(error.message);
  }

  return response.json();
}

// ============================================
// Knuffel Analyse API
// ============================================

/**
 * Analyseer een knuffelfoto met Gemini AI
 */
export async function analyzeToy(imageBase64: string): Promise<ToyAnalysis> {
  return apiCall<ToyAnalysis>('/analyze-toy', {
    method: 'POST',
    body: JSON.stringify({ image: imageBase64 }),
  });
}

// ============================================
// Books API
// ============================================

/**
 * Maak een nieuw boek aan (genereert verhaal + illustraties)
 */
export async function createBook(data: CreateBookRequest): Promise<Book> {
  return apiCall<Book>('/books/create', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Haal alle boeken van de ingelogde gebruiker op
 */
export async function getBooks(): Promise<Book[]> {
  return apiCall<Book[]>('/books');
}

/**
 * Haal een specifiek boek op
 */
export async function getBook(bookId: string): Promise<Book> {
  return apiCall<Book>(`/books/${bookId}`);
}

/**
 * Haal de boek status op (voor polling tijdens generatie)
 */
export async function getBookStatus(bookId: string): Promise<{ status: Book['status']; progress?: number }> {
  return apiCall<{ status: Book['status']; progress?: number }>(`/books/${bookId}/status`);
}

/**
 * Download PDF URL ophalen
 */
export async function getBookPdfUrl(bookId: string): Promise<{ url: string }> {
  return apiCall<{ url: string }>(`/books/${bookId}/pdf`);
}

/**
 * Download PDF direct
 */
export async function downloadBookPdf(bookId: string): Promise<Blob> {
  const url = `${API_BASE_URL}/books/${bookId}/pdf/download`;

  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error('Kon PDF niet downloaden');
  }

  return response.blob();
}

// ============================================
// Orders / Peecho API
// ============================================

/**
 * Vraag een prijs offerte op voor een boek
 */
export async function getQuote(bookId: string): Promise<Quote> {
  return apiCall<Quote>(`/books/${bookId}/quote`, {
    method: 'POST',
  });
}

/**
 * Maak een bestelling aan
 */
export async function createOrder(
  bookId: string,
  options: {
    coverType: 'softcover' | 'hardcover';
    quantity: number;
    shippingAddress: {
      name: string;
      street: string;
      city: string;
      postalCode: string;
      country: string;
    };
    email: string;
  }
): Promise<Order> {
  return apiCall<Order>(`/books/${bookId}/order`, {
    method: 'POST',
    body: JSON.stringify(options),
  });
}

/**
 * Haal order status op
 */
export async function getOrderStatus(orderId: string): Promise<Order> {
  return apiCall<Order>(`/orders/${orderId}/status`);
}

/**
 * Haal alle orders van de gebruiker op
 */
export async function getOrders(): Promise<Order[]> {
  return apiCall<Order[]>('/orders');
}

// ============================================
// Auth helpers (simpele implementatie)
// ============================================

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('auth_token');
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

export function setAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
  }
}

export function clearAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
  }
}
