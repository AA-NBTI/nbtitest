
const http = require('http');

http.get('http://localhost:3000/api/admin/test/dashboard?realOnly=true', (res) => {
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
        try {
            const parsedData = JSON.parse(rawData);
            console.log("Summary:", parsedData.summary);
            console.log("Version Grouped Basic keys:", Object.keys(parsedData.versionGrouped.basic.mbtiDist || {}));
            console.log("Dichotomy Distribution:", parsedData.dichotomyDistribution);
        } catch (e) {
            console.error(e.message);
        }
    });
}).on('error', (e) => {
    console.error(`Error: ${e.message}`);
});
