const Header = ({ profile }) => (
  <header className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur">
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="flex-shrink-0">
          <img
            src={profile.image}
            alt={profile.alt || `${profile.name} portrait`}
            className="h-28 w-28 rounded-full border-4 border-sky-500/40 object-cover shadow-lg shadow-slate-950/40"
          />
        </div>
        <div className="max-w-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-sky-400">Available for opportunities</p>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">{profile.name}</h1>
          <p className="mt-3 text-lg text-slate-300">{profile.title}</p>
          <p className="mt-4 text-base leading-7 text-slate-400">{profile.summary}</p>
        </div>
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 text-sm text-slate-300">
        <p className="font-medium text-slate-100">{profile.location}</p>
        <p className="mt-2">{profile.email}</p>
        <p className="mt-2">{profile.phone}</p>
      </div>
    </div>
  </header>
);

export default Header;
