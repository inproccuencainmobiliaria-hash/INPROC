import { loadFont } from "@remotion/google-fonts/Montserrat";

export const { fontFamily } = loadFont("normal", {
	weights: ["800"],
	subsets: ["latin"],
});

// TODO: reemplazar por el hex oficial de marca INPROC cuando se defina.
// Se reutiliza el dorado ya usado en la composición InprocPresupuesto
// para mantener consistencia visual entre ambos videos.
export const COLORS = {
	brand: "#E8B84B",
	bg: "#080B10",
	bgSoft: "#10161F",
	blueprint: "#1A2430",
	line: "#C7D2DC",
	white: "#FFFFFF",
	flashWhite: "#F5F3EE",
} as const;

export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;

export const SAFE_AREA = {
	top: 220,
	bottom: 420,
	left: 80,
	right: 180,
} as const;

export const SAFE_WIDTH = VIDEO_WIDTH - SAFE_AREA.left - SAFE_AREA.right;
export const SAFE_HEIGHT = VIDEO_HEIGHT - SAFE_AREA.top - SAFE_AREA.bottom;

export const fontHeavy = {
	fontFamily,
	fontWeight: 800 as const,
	textTransform: "uppercase" as const,
	letterSpacing: "0.08em",
};
