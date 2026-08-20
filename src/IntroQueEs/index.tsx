import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { Lines } from "./Lines";
import { TitleReveal } from "./TitleReveal";
import { COLORS } from "./theme";
import { clampInterp } from "./utils";

const DUCK_LEVEL = 0.35;

const backgroundVolume = (frame: number) => {
	if (frame < 36) return 1;
	if (frame < 42) return clampInterp(frame, [36, 42], [1, DUCK_LEVEL]);
	if (frame < 84) return DUCK_LEVEL;
	if (frame < 90) return clampInterp(frame, [84, 90], [DUCK_LEVEL, 1]);
	return 1;
};

const sceneScale = (frame: number) => clampInterp(frame, [99, 120], [1, 1.08]);

export const IntroQueEs: React.FC = () => {
	const frame = useCurrentFrame();
	const lateGlow = clampInterp(frame, [99, 120], [0, 1]);

	return (
		<AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
			<AbsoluteFill
				style={{
					background: `radial-gradient(circle at 50% 45%, ${COLORS.bgSoft} 0%, ${COLORS.bg} 70%)`,
				}}
			/>
			<AbsoluteFill
				style={{
					background: `radial-gradient(circle at 50% 45%, ${COLORS.bgSoftLate} 0%, ${COLORS.bg} 70%)`,
					opacity: lateGlow,
				}}
			/>

			<AbsoluteFill style={{ transform: `scale(${sceneScale(frame)})` }}>
				<Lines frame={frame} />
				<TitleReveal frame={frame} />
			</AbsoluteFill>

			<Audio src={staticFile("audio_queeses.wav")} volume={backgroundVolume} />

			{/*
			Cuando subas public/voz_que_es.mp3, descomentar (la locución ocupa
			la ventana de ducking del audio de fondo, frames 42-90):
			<Sequence from={42} durationInFrames={48}>
				<Audio src={staticFile("voz_que_es.mp3")} />
			</Sequence>
			*/}
		</AbsoluteFill>
	);
};
