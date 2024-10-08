import { useState } from "react";
import { Moon, Sun } from "lucide-react";

import { Switch } from "@/components/ui/switch";

export function ThemeSwitcher() {
  const [theme, setTheme] = useState("light");

  const handleThemeChange = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <Switch
      className="data-[state=checked]:bg-indigo-400"
      checked={theme === "dark"}
      onCheckedChange={handleThemeChange}
    >
      {theme === "light" ? (
        <Moon className="size-3" />
      ) : (
        <Sun className="size-3" />
      )}
    </Switch>
  );
}
