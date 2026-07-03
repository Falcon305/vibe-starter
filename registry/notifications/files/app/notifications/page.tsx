import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/guard";
import { getUserNotifications } from "@/lib/notifications";

export const metadata: Metadata = { title: "Notifications" };

export default async function NotificationsPage() {
  const session = await getSession();
  if (!session) redirect("/sign-in");

  const notifications = await getUserNotifications(session.user.id);

  return (
    <main id="main" className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
      {notifications.length === 0 ? (
        <p className="text-muted-foreground mt-4">You have no notifications.</p>
      ) : (
        <ul className="mt-8 space-y-4">
          {notifications.map((item) => (
            <li key={item.id} className="rounded-lg border p-4">
              <p className="font-medium">{item.title}</p>
              <p className="text-muted-foreground mt-1 text-sm">{item.body}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
