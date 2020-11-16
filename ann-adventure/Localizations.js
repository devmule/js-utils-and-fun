export const Localizations = {
	lang: 'ru',
	
	locals: {
		en: {},
		ru: {
			TabLearning: 'Обучение сети',
			TabSamples: 'Обучающая выборка',
			TabNetwork: 'Вид сети',
		}
	},
	
	getText(key) {
		if (this.locals[this.lang]) return this.locals[this.lang][key] || `?${key}`;
		else throw new Error(`no \"${this.lang}\" localization`)
	}
};
