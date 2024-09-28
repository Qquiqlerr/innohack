import { defineConfig } from "@openapi-codegen/cli";
import {
  generateFetchers,
  generateSchemaTypes,
} from "@openapi-codegen/typescript";

export default defineConfig({
  projectManager: {
    from: {
      relativePath: "./../doc.yaml",
      source: "file",
    },
    outputDir: "api/fetchers",
    to: async (context) => {
      const filenamePrefix = "projectManager";

      // Changing openapi server to access the current host
      const contextWithChangedBaseUrl = {
        ...context,
        openAPIDocument: {
          ...context.openAPIDocument,
          servers: [
            {
              url: "/api",
            },
          ],
        },
      };
      const { schemasFiles } = await generateSchemaTypes(
        contextWithChangedBaseUrl,
        {
          filenamePrefix,
        },
      );

      await generateFetchers(contextWithChangedBaseUrl, {
        filenamePrefix,
        schemasFiles,
      });
    },
  },
});
