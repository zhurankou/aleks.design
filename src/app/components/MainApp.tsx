import { useState } from "react";
import { HomePage } from "./HomePage";
import { AboutMe } from "./AboutMe";

export function MainApp() {
  const [isAboutMeOpen, setIsAboutMeOpen] = useState(false);

  return (
    <>
      <div className="h-screen w-screen overflow-y-auto overflow-x-hidden bg-black snap-y snap-mandatory">
        <HomePage onAboutMeClick={() => setIsAboutMeOpen(true)} />
      </div>
      <AboutMe isOpen={isAboutMeOpen} onClose={() => setIsAboutMeOpen(false)} />
    </>
  );
}
