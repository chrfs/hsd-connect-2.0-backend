import KoaRouter from "koa-router";
import projects from "./projects";
import users from "./users";

const router = new KoaRouter();

router.use(users.routes()); // uses authorization within
router.use(projects.routes());

export default router;
