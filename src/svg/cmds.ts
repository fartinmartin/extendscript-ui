import { forEach } from "extendscript-ponyfills";

type Point = number[];
const STEPS = 20; // TODO: user defined...

export function createCmds(g: ScriptUIGraphics) {
	let last: Point = [0, 0];
	let lastCtrl: Point | null = null;

	const lineTo = (p: Point) => (last = g.lineTo(p[0], p[1]));
	const moveTo = (p: Point) => (last = g.moveTo(p[0], p[1]));

	const bezier = (p1: Point, p2: Point, p: Point) => {
		for (let t = 0.1; t <= 1; t += 0.1) {
			const pt = bezierPoint(last, p1, p2, p, t);
			g.lineTo(pt[0], pt[1]);
		}
		last = p;
		lastCtrl = p2;
	};

	const quad = (ctrl: Point, end: Point) => {
		for (let i = 1; i <= STEPS; i++) {
			const t = i / STEPS;
			const pt = quadPoint(last, ctrl, end, t);
			g.lineTo(pt[0], pt[1]);
		}
		last = end;
		lastCtrl = ctrl;
	};

	const reflect = () =>
		lastCtrl ? [2 * last[0] - lastCtrl[0], 2 * last[1] - lastCtrl[1]] : last;

	return {
		M: ([x, y]) => moveTo([x, y]),
		m: ([x, y]) => moveTo([last[0] + x, last[1] + y]),
		L: ([x, y]) => lineTo([x, y]),
		l: ([x, y]) => lineTo([last[0] + x, last[1] + y]),
		H: ([x]) => lineTo([x, last[1]]),
		h: ([x]) => lineTo([last[0] + x, last[1]]),
		V: ([y]) => lineTo([last[0], y]),
		v: ([y]) => lineTo([last[0], last[1] + y]),
		Z: () => g.closePath(),
		z: () => g.closePath(),

		C: ([x1, y1, x2, y2, x, y]) => bezier([x1, y1], [x2, y2], [x, y]),
		c: ([x1, y1, x2, y2, x, y]) =>
			bezier(
				[last[0] + x1, last[1] + y1],
				[last[0] + x2, last[1] + y2],
				[last[0] + x, last[1] + y],
			),

		S: ([x2, y2, x, y]) => {
			const refl = reflect();
			bezier(refl, [x2, y2], [x, y]);
		},
		s: ([x2, y2, x, y]) => {
			const refl = reflect();
			bezier(refl, [last[0] + x2, last[1] + y2], [last[0] + x, last[1] + y]);
		},

		Q: ([x1, y1, x, y]) => quad([x1, y1], [x, y]),
		q: ([x1, y1, x, y]) =>
			quad([last[0] + x1, last[1] + y1], [last[0] + x, last[1] + y]),

		T: ([x, y]) => {
			const refl = reflect();
			for (let t = 0.1; t <= 1; t += 0.1) {
				const pt = quadPoint(last, refl, [x, y], t);
				g.lineTo(pt[0], pt[1]);
			}
			last = [x, y];
			lastCtrl = refl;
		},
		t: ([x, y]) => {
			const refl = reflect();
			const p = [last[0] + x, last[1] + y];
			for (let t = 0.1; t <= 1; t += 0.1) {
				const pt = quadPoint(last, refl, p, t);
				g.lineTo(pt[0], pt[1]);
			}
			last = p;
			lastCtrl = refl;
		},

		A: ([rx, ry, rot, laf, sf, x, y]) => {
			const pts = arcToSegments(last, rx, ry, rot, laf, sf, [x, y]);
			forEach(pts, (pt) => g.lineTo(pt[0], pt[1]));
			last = [x, y];
		},
		a: ([rx, ry, rot, laf, sf, dx, dy]) => {
			const to = [last[0] + dx, last[1] + dy];
			const pts = arcToSegments(last, rx, ry, rot, laf, sf, to);
			forEach(pts, (pt) => g.lineTo(pt[0], pt[1]));
			last = to;
		},
	} satisfies Record<string, (nums: number[]) => void>;
}

//

function bezierPoint(p0: Point, p1: Point, p2: Point, p3: Point, t: number) {
	const mt = 1 - t;
	const mt2 = mt * mt;
	const t2 = t * t;
	// prettier-ignore
	return [
		mt2 * mt * p0[0] + 3 * mt2 * t * p1[0] + 3 * mt * t2 * p2[0] + t2 * t * p3[0],
		mt2 * mt * p0[1] + 3 * mt2 * t * p1[1] + 3 * mt * t2 * p2[1] + t2 * t * p3[1],
	];
}

function quadPoint(p0: Point, p1: Point, p2: Point, t: number) {
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
): Point[] {
	const rad = (a: number) => (a * Math.PI) / 180;
	const sinPhi = Math.sin(rad(xAxisRotation));
	const cosPhi = Math.cos(rad(xAxisRotation));

	const dx2 = (from[0] - to[0]) / 2;
	const dy2 = (from[1] - to[1]) / 2;

	const x1p = cosPhi * dx2 + sinPhi * dy2;
	const y1p = -sinPhi * dx2 + cosPhi * dy2;

	let rxSq = rx * rx;
	let rySq = ry * ry;
	let x1pSq = x1p * x1p;
	let y1pSq = y1p * y1p;

	const radiiCheck = x1pSq / rxSq + y1pSq / rySq;
	if (radiiCheck > 1) {
		const scale = Math.sqrt(radiiCheck);
		rx *= scale;
		ry *= scale;
		rxSq = rx * rx;
		rySq = ry * ry;
	}

	const sign = largeArcFlag !== sweepFlag ? 1 : -1;
	const sq =
		(rxSq * rySq - rxSq * y1pSq - rySq * x1pSq) / (rxSq * y1pSq + rySq * x1pSq);
	const coef = sign * Math.sqrt(Math.max(0, sq));

	const cxp = (coef * (rx * y1p)) / ry;
	const cyp = (coef * -(ry * x1p)) / rx;

	const cx = cosPhi * cxp - sinPhi * cyp + (from[0] + to[0]) / 2;
	const cy = sinPhi * cxp + cosPhi * cyp + (from[1] + to[1]) / 2;

	function vectorAngle(ux: number, uy: number, vx: number, vy: number) {
		const dot = ux * vx + uy * vy;
		const len = Math.sqrt((ux * ux + uy * uy) * (vx * vx + vy * vy));
		let ang = Math.acos(Math.min(Math.max(dot / len, -1), 1)); // Clamp due to float error
		if (ux * vy - uy * vx < 0) ang = -ang;
		return ang;
	}

	const vx1 = (x1p - cxp) / rx;
	const vy1 = (y1p - cyp) / ry;
	const vx2 = (-x1p - cxp) / rx;
	const vy2 = (-y1p - cyp) / ry;

	let startAngle = vectorAngle(1, 0, vx1, vy1);
	let deltaAngle = vectorAngle(vx1, vy1, vx2, vy2);

	if (!sweepFlag && deltaAngle > 0) deltaAngle -= 2 * Math.PI;
	else if (sweepFlag && deltaAngle < 0) deltaAngle += 2 * Math.PI;

	const points: Point[] = [];
	for (let i = 1; i <= STEPS; i++) {
		const t = i / STEPS;
		const angle = startAngle + t * deltaAngle;
		const x =
			cx + rx * Math.cos(angle) * cosPhi - ry * Math.sin(angle) * sinPhi;
		const y =
			cy + rx * Math.cos(angle) * sinPhi + ry * Math.sin(angle) * cosPhi;
		points.push([x, y]);
	}

	return points;
}
