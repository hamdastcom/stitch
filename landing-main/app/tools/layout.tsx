import { Header } from "../_components/Header";
import { CtaFooter } from "../_components/CtaFooter";

export default function ToolsLayout({
  children,
}: LayoutProps<"/tools">) {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col overflow-x-clip bg-white">{children}</main>
      <CtaFooter />
    </>
  );
}
