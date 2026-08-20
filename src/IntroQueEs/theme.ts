import { loadFont } from "@remotion/google-fonts/Montserrat";

export const { fontFamily } = loadFont("normal", {
	weights: ["900"],
	subsets: ["latin"],
});

// TODO: reemplazar por el hex oficial de marca INPROC cuando se defina.
// Se reutiliza el dorado ya usado en InprocPresupuesto e IntroInproc para
// mantener consistencia visual entre los tres videos.
export const COLORS = {
	brand: "#E8B84B",
	bg: "#080B10",
	bgSoft: "#10161F",
	bgSoftLate: "#161F2B",
	blueprint: "#1A2430",
	line: "#C7D2DC",
	white: "#FFFFFF",
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
export const CENTER_X = VIDEO_WIDTH / 2;
export const CENTER_Y = VIDEO_HEIGHT / 2;

export const fontHeavy = {
	fontFamily,
	fontWeight: 900 as const,
	textTransform: "uppercase" as const,
	letterSpacing: "0.08em",
};
