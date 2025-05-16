import fs from "fs";
import path from "path";

const updateVersionInDir = (dir: string, newVersion: string) => {
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const fullPath = path.join(dir, entry.name);

		if (entry.isDirectory()) {
			if (entry.name === "node_modules") continue;
			updateVersionInDir(fullPath, newVersion);
			continue;
		}

		if (entry.name !== "package.json") continue;

		const pkg = JSON.parse(fs.readFileSync(fullPath, "utf8"));
		pkg.version = newVersion;

		let updated = `✔ ${path.relative(process.cwd(), fullPath)} -> version ${newVersion}`;

		if (pkg.dependencies?.["extendscript-ui"]) {
			pkg.dependencies["extendscript-ui"] = newVersion;
			updated += " + extendscript-ui";
		}

		fs.writeFileSync(fullPath, JSON.stringify(pkg, null, 2) + "\n");
		console.log(updated);
	}
};

function main() {
	const inputVersion = process.argv[2];

	if (!inputVersion) {
		console.error("Missing version argument");
		process.exit(1);
	}

	updateVersionInDir(process.cwd(), inputVersion);
}

try {
	main();
} catch (e) {
	console.error(e.message);
}
