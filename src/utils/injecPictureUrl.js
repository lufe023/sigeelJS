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

module.exports = { injectPictureUrl };