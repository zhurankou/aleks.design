import { HomePage } from "./components/HomePage";

export default function App() {
  return (
    <div className="h-screen w-screen overflow-y-auto overflow-x-hidden bg-black snap-y snap-mandatory">
      <HomePage onAboutMeClick={() => {}} />
    </div>
  );
}
