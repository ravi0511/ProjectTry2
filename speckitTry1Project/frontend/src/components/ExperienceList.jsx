const ExperienceList = ({ experience }) => (
  <div className="space-y-5">
    {experience.map((item) => (
      <article key={`${item.company}-${item.role}`} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">{item.role}</h3>
            <p className="text-sm font-medium text-sky-300">{item.company}</p>
          </div>
          <div className="text-sm text-slate-400">
            <p>{item.period}</p>
            <p>{item.location}</p>
          </div>
        </div>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
          {item.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      </article>
    ))}
  </div>
);

export default ExperienceList;
