import { useCurrentFrame } from "remotion";
import { Background, SafeArea, WipeCut } from "./primitives";
import { PhoneShare } from "./icons";
import { COLORS, fontHeavy, fontBold } from "./theme";
import { enterProgress, idleBreath } from "./utils";

export const Scene8: React.FC = () => {
	const frame = useCurrentFrame();

	const iconP = enterProgress(frame, 4, 18);
	const breathe = idleBreath(frame, 0.02, 0.05);
	const arrowCycle = ((frame + 6) % 55) / 55;
	const titleP = enterProgress(frame, 30, 18);
	const subtitleP = enterProgress(frame, 48, 16);

	return (
		<>
			<Background />
			<WipeCut frame={frame} />
			<SafeArea style={{ justifyContent: "flex-start", paddingTop: 90 }}>
				<div
					style={{
						opacity: iconP,
						transform: `scale(${iconP * breathe})`,
						marginBottom: 30,
					}}
				>
					<PhoneShare
						size={190}
						color={COLORS.white}
						accent={COLORS.gold}
						arrowProgress={arrowCycle}
					/>
				</div>
				<div
					style={{
						opacity: titleP,
						transform: `translateY(${(1 - titleP) * 24}px)`,
						...fontHeavy,
						color: COLORS.gold,
						fontSize: 88,
						textAlign: "center",
					}}
				>
					COMPÁRTELO
				</div>
				<div
					style={{
						opacity: subtitleP,
						transform: `translateY(${(1 - subtitleP) * 20}px)`,
						...fontBold,
						color: COLORS.white,
						fontSize: 38,
						textAlign: "center",
						marginTop: 20,
						maxWidth: 620,
					}}
				>
					Con alguien que esté buscando casa
				</div>
			</SafeArea>
		</>
	);
};
