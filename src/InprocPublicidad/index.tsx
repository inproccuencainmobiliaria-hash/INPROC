import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Scene1 } from "./Scene1";
import { Scene2 } from "./Scene2";
import { Scene3 } from "./Scene3";
import { Scene4 } from "./Scene4";
import { Scene5 } from "./Scene5";
import { COLORS } from "./theme";

const SCENES: Array<{ from: number; durationInFrames: number; Component: React.FC }> = [
	{ from: 0, durationInFrames: 90, Component: Scene1 },
	{ from: 90, durationInFrames: 120, Component: Scene2 },
	{ from: 210, durationInFrames: 120, Component: Scene3 },
	{ from: 330, durationInFrames: 120, Component: Scene4 },
	{ from: 450, durationInFrames: 90, Component: Scene5 },
];

export const InprocPublicidad: React.FC = () => {
	return (
		<AbsoluteFill style={{ backgroundColor: COLORS.navy }}>
			{SCENES.map(({ from, durationInFrames, Component }) => (
				<Sequence key={from} from={from} durationInFrames={durationInFrames}>
					<Component />
				</Sequence>
			))}

			<Audio src={staticFile("audio_publicidad.wav")} />

			{/*
			Huecos para narración, listos para descomentar cuando subas los
			archivos correspondientes a public/:
			<Sequence from={90}>
				<Audio src={staticFile("voz_01.mp3")} />
			</Sequence>
			<Sequence from={210}>
				<Audio src={staticFile("voz_02.mp3")} />
			</Sequence>
			<Sequence from={330}>
				<Audio src={staticFile("voz_03.mp3")} />
			</Sequence>
			*/}
		</AbsoluteFill>
	);
};

export { LIMITES_PROPIEDAD } from "./Scene3";
