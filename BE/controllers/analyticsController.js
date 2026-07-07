const jwt = require("jsonwebtoken");
const WebsiteVisit = require("../models/WebsiteVisit");

const limitText = (value, maxLength) => {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
};

const getClientIp = (req) => {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (typeof forwardedFor === "string" && forwardedFor.length > 0) {
    return forwardedFor.split(",")[0].trim();
  }
  return req.ip || req.socket?.remoteAddress || "";
};

const getTokenPayload = (req) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!token || !process.env.JWT_SECRET) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (_) {
    return null;
  }
};

exports.trackVisit = async (req, res) => {
  try {
    const sessionId = limitText(req.body?.sessionId, 120);
    const path = limitText(req.body?.path, 300);

    if (!sessionId || !path) {
      return res.status(400).json({
        success: false,
        message: "Thieu sessionId hoac path de ghi nhan luot truy cap"
      });
    }

    const tokenPayload = getTokenPayload(req);

    await WebsiteVisit.create({
      sessionId,
      path,
      title: limitText(req.body?.title, 200),
      referrer: limitText(req.body?.referrer, 500),
      user: tokenPayload?.id,
      role: tokenPayload?.role || "",
      ip: limitText(getClientIp(req), 120),
      userAgent: limitText(req.headers["user-agent"], 500)
    });

    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
