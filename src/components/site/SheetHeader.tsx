/** Small drafting-style label that opens a section: sheet reference + scale note. */
export function SheetHeader({ sheet, note = "Scale: NTS", tone = "light" }: { sheet: string; note?: string; tone?: "light" | "dark" }) {
  return (
    <div className={`sheet-header sheet-header-${tone}`}>
      <span>{sheet}</span>
      <span aria-hidden="true" className="sheet-rule" />
      <span>{note}</span>
    </div>
  );
}
