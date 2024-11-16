import { Hono } from "@hono/hono";

// ** import routes
import { routes } from "@/routers/index.ts";

const app = new Hono();

app.get("/", (c) => c.text("Hello NextLayer⚡"));

app.route("/api", routes);

Deno.serve(app.fetch);
