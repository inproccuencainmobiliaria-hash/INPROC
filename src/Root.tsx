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
		</>
	);
};
