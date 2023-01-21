# SIGEEL

*Sistema de Gestión del Elector SIGEEL*

-Front
    - Obtener datos de ciudadanos
    - crear usuario
    - ver usuarios
    - editar usuarios
    - asignar electores a usuarios
    - seguimiento de usuarios nivel colaborador por parte de un usuario administrador
    -listar electores por colaborador

- Express
- PostgreSQL
- Sequelize ORM 
- Autenticación con Tokens
- Bcrypt para hashear contraseñas
- Uso de Json Web Token

---

- Rutas de Login y creación de usuario (register)
- Herramienta para publicar imagenes de perfil
- CRUD de usuarios con autenticacion y manejo de permisos
- /users/:id DELETE, PUT
- /users/me

Orden
1. app.js
2. .env
3. config.js
4. database.js
5. modelos
6. controladores
7. servicios
8. rutas
