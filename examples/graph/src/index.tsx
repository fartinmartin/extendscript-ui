import { jsx, createWindow, onWindow, uniqueId } from "extendscript-ui";
import { SVG, drawSVG } from "extendscript-ui";
import { map, reduce } from "extendscript-ponyfills";

interface Point {
	anchor: number[];
	handleIn?: number[];
	handleOut?: number[];
}

interface GraphProps {
	size: number[];
	points: Point[];
}

const Graph = SVG(({ size, points }: GraphProps) => {
	const pathData = reduce(
		points,
		(acc, point, i, arr) => {
			if (i === 0) return `M ${point.anchor[0]} ${point.anchor[1]}`;
			const prev = arr[i - 1];
			const cp1 = prev.handleOut ?? prev.anchor;
			const cp2 = point.handleIn ?? point.anchor;
			return (
				acc +
				` C ${cp1[0]} ${cp1[1]}, ${cp2[0]} ${cp2[1]}, ${point.anchor[0]} ${point.anchor[1]}`
			);
		},
		"",
	) as string;

	return (
		<svg width={size[0]} height={size[1]}>
			<path d={pathData} fill="none" stroke="#333" strokeWidth="2" />
			{map(points, ({ anchor, handleIn, handleOut }) => (
				<g>
					{handleIn && (
						<g>
							<line
								x1={anchor[0]}
								y1={anchor[1]}
								x2={handleIn[0]}
								y2={handleIn[1]}
								stroke="#999"
							/>
							<circle cx={handleIn[0]} cy={handleIn[1]} r={4} fill="#999" />
						</g>
					)}
					{handleOut && (
						<g>
							<line
								x1={anchor[0]}
								y1={anchor[1]}
								x2={handleOut[0]}
								y2={handleOut[1]}
								stroke="#999"
							/>
							<circle cx={handleOut[0]} cy={handleOut[1]} r={4} fill="#999" />
						</g>
					)}
					<circle cx={anchor[0]} cy={anchor[1]} r={5} fill="#333" />
				</g>
			))}
		</svg>
	);
});

interface MouseEvent extends UIEvent {
	clientX: number;
	clientY: number;
}

const ExampleUI = () => {
	const size = [400, 300];
	const id = uniqueId("graph");

	let activeIndex: number | null = null;
	const path = [
		{
			anchor: [60, 140],
			handleOut: [100, 100],
		},
		{
			anchor: [150, 100],
			handleIn: [120, 120],
			handleOut: [180, 80],
		},
		{
			anchor: [240, 140],
			handleIn: [210, 120],
		},
	];

	function findIndex(x: number, y: number, points: Point[]) {
		const HIT_RADIUS = 10;

		for (let i = 0; i < points.length; i++) {
			const [px, py] = points[i].anchor;

			const dx = px - x;
			const dy = py - y;

			if (dx * dx + dy * dy < HIT_RADIUS * HIT_RADIUS) return i;
		}

		return null;
	}

	function getBounds(el: _Control) {
		const bounds = el.bounds;
		return [bounds.left ?? bounds.x ?? 0, bounds.top ?? bounds.y ?? 0];
	}

	onWindow((window) => {
		const graph = (window as any).findElement(id) as Button;

		graph.addEventListener("mousedown", (e: MouseEvent) => {
			const [offsetX, offsetY] = getBounds(graph);

			// handle margins?
			const x = e.clientX - offsetX;
			const y = e.clientY - offsetY;

			const idx = findIndex(x, y, path);
			if (idx !== null) activeIndex = idx;
		});

		graph.addEventListener("mouseup", () => {
			// doesn't work?
			activeIndex = null;
		});

		graph.addEventListener("mousemove", (e: MouseEvent) => {
			if (activeIndex === null) return;
			const [offsetX, offsetY] = getBounds(graph);

			// handle margins?
			const x = e.clientX - offsetX;
			const y = e.clientY - offsetY;

			path[activeIndex].anchor = [x, y];
			graph.notify("onDraw");
		});
	});

	return (
		<palette text="graph" size={size} margins={0}>
			<button
				size={size}
				properties={{ name: id }}
				onDraw={function (this: Button /*, drawState: DrawState */) {
					const svg = Graph({ size, points: path });
					drawSVG(svg, this.graphics);
				}}
			></button>
		</palette>
	);
};

const window = createWindow(ExampleUI);
window.show();
