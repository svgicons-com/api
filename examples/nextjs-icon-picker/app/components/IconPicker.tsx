"use client";

import { FormEvent, useState } from "react";

interface SearchIcon {
  id: number;
  name: string;
  label?: string;
  pageUrl: string;
  iconSet: {
    name: string;
    prefix: string;
    license?: string | null;
  } | null;
}

interface SvgPayload {
  id: number;
  name: string;
  svg: string;
  iconSet: SearchIcon["iconSet"];
}

export function IconPicker() {
  const [query, setQuery] = useState("arrow");
  const [results, setResults] = useState<SearchIcon[]>([]);
  const [selected, setSelected] = useState<SvgPayload | null>(null);
  const [status, setStatus] = useState("Search for an icon to start.");
  const [error, setError] = useState<string | null>(null);

  async function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSelected(null);
    setStatus("Searching...");

    const response = await fetch(`/api/icons/search?q=${encodeURIComponent(query)}`);
    const payload = await response.json();

    if (!response.ok) {
      setResults([]);
      setStatus("");
      setError(payload.message ?? "Search failed.");
      return;
    }

    setResults(payload.data);
    setStatus(payload.data.length === 0 ? "No icons found." : `${payload.data.length} icons found.`);
  }

  async function selectIcon(icon: SearchIcon) {
    setError(null);
    setStatus(`Loading ${icon.name}...`);

    const response = await fetch(`/api/icons/${icon.id}/svg`);
    const payload = await response.json();

    if (!response.ok) {
      setError(payload.message ?? "Unable to load SVG.");
      setStatus("");
      return;
    }

    setSelected(payload.data);
    setStatus(`Selected ${payload.data.name}.`);
  }

  async function copySvg() {
    if (!selected) {
      return;
    }

    await navigator.clipboard.writeText(selected.svg);
    setStatus(`Copied ${selected.name} SVG.`);
  }

  return (
    <section className="picker" aria-label="Icon picker">
      <form className="searchForm" onSubmit={search}>
        <label htmlFor="icon-query">
          <span>Search icons</span>
          <input
            id="icon-query"
            name="q"
            value={query}
            autoComplete="off"
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <button type="submit">Search</button>
      </form>

      <p className={error ? "status error" : "status"} role="status" aria-live="polite">
        {error ?? status}
      </p>

      <div className="results">
        {results.map((icon) => (
          <button
            aria-pressed={selected?.id === icon.id}
            className="resultButton"
            key={icon.id}
            type="button"
            onClick={() => selectIcon(icon)}
          >
            <span className="iconName">{icon.label ?? icon.name}</span>
            <span className="meta">
              {icon.iconSet ? `${icon.iconSet.name} - ${icon.iconSet.license ?? "Unknown license"}` : "Unknown set"}
            </span>
          </button>
        ))}
      </div>

      {selected ? (
        <aside className="selected" aria-label="Selected icon">
          <h2>{selected.name}</h2>
          <p className="meta">
            {selected.iconSet
              ? `${selected.iconSet.name} (${selected.iconSet.prefix}) - ${selected.iconSet.license ?? "Unknown license"}`
              : "Unknown icon set"}
          </p>
          <button className="copyButton" type="button" onClick={copySvg}>
            Copy SVG
          </button>
          <pre>{selected.svg}</pre>
        </aside>
      ) : null}
    </section>
  );
}
