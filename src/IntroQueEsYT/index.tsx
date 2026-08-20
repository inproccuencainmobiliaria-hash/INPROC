import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { Lines } from "./Lines";
import { SideTechnical } from "./SideTechnical";
import { TitleAndLogo } from "./TitleAndLogo";
import { COLORS } from "./theme";
import { clampInterp } from "./utils";

const DUCK_LEVEL = 0.35;

const backgroundVolume = (frame: number) => {
	if (frame < 24) return 1;
	if (frame < 30) return clampInterp(frame, [24, 30], [1, DUCK_LEVEL]);
	if (frame < 69) return DUCK_LEVEL;
	if (frame < 75) return clampInterp(frame, [69, 75], [DUCK_LEVEL, 1]);
	return 1;
};

const sceneScale = (frame: number) => clampInterp(frame, [75, 120], [1, 1.05]);

export const IntroQueEsYT: React.FC = () => {
	const frame = useCurrentFrame();
	const lateGlow = clampInterp(frame, [75, 120], [0, 1]);

	return (
		<AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
			<AbsoluteFill
				style={{
					background: `radial-gradient(circle at 50% 48%, ${COLORS.bgCenter} 0%, ${COLORS.bg} 72%)`,
				}}
			/>
			<AbsoluteFill
				style={{
					background: `radial-gradient(circle at 50% 48%, ${COLORS.bgCenter} 0%, ${COLORS.bg} 55%)`,
					opacity: lateGlow,
				}}
			/>

			<AbsoluteFill style={{ transform: `scale(${sceneScale(frame)})` }}>
				<Lines frame={frame} />
				<SideTechnical frame={frame} />
				<TitleAndLogo frame={frame} />
			</AbsoluteFill>

			<Audio src={staticFile("audio_queeses_yt.wav")} volume={backgroundVolume} />

			{/*
			Cuando subas public/voz_que_es.mp3, descomentar (la locución ocupa
			la ventana de ducking del audio de fondo, frames 30-75):
			<Sequence from={30} durationInFrames={45}>
				<Audio src={staticFile("voz_que_es.mp3")} />
			</Sequence>
			*/}
		</AbsoluteFill>
	);
};
