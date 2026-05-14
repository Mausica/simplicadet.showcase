import { Link } from "react-router-dom";
import { Institution } from "@/data/institutions";
import { MapPin, ArrowRight } from "lucide-react";

interface InstitutionCardProps {
  institution: Institution;
  index: number;
}

export function InstitutionCard({ institution, index }: InstitutionCardProps) {
  return (
    <Link
      to={`/${institution.slug}`}
      className="group fade-in-up block relative rounded-3xl overflow-hidden transition-all duration-300 liquid-glass hover:-translate-y-1"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      <div className="p-6">
        {}
        <div className="mb-6 flex justify-center">
          <div className="relative h-28 w-28 flex items-center justify-center">
            <img
              src={institution.insignia}
              alt={`Insignia ${institution.name}`}
              className="h-full w-full object-contain transition-transform duration-300 ease-out group-hover:scale-105"
              loading="lazy"
            />
          </div>
        </div>

        {}
        <div className="text-center">
          {}
          <h3 className="mb-2 font-display text-xl font-bold text-foreground">
            {institution.shortName}
          </h3>
          <p className="mb-3 text-sm text-foreground/60 line-clamp-2">
            {institution.name}
          </p>

          {}
          <div className="mb-4 flex items-center justify-center gap-1.5 text-sm text-foreground/60">
            <MapPin className="h-4 w-4" />
            <span>{institution.city}</span>
          </div>

          {}
          <p className="mb-5 text-sm italic text-foreground/50 px-2">
            "{institution.motto}"
          </p>

          {}
          <div className="flex items-center justify-center gap-2 mb-4">
            {institution.ranks.slice(0, 3).map((rank, idx) => (
              <div
                key={idx}
                className="h-10 w-10 overflow-hidden rounded-lg bg-foreground/5 dark:bg-white/10 p-1 border border-border/50 dark:border-white/15"
              >
                <img
                  src={rank.image}
                  alt={rank.name}
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          {}
          <div className="flex items-center justify-center gap-1.5 text-sm font-medium text-foreground/70 dark:text-foreground opacity-0 transition-all duration-300 group-hover:opacity-100">
            <span>Explorează</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}
