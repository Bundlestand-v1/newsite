import Image from "next/image";
import Link from "next/link";

export default function PromotionalBanner({
  collection,
}: {
  collection: CollectionType;
}) {
  return (
    <div className="w-full max-w-[968px] mx-auto py-1 pl-4 pr-3">
      <Link href="#">
        <div className="w-full h-max rounded-2xl p-[10px] ease-in-out duration-300 transition hover:shadow-[0px_0px_4px_rgba(0,0,0,0.35)]">
          <div className="w-full flex items-center justify-center rounded-xl overflow-hidden">
            <div className="block md:hidden">
              <Image
                src="/images/testing/bedroom-mobile.png"
                alt="Shop bedroom"
                width={1000}
                height={1000}
                priority
              />
            </div>
            <div className="hidden md:block">
              <Image
                src="/images/testing/bedroom-desktop.png"
                alt="Shop bedroom"
                width={1000}
                height={1000}
                priority
              />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
