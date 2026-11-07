import { campsites } from "@/data";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        香港郊野公園指定露營地點
      </h1>
      <p className="mt-3 max-w-prose text-muted-foreground">
        已收錄漁護署 {campsites.length} 個指定露營地點，營地目錄建設中。
      </p>
    </div>
  );
}
