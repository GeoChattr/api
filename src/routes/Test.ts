import { Router } from "express";

//Test Route
export const Test = () => {
  const router = Router();

  router.get("/test", async (req, res) => {
    res.json({ success: true, message: "Route works" });
  });

  return router;
};
