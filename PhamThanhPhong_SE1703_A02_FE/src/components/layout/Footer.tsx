import { A } from "@solidjs/router";

const gh = "https://github.com/PTPhongKMF";

export default function Footer() {
  return (
    <footer class="py-0.5 border-t bg-neutral-700">
      <p class="pe-10 text-neutral-300 text-end">
        Made with ❤ by{" "}
        <A
          href={gh}
          target="_blank"
          class="hover:text-blue-500 text-blue-200 transition-colors duration-100"
        >
          Phong
        </A>
      </p>
    </footer>
  );
}
