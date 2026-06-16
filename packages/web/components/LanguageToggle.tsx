import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
      <Button
        variant={language === "en" ? "default" : "ghost"}
        size="sm"
        className="h-8 px-3 text-xs font-medium"
        onClick={() => setLanguage("en")}
      >
        English
      </Button>
      <Button
        variant={language === "hi" ? "default" : "ghost"}
        size="sm"
        className="h-8 px-3 text-xs font-medium"
        onClick={() => setLanguage("hi")}
      >
        हिंदी
      </Button>
    </div>
  );
}
