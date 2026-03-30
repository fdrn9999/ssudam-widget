import { useState, useEffect } from "react";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { MainWidget } from "./windows/MainWidget";
import { Settings } from "./windows/Settings";
import { Stats } from "./windows/Stats";
import { About } from "./windows/About";

function App() {
  const [windowType, setWindowType] = useState<string | null>(null);

  useEffect(() => {
    // Method 1: URL query param (works in dev mode)
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get("window");
    if (fromUrl) {
      setWindowType(fromUrl);
      return;
    }

    // Method 2: Tauri webview label (works in production)
    try {
      const label = getCurrentWebviewWindow().label;
      setWindowType(label);
    } catch {
      setWindowType("main");
    }
  }, []);

  if (windowType === null) return null; // loading

  switch (windowType) {
    case "settings":
      return <Settings />;
    case "stats":
      return <Stats />;
    case "about":
      return <About />;
    default:
      return <MainWidget />;
  }
}

export default App;
