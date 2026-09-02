import { ClientShell } from "@/components/ClientShell";
import { ConnectProvider } from "@/components/ConnectProvider";

export default function ConnectLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <ConnectProvider><ClientShell>{children}</ClientShell></ConnectProvider>;
}
