import type { CSSProperties, PropsWithChildren } from "react";
import { AbsoluteFill, Img } from "remotion";
import { SAFE_AREA, SAFE_WIDTH, SAFE_HEIGHT } from "./theme";
import { clampInterp, easeOut } from "./utils";

export const SafeArea: React.FC<PropsWithChildren<{ style?: CSSProperties }>> = ({
	children,
	style,
}) => (
	<div
		style={{
			position: "absolute",
			top: SAFE_AREA.top,
			left: SAFE_AREA.left,
			width: SAFE_WIDTH,
			height: SAFE_HEIGHT,
			...style,
		}}
	>
		{children}
	</div>
);

// Foto a pantalla completa con movimiento tipo Ken Burns: solo escala y
// desplazamiento, la fotografía en sí no se altera de ninguna otra forma.
export const KenBurnsPhoto: React.FC<{
	src: string;
	scale: number;
	translateYPixels?: number;
}> = ({ src, scale, translateYPixels = 0 }) => (
	<AbsoluteFill style={{ overflow: "hidden" }}>
		<Img
			src={src}
			style={{
				width: "100%",
				height: "100%",
				objectFit: "cover",
				transform: `translateY(${translateYPixels}px) scale(${scale})`,
				transformOrigin: "center center",
			}}
		/>
	</AbsoluteFill>
);

// Corte con desplazamiento lateral: revela la escena progresivamente de un
// lado al otro durante los primeros `duration` frames locales de la escena.
export const LateralWipeReveal: React.FC<
	PropsWithChildren<{ frame: number; duration?: number; fromRight?: boolean }>
> = ({ frame, duration = 10, fromRight = false, children }) => {
	const p = clampInterp(frame, [0, duration], [0, 100], easeOut);
	const clip = fromRight ? `inset(0 0 0 ${100 - p}%)` : `inset(0 ${100 - p}% 0 0)`;
	return <AbsoluteFill style={{ clipPath: clip }}>{children}</AbsoluteFill>;
};
