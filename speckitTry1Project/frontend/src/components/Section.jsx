const Section = ({ title, children, id }) => (
  <section id={id} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg shadow-slate-950/30 backdrop-blur">
    <h2 className="mb-4 text-xl font-semibold text-slate-100">{title}</h2>
    {children}
  </section>
);

export default Section;
