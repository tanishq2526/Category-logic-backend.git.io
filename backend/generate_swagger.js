import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apisMdPath = path.join(__dirname, 'APIS.md');
const swaggerJsonPath = path.join(__dirname, 'swagger.json');

const apisMdContent = fs.readFileSync(apisMdPath, 'utf8');

const lines = apisMdContent.split('\n');

const swagger = {
  openapi: "3.0.0",
  info: {
    title: "E-commerce API",
    version: "1.0.0",
    description: "API Documentation generated from APIS.md"
  },
  servers: [
    {
      url: "/",
      description: "Relative to current origin"
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      },
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "token"
      }
    }
  },
  security: [
    { cookieAuth: [] }
  ],
  paths: {}
};

let currentTag = "General";

for (let line of lines) {
  line = line.trim();
  if (!line) continue;

  // Check for Header to use as Tag
  // e.g. **Auth (/api/auth)**
  const headerMatch = line.match(/^\*\*(.*?)\*\*/);
  if (headerMatch) {
    let tagCandidate = headerMatch[1].trim();
    // remove the trailing (/api/...) if present
    tagCandidate = tagCandidate.replace(/\s*\(.*\)$/, '');
    if (tagCandidate !== "TOTAL 104 API's") {
      currentTag = tagCandidate;
    }
    continue;
  }

  // Check for Route
  // e.g. - POST /api/auth/register — Register a new user — [backend/routes/auth.js](backend/routes/auth.js)
  const routeMatch = line.match(/^-\s+([A-Z]+)\s+([^\s—]+)\s+—\s+(.*?)\s+—/);
  if (routeMatch) {
    const method = routeMatch[1].toLowerCase();
    let apiPath = routeMatch[2];
    const summary = routeMatch[3].trim();

    // Convert express path params :id to swagger {id}
    const pathParts = apiPath.split('/');
    const pathParams = [];
    const swaggerPathParts = pathParts.map(part => {
      if (part.startsWith(':')) {
        const paramName = part.substring(1);
        pathParams.push(paramName);
        return `{${paramName}}`;
      }
      return part;
    });
    
    let swaggerPath = swaggerPathParts.join('/');
    // some routes have trailing slash, let's normalize by removing it unless it's root
    if (swaggerPath.length > 1 && swaggerPath.endsWith('/')) {
        swaggerPath = swaggerPath.slice(0, -1);
    }

    if (!swagger.paths[swaggerPath]) {
      swagger.paths[swaggerPath] = {};
    }

    const operation = {
      summary: summary,
      tags: [currentTag],
      responses: {
        "200": {
          description: "Successful response"
        }
      }
    };

    if (pathParams.length > 0) {
      operation.parameters = pathParams.map(p => ({
        name: p,
        in: "path",
        required: true,
        schema: {
          type: "string"
        }
      }));
    }

    // Default request body for POST/PUT/PATCH
    if (['post', 'put', 'patch'].includes(method)) {
      operation.requestBody = {
        content: {
          "application/json": {
            schema: {
              type: "object",
              additionalProperties: true
            }
          }
        }
      };
    }

    swagger.paths[swaggerPath][method] = operation;
  }
}

fs.writeFileSync(swaggerJsonPath, JSON.stringify(swagger, null, 2));

// Calculate total APIs
let totalApis = 0;
for (const path in swagger.paths) {
  totalApis += Object.keys(swagger.paths[path]).length;
}

// Update the description with the count
swagger.info.description = `API Documentation generated from APIS.md\n\n**Total APIs Documented: ${totalApis}**`;
fs.writeFileSync(swaggerJsonPath, JSON.stringify(swagger, null, 2));

console.log(`Successfully generated swagger.json with ${totalApis} unique APIs.`);
