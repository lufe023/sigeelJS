require('dotenv').config();

const injectPictureUrl = ({ 
    province = 0, 
    municipality = 0, 
    precinct = 0, 
    college = 0, 
    citizenID 
}) => {
    if (!citizenID) return null;

    // 1. Jalamos tu BACKEND_URL normal del .env
    let baseUrl = process.env.BACKEND_URL || 'http://localhost:9000';

    // 2. 🪄 EL TRUCO LOCAL: Si detecta la IP de tu casa o localhost, le limpia la "s" al https en caliente
    if (baseUrl.includes('192.168.100.13') || baseUrl.includes('localhost')) {
        baseUrl = baseUrl.replace('https://', 'http://');
    }

    // 🛡️ ESCUDO DEFINITIVO: Si la cédula ya fue anonimizada con 11 ceros, devolvemos la imagen estática del sistema
    if (citizenID === "00000000000" || citizenID === "000-0000000-0") {
        return `${baseUrl.replace(/\/$/, "")}/uploads/images/system/restringedProfile.png`;
    }

    const isProd = process.env.NODE_ENV === 'production';
    
    if (isProd) {
        // En producción (cuando ya no sea la IP local), Cloudflare R2 sigue su curso normal con HTTPS nativo
        const r2Base = process.env.R2_PUBLIC_URL.replace(/\/$/, ""); 
        return `${r2Base}/citizens/${province}/${municipality}/${precinct}/${college}/${citizenID}.webp`;
    } else {
        return `${baseUrl.replace(/\/$/, "")}/api/v1/images/pic/${province}/${municipality}/${precinct}/${college}/${citizenID}`;
    }
};

// Recorre recursivamente datos (objeto o array) y aplica injectPictureUrl
const injectPictureInto = (data) => {
    if (!data) return data;

    const tryInject = (obj) => {
        if (!obj || typeof obj !== 'object') return;

        const candidates = ['censu', 'Census'];

        candidates.forEach((alias) => {
            if (obj[alias] && typeof obj[alias] === 'object') {
                const c = obj[alias];
                const citizenID = c.citizenID || c.citizen_id || c.id;
                if (citizenID) {
                    c.picture = injectPictureUrl({
                        province: c.province,
                        municipality: c.municipality,
                        precinct: c.PrecinctId || c.Precinctid || 0,
                        college: c.CollegeId || c.Collegeid || 0,
                        citizenID,
                    });
                }
            }
        });
    };

    const walk = (node) => {
        if (Array.isArray(node)) {
            node.forEach(walk);
        } else if (node && typeof node === 'object') {
            tryInject(node);
            Object.values(node).forEach((v) => walk(v));
        }
    };

    const cloned = JSON.parse(JSON.stringify(data));
    walk(cloned);
    return cloned;
};

module.exports = { injectPictureUrl, injectPictureInto };