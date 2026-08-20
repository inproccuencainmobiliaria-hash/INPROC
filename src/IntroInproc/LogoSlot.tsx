import { interpolate } from "remotion";

// Hueco reservado para el logo. Por ahora no renderiza nada visible: solo
// deja lista la animación de opacidad (0 -> 0.25 entre frames 120 y 150)
// para cuando exista public/logo.png.
export const LogoSlot: React.FC<{ frame: number }> = ({ frame }) => {
	const opacity = interpolate(frame, [120, 150], [0, 0.25], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	return (
		<div
			style={{
				position: "absolute",
				left: "50%",
				top: "50%",
				transform: "translate(-50%, -50%)",
				width: 260,
				height: 260,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				opacity,
			}}
		>
			{/* Cuando exista public/logo.png, descomentar: */}
			{/* <Img
				src={staticFile("logo.png")}
				style={{ width: "100%", height: "100%", objectFit: "contain" }}
			/> */}
		</div>
	);
};
