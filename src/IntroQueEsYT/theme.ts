import { loadFont } from "@remotion/google-fonts/Montserrat";

export const { fontFamily } = loadFont("normal", {
	weights: ["800"],
	subsets: ["latin"],
});

export const COLORS = {
	brand: "#16264F",
	bg: "#F4F5F7",
	bgCenter: "#FFFFFF",
	blueprint: "#DDE1E8",
	white: "#FFFFFF",
} as const;

export const VIDEO_WIDTH = 1920;
export const VIDEO_HEIGHT = 1080;

export const SAFE_AREA = {
	top: 96,
	bottom: 130,
	left: 96,
	right: 96,
} as const;

export const SAFE_WIDTH = VIDEO_WIDTH - SAFE_AREA.left - SAFE_AREA.right;
export const SAFE_HEIGHT = VIDEO_HEIGHT - SAFE_AREA.top - SAFE_AREA.bottom;
export const CENTER_X = VIDEO_WIDTH / 2;
export const CENTER_Y = VIDEO_HEIGHT / 2;

export const fontHeavy = {
	fontFamily,
	fontWeight: 800 as const,
	textTransform: "uppercase" as const,
	letterSpacing: "0.08em",
};
