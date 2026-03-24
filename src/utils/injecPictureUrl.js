require('dotenv').config();

const injectPictureUrl = ({ 
    province = 0, 
    municipality = 0, 
    precinct = 0, 
    college = 0, 
    citizenID 
}) => {
    if (!citizenID) return null;

    const baseUrl = process.env.BACKEND_URL || 'http://localhost:3000';
    
    return `${baseUrl}/api/v1/images/pic/${province}/${municipality}/${precinct}/${college}/${citizenID}`;
};

module.exports = {injectPictureUrl}; 