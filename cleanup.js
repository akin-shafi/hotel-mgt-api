const fs = require("fs");
const path = require("path");

const srcDir = "src";

fs.readdirSync(srcDir).forEach((file) => {
	const filePath = path.join(srcDir, file);
	if (fs.statSync(filePath).isFile() && file.endsWith(".js")) {
		fs.unlinkSync(filePath);
	} else if (fs.statSync(filePath).isDirectory()) {
		fs.readdirSync(filePath).forEach((subfile) => {
			const subfilePath = path.join(filePath, subfile);
			if (fs.statSync(subfilePath).isFile() && subfile.endsWith(".js")) {
				fs.unlinkSync(subfilePath);
			}
		});
	}
});
