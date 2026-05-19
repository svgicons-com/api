import { IconPicker } from "./components/IconPicker";

export default function Page() {
  return (
    <main className="page">
      <section className="header">
        <p className="eyebrow">Internal design-system tool</p>
        <h1>Icon picker</h1>
        <p>
          Search Svg/icons from a client component while the Pro API token stays inside Next.js route handlers.
        </p>
      </section>
      <IconPicker />
    </main>
  );
}
