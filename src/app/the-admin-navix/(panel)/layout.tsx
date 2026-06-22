import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/the-admin-navix");
  if (user.mustChangePassword) redirect("/the-admin-navix/change-password");

  return (
    <AdminShell username={user.username} role={user.role}>
      {children}
    </AdminShell>
  );
}
