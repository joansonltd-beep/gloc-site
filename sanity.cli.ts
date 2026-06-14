import { defineCliConfig } from "sanity/cli";
import { projectId, dataset } from "./src/sanity/env";

// Used by the `sanity` CLI (e.g. dataset import/export, deploy).
export default defineCliConfig({
  api: { projectId, dataset },
});
