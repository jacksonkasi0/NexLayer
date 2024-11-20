import { Hono } from "@hono/hono";
import { cors } from '@hono/hono/cors'

// ** import routes
import { routes } from "@/routers/index.ts";

const app = new Hono();


app.use('*', cors())
app.get("/", (c) => c.text("Hello NextLayer⚡"));

app.route("/api", routes);

Deno.serve(app.fetch);
