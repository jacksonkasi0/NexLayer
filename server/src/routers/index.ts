import { Hono } from "@hono/hono";

// ** import routes
import { layersApi } from "@/routers/layers/index.ts";

export const routes = new Hono();

routes.route("/layers", layersApi);

