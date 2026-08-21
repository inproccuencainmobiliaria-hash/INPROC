import { AbsoluteFill, Img, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SafeArea } from "./primitives";
import { COLORS, fontMedium, SAFE_WIDTH } from "./theme";
import { clampInterp, easeOut } from "./utils";

const LOGO_HEIGHT = 520;

export const Scene4: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const wipeP = clampInterp(frame, [0, 12], [0, 100], easeOut);

	const logoP = Math.min(
		spring({ frame: frame - 12, fps, config: { damping: 16, mass: 0.7 }, durationInFrames: 26 }),
		1,
	);
	const logoOpacity = clampInterp(frame, [12, 30], [0, 1]);
	const logoScale = 0.9 + 0.1 * logoP;

	const textP = clampInterp(frame, [40, 56], [0, 1]);

	const linesP = clampInterp(frame, [18, 46], [0, 1], easeOut);
	const lineMaxWidth = 320;

	return (
		<AbsoluteFill style={{ backgroundColor: COLORS.white }}>
			<AbsoluteFill
				style={{
					backgroundColor: COLORS.navy,
					transform: `translateY(${-wipeP}%)`,
				}}
			/>

			<SafeArea
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<div
					style={{
						position: "relative",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<div
						style={{
							position: "absolute",
							top: "50%",
							right: `calc(100% + 30px)`,
							width: lineMaxWidth * linesP,
							height: 2,
							backgroundColor: COLORS.navy,
							opacity: 0.2,
							transform: "translateY(-50%)",
						}}
					/>
					<div
						style={{
							position: "absolute",
							top: "50%",
							left: `calc(100% + 30px)`,
							width: lineMaxWidth * linesP,
							height: 2,
							backgroundColor: COLORS.navy,
							opacity: 0.2,
							transform: "translateY(-50%)",
						}}
					/>

					<Img
						src={staticFile("logo_inproc.png")}
						style={{
							height: LOGO_HEIGHT,
							width: "auto",
							opacity: logoOpacity,
							transform: `scale(${logoScale})`,
						}}
					/>
					<div
						style={{
							...fontMedium,
							color: COLORS.navy,
							fontSize: 40,
							marginTop: 30,
							opacity: textP,
							transform: `translateY(${(1 - textP) * 16}px)`,
							textAlign: "center",
							maxWidth: SAFE_WIDTH,
						}}
					>
						INPROC Bienes Raíces
					</div>
				</div>
			</SafeArea>
		</AbsoluteFill>
	);
};
