"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  FileDown,
  Hammer,
  Loader2,
  Lock,
  MessageCircle,
  Mic,
  Plus,
  RotateCcw,
  Send,
  Sparkles,
  Square,
  Trash2,
  X,
} from "lucide-react";
import { type Session } from "@supabase/supabase-js";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

type AppView =
  | "landing"
  | "auth-login"
  | "auth-register"
  | "dashboard"
  | "recording"
  | "processing"
  | "preview"
  | "paywall";

type Material = {
  id: number;
  name: string;
  price: number;
};

const initialMaterials: Material[] = [
  { id: 1, name: "Nieuwe keukenkraan Grohe", price: 145 },
  { id: 2, name: "Flexibele aansluitslangen en koppelingen", price: 38 },
  { id: 3, name: "Silicone en klein materiaal", price: 17.5 },
];

const currencyFormatter = new Intl.NumberFormat("nl-BE", {
  style: "currency",
  currency: "EUR",
});

function formatCurrency(value: number) {
  return currencyFormatter.format(Number.isFinite(value) ? value : 0);
}

function toNumber(value: string) {
  return Number.parseFloat(value.replace(",", ".")) || 0;
}

export default function Home() {
  const [currentView, setCurrentView] = useState<AppView>("landing");
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(!isSupabaseConfigured);
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [authError, setAuthError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [customerName, setCustomerName] = useState("Jan Peeters");
  const [customerAddress, setCustomerAddress] = useState(
    "Kerkstraat 14, 2800 Mechelen",
  );
  const [jobDescription, setJobDescription] = useState(
    "Vervangen van lekkende keukenkraan, inclusief afkoppelen oude kraan, plaatsen nieuwe kraan en testen op lekken.",
  );
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  const [hours, setHours] = useState(3);
  const [hourlyRate, setHourlyRate] = useState(58);

  const totals = useMemo(() => {
    const materialTotal = materials.reduce((sum, item) => sum + item.price, 0);
    const laborTotal = hours * hourlyRate;
    const subtotal = materialTotal + laborTotal;
    const vat = subtotal * 0.21;

    return {
      materialTotal,
      laborTotal,
      subtotal,
      vat,
      total: subtotal + vat,
    };
  }, [materials, hours, hourlyRate]);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) {
        return;
      }

      setSession(data.session);
      if (data.session) {
        setEmail(data.session.user.email ?? "");
        setCurrentView("dashboard");
      }
      setIsAuthReady(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setEmail(nextSession?.user.email ?? "");

      if (nextSession) {
        setCurrentView((view) =>
          view === "landing" || view === "auth-login" || view === "auth-register"
            ? "dashboard"
            : view,
        );
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function submitAuth(mode: "login" | "register") {
    setAuthError("");
    setAuthMessage("");

    if (!supabase) {
      setAuthError(
        "Supabase is nog niet gekoppeld. Zet eerst je NEXT_PUBLIC_SUPABASE_URL en NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
      );
      return;
    }

    if (!email || !password) {
      setAuthError("Vul je e-mail en wachtwoord in.");
      return;
    }

    setIsSubmittingAuth(true);

    try {
      if (mode === "register") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) {
          setAuthError(error.message);
          return;
        }

        if (data.session) {
          setSession(data.session);
          setCurrentView("dashboard");
          return;
        }

        setAuthMessage(
          "Account aangemaakt. Check je mailbox om je e-mailadres te bevestigen.",
        );
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setAuthError(error.message);
        return;
      }

      setSession(data.session);
      setCurrentView("dashboard");
    } finally {
      setIsSubmittingAuth(false);
    }
  }

  async function logout() {
    if (supabase) {
      await supabase.auth.signOut();
    }

    setSession(null);
    setPassword("");
    setCurrentView("landing");
  }

  function startRecording() {
    setCurrentView("recording");
  }

  function stopRecording() {
    setCurrentView("processing");

    // Simuleert de AI-verwerking tot de backend eraan komt.
    window.setTimeout(() => {
      setCurrentView("preview");
    }, 1600);
  }

  function updateMaterial(id: number, field: "name" | "price", value: string) {
    setMaterials((currentMaterials) =>
      currentMaterials.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: field === "price" ? toNumber(value) : value,
            }
          : item,
      ),
    );
  }

  function addMaterial() {
    setMaterials((currentMaterials) => [
      ...currentMaterials,
      { id: Date.now(), name: "Extra materiaal", price: 0 },
    ]);
  }

  function removeMaterial(id: number) {
    setMaterials((currentMaterials) =>
      currentMaterials.filter((item) => item.id !== id),
    );
  }

  function resetToDashboard() {
    setCurrentView("dashboard");
  }

  return (
    <main className="min-h-screen bg-[#f6f3ed] text-zinc-900">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <Header
          compact={
            currentView === "preview" ||
            currentView === "paywall" ||
            currentView === "dashboard" ||
            currentView === "recording"
          }
          isLoggedIn={
            Boolean(session) &&
            currentView !== "landing" &&
            currentView !== "auth-login" &&
            currentView !== "auth-register"
          }
          onLogoClick={() => setCurrentView(session ? "dashboard" : "landing")}
          onLogout={logout}
        />

        <AnimatePresence mode="wait">
          {currentView === "landing" && (
            <LandingView
              onRegister={() => setCurrentView("auth-register")}
              onLogin={() => setCurrentView("auth-login")}
            />
          )}

          {(currentView === "auth-login" ||
            currentView === "auth-register") && (
            <AuthView
              mode={currentView === "auth-login" ? "login" : "register"}
              email={email}
              password={password}
              isConfigured={isSupabaseConfigured}
              isAuthReady={isAuthReady}
              isSubmitting={isSubmittingAuth}
              message={authMessage}
              error={authError}
              onEmailChange={setEmail}
              onPasswordChange={setPassword}
              onSubmit={() =>
                submitAuth(currentView === "auth-login" ? "login" : "register")
              }
              onSwitchMode={() => {
                setAuthError("");
                setAuthMessage("");
                setCurrentView(
                  currentView === "auth-login" ? "auth-register" : "auth-login",
                );
              }}
            />
          )}

          {(currentView === "dashboard" || currentView === "recording") && (
            <DashboardView
              isRecording={currentView === "recording"}
              onStart={startRecording}
              onStop={stopRecording}
            />
          )}

          {currentView === "processing" && <ProcessingView />}

          {(currentView === "preview" || currentView === "paywall") && (
            <PreviewView
              customerName={customerName}
              customerAddress={customerAddress}
              jobDescription={jobDescription}
              materials={materials}
              hours={hours}
              hourlyRate={hourlyRate}
              totals={totals}
              onCustomerNameChange={setCustomerName}
              onCustomerAddressChange={setCustomerAddress}
              onJobDescriptionChange={setJobDescription}
              onMaterialChange={updateMaterial}
              onAddMaterial={addMaterial}
              onRemoveMaterial={removeMaterial}
              onHoursChange={setHours}
              onHourlyRateChange={setHourlyRate}
              onReset={resetToDashboard}
              onShowPaywall={() => setCurrentView("paywall")}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {currentView === "paywall" && (
            <PaywallModal onClose={() => setCurrentView("preview")} />
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

function Header({
  compact,
  isLoggedIn,
  onLogoClick,
  onLogout,
}: {
  compact: boolean;
  isLoggedIn: boolean;
  onLogoClick: () => void;
  onLogout: () => void;
}) {
  return (
    <motion.header
      className={`flex items-center justify-between gap-4 ${
        compact ? "mb-5" : "mb-8"
      }`}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <button
        type="button"
        onClick={onLogoClick}
        className="flex min-h-12 items-center gap-3 text-left"
        aria-label="Ga naar Helpse startpagina"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f47b20] text-white shadow-sm">
          <Hammer aria-hidden="true" size={25} strokeWidth={2.5} />
        </span>
        <span>
          <span className="block text-2xl font-black leading-none text-zinc-950">
            Helpse
          </span>
          {!compact && (
            <span className="mt-1 block max-w-[17rem] text-sm font-semibold leading-5 text-zinc-600">
              Jouw offertes in 10 seconden ingesproken en verstuurd.
            </span>
          )}
        </span>
      </button>

      {isLoggedIn ? (
        <button
          type="button"
          onClick={onLogout}
          className="min-h-12 rounded-full border border-zinc-200 bg-white px-4 text-sm font-black text-zinc-700 shadow-sm"
        >
          Uitloggen
        </button>
      ) : (
        <div className="rounded-full border border-zinc-200 bg-white px-3 py-2 text-xs font-bold text-zinc-700 shadow-sm">
          Beta MVP
        </div>
      )}
    </motion.header>
  );
}

function LandingView({
  onRegister,
  onLogin,
}: {
  onRegister: () => void;
  onLogin: () => void;
}) {
  return (
    <motion.section
      key="landing"
      className="pb-10"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid min-h-[calc(100vh-7.5rem)] content-center gap-8 lg:grid-cols-[1fr_0.92fr] lg:items-center">
        <div className="max-w-xl">
          <p className="mb-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-black text-[#c35f14] shadow-sm">
            Voor stielmannen die liever werken dan typen
          </p>
          <h1 className="text-5xl font-black leading-[1.02] text-zinc-950 sm:text-6xl">
            Offertes maken zonder gedoe.
          </h1>
          <p className="mt-5 text-xl font-semibold leading-8 text-zinc-700">
            Spreek in wat je gaat doen. Helpse maakt er een nette offerte van,
            klaar om te versturen.
          </p>

          <div className="mt-7 grid gap-3 sm:max-w-xl sm:grid-cols-2">
            <motion.button
              type="button"
              onClick={onRegister}
              className="flex min-h-16 items-center justify-center gap-3 rounded-2xl bg-[#f47b20] px-5 text-lg font-black text-white shadow-lg shadow-orange-900/10"
              whileTap={{ scale: 0.98 }}
            >
              Maak gratis account aan
              <ArrowRight aria-hidden="true" size={23} />
            </motion.button>
            <motion.button
              type="button"
              onClick={onLogin}
              className="flex min-h-16 items-center justify-center rounded-2xl border border-zinc-200 bg-white px-5 text-lg font-black text-zinc-950 shadow-sm"
              whileTap={{ scale: 0.98 }}
            >
              Inloggen
            </motion.button>
          </div>
        </div>

        <DemoPanel />
      </div>
    </motion.section>
  );
}

function DemoPanel() {
  const steps = [
    {
      title: "Inspreken",
      text: "Vertel wat er moet gebeuren.",
      icon: Mic,
    },
    {
      title: "AI typt",
      text: "Helpse zet alles netjes klaar.",
      icon: Sparkles,
    },
    {
      title: "Versturen",
      text: "PDF of WhatsApp naar je klant.",
      icon: Send,
    },
  ];

  return (
    <div className="rounded-[2rem] border border-zinc-200 bg-[#fffdfa] p-4 shadow-xl shadow-zinc-900/5">
      <div className="rounded-3xl bg-zinc-950 p-4 text-white">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-black text-orange-200">Demo offerte</p>
            <p className="text-xl font-black">Kraan vervangen</p>
          </div>
          <div className="rounded-full bg-[#20a85a] px-3 py-2 text-xs font-black">
            Klaar
          </div>
        </div>
        <div className="space-y-2 rounded-2xl bg-white/10 p-3">
          <DemoLine label="Klant" value="Jan Peeters" />
          <DemoLine label="Materiaal" value="€ 200,50" />
          <DemoLine label="Werkuren" value="3 u" />
          <div className="h-px bg-white/15" />
          <DemoLine label="Totaal incl. BTW" value="€ 453,15" strong />
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <div
              key={step.title}
              className="grid grid-cols-[3rem_1fr] gap-3 rounded-2xl bg-white p-3 shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f6f3ed] text-[#c35f14]">
                <Icon aria-hidden="true" size={22} />
              </div>
              <div>
                <p className="text-base font-black text-zinc-950">
                  {index + 1}. {step.title}
                </p>
                <p className="text-sm font-semibold leading-5 text-zinc-600">
                  {step.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DemoLine({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm font-bold text-zinc-300">{label}</span>
      <span className={`text-right font-black ${strong ? "text-xl" : ""}`}>
        {value}
      </span>
    </div>
  );
}

function AuthView({
  mode,
  email,
  password,
  isConfigured,
  isAuthReady,
  isSubmitting,
  message,
  error,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onSwitchMode,
}: {
  mode: "login" | "register";
  email: string;
  password: string;
  isConfigured: boolean;
  isAuthReady: boolean;
  isSubmitting: boolean;
  message: string;
  error: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
  onSwitchMode: () => void;
}) {
  const isLogin = mode === "login";

  return (
    <motion.section
      key={mode}
      className="flex flex-1 items-center justify-center pb-10"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full max-w-md rounded-[2rem] border border-zinc-200 bg-[#fffdfa] p-5 shadow-xl shadow-zinc-900/5">
        <p className="text-sm font-black uppercase text-[#c35f14]">
          {isLogin ? "Welkom terug" : "Gratis starten"}
        </p>
        <h1 className="mt-2 text-3xl font-black leading-10 text-zinc-950">
          {isLogin ? "Log in op Helpse." : "Maak je account aan."}
        </h1>
        <p className="mt-2 text-base font-semibold leading-6 text-zinc-600">
          {isLogin
            ? "Log in met je echte Helpse-account."
            : "Registreer met e-mail en wachtwoord. Supabase bewaart je login veilig."}
        </p>

        {!isConfigured && (
          <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-bold leading-5 text-orange-900">
            Supabase is nog niet gekoppeld. Zet eerst de publieke env-vars in
            `.env.local`.
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold leading-5 text-red-800">
            {error}
          </div>
        )}

        {message && (
          <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-bold leading-5 text-green-800">
            {message}
          </div>
        )}

        <form
          className="mt-6 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <TextField
            label="E-mail"
            value={email}
            type="email"
            placeholder="jij@bedrijf.be"
            onChange={onEmailChange}
          />
          <TextField
            label="Wachtwoord"
            value={password}
            type="password"
            placeholder="Minstens 8 tekens"
            onChange={onPasswordChange}
          />

          <motion.button
            type="submit"
            disabled={!isConfigured || !isAuthReady || isSubmitting}
            className="flex min-h-16 w-full items-center justify-center gap-3 rounded-2xl bg-[#f47b20] px-5 text-lg font-black text-white shadow-lg shadow-orange-900/10 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-600 disabled:shadow-none"
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? (
              <>
                <Loader2 aria-hidden="true" className="animate-spin" size={23} />
                Even bezig
              </>
            ) : (
              <>
                Ga verder
                <ArrowRight aria-hidden="true" size={23} />
              </>
            )}
          </motion.button>
        </form>

        <button
          type="button"
          onClick={onSwitchMode}
          className="mt-4 min-h-12 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm font-black text-zinc-700"
        >
          {isLogin ? "Nog geen account? Registreer" : "Al een account? Inloggen"}
        </button>
      </div>
    </motion.section>
  );
}

function DashboardView({
  isRecording,
  onStart,
  onStop,
}: {
  isRecording: boolean;
  onStart: () => void;
  onStop: () => void;
}) {
  return (
    <motion.section
      key="dashboard"
      className="flex flex-1 flex-col items-center justify-center pb-10 text-center"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.28 }}
    >
      <div className="mb-8 max-w-md">
        <p className="mb-3 inline-flex rounded-full bg-white px-4 py-2 text-sm font-black text-[#c35f14] shadow-sm">
          Dashboard
        </p>
        <h1 className="text-4xl font-black leading-11 text-zinc-950 sm:text-5xl sm:leading-14">
          Klaar voor een nieuwe offerte?
        </h1>
        <p className="mt-4 text-lg font-semibold leading-7 text-zinc-700">
          Druk op de knop, vertel de klus, en laat Helpse het nette werk doen.
        </p>
      </div>

      <div className="relative mb-7 flex h-64 w-64 items-center justify-center sm:h-72 sm:w-72">
        {isRecording && (
          <>
            <motion.span
              className="absolute h-full w-full rounded-full border-4 border-[#20a85a]"
              animate={{ scale: [1, 1.14, 1], opacity: [0.55, 0, 0.55] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.span
              className="absolute h-[82%] w-[82%] rounded-full border-4 border-[#20a85a]"
              animate={{ scale: [1, 1.12, 1], opacity: [0.45, 0, 0.45] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.25 }}
            />
          </>
        )}

        <motion.button
          type="button"
          onClick={isRecording ? onStop : onStart}
          className={`relative z-10 flex h-52 w-52 flex-col items-center justify-center rounded-full text-white shadow-xl shadow-orange-900/10 transition-colors focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#f47b20] sm:h-60 sm:w-60 ${
            isRecording ? "bg-[#20a85a]" : "bg-[#f47b20]"
          }`}
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02 }}
          aria-label={isRecording ? "Stop opname" : "Neem op"}
        >
          {isRecording ? (
            <Square aria-hidden="true" size={54} fill="currentColor" />
          ) : (
            <Mic aria-hidden="true" size={70} strokeWidth={2.4} />
          )}
          <span className="mt-4 text-2xl font-black">
            {isRecording ? "Stop" : "Neem op"}
          </span>
        </motion.button>
      </div>

      <div className="min-h-16">
        {isRecording ? (
          <motion.button
            type="button"
            onClick={onStop}
            className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-zinc-950 px-7 text-lg font-black text-white shadow-md"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.98 }}
          >
            <Square aria-hidden="true" size={20} fill="currentColor" />
            Stop opname
          </motion.button>
        ) : (
          <p className="rounded-full bg-white px-5 py-3 text-sm font-bold text-zinc-600 shadow-sm">
            Een offerte starten duurt minder lang dan je koffie halen.
          </p>
        )}
      </div>
    </motion.section>
  );
}

function ProcessingView() {
  return (
    <motion.section
      key="processing"
      className="flex flex-1 flex-col items-center justify-center pb-16 text-center"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.28 }}
    >
      <motion.div
        className="mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-white shadow-lg"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 1.1, repeat: Infinity }}
      >
        <Loader2
          aria-hidden="true"
          className="animate-spin text-[#f47b20]"
          size={54}
          strokeWidth={2.4}
        />
      </motion.div>
      <h2 className="max-w-sm text-3xl font-black leading-10 text-zinc-950">
        Even geduld, Helpse typt je offerte uit...
      </h2>
      <p className="mt-4 max-w-xs text-base font-semibold leading-6 text-zinc-600">
        We halen klant, materiaal, uren en totaal netjes uit je opname.
      </p>
    </motion.section>
  );
}

function PreviewView({
  customerName,
  customerAddress,
  jobDescription,
  materials,
  hours,
  hourlyRate,
  totals,
  onCustomerNameChange,
  onCustomerAddressChange,
  onJobDescriptionChange,
  onMaterialChange,
  onAddMaterial,
  onRemoveMaterial,
  onHoursChange,
  onHourlyRateChange,
  onReset,
  onShowPaywall,
}: {
  customerName: string;
  customerAddress: string;
  jobDescription: string;
  materials: Material[];
  hours: number;
  hourlyRate: number;
  totals: {
    materialTotal: number;
    laborTotal: number;
    subtotal: number;
    vat: number;
    total: number;
  };
  onCustomerNameChange: (value: string) => void;
  onCustomerAddressChange: (value: string) => void;
  onJobDescriptionChange: (value: string) => void;
  onMaterialChange: (id: number, field: "name" | "price", value: string) => void;
  onAddMaterial: () => void;
  onRemoveMaterial: (id: number) => void;
  onHoursChange: (value: number) => void;
  onHourlyRateChange: (value: number) => void;
  onReset: () => void;
  onShowPaywall: () => void;
}) {
  return (
    <motion.section
      key="preview"
      className="pb-8"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase text-[#c35f14]">
            Offerte klaar
          </p>
          <h1 className="mt-1 text-3xl font-black leading-10 text-zinc-950">
            Kijk even na.
          </h1>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white px-4 text-sm font-black text-zinc-700 shadow-sm"
        >
          <RotateCcw aria-hidden="true" size={18} />
          Nieuw
        </button>
      </div>

      <form className="space-y-4">
        <Section title="Klant">
          <TextField
            label="Klantnaam"
            value={customerName}
            onChange={onCustomerNameChange}
          />
          <TextField
            label="Adres"
            value={customerAddress}
            onChange={onCustomerAddressChange}
          />
        </Section>

        <Section title="Klus">
          <label className="block">
            <span className="mb-2 block text-sm font-black text-zinc-700">
              Beschrijving klus
            </span>
            <textarea
              value={jobDescription}
              onChange={(event) => onJobDescriptionChange(event.target.value)}
              className="min-h-32 w-full resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-4 text-base font-semibold leading-6 text-zinc-900 shadow-sm outline-none transition focus:border-[#f47b20] focus:ring-4 focus:ring-orange-100"
            />
          </label>
        </Section>

        <Section
          title="Materialen"
          action={
            <button
              type="button"
              onClick={onAddMaterial}
              className="flex min-h-11 items-center justify-center gap-2 rounded-full bg-zinc-950 px-4 text-sm font-black text-white"
            >
              <Plus aria-hidden="true" size={18} />
              Voeg toe
            </button>
          }
        >
          <div className="space-y-3">
            {materials.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm"
              >
                <div className="grid grid-cols-[1fr_6.75rem_2.75rem] gap-2">
                  <input
                    value={item.name}
                    onChange={(event) =>
                      onMaterialChange(item.id, "name", event.target.value)
                    }
                    className="min-h-12 rounded-xl border border-zinc-200 bg-[#fbfaf7] px-3 text-base font-semibold text-zinc-900 outline-none transition focus:border-[#f47b20] focus:ring-4 focus:ring-orange-100"
                    aria-label="Materiaal"
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.price}
                    onChange={(event) =>
                      onMaterialChange(item.id, "price", event.target.value)
                    }
                    className="min-h-12 rounded-xl border border-zinc-200 bg-[#fbfaf7] px-3 text-right text-base font-black text-zinc-900 outline-none transition focus:border-[#f47b20] focus:ring-4 focus:ring-orange-100"
                    aria-label="Prijs materiaal"
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveMaterial(item.id)}
                    className="flex min-h-12 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600"
                    aria-label="Verwijder materiaal"
                  >
                    <Trash2 aria-hidden="true" size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <LineTotal label="Materiaal totaal" value={totals.materialTotal} />
        </Section>

        <Section title="Werkuren">
          <div className="grid grid-cols-2 gap-3">
            <NumberField
              label="Aantal uren"
              value={hours}
              onChange={onHoursChange}
            />
            <NumberField
              label="Uurtarief"
              value={hourlyRate}
              onChange={onHourlyRateChange}
            />
          </div>
          <LineTotal label="Werkuren totaal" value={totals.laborTotal} />
        </Section>

        <section className="rounded-3xl bg-zinc-950 p-5 text-white shadow-xl shadow-zinc-900/10">
          <h2 className="mb-4 text-xl font-black">Totaalbedrag</h2>
          <div className="space-y-3">
            <SummaryRow label="Excl. 21% BTW" value={totals.subtotal} />
            <SummaryRow label="BTW 21%" value={totals.vat} subtle />
            <div className="h-px bg-white/20" />
            <SummaryRow label="Incl. 21% BTW" value={totals.total} large />
          </div>
        </section>

        <div className="sticky bottom-0 -mx-4 bg-[#f6f3ed]/95 px-4 pb-4 pt-3 backdrop-blur sm:static sm:mx-0 sm:bg-transparent sm:px-0 sm:pb-0 sm:pt-1">
          <div className="grid gap-3 sm:grid-cols-2">
            <motion.button
              type="button"
              onClick={onShowPaywall}
              className="flex min-h-16 items-center justify-center gap-3 rounded-2xl bg-zinc-950 px-5 text-lg font-black text-white shadow-lg"
              whileTap={{ scale: 0.98 }}
            >
              <FileDown aria-hidden="true" size={24} />
              Sla op als PDF
            </motion.button>
            <motion.button
              type="button"
              onClick={onShowPaywall}
              className="flex min-h-16 items-center justify-center gap-3 rounded-2xl bg-[#20a85a] px-5 text-lg font-black text-white shadow-lg shadow-green-900/10"
              whileTap={{ scale: 0.98 }}
            >
              <MessageCircle aria-hidden="true" size={25} />
              Stuur via WhatsApp
            </motion.button>
          </div>
        </div>
      </form>
    </motion.section>
  );
}

function PaywallModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-950/55 px-4 pb-4 backdrop-blur-sm sm:items-center sm:pb-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="paywall-title"
    >
      <motion.div
        className="w-full max-w-md rounded-[2rem] bg-[#fffdfa] p-5 shadow-2xl"
        initial={{ opacity: 0, y: 28, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 28, scale: 0.98 }}
        transition={{ duration: 0.22 }}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f47b20] text-white">
            <Lock aria-hidden="true" size={26} />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-12 min-w-12 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700"
            aria-label="Sluit betaalmuur"
          >
            <X aria-hidden="true" size={22} />
          </button>
        </div>

        <p className="text-sm font-black uppercase text-[#c35f14]">
          Helpse Pro
        </p>
        <h2
          id="paywall-title"
          className="mt-2 text-3xl font-black leading-10 text-zinc-950"
        >
          Klaar om deze offerte te versturen?
        </h2>
        <p className="mt-3 text-lg font-semibold leading-7 text-zinc-700">
          Upgrade naar Helpse Pro en verstuur onbeperkt offertes naar je
          klanten.
        </p>

        <div className="mt-5 rounded-3xl bg-zinc-950 p-5 text-white">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-black text-orange-200">Onbeperkt</p>
              <p className="text-lg font-black">Helpse Pro</p>
            </div>
            <p className="text-4xl font-black">
              €19
              <span className="text-base font-black text-zinc-300">/maand</span>
            </p>
          </div>
          <div className="mt-4 space-y-2">
            <PlanFeature>Onbeperkt offertes maken</PlanFeature>
            <PlanFeature>PDF export</PlanFeature>
            <PlanFeature>WhatsApp versturen</PlanFeature>
          </div>
        </div>

        <motion.button
          type="button"
          onClick={() => alert("Redirect naar Stripe/Bancontact")}
          className="mt-5 flex min-h-16 w-full items-center justify-center gap-3 rounded-2xl bg-[#20a85a] px-5 text-lg font-black text-white shadow-lg shadow-green-900/10"
          whileTap={{ scale: 0.98 }}
        >
          Start mijn abonnement
          <ArrowRight aria-hidden="true" size={23} />
        </motion.button>
        <button
          type="button"
          onClick={onClose}
          className="mt-3 min-h-12 w-full rounded-2xl bg-transparent px-4 text-sm font-black text-zinc-600"
        >
          Nog even aanpassen
        </button>
      </motion.div>
    </motion.div>
  );
}

function PlanFeature({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm font-bold text-zinc-200">
      <Check aria-hidden="true" className="text-[#20a85a]" size={18} />
      {children}
    </div>
  );
}

function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-zinc-200 bg-[#fffdfa] p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-black text-zinc-950">{title}</h2>
        {action}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function TextField({
  label,
  value,
  type = "text",
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  type?: "text" | "email" | "password";
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-zinc-700">
        {label}
      </span>
      <input
        value={value}
        type={type}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-14 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-base font-semibold text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-[#f47b20] focus:ring-4 focus:ring-orange-100"
      />
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-zinc-700">
        {label}
      </span>
      <input
        type="number"
        min="0"
        step="0.01"
        value={value}
        onChange={(event) => onChange(toNumber(event.target.value))}
        className="min-h-14 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-base font-black text-zinc-900 outline-none transition focus:border-[#f47b20] focus:ring-4 focus:ring-orange-100"
      />
    </label>
  );
}

function LineTotal({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-[#f6f3ed] px-4 py-3">
      <span className="text-sm font-black text-zinc-600">{label}</span>
      <span className="text-lg font-black text-zinc-950">
        {formatCurrency(value)}
      </span>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  subtle = false,
  large = false,
}: {
  label: string;
  value: number;
  subtle?: boolean;
  large?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span
        className={`font-black ${large ? "text-lg" : "text-base"} ${
          subtle ? "text-zinc-300" : "text-white"
        }`}
      >
        {label}
      </span>
      <span className={`font-black ${large ? "text-3xl" : "text-xl"}`}>
        {formatCurrency(value)}
      </span>
    </div>
  );
}
