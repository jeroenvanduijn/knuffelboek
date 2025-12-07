'use client';

import { useState, useEffect, useCallback } from 'react';
import * as api from '@/lib/api';
import type { Book, Order } from '@/lib/api';

/**
 * Hook voor het ophalen en beheren van boeken
 */
export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getBooks();
      setBooks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kon boeken niet laden');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (api.isAuthenticated()) {
      fetchBooks();
    } else {
      setIsLoading(false);
    }
  }, [fetchBooks]);

  return {
    books,
    isLoading,
    error,
    refetch: fetchBooks,
  };
}

/**
 * Hook voor een enkel boek
 */
export function useBook(bookId: string | null) {
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBook = useCallback(async () => {
    if (!bookId) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getBook(bookId);
      setBook(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kon boek niet laden');
    } finally {
      setIsLoading(false);
    }
  }, [bookId]);

  useEffect(() => {
    fetchBook();
  }, [fetchBook]);

  return {
    book,
    isLoading,
    error,
    refetch: fetchBook,
  };
}

/**
 * Hook voor boek status polling (tijdens generatie)
 */
export function useBookStatus(bookId: string | null, pollInterval = 3000) {
  const [status, setStatus] = useState<Book['status'] | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    if (!bookId) return;

    let intervalId: NodeJS.Timeout;

    const poll = async () => {
      try {
        const data = await api.getBookStatus(bookId);
        setStatus(data.status);
        setProgress(data.progress || 0);

        // Stop polling als boek klaar is
        if (data.status === 'ready' || data.status === 'ordered') {
          clearInterval(intervalId);
          setIsPolling(false);
        }
      } catch {
        // Blijf proberen bij netwerk fouten
      }
    };

    setIsPolling(true);
    poll(); // Direct eerste call
    intervalId = setInterval(poll, pollInterval);

    return () => {
      clearInterval(intervalId);
      setIsPolling(false);
    };
  }, [bookId, pollInterval]);

  return { status, progress, isPolling };
}

/**
 * Hook voor orders
 */
export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getOrders();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kon orders niet laden');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (api.isAuthenticated()) {
      fetchOrders();
    } else {
      setIsLoading(false);
    }
  }, [fetchOrders]);

  return {
    orders,
    isLoading,
    error,
    refetch: fetchOrders,
  };
}

/**
 * Hook voor authenticatie status
 */
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsAuthenticated(api.isAuthenticated());
    setIsLoading(false);
  }, []);

  const login = useCallback((token: string) => {
    api.setAuthToken(token);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    api.clearAuthToken();
    setIsAuthenticated(false);
  }, []);

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
}
