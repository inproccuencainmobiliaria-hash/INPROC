import { Img, spring, staticFile, useVideoConfig } from "remotion";
import { COLORS, fontHeavy } from "./theme";
import { clampInterp } from "./utils";

const LOGO_HEIGHT = 420;

export const TitleAndLogo: React.FC<{ frame: number }> = ({ frame }) => {
	const { fps } = useVideoConfig();

	const titleP = Math.min(
		spring({ frame: frame - 36, fps, config: { damping: 14, mass: 0.6 }, durationInFrames: 18 }),
		1,
	);
	const titleOpacity = clampInterp(frame, [36, 50], [0, 1]);

	const logoP = Math.min(
		spring({ frame: frame - 50, fps, config: { damping: 16, mass: 0.7 }, durationInFrames: 22 }),
		1,
	);
	const logoOpacity = clampInterp(frame, [50, 66], [0, 1]);
	const logoScale = 0.88 + 0.12 * logoP;

	return (
		<div
			style={{
				position: "absolute",
				left: 0,
				top: 0,
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			{frame >= 34 ? (
				<div
					style={{
						...fontHeavy,
						fontSize: 90,
						color: COLORS.brand,
						opacity: titleOpacity,
						transform: `translateY(${(1 - titleP) * 50}px)`,
					}}
				>
					¿QUÉ ES?
				</div>
			) : null}
			{frame >= 48 ? (
				<Img
					src={staticFile("logo_inproc.png")}
					style={{
						height: LOGO_HEIGHT,
						width: "auto",
						marginTop: 40,
						opacity: logoOpacity,
						transform: `scale(${logoScale})`,
					}}
				/>
			) : null}
		</div>
	);
};
