"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const [message, setMessage] = useState("We bevestigen je e-mailadres...");

  useEffect(() => {
    async function finishAuth() {
      if (!supabase) {
        setMessage("Supabase is nog niet gekoppeld.");
        return;
      }

      const code = new URLSearchParams(window.location.search).get("code");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          setMessage(error.message);
          return;
        }
      }

      const { error } = await supabase.auth.getSession();

      if (error) {
        setMessage(error.message);
        return;
      }

      window.location.replace("/");
    }

    finishAuth();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f3ed] px-4 text-zinc-900">
      <div className="w-full max-w-sm rounded-[2rem] border border-zinc-200 bg-[#fffdfa] p-6 text-center shadow-xl shadow-zinc-900/5">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f47b20] text-white">
          <Loader2 aria-hidden="true" className="animate-spin" size={32} />
        </div>
        <h1 className="text-2xl font-black text-zinc-950">Bijna klaar</h1>
        <p className="mt-3 text-base font-semibold leading-6 text-zinc-600">
          {message}
        </p>
      </div>
    </main>
  );
}
