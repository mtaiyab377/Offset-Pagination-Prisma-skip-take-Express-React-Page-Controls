
import { Router } from "express";
import prisma from "../prisma/client.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    // Read page from query parameters (default to 1)
    const page = Number(req.query.page) || 1;
    const pageSize = 10;

    // Calculate pagination values
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    // Fetch threads and total count in the same request
    const [threads, total] = await Promise.all([
      prisma.thread.findMany({
        skip,
        take,
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: {
              name: true,
              avatarUrl: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
      }),
      prisma.thread.count(),
    ]);

    // Check whether more pages are available
    const hasMore = total > page * pageSize;

    res.json({ threads, total, hasMore });
  } catch (error) {
    next(error);
  }
});

export default router;
