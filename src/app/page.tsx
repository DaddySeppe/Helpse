"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  FileDown,
  Hammer,
  Loader2,
  MessageCircle,
  Mic,
  Plus,
  RotateCcw,
  Square,
  Trash2,
} from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";

type AppState = "idle" | "recording" | "processing" | "preview";

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
  const [appState, setAppState] = useState<AppState>("idle");
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

  function startRecording() {
    setAppState("recording");
  }

  function stopRecording() {
    setAppState("processing");

    // Simuleert de AI-verwerking tot de backend eraan komt.
    window.setTimeout(() => {
      setAppState("preview");
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

  function resetFlow() {
    setAppState("idle");
  }

  return (
    <main className="min-h-screen bg-[#f6f3ed] text-zinc-900">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <Header compact={appState === "preview"} />

        <AnimatePresence mode="wait">
          {(appState === "idle" || appState === "recording") && (
            <RecordingView
              isRecording={appState === "recording"}
              onStart={startRecording}
              onStop={stopRecording}
            />
          )}

          {appState === "processing" && <ProcessingView />}

          {appState === "preview" && (
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
              onReset={resetFlow}
            />
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

function Header({ compact }: { compact: boolean }) {
  return (
    <motion.header
      className={`flex items-center justify-between ${compact ? "mb-5" : "mb-10"}`}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f47b20] text-white shadow-sm">
          <Hammer aria-hidden="true" size={25} strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-2xl font-black leading-none text-zinc-950">
            Helpse
          </p>
          {!compact && (
            <p className="mt-1 max-w-[16rem] text-sm font-semibold leading-5 text-zinc-600">
              Jouw offertes in 10 seconden ingesproken en verstuurd.
            </p>
          )}
        </div>
      </div>
      <div className="rounded-full border border-zinc-200 bg-white px-3 py-2 text-xs font-bold text-zinc-700 shadow-sm">
        MVP
      </div>
    </motion.header>
  );
}

function RecordingView({
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
      key="recording"
      className="flex flex-1 flex-col items-center justify-center pb-10 text-center"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.28 }}
    >
      <div className="mb-8 max-w-md">
        <h1 className="text-4xl font-black leading-11 text-zinc-950 sm:text-5xl sm:leading-14">
          Spreek je offerte in.
        </h1>
        <p className="mt-4 text-lg font-semibold leading-7 text-zinc-700">
          Helpse zet je uitleg om naar een nette offerte voor je klant.
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
            Klaar voor de klus, niet voor papierwerk.
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
              Korte omschrijving
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
              onClick={() => alert("PDF opslaan komt in de volgende iteratie.")}
              className="flex min-h-16 items-center justify-center gap-3 rounded-2xl bg-zinc-950 px-5 text-lg font-black text-white shadow-lg"
              whileTap={{ scale: 0.98 }}
            >
              <FileDown aria-hidden="true" size={24} />
              Sla op als PDF
            </motion.button>
            <motion.button
              type="button"
              onClick={() =>
                alert("WhatsApp versturen komt in de volgende iteratie.")
              }
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

function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
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
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-zinc-700">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-14 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-base font-semibold text-zinc-900 outline-none transition focus:border-[#f47b20] focus:ring-4 focus:ring-orange-100"
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
