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
        const delta = Date.now() - lastExecution;
        // 90s = 60s execution frequency + 30s grace period
        const status = delta < 90000 ? 200 : 418;
        return { status, body: { status, delta, lastExecution } };
    }
};
