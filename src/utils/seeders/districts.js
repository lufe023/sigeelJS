const Districts = require('../../models/district.models')

Districts.bulkCreate([
    {id:188, name:' Barreras', parent:33},
    {id:189, name:' Barro Arriba', parent:33},
    {id:190, name:' Clavellina', parent:33},
    {id:191, name:' Emma Balaguer Viuda Vallejo', parent:33},
    {id:192, name:' Las Barías-La Estancia', parent:33},
    {id:193, name:' Las Lomas', parent:33},
    {id:194, name:' Los Jovillos', parent:33},
    {id:195, name:' Puerto Viejo', parent:33},
    {id:196, name:'Hatillo', parent:36},
    {id:197, name:'Palmar de Ocoa', parent:36},
    {id:198, name:'Villarpando', parent:37},
    {id:199, name:'Hato Nuevo-Cortés', parent:37},
    {id:200, name:'La Siembra', parent:38},
    {id:201, name:' Las Lagunas', parent:38},
    {id:202, name:' Los Fríos', parent:38},
    {id:203, name:'El Rosario', parent:40},
    {id:204, name:'Proyecto 4', parent:41},
    {id:205, name:'Ganadero', parent:41},
    {id:206, name:'Proyecto 2-C', parent:41},
    {id:207, name:'Amiama Gómez', parent:42},
    {id:208, name:'Los Toros', parent:42},
    {id:209, name:'Tábara Abajo', parent:42},
    {id:210, name:'El Palmar', parent:43},
    {id:211, name:'El Salado', parent:44},
    {id:212, name:'Las Clavellinas', parent:45},
    {id:213, name:'Cabeza de Toro', parent:46},
    {id:214, name:'Mena', parent:46},
    {id:215, name:'Monserrat', parent:46},
    {id:216, name:'Santa Bárbara-El 6', parent:46},
    {id:217, name:'Santana', parent:46},
    {id:218, name:'Uvilla', parent:46},
    {id:219, name:' El Cachón', parent:48},
    {id:220, name:' La Guázara', parent:48},
    {id:221, name:' Villa Central', parent:48},
    {id:222, name:'Arroyo Dulce', parent:51},
    {id:223, name:'Pescadería', parent:52},
    {id:224, name:'Palo Alto', parent:53},
    {id:225, name:'Bahoruco', parent:54},
    {id:226, name:'Los Patos', parent:56},
    {id:227, name:'Canoa', parent:58},
    {id:228, name:'Fondo Negro', parent:58},
    {id:229, name:'Quita Coraza', parent:58},
    {id:230, name:'Cañongo', parent:59},
    {id:231, name:'Manuel Bueno', parent:60},
    {id:232, name:'Capotillo', parent:61},
    {id:233, name:'Santiago de la Cruz', parent:61},
    {id:234, name:'Cenoví', parent:64},
    {id:235, name:'Jaya', parent:64},
    {id:236, name:'La Peña', parent:64},
    {id:237, name:'Presidente Antonio Guzmán Fernández', parent:64},
    {id:238, name:' Aguacate', parent:65},
    {id:239, name:' Las Coles', parent:65},
    {id:240, name:'Sabana Grande', parent:67},
    {id:241, name:' Agua Santa del Yuna', parent:70},
    {id:242, name:' Barraquito', parent:70},
    {id:243, name:' Cristo Rey de Guaraguao', parent:70},
    {id:244, name:' Las Táranas', parent:70},
    {id:245, name:'Comendador', parent:71},
    {id:246, name:'Sabana Larga', parent:71},
    {id:247, name:' Sabana Cruz', parent:72},
    {id:248, name:' Sabana Higüero', parent:72},
    {id:249, name:'Guanito', parent:73},
    {id:250, name:'Rancho de la Guardia', parent:74},
    {id:251, name:'Río Limpio', parent:76},
    {id:252, name:' Pedro Sánchez', parent:77},
    {id:253, name:' San Francisco-Vicentillo', parent:77},
    {id:254, name:' Santa Lucía', parent:77},
    {id:255, name:'El Cedro', parent:78},
    {id:256, name:'La Gina', parent:78},
    {id:257, name:' Canca La Reina', parent:79},
    {id:258, name:' El Higüerito', parent:79},
    {id:259, name:' José Contreras', parent:79},
    {id:260, name:' Juan López', parent:79},
    {id:261, name:' La Ortega', parent:79},
    {id:262, name:' Las Lagunas', parent:79},
    {id:263, name:' Monte de la Jagua', parent:79},
    {id:264, name:' San Víctor', parent:79},
    {id:265, name:' Guayabo Dulce', parent:83},
    {id:266, name:' Mata Palacio', parent:83},
    {id:267, name:' Yerba Buena', parent:83},
    {id:268, name:'Elupina Cordero de Las Cañitas', parent:85},
    {id:269, name:'Jamao Afuera', parent:86},
    {id:270, name:'Blanco', parent:87},
    {id:271, name:'Boca de Cachón', parent:89},
    {id:272, name:'El Limón', parent:89},
    {id:273, name:'Batey 8', parent:90},
    {id:274, name:'Vengan a Ver', parent:91},
    {id:275, name:'La Colonia', parent:93},
    {id:276, name:'Guayabal', parent:94},
    {id:277, name:' La Otra Banda', parent:95},
    {id:278, name:' Lagunas de Nisibón', parent:95},
    {id:279, name:' Verón-Punta Cana', parent:95},
    {id:280, name:'Bayahibe', parent:96},
    {id:281, name:'Boca de Yuma', parent:96},
    {id:282, name:'Caleta', parent:97},
    {id:283, name:'Cumayasa', parent:99},
    {id:284, name:' El Ranchito', parent:100},
    {id:285, name:' Río Verde Arriba', parent:100},
    {id:286, name:'La Sabina', parent:101},
    {id:287, name:'Tireo', parent:101},
    {id:288, name:'Buena Vista', parent:102},
    {id:289, name:'Manabao', parent:102},
    {id:290, name:'Rincón', parent:103},
    {id:291, name:' Arroyo al Medio', parent:104},
    {id:292, name:' Las Gordas', parent:104},
    {id:293, name:' San José de Matanzas', parent:104},
    {id:294, name:' Arroyo Salado', parent:105},
    {id:295, name:' La Entrada', parent:105},
    {id:296, name:'El Pozo', parent:106},
    {id:297, name:' Arroyo Toro-Masipedro', parent:108},
    {id:298, name:' La Salvia-Los Quemados', parent:108},
    {id:299, name:' Jayaco', parent:108},
    {id:300, name:' Juma Bejucal', parent:108},
    {id:301, name:' Sabana del Puerto', parent:108},
    {id:302, name:' Juan Adrián', parent:110},
    {id:303, name:' Villa Sonador', parent:110},
    {id:304, name:'Palo Verde', parent:112},
    {id:305, name:' Cana Chapetón', parent:113},
    {id:306, name:' Hatillo Palma', parent:113},
    {id:307, name:' Villa Elisa', parent:113},
    {id:308, name:' Boyá', parent:117},
    {id:309, name:' Chirino', parent:117},
    {id:310, name:' Don Juan', parent:117},
    {id:311, name:' Gonzalo', parent:120},
    {id:312, name:' Majagual', parent:120},
    {id:313, name:'Los Botados', parent:121},
    {id:314, name:'José Francisco Peña Gómez', parent:122},
    {id:315, name:'Juancho', parent:122},
    {id:316, name:' Catalina', parent:124},
    {id:317, name:' El Carretón', parent:124},
    {id:318, name:' El Limonal', parent:124},
    {id:319, name:' Las Barías', parent:124},
    {id:320, name:' Matanzas', parent:124},
    {id:321, name:' Paya', parent:124},
    {id:322, name:' Sabana Buey', parent:124},
    {id:323, name:' Villa Fundación', parent:124},
    {id:324, name:' Villa Sombrero', parent:124},
    {id:325, name:'Pizarrete', parent:125},
    {id:326, name:'Santana', parent:125},
    {id:327, name:'Maimón', parent:126},
    {id:328, name:'Yásica Arriba', parent:126},
    {id:329, name:'Río Grande', parent:127},
    {id:330, name:'Navas', parent:130},
    {id:331, name:' Belloso', parent:131},
    {id:332, name:' Estrecho', parent:131},
    {id:333, name:' La Isabela', parent:131},
    {id:334, name:'Cabarete', parent:132},
    {id:335, name:'Sabaneta de Yásica', parent:132},
    {id:336, name:' Estero Hondo', parent:133},
    {id:337, name:' Gualete', parent:133},
    {id:338, name:' La Jaiba', parent:133},
    {id:339, name:' Arroyo Barril', parent:135},
    {id:340, name:' El Limón', parent:135},
    {id:341, name:' Las Galeras', parent:135},
    {id:342, name:'Hato Damas', parent:138},
    {id:343, name:'El Carril', parent:139},
    {id:344, name:'Cambita El Pueblecito', parent:140},
    {id:345, name:'La Cuchilla', parent:144},
    {id:346, name:'Medina', parent:144},
    {id:347, name:'San José del', parent:144},
    {id:348, name:' El Naranjal', parent:146},
    {id:349, name:' El Pinar', parent:146},
    {id:350, name:' La Ciénaga', parent:146},
    {id:351, name:' Nizao-Las Auyamas', parent:146},
    {id:352, name:' El Rosario', parent:149},
    {id:353, name:' Guanito', parent:149},
    {id:354, name:' Hato del Padre', parent:149},
    {id:355, name:' Hato Nuevo', parent:149},
    {id:356, name:' La Jagua', parent:149},
    {id:357, name:' Las Charcas de María Nova', parent:149},
    {id:358, name:' Pedro Corto', parent:149},
    {id:359, name:' Sabana Alta', parent:149},
    {id:360, name:' Sabaneta', parent:149},
    {id:361, name:' Arroyo Cano', parent:150},
    {id:362, name:' Yaque', parent:150},
    {id:363, name:' Batista', parent:151},
    {id:364, name:' Derrumbadero', parent:151},
    {id:365, name:'Jínova', parent:152},
    {id:366, name:' Carrera de Yegua', parent:153},
    {id:367, name:' Matayaya', parent:153},
    {id:368, name:' Jorjillo', parent:154},
    {id:369, name:' El Puerto', parent:160},
    {id:370, name:' Gautier', parent:160},
    {id:371, name:' Caballero', parent:161},
    {id:372, name:' Comedero Arriba', parent:161},
    {id:373, name:' Quita Sueño', parent:161},
    {id:374, name:'La Cueva', parent:162},
    {id:375, name:'Platanal', parent:162},
    {id:376, name:' Angelina', parent:164},
    {id:377, name:' La Bija', parent:164},
    {id:378, name:' Hernando Alonzo', parent:164},
    {id:379, name:' Baitoa', parent:165},
    {id:380, name:' Hato del Yaque', parent:165},
    {id:381, name:' La Canela', parent:165},
    {id:382, name:' Pedro García', parent:165},
    {id:383, name:' San Francisco de Jacagua', parent:165},
    {id:384, name:' El Caimito', parent:167},
    {id:385, name:' Juncalito', parent:167},
    {id:386, name:'Las Palomas', parent:168},
    {id:387, name:' Canabacoa', parent:169},
    {id:388, name:' Guayabal', parent:169},
    {id:389, name:' El Rubio', parent:171},
    {id:390, name:' La Cuesta', parent:171},
    {id:391, name:' Las Placetas', parent:171},
    {id:392, name:'Canca La Piedra', parent:172},
    {id:393, name:' El Limón', parent:173},
    {id:394, name:' Palmar Arriba', parent:173},
    {id:395, name:'San Luis', parent:177},
    {id:396, name:'La Caleta', parent:178},
    {id:397, name:' Palmarejo-Villa Linda', parent:179},
    {id:398, name:' Pantoja', parent:179},
    {id:399, name:' La Cuaba', parent:180},
    {id:400, name:' La Guáyiga', parent:180},
    {id:401, name:'Hato Viejo', parent:181},
    {id:402, name:'La Victoria', parent:182},
    {id:403, name:' Ámina', parent:184},
    {id:404, name:' Guatapanal', parent:184},
    {id:405, name:' Jaibón (Pueblo Nuevo)', parent:184},
    {id:406, name:' Boca de Mao', parent:185},
    {id:407, name:' Jicomé', parent:185},
    {id:408, name:' Maizal', parent:185},
    {id:409, name:' Paradero', parent:185},
    {id:410, name:' Cruce de Guayacanes', parent:186},
    {id:411, name:' Jaibón', parent:186},
    {id:412, name:' La Caya', parent:186}
])
