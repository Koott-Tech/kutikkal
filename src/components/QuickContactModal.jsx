"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function QuickContactModal({ open, onClose, onSaved }) {
  const { login, token, user } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    const profile = user?.profile || user || {};
    if (profile.first_name) setFirstName(profile.first_name);
    if (profile.last_name) setLastName(profile.last_name);

    if (profile.phone_number) {
      const raw = String(profile.phone_number).trim();
      const digitsOnly = raw.replace(/[^\d+]/g, "");

      let extractedCode = "+91";
      let numberOnly = digitsOnly;

      if (digitsOnly.startsWith("+")) {
        const match = digitsOnly.match(/^\+\d{1,4}/);
        if (match) {
          extractedCode = match[0];
          numberOnly = digitsOnly.slice(match[0].length);
        }
      } else if (digitsOnly.length > 10) {
        const match = digitsOnly.match(/^(\d{1,4})/);
        if (match) {
          extractedCode = `+${match[1]}`;
          numberOnly = digitsOnly.slice(match[1].length);
        }
      }

      setCountryCode(extractedCode);
      setPhone(numberOnly.replace(/\D/g, ""));
    }
  }, [open, user]);

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
      const sanitizedPhone = phone.replace(/\D/g, "");
      const fullPhone = `${countryCode}${sanitizedPhone}`;
      await clientApi.updateProfile({
        first_name: firstName,
        last_name: lastName,
        phone_number: fullPhone,
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
          <input
            value={firstName}
            onChange={(e)=>setFirstName(e.target.value)}
            placeholder="First name"
            className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#3f2e73]"
          />
          <input
            value={lastName}
            onChange={(e)=>setLastName(e.target.value)}
            placeholder="Last name"
            className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#3f2e73]"
          />
          <div className="flex gap-2">
            <select
              value={countryCode}
              onChange={(e)=>setCountryCode(e.target.value)}
              className="w-28 rounded-md border border-gray-300 px-3 py-2 bg-gray-50 outline-none focus:ring-2 focus:ring-[#3f2e73]"
            >
              <option value="+91">🇮🇳 +91</option>
              <option value="+1">🇺🇸 +1</option>
              <option value="+44">🇬🇧 +44</option>
              <option value="+33">🇫🇷 +33</option>
              <option value="+49">🇩🇪 +49</option>
              <option value="+61">🇦🇺 +61</option>
              <option value="+65">🇸🇬 +65</option>
              <option value="+81">🇯🇵 +81</option>
              <option value="+971">🇦🇪 +971</option>
              <option value="+966">🇸🇦 +966</option>
            </select>
            <input
              value={phone}
              onChange={(e)=>setPhone(e.target.value.replace(/[^\d]/g, ""))}
              placeholder="Phone number"
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#3f2e73]"
              type="tel"
              inputMode="tel"
            />
          </div>
          <button type="submit" disabled={isSaving} className="w-full rounded-md bg-[#3f2e73] px-3 py-2 text-sm font-semibold text-white disabled:opacity-60">{isSaving ? 'Saving…' : 'Save & Continue'}</button>
        </form>
      </div>
    </div>
  );
}


