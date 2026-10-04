import Image from "next/image";
import { ContactForm } from "@/components/contact-form";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { SocialIconLink } from "@/components/social-icon-link";
import { cn } from "@/lib/utils";
import {
  getFeaturedProjects,
  getServices,
  getSkills,
  getSocialLinks,
} from "@/lib/portfolio-content";
import { getWhatsAppUrl } from "@/lib/contact";
import { getSafeExternalUrl } from "@/lib/url";
import { FloatingWhatsApp } from "@/components/floating-whatsapp";
import { findSkillIcon, SkillIcon } from "@/lib/skill-icons";
import { findServiceIcon, ServiceIcon } from "@/lib/service-icons";
import type { SkillCategory } from "@/types/database.types";
import {
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  BriefcaseBusiness,
  Code2,
  Layers3,
  Workflow,
} from "lucide-react";

const skillCategories: SkillCategory[] = [
  "Frontend",
  "Backend",
  "Database",
  "AI",
  "Tools",
];

const serviceIcons = {
  Code2,
  Layers3,
  BrainCircuit,
  Workflow,
  BriefcaseBusiness,
};

const serviceTitles: Record<string, string> = {
  "Web Development": "Horumarinta Web-ka",
  "SaaS Development": "Horumarinta SaaS",
  "AI Integration": "Isku-darka AI",
  "Business Systems": "Nidaamyada Ganacsiga",
};

export const dynamic = "force-dynamic";

function resolveServiceIcon(icon: string | null) {
  if (icon && icon in serviceIcons) {
    return serviceIcons[icon as keyof typeof serviceIcons];
  }
  return BriefcaseBusiness;
}

export default async function Home() {
  const [projectsResult, skillsResult, servicesResult, socialResult] =
    await Promise.all([
      getFeaturedProjects(),
      getSkills(),
      getServices(),
      getSocialLinks(),
    ]);
  const projects = projectsResult.data ?? [];
  const skills = skillsResult.data ?? [];
  const services = servicesResult.data ?? [];
  const socialLinks = socialResult.data ?? [];
  const socialProfileLinks = socialLinks.filter(
    (link) => link.platform.trim().toLowerCase() !== "whatsapp",
  );
  const whatsappLink =
    socialLinks.find(
      (link) => link.platform.trim().toLowerCase() === "whatsapp",
    )?.url;
  const safeWhatsappHref = getWhatsAppUrl(whatsappLink);

  return (
    <>
      <Navbar socialLinks={socialLinks} />
      <main>
        <section
          id="home"
          aria-labelledby="hero-title"
          className="relative isolate scroll-mt-20 overflow-hidden"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_75%_30%,rgba(59,130,246,0.10),transparent_40%)]"
          />
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 md:min-h-[680px] md:grid-cols-[1.1fr_0.9fr] md:gap-10 lg:px-12 lg:py-24">
            <div className="animate-fade-in-up mx-auto max-w-2xl text-center md:mx-0 md:text-left">
              <p className="mb-5 text-sm font-medium text-muted-foreground">
                Salaan, waxaan ahay Apdifatah Moh&apos;moud Moh&apos;med
              </p>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
                <span className="size-1.5 rounded-full bg-primary" />
                FULL-STACK DEVELOPER
                <span className="text-border">/</span>
                AI BUILDER
              </div>
              <h1
                id="hero-title"
                className="text-5xl font-semibold leading-[1.06] tracking-[-0.045em] text-foreground sm:text-6xl lg:text-7xl"
              >
                Full-Stack Developer{" "}
                <span className="text-primary">&amp; AI Builder</span>
              </h1>
              <p className="mx-auto mt-7 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8 md:mx-0">
                Waxaan dhisaa web applications casri ah, SaaS products, iyo
                nidaamyo AI ku shaqeeya oo xalliya dhibaatooyinka dhabta ah.
              </p>
              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
                <a
                  href="#projects"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-12 rounded-full px-6 text-sm",
                  )}
                >
                  Eeg Mashaariicdayda
                  <ArrowUpRight aria-hidden="true" className="ml-1 size-4" />
                </a>
                <a
                  href="#contact"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "h-12 rounded-full px-6 text-sm",
                  )}
                >
                  Aan Wada Shaqayno
                  <ArrowRight aria-hidden="true" className="ml-1 size-4" />
                </a>
              </div>
              <div className="mt-9 flex items-center justify-center gap-3 md:justify-start">
                <span className="mr-1 text-xs text-muted-foreground">
                  Iga hel
                </span>
                {socialProfileLinks.map((socialLink) => (
                    <SocialIconLink
                      key={socialLink.id}
                      socialLink={socialLink}
                      className="flex size-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  ))}
              </div>
              {socialProfileLinks.length === 0 ? (
                <p className="mt-2 text-center text-[11px] text-muted-foreground/75 md:text-left">
                  Xiriiriyeyaasha baraha bulshada halkan ayay ka muuqan doonaan marka la diyaariyo.
                </p>
              ) : null}
            </div>

            <div className="animate-fade-in-up animation-delay-150 relative mx-auto w-full max-w-[380px] md:justify-self-end">
              <div
                aria-hidden="true"
                className="absolute -inset-3 rounded-[2rem] border border-border/70"
              />
              <div className="relative aspect-[3/4] overflow-hidden rounded-[1.6rem] border border-border bg-muted shadow-2xl shadow-foreground/10">
                <Image
                  src="/images/apdifatah-profile.jpg.jpg"
                  alt="Apdifatah Moh'moud Moh'med oo fadhiya miis xafiis iftiin leh"
                  fill
                  priority
                  sizes="(max-width: 767px) 80vw, (max-width: 1279px) 38vw, 380px"
                  className="object-cover object-center"
                />
              </div>
            </div>
          </div>
        </section>

        <section
          id="about"
          aria-labelledby="about-title"
          className="scroll-mt-20 border-y border-border/70 bg-muted/35"
        >
          <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-8 sm:py-20 md:grid-cols-[0.7fr_1.3fr] md:gap-20 lg:px-12 lg:py-24">
            <SectionHeading
              titleId="about-title"
              eyebrow="Igu Saabsan"
              title="Web-ka waxaan ugu dhisaa ujeeddo iyo xal."
            />
            <div className="max-w-2xl md:pt-8">
              <p className="text-lg leading-8 text-muted-foreground">
                Waxaan ahay Apdifatah Moh&apos;moud Moh&apos;med, Full-Stack Developer
                &amp; AI Builder diiradda saaraya web applications casri ah, SaaS
                products, iyo nidaamyo AI ku shaqeeya. Hadafkaygu waa inaan
                fikradaha u beddelo xalal digital ah oo cad, faa&apos;iido leh, oo
                si dhab ah u shaqeeya.
              </p>
            </div>
          </div>
        </section>

        <section
          id="projects"
          aria-labelledby="projects-title"
          className="scroll-mt-20 border-b border-border/70"
        >
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
            <SectionHeading
              titleId="projects-title"
              eyebrow="Shaqooyin la xushay"
              title="Mashaariicda Muhiimka ah"
              description="Xulasho ka mid ah mashaariicda iyo alaabada la sameeyay."
            />
            {projectsResult.error ? (
              <div role="status" className="rounded-2xl border border-border bg-muted/25 px-6 py-12 text-center text-sm text-muted-foreground">
                Mashaariicda la soo bandhigayo hadda lama heli karo.
              </div>
            ) : projects.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-muted/25 px-6 py-12 text-center">
                <h3 className="font-medium">Mashaariic ayaa dhowaan imanaya</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Mashaariicda halkan ayay ka muuqan doonaan marka la daabaco.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </div>
        </section>

        <section
          id="skills"
          aria-labelledby="skills-title"
          className="scroll-mt-20 border-b border-border/70 bg-muted/35"
        >
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
            <SectionHeading
              titleId="skills-title"
              eyebrow="Aqoonta iyo agabka"
              title="Xirfadaha"
              description="Xirfadaha iyo agabka aan u adeegsado dhismaha xalal casri ah."
            />
            {skillsResult.error ? (
              <div role="status" className="rounded-2xl border border-border bg-background px-6 py-12 text-center text-sm text-muted-foreground">
                Xirfadaha hadda lama heli karo.
              </div>
            ) : skills.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-background px-6 py-12 text-center">
                <p className="text-sm text-muted-foreground">
                  Xirfadaha halkan ayay ka muuqan doonaan marka lagu daro.
                </p>
              </div>
            ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {skillCategories.map((category, index) => {
                const categorySkills = skills.filter(
                  (skill) => skill.category === category,
                );
                return (
                <article
                  key={category}
                  className="rounded-2xl border border-border bg-background p-5 transition-colors hover:border-primary/30"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <h3 className="font-semibold">{category}</h3>
                    <span className="font-mono text-xs text-muted-foreground">
                      0{index + 1}
                    </span>
                  </div>
                  <div className="flex min-h-[4.5rem] flex-wrap content-start gap-2">
                    {categorySkills.map((skill) => {
                      const builtInIcon = findSkillIcon(skill.icon);
                      const skillImage = builtInIcon
                        ? null
                        : getSafeExternalUrl(skill.icon);
                      return (
                        <span
                          key={skill.id}
                          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/35 px-2.5 py-1.5 text-xs text-foreground"
                        >
                          {builtInIcon ? (
                            <SkillIcon value={skill.icon} />
                          ) : skillImage ? (
                            <Image
                              src={skillImage}
                              alt=""
                              width={16}
                              height={16}
                              unoptimized
                              className="size-4 rounded-sm object-contain"
                            />
                          ) : null}
                          {skill.name}
                        </span>
                      );
                    })}
                    {categorySkills.length === 0 ? (
                      <span className="text-xs text-muted-foreground">
                        Xirfado weli lama darin.
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-4 border-t border-border pt-3 text-xs leading-5 text-muted-foreground">
                    {categorySkills.length}{" "}
                    {categorySkills.length === 1 ? "xirfad" : "xirfado"}
                  </p>
                </article>
                );
              })}
            </div>
            )}
          </div>
        </section>

        <section
          id="services"
          aria-labelledby="services-title"
          className="scroll-mt-20 border-b border-border/70"
        >
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
            <SectionHeading
              titleId="services-title"
              eyebrow="Waxa aan qabto"
              title="Adeegyada"
              description="Waxaan kaa caawin karaa in fikrad loo beddelo wax-soo-saar digital ah oo faa&apos;iido leh."
            />
            {servicesResult.error ? (
              <div role="status" className="rounded-2xl border border-border bg-muted/25 px-6 py-12 text-center text-sm text-muted-foreground">
                Adeegyada hadda lama heli karo.
              </div>
            ) : services.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-muted/25 px-6 py-12 text-center">
                <p className="text-sm text-muted-foreground">
                  Adeegyada halkan ayay ka muuqan doonaan marka lagu daro.
                </p>
              </div>
            ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {services.map((service, index) => {
                const builtInServiceIcon = findServiceIcon(service.icon);
                const serviceImage = builtInServiceIcon
                  ? null
                  : getSafeExternalUrl(service.icon);
                const Icon = resolveServiceIcon(
                  serviceImage ? null : service.icon,
                );
                return (
                <article
                  key={service.id}
                  className="group rounded-2xl border border-border bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-foreground/5"
                >
                  <div className="mb-8 flex items-center justify-between">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-muted text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      {builtInServiceIcon ? (
                        <ServiceIcon value={service.icon} />
                      ) : serviceImage ? (
                        <Image
                          src={serviceImage}
                          alt=""
                          width={24}
                          height={24}
                          unoptimized
                          className="size-6 rounded object-contain"
                        />
                      ) : (
                        <Icon aria-hidden="true" className="size-5" />
                      )}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight">
                    {serviceTitles[service.title] ?? service.title}
                  </h3>
                  {service.description ? (
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {service.description}
                    </p>
                  ) : null}
                </article>
                );
              })}
            </div>
            )}
          </div>
        </section>

        <section
          id="contact"
          aria-labelledby="contact-title"
          className="scroll-mt-20"
        >
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
            <ContactForm />
          </div>
        </section>
      </main>
      <Footer socialLinks={socialLinks} />
      <FloatingWhatsApp href={safeWhatsappHref} />
    </>
  );
}
