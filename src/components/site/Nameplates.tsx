import Image from "next/image";

type Person = {
  readonly name: string;
  readonly title: string;
  readonly image?: string;
};

function initials(name: string) {
  const parts = name.replace(/^Mr\.\s+/i, "").split(" ");
  return `${parts[0][0]}${parts[parts.length - 1][0]}`;
}

/** Promoters shown as nameplates with portrait, name, and designation. */
export function Nameplates({ people, headingLevel = 3 }: { people: readonly Person[]; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <ul className="nameplates">
      {people.map((person, index) => (
        <li className="nameplate" key={person.name} data-rise>
          {person.image ? (
            <Image
              src={person.image}
              alt={person.name}
              width={160}
              height={200}
              className="nameplate-photo"
            />
          ) : (
            <span className="nameplate-mono" aria-hidden="true">{initials(person.name)}</span>
          )}
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
