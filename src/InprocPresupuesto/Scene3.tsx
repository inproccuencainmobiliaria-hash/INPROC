import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Background, SafeArea, Underline, WipeCut } from "./primitives";
import { Calculator, DocumentStack, Stamp } from "./icons";
import { COLORS, fontHeavy } from "./theme";
import { clampInterp, idleFloat } from "./utils";

export const Scene3: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const docsProgress = clampInterp(frame, [6, 40], [0, 1]);
	const stampCycle = ((frame + 10) % 70) / 70;
	const calcFloat = idleFloat(frame, 5, 0.05);

	const tramitesActive = frame >= 26 && frame < 122;
	const tramitesIn = Math.min(
		spring({ frame: frame - 30, fps, config: { damping: 13 }, durationInFrames: 16 }),
		1,
	);
	const tramitesOut = clampInterp(frame, [104, 118], [1, 0]);
	const tramitesX = (1 - tramitesIn) * -320 - (1 - tramitesOut) * 140;

	const impuestosActive = frame >= 118;
	const impuestosIn = Math.min(
		spring({ frame: frame - 120, fps, config: { damping: 13 }, durationInFrames: 16 }),
		1,
	);
	const impuestosX = (1 - impuestosIn) * 320;

	return (
		<>
			<Background />
			<WipeCut frame={frame} />
			<SafeArea>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						width: 720,
						marginBottom: 90,
						transform: `translateY(${idleFloat(frame, 4, 0.04)}px)`,
					}}
				>
					<DocumentStack progress={docsProgress} size={170} color={COLORS.white} accent={COLORS.gold} />
					<Stamp progress={stampCycle} size={140} color={COLORS.gold} />
					<Calculator frame={frame} size={150} color={COLORS.white} accent={COLORS.gold} style={{ transform: `translateY(${calcFloat}px)` }} />
				</div>

				<div style={{ height: 190, display: "flex", alignItems: "center", justifyContent: "center" }}>
					{tramitesActive ? (
						<div
							style={{
								opacity: tramitesIn * tramitesOut,
								transform: `translateX(${tramitesX}px)`,
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								gap: 16,
							}}
						>
							<div style={{ ...fontHeavy, color: COLORS.white, fontSize: 92 }}>
								TRÁMITES
							</div>
							<Underline progress={Math.min(tramitesIn, 1)} width={340} />
						</div>
					) : null}
					{impuestosActive ? (
						<div
							style={{
								opacity: impuestosIn,
								transform: `translateX(${impuestosX}px)`,
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								gap: 16,
							}}
						>
							<div style={{ ...fontHeavy, color: COLORS.white, fontSize: 84 }}>
								IMPUESTOS
							</div>
							<Underline progress={Math.min(impuestosIn, 1)} width={400} />
						</div>
					) : null}
				</div>
			</SafeArea>
		</>
	);
};
