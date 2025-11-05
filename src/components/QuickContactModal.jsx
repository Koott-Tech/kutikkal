"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function QuickContactModal({ open, onClose, onSaved }) {
  const { login, token } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setError("");
    if (!firstName || !lastName || !phone) {
      setError("Please fill first name, last name and phone number");
      return;
    }
    try {
      setIsSaving(true);
      const { clientApi, authApi } = await import("@/lib/backendApi");
      await clientApi.updateProfile({
        first_name: firstName,
        last_name: lastName,
        phone_number: phone,
      });
      // Refresh auth context so header/user info updates without hard refresh
      try {
        const refreshed = await authApi.getProfile({ silent: true });
        const userData = refreshed?.data?.user || refreshed?.data;
        if (userData && token) {
          login(userData, token);
        }
      } catch (e) {
        // ignore refresh errors; booking flow can continue
      }
      onSaved?.();
      onClose?.();
    } catch (err) {
      setError(err?.message || "Failed to save details. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 px-4" onClick={(e)=>{ if (e.target === e.currentTarget) onClose?.(); }}>
      <div className={`w-full max-w-[420px] rounded-xl bg-white shadow-xl transition-all duration-500 ease-out opacity-100 translate-y-0`}>
        <div className="relative p-4">
          <h6 className="text-center text-gray-900 text-base md:text-lg font-semibold">Add your details</h6>
          <button aria-label="Close" onClick={onClose} className="absolute right-4 top-4 text-gray-500 hover:text-gray-700">✕</button>
        </div>
        {error && <div className="mx-4 mt-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <input value={firstName} onChange={(e)=>setFirstName(e.target.value)} placeholder="First name" className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#3f2e73]" />
          <input value={lastName} onChange={(e)=>setLastName(e.target.value)} placeholder="Last name" className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#3f2e73]" />
          <input value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="Phone number" className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#3f2e73]" />
          <button type="submit" disabled={isSaving} className="w-full rounded-md bg-[#3f2e73] px-3 py-2 text-sm font-semibold text-white disabled:opacity-60">{isSaving ? 'Saving…' : 'Save & Continue'}</button>
        </form>
      </div>
    </div>
  );
}


