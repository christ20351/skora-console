import localFont from "next/font/local";

export const instrumentSans = localFont({
  src: [
    {
      path: "../../public/fonts/instrument-sans/InstrumentSans-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/instrument-sans/InstrumentSans-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/instrument-sans/InstrumentSans-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/instrument-sans/InstrumentSans-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-instrumental",
  display: "swap",
});
