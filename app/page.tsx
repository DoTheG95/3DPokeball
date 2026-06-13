import Greatball3D from "@/component/greatball";
import Pokeball3D from "@/component/pokeball";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <main className="min-height-auto">
        <Pokeball3D />
        <Greatball3D />
      </main>
    </div>
  );
}
