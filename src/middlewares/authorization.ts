import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { SECRET } from "../global";


interface JwPayload {
    id: string;
    name: string;
    email: string;
    role: string;
}

export const verifyToken = (request: Request, response: Response, next: NextFunction) => {
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
        return response.status(403).json({ message: 'Access denied. No token provided.' });
    }

    try {
        // Tanpa secret key, kita tidak bisa memverifikasi token
        const decoded = verify(token, SECRET); // Tidak ada secret key
        request.body.user = decoded as JwPayload;
        next();
    } catch (error) {
        return response.status(401).json({ message: `Invalid token: ${error}` });
    }
};

export const verifyRole = (allowedRoles: string[]) => {
    return (request: Request, response: Response, next: NextFunction) => {
        const user = request.body.user;

        if (!user) {
            return response.status(403).json({ message: 'No user information available.' });
        }

        if (!allowedRoles.includes(user.role)) {
            return response.status(403).json({ message: "You are not allowed to access this resource" });
        }

        next();
    };
};
