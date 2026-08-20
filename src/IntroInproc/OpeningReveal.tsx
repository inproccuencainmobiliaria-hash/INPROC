import { TechnicalGrid } from "./BlueprintElements";
import { COLORS, VIDEO_HEIGHT, VIDEO_WIDTH } from "./theme";
import { clampInterp, easeOut } from "./utils";

// Frames 0-30: una línea fina de luz se expande desde el centro hacia los
// lados; a su paso va revelando la retícula técnica que queda detrás.
export const OpeningReveal: React.FC<{ frame: number }> = ({ frame }) => {
	const widthPct = clampInterp(frame, [0, 30], [0, 100], easeOut);
	const lineOpacity = clampInterp(frame, [0, 6, 26, 32], [0, 1, 1, 0]);
	const inset = (100 - widthPct) / 2;

	return (
		<>
			<div
				style={{
					position: "absolute",
					inset: 0,
					clipPath: `inset(0 ${inset}% 0 ${inset}%)`,
				}}
			>
				<TechnicalGrid width={VIDEO_WIDTH} height={VIDEO_HEIGHT} />
			</div>
			<div
				style={{
					position: "absolute",
					left: `${inset}%`,
					right: `${inset}%`,
					top: "50%",
					height: 2,
					transform: "translateY(-50%)",
					backgroundColor: COLORS.brand,
					opacity: lineOpacity,
					boxShadow: `0 0 24px 2px ${COLORS.brand}`,
				}}
			/>
		</>
	);
};
