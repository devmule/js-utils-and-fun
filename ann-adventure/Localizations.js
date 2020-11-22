export const Localizations = {
	lang: 'ru',
	
	locals: {
		en: {},
		ru: {
			TabLearning: 'Обучение сети',
			TabSamples: 'Обучающая выборка',
			TabNetwork: 'Вид сети',
			InputValues: 'Входные значения',
			OutputValues: 'Выходные значения',
			Delete: '\uD83D\uDDD1\uFE0F',
		}
	},
	
	getText(key) {
		if (this.locals[this.lang]) return this.locals[this.lang][key] || `?${key}`;
		else throw new Error(`no \"${this.lang}\" localization`)
	}
};
