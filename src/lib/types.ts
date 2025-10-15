export interface WordData {
	text: string;
	weight: number;
	color: string;
}

export interface CandidatoWordCloud {
	nombre: string;
	color: string;
	words: WordData[];
}

export interface GeneralWordCloud {
	title: string;
	words: WordData[];
}

export interface WordCloudData {
	general: GeneralWordCloud;
	candidatos: Record<string, CandidatoWordCloud>;
}

export interface WordCloudMetadata {
	totalWords: number;
	candidatosCount: number;
	created: string;
	source: string;
	description: string;
}

export interface WordCloudResponse {
	debateId: string;
	wordcloudData: WordCloudData;
	metadata: WordCloudMetadata;
}
