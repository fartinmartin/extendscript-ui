type TwoD = TwoDProperty | ThreeDProperty;

export function fitToComp(layer: AVLayer) {
	const comp = layer.containingComp;
	const { width, height } = layer.source;

	if (
		canSetValue(layer.anchorPoint) &&
		canSetValue(layer.position) &&
		canSetValue(layer.scale)
	) {
		const layerCenter = [width / 2, height / 2] as TwoDPoint;
		(layer.anchorPoint as Property<TwoD>).setValue(layerCenter);

		const compCenter = [comp.width / 2, comp.height / 2] as TwoDPoint;
		(layer.position as Property<TwoD>).setValue(compCenter);

		const percentage = (comp.height / layer.height) * 100;
		(layer.scale as Property<TwoD>).setValue([percentage, percentage]);
	}
}

function canSetValue(property: Property) {
	return !property.isTimeVarying && !property.expression;
}
