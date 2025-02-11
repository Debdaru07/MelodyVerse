
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../utils/prismaClient";
import { ResponseClass, StatusType } from "../utils/ResponseClass";

interface DecodedToken {
  email: string;
}

export const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.query.token as string;

    if (!token) {
      throw new Error("ERR8");
    }

    const secret = process.env.JWT_SECRET || "Random pass";

    const decodedToken = jwt.verify(token, secret) as DecodedToken;
    console.log('decodedToken', decodedToken)
    const user = await prisma.user.findFirst({
      where: { email: decodedToken.email },
    });
    console.log('user in middleware', user)
    if (!user) {
      throw new Error("ERR8");
    }

    (req as any).user = user;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return res.json(new ResponseClass({}, "ERR8", StatusType.Fail));
  }
};
