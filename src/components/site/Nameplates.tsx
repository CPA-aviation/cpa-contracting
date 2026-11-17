type Person = { readonly name: string; readonly title: string };

function initials(name: string) {
  const parts = name.split(" ");
  return `${parts[0][0]}${parts[parts.length - 1][0]}`;
}

/** Managers shown as typographic nameplates: name and verified designation only. */
export function Nameplates({ people, headingLevel = 3 }: { people: readonly Person[]; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <ul className="nameplates">
      {people.map((person, index) => (
        <li className="nameplate" key={person.name} data-rise>
          <span className="nameplate-mono" aria-hidden="true">{initials(person.name)}</span>
          <div className="nameplate-body">
            <span className="nameplate-index">{`0${index + 1}`}</span>
            <H className="nameplate-name">{person.name}</H>
            <p className="nameplate-title">{person.title}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
