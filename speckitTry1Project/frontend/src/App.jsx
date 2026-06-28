import Header from './components/Header';
import Section from './components/Section';
import ExperienceList from './components/ExperienceList';
import { resumeContent } from './data/resumeContent';

function App() {
  const { profile, skills, experience, technologies } = resumeContent;

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <Header profile={profile} />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Section title="Summary" id="summary">
          <p className="text-base leading-8 text-slate-300">{profile.summary}</p>
        </Section>

        <Section title="Skills" id="skills">
          <div className="space-y-4">
            {skills.map((group) => (
              <div key={group.title}>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-sky-400">{group.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span key={item} className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-sm text-slate-200">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      <Section title="Work History" id="experience">
        <ExperienceList experience={experience} />
      </Section>

      <Section title="Technologies Worked On" id="technologies">
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech) => (
            <span key={tech} className="rounded-full border border-slate-700 bg-slate-800/90 px-3 py-1 text-sm text-slate-200">
              {tech}
            </span>
          ))}
        </div>
      </Section>
    </main>
  );
}

export default App;
