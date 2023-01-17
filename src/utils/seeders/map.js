const Map = require('../../models/map.models')

Map.bulkCreate([
    {id:1, name:'Azua', parent:0, type: 'Provincia'},
{id:2, name:'Baoruco', parent:0, type: 'Provincia'},
{id:3, name:'Barahona', parent:0, type: 'Provincia'},
{id:4, name:'Dajabón', parent:0, type: 'Provincia'},
{id:5, name:'Duarte', parent:0, type: 'Provincia'},
{id:6, name:'Elías Piña', parent:0, type: 'Provincia'},
{id:7, name:'El Seibo', parent:0, type: 'Provincia'},
{id:8, name:'Espaillat', parent:0, type: 'Provincia'},
{id:9, name:'Hato Mayor', parent:0, type: 'Provincia'},
{id:10, name:'Hermanas Mirabal', parent:0, type: 'Provincia'},
{id:11, name:'Independencia', parent:0, type: 'Provincia'},
{id:12, name:'La Altagracia', parent:0, type: 'Provincia'},
{id:13, name:'La Romana', parent:0, type: 'Provincia'},
{id:14, name:'La Vega', parent:0, type: 'Provincia'},
{id:15, name:'María Trinidad Sánchez', parent:0, type: 'Provincia'},
{id:16, name:'Monseñor Nouel', parent:0, type: 'Provincia'},
{id:17, name:'Montecristi', parent:0, type: 'Provincia'},
{id:18, name:'Monte Plata', parent:0, type: 'Provincia'},
{id:19, name:'Pedernales', parent:0, type: 'Provincia'},
{id:20, name:'Peravia', parent:0, type: 'Provincia'},
{id:21, name:'Puerto Plata', parent:0, type: 'Provincia'},
{id:22, name:'Samaná', parent:0, type: 'Provincia'},
{id:23, name:'San Cristóbal', parent:0, type: 'Provincia'},
{id:24, name:'San José de Ocoa', parent:0, type: 'Provincia'},
{id:25, name:'San Juan', parent:0, type: 'Provincia'},
{id:26, name:'San Pedro de Macorís', parent:0, type: 'Provincia'},
{id:27, name:'Sánchez Ramírez', parent:0, type: 'Provincia'},
{id:28, name:'Santiago', parent:0, type: 'Provincia'},
{id:29, name:'Santiago Rodríguez', parent:0, type: 'Provincia'},
{id:30, name:'Santo Domingo', parent:0, type: 'Provincia'},
{id:31, name:'Valverde', parent:0, type: 'Provincia'},
{id:32, name:'Distrito Nacional', parent:0, type: 'Provincia'},
{id:33, name:'Azua de Compostela', parent:1, type: 'Municipio'},
{id:34, name:'Estebanía', parent:1, type: 'Municipio'},
{id:35, name:'Guayabal', parent:1, type: 'Municipio'},
{id:36, name:'Las Charcas', parent:1, type: 'Municipio'},
{id:37, name:'Las Yayas de Viajama', parent:1, type: 'Municipio'},
{id:38, name:'Padre Las Casas', parent:1, type: 'Municipio'},
{id:39, name:'Peralta', parent:1, type: 'Municipio'},
{id:40, name:'Pueblo Viejo', parent:1, type: 'Municipio'},
{id:41, name:'Sabana Yegua', parent:1, type: 'Municipio'},
{id:42, name:'Tábara Arriba', parent:1, type: 'Municipio'},
{id:43, name:'Neiba', parent:2, type: 'Municipio'},
{id:44, name:'Galván', parent:2, type: 'Municipio'},
{id:45, name:'Los Ríos', parent:2, type: 'Municipio'},
{id:46, name:'Tamayo', parent:2, type: 'Municipio'},
{id:47, name:'Villa Jaragua', parent:2, type: 'Municipio'},
{id:48, name:'Barahona', parent:3, type: 'Municipio'},
{id:49, name:'Cabral', parent:3, type: 'Municipio'},
{id:50, name:'El Peñón', parent:3, type: 'Municipio'},
{id:51, name:'Enriquillo', parent:3, type: 'Municipio'},
{id:52, name:'Fundación', parent:3, type: 'Municipio'},
{id:53, name:'Jaquimeyes', parent:3, type: 'Municipio'},
{id:54, name:'La Ciénaga', parent:3, type: 'Municipio'},
{id:55, name:'Las Salinas', parent:3, type: 'Municipio'},
{id:56, name:'Paraíso', parent:3, type: 'Municipio'},
{id:57, name:'Polo', parent:3, type: 'Municipio'},
{id:58, name:'Vicente Noble', parent:3, type: 'Municipio'},
{id:59, name:'Dajabón', parent:4, type: 'Municipio'},
{id:60, name:'El Pino', parent:4, type: 'Municipio'},
{id:61, name:'Loma de Cabrera', parent:4, type: 'Municipio'},
{id:62, name:'Partido', parent:4, type: 'Municipio'},
{id:63, name:'Restauración', parent:4, type: 'Municipio'},
{id:64, name:'San Francisco de Macorís', parent:5, type: 'Municipio'},
{id:65, name:'Arenoso', parent:5, type: 'Municipio'},
{id:66, name:'Castillo', parent:5, type: 'Municipio'},
{id:67, name:'Eugenio María de Hostos', parent:5, type: 'Municipio'},
{id:68, name:'Las Guáranas', parent:5, type: 'Municipio'},
{id:69, name:'Pimentel', parent:5, type: 'Municipio'},
{id:70, name:'Villa Riva', parent:5, type: 'Municipio'},
{id:71, name:'Comendador', parent:6, type: 'Municipio'},
{id:72, name:'Bánica', parent:6, type: 'Municipio'},
{id:73, name:'El Llano', parent:6, type: 'Municipio'},
{id:74, name:'Hondo Valle', parent:6, type: 'Municipio'},
{id:75, name:'Juan Santiago', parent:6, type: 'Municipio'},
{id:76, name:'Pedro Santana', parent:6, type: 'Municipio'},
{id:77, name:'El Seibo', parent:7, type: 'Municipio'},
{id:78, name:'Miches', parent:7, type: 'Municipio'},
{id:79, name:'Moca', parent:8, type: 'Municipio'},
{id:80, name:'Cayetano Germosén', parent:8, type: 'Municipio'},
{id:81, name:'Gaspar Hernández', parent:8, type: 'Municipio'},
{id:82, name:'Jamao al Norte', parent:8, type: 'Municipio'},
{id:83, name:'Hato Mayor del Rey', parent:9, type: 'Municipio'},
{id:84, name:'El Valle', parent:9, type: 'Municipio'},
{id:85, name:'Sabana de la Mar', parent:9, type: 'Municipio'},
{id:86, name:'Salcedo', parent:10, type: 'Municipio'},
{id:87, name:'Tenares', parent:10, type: 'Municipio'},
{id:88, name:'Villa Tapia', parent:10, type: 'Municipio'},
{id:89, name:'Jimaní', parent:11, type: 'Municipio'},
{id:90, name:'Cristóbal', parent:11, type: 'Municipio'},
{id:91, name:'Duvergé', parent:11, type: 'Municipio'},
{id:92, name:'La Descubierta', parent:11, type: 'Municipio'},
{id:93, name:'Mella', parent:11, type: 'Municipio'},
{id:94, name:'Postrer Río', parent:11, type: 'Municipio'},
{id:95, name:'Higüey', parent:12, type: 'Municipio'},
{id:96, name:'San Rafael del Yuma', parent:12, type: 'Municipio'},
{id:97, name:'La Romana', parent:13, type: 'Municipio'},
{id:98, name:'Guaymate', parent:13, type: 'Municipio'},
{id:99, name:'Villa Hermosa', parent:13, type: 'Municipio'},
{id:100, name:'La Concepción de La Vega', parent:14, type: 'Municipio'},
{id:101, name:'Constanza', parent:14, type: 'Municipio'},
{id:102, name:'Jarabacoa', parent:14, type: 'Municipio'},
{id:103, name:'Jima Abajo', parent:14, type: 'Municipio'},
{id:104, name:'Nagua', parent:15, type: 'Municipio'},
{id:105, name:'Cabrera', parent:15, type: 'Municipio'},
{id:106, name:'El Factor', parent:15, type: 'Municipio'},
{id:107, name:'Río San Juan', parent:15, type: 'Municipio'},
{id:108, name:'Bonao', parent:16, type: 'Municipio'},
{id:109, name:'Maimón', parent:16, type: 'Municipio'},
{id:110, name:'Piedra Blanca', parent:16, type: 'Municipio'},
{id:111, name:'Montecristi', parent:17, type: 'Municipio'},
{id:112, name:'Castañuela', parent:17, type: 'Municipio'},
{id:113, name:'Guayubín', parent:17, type: 'Municipio'},
{id:114, name:'Las Matas de Santa Cruz', parent:17, type: 'Municipio'},
{id:115, name:'Pepillo Salcedo', parent:17, type: 'Municipio'},
{id:116, name:'Villa Vásquez', parent:17, type: 'Municipio'},
{id:117, name:'Monte Plata', parent:18, type: 'Municipio'},
{id:118, name:'Bayaguana', parent:18, type: 'Municipio'},
{id:119, name:'Peralvillo', parent:18, type: 'Municipio'},
{id:120, name:'Sabana Grande de Boyá', parent:18, type: 'Municipio'},
{id:121, name:'Yamasá', parent:18, type: 'Municipio'},
{id:122, name:'Pedernales', parent:19, type: 'Municipio'},
{id:123, name:'Oviedo', parent:19, type: 'Municipio'},
{id:124, name:'Baní', parent:20, type: 'Municipio'},
{id:125, name:'Nizao', parent:20, type: 'Municipio'},
{id:126, name:'Puerto Plata', parent:21, type: 'Municipio'},
{id:127, name:'Altamira', parent:21, type: 'Municipio'},
{id:128, name:'Guananico', parent:21, type: 'Municipio'},
{id:129, name:'Imbert', parent:21, type: 'Municipio'},
{id:130, name:'Los Hidalgos', parent:21, type: 'Municipio'},
{id:131, name:'Luperón', parent:21, type: 'Municipio'},
{id:132, name:'Sosúa', parent:21, type: 'Municipio'},
{id:133, name:'Villa Isabela', parent:21, type: 'Municipio'},
{id:134, name:'Villa Montellano', parent:21, type: 'Municipio'},
{id:135, name:'Samaná', parent:22, type: 'Municipio'},
{id:136, name:'Las Terrenas', parent:22, type: 'Municipio'},
{id:137, name:'Sánchez', parent:22, type: 'Municipio'},
{id:138, name:'San Cristóbal', parent:23, type: 'Municipio'},
{id:139, name:'Bajos de Haina', parent:23, type: 'Municipio'},
{id:140, name:'Cambita Garabito', parent:23, type: 'Municipio'},
{id:141, name:'Los Cacaos', parent:23, type: 'Municipio'},
{id:142, name:'Sabana Grande de Palenque', parent:23, type: 'Municipio'},
{id:143, name:'San Gregorio de Nigua', parent:23, type: 'Municipio'},
{id:144, name:'Villa Altagracia', parent:23, type: 'Municipio'},
{id:145, name:'Yaguate', parent:23, type: 'Municipio'},
{id:146, name:'San José de Ocoa', parent:24, type: 'Municipio'},
{id:147, name:'Rancho Arriba', parent:24, type: 'Municipio'},
{id:148, name:'Sabana Larga', parent:24, type: 'Municipio'},
{id:149, name:'San Juan de la Maguana', parent:25, type: 'Municipio'},
{id:150, name:'Bohechío', parent:25, type: 'Municipio'},
{id:151, name:'El Cercado', parent:25, type: 'Municipio'},
{id:152, name:'Juan de Herrera', parent:25, type: 'Municipio'},
{id:153, name:'Las Matas de Farfán', parent:25, type: 'Municipio'},
{id:154, name:'Vallejuelo', parent:25, type: 'Municipio'},
{id:155, name:'San Pedro de Macorís', parent:26, type: 'Municipio'},
{id:156, name:'Consuelo', parent:26, type: 'Municipio'},
{id:157, name:'Guayacanes', parent:26, type: 'Municipio'},
{id:158, name:'Quisqueya', parent:26, type: 'Municipio'},
{id:159, name:'Ramón Santana', parent:26, type: 'Municipio'},
{id:160, name:'San José de Los Llanos', parent:26, type: 'Municipio'},
{id:161, name:'Cotuí', parent:27, type: 'Municipio'},
{id:162, name:'Cevicos', parent:27, type: 'Municipio'},
{id:163, name:'Fantino', parent:27, type: 'Municipio'},
{id:164, name:'La Mata', parent:27, type: 'Municipio'},
{id:165, name:'Santiago', parent:28, type: 'Municipio'},
{id:166, name:'Bisonó', parent:28, type: 'Municipio'},
{id:167, name:'Jánico', parent:28, type: 'Municipio'},
{id:168, name:'Licey al Medio', parent:28, type: 'Municipio'},
{id:169, name:'Puñal', parent:28, type: 'Municipio'},
{id:170, name:'Sabana Iglesia', parent:28, type: 'Municipio'},
{id:171, name:'San José de las Matas', parent:28, type: 'Municipio'},
{id:172, name:'Tamboril', parent:28, type: 'Municipio'},
{id:173, name:'Villa González', parent:28, type: 'Municipio'},
{id:174, name:'San Ignacio de Sabaneta', parent:29, type: 'Municipio'},
{id:175, name:'Los Almácigos', parent:29, type: 'Municipio'},
{id:176, name:'Monción', parent:29, type: 'Municipio'},
{id:177, name:'Santo Domingo Este', parent:30, type: 'Municipio'},
{id:178, name:'Boca Chica', parent:30, type: 'Municipio'},
{id:179, name:'Los Alcarrizos', parent:30, type: 'Municipio'},
{id:180, name:'Pedro Brand', parent:30, type: 'Municipio'},
{id:181, name:'San Antonio de Guerra', parent:30, type: 'Municipio'},
{id:182, name:'Santo Domingo Norte', parent:30, type: 'Municipio'},
{id:183, name:'Santo Domingo Oeste', parent:30, type: 'Municipio'},
{id:184, name:'Mao', parent:31, type: 'Municipio'},
{id:185, name:'Esperanza', parent:31, type: 'Municipio'},
{id:186, name:'Laguna Salada', parent:31, type: 'Municipio'},
{id:187, name:'Distrito Nacional', parent:32, type: 'Municipio'},
{id:188, name:' Barreras', parent:33, type: 'Distrito Municipal'},
{id:189, name:' Barro Arriba', parent:33, type: 'Distrito Municipal'},
{id:190, name:' Clavellina', parent:33, type: 'Distrito Municipal'},
{id:191, name:' Emma Balaguer Viuda Vallejo', parent:33, type: 'Distrito Municipal'},
{id:192, name:' Las Barías-La Estancia', parent:33, type: 'Distrito Municipal'},
{id:193, name:' Las Lomas', parent:33, type: 'Distrito Municipal'},
{id:194, name:' Los Jovillos', parent:33, type: 'Distrito Municipal'},
{id:195, name:' Puerto Viejo', parent:33, type: 'Distrito Municipal'},
{id:196, name:'Hatillo', parent:36, type: 'Distrito Municipal'},
{id:197, name:'Palmar de Ocoa', parent:36, type: 'Distrito Municipal'},
{id:198, name:'Villarpando', parent:37, type: 'Distrito Municipal'},
{id:199, name:'Hato Nuevo-Cortés', parent:37, type: 'Distrito Municipal'},
{id:200, name:'La Siembra', parent:38, type: 'Distrito Municipal'},
{id:201, name:' Las Lagunas', parent:38, type: 'Distrito Municipal'},
{id:202, name:' Los Fríos', parent:38, type: 'Distrito Municipal'},
{id:203, name:'El Rosario', parent:40, type: 'Distrito Municipal'},
{id:204, name:'Proyecto 4', parent:41, type: 'Distrito Municipal'},
{id:205, name:'Ganadero', parent:41, type: 'Distrito Municipal'},
{id:206, name:'Proyecto 2-C', parent:41, type: 'Distrito Municipal'},
{id:207, name:'Amiama Gómez', parent:42, type: 'Distrito Municipal'},
{id:208, name:'Los Toros', parent:42, type: 'Distrito Municipal'},
{id:209, name:'Tábara Abajo', parent:42, type: 'Distrito Municipal'},
{id:210, name:'El Palmar', parent:43, type: 'Distrito Municipal'},
{id:211, name:'El Salado', parent:44, type: 'Distrito Municipal'},
{id:212, name:'Las Clavellinas', parent:45, type: 'Distrito Municipal'},
{id:213, name:'Cabeza de Toro', parent:46, type: 'Distrito Municipal'},
{id:214, name:'Mena', parent:46, type: 'Distrito Municipal'},
{id:215, name:'Monserrat', parent:46, type: 'Distrito Municipal'},
{id:216, name:'Santa Bárbara-El 6', parent:46, type: 'Distrito Municipal'},
{id:217, name:'Santana', parent:46, type: 'Distrito Municipal'},
{id:218, name:'Uvilla', parent:46, type: 'Distrito Municipal'},
{id:219, name:' El Cachón', parent:48, type: 'Distrito Municipal'},
{id:220, name:' La Guázara', parent:48, type: 'Distrito Municipal'},
{id:221, name:' Villa Central', parent:48, type: 'Distrito Municipal'},
{id:222, name:'Arroyo Dulce', parent:51, type: 'Distrito Municipal'},
{id:223, name:'Pescadería', parent:52, type: 'Distrito Municipal'},
{id:224, name:'Palo Alto', parent:53, type: 'Distrito Municipal'},
{id:225, name:'Bahoruco', parent:54, type: 'Distrito Municipal'},
{id:226, name:'Los Patos', parent:56, type: 'Distrito Municipal'},
{id:227, name:'Canoa', parent:58, type: 'Distrito Municipal'},
{id:228, name:'Fondo Negro', parent:58, type: 'Distrito Municipal'},
{id:229, name:'Quita Coraza', parent:58, type: 'Distrito Municipal'},
{id:230, name:'Cañongo', parent:59, type: 'Distrito Municipal'},
{id:231, name:'Manuel Bueno', parent:60, type: 'Distrito Municipal'},
{id:232, name:'Capotillo', parent:61, type: 'Distrito Municipal'},
{id:233, name:'Santiago de la Cruz', parent:61, type: 'Distrito Municipal'},
{id:234, name:'Cenoví', parent:64, type: 'Distrito Municipal'},
{id:235, name:'Jaya', parent:64, type: 'Distrito Municipal'},
{id:236, name:'La Peña', parent:64, type: 'Distrito Municipal'},
{id:237, name:'Presidente Antonio Guzmán Fernández', parent:64, type: 'Distrito Municipal'},
{id:238, name:' Aguacate', parent:65, type: 'Distrito Municipal'},
{id:239, name:' Las Coles', parent:65, type: 'Distrito Municipal'},
{id:240, name:'Sabana Grande', parent:67, type: 'Distrito Municipal'},
{id:241, name:' Agua Santa del Yuna', parent:70, type: 'Distrito Municipal'},
{id:242, name:' Barraquito', parent:70, type: 'Distrito Municipal'},
{id:243, name:' Cristo Rey de Guaraguao', parent:70, type: 'Distrito Municipal'},
{id:244, name:' Las Táranas', parent:70, type: 'Distrito Municipal'},
{id:245, name:'Comendador', parent:71, type: 'Distrito Municipal'},
{id:246, name:'Sabana Larga', parent:71, type: 'Distrito Municipal'},
{id:247, name:' Sabana Cruz', parent:72, type: 'Distrito Municipal'},
{id:248, name:' Sabana Higüero', parent:72, type: 'Distrito Municipal'},
{id:249, name:'Guanito', parent:73, type: 'Distrito Municipal'},
{id:250, name:'Rancho de la Guardia', parent:74, type: 'Distrito Municipal'},
{id:251, name:'Río Limpio', parent:76, type: 'Distrito Municipal'},
{id:252, name:' Pedro Sánchez', parent:77, type: 'Distrito Municipal'},
{id:253, name:' San Francisco-Vicentillo', parent:77, type: 'Distrito Municipal'},
{id:254, name:' Santa Lucía', parent:77, type: 'Distrito Municipal'},
{id:255, name:'El Cedro', parent:78, type: 'Distrito Municipal'},
{id:256, name:'La Gina', parent:78, type: 'Distrito Municipal'},
{id:257, name:' Canca La Reina', parent:79, type: 'Distrito Municipal'},
{id:258, name:' El Higüerito', parent:79, type: 'Distrito Municipal'},
{id:259, name:' José Contreras', parent:79, type: 'Distrito Municipal'},
{id:260, name:' Juan López', parent:79, type: 'Distrito Municipal'},
{id:261, name:' La Ortega', parent:79, type: 'Distrito Municipal'},
{id:262, name:' Las Lagunas', parent:79, type: 'Distrito Municipal'},
{id:263, name:' Monte de la Jagua', parent:79, type: 'Distrito Municipal'},
{id:264, name:' San Víctor', parent:79, type: 'Distrito Municipal'},
{id:265, name:' Guayabo Dulce', parent:83, type: 'Distrito Municipal'},
{id:266, name:' Mata Palacio', parent:83, type: 'Distrito Municipal'},
{id:267, name:' Yerba Buena', parent:83, type: 'Distrito Municipal'},
{id:268, name:'Elupina Cordero de Las Cañitas', parent:85, type: 'Distrito Municipal'},
{id:269, name:'Jamao Afuera', parent:86, type: 'Distrito Municipal'},
{id:270, name:'Blanco', parent:87, type: 'Distrito Municipal'},
{id:271, name:'Boca de Cachón', parent:89, type: 'Distrito Municipal'},
{id:272, name:'El Limón', parent:89, type: 'Distrito Municipal'},
{id:273, name:'Batey 8', parent:90, type: 'Distrito Municipal'},
{id:274, name:'Vengan a Ver', parent:91, type: 'Distrito Municipal'},
{id:275, name:'La Colonia', parent:93, type: 'Distrito Municipal'},
{id:276, name:'Guayabal', parent:94, type: 'Distrito Municipal'},
{id:277, name:' La Otra Banda', parent:95, type: 'Distrito Municipal'},
{id:278, name:' Lagunas de Nisibón', parent:95, type: 'Distrito Municipal'},
{id:279, name:' Verón-Punta Cana', parent:95, type: 'Distrito Municipal'},
{id:280, name:'Bayahibe', parent:96, type: 'Distrito Municipal'},
{id:281, name:'Boca de Yuma', parent:96, type: 'Distrito Municipal'},
{id:282, name:'Caleta', parent:97, type: 'Distrito Municipal'},
{id:283, name:'Cumayasa', parent:99, type: 'Distrito Municipal'},
{id:284, name:' El Ranchito', parent:100, type: 'Distrito Municipal'},
{id:285, name:' Río Verde Arriba', parent:100, type: 'Distrito Municipal'},
{id:286, name:'La Sabina', parent:101, type: 'Distrito Municipal'},
{id:287, name:'Tireo', parent:101, type: 'Distrito Municipal'},
{id:288, name:'Buena Vista', parent:102, type: 'Distrito Municipal'},
{id:289, name:'Manabao', parent:102, type: 'Distrito Municipal'},
{id:290, name:'Rincón', parent:103, type: 'Distrito Municipal'},
{id:291, name:' Arroyo al Medio', parent:104, type: 'Distrito Municipal'},
{id:292, name:' Las Gordas', parent:104, type: 'Distrito Municipal'},
{id:293, name:' San José de Matanzas', parent:104, type: 'Distrito Municipal'},
{id:294, name:' Arroyo Salado', parent:105, type: 'Distrito Municipal'},
{id:295, name:' La Entrada', parent:105, type: 'Distrito Municipal'},
{id:296, name:'El Pozo', parent:106, type: 'Distrito Municipal'},
{id:297, name:' Arroyo Toro-Masipedro', parent:108, type: 'Distrito Municipal'},
{id:298, name:' La Salvia-Los Quemados', parent:108, type: 'Distrito Municipal'},
{id:299, name:' Jayaco', parent:108, type: 'Distrito Municipal'},
{id:300, name:' Juma Bejucal', parent:108, type: 'Distrito Municipal'},
{id:301, name:' Sabana del Puerto', parent:108, type: 'Distrito Municipal'},
{id:302, name:' Juan Adrián', parent:110, type: 'Distrito Municipal'},
{id:303, name:' Villa Sonador', parent:110, type: 'Distrito Municipal'},
{id:304, name:'Palo Verde', parent:112, type: 'Distrito Municipal'},
{id:305, name:' Cana Chapetón', parent:113, type: 'Distrito Municipal'},
{id:306, name:' Hatillo Palma', parent:113, type: 'Distrito Municipal'},
{id:307, name:' Villa Elisa', parent:113, type: 'Distrito Municipal'},
{id:308, name:' Boyá', parent:117, type: 'Distrito Municipal'},
{id:309, name:' Chirino', parent:117, type: 'Distrito Municipal'},
{id:310, name:' Don Juan', parent:117, type: 'Distrito Municipal'},
{id:311, name:' Gonzalo', parent:120, type: 'Distrito Municipal'},
{id:312, name:' Majagual', parent:120, type: 'Distrito Municipal'},
{id:313, name:'Los Botados', parent:121, type: 'Distrito Municipal'},
{id:314, name:'José Francisco Peña Gómez', parent:122, type: 'Distrito Municipal'},
{id:315, name:'Juancho', parent:122, type: 'Distrito Municipal'},
{id:316, name:' Catalina', parent:124, type: 'Distrito Municipal'},
{id:317, name:' El Carretón', parent:124, type: 'Distrito Municipal'},
{id:318, name:' El Limonal', parent:124, type: 'Distrito Municipal'},
{id:319, name:' Las Barías', parent:124, type: 'Distrito Municipal'},
{id:320, name:' Matanzas', parent:124, type: 'Distrito Municipal'},
{id:321, name:' Paya', parent:124, type: 'Distrito Municipal'},
{id:322, name:' Sabana Buey', parent:124, type: 'Distrito Municipal'},
{id:323, name:' Villa Fundación', parent:124, type: 'Distrito Municipal'},
{id:324, name:' Villa Sombrero', parent:124, type: 'Distrito Municipal'},
{id:325, name:'Pizarrete', parent:125, type: 'Distrito Municipal'},
{id:326, name:'Santana', parent:125, type: 'Distrito Municipal'},
{id:327, name:'Maimón', parent:126, type: 'Distrito Municipal'},
{id:328, name:'Yásica Arriba', parent:126, type: 'Distrito Municipal'},
{id:329, name:'Río Grande', parent:127, type: 'Distrito Municipal'},
{id:330, name:'Navas', parent:130, type: 'Distrito Municipal'},
{id:331, name:' Belloso', parent:131, type: 'Distrito Municipal'},
{id:332, name:' Estrecho', parent:131, type: 'Distrito Municipal'},
{id:333, name:' La Isabela', parent:131, type: 'Distrito Municipal'},
{id:334, name:'Cabarete', parent:132, type: 'Distrito Municipal'},
{id:335, name:'Sabaneta de Yásica', parent:132, type: 'Distrito Municipal'},
{id:336, name:' Estero Hondo', parent:133, type: 'Distrito Municipal'},
{id:337, name:' Gualete', parent:133, type: 'Distrito Municipal'},
{id:338, name:' La Jaiba', parent:133, type: 'Distrito Municipal'},
{id:339, name:' Arroyo Barril', parent:135, type: 'Distrito Municipal'},
{id:340, name:' El Limón', parent:135, type: 'Distrito Municipal'},
{id:341, name:' Las Galeras', parent:135, type: 'Distrito Municipal'},
{id:342, name:'Hato Damas', parent:138, type: 'Distrito Municipal'},
{id:343, name:'El Carril', parent:139, type: 'Distrito Municipal'},
{id:344, name:'Cambita El Pueblecito', parent:140, type: 'Distrito Municipal'},
{id:345, name:'La Cuchilla', parent:144, type: 'Distrito Municipal'},
{id:346, name:'Medina', parent:144, type: 'Distrito Municipal'},
{id:347, name:'San José del', parent:144, type: 'Distrito Municipal'},
{id:348, name:' El Naranjal', parent:146, type: 'Distrito Municipal'},
{id:349, name:' El Pinar', parent:146, type: 'Distrito Municipal'},
{id:350, name:' La Ciénaga', parent:146, type: 'Distrito Municipal'},
{id:351, name:' Nizao-Las Auyamas', parent:146, type: 'Distrito Municipal'},
{id:352, name:' El Rosario', parent:149, type: 'Distrito Municipal'},
{id:353, name:' Guanito', parent:149, type: 'Distrito Municipal'},
{id:354, name:' Hato del Padre', parent:149, type: 'Distrito Municipal'},
{id:355, name:' Hato Nuevo', parent:149, type: 'Distrito Municipal'},
{id:356, name:' La Jagua', parent:149, type: 'Distrito Municipal'},
{id:357, name:' Las Charcas de María Nova', parent:149, type: 'Distrito Municipal'},
{id:358, name:' Pedro Corto', parent:149, type: 'Distrito Municipal'},
{id:359, name:' Sabana Alta', parent:149, type: 'Distrito Municipal'},
{id:360, name:' Sabaneta', parent:149, type: 'Distrito Municipal'},
{id:361, name:' Arroyo Cano', parent:150, type: 'Distrito Municipal'},
{id:362, name:' Yaque', parent:150, type: 'Distrito Municipal'},
{id:363, name:' Batista', parent:151, type: 'Distrito Municipal'},
{id:364, name:' Derrumbadero', parent:151, type: 'Distrito Municipal'},
{id:365, name:'Jínova', parent:152, type: 'Distrito Municipal'},
{id:366, name:' Carrera de Yegua', parent:153, type: 'Distrito Municipal'},
{id:367, name:' Matayaya', parent:153, type: 'Distrito Municipal'},
{id:368, name:' Jorjillo', parent:154, type: 'Distrito Municipal'},
{id:369, name:' El Puerto', parent:160, type: 'Distrito Municipal'},
{id:370, name:' Gautier', parent:160, type: 'Distrito Municipal'},
{id:371, name:' Caballero', parent:161, type: 'Distrito Municipal'},
{id:372, name:' Comedero Arriba', parent:161, type: 'Distrito Municipal'},
{id:373, name:' Quita Sueño', parent:161, type: 'Distrito Municipal'},
{id:374, name:'La Cueva', parent:162, type: 'Distrito Municipal'},
{id:375, name:'Platanal', parent:162, type: 'Distrito Municipal'},
{id:376, name:' Angelina', parent:164, type: 'Distrito Municipal'},
{id:377, name:' La Bija', parent:164, type: 'Distrito Municipal'},
{id:378, name:' Hernando Alonzo', parent:164, type: 'Distrito Municipal'},
{id:379, name:' Baitoa', parent:165, type: 'Distrito Municipal'},
{id:380, name:' Hato del Yaque', parent:165, type: 'Distrito Municipal'},
{id:381, name:' La Canela', parent:165, type: 'Distrito Municipal'},
{id:382, name:' Pedro García', parent:165, type: 'Distrito Municipal'},
{id:383, name:' San Francisco de Jacagua', parent:165, type: 'Distrito Municipal'},
{id:384, name:' El Caimito', parent:167, type: 'Distrito Municipal'},
{id:385, name:' Juncalito', parent:167, type: 'Distrito Municipal'},
{id:386, name:'Las Palomas', parent:168, type: 'Distrito Municipal'},
{id:387, name:' Canabacoa', parent:169, type: 'Distrito Municipal'},
{id:388, name:' Guayabal', parent:169, type: 'Distrito Municipal'},
{id:389, name:' El Rubio', parent:171, type: 'Distrito Municipal'},
{id:390, name:' La Cuesta', parent:171, type: 'Distrito Municipal'},
{id:391, name:' Las Placetas', parent:171, type: 'Distrito Municipal'},
{id:392, name:'Canca La Piedra', parent:172, type: 'Distrito Municipal'},
{id:393, name:' El Limón', parent:173, type: 'Distrito Municipal'},
{id:394, name:' Palmar Arriba', parent:173, type: 'Distrito Municipal'},
{id:395, name:'San Luis', parent:177, type: 'Distrito Municipal'},
{id:396, name:'La Caleta', parent:178, type: 'Distrito Municipal'},
{id:397, name:' Palmarejo-Villa Linda', parent:179, type: 'Distrito Municipal'},
{id:398, name:' Pantoja', parent:179, type: 'Distrito Municipal'},
{id:399, name:' La Cuaba', parent:180, type: 'Distrito Municipal'},
{id:400, name:' La Guáyiga', parent:180, type: 'Distrito Municipal'},
{id:401, name:'Hato Viejo', parent:181, type: 'Distrito Municipal'},
{id:402, name:'La Victoria', parent:182, type: 'Distrito Municipal'},
{id:403, name:' Ámina', parent:184, type: 'Distrito Municipal'},
{id:404, name:' Guatapanal', parent:184, type: 'Distrito Municipal'},
{id:405, name:' Jaibón (Pueblo Nuevo)', parent:184, type: 'Distrito Municipal'},
{id:406, name:' Boca de Mao', parent:185, type: 'Distrito Municipal'},
{id:407, name:' Jicomé', parent:185, type: 'Distrito Municipal'},
{id:408, name:' Maizal', parent:185, type: 'Distrito Municipal'},
{id:409, name:' Paradero', parent:185, type: 'Distrito Municipal'},
{id:410, name:' Cruce de Guayacanes', parent:186, type: 'Distrito Municipal'},
{id:411, name:' Jaibón', parent:186, type: 'Distrito Municipal'},
{id:412, name:' La Caya', parent:186, type: 'Distrito Municipal'}
])