import type { CSSProperties, PropsWithChildren } from "react";
import { AbsoluteFill, Img } from "remotion";
import { SAFE_AREA, SAFE_WIDTH, SAFE_HEIGHT, COLORS, fontBold } from "./theme";
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
	translateXPixels?: number;
	translateYPixels?: number;
}> = ({ src, scale, translateXPixels = 0, translateYPixels = 0 }) => (
	<AbsoluteFill style={{ overflow: "hidden" }}>
		<Img
			src={src}
			style={{
				width: "100%",
				height: "100%",
				objectFit: "cover",
				transform: `translate(${translateXPixels}px, ${translateYPixels}px) scale(${scale})`,
				transformOrigin: "center center",
			}}
		/>
	</AbsoluteFill>
);

// Degradado superior para asegurar legibilidad del texto sobre la foto.
// Es una capa aparte por encima de la imagen: la fotografía en sí no se
// toca ni se le aplica ningún filtro.
export const TopScrim: React.FC<{ opacity: number }> = ({ opacity }) => (
	<AbsoluteFill
		style={{
			opacity,
			background:
				"linear-gradient(180deg, rgba(8,12,24,0.65) 0%, rgba(8,12,24,0.28) 38%, rgba(8,12,24,0) 62%)",
		}}
	/>
);

// Corte tipo "cuchilla": un panel con borde diagonal que barre la pantalla
// al entrar una escena, con una línea de acento sobre el filo del corte.
export const BladeWipe: React.FC<
	PropsWithChildren<{
		frame: number;
		duration?: number;
		accent?: string;
	}>
> = ({ frame, duration = 16, accent = COLORS.white, children }) => {
	const leadX = clampInterp(frame, [0, duration], [112, -24], easeOut);
	const slant = 9;
	const trailX = leadX + slant;
	const clip = `polygon(${leadX}% 0%, 100% 0%, 100% 100%, ${trailX}% 100%)`;
	const stripClip = `polygon(${leadX}% 0%, ${leadX + 1.4}% 0%, ${trailX + 1.4}% 100%, ${trailX}% 100%)`;
	const stripOpacity = clampInterp(frame, [0, duration * 0.7, duration], [0.9, 0.9, 0]);

	return (
		<AbsoluteFill style={{ clipPath: clip }}>
			{children}
			<AbsoluteFill
				style={{
					clipPath: stripClip,
					backgroundColor: accent,
					opacity: stripOpacity,
					pointerEvents: "none",
				}}
			/>
		</AbsoluteFill>
	);
};

// Marcas de encuadre en las esquinas de la zona segura, estilo visor
// fotográfico/dron. Puramente decorativas, no representan datos.
export const CornerBrackets: React.FC<{ progress: number; color?: string }> = ({
	progress,
	color = COLORS.white,
}) => {
	const size = 46;
	const thickness = 3;
	const inset = -34;
	const corners: Array<{ top?: number; bottom?: number; left?: number; right?: number; rotate: number }> = [
		{ top: inset, left: inset, rotate: 0 },
		{ top: inset, right: inset, rotate: 90 },
		{ bottom: inset, right: inset, rotate: 180 },
		{ bottom: inset, left: inset, rotate: 270 },
	];

	return (
		<>
			{corners.map((c, i) => (
				<div
					key={i}
					style={{
						position: "absolute",
						top: c.top,
						bottom: c.bottom,
						left: c.left,
						right: c.right,
						width: size,
						height: size,
						opacity: progress,
						transform: `rotate(${c.rotate}deg) scale(${0.7 + 0.3 * progress})`,
					}}
				>
					<div
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							width: size * progress,
							height: thickness,
							backgroundColor: color,
						}}
					/>
					<div
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							width: thickness,
							height: size * progress,
							backgroundColor: color,
						}}
					/>
				</div>
			))}
		</>
	);
};

const IconHome: React.FC = () => (
	<svg width={18} height={18} viewBox="0 0 24 24" fill="none">
		<path d="M4 11.5 12 4l8 7.5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
		<path d="M6 10v9h12v-9" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

const IconSofa: React.FC = () => (
	<svg width={18} height={18} viewBox="0 0 24 24" fill="none">
		<rect x={5} y={5} width={14} height={10} rx={2.5} fill="currentColor" opacity={0.55} />
		<rect x={2.5} y={11} width={19} height={7} rx={2.5} fill="currentColor" />
		<rect x={3.5} y={18} width={2.4} height={3} rx={1} fill="currentColor" />
		<rect x={18.1} y={18} width={2.4} height={3} rx={1} fill="currentColor" />
	</svg>
);

const IconPool: React.FC = () => (
	<svg width={18} height={18} viewBox="0 0 24 24" fill="none">
		<path
			d="M3 9c1.5 1.4 3 1.4 4.5 0s3-1.4 4.5 0 3 1.4 4.5 0 3-1.4 4.5 0"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
		/>
		<path
			d="M3 15c1.5 1.4 3 1.4 4.5 0s3-1.4 4.5 0 3 1.4 4.5 0 3-1.4 4.5 0"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
		/>
	</svg>
);

const ICONS = { home: IconHome, sofa: IconSofa, pool: IconPool } as const;

// Etiqueta breve que nombra lo que ya se ve en pantalla (no agrega datos,
// solo identifica el ambiente de la foto).
export const RoomTag: React.FC<{
	icon: keyof typeof ICONS;
	label: string;
	progress: number;
}> = ({ icon, label, progress }) => {
	const Icon = ICONS[icon];
	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				gap: 10,
				opacity: progress,
				transform: `translateX(${(1 - progress) * -18}px)`,
				padding: "10px 18px 10px 14px",
				borderRadius: 999,
				backgroundColor: "rgba(8,12,24,0.4)",
				border: "1px solid rgba(255,255,255,0.35)",
				color: COLORS.white,
				width: "fit-content",
			}}
		>
			<Icon />
			<span style={{ ...fontBold, fontSize: 20, letterSpacing: "0.06em" }}>{label}</span>
		</div>
	);
};
