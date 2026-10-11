export default function Credibility({ agentName }: { agentName: string }) {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-brand">
        A conversation with {agentName}
      </h2>
      <p className="mt-3 text-slate-600">
        Bring your goals and questions. We can discuss your priorities and the
        next steps.
      </p>
    </section>
  );
}
