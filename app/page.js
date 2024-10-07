import InstallationGuide from "@/components/InstallationGuide";
import LanguageSelector from "@/components/LanguageSelector";
import LogoAnimation from "@/components/LogoAnimation";

export default function Home() {
  return (
    <div className="h-screen w-screen bg-white overflow-hidden relative">
      <div className="absolute top-4 right-4 flex gap-4">
        <InstallationGuide />
        <LanguageSelector />
      </div>
      <div className="flex justify-center items-center h-full">
        <LogoAnimation />
      </div>
    </div>
  );
}
