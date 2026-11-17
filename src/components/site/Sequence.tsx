type Step = { readonly title: string; readonly body: string };

/** The four enquiry steps as a sequence diagram. Horizontal on wide screens, vertical on narrow. */
export function Sequence({ steps, headingLevel = 3 }: { steps: readonly Step[]; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <ol className="sequence">
      {steps.map((step, index) => (
        <li className="sequence-step" key={step.title} data-rise>
          <span className="sequence-node" aria-hidden="true">
            <span>{`0${index + 1}`}</span>
          </span>
          <H className="sequence-title">{step.title}</H>
          <p>{step.body}</p>
        </li>
      ))}
    </ol>
  );
}
