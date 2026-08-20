import { useCurrentFrame } from "remotion";
import { Background, SafeArea, WipeCut } from "./primitives";
import { GrowthBars, Lamp, PaintReveal } from "./icons";
import { COLORS, fontHeavy } from "./theme";
import { clampInterp, enterProgress, idleFloat } from "./utils";

const SPLIT = 110;

export const Scene4: React.FC = () => {
	const frame = useCurrentFrame();
	const phaseTwo = frame >= SPLIT;
	const localFrame = phaseTwo ? frame - SPLIT : frame;

	const titleP = enterProgress(localFrame, phaseTwo ? 8 : 20, 18);

	return (
		<>
			<Background />
			<WipeCut frame={frame} />
			<SafeArea>
				<div
					style={{
						opacity: titleP,
						transform: `translateY(${(1 - titleP) * 26}px)`,
						...fontHeavy,
						color: COLORS.white,
						fontSize: 76,
						marginBottom: 56,
						textAlign: "center",
					}}
				>
					{phaseTwo ? "ADECUACIONES" : "FINANCIAMIENTO"}
				</div>

				{phaseTwo ? (
					<>
						<WipeCut frame={localFrame} />
						<div style={{ transform: `translateY(${idleFloat(localFrame, 5, 0.05)}px)` }}>
							<PaintReveal
								progress={clampInterp(localFrame, [10, 80], [0, 1])}
								width={620}
								height={220}
								wallColor={COLORS.gold}
								rollerColor={COLORS.white}
							/>
						</div>
						<Lamp
							on={clampInterp(localFrame, [65, 95], [0, 1])}
							size={190}
							color={COLORS.white}
							glow={COLORS.gold}
							style={{ marginTop: 20 }}
						/>
					</>
				) : (
					<div style={{ transform: `translateY(${idleFloat(frame, 5, 0.05)}px)` }}>
						<GrowthBars
							progress={clampInterp(frame, [10, 90], [0, 1])}
							width={620}
							height={280}
							color={COLORS.neutral}
							accent={COLORS.gold}
						/>
					</div>
				)}
			</SafeArea>
		</>
	);
};
