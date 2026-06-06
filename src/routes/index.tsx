import { createFileRoute } from "@tanstack/react-router";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ParallaxBackground } from "@/components/ParallaxBackground";
import { Surface } from "@/components/Surface";
import { IntakeForm } from "@/components/IntakeForm";
import { Markdown } from "@/components/Markdown";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { questionsConfig } from "@/lib/questions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rover Intake Form — Thanks for boarding with me!" },
      {
        name: "description",
        content:
          "A friendly intake form to help me give your dog the best boarding stay possible.",
      },
      { property: "og:title", content: "Rover Intake Form" },
      {
        property: "og:description",
        content: "Tell me about your pup so I can give them the best stay possible.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="relative min-h-screen">
      <ParallaxBackground />

      <header className="sticky top-0 z-20 flex items-center justify-between px-5 py-3 sm:px-8">
        <Surface className="inline-flex items-center p-2 sm:p-2">
          <a
            href="https://www.rover.com/members/devan-h-senior-small-and-doodle-dude/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-bold tracking-wide text-muted-foreground transition-colors hover:text-primary"
          >
            <span className="inline-block h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_color-mix(in_oklab,var(--primary)_70%,transparent)]" />
            back to my rover
          </a>
        </Surface>
        <ThemeToggle />
      </header>

      <main className="mx-auto w-full max-w-2xl px-5 pb-24 sm:px-8">
        <Surface className="mt-[10vh] mb-10 sm:mt-[14vh]">
          <h1 className="text-left text-4xl font-[1000] leading-[1.05] tracking-tight text-foreground sm:text-6xl">
            <Markdown inline>{questionsConfig.title}</Markdown>
          </h1>
          <p className="mt-5 max-w-xl text-left text-base leading-relaxed text-muted-foreground sm:text-lg">
            <Markdown inline>{questionsConfig.subtitle}</Markdown>
          </p>
        </Surface>

        <IntakeForm />
      </main>

      <footer className="px-5 pb-8 pt-4 text-center text-sm text-muted-foreground">
        Made with{" "}
        <span aria-label="love" className="text-primary">
          ❤
        </span>{" "}
        by{" "}
        <a
          href="https://devan.gg"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-foreground underline-offset-4 hover:text-primary hover:underline"
        >
          dev
        </a>
      </footer>
    </div>
  );
}
