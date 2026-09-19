import { Header } from "../_components/Header";
import { CtaFooter } from "../_components/CtaFooter";

export default function BlogLayout({ children }: LayoutProps<"/blog">) {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col">{children}</main>
      <CtaFooter />
    </>
  );
}
