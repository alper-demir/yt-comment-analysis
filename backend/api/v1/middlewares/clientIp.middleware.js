function getClientIp(req) {
    let ipAddress;

    // X-Forwarded-For (if behind proxy)
    if (req.headers['x-forwarded-for']) {
        const forwarded = req.headers['x-forwarded-for'].split(',').map(ip => ip.trim());
        ipAddress = forwarded[0];
    }

    // get directly from connection
    if (!ipAddress && req.connection?.remoteAddress) {
        ipAddress = req.connection.remoteAddress;
    } else if (!ipAddress && req.socket?.remoteAddress) {
        ipAddress = req.socket.remoteAddress;
    } else if (!ipAddress && req.connection?.socket?.remoteAddress) {
        ipAddress = req.connection.socket.remoteAddress;
    }

    // clear IPv4 in Ipv6 (ex. ::ffff:192.168.1.1)
    if (ipAddress?.startsWith('::ffff:')) {
        ipAddress = ipAddress.replace('::ffff:', '');
    }

    return ipAddress || null;
}

export const clientIpMiddleware = (req, res, next) => {
    req.clientIp = getClientIp(req);
    next();
}