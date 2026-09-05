import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from "@/components/ui";
import { Layers, Database, Cloud, Palette, ShieldCheck, Smartphone } from "lucide-react";

export default function Home() {
  const stackItems = [
    {
      icon: <Layers className="w-5 h-5 text-blue-500" />,
      title: "Next.js 16.3.4",
      description: "App Router with hybrid Server & Client components for maximum performance and SEO.",
      tag: "Framework",
    },
    {
      icon: <Database className="w-5 h-5 text-emerald-500" />,
      title: "NeonDB + Drizzle",
      description: "Dedicated database service layer with PostgreSQL and swappable repository pattern.",
      tag: "Database",
    },
    {
      icon: <Cloud className="w-5 h-5 text-amber-500" />,
      title: "Cloudinary Storage",
      description: "Organized under event-vendors root directory with isolated model subfolders.",
      tag: "Assets",
    },
    {
      icon: <Palette className="w-5 h-5 text-purple-500" />,
      title: "Tailwind CSS & Tokens",
      description: "Modular design tokens and CSS variables with placeholders for colors and typography.",
      tag: "Styling",
    },
    {
      icon: <Smartphone className="w-5 h-5 text-rose-500" />,
      title: "Fully Responsive",
      description: "Adaptive layouts configured for mobile, tablet, desktop, and ultra-wide displays.",
      tag: "Layout",
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-cyan-500" />,
      title: "TypeScript 7.0.2",
      description: "Strict typing across frontend UI, server actions, database schema, and storage services.",
      tag: "Language",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="font-bold text-xl tracking-tight text-zinc-900 dark:text-zinc-50">
              Portfolio
            </span>
            <Badge variant="success">Scaffold Ready</Badge>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              Architecture Rules
            </Button>
            <Button variant="primary" size="sm">
              Ready for Screens
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex flex-col gap-12">
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="secondary" className="mb-2">
            Project Scaffolding Complete
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Portfolio Architecture & Technical Foundation
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Frontend and unified backend architecture configured according to your exact specifications.
            Ready to implement individual screens and components.
          </p>
        </section>

        {/* Core Architecture Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stackItems.map((item, index) => (
            <Card key={index} className="hover:shadow-md transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800">
                  {item.icon}
                </div>
                <Badge variant="outline">{item.tag}</Badge>
              </CardHeader>
              <CardContent className="pt-4">
                <CardTitle className="mb-2">{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Ready for Screens Banner */}
        <section className="p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Next Step: Screen Implementation
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Share your screen designs and components. The reusable component library and services are ready.
            </p>
          </div>
          <Button size="lg" variant="primary">
            Awaiting Next Screen
          </Button>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
        <p>© {new Date().getFullYear()} Portfolio. Built with Next.js 16 & TypeScript.</p>
      </footer>
    </div>
  );
}
