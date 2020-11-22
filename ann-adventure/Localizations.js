export const Localizations = {
	lang: 'ru',
	
	universals: {
		Delete: '\uD83D\uDDD1\uFE0F',
	},
	
	locals: {
		en: {},
		ru: {
			TabLearning: 'Обучение сети',
			TabSamples: 'Обучающая выборка',
			TabNetwork: 'Вид сети',
			InputValues: 'входные значения',
			OutputValues: 'выходные значения',
			LearnBegin: 'начать обучение',
			LearnEnd: 'остановить обучение',
			LearningRate: 'коэффициент обучения',
			EpochsCount: 'количество эпох',
		}
	},
	
	getText(key) {
		if (this.universals[key]) return this.universals[key];
		else if (this.locals[this.lang]) return this.locals[this.lang][key] || `?${key}`;
		else throw new Error(`no \"${this.lang}\" localization`)
	}
};
