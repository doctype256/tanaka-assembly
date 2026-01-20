// app/admin/contacts/useAdminContacts.ts
"use client";

import { useState, useEffect, useCallback } from 'react';

export interface Contact {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export function useAdminContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/contacts');
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setContacts(data);
      } else {
        setContacts([]);
      }
    } catch (error) {
      console.error("通信エラー:", error);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  return {
    contacts,
    loading,
    refresh: fetchContacts
  };
}