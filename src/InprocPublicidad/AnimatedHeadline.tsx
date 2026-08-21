import type { CSSProperties } from "react";
import { spring, useVideoConfig } from "remotion";
import { COLORS } from "./theme";
import { clampInterp } from "./utils";

// Título que entra palabra por palabra (spring escalonado) y remata con
// una línea de acento que se dibuja debajo. Mantiene el mismo texto y
// significado, solo cambia cómo se revela en pantalla.
export const AnimatedHeadline: React.FC<{
	frame: number;
	startFrame: number;
	text: string;
	style: CSSProperties;
	underline?: boolean;
	stagger?: number;
}> = ({ frame, startFrame, text, style, underline = true, stagger = 4 }) => {
	const { fps } = useVideoConfig();
	const words = text.split(" ");
	const lastWordFrame = startFrame + (words.length - 1) * stagger;
	const underlineP = clampInterp(frame, [lastWordFrame + 8, lastWordFrame + 22], [0, 1]);

	return (
		<div>
			<div
				style={{
					...style,
					display: "flex",
					flexWrap: "wrap",
					gap: "0 0.32em",
				}}
			>
				{words.map((word, i) => {
					const wordStart = startFrame + i * stagger;
					const p = Math.min(
						spring({
							frame: frame - wordStart,
							fps,
							config: { damping: 15, mass: 0.55 },
							durationInFrames: 18,
						}),
						1,
					);
					return (
						<span
							key={i}
							style={{
								display: "inline-block",
								opacity: p,
								transform: `translateY(${(1 - p) * 30}px)`,
							}}
						>
							{word}
						</span>
					);
				})}
			</div>
			{underline ? (
				<div
					style={{
						width: 84 * underlineP,
						height: 4,
						backgroundColor: COLORS.white,
						borderRadius: 2,
						marginTop: 14,
						opacity: underlineP,
					}}
				/>
			) : null}
		</div>
	);
};
