import { loadFont } from "@remotion/google-fonts/Montserrat";

export const { fontFamily } = loadFont("normal", {
	weights: ["700", "900"],
	subsets: ["latin"],
});

export const COLORS = {
	bg: "#0F1B2A",
	bgSoft: "#16283D",
	white: "#FFFFFF",
	gold: "#E8B84B",
	alert: "#E85D4B",
	neutral: "#8FA3B8",
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
export const SAFE_CENTER_X = SAFE_AREA.left + SAFE_WIDTH / 2;
export const SAFE_CENTER_Y = SAFE_AREA.top + SAFE_HEIGHT / 2;

export const fontHeavy = {
	fontFamily,
	fontWeight: 900 as const,
	textTransform: "uppercase" as const,
	letterSpacing: "0.04em",
};

export const fontBold = {
	fontFamily,
	fontWeight: 700 as const,
	letterSpacing: "0.02em",
};
