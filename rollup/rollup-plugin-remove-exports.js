// https://github.com/motiondeveloper/rollup-plugin-ae-jsx
// TODO: replace with new (@fartinmartin scoped) npm library?
const estreeWalker = require("estree-walker");
const MagicString = require("magic-string");

const whitespace = /[\s;]/; // whitespace or `;`

// https://github.com/estree/estree
const disallowedNodeTypes = [
	"ExportDefaultDeclaration",
	"ExportNamedDeclaration",
	"ExportAllDeclaration",
];
// disallowedNodeTypes array above does not capture: `exports.[exportName] = [exportName];`
const isExportsAssignment = (node) => {
	const isAssignment = node.type === "AssignmentExpression";
	if (!isAssignment) return false;
	const isMemberExpression = node.left.type === "MemberExpression";
	return isMemberExpression ? node.left.object.name === "exports" : false;
};

function removeExports(options = {}) {
	const exports = [];
	return {
		name: "rollup-plugin-remove-exports", // this name will show up in warnings and errors
		generateBundle(options = {}, bundle, isWrite) {
			// format each file to be ae-jsx
			for (const file in bundle) {
				// Get the string code of the file
				let code = bundle[file].code;
				// generate AST to walk through
				let ast;
				try {
					ast = this.parse(code);
				} catch (err) {
					err.message += ` in ${file}`;
					throw err;
				}
				// create magic string to perform operations on
				const magicString = new MagicString(code);

				// removes characters from the magicString
				function remove(start, end) {
					while (whitespace.test(code[start - 1])) start -= 1;
					magicString.remove(start, end);
				}

				// remove export declaration and/or `exports.[exportName] = [exportName];` assignments
				estreeWalker.walk(ast, {
					enter(node, parent) {
						if (
							disallowedNodeTypes.includes(node.type) ||
							isExportsAssignment(node)
						) {
							remove(node.start, node.end);
							const name = node.right?.name;
							console.log(
								`removed [${node.start}-${node.end}] exports.${name} = ${name};`
							);
						}
					},
				});

				// Sanitize output
				magicString.trim();
				// Replace the files code with modified
				bundle[file].code = magicString.toString();
			}
		},
	};
}

module.exports = removeExports;
