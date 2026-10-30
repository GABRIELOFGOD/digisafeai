import { HomePage } from "@/features/home/home-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
};

export default function Page() {
  return <HomePage />;
}
