import { AbsoluteFill, Sequence } from "remotion";
import { COLORS } from "./theme";
import { Scene1 } from "./Scene1";
import { Scene2 } from "./Scene2";
import { Scene3 } from "./Scene3";
import { Scene4 } from "./Scene4";
import { Scene5 } from "./Scene5";
import { Scene6 } from "./Scene6";
import { Scene7 } from "./Scene7";
import { Scene8 } from "./Scene8";

const SCENES: Array<{ from: number; durationInFrames: number; Component: React.FC }> = [
	{ from: 0, durationInFrames: 120, Component: Scene1 },
	{ from: 120, durationInFrames: 180, Component: Scene2 },
	{ from: 300, durationInFrames: 210, Component: Scene3 },
	{ from: 510, durationInFrames: 210, Component: Scene4 },
	{ from: 720, durationInFrames: 180, Component: Scene5 },
	{ from: 900, durationInFrames: 150, Component: Scene6 },
	{ from: 1050, durationInFrames: 180, Component: Scene7 },
	{ from: 1230, durationInFrames: 120, Component: Scene8 },
];

export const InprocPresupuesto: React.FC = () => {
	return (
		<AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
			{SCENES.map(({ from, durationInFrames, Component }) => (
				<Sequence key={from} from={from} durationInFrames={durationInFrames}>
					<Component />
				</Sequence>
			))}
		</AbsoluteFill>
	);
};
