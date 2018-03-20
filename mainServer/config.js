const own = {
    port: process.env.port || 1337
};

const serverA = {
    address: process.env.SERVER_A_ADDRESS || '127.0.0.1',
    port: process.env.SERVER_A_PORT || 1338,
    timeout: process.env.SERVER_A_TIMEOUT || 3000,
    retry: process.env.SERVER_A_RETRY || 3
};

const serverB = {
    address: process.env.SERVER_B_ADDRESS || '127.0.0.1',
    port: process.env.SERVER_B_PORT || 1339,
    timeout: process.env.SERVER_B_TIMEOUT || 4000,
    retry: process.env.SERVER_B_RETRY || 3
};

module.exports = {own, serverA, serverB};