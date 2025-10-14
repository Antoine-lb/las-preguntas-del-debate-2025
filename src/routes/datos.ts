/**
 * Datos de debates presidenciales de Chile 2025
 * Incluye información de debates y preguntas
 * Las respuestas se cargan desde archivos JSON en la carpeta respuestas/
 */

import respuestasClapes from './respuestas/clapes-uc-2025-08-05.json';
import respuestasT13 from './respuestas/primarias-oficialistas-t13-2025-06-15.json';
import respuestasTVN from './respuestas/primarias-oficialistas-tvn-2025-06-22.json';
import respuestasSalmon from './respuestas/salmon-summit-2025-07-22.json';
import respuestasSOFOFA from './respuestas/sofofa-2025-07-31.json';
import respuestasMineria from './respuestas/mineria-uc-2025-08-06.json';
import respuestasAsimet from './respuestas/asimet-foro-2025-08-28.json';
import respuestasCHV from './respuestas/chv-debate-presidencial-2025-09-10-BASE.json';
import respuestasEnatrans from './respuestas/enatrans-2025-08-07.json';
import respuestasIcare from './respuestas/icare-congreso-2025-08-26-BASE.json';
import respuestasEnade from './respuestas/enade-icare-2025-10-14.json';

export interface Debate {
	id: string;
	nombre: string;
	fecha: string;
	organizador: string;
	duracion?: string;
	conductores?: string[];
	transcriptUrl: string;
	candidatosIds: string[];
}

export interface Tema {
	id: string;
	nombre: string;
	color: string; // Color en hexadecimal
}

export interface Pregunta {
	id: string;
	debateId: string;
	pregunta: string;
	orden: number;
	temaId?: string; // Tema/categoría de la pregunta (opcional)
}

export interface Respuesta {
	preguntaId: string;
	candidatoId: string;
	resumen: string;
	timestamp?: number; // Segundos desde el inicio de la transcripción
}

/**
 * Temas/Categorías de las preguntas
 */
export const temas: Tema[] = [
	{
		id: 'economia',
		nombre: 'Economía',
		color: '#2563eb' // Azul
	},
	{
		id: 'seguridad',
		nombre: 'Seguridad',
		color: '#dc2626' // Rojo
	},
	{
		id: 'medio-ambiente',
		nombre: 'Medio Ambiente',
		color: '#16a34a' // Verde
	},
	{
		id: 'transporte',
		nombre: 'Transporte',
		color: '#ea580c' // Naranja oscuro
	},
	{
		id: 'relaciones-exteriores',
		nombre: 'Relaciones Exteriores',
		color: '#7c3aed' // Púrpura
	},
	{
		id: 'salud',
		nombre: 'Salud',
		color: '#ec4899' // Rosa
	},
	{
		id: 'educacion',
		nombre: 'Educación',
		color: '#f59e0b' // Amarillo/Ámbar
	},
	{
		id: 'empleo',
		nombre: 'Empleo y Trabajo',
		color: '#0891b2' // Cian
	}
];

/**
 * Obtiene un tema por ID
 */
export const getTemaById = (id: string): Tema | undefined => {
	return temas.find((t) => t.id === id);
};

/**
 * Lista de debates presidenciales 2025
 */
export const debates2025: Debate[] = [
	{
		id: 'enade-icare-2025-10-14',
		nombre: 'ENADE 2025: Verba et Facta - Panel Presidencial',
		fecha: '2025-10-14',
		organizador: 'ICARE (Instituto Chileno de Administración Racional de Empresas)',
		duracion: '2h',
		conductores: ['Juan Manuel Astorga'],
		transcriptUrl: '',
		candidatosIds: [
			'jose-antonio-kast',
			'jeannette-jara',
			'harold-mayne-nicholls',
			'franco-parisi',
			'johannes-kaiser',
			'evelyn-matthei',
			'marco-enriquez-ominami'
		]
	},
	{
		id: 'chv-debate-presidencial-2025-09-10',
		nombre: 'Primer Debate Presidencial 2025',
		fecha: '2025-09-10',
		organizador: 'CHV Noticias (Chilevisión)',
		duracion: 'Múltiples segmentos',
		conductores: ['Daniel Matamala', 'Macarena Pizarro', 'Andrea Arístegui'],
		transcriptUrl: 'https://parlamento.ai/p/transcripts/cl/5497',
		candidatosIds: [
			'jose-antonio-kast',
			'jeannette-jara',
			'eduardo-artes',
			'harold-mayne-nicholls',
			'franco-parisi',
			'johannes-kaiser',
			'evelyn-matthei',
			'marco-enriquez-ominami'
		]
	},
	{
		id: 'asimet-foro-2025-08-28',
		nombre: 'Foro Anual de la Industria ASIMET 2025',
		fecha: '2025-08-28',
		organizador: 'ASIMET (Asociación de Industrias Metalúrgicas y Metal Mecánica)',
		duracion: '3h 8m',
		conductores: ['Cristian Pino', 'Cristina González'],
		transcriptUrl: 'https://parlamento.ai/p/transcripts/cl/5309',
		candidatosIds: [
			'jose-antonio-kast',
			'marco-enriquez-ominami',
			'evelyn-matthei',
			'johannes-kaiser',
			'franco-parisi'
		]
	},
	{
		id: 'icare-congreso-2025-08-26',
		nombre: 'Congreso de Organización y Personas ICARE 2025',
		fecha: '2025-08-26',
		organizador: 'ICARE (Instituto Chileno de Administración Racional de Empresas)',
		duracion: '5h 25m',
		transcriptUrl: 'https://parlamento.ai/p/transcripts/cl/5280',
		candidatosIds: ['johannes-kaiser', 'jose-antonio-kast', 'evelyn-matthei', 'franco-parisi']
	},
	{
		id: 'enatrans-2025-08-07',
		nombre: 'ENATRANS 2025 - Debate Presidencial del Transporte',
		fecha: '2025-08-07',
		organizador: 'Chile Transporte',
		duracion: '2h 53m',
		transcriptUrl: 'https://parlamento.ai/p/transcripts/cl/5061',
		candidatosIds: [
			'evelyn-matthei',
			'johannes-kaiser',
			'franco-parisi',
			'jose-antonio-kast',
			'jeannette-jara'
		]
	},
	{
		id: 'mineria-uc-2025-08-06',
		nombre: 'El Futuro de la Minería en Chile',
		fecha: '2025-08-06',
		organizador: 'Centro de Estudiantes Mineros y Pontificia Universidad Católica de Chile',
		duracion: '1h 32m',
		transcriptUrl: 'https://parlamento.ai/p/transcripts/cl/5059',
		candidatosIds: [
			'evelyn-matthei',
			'johannes-kaiser',
			'franco-parisi',
			'jose-antonio-kast',
			'jeannette-jara'
		]
	},
	{
		id: 'sofofa-2025-07-31',
		nombre: 'Seminario SOFOFA - Volver a crecer',
		fecha: '2025-07-31',
		organizador: 'SOFOFA Chile y La Tercera',
		duracion: '3h 41m',
		transcriptUrl: 'https://parlamento.ai/p/transcripts/cl/4970',
		candidatosIds: ['jeannette-jara', 'jose-antonio-kast', 'evelyn-matthei']
	},
	{
		id: 'clapes-uc-2025-08-05',
		nombre: 'CLAPES UC - Seminarios Presidenciales 2025',
		fecha: '2025-08-05',
		organizador: 'CLAPES UC (Centro Latinoamericano de Políticas Económicas y Sociales)',
		duracion: '1h 34m',
		transcriptUrl: 'https://parlamento.ai/p/transcripts/cl/5020',
		candidatosIds: ['jeannette-jara']
	},
	{
		id: 'salmon-summit-2025-07-22',
		nombre: 'Debate Presidencial - Salmón Summit 2025',
		fecha: '2025-07-22',
		organizador: 'Salmón Chile',
		duracion: '3h 18m',
		transcriptUrl: 'https://parlamento.ai/p/transcripts/cl/4872',
		candidatosIds: ['jeannette-jara', 'evelyn-matthei', 'jose-antonio-kast']
	},
	{
		id: 'primarias-oficialistas-tvn-2025-06-22',
		nombre: 'El Debate - Primarias Presidenciales Oficialistas',
		fecha: '2025-06-22',
		organizador: 'TVN',
		duracion: '3h 9m',
		transcriptUrl: 'https://parlamento.ai/p/transcripts/cl/4459',
		candidatosIds: ['carolina-toha', 'gonzalo-winter', 'jaime-mulet', 'jeannette-jara']
	},
	{
		id: 'primarias-oficialistas-t13-2025-06-15',
		nombre: 'Debate Primarias Presidenciales Oficialistas - T13',
		fecha: '2025-06-15',
		organizador: 'T13',
		duracion: '4h 26m',
		transcriptUrl: 'https://parlamento.ai/p/transcripts/cl/3161',
		candidatosIds: ['gonzalo-winter', 'carolina-toha', 'jeannette-jara', 'jaime-mulet']
	}
];

/**
 * Preguntas de todos los debates presidenciales 2025
 */
export const preguntas2025: Pregunta[] = [
	// Debate ENADE ICARE - 14 de octubre de 2025
	{
		id: 'enade-q1',
		debateId: 'enade-icare-2025-10-14',
		pregunta:
			'Tensión: Productividad y permisología. ¿Cómo garantizar que la reducción de plazos no genere nuevos focos de corrupción ni debilite la fiscalización ambiental, incluso bajo un escenario de austeridad?',
		orden: 1,
		temaId: 'economia'
	},
	{
		id: 'enade-q2',
		debateId: 'enade-icare-2025-10-14',
		pregunta:
			'Tensión: Crecimiento económico y protección ambiental. ¿Qué meta de crecimiento fija para el 2030 y qué mecanismo de control ciudadano garantiza que su agenda de desregulación no debilite estándares ambientales?',
		orden: 2,
		temaId: 'medio-ambiente'
	},
	{
		id: 'enade-q3',
		debateId: 'enade-icare-2025-10-14',
		pregunta:
			'Tensión: Seguridad ciudadana y libertades individuales. ¿A qué tasa de homicidios por 100.000 habitantes se compromete para el 2030 y qué dos medidas priorizará garantizando el respeto a las libertades civiles?',
		orden: 3,
		temaId: 'seguridad'
	},
	{
		id: 'enade-q4',
		debateId: 'enade-icare-2025-10-14',
		pregunta:
			'Tensión: Control migratorio y no discriminación. ¿Puede fijar una meta anual de expulsiones efectivas y explicar los mecanismos de garantía legal para evitar errores en ese proceso?',
		orden: 4,
		temaId: 'seguridad'
	},
	{
		id: 'enade-q5',
		debateId: 'enade-icare-2025-10-14',
		pregunta:
			'Tensión: Sostenibilidad fiscal y demandas sociales. ¿Qué trayectoria de deuda del PIB propone y bajo qué regla fiscal permanente puede garantizar responsabilidad de gasto de aquí al 2030?',
		orden: 5,
		temaId: 'economia'
	},
	{
		id: 'enade-q6',
		debateId: 'enade-icare-2025-10-14',
		pregunta:
			'Tensión: Representatividad y gobernabilidad. ¿Deberíamos cambiar el sistema en el que se eligen a las autoridades? Y de ser así, ¿cómo se garantiza que todos los chilenos se sientan representados?',
		orden: 6
	},
	{
		id: 'enade-q7',
		debateId: 'enade-icare-2025-10-14',
		pregunta:
			'Tensión: Capital humano y automatización. ¿Qué porcentaje de la fuerza laboral debería recibir capacitación relevante cada año hasta 2030? ¿Con qué presupuesto y cómo reportaría la tasa de inserción laboral?',
		orden: 7,
		temaId: 'empleo'
	},
	{
		id: 'enade-q8',
		debateId: 'enade-icare-2025-10-14',
		pregunta:
			'Diálogo Improbable: Democracia. ¿Cómo generaría un nuevo pacto político entre las distintas fuerzas, considerando el aumento de partidos políticos y la crisis social?',
		orden: 8
	},
	{
		id: 'enade-q9',
		debateId: 'enade-icare-2025-10-14',
		pregunta:
			'Diálogo Improbable: Confianza. ¿Cómo logrará unir a todo el país cuando representa a un sector político específico?',
		orden: 9
	},
	{
		id: 'enade-q10',
		debateId: 'enade-icare-2025-10-14',
		pregunta:
			'Diálogo Improbable: Economía plateada. ¿Qué políticas implementará para reconocer el trabajo doméstico y de cuidados no remunerado, principalmente realizado por mujeres?',
		orden: 10,
		temaId: 'empleo'
	},
	{
		id: 'enade-q11',
		debateId: 'enade-icare-2025-10-14',
		pregunta:
			'Diálogo Improbable: Educación. ¿Cómo recuperar la educación pública, incluyendo la educación unidocente en sectores rurales?',
		orden: 11,
		temaId: 'educacion'
	},
	{
		id: 'enade-q12',
		debateId: 'enade-icare-2025-10-14',
		pregunta:
			'Diálogo Improbable: Pobreza. ¿Cómo compensará la situación de personas que quedarán fuera del espacio de la economía formal con el avance de la inteligencia artificial?',
		orden: 12,
		temaId: 'empleo'
	},
	{
		id: 'enade-q13',
		debateId: 'enade-icare-2025-10-14',
		pregunta:
			'Diálogo Improbable: Estado de Derecho. ¿Por qué se negó, junto con el Partido Comunista, a firmar el Acuerdo por la Paz el 15 de noviembre de 2019?',
		orden: 13
	},
	{
		id: 'enade-q14',
		debateId: 'enade-icare-2025-10-14',
		pregunta:
			'Diálogo Improbable: Innovación. ¿Cuál será su estrategia de resiliencia económica ante crisis internacionales (como Argentina) para tener recursos para la innovación?',
		orden: 14,
		temaId: 'economia'
	},
	// Debate CHV - 10 de septiembre
	{
		id: 'chv-q1',
		debateId: 'chv-debate-presidencial-2025-09-10',
		pregunta:
			'¿Están preocupados por el tono que ha tenido esta campaña y cómo esto pueda afectar la convivencia democrática en nuestro país?',
		orden: 1
		// Sin categoría específica (temas generales de campaña)
	},
	{
		id: 'chv-q2',
		debateId: 'chv-debate-presidencial-2025-09-10',
		pregunta:
			'¿Qué le responden a Guillermo, que esperó un año su silla de ruedas, en relación a la propuesta de "menos Estado"?',
		orden: 2,
		temaId: 'salud'
	},
	{
		id: 'chv-q3',
		debateId: 'chv-debate-presidencial-2025-09-10',
		pregunta:
			'¿Creen que sus candidaturas pueden asegurar mayor gobernabilidad y paz social en nuestro país durante los próximos cuatro años?',
		orden: 3
		// Sin categoría (gobernabilidad general)
	},
	{
		id: 'chv-q4',
		debateId: 'chv-debate-presidencial-2025-09-10',
		pregunta:
			'¿Quiénes consideran que en cuatro años se puede eliminar o reducir significativamente las listas de espera en salud?',
		orden: 4,
		temaId: 'salud'
	},
	{
		id: 'chv-q5',
		debateId: 'chv-debate-presidencial-2025-09-10',
		pregunta:
			'En virtud del tiempo, ¿cómo lo harían y cuál es su propuesta diferenciadora para atender ese compromiso en salud?',
		orden: 5,
		temaId: 'salud'
	},
	{
		id: 'chv-q6',
		debateId: 'chv-debate-presidencial-2025-09-10',
		pregunta: '¿Qué piensan hacer ustedes con los inmigrantes irregulares?',
		orden: 6,
		temaId: 'seguridad'
	},
	{
		id: 'chv-q7',
		debateId: 'chv-debate-presidencial-2025-09-10',
		pregunta:
			'¿Quiénes creen que es necesario iniciar un proceso de regularización para identificar a esos inmigrantes irregulares?',
		orden: 7,
		temaId: 'seguridad'
	},
	{
		id: 'chv-q8',
		debateId: 'chv-debate-presidencial-2025-09-10',
		pregunta: '¿Están de acuerdo con que los inspectores municipales usen armas no letales?',
		orden: 8,
		temaId: 'seguridad'
	},
	{
		id: 'chv-q9',
		debateId: 'chv-debate-presidencial-2025-09-10',
		pregunta:
			'¿Se debe seguir aumentando el sueldo mínimo por encima del IPC pese a que ello pueda provocar más desempleo?',
		orden: 9,
		temaId: 'empleo'
	},

	// Debate ASIMET - 28 de agosto
	{
		id: 'asimet-q1',
		debateId: 'asimet-foro-2025-08-28',
		pregunta:
			'¿A finales de los 90, Chile tenía una industria manufacturera que representaba cerca del 17, 18% del PIB. Hoy solo es el 9, es el 8% aproximadamente. ¿Cuál es el diagnóstico que usted hace? ¿Por qué esta caída?',
		orden: 1,
		temaId: 'economia'
	},
	{
		id: 'asimet-q2',
		debateId: 'asimet-foro-2025-08-28',
		pregunta:
			'¿Qué tan complejo es que tengamos una brecha creciente en el peso de la industria manufacturera y qué tan peligroso es que esta brecha se siga expandiendo?',
		orden: 2,
		temaId: 'economia'
	},
	{
		id: 'asimet-q3',
		debateId: 'asimet-foro-2025-08-28',
		pregunta: '¿Qué importancia le da a su programa de gobierno a la industria nacional?',
		orden: 3,
		temaId: 'economia'
	},
	{
		id: 'asimet-q4',
		debateId: 'asimet-foro-2025-08-28',
		pregunta:
			'¿Qué propone para mejorar el empleo en el sector industrial, dado que es uno de los sectores más afectados por el desempleo?',
		orden: 4,
		temaId: 'empleo'
	},
	{
		id: 'asimet-q5',
		debateId: 'asimet-foro-2025-08-28',
		pregunta:
			'¿Está de acuerdo con la propuesta de subir el sueldo mínimo (o establecer un "sueldo vital") de manera gradual?',
		orden: 5,
		temaId: 'empleo'
	},

	// Debate SOFOFA - 31 de julio
	{
		id: 'sofofa-q1',
		debateId: 'sofofa-2025-07-31',
		pregunta:
			'¿Cuál es la principal medida que piensa adoptar en materia de permisología y competitividad tributaria para destrabar y acelerar los proyectos de inversión, e incentivar los programas de inversión actuales y nueva inversión privada en el país?',
		orden: 1,
		temaId: 'economia'
	},
	{
		id: 'sofofa-q2',
		debateId: 'sofofa-2025-07-31',
		pregunta:
			'¿Cuáles son los pilares y cómo liderará una estrategia de seguridad nacional efectiva contra el crimen organizado, el narcotráfico, las economías criminales y la delincuencia común?',
		orden: 2,
		temaId: 'seguridad'
	},
	{
		id: 'sofofa-q3',
		debateId: 'sofofa-2025-07-31',
		pregunta:
			'¿Qué medidas propone para incentivar la creación de empleo formal y de calidad en el país?',
		orden: 3,
		temaId: 'empleo'
	},
	{
		id: 'sofofa-q4',
		debateId: 'sofofa-2025-07-31',
		pregunta:
			'¿Qué reforma estructural o institucional impulsará para garantizar la sostenibilidad fiscal y qué medidas concretas de ajuste fiscal implementará en sus primeros días de gobierno?',
		orden: 4,
		temaId: 'economia'
	},

	// Debate CLAPES UC - 5 de agosto
	{
		id: 'clapes-q1',
		debateId: 'clapes-uc-2025-08-05',
		pregunta:
			'¿Cómo se define usted y cómo concilia todas esas etiquetas ideológicas que se le atribuyen?',
		orden: 1
		// Sin categoría (identidad política personal)
	},
	{
		id: 'clapes-q2',
		debateId: 'clapes-uc-2025-08-05',
		pregunta:
			'¿Cree que la negociación ramal debería estar en su programa de gobierno o genera demasiada tensión con el mundo empresarial?',
		orden: 2,
		temaId: 'empleo'
	},
	{
		id: 'clapes-q3',
		debateId: 'clapes-uc-2025-08-05',
		pregunta: '¿Cuál es su definición respecto a la propuesta de los 750 mil pesos?',
		orden: 3,
		temaId: 'empleo'
	},
	{
		id: 'clapes-q4',
		debateId: 'clapes-uc-2025-08-05',
		pregunta:
			'¿Sintió incomodidad con ese fragmento del programa de siete páginas, en particular con lo que decía sobre el crecimiento por demanda interna?',
		orden: 4,
		temaId: 'economia'
	},
	{
		id: 'clapes-q5',
		debateId: 'clapes-uc-2025-08-05',
		pregunta: '¿Por qué cree que el sector privado se desencantó y cómo valora esa situación?',
		orden: 5,
		temaId: 'economia'
	},
	{
		id: 'clapes-q6',
		debateId: 'clapes-uc-2025-08-05',
		pregunta: '¿Confía el sector privado en usted?',
		orden: 6,
		temaId: 'economia'
	},
	{
		id: 'clapes-q7',
		debateId: 'clapes-uc-2025-08-05',
		pregunta: '¿Existe terrorismo en la Araucanía o se trata solo de delincuencia?',
		orden: 7,
		temaId: 'seguridad'
	},
	{
		id: 'clapes-q8',
		debateId: 'clapes-uc-2025-08-05',
		pregunta: '¿Qué se requiere para resolver el problema en la Araucanía, según su criterio?',
		orden: 8,
		temaId: 'seguridad'
	},
	{
		id: 'clapes-q9',
		debateId: 'clapes-uc-2025-08-05',
		pregunta:
			'¿Qué opinión tiene sobre la falta de apoyo de la multigremial en la tramitación de leyes de seguridad?',
		orden: 9,
		temaId: 'seguridad'
	},
	{
		id: 'clapes-q10',
		debateId: 'clapes-uc-2025-08-05',
		pregunta: '¿Recurrirá al estado de excepción en la zona sur?',
		orden: 10,
		temaId: 'seguridad'
	},
	{
		id: 'clapes-q11',
		debateId: 'clapes-uc-2025-08-05',
		pregunta:
			'¿Qué habría hecho de manera distinta en materia de seguridad en comparación con la actual gestión?',
		orden: 11,
		temaId: 'seguridad'
	},
	{
		id: 'clapes-q12',
		debateId: 'clapes-uc-2025-08-05',
		pregunta:
			'¿Cómo convence a los diputados de su partido que han votado en contra del uso del estado de excepción?',
		orden: 12,
		temaId: 'seguridad'
	},
	{
		id: 'clapes-q13',
		debateId: 'clapes-uc-2025-08-05',
		pregunta: '¿Significa que en su gobierno los ministros no se repetirán en sus cargos?',
		orden: 13
		// Sin categoría (gestión de gobierno)
	},
	{
		id: 'clapes-q14',
		debateId: 'clapes-uc-2025-08-05',
		pregunta: '¿En la Araucanía se da terrorismo o se trata simplemente de delincuentes?',
		orden: 14,
		temaId: 'seguridad'
	},
	{
		id: 'clapes-q15',
		debateId: 'clapes-uc-2025-08-05',
		pregunta:
			'¿Qué se hará con la institución de Gendarmería ante la cuestión del sindicalismo armado?',
		orden: 15,
		temaId: 'seguridad'
	},
	{
		id: 'clapes-q16',
		debateId: 'clapes-uc-2025-08-05',
		pregunta:
			'Si llegara a ser presidenta, ¿su gobierno se asemejará a un modelo tipo "Michelle Bachelet III" o representará una renovación?',
		orden: 16
		// Sin categoría (estilo de gobierno)
	},
	{
		id: 'clapes-q17',
		debateId: 'clapes-uc-2025-08-05',
		pregunta:
			'¿Su proyecto de gobierno será de continuidad o se definirá a partir de una nueva mayoría social y política?',
		orden: 17
		// Sin categoría (estilo de gobierno)
	},
	{
		id: 'clapes-q18',
		debateId: 'clapes-uc-2025-08-05',
		pregunta: '¿Va a golpear la mesa cuando la situación lo requiera?',
		orden: 18
		// Sin categoría (liderazgo personal)
	},
	{
		id: 'clapes-q19',
		debateId: 'clapes-uc-2025-08-05',
		pregunta:
			'¿Cuál es su postura respecto al comercio informal en las alamedas y qué medidas propone para combatirlo?',
		orden: 19,
		temaId: 'seguridad'
	},
	{
		id: 'clapes-q20',
		debateId: 'clapes-uc-2025-08-05',
		pregunta:
			'¿Considera que se perdió una oportunidad histórica en la convención y cómo piensa aprovechar una nueva oportunidad en caso de llegar a la Presidencia?',
		orden: 20
		// Sin categoría (proceso constitucional)
	},

	// Debate ICARE - 26 de agosto
	{
		id: 'icare-q1',
		debateId: 'icare-congreso-2025-08-26',
		pregunta:
			'El crecimiento económico se ha desacelerado, pasando un promedio sobre el 5% en los años 2010 o 2012, a cifras de 3% o menos en la última década. ¿Cuáles son sus propuestas concretas para reactivar la economía y cómo éstas se orientan a reducir la informalidad y aumentar la productividad?',
		orden: 1,
		temaId: 'economia'
	},
	{
		id: 'icare-q2',
		debateId: 'icare-congreso-2025-08-26',
		pregunta:
			'Las regiones como Tarapacá, Atacama, La Araucanía, muestran los más altos índices de informalidad laboral. ¿Cuáles son las medidas concretas para darle un impulso competitivo a las regiones y aumentar la productividad?',
		orden: 2,
		temaId: 'economia'
	},
	{
		id: 'icare-q3',
		debateId: 'icare-congreso-2025-08-26',
		pregunta:
			'25.000 funcionarios públicos se encontraban fuera del país y 13.000 visitaron casinos mientras se encontraban con licencia médica. ¿Qué medidas específicas impulsará usted para este tipo de irregularidades? ¿Y qué sanciones estima justa, además de devolver el dinero percibido ilegalmente?',
		orden: 3
		// Sin categoría (gestión pública/corrupción)
	},
	{
		id: 'icare-q4',
		debateId: 'icare-congreso-2025-08-26',
		pregunta:
			'Actualmente en Chile hay 909.840 desempleados. Eso sin considerar a quienes tienen empleos precarios e informales. ¿Cuáles son las tres medidas urgentes para enfrentar el desempleo y aumentar la productividad laboral?',
		orden: 4,
		temaId: 'empleo'
	},
	{
		id: 'icare-q5',
		debateId: 'icare-congreso-2025-08-26',
		pregunta:
			'Con la ley de 40 horas y los dictámenes de la Dirección del Trabajo, la exclusión de limitación de jornada conocida como artículo 22 quedó restringido como un bloque continuo de 8 horas en la mayoría de los casos. ¿Apoyaría usted una nueva revisión de las jornadas laborales? ¿Para compatibilizar trabajo, productividad y vida familiar?',
		orden: 5,
		temaId: 'empleo'
	},
	{
		id: 'icare-q6',
		debateId: 'icare-congreso-2025-08-26',
		pregunta:
			'La salud mental de los chilenos no logra repuntar después de la pandemia. Según el Termómetro de Salud Mental, 26% de las personas tienen síntomas de ansiedad y 13% de depresión. Las listas de espera en el sector público para pacientes no GES bordean los 300 días. ¿Qué medidas piensan tomar para mejorar el acceso a la salud mental de toda la población?',
		orden: 6,
		temaId: 'salud'
	},
	{
		id: 'icare-q7',
		debateId: 'icare-congreso-2025-08-26',
		pregunta:
			'¿Propone modificar la indemnización por año de servicio y además aplicarla al sector público?',
		orden: 7,
		temaId: 'empleo'
	},
	{
		id: 'icare-q8',
		debateId: 'icare-congreso-2025-08-26',
		pregunta:
			'Dado el rápido avance de la inteligencia artificial y la necesidad de capacitar a los trabajadores en las nuevas competencias y habilidades que requiere el mundo del trabajo, ¿qué cambios, qué modificaciones le harían a SENCE en un evento al gobierno?',
		orden: 8,
		temaId: 'empleo'
	},
	{
		id: 'icare-q9',
		debateId: 'icare-congreso-2025-08-26',
		pregunta:
			'De acuerdo a los últimos datos disponibles en el INE, la tasa de desocupación de las mujeres alcanza un 9,9% y la de los jóvenes un 21,6%. ¿Cuál es su estrategia para enfrentar la falta de oportunidades y la dificultad de inserción que tienen las mujeres y los jóvenes hoy en día?',
		orden: 9,
		temaId: 'empleo'
	},
	{
		id: 'icare-q10',
		debateId: 'icare-congreso-2025-08-26',
		pregunta:
			'De los empleos informales que se generan, el 59% proviene de la microempresa. ¿Qué proponen ustedes para que esos microempresarios puedan generar empleo formal y sostenido en el tiempo?',
		orden: 10,
		temaId: 'empleo'
	},
	{
		id: 'icare-q11',
		debateId: 'icare-congreso-2025-08-26',
		pregunta:
			'Una reforma a la ley de sala cuna vigente es indispensable para impulsar el trabajo formal de la mujer en Chile, especialmente en momentos en que estamos con una tasa de desempleo en torno al 10%. Mi pregunta es, ¿cuál es su propuesta? ¿En qué se diferencia con respecto a las propuestas anteriores de los gobiernos? ¿Y cómo espera financiarla?',
		orden: 11,
		temaId: 'empleo'
	},
	{
		id: 'icare-q12',
		debateId: 'icare-congreso-2025-08-26',
		pregunta:
			'La actual administración impulsará un proyecto de negociación colectiva ramal o multinivel que interesa mucho a la CUT. Ello ha generado debate en torno al impacto que esta medida podría tener en el empleo y la creación de nuevos puestos de trabajo que incidirían, sobre todo en las pymes. ¿Cuál es su posición en torno a impulsar una iniciativa como esta? ¿Y qué efectos cree que podría tener en la economía en momentos en que la tasa de desempleo aumenta y Chile exhibe bajas cifras de crecimiento económico?',
		orden: 12,
		temaId: 'empleo'
	},

	// Debate ENATRANS - 7 de agosto
	{
		id: 'enatrans-q1',
		debateId: 'enatrans-2025-08-07',
		pregunta:
			'¿Cuáles son las propuestas para garantizar la seguridad en las rutas—incluyendo diagnóstico, medidas mantenibles, innovadoras y el balance entre restringir libertades y asegurar el tránsito?',
		orden: 1,
		temaId: 'transporte'
	},
	{
		id: 'enatrans-q2',
		debateId: 'enatrans-2025-08-07',
		pregunta:
			'¿Qué valor asignan a la cooperación (alianza público-privada) y cuáles son las posibilidades concretas de colaboración que proponen para el sector?',
		orden: 2,
		temaId: 'transporte'
	},
	{
		id: 'enatrans-q3',
		debateId: 'enatrans-2025-08-07',
		pregunta:
			'¿Cómo planean enfrentar los desafíos de gobernar en un escenario de incertidumbre jurídica y alta efervescencia social, haciendo cambios económicos que influyan en el escenario general?',
		orden: 3
		// Sin categoría (gobernabilidad general)
	},

	// Debate Minería UC - 6 de agosto
	{
		id: 'mineria-q1',
		debateId: 'mineria-uc-2025-08-06',
		pregunta:
			'¿Haría los decretos presidenciales hacer de este mineral (litio) un mineral concesible para atraer inversiones internacionales?',
		orden: 1,
		temaId: 'economia'
	},
	{
		id: 'mineria-q2',
		debateId: 'mineria-uc-2025-08-06',
		pregunta:
			'¿Cómo planea promover la generación de valor agregado en la minería aprovechando la oportunidad que tiene Chile de un gran poder de mercado en múltiples minerales críticos como el litio y el yodo?',
		orden: 2,
		temaId: 'economia'
	},
	{
		id: 'mineria-q3',
		debateId: 'mineria-uc-2025-08-06',
		pregunta:
			'¿Cómo podría su gobierno impulsar la colaboración público-privada en la ciencia o la colaboración entre la academia chilena y la industria minera?',
		orden: 3,
		temaId: 'economia'
	},
	{
		id: 'mineria-q4',
		debateId: 'mineria-uc-2025-08-06',
		pregunta:
			'¿Qué medidas concretas implementarían en sus potenciales gobiernos para revertir la caída en el atractivo para la inversión minera y posicionar nuevamente a Chile como destino líder y competitivo a nivel global?',
		orden: 4,
		temaId: 'economia'
	},
	{
		id: 'mineria-q5',
		debateId: 'mineria-uc-2025-08-06',
		pregunta:
			'¿Qué medidas concretas proponen para acelerar la ejecución de los proyectos mineros, incluidos en la cartera de inversión 2024–2033, sin comprometer, obviamente, los estándares ambientales y sociales?',
		orden: 5,
		temaId: 'medio-ambiente'
	},
	{
		id: 'mineria-q6',
		debateId: 'mineria-uc-2025-08-06',
		pregunta:
			'¿Cómo planea posicionar estratégicamente al país respecto a la demanda global de minerales, aprovechando el potencial único de regiones mineras e infraestructura existente?',
		orden: 6,
		temaId: 'economia'
	},
	{
		id: 'mineria-q7',
		debateId: 'mineria-uc-2025-08-06',
		pregunta:
			'¿Qué acciones concretas tomarían para seguir adelante o revertir el acuerdo entre el Cuenco y el CQM?',
		orden: 7,
		temaId: 'economia'
	},
	{
		id: 'mineria-q8',
		debateId: 'mineria-uc-2025-08-06',
		pregunta:
			'¿Qué aspectos de la actual política pública mantendría y cuáles cambiaría para acelerar la innovación en la industria minera, especialmente entre sus proveedores?',
		orden: 8,
		temaId: 'economia'
	},
	{
		id: 'mineria-q9',
		debateId: 'mineria-uc-2025-08-06',
		pregunta:
			'¿Qué ideas existen para fomentar la exploración y futura producción de minerales críticos, como el cobalto o las tierras raras?',
		orden: 9,
		temaId: 'economia'
	},
	{
		id: 'mineria-q10',
		debateId: 'mineria-uc-2025-08-06',
		pregunta:
			'¿Proponen algún proyecto o protocolo para impulsar el tratado de integración minera con Argentina, considerando proyectos binacionales como Zónfilos del Sol, José María y los Pelambres?',
		orden: 10,
		temaId: 'relaciones-exteriores'
	},
	{
		id: 'mineria-q11',
		debateId: 'mineria-uc-2025-08-06',
		pregunta:
			'¿Qué perspectivas y propuestas tiene su gobierno respecto a la continuidad y evolución de la Estrategia Nacional del Litio?',
		orden: 11,
		temaId: 'economia'
	},
	{
		id: 'mineria-q12',
		debateId: 'mineria-uc-2025-08-06',
		pregunta:
			'¿Cuál es su propuesta para fomentar sinergias estratégicas binacionales que permitan aprovechar la experiencia técnica, la infraestructura logística y los puertos de Chile para una salida más eficiente de productos mineros?',
		orden: 12,
		temaId: 'relaciones-exteriores'
	},
	{
		id: 'mineria-q13',
		debateId: 'mineria-uc-2025-08-06',
		pregunta:
			'¿Cuál es la estrategia que nuestro país debiese tener para aprovechar las oportunidades geopolíticas y las ventajas comparativas del aprovechamiento de minerales críticos?',
		orden: 13,
		temaId: 'relaciones-exteriores'
	},
	{
		id: 'mineria-q14',
		debateId: 'mineria-uc-2025-08-06',
		pregunta:
			'¿Qué medidas concretas propone para fortalecer el clúster minero chileno y apoyar la internacionalización de los proveedores, impulsando la exportación de bienes y servicios especializados?',
		orden: 14,
		temaId: 'economia'
	},

	// Debate Salmón Summit - 22 de julio
	{
		id: 'salmon-q1',
		debateId: 'salmon-summit-2025-07-22',
		pregunta:
			'¿De qué manera se hace eso? (refiriéndose a cómo reducir el tamaño del Estado y transferir competencias para la relocalización a nivel regional)',
		orden: 1
		// Sin categoría (descentralización)
	},
	{
		id: 'salmon-q2',
		debateId: 'salmon-summit-2025-07-22',
		pregunta:
			'¿Qué medidas concretas se pueden hacer para realmente llegar a una autonomía regional?',
		orden: 2
		// Sin categoría (descentralización)
	},
	{
		id: 'salmon-q3',
		debateId: 'salmon-summit-2025-07-22',
		pregunta:
			'¿Qué propuestas tienen desde su gobierno, de políticas específicas, para aumentar, no solamente el crecimiento económico que está bordeando el 2%, sino que se mantenga en el tiempo?',
		orden: 3,
		temaId: 'economia'
	},
	{
		id: 'salmon-q4',
		debateId: 'salmon-summit-2025-07-22',
		pregunta:
			'¿Qué van a desarrollar en sus programas de gobierno para que las emprendedoras y emprendedores que forman parte de la cadena de valor puedan crecer, desarrollarse y llegar a nuevos mercados?',
		orden: 4,
		temaId: 'economia'
	},

	// Primarias Oficialistas TVN - 22 de junio
	{
		id: 'primarias-tvn-q1',
		debateId: 'primarias-oficialistas-tvn-2025-06-22',
		pregunta:
			'¿Usted comparte la declaración del presidente Boric en redes sociales y cree conveniente que asista a la cumbre BRICS?',
		orden: 1,
		temaId: 'relaciones-exteriores'
	},
	{
		id: 'primarias-tvn-q2',
		debateId: 'primarias-oficialistas-tvn-2025-06-22',
		pregunta:
			'¿Tiene algún matiz respecto a la declaración de Boric y, de ser presidenta, iría a la cumbre BRICS?',
		orden: 2,
		temaId: 'relaciones-exteriores'
	},
	{
		id: 'primarias-tvn-q3',
		debateId: 'primarias-oficialistas-tvn-2025-06-22',
		pregunta: '¿Iría o no iría al BRICS y considera que Chile formaría parte de algún bloque?',
		orden: 3,
		temaId: 'relaciones-exteriores'
	},
	{
		id: 'primarias-tvn-q4',
		debateId: 'primarias-oficialistas-tvn-2025-06-22',
		pregunta:
			'¿Qué medida concreta y distinta propone como candidato para responder a la demanda de mano dura en seguridad?',
		orden: 4,
		temaId: 'seguridad'
	},
	{
		id: 'primarias-tvn-q5',
		debateId: 'primarias-oficialistas-tvn-2025-06-22',
		pregunta:
			'¿Qué medida concreta que no haya podido o no se le haya ocurrido implementar cuando era ministra del Interior propondría?',
		orden: 5,
		temaId: 'seguridad'
	},
	{
		id: 'primarias-tvn-q6',
		debateId: 'primarias-oficialistas-tvn-2025-06-22',
		pregunta:
			'Si resultara ganadora, ¿qué responde a quienes afirman que es incompatible que Mario Marcel siga como ministro de Hacienda, generando un conflicto de interés en el futuro presupuesto?',
		orden: 6,
		temaId: 'economia'
	},
	{
		id: 'primarias-tvn-q7',
		debateId: 'primarias-oficialistas-tvn-2025-06-22',
		pregunta:
			'¿De qué será continuidad su gobierno: del Gualmapu inicial, del estado de excepción en la Araucanía, de las reformas en AFP/pensiones o de la modernización de Carabineros?',
		orden: 7
		// Sin categoría (continuidad de gobierno)
	},
	{
		id: 'primarias-tvn-q8',
		debateId: 'primarias-oficialistas-tvn-2025-06-22',
		pregunta:
			'Con el impuesto a las grandes empresas en 27%, ¿quién planea cambiar esa tasa aumentando o disminuyéndola?',
		orden: 8,
		temaId: 'economia'
	},
	{
		id: 'primarias-tvn-q9',
		debateId: 'primarias-oficialistas-tvn-2025-06-22',
		pregunta:
			'¿No teme que, al subir el impuesto corporativo en tres puntos, se desincentive la inversión y, por ende, el crecimiento económico?',
		orden: 9,
		temaId: 'economia'
	},
	{
		id: 'primarias-tvn-q10',
		debateId: 'primarias-oficialistas-tvn-2025-06-22',
		pregunta:
			'¿Con qué legitimidad se le pide a la ciudadanía pagar más impuestos si el Estado malgasta millones de pesos?',
		orden: 10,
		temaId: 'economia'
	},
	{
		id: 'primarias-tvn-q11',
		debateId: 'primarias-oficialistas-tvn-2025-06-22',
		pregunta:
			'¿Qué hay que hacer y cuál es su propuesta para que el sistema de protección a la infancia funcione adecuadamente?',
		orden: 11
		// Sin categoría (protección social)
	},
	{
		id: 'primarias-tvn-q12',
		debateId: 'primarias-oficialistas-tvn-2025-06-22',
		pregunta:
			'¿Por qué los organismos colaboradores reciben un tercio menos de subsidio que los niños en residencias estatales?',
		orden: 12
		// Sin categoría (protección social)
	},
	{
		id: 'primarias-tvn-q13',
		debateId: 'primarias-oficialistas-tvn-2025-06-22',
		pregunta:
			'¿Qué medida concreta propone para terminar o filtrar el mal gasto de dinero por parte del Estado y estaría dispuesto a cambiar el Estatuto Administrativo?',
		orden: 13
		// Sin categoría (gestión pública)
	},
	{
		id: 'primarias-tvn-q14',
		debateId: 'primarias-oficialistas-tvn-2025-06-22',
		pregunta:
			'¿Cómo se puede legitimar y recuperar la autoridad de los profesores para combatir la violencia en las aulas?',
		orden: 14,
		temaId: 'educacion'
	},

	// Primarias Oficialistas T13 - 15 de junio
	{
		id: 'primarias-t13-q1',
		debateId: 'primarias-oficialistas-t13-2025-06-15',
		pregunta:
			'¿Qué piensa de ese debate y cuán legítimo es preguntar si el Frente Amplio ofrecerá garantías de seguridad?',
		orden: 1,
		temaId: 'seguridad'
	},
	{
		id: 'primarias-t13-q2',
		debateId: 'primarias-oficialistas-t13-2025-06-15',
		pregunta:
			'¿Cómo se conjuga la preocupación por la seguridad con la votación del Partido Comunista en proyectos de seguridad y por qué su gobierno podría ser el mejor en esta materia?',
		orden: 2,
		temaId: 'seguridad'
	},
	{
		id: 'primarias-t13-q3',
		debateId: 'primarias-oficialistas-t13-2025-06-15',
		pregunta:
			'¿Qué diferencia tiene su propuesta de cárcel en el desierto respecto a otras propuestas similares y a cuán diferente es de lo que proponen otros?',
		orden: 3,
		temaId: 'seguridad'
	},
	{
		id: 'primarias-t13-q4',
		debateId: 'primarias-oficialistas-t13-2025-06-15',
		pregunta: '¿Reconoces o no los errores en los inicios del gobierno del Frente Amplio?',
		orden: 4
		// Sin categoría (autocrítica política)
	},
	{
		id: 'primarias-t13-q5',
		debateId: 'primarias-oficialistas-t13-2025-06-15',
		pregunta:
			'¿Cuál experiencia comunista a nivel global te gusta más y a cuál te gustaría acercarte en Chile?',
		orden: 5
		// Sin categoría (ideología política)
	},
	{
		id: 'primarias-t13-q6',
		debateId: 'primarias-oficialistas-t13-2025-06-15',
		pregunta:
			'¿Qué opinión tienes sobre lo ocurrido en el INBA esta semana en relación a la violencia escolar y la capacidad para detener el problema?',
		orden: 6,
		temaId: 'educacion'
	},
	{
		id: 'primarias-t13-q7',
		debateId: 'primarias-oficialistas-t13-2025-06-15',
		pregunta: '¿Qué nota le pone al gobierno y qué nota asigna a las bancadas oficialistas?',
		orden: 7
		// Sin categoría (evaluación política)
	},
	{
		id: 'primarias-t13-q8',
		debateId: 'primarias-oficialistas-t13-2025-06-15',
		pregunta: 'Recomienden un libro entretenido.',
		orden: 8
		// Sin categoría (personal/lighter)
	}
];

/**
 * Carga todas las respuestas desde los archivos JSON
 */
const cargarRespuestas = (): Respuesta[] => {
	const todas: Respuesta[] = [];

	// Cargar respuestas de cada debate
	if (respuestasEnade?.respuestas) {
		todas.push(...respuestasEnade.respuestas);
	}
	if (respuestasClapes?.respuestas) {
		todas.push(...respuestasClapes.respuestas);
	}
	if (respuestasT13?.respuestas) {
		todas.push(...respuestasT13.respuestas);
	}
	if (respuestasTVN?.respuestas) {
		todas.push(...respuestasTVN.respuestas);
	}
	if (respuestasSalmon?.respuestas) {
		todas.push(...respuestasSalmon.respuestas);
	}
	if (respuestasSOFOFA?.respuestas) {
		todas.push(...respuestasSOFOFA.respuestas);
	}
	if (respuestasMineria?.respuestas) {
		todas.push(...respuestasMineria.respuestas);
	}
	if (respuestasAsimet?.respuestas) {
		todas.push(...respuestasAsimet.respuestas);
	}
	if (respuestasCHV?.respuestas) {
		todas.push(...respuestasCHV.respuestas);
	}
	if (respuestasEnatrans?.respuestas) {
		todas.push(...respuestasEnatrans.respuestas);
	}
	if (respuestasIcare?.respuestas) {
		todas.push(...respuestasIcare.respuestas);
	}

	return todas;
};

/**
 * Respuestas de todos los debates
 * Se cargan dinámicamente desde archivos JSON en la carpeta respuestas/
 */
export const respuestas2025: Respuesta[] = cargarRespuestas();

/* RESPUESTAS ANTIGUAS COMENTADAS - AHORA EN ARCHIVOS JSON
	// Respuestas a chv-q1 (convivencia democrática)
	{
		preguntaId: 'chv-q1',
		candidatoId: 'evelyn-matthei',
		resumen:
			'Sí, me preocupa. Debemos elevar el nivel del debate y centrarnos en propuestas concretas para el país, no en descalificaciones personales.'
	},
	{
		preguntaId: 'chv-q1',
		candidatoId: 'jose-antonio-kast',
		resumen:
			'La campaña ha sido dura porque Chile enfrenta problemas graves. No podemos tener miedo de decir las cosas con claridad y firmeza.'
	},
	{
		preguntaId: 'chv-q1',
		candidatoId: 'jeannette-jara',
		resumen:
			'La convivencia democrática es fundamental. Propongo un diálogo amplio y respetuoso entre todas las fuerzas políticas para construir acuerdos.'
	},
	{
		preguntaId: 'chv-q1',
		candidatoId: 'johannes-kaiser',
		resumen:
			'El tono de la campaña refleja la frustración ciudadana. Necesitamos honestidad brutal, no corrección política vacía.'
	},
	{
		preguntaId: 'chv-q1',
		candidatoId: 'franco-parisi',
		resumen:
			'Los políticos tradicionales han destruido la confianza. Mi compromiso es con la gente, no con el establishment.'
	},
	{
		preguntaId: 'chv-q1',
		candidatoId: 'marco-enriquez-ominami',
		resumen:
			'Necesitamos un nuevo pacto social que integre a todos los sectores. La polarización solo beneficia a los extremos.'
	},

	// Respuestas a chv-q2 (menos Estado y Guillermo)
	{
		preguntaId: 'chv-q2',
		candidatoId: 'evelyn-matthei',
		resumen:
			'Menos Estado no significa abandonar a las personas. Significa un Estado más eficiente que entregue la silla en 30 días, no en un año.'
	},
	{
		preguntaId: 'chv-q2',
		candidatoId: 'jose-antonio-kast',
		resumen:
			'El problema no es la falta de Estado, es la ineficiencia. Con mejor gestión y menos burocracia, Guillermo tendría su silla a tiempo.'
	},
	{
		preguntaId: 'chv-q2',
		candidatoId: 'jeannette-jara',
		resumen:
			'Esto demuestra por qué necesitamos más Estado, no menos. Debemos fortalecer el sistema público de salud con más recursos.'
	},
	{
		preguntaId: 'chv-q2',
		candidatoId: 'johannes-kaiser',
		resumen:
			'El Estado actual es un monstruo burocrático. Con vouchers y competencia, Guillermo elegiría dónde conseguir su silla rápidamente.'
	},

	// Respuestas a chv-q3 (gobernabilidad)
	{
		preguntaId: 'chv-q3',
		candidatoId: 'evelyn-matthei',
		resumen:
			'Sí. Mi experiencia como alcaldesa demuestra capacidad de diálogo y gestión. Trabajaré con todas las fuerzas políticas responsables.'
	},
	{
		preguntaId: 'chv-q3',
		candidatoId: 'jose-antonio-kast',
		resumen:
			'La gobernabilidad viene de la autoridad y el orden. Con firmeza en seguridad y economía, tendremos paz social.'
	},
	{
		preguntaId: 'chv-q3',
		candidatoId: 'jeannette-jara',
		resumen:
			'Mi compromiso es construir mayorías amplias. La gobernabilidad se logra con justicia social y diálogo permanente.'
	},
	{
		preguntaId: 'chv-q3',
		candidatoId: 'franco-parisi',
		resumen:
			'La paz social viene cuando la gente siente que el gobierno los escucha. Yo no soy parte de la elite política tradicional.'
	},
	{
		preguntaId: 'chv-q3',
		candidatoId: 'eduardo-artes',
		resumen:
			'No habrá paz real sin justicia económica. Necesitamos cambios estructurales profundos en el modelo económico.'
	},

	// Respuestas a chv-q4 (listas de espera en salud)
	{
		preguntaId: 'chv-q4',
		candidatoId: 'evelyn-matthei',
		resumen:
			'Sí, se puede. Con gestión eficiente, alianzas público-privadas y tecnología, reduciremos las listas en 50% el primer año.'
	},
	{
		preguntaId: 'chv-q4',
		candidatoId: 'jose-antonio-kast',
		resumen:
			'Totalmente. Permitiendo que el sector privado ayude y modernizando hospitales, eliminaremos las listas de espera.'
	},
	{
		preguntaId: 'chv-q4',
		candidatoId: 'jeannette-jara',
		resumen:
			'Es posible con inversión sostenida. Aumentaremos el presupuesto de salud y contrataremos más personal médico.'
	},

	// Respuestas a chv-q6 (inmigrantes irregulares)
	{
		preguntaId: 'chv-q6',
		candidatoId: 'evelyn-matthei',
		resumen:
			'Control fronterizo estricto y expulsión ordenada de quienes no cumplan requisitos. Chile debe recuperar el control migratorio.'
	},
	{
		preguntaId: 'chv-q6',
		candidatoId: 'jose-antonio-kast',
		resumen:
			'Expulsión inmediata. Reforzaremos fronteras con militares y construiremos una zanja en el norte para frenar el ingreso ilegal.'
	},
	{
		preguntaId: 'chv-q6',
		candidatoId: 'jeannette-jara',
		resumen:
			'Proceso de regularización humanitaria para quienes ya están aquí, combinado con control fronterizo responsable.'
	},
	{
		preguntaId: 'chv-q6',
		candidatoId: 'johannes-kaiser',
		resumen:
			'Deportación masiva y cierre de fronteras. La inmigración descontrolada ha colapsado nuestros servicios públicos.'
	},

	// Respuestas a chv-q9 (sueldo mínimo)
	{
		preguntaId: 'chv-q9',
		candidatoId: 'evelyn-matthei',
		resumen:
			'El sueldo mínimo debe subir, pero de forma gradual y conversada con empleadores para no destruir empleos.'
	},
	{
		preguntaId: 'chv-q9',
		candidatoId: 'jose-antonio-kast',
		resumen:
			'No podemos seguir subiendo por decreto. Primero debemos crear las condiciones para que las empresas puedan pagar más.'
	},
	{
		preguntaId: 'chv-q9',
		candidatoId: 'jeannette-jara',
		resumen:
			'Sí, debemos avanzar hacia un sueldo vital de $750.000. Los trabajadores merecen dignidad y salarios justos.'
	},
	{
		preguntaId: 'chv-q9',
		candidatoId: 'johannes-kaiser',
		resumen:
			'El sueldo mínimo debe eliminarse. Es una intervención estatal que destruye empleos y perjudica a los más vulnerables.'
	},

	// Respuestas ASIMET - q1 (caída de manufactura)
	{
		preguntaId: 'asimet-q1',
		candidatoId: 'evelyn-matthei',
		resumen:
			'La caída se debe a falta de competitividad, exceso de regulación y costos laborales altos. Necesitamos simplificar permisos.'
	},
	{
		preguntaId: 'asimet-q1',
		candidatoId: 'jose-antonio-kast',
		resumen:
			'Hemos desincentivado la producción con impuestos y burocracia. Chile debe volver a ser un país pro-empresa.'
	},
	{
		preguntaId: 'asimet-q1',
		candidatoId: 'marco-enriquez-ominami',
		resumen:
			'La apertura comercial sin estrategia industrial nos convirtió en meros exportadores de materias primas. Necesitamos política industrial.'
	},
	{
		preguntaId: 'asimet-q1',
		candidatoId: 'johannes-kaiser',
		resumen:
			'El Estado no debe intervenir en qué industrias desarrollar. El mercado debe decidir dónde se invierte.'
	},

	// Respuestas ASIMET - q5 (sueldo mínimo)
	{
		preguntaId: 'asimet-q5',
		candidatoId: 'evelyn-matthei',
		resumen: 'Sí, pero con gradualidad y consenso. No podemos imponer aumentos que destruyan pymes.'
	},
	{
		preguntaId: 'asimet-q5',
		candidatoId: 'jose-antonio-kast',
		resumen:
			'No. Primero debemos reducir impuestos y costos para que las empresas puedan pagar mejores sueldos naturalmente.'
	},
	{
		preguntaId: 'asimet-q5',
		candidatoId: 'jeannette-jara',
		resumen:
			'Absolutamente. El sueldo vital es una prioridad. Apoyaremos a las pymes con beneficios tributarios para que puedan cumplir.'
	}
];
*/

/**
 * Obtiene todas las preguntas de un debate específico
 */
export const getPreguntasPorDebate = (debateId: string): Pregunta[] => {
	return preguntas2025.filter((p) => p.debateId === debateId).sort((a, b) => a.orden - b.orden);
};

/**
 * Obtiene la respuesta de un candidato a una pregunta específica
 */
export const getRespuesta = (preguntaId: string, candidatoId: string): Respuesta | undefined => {
	return respuestas2025.find((r) => r.preguntaId === preguntaId && r.candidatoId === candidatoId);
};

/**
 * Obtiene todas las respuestas de un candidato
 */
export const getRespuestasPorCandidato = (candidatoId: string): Respuesta[] => {
	return respuestas2025.filter((r) => r.candidatoId === candidatoId);
};

/**
 * Obtiene todas las respuestas a una pregunta
 */
export const getRespuestasPorPregunta = (preguntaId: string): Respuesta[] => {
	return respuestas2025.filter((r) => r.preguntaId === preguntaId);
};

/**
 * Obtiene un debate por ID
 */
export const getDebateById = (debateId: string): Debate | undefined => {
	return debates2025.find((d) => d.id === debateId);
};

/**
 * Formatea segundos a formato MM:SS o HH:MM:SS
 */
export const formatearTiempo = (segundos: number): string => {
	const horas = Math.floor(segundos / 3600);
	const minutos = Math.floor((segundos % 3600) / 60);
	const segs = segundos % 60;

	if (horas > 0) {
		return `${horas}:${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
	}
	return `${minutos}:${segs.toString().padStart(2, '0')}`;
};

/**
 * Construye la URL de transcripción con timestamp
 */
export const construirUrlTimestamp = (debateId: string, timestamp: number): string => {
	const debate = getDebateById(debateId);
	if (!debate) return '';
	return `${debate.transcriptUrl}?t=${timestamp}`;
};
