import { spring, useVideoConfig } from "remotion";
import { SAFE_AREA, SAFE_WIDTH, COLORS, fontHeavy } from "./theme";
import { clampInterp } from "./utils";

type Entry = { text: string; frame: number; line: 1 | 2 };

const ENTRIES: Entry[] = [
	{ text: "CUANDO", frame: 36, line: 1 },
	{ text: "UNA NECESIDAD", frame: 48, line: 1 },
	{ text: "EXIGE", frame: 62, line: 1 },
	{ text: "UNA SOLUCIÓN", frame: 76, line: 2 },
	{ text: "DIFERENTE...", frame: 88, line: 2 },
];

const Word: React.FC<{ entry: Entry; frame: number }> = ({ entry, frame }) => {
	const { fps } = useVideoConfig();
	const p = Math.min(
		spring({
			frame: frame - entry.frame,
			fps,
			config: { damping: 14, mass: 0.6 },
			durationInFrames: 18,
		}),
		1,
	);
	return (
		<span
			style={{
				display: "inline-block",
				opacity: p,
				transform: `translateY(${(1 - p) * 34}px)`,
				color: entry.line === 2 ? COLORS.brand : COLORS.white,
			}}
		>
			{entry.text}
		</span>
	);
};

export const TitleText: React.FC<{ frame: number }> = ({ frame }) => {
	const exitOpacity = clampInterp(frame, [114, 128], [1, 0]);
	const exitTranslate = clampInterp(frame, [114, 134], [0, -70]);

	const line1 = ENTRIES.filter((e) => e.line === 1 && frame >= e.frame);
	const line2 = ENTRIES.filter((e) => e.line === 2 && frame >= e.frame);

	if (line1.length === 0 && line2.length === 0) {
		return null;
	}

	return (
		<div
			style={{
				position: "absolute",
				top: SAFE_AREA.top,
				left: SAFE_AREA.left,
				width: SAFE_WIDTH,
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "flex-start",
				paddingTop: 120,
				opacity: exitOpacity,
				transform: `translateY(${exitTranslate}px)`,
			}}
		>
			<div
				style={{
					...fontHeavy,
					fontSize: 37,
					lineHeight: 1.3,
					textAlign: "center",
					display: "flex",
					flexWrap: "wrap",
					justifyContent: "center",
					gap: "0 14px",
					whiteSpace: "nowrap",
				}}
			>
				{line1.map((e) => (
					<Word key={e.text} entry={e} frame={frame} />
				))}
			</div>
			<div
				style={{
					...fontHeavy,
					fontSize: 37,
					lineHeight: 1.3,
					textAlign: "center",
					display: "flex",
					flexWrap: "wrap",
					justifyContent: "center",
					gap: "0 14px",
					marginTop: 6,
					whiteSpace: "nowrap",
				}}
			>
				{line2.map((e) => (
					<Word key={e.text} entry={e} frame={frame} />
				))}
			</div>
		</div>
	);
};
