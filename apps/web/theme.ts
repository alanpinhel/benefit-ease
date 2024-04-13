"use client";

import { generateColors } from "@mantine/colors-generator";
import { MantineThemeOverride, createTheme } from "@mantine/core";
import { Urbanist } from "next/font/google";

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const theme: MantineThemeOverride = createTheme({
  fontFamily: urbanist.style.fontFamily,
  primaryColor: "red",
  primaryShade: 7,
  colors: {
    red: generateColors("#e80537"),
  },
  headings: {
    fontFamily: urbanist.style.fontFamily,
  },
});
