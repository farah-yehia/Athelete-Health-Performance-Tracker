export const Front_Port = 8000;
export const Back_Port = 9000;
export const Front_Origin = `http://localhost:${Front_Port}`;
export const Back_Origin = `http://localhost:${Back_Port}`;
// export const Back_Origin = `https://e-learning-system-deployed.vercel.app`;

const Front_ENV = {
    Front_Port,
    Back_Port,
    Front_Origin,
    Back_Origin,
};

export default Front_ENV;
