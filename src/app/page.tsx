import Link from "next/link";
import { CampsiteExplorer } from "@/components/campsites/campsite-explorer";
import { campsites } from "@/data";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="max-w-3xl space-y-3">
        <p className="text-sm font-medium text-primary">漁護署指定露營地點 · {campsites.length} 個</p>
        <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-4xl">
          香港郊野公園營地，一覽水源、交通與景色
        </h1>
        <p className="leading-relaxed text-muted-foreground">
          整理漁農自然護理署在郊野公園及特別地區設立的 {campsites.length}{" "}
          個指定營地。每個營地附水源、營位、交通指引及「編輯評分」，預設按綜合分排序。評分屬本站編輯意見，並非用戶評價；
          <Link href="/about#ratings" className="font-medium text-primary underline underline-offset-4">
            了解評分方法
          </Link>
          。
        </p>
      </header>
      <div className="mt-8">
        <CampsiteExplorer campsites={campsites} />
      </div>
    </div>
  );
}
