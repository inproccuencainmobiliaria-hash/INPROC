import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Background, SafeArea, WipeCut } from "./primitives";
import { Drop, MovingBox, Wrench } from "./icons";
import { COLORS, fontHeavy } from "./theme";
import { clampInterp, enterProgress } from "./utils";

const SPLIT = 90;
const BOXES = [0, 1, 2, 3];

export const Scene5: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const boxesOut = clampInterp(frame, [SPLIT - 6, SPLIT + 14], [1, 0]);
	const mudanzaTitleP = enterProgress(frame, 8, 16) * boxesOut;

	const localFrame2 = frame - SPLIT;
	const mantenimientoActive = frame >= SPLIT - 4;
	const mantenimientoP = enterProgress(frame, SPLIT + 6, 18);

	const wrenchRotate = Math.sin(Math.max(localFrame2, 0) * 0.14) * 22;
	const dripCycle = ((Math.max(localFrame2, 0) + 10) % 42) / 42;
	const dripY = dripCycle * 46;
	const dripOpacity = clampInterp(dripCycle, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

	return (
		<>
			<Background />
			<WipeCut frame={frame} />
			<SafeArea>
				<div
					style={{
						opacity: mudanzaTitleP,
						...fontHeavy,
						color: COLORS.white,
						fontSize: 80,
						marginBottom: 50,
					}}
				>
					MUDANZA
				</div>

				{boxesOut > 0.01 ? (
					<div
						style={{
							opacity: boxesOut,
							display: "flex",
							flexDirection: "column-reverse",
							alignItems: "center",
						}}
					>
						{BOXES.map((i) => {
							const start = 14 + i * 15;
							const p = spring({
								frame: frame - start,
								fps,
								config: { damping: 8, mass: 0.6 },
								durationInFrames: 20,
							});
							const clamped = Math.min(p, 1.1);
							const translateY = (1 - Math.min(p, 1)) * -260;
							return (
								<div
									key={i}
									style={{
										transform: `translateY(${translateY}px) scale(${clamped})`,
										opacity: Math.min(p, 1),
										marginTop: i === 0 ? 0 : -14,
									}}
								>
									<MovingBox size={128} color={i % 2 === 0 ? COLORS.white : COLORS.gold} />
								</div>
							);
						})}
					</div>
				) : null}

				{mantenimientoActive ? (
					<div
						style={{
							position: "absolute",
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							gap: 40,
						}}
					>
						<div
							style={{
								opacity: mantenimientoP,
								...fontHeavy,
								color: COLORS.white,
								fontSize: 76,
								marginBottom: 10,
							}}
						>
							MANTENIMIENTO
						</div>
						<div
							style={{
								opacity: mantenimientoP,
								display: "flex",
								alignItems: "flex-start",
								gap: 60,
							}}
						>
							<Wrench size={140} color={COLORS.white} style={{ transform: `rotate(${wrenchRotate}deg)` }} />
							<Drop
								size={60}
								color={COLORS.gold}
								style={{ transform: `translateY(${dripY}px)`, opacity: dripOpacity }}
							/>
						</div>
					</div>
				) : null}
			</SafeArea>
		</>
	);
};
