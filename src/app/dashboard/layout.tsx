import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Financial Model Dashboard - Edmeca Developments",
  description:
    "Interactive financial dashboard for development project analysis. View key metrics for lenders, funders, and development managers.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
