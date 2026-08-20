import { AbsoluteFill, Audio, Easing, staticFile, useCurrentFrame } from "remotion";
import { OpeningReveal } from "./OpeningReveal";
import {
	AngleMark,
	ConnectionNetwork,
	DimensionLine,
	GridRectangles,
} from "./BlueprintElements";
import { TitleText } from "./TitleText";
import { LogoSlot } from "./LogoSlot";
import { COLORS } from "./theme";
import { clampInterp } from "./utils";

const DUCK_LEVEL = 0.35;

const backgroundVolume = (frame: number) => {
	if (frame < 24) return 1;
	if (frame < 30) return clampInterp(frame, [24, 30], [1, DUCK_LEVEL]);
	if (frame < 108) return DUCK_LEVEL;
	if (frame < 114) return clampInterp(frame, [108, 114], [DUCK_LEVEL, 1]);
	return 1;
};

const sceneScale = (frame: number) => {
	if (frame < 30) return 1;
	if (frame < 114) return clampInterp(frame, [30, 114], [1, 1.12]);
	return clampInterp(frame, [114, 130], [1.12, 0.02], Easing.in(Easing.cubic));
};

const sceneOpacity = (frame: number) => {
	if (frame < 114) return 1;
	return clampInterp(frame, [114, 128], [1, 0]);
};

export const IntroInproc: React.FC = () => {
	const frame = useCurrentFrame();

	const flashScale = clampInterp(frame, [114, 142], [0, 2800], Easing.in(Easing.cubic));
	const flashOpacity = clampInterp(frame, [114, 124], [0, 1]);

	return (
		<AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
			<AbsoluteFill
				style={{
					background: `radial-gradient(circle at 50% 40%, ${COLORS.bgSoft} 0%, ${COLORS.bg} 70%)`,
				}}
			/>

			<AbsoluteFill
				style={{
					transform: `scale(${sceneScale(frame)})`,
					opacity: sceneOpacity(frame),
				}}
			>
				<OpeningReveal frame={frame} />
				<DimensionLine frame={frame} startFrame={34} x1={160} x2={620} y={780} />
				<AngleMark frame={frame} startFrame={46} cx={760} cy={900} />
				<GridRectangles frame={frame} startFrame={58} />
				<ConnectionNetwork frame={frame} startFrame={68} />
			</AbsoluteFill>

			<TitleText frame={frame} />

			<AbsoluteFill style={{ opacity: flashOpacity }}>
				<div
					style={{
						position: "absolute",
						left: "50%",
						top: "50%",
						width: flashScale,
						height: flashScale,
						marginLeft: -flashScale / 2,
						marginTop: -flashScale / 2,
						borderRadius: "50%",
						backgroundColor: COLORS.flashWhite,
					}}
				/>
			</AbsoluteFill>

			<LogoSlot frame={frame} />

			<Audio src={staticFile("intro_audio.wav")} volume={backgroundVolume} />

			{/*
			Cuando subas public/voz.mp3, descomentar (la locución ocupa la
			ventana de ducking del audio de fondo, frames 30-114):
			<Sequence from={30} durationInFrames={84}>
				<Audio src={staticFile("voz.mp3")} />
			</Sequence>
			*/}
		</AbsoluteFill>
	);
};
