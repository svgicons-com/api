import { KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import type { PaletteIcon, PaletteSvgIcon } from "./types";

interface CommandPaletteProps {
  searchEndpoint?: string;
  svgEndpoint?: (icon: PaletteIcon) => string;
}

export function CommandPalette({
  searchEndpoint = "/api/icons/search",
  svgEndpoint = (icon) => `/api/icons/${icon.id}/svg`,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("search");
  const [results, setResults] = useState<PaletteIcon[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selected, setSelected] = useState<PaletteSvgIcon | null>(null);
  const [status, setStatus] = useState("Type to search icons.");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      const q = query.trim();

      if (q.length < 2) {
        setResults([]);
        setStatus("Type at least two characters.");
        return;
      }

      setError(null);
      setStatus("Searching...");

      try {
        const response = await fetch(`${searchEndpoint}?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.message ?? "Search failed.");
        }

        setResults(payload.data);
        setActiveIndex(0);
        setStatus(`${payload.data.length} results.`);
      } catch (fetchError) {
        if (controller.signal.aborted) {
          return;
        }

        setError(fetchError instanceof Error ? fetchError.message : "Search failed.");
        setStatus("");
      }
    }, 250);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [query, searchEndpoint]);

  const activeIcon = useMemo(() => results[activeIndex] ?? null, [activeIndex, results]);

  async function selectIcon(icon: PaletteIcon | null) {
    if (!icon) {
      return;
    }

    setError(null);
    setStatus(`Loading ${icon.name}...`);

    const response = await fetch(svgEndpoint(icon));
    const payload = await response.json();

    if (!response.ok) {
      setError(payload.message ?? "Unable to load icon SVG.");
      setStatus("");
      return;
    }

    setSelected(payload.data);
    setStatus(`Selected ${payload.data.name}.`);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, results.length - 1));
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    }

    if (event.key === "Enter") {
      event.preventDefault();
      void selectIcon(activeIcon);
    }

    if (event.key === "Escape") {
      setResults([]);
      setSelected(null);
      inputRef.current?.blur();
    }
  }

  async function copySelectedSvg() {
    if (!selected) {
      return;
    }

    await navigator.clipboard.writeText(selected.svg);
    setStatus(`Copied ${selected.name} SVG.`);
  }

  async function copySelectedMetadata() {
    if (!selected) {
      return;
    }

    await navigator.clipboard.writeText(
      JSON.stringify(
        {
          id: selected.id,
          name: selected.name,
          iconSet: selected.iconSet,
          pageUrl: selected.pageUrl,
        },
        null,
        2,
      ),
    );
    setStatus(`Copied ${selected.name} metadata.`);
  }

  return (
    <section aria-label="Svg/icons command palette">
      <label>
        <span>Search icons</span>
        <input
          ref={inputRef}
          aria-activedescendant={activeIcon ? `icon-result-${activeIcon.id}` : undefined}
          aria-controls="icon-results"
          aria-expanded={results.length > 0}
          aria-label="Search icons"
          role="combobox"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={onKeyDown}
        />
      </label>

      <p aria-live="polite">{error ?? status}</p>

      <ul id="icon-results" role="listbox">
        {results.map((icon, index) => (
          <li
            aria-selected={index === activeIndex}
            id={`icon-result-${icon.id}`}
            key={icon.id}
            role="option"
          >
            <button type="button" onClick={() => selectIcon(icon)}>
              <strong>{icon.label ?? icon.name}</strong>
              <span>
                {icon.iconSet ? `${icon.iconSet.name} - ${icon.iconSet.license ?? "Unknown license"}` : "Unknown set"}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {selected ? (
        <aside aria-label="Selected icon">
          <h2>{selected.name}</h2>
          <p>{selected.iconSet ? `${selected.iconSet.name} (${selected.iconSet.prefix})` : "Unknown icon set"}</p>
          <button type="button" onClick={copySelectedSvg}>
            Copy SVG
          </button>
          <button type="button" onClick={copySelectedMetadata}>
            Copy metadata
          </button>
          <pre>{selected.svg}</pre>
        </aside>
      ) : null}
    </section>
  );
}
