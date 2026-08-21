import { loadFont } from "@remotion/google-fonts/Montserrat";

export const { fontFamily } = loadFont("normal", {
	weights: ["600", "800"],
	subsets: ["latin"],
});

export const COLORS = {
	navy: "#16264F",
	white: "#FFFFFF",
	// Tinte claro derivado del azul corporativo, para acentos y brillos
	// sutiles (no es una marca nueva, es el mismo #16264F aclarado).
	skyAccent: "#7C93C9",
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

export const fontMedium = {
	fontFamily,
	fontWeight: 600 as const,
};

export const fontBold = {
	fontFamily,
	fontWeight: 800 as const,
	textTransform: "uppercase" as const,
	letterSpacing: "0.02em",
};

export const textShadow = "0 2px 18px rgba(0,0,0,0.55), 0 1px 4px rgba(0,0,0,0.5)";
