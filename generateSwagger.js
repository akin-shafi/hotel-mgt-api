const swaggerJSDoc = require("swagger-jsdoc");
const fs = require("fs");
const path = require("path");

const options = {
	definition: {
		openapi: "3.0.0", // Specification (optional, defaults to swagger: '2.0')
		info: {
			title: "Your API Title",
			version: "1.0.0",
			description: "Your API description",
		},
	},
	// Path to the API docs
	apis: ["./src/controllers/*.ts"], // Path to your controller files
};

const swaggerSpec = swaggerJSDoc(options);
fs.writeFileSync(
	path.join(__dirname, "swagger.json"),
	JSON.stringify(swaggerSpec, null, 2)
);
