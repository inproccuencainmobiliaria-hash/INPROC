import "./index.css";
import { Composition } from "remotion";
import { InprocPresupuesto } from "./InprocPresupuesto";
import { VIDEO_WIDTH, VIDEO_HEIGHT } from "./InprocPresupuesto/theme";
import { IntroInproc } from "./IntroInproc";
import {
	VIDEO_WIDTH as INTRO_WIDTH,
	VIDEO_HEIGHT as INTRO_HEIGHT,
} from "./IntroInproc/theme";
import { IntroQueEs } from "./IntroQueEs";
import {
	VIDEO_WIDTH as QUEES_WIDTH,
	VIDEO_HEIGHT as QUEES_HEIGHT,
} from "./IntroQueEs/theme";
import { IntroQueEsYT } from "./IntroQueEsYT";
import {
	VIDEO_WIDTH as QUEES_YT_WIDTH,
	VIDEO_HEIGHT as QUEES_YT_HEIGHT,
} from "./IntroQueEsYT/theme";
import { InprocPublicidad } from "./InprocPublicidad";
import {
	VIDEO_WIDTH as PUBLICIDAD_WIDTH,
	VIDEO_HEIGHT as PUBLICIDAD_HEIGHT,
} from "./InprocPublicidad/theme";

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="InprocPresupuesto"
				component={InprocPresupuesto}
				durationInFrames={1350}
				fps={30}
				width={VIDEO_WIDTH}
				height={VIDEO_HEIGHT}
			/>
			<Composition
				id="IntroInproc"
				component={IntroInproc}
				durationInFrames={150}
				fps={30}
				width={INTRO_WIDTH}
				height={INTRO_HEIGHT}
			/>
			<Composition
				id="IntroQueEs"
				component={IntroQueEs}
				durationInFrames={120}
				fps={30}
				width={QUEES_WIDTH}
				height={QUEES_HEIGHT}
			/>
			<Composition
				id="IntroQueEsYT"
				component={IntroQueEsYT}
				durationInFrames={120}
				fps={30}
				width={QUEES_YT_WIDTH}
				height={QUEES_YT_HEIGHT}
			/>
			<Composition
				id="InprocPublicidad"
				component={InprocPublicidad}
				durationInFrames={540}
				fps={30}
				width={PUBLICIDAD_WIDTH}
				height={PUBLICIDAD_HEIGHT}
			/>
		</>
	);
};
