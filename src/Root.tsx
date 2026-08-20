import "./index.css";
import { Composition } from "remotion";
import { InprocPresupuesto } from "./InprocPresupuesto";
import { VIDEO_WIDTH, VIDEO_HEIGHT } from "./InprocPresupuesto/theme";

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
		</>
	);
};
