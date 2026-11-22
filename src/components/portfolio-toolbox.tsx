import {
  Aperture,
  Clapperboard,
  Figma,
  Flame,
  Layers3,
  Paintbrush,
  PenTool,
  Sparkles,
} from "lucide-react";

const tools = [
  { name: "Photoshop", icon: Layers3, color: "var(--digital-blue)" },
  { name: "Illustrator", icon: PenTool, color: "var(--signal-orange)" },
  { name: "Affinity", icon: Aperture, color: "var(--digital-violet)" },
  { name: "Figma", icon: Figma, color: "var(--neural-green)" },
  { name: "Canva", icon: Paintbrush, color: "var(--digital-blue)" },
  { name: "CapCut", icon: Clapperboard, color: "var(--signal-white)" },
  { name: "Firefly", icon: Flame, color: "var(--signal-orange)" },
  { name: "Gemini", icon: Sparkles, color: "var(--electric-lime)" },
];

export function PortfolioToolbox() {
  return (
    <section id="ferramentas" className="bg-surface" aria-labelledby="toolbox-title">
      <div className="portfolio-content py-20 md:py-28">
        <h2 id="toolbox-title" className="font-display font-semibold text-ink text-3xl md:text-4xl">
          A caixa de ferramentas
        </h2>
        <div className="toolbox-scene">
          <ul className="toolbox-tools">
            {tools.map(({ name, icon: Icon, color }) => (
              <li key={name} className="toolbox-tool-slot">
                <div className="toolbox-tool">
                  <span className="toolbox-tool-icon" style={{ backgroundColor: color }}>
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <span>{name}</span>
                </div>
              </li>
            ))}
          </ul>
          <div className="toolbox-chest" aria-hidden="true">
            <div className="toolbox-origin" />
            <div className="toolbox-lid" />
            <div className="toolbox-front">
              <span className="toolbox-lock" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
