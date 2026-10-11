export default function HowItWorks() {
  const steps = [
    {
      title: "Tell me what matters",
      body: "We start with your family, your commitments and the plans you have in mind.",
    },
    {
      title: "Make sense of the options",
      body: "We discuss the questions to ask, the costs to consider and what fits your budget.",
    },
    {
      title: "Choose your next step",
      body: "Take time to consider what you have learned. Decide when you are ready.",
    },
  ];
  return (
    <section className="home-section process-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">A straightforward process</p>
          <h2>It starts with a conversation.</h2>
        </div>
        <p>
          You do not need to have
          <br />
          everything figured out.
        </p>
      </div>
      <ol className="process-grid">
        {steps.map((s, i) => (
          <li key={s.title}>
            <span className="process-number">0{i + 1}</span>
            <h3>{s.title}</h3>
            <p>{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
