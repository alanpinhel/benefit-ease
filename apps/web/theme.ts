"use client";

import { generateColors } from "@mantine/colors-generator";
import {
  Button,
  MantineThemeOverride,
  TextInput,
  createTheme,
} from "@mantine/core";
import { Urbanist } from "next/font/google";

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const theme: MantineThemeOverride = createTheme({
  fontFamily: urbanist.style.fontFamily,
  primaryColor: "red",
  primaryShade: { light: 7, dark: 9 },
  colors: {
    red: generateColors("#e80537"),
  },
  headings: {
    fontFamily: urbanist.style.fontFamily,
  },
  components: {
    Button: Button.extend({
      defaultProps: {
        radius: "md",
      },
    }),
    TextInput: TextInput.extend({
      defaultProps: {
        radius: "md",
      },
    }),
  },
});