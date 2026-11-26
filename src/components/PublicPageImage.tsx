"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { pagePhotos } from "@/lib/page-photos";
export default function PublicPageImage() {
  const photo = pagePhotos[usePathname().replace(/\/$/, "")];
  if (!photo) return null;
  return <div className="public-page-photo"><Image src={photo[0]} alt={photo[1]} fill sizes="(max-width: 760px) 100vw, 92vw" /></div>;
}
