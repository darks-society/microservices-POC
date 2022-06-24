import dotenv from 'dotenv';

dotenv.config();

export const envVars: { [x: string]: any } = {
	PORT: process.env.PORT,
	JWT_SECRET: process.env.JWT_SECRET,
	MONGO_URI: process.env.MONGO_URI,
	JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
};

export const checkVars = () => {
	for (const [key, value] of Object.entries(envVars)) {
		if (!value) {
			throw new Error('Missing Value for ' + key);
		}
	}
};
