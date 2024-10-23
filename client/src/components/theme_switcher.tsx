import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useThemeStore } from "@/lib/theme_store";

export function ThemeSwitcher() {
  const { theme, setTheme } = useThemeStore();
  const systemIsDark = window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches;
  const isDark = theme === "dark" || (theme === "system" && systemIsDark);

  const handleThemeChange = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <Switch
      className="data-[state=checked]:bg-indigo-400"
      checked={isDark}
      onCheckedChange={handleThemeChange}
    >
      {isDark ? (
        <Moon className="size-3 dark:text-secondary" />
      ) : (
        <Sun className="size-3 text-secondary" />
      )}
    </Switch>
  );
}
