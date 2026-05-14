import { Quote, Star } from "lucide-react";
import { cn } from "@/lib/utils";

import githubLogo from "@/assets/sponsors/github.png";
import googleLogo from "@/assets/sponsors/google.png";
import vercelLogo from "@/assets/sponsors/vercel.png";

const sponsors = [
  { name: "GitHub", logo: githubLogo },
  { name: "Google", logo: googleLogo },
  { name: "Vercel", logo: vercelLogo },
];

const testimonials = [
  {
    name: "Alexandru M.",
    role: "Absolvent CNMTV 2023",
    content: "Experiența de la colegiul militar m-a format ca om și ca viitor ofițer. Disciplina și camaraderia de aici sunt de neegalat.",
    rating: 5,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQb4gE0ul3qE0O0UOr_1oigrmoCJgzLVVsalA&s?w=100",
  },
  {
    name: "Maria I.",
    role: "Absolventă AFT 2022",
    content: "Am găsit la academie nu doar o educație de excepție, ci și prietenii pentru viață. Recomand cu căldură tuturor celor pasionați de cariera militară.",
    rating: 5,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBagcfg44ajIr5s6ZtP5gqOhkL2Z88uhZZXQ&s?w=100",
  },
  {
    name: "Andrei P.",
    role: "Absolvent ATM 2024",
    content: "Academia Tehnică Militară mi-a oferit toate instrumentele pentru o carieră de succes în inginerie militară. Profesorii sunt excepționali!",
    rating: 5,
    image: "https://starsibian.ro/wp-content/uploads/2021/08/226664417_4422049221191576_6633151823858821705_n.jpg?w=100",
  },
  {
    name: "Elena D.",
    role: "Absolventă CNMDC 2023",
    content: "Colegiul Dimitrie Cantemir m-a învățat ce înseamnă devotamentul și excelența. Sunt mândră că am făcut parte din acest colegiu.",
    rating: 5,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTF408Rgo4CgZRvI26Yobysr8kWK4SKg7abSQ&s=100",
  },
];

const TestimonialsSection = () => {
  return (
    <>
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          {}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#242880]/5 border border-[#242880]/10 text-[#242880] dark:text-[#8d7dca] dark:bg-white/5 dark:border-white/10 mb-6">
              <span className="text-xs font-bold uppercase tracking-widest">Testimoniale</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground/90 mb-4">
              Ce Spun Absolvenții
            </h2>
            <p className="text-foreground/50 text-base max-w-xl mx-auto">
              Povești de succes de la cei care au ales calea militară
            </p>
          </div>

          {}
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.name}
                className={cn(
                  "rounded-2xl p-5 transition-all duration-300",
                  "bg-white dark:bg-white/[0.08] backdrop-blur-xl",
                  "border border-white/[0.15] hover:border-[#8d7dca]/40",
                  "hover:shadow-lg hover:shadow-[#242880]/10",
                  "opacity-0 animate-fade-in-up group"
                )}
                style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "forwards" }}
              >
                {}
                <div className="mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.05] backdrop-blur-sm border border-white/[0.1] flex items-center justify-center">
                    <Quote className="w-5 h-5 text-foreground/40" />
                  </div>
                </div>
                
                {}
                <p className="text-foreground/60 text-sm flex-grow mb-5 leading-relaxed">
                  "{testimonial.content}"
                </p>

                {}
                <div className="flex gap-0.5 mb-5">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#8d7dca] text-[#8d7dca]" />
                  ))}
                </div>

                {}
                <div className="pt-4 border-t border-white/[0.06] flex items-center gap-3">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover border border-white/[0.1]"
                  />
                  <div>
                    <p className="font-semibold text-sm text-foreground/80">{testimonial.name}</p>
                    <p className="text-foreground/40 text-xs">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {sponsors.map((sponsor, index) => (
              <div
                key={sponsor.name}
                className="opacity-0 animate-fade-in grayscale hover:grayscale-0 transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "forwards" }}
              >
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className="h-8 md:h-10 w-auto object-contain opacity-40 hover:opacity-70 dark:invert dark:opacity-30 dark:hover:opacity-60 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default TestimonialsSection;
