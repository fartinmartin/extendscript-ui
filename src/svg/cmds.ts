export function createCmds(g: ScriptUIGraphics) {
	let last: Point = [0, 0] as Point;
	let lastCtrl: Point | null = null;

	return {
		M: ([x, y]) => (last = g.moveTo(x, y)),
		m: ([x, y]) => (last = g.moveTo(last[0] + x, last[1] + y)),
		L: ([x, y]) => (last = g.lineTo(x, y)),
		l: ([x, y]) => (last = g.lineTo(last[0] + x, last[1] + y)),
		H: ([x]) => (last = g.lineTo(x, last[1])),
		h: ([x]) => (last = g.lineTo(last[0] + x, last[1])),
		V: ([y]) => (last = g.lineTo(last[0], y)),
		v: ([y]) => (last = g.lineTo(last[0], last[1] + y)),
		Z: () => g.closePath(),
		z: () => g.closePath(),

		C: ([x1, y1, x2, y2, x, y]) => {
			for (let t = 0.1; t <= 1; t += 0.1) {
				const pt = bezierPoint(last, [x1, y1], [x2, y2], [x, y], t);
				g.lineTo(pt[0], pt[1]);
			}
			last = [x, y] as Point;
			lastCtrl = [x2, y2] as Point;
		},
		c: ([x1, y1, x2, y2, x, y]) => {
			const p1 = [last[0] + x1, last[1] + y1];
			const p2 = [last[0] + x2, last[1] + y2];
			const p = [last[0] + x, last[1] + y];
			for (let t = 0.1; t <= 1; t += 0.1) {
				const pt = bezierPoint(last, p1, p2, p, t);
				g.lineTo(pt[0], pt[1]);
			}
			last = p as Point;
			lastCtrl = p2 as Point;
		},

		S: ([x2, y2, x, y]) => {
			const refl = lastCtrl
				? [2 * last[0] - lastCtrl[0], 2 * last[1] - lastCtrl[1]]
				: last;
			for (let t = 0.1; t <= 1; t += 0.1) {
				const pt = bezierPoint(last, refl, [x2, y2], [x, y], t);
				g.lineTo(pt[0], pt[1]);
			}
			last = [x, y] as Point;
			lastCtrl = [x2, y2] as Point;
		},
		s: ([x2, y2, x, y]) => {
			const refl = lastCtrl
				? [2 * last[0] - lastCtrl[0], 2 * last[1] - lastCtrl[1]]
				: last;
			const p2 = [last[0] + x2, last[1] + y2];
			const p = [last[0] + x, last[1] + y];
			for (let t = 0.1; t <= 1; t += 0.1) {
				const pt = bezierPoint(last, refl, p2, p, t);
				g.lineTo(pt[0], pt[1]);
			}
			last = p as Point;
			lastCtrl = p2 as Point;
		},

		Q: ([x1, y1, x, y]) => {
			const ctrl: Point = [x1, y1] as Point;
			const end: Point = [x, y] as Point;
			drawQuadraticCurve(g, last, ctrl, end);
			last = end;
			lastCtrl = ctrl;
		},

		q: ([x1, y1, x, y]) => {
			const ctrl: Point = [last[0] + x1, last[1] + y1] as Point;
			const end: Point = [last[0] + x, last[1] + y] as Point;
			drawQuadraticCurve(g, last, ctrl, end);
			last = end;
			lastCtrl = ctrl;
		},

		T: ([x, y]) => {
			const refl = lastCtrl
				? [2 * last[0] - lastCtrl[0], 2 * last[1] - lastCtrl[1]]
				: last;
			for (let t = 0.1; t <= 1; t += 0.1) {
				const pt = quadPoint(last, refl, [x, y], t);
				g.lineTo(pt[0], pt[1]);
			}
			last = [x, y] as Point;
			lastCtrl = refl as Point;
		},
		t: ([x, y]) => {
			const refl = lastCtrl
				? [2 * last[0] - lastCtrl[0], 2 * last[1] - lastCtrl[1]]
				: last;
			const p = [last[0] + x, last[1] + y];
			for (let t = 0.1; t <= 1; t += 0.1) {
				const pt = quadPoint(last, refl, p, t);
				g.lineTo(pt[0], pt[1]);
			}
			last = p as Point;
			lastCtrl = refl as Point;
		},

		A: ([rx, ry, rot, laf, sf, x, y]) => {
			const pts = arcToSegments(last, rx, ry, rot, laf, sf, [x, y] as Point);
			for (const pt of pts) g.lineTo(pt[0], pt[1]);
			last = [x, y] as Point;
		},
		a: ([rx, ry, rot, laf, sf, dx, dy]) => {
			const to = [last[0] + dx, last[1] + dy];
			const pts = arcToSegments(last, rx, ry, rot, laf, sf, to as Point);
			for (const pt of pts) g.lineTo(pt[0], pt[1]);
			last = to as Point;
		},
	} satisfies Record<string, (nums: number[]) => void>;
}

type P = Point | number[];

function bezierPoint(p0: P, p1: P, p2: P, p3: P, t: number) {
	const mt = 1 - t;
	const mt2 = mt * mt;
	const t2 = t * t;
	// prettier-ignore
	return [
		mt2 * mt * p0[0] + 3 * mt2 * t * p1[0] + 3 * mt * t2 * p2[0] + t2 * t * p3[0],
		mt2 * mt * p0[1] + 3 * mt2 * t * p1[1] + 3 * mt * t2 * p2[1] + t2 * t * p3[1],
	];
}

function quadPoint(p0: P, p1: P, p2: P, t: number) {
	const mt = 1 - t;
	// prettier-ignore
	return [
		mt * mt * p0[0] + 2 * mt * t * p1[0] + t * t * p2[0],
		mt * mt * p0[1] + 2 * mt * t * p1[1] + t * t * p2[1],
  ];
}

// untested :)
function arcToSegments(
	from: Point,
	rx: number,
	ry: number,
	xAxisRotation: number,
	largeArcFlag: number,
	sweepFlag: number,
	to: Point,
	steps = 10,
): Point[] {
	// const rad = (a: number) => (a * Math.PI) / 180;
	const dx2 = (from[0] - to[0]) / 2;
	const dy2 = (from[1] - to[1]) / 2;

	let cx = (from[0] + to[0]) / 2;
	let cy = (from[1] + to[1]) / 2;

	const startAngle = 0;
	const deltaAngle = sweepFlag ? Math.PI : -Math.PI;

	const points: Point[] = [];
	for (let i = 1; i <= steps; i++) {
		const t = i / steps;
		const angle = startAngle + t * deltaAngle;
		const x = cx + rx * Math.cos(angle);
		const y = cy + ry * Math.sin(angle);
		points.push([x, y] as Point);
	}

	return points;
}

//

function drawQuadraticCurve(
	g: ScriptUIGraphics,
	from: Point,
	ctrl: Point,
	to: Point,
	steps: number = 10,
) {
	for (let i = 1; i <= steps; i++) {
		const t = i / steps;
		const pt = quadPoint(from, ctrl, to, t);
		g.lineTo(pt[0], pt[1]);
	}
}
