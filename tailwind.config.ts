import type { Config } from "tailwindcss";

const configuracion: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./datos/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        tinta: "#08213F",
        oceano: "#1167C4",
        azul: "#0B4EA2",
        cielo: "#38BDF8",
        menta: "#0EA5E9",
        coral: "#2563EB",
        ambar: "#60A5FA",
        nube: "#EFF7FF"
      },
      boxShadow: {
        suave: "0 18px 44px rgba(8, 33, 63, 0.14)",
        app: "0 22px 70px rgba(7, 41, 87, 0.22)"
      }
    }
  },
  plugins: []
};

export default configuracion;
