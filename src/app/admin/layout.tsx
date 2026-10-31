// src/app/admin/layout.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminLayoutClient from "./AdminLayoutClient";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  // دیباگ موقت — بعد از حل مشکل حذف کن
  console.log("🔍 admin layout session:", JSON.stringify(session, null, 2));

  const role = (session?.user as any)?.role;

  if (!session?.user || role !== "ADMIN") {
    redirect("/login");
  }

  return <AdminLayoutClient session={session}>{children}</AdminLayoutClient>;
}