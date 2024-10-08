import InstallationGuide from "@/components/InstallationGuide";
import LanguageSelector from "@/components/LanguageSelector";
import LogoAnimation from "@/components/LogoAnimation";

export default function Home() {
  return (
    <div className="h-screen w-screen bg-white overflow-hidden relative">
      <div className="absolute top-4 right-0 flex gap-4 items-center">
        <InstallationGuide />
        <LanguageSelector />
      </div>
      <div className="flex justify-center items-center h-full">
        <LogoAnimation />
      </div>
    </div>
  );
}
