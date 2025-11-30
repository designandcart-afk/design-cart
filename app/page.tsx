"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/UI";
import { DemoProject, DemoUpload } from "@/lib/demoData";
import { uploadFiles } from "@/lib/uploadAdapter";
import { useProjects } from "@/lib/contexts/projectsContext";
import AuthGuard from "@/components/AuthGuard";

// Suggested options (designer can still type anything)
const AREAS = [
  "Living Room",
  "Dining",
  "Bedroom",
  "Master Bedroom",
  "Kids Room",
  "Kitchen",
  "Bathroom",
  "Balcony",
  "Study",
];

const SCOPES = [
  "2BHK",
  "3BHK",
  "Full Home",
  "Commercial",
  "Furniture",
  "Lighting",
  "Renovation",
  "Developer Sample Flat",
];

type SortKey = "date" | "name";

export default function DashboardPage() {
  const { projects, addProject } = useProjects();

  const [form, setForm] = useState<{
    name: string;
    scope: string;
    address: string;
    notes: string;
    areaInput: string;
    areas: string[];
    files: File[];
    uploading: boolean;
  }>({
    name: "",
    scope: "",
    address: "",
    notes: "",
    areaInput: "",
    areas: [],
    files: [],
    uploading: false,
  });

  const [scopeFocus, setScopeFocus] = useState(false);
  const [areaFocus, setAreaFocus] = useState(false);

  const [query, setQuery] = useState("");  // search query
  const [sortBy, setSortBy] = useState<SortKey>("date"); // date (newest) | name

  function onFilesSelected(list: FileList | null) {
    if (!list) return;
    setForm((f) => ({ ...f, files: Array.from(list) }));
  }

  async function handleCreate() {
    if (!form.name) return;
    setForm((f) => ({ ...f, uploading: true }));

    let uploads: DemoUpload[] = [];
    if (form.files.length) {
      const result = await uploadFiles(form.files.map((file) => ({ file })));
      uploads = result.map((r) => ({
        id: r.id,
        name: r.name,
        size: r.size,
        mime: r.mime,
        url: r.url,
      }));
    }

    // Add project via context (now async, handles API)
    const created = await addProject({
      name: form.name.trim(),
      scope: form.scope.trim() || "wip",
      address: form.address.trim() || undefined,
      notes: form.notes.trim() || undefined,
      areas: form.areas.length ? form.areas : undefined,
      area: form.areas[0] || undefined,
      status: "wip",
      uploads,
    });

    if (created) {
      setForm({
        name: "",
        scope: "",
        address: "",
        notes: "",
        areaInput: "",
        areas: [],
        files: [],
        uploading: false,
      });
    } else {
      setForm((f) => ({ ...f, uploading: false }));
      // Optionally show error to user
      // alert('Failed to create project.');
    }
  }

  const inputBase =
    "w-full rounded-2xl border border-black/10 px-4 py-3 outline-none bg-white text-[#2e2e2e] " +
    "placeholder:text-[#2e2e2e]/40 focus:ring-2 focus:ring-[#d96857]/30";

  // Soft suggestion chips (no browser dropdown)
  function SuggestChips({
    items,
    onPick,
    visible,
    filter,
  }: {
    items: string[];
    onPick: (v: string) => void;
    visible: boolean;
    filter: string;
  }) {
    if (!visible) return null;
    const q = filter.trim().toLowerCase();
    const filtered = q ? items.filter((i) => i.toLowerCase().includes(q)) : items;
    if (!filtered.length) return null;
    return (
      <div className="mt-2 flex flex-wrap gap-2">
        {filtered.slice(0, 8).map((it) => (
          <button
            key={it}
            type="button"
            onMouseDown={() => onPick(it)}
            className="text-sm text-[#2e2e2e] bg-[#f9f8f7] border border-black/10 rounded-full px-3 py-1 hover:border-[#d96857]/40"
          >
            {it}
          </button>
        ))}
      </div>
    );
  }

  // Filter + sort projects for display
  const visibleProjects = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = projects.filter((p) => {
      if (!q) return true;
      const hay = [
        p.name,
        p.scope,
        p.area ?? "",
        p.address ?? "",
        p.status ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });

    list = list.sort((a, b) => {
      if (sortBy === "date") return b.createdAt - a.createdAt; // newest first
      // name
      return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
    });

    return list;
  }, [projects, query, sortBy]);

  return (
    <AuthGuard>
      <main className="px-6 md:px-10 py-6 min-h-screen bg-[#f2f0ed]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Project */}
        <div className="bg-white shadow-xl shadow-black/5 rounded-3xl p-6 border border-black/5">
          <h2 className="text-xl font-semibold text-[#2e2e2e] mb-4">Add Project</h2>

          <div className="space-y-4">
            <input
              className={inputBase}
              placeholder="Project name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              autoComplete="new-project-name"
            />

            {/* Scope of Work — free type with soft suggestion chips */}
            <div>
              <input
                className={inputBase}
                placeholder="Scope of Work (type or pick)"
                value={form.scope}
                onChange={(e) => setForm((f) => ({ ...f, scope: e.target.value }))}
                onFocus={() => setScopeFocus(true)}
                onBlur={() => setTimeout(() => setScopeFocus(false), 100)}
              />
              <SuggestChips
                items={SCOPES}
                filter={form.scope}
                visible={scopeFocus}
                onPick={(v) => setForm((f) => ({ ...f, scope: v }))}
              />
            </div>

            {/* Area — multi-entry chips with suggestions and custom input */}
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.areas.map((area, idx) => (
                  <span key={area + idx} className="flex items-center bg-[#f9f8f7] border border-black/10 rounded-full px-3 py-1 text-sm">
                    {area}
                    <button
                      type="button"
                      className="ml-2 text-[#d96857] hover:text-red-500"
                      onClick={() => setForm(f => ({ ...f, areas: f.areas.filter((_, i) => i !== idx) }))}
                      aria-label={`Remove area ${area}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                className={inputBase}
                placeholder="Add area (type or pick, press Enter)"
                value={form.areaInput}
                onChange={e => setForm(f => ({ ...f, areaInput: e.target.value }))}
                onFocus={() => setAreaFocus(true)}
                onBlur={() => setTimeout(() => setAreaFocus(false), 100)}
                onKeyDown={e => {
                  if ((e.key === 'Enter' || e.key === ',') && form.areaInput.trim()) {
                    e.preventDefault();
                    const newArea = form.areaInput.trim();
                    if (!form.areas.includes(newArea)) {
                      setForm(f => ({ ...f, areas: [...f.areas, newArea], areaInput: '' }));
                    } else {
                      setForm(f => ({ ...f, areaInput: '' }));
                    }
                  }
                }}
              />
              <SuggestChips
                items={AREAS.filter(a => !form.areas.includes(a))}
                filter={form.areaInput}
                visible={areaFocus}
                onPick={v => {
                  if (!form.areas.includes(v)) {
                    setForm(f => ({ ...f, areas: [...f.areas, v], areaInput: '' }));
                  } else {
                    setForm(f => ({ ...f, areaInput: '' }));
                  }
                }}
              />
            </div>

            <input
              className={inputBase}
              placeholder="Address"
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              autoComplete="new-project-address"
            />

            <textarea
              className={inputBase}
              placeholder="Notes"
              rows={3}
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            />

            {/* Multiple uploads in one box */}
            <input
              aria-label="Upload files"
              type="file"
              multiple
              accept="image/*,.pdf,.ppt,.pptx,.doc,.docx,.zip"
              onChange={(e) => onFilesSelected(e.target.files)}
              className="w-full rounded-2xl border border-black/10 px-4 py-3 bg-white text-[#2e2e2e] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-[#d96857] file:text-white file:hover:opacity-90"
            />

            {form.files.length > 0 && (
              <div className="rounded-2xl border border-black/10 p-3 text-sm text-[#2e2e2e]/80 bg-[#f9f8f7]">
                <div className="mb-1 font-medium">{form.files.length} file(s) selected</div>
                <ul className="list-disc pl-5 space-y-1">
                  {form.files.map((f, i) => (
                    <li key={i}>
                      {f.name}{" "}
                      <span className="text-xs text-[#2e2e2e]/60">
                        ({Math.round(f.size / 1024)} KB)
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button
              onClick={handleCreate}
              disabled={form.uploading}
              className="bg-[#d96857] hover:bg-[#d96857]/90 rounded-2xl px-5 py-3 text-white disabled:opacity-60"
            >
              {form.uploading ? "Uploading…" : "Create Project"}
            </Button>
          </div>
        </div>

        {/* Projects */}
        <div className="lg:col-span-2 bg-white shadow-xl shadow-black/5 rounded-3xl p-6 border border-black/5">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="text-xl font-semibold text-[#2e2e2e]">Projects</h2>

            {/* Search + Sort */}
            <div className="flex items-center gap-3 w-full max-w-xl">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects…"
                className="flex-1 rounded-2xl border border-black/10 px-4 py-2.5 bg-white text-[#2e2e2e] placeholder:text-[#2e2e2e]/40 focus:ring-2 focus:ring-[#d96857]/30"
              />
              <div className="flex rounded-full border border-black/10 overflow-hidden">
                <button
                  onClick={() => setSortBy("date")}
                  className={`px-3 py-2 text-sm ${sortBy === "date" ? "bg-[#d96857]/10 text-[#d96857]" : "text-[#2e2e2e]/70"}`}
                >
                  Date
                </button>
                <button
                  onClick={() => setSortBy("name")}
                  className={`px-3 py-2 text-sm ${sortBy === "name" ? "bg-[#d96857]/10 text-[#d96857]" : "text-[#2e2e2e]/70"}`}
                >
                  Name
                </button>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {visibleProjects.map((p) => (
              <Link
                key={p.id}
                href={`/projects/${encodeURIComponent(p.id)}`}
                className="block rounded-2xl border border-black/10 p-4 hover:shadow-md hover:border-[#d96857]/40 transition bg-white"
              >
                <h3 className="text-[#d96857] font-medium">{p.name}</h3>
                <p className="text-sm text-[#2e2e2e]/70">
                  {p.scope || "wip"}
                  {p.areas && p.areas.length ? ` · ${p.areas[0]}` : p.area ? ` · ${p.area}` : ""}
                </p>
                {p.address && <p className="mt-1 text-sm text-[#2e2e2e]/60">{p.address}</p>}

                <div className="mt-2 flex items-center gap-2">
                  {p.status && (
                    <span className="text-[11px] rounded-full bg-[#f9f8f7] border border-black/10 px-2 py-0.5 text-[#2e2e2e]/70">
                      {p.status}
                    </span>
                  )}
                  <span className="text-[11px] text-[#2e2e2e]/50">
                    {new Date(p.createdAt).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </span>
                </div>

                {p.uploads && p.uploads.length > 0 && (
                  <div className="mt-3">
                    <div className="text-xs text-[#2e2e2e]/60 mb-1">
                      {p.uploads.length} upload{p.uploads.length > 1 ? "s" : ""}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {p.uploads.slice(0, 3).map((u) => (
                        <a
                          key={u.id}
                          href={u.url}
                          target="_blank"
                          className="text-xs underline text-[#2e2e2e]/80 bg-[#f9f8f7] border border-black/10 rounded-full px-3 py-1"
                        >
                          {u.name.length > 18 ? u.name.slice(0, 18) + "…" : u.name}
                        </a>
                      ))}
                      {p.uploads.length > 3 && (
                        <span className="text-xs text-[#2e2e2e]/60">
                          +{p.uploads.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </Link>
            ))}

            {/* Empty state */}
            {visibleProjects.length === 0 && (
              <div className="col-span-full rounded-2xl border border-black/10 p-8 text-center text-[#2e2e2e]/60 bg-[#f9f8f7]">
                No projects found. Try another search.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
    </AuthGuard>
  );
}
