/**
 * Lista de candidatos para la Elección Presidencial de Chile 2025
 * Basado en información de Wikipedia y candidatos confirmados
 */

export interface Candidato {
	id: string;
	nombre: string;
	partido: string;
	coalicion?: string;
	foto: string;
	fotoSinFondo?: string; // Foto sin fondo para diseños especiales
	estado: 'confirmado' | 'precandidata' | 'potencial';
	color: string; // Color hexadecimal del partido/candidato
	abreviacion: string; // Abreviación de 2 letras única
}

/**
 * Array de candidatos presidenciales para las elecciones de Chile 2025
 */
export const candidatos2025: Candidato[] = [
	{
		id: 'evelyn-matthei',
		nombre: 'Evelyn Matthei',
		partido: 'Unión Demócrata Independiente (UDI)',
		coalicion: 'Chile Vamos',
		foto: '/blog/candidatos/evelyn-matthei.webp',
		fotoSinFondo: '/blog/candidatos/sin-fondo/evelyn-matthei.webp',
		estado: 'confirmado',
		color: '#0033A0',
		abreviacion: 'EM'
	},
	{
		id: 'jose-antonio-kast',
		nombre: 'José Antonio Kast',
		partido: 'Partido Republicano',
		coalicion: 'Cambio por Chile',
		foto: '/blog/candidatos/jose-antonio-kast.webp',
		fotoSinFondo: '/blog/candidatos/sin-fondo/jose-antonio-kast.webp',
		estado: 'confirmado',
		color: '#D52B1E',
		abreviacion: 'JK'
	},
	{
		id: 'jeannette-jara',
		nombre: 'Jeannette Jara',
		partido: 'Partido Comunista (PC)',
		coalicion: 'Unidad por Chile',
		foto: '/blog/candidatos/jeannette-jara.webp',
		fotoSinFondo: '/blog/candidatos/sin-fondo/jeannette-jara.webp',
		estado: 'confirmado',
		color: '#C8102E',
		abreviacion: 'JJ'
	},
	{
		id: 'marco-enriquez-ominami',
		nombre: 'Marco Enríquez-Ominami',
		partido: 'Partido Humanista (PH)',
		foto: '/blog/candidatos/marco-enriquez-ominami.webp',
		fotoSinFondo: '/blog/candidatos/sin-fondo/marco-enriquez-ominami.webp',
		estado: 'confirmado',
		color: '#F36C21',
		abreviacion: 'ME'
	},
	{
		id: 'johannes-kaiser',
		nombre: 'Johannes Kaiser',
		partido: 'Partido Nacional Libertario',
		coalicion: 'Cambio por Chile',
		foto: '/blog/candidatos/johannes-kaiser.webp',
		fotoSinFondo: '/blog/candidatos/sin-fondo/johannes-kaiser.webp',
		estado: 'confirmado',
		color: '#1F3158',
		abreviacion: 'KA'
	},
	{
		id: 'franco-parisi',
		nombre: 'Franco Parisi',
		partido: 'Partido de la Gente (PDG)',
		foto: '/blog/candidatos/franco-parisi.webp',
		fotoSinFondo: '/blog/candidatos/sin-fondo/franco-parisi.webp',
		estado: 'confirmado',
		color: '#5B2C83',
		abreviacion: 'FP'
	},
	{
		id: 'harold-mayne-nicholls',
		nombre: 'Harold Mayne-Nicholls',
		partido: 'Independiente',
		foto: '/blog/candidatos/harold-mayne-nicholls.webp',
		fotoSinFondo: '/blog/candidatos/sin-fondo/harold-mayne-nicholls.webp',
		estado: 'potencial',
		color: '#6E6E6E',
		abreviacion: 'HM'
	},
	{
		id: 'eduardo-artes',
		nombre: 'Eduardo Artés',
		partido: 'Unión Patriótica',
		foto: '/blog/candidatos/eduardo-artes.webp',
		fotoSinFondo: '/blog/candidatos/sin-fondo/eduardo-artes.webp',
		estado: 'confirmado',
		color: '#E4002B',
		abreviacion: 'EA'
	},
	{
		id: 'carolina-toha',
		nombre: 'Carolina Tohá',
		partido: 'Partido por la Democracia (PPD)',
		coalicion: 'Socialismo Democrático',
		foto: '/blog/candidatos/carolina-toha.webp',
		fotoSinFondo: '/blog/candidatos/sin-fondo/carolina-toha.webp',
		estado: 'confirmado',
		color: '#FFCD00',
		abreviacion: 'CT'
	},
	{
		id: 'gonzalo-winter',
		nombre: 'Gonzalo Winter',
		partido: 'Frente Amplio',
		foto: '/blog/candidatos/gonzalo-winter.webp',
		fotoSinFondo: '/blog/candidatos/sin-fondo/gonzalo-winter.webp',
		estado: 'confirmado',
		color: '#00B5E2',
		abreviacion: 'GW'
	},
	{
		id: 'jaime-mulet',
		nombre: 'Jaime Mulet',
		partido: 'Federación Regionalista Verde Social',
		foto: '/blog/candidatos/jaime-mulet.webp',
		fotoSinFondo: '/blog/candidatos/sin-fondo/jaime-mulet.webp',
		estado: 'confirmado',
		color: '#00A859',
		abreviacion: 'JM'
	}
];

/**
 * Obtiene candidatos por estado
 */
export const getCandidatosPorEstado = (estado: Candidato['estado']) => {
	return candidatos2025.filter((candidato) => candidato.estado === estado);
};

/**
 * Obtiene candidatos por coalición
 */
export const getCandidatosPorCoalicion = (coalicion: string) => {
	return candidatos2025.filter((candidato) => candidato.coalicion === coalicion);
};

/**
 * Obtiene candidato por nombre
 */
export const getCandidatoPorNombre = (nombre: string) => {
	return candidatos2025.find((candidato) =>
		candidato.nombre.toLowerCase().includes(nombre.toLowerCase())
	);
};

/**
 * Obtiene candidato por ID
 */
export const getCandidatoById = (id: string): Candidato | undefined => {
	return candidatos2025.find((candidato) => candidato.id === id);
};

/**
 * Obtiene múltiples candidatos por IDs
 */
export const getCandidatosByIds = (ids: string[]): Candidato[] => {
	return ids.map((id) => getCandidatoById(id)).filter(Boolean) as Candidato[];
};
