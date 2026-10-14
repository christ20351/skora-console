"use client";

/** Jauge circulaire du score de risque (0–100) */
export function JaugeRisque({
  score,
  taille = 76,
}: {
  score: number;
  taille?: number;
}) {
  const r = (taille - 10) / 2;
  const circonference = 2 * Math.PI * r;
  const rempli = (Math.min(100, score) / 100) * circonference;
  const couleur =
    score >= 65 ? "#dc3545" : score >= 45 ? "#f97316" : score >= 25 ? "#f59e0b" : "#10b981";
  return (
    <div className="relative inline-flex shrink-0 items-center justify-center">
      <svg width={taille} height={taille} className="-rotate-90">
        <circle
          cx={taille / 2}
          cy={taille / 2}
          r={r}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth={7}
        />
        <circle
          cx={taille / 2}
          cy={taille / 2}
          r={r}
          fill="none"
          stroke={couleur}
          strokeWidth={7}
          strokeLinecap="round"
          strokeDasharray={`${rempli} ${circonference - rempli}`}
          className="transition-all duration-700"
        />
      </svg>
      <span className="absolute font-bold text-slate-800" style={{ fontSize: taille / 3.4 }}>
        {score}
      </span>
    </div>
  );
}
