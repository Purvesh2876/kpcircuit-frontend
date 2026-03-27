import { extendTheme } from "@chakra-ui/react";

const colors = {
  brand: {
    50: "#e6fffa",
    100: "#b2f5ea",
    200: "#81e6d9",
    300: "#4fd1c5",
    400: "#38b2ac",
    500: "#004d3d", // Primary Dark Green from logo
    dark: "#00352aff", // Primary Dark Green from logo
    600: "#005a46",
    700: "#004d3d",
    800: "#14a44d", // Vibrant Green from logo
    900: "#0e7d3b",
  },
  accent: {
    500: "#14a44d", // Vibrant Green for accents
  }
};

const theme = extendTheme({
  colors,
  fonts: {
    heading: "'Quicksand', sans-serif",
    body: "'Quicksand', sans-serif",
  },
  components: {
    Button: {
      variants: {
        solid: (props) => ({
          bg: props.colorScheme === "brand" ? "brand.500" : undefined,
          _hover: {
            bg: props.colorScheme === "brand" ? "brand.800" : undefined,
          },
        }),
      },
    },
  },
});

export default theme;
