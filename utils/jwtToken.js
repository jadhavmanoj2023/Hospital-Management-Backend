export const generateToken = (user, message, statusCode, res) => {
  try {
    const token = user.generateJsonWebToken();
    const cookieName = user.role === "Admin" ? "adminToken" : "patientToken";
    const cookieExpire = parseInt(process.env.COOKIE_EXPIRE, 10);

    if (isNaN(cookieExpire)) {
      throw new Error("Invalid COOKIE_EXPIRE value");
    }

    res
      .status(statusCode)
      .cookie(cookieName, token, {
        expires: new Date(Date.now() + cookieExpire * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: "None" // Prevents CSRF attacks
      })
      .json({
        success: true,
        message,
        user,
        token,
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
