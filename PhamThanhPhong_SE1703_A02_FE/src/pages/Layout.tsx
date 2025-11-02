import type { ParentProps } from "solid-js";
import Footer from "../components/Layout/Footer.tsx";
import NavBar from "../components/Layout/NavBar.tsx";

export default function Layout(props: ParentProps) {
  return (
    <div class="flex flex-col min-h-screen">
      <NavBar />

      <main class="grow grid">
        {props.children}
      </main>

      <Footer />
    </div>
  );
}
