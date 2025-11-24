import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "15d",
	});

	res.cookie("jwt", token, {
		httpOnly: true, // more secure
		maxAge: 30 * 60 * 1000, // 30minutes
		sameSite: "strict", // CSRF
	});

	return token;
};

export default generateTokenAndSetCookie;
