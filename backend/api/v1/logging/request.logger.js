export const requestLogger = (req, res, next) => {
    const start = Date.now();

    res.on('finish', () => { // runs right after response is sent
        const duration = Date.now() - start;
        const ip = req.clientIp || req.ip;
        const method = req.method;
        const endpoint = req.originalUrl;
        const status = res.statusCode;
        const timestamp = new Date().toISOString();

        const logLine = `[${timestamp}] ${ip} - ${method} ${endpoint} ${status} - ${duration}ms`;

        console.log(logLine);
    });

    next();
}