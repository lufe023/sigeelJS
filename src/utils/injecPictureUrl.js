require('dotenv').config();

const injectPictureUrl = ({ 
    province = 0, 
    municipality = 0, 
    precinct = 0, 
    college = 0, 
    citizenID 
}) => {
    if (!citizenID) return null;

    const isProd = process.env.NODE_ENV === 'production';
    
    if (isProd) {
        // Obtenemos la base y quitamos cualquier barra al final por si acaso
        const r2Base = process.env.R2_PUBLIC_URL.replace(/\/$/, ""); 
        
        // Si al subir los archivos con Cyberduck creaste la carpeta "citizens", esta ruta es correcta:
        return `${r2Base}/citizens/${province}/${municipality}/${precinct}/${college}/${citizenID}.webp`;
    } else {
        const baseUrl = (process.env.BACKEND_URL || 'http://localhost:9000').replace(/\/$/, "");
        return `${baseUrl}/api/v1/images/pic/${province}/${municipality}/${precinct}/${college}/${citizenID}`;
    }
};

// Recorre recursivamente datos (objeto o array) y aplica injectPictureUrl
const injectPictureInto = (data) => {
    if (!data) return data;

    const tryInject = (obj) => {
        if (!obj || typeof obj !== 'object') return;

        // Posibles aliases usados en las respuestas
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

    // Trabaja sobre copia para evitar mutaciones involuntarias
    const cloned = JSON.parse(JSON.stringify(data));
    walk(cloned);
    return cloned;
};

module.exports = { injectPictureUrl, injectPictureInto };