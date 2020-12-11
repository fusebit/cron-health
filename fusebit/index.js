const Sdk = require('@fusebit/add-on-sdk');
const Jwt = require('jsonwebtoken');

module.exports = async (ctx) => {
    ctx.baseUrl = Jwt.decode(ctx.fusebit.functionAccessToken).aud;
    const storage = await Sdk.createStorageClient(
        ctx,
        ctx.fusebit.functionAccessToken,
        `boundary/${ctx.boundaryId}/function/${ctx.functionId}`
    );
    if (ctx.method === 'CRON') {
        await storage.put({ data: { lastExecution: Date.now() } });
    } else {
        const payload = await storage.get();
        const lastExecution = payload && payload.data && payload.data.lastExecution;
        if (Date.now() - lastExecution < 90000) {
            // 90s = 60s execution frequency + 30s grace period
            return { status: 200 };
        } else {
            return { status: 418 };
        }
    }
};
