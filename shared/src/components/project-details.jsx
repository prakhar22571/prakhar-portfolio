import PropTypes from "prop-types";
import { GlassCard, CardContent } from "./ui/glass-card.jsx";
import { RevealGroup, RevealItem } from "./reveal.jsx";
export function ProjectDetails({ project, children }) {
  const description = (project.description || "")
    .split(/\.\s+|\n/)
    .filter(Boolean);
  const technologies = (project.technologies || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  return (
    <GlassCard>
      <CardContent className="p-6 sm:p-10">
        <div className="flex justify-end mb-6">{children}</div>
        <RevealGroup className="flex flex-col gap-5">
          <RevealItem>
            <h1 className="text-2xl font-bold mb-4">{project.title}</h1>
            {project.projectBanner?.url ? (
              <img
                src={project.projectBanner.url}
                alt={project.title}
                className="w-full rounded-xl"
              />
            ) : (
              <div className="rounded-xl bg-muted p-12 text-center">
                No project image
              </div>
            )}
          </RevealItem>
          {[
            ["Description", description],
            ["Technologies", technologies],
          ].map(([label, items]) => (
            <RevealItem key={label}>
              <h2 className="text-xl mb-2">{label}</h2>
              <ul className="list-disc pl-5">
                {items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </RevealItem>
          ))}
          {[
            ["Stack", project.stack],
            ["Deployed", project.deployed],
          ].map(([label, value]) => (
            <RevealItem key={label}>
              <h2 className="text-xl mb-2">{label}</h2>
              <p>{value}</p>
            </RevealItem>
          ))}
          {[
            ["GitHub repository", project.gitRepoLink],
            ["Project", project.projectLink],
          ]
            .filter(([, value]) => value)
            .map(([label, url]) => (
              <RevealItem key={label}>
                <h2 className="text-xl mb-2">{label}</h2>
                <a
                  className="text-sky-500 break-all"
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {url}
                </a>
              </RevealItem>
            ))}
        </RevealGroup>
      </CardContent>
    </GlassCard>
  );
}

ProjectDetails.propTypes = {
  project: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    technologies: PropTypes.string,
    stack: PropTypes.string,
    deployed: PropTypes.string,
    gitRepoLink: PropTypes.string,
    projectLink: PropTypes.string,
    projectBanner: PropTypes.shape({ url: PropTypes.string }),
  }),
  children: PropTypes.node,
};
