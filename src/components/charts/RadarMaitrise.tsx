"use client";

/** Radar de maîtrise par notion (SVG pur) */
export function RadarMaitrise({
  donnees,
  taille = 260,
}: {
  donnees: { label: string; valeur: number }[];
  taille?: number;
}) {
  const centre = taille / 2;
  const rayon = centre - 34;
  const n = donnees.length;
  if (n < 3) return null;

  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const point = (i: number, r: number): [number, number] => [
    centre + r * Math.cos(angle(i)),
    centre + r * Math.sin(angle(i)),
  ];
  const polygone = donnees
    .map((d, i) => point(i, (rayon * Math.max(4, d.valeur)) / 100).join(","))
    .join(" ");

  return (
    <svg width={taille} height={taille} className="mx-auto">
      {[25, 50, 75, 100].map((c) => (
        <polygon
          key={c}
          points={donnees.map((_, i) => point(i, (rayon * c) / 100).join(",")).join(" ")}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={1}
        />
      ))}
      {donnees.map((_, i) => {
        const [x, y] = point(i, rayon);
        return (
          <line key={i} x1={centre} y1={centre} x2={x} y2={y} stroke="#e2e8f0" strokeWidth={1} />
        );
      })}
      <polygon points={polygone} fill="#dc354526" stroke="#dc3545" strokeWidth={2} />
      {donnees.map((d, i) => {
        const [x, y] = point(i, (rayon * Math.max(4, d.valeur)) / 100);
        return <circle key={i} cx={x} cy={y} r={3} fill="#dc3545" />;
      })}
      {donnees.map((d, i) => {
        const [x, y] = point(i, rayon + 20);
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor={x > centre + 4 ? "start" : x < centre - 4 ? "end" : "middle"}
            dominantBaseline="middle"
            className="fill-slate-500"
            style={{ fontSize: 10 }}
          >
            {d.label.length > 16 ? d.label.slice(0, 15) + "…" : d.label}
          </text>
        );
      })}
    </svg>
  );
}
