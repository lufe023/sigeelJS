// controllers/protected.controller.js
const ProtectedCitizen = require("../models/protectedCitizen.model");
const Census = require("../models/census.models");
const Users = require("../models/users.models");

// Alternar o guardar estado de protección (Solo Super Admin)
const toggleProtection = async (req, res) => {
    try {
        const { citizenID, protectedStatus } = req.body; // status debe ser true o false
        const adminId = req.user.id;
        
        // 1. Limpiamos la cédula aquí
        const cleanCitizenID = citizenID ? citizenID.trim().replace(/-/g, "") : "";

        // 2. Validamos usando la variable limpia
        if (!cleanCitizenID || typeof protectedStatus !== "boolean") {
            return res.status(400).json({ 
                message: "citizenID (string) y protectedStatus (boolean) son obligatorios." 
            });
        }

        // 3. Buscar usando la cédula LIMPIA
        const record = await ProtectedCitizen.findOne({ where: { citizenID: cleanCitizenID } });

        if (record) {
            // Si ya existe, actualizamos su estado y quién lo modificó
            record.protected = protectedStatus;
            record.updatedBy = adminId;
            await record.save();

            return res.status(200).json({
                message: `Estado de protección actualizado a: ${protectedStatus}`,
                data: record
            });
        } else {
            // 4. Crear el registro usando la cédula LIMPIA
            const newRecord = await ProtectedCitizen.create({
                citizenID: cleanCitizenID, // <-- Cambiado aquí
                protected: protectedStatus,
                createdBy: adminId,
                updatedBy: adminId 
            });

            return res.status(201).json({
                message: "Ciudadano registrado en la lista de control de protección",
                data: newRecord
            });
        }
    } catch (error) {
        console.error("Error al gestionar protección:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Obtener todo el listado de control para la pantalla del Frontend (Solo Super Admin)
const getProtectionDashboard = async (req, res) => {
    try {
        // 1. Traer la lista base de ciudadanos protegidos
        const list = await ProtectedCitizen.findAll({
            order: [["updatedAt", "DESC"]],
            raw: true
        });

        // 2. Extraer los IDs únicos de ciudadanos y de administradores para no duplicar consultas
        const citizenIDs = list.map(item => item.citizenID);
        
        // Juntamos creadores y editores en un solo arreglo de IDs únicos de usuarios
        const adminIds = [...new Set(list.flatMap(item => [item.createdBy, item.updatedBy].filter(Boolean)))];

        // 3. Consultas masivas en paralelo a la base de datos (Mejora el rendimiento)
        const [citizensData, usersData] = await Promise.all([
            Census.findAll({
                where: { citizenID: citizenIDs },
                attributes: ["citizenID", "firstName", "lastName", "lastNameB"],
                raw: true
            }),
            Users.findAll({
                where: { id: adminIds },
                attributes: ["id", "email", "censuCitizenID"], // Los campos que necesitas del usuario
                raw: true
            })
        ]);

        // 4. Indexar los datos en Mapas (asociación rápida O(1))
        const citizenMap = citizensData.reduce((acc, c) => {
            acc[c.citizenID] = {
                firstName: c.firstName,
                lastName: c.lastName,
                lastNameB: c.lastNameB
            };
            return acc;
        }, {});

        const userMap = usersData.reduce((acc, u) => {
            acc[u.id] = {
                id: u.id,
                email: u.email,
                censuCitizenID: u.censuCitizenID
            };
            return acc;
        }, {});

        // 5. Construir la respuesta final enriquecida
        const enrichedList = list.map(item => ({
            ...item,
            citizen: citizenMap[item.citizenID] || null,
            creatorUser: userMap[item.createdBy] || null,  // Datos de quien creó el registro
            updaterUser: userMap[item.updatedBy] || null   // Datos de quien modificó por última vez
        }));

        res.status(200).json(enrichedList);
    } catch (error) {
        console.error("Error en getProtectionDashboard:", error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    toggleProtection,
    getProtectionDashboard
};