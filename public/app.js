const { createApp } = Vue;

createApp({
  data() {
    return {
      length: 8,
      useDigits: true,
      useSpecial: false,
      excludeSimilar: false,
      password: '',
      masked: false,
      countdown: 0,
      timer: null,
      lang: 'ru',
      translations: {
        ru: {
          title: 'Генератор сложных паролей',
          length: 'Длина пароля:',
          useDigits: 'Использовать цифры',
          useSpecial: 'Использовать спецсимволы',
          excludeSimilar: 'Исключить похожие символы',
          create: 'Создать пароль',
          copy: 'Копировать',
          show: 'Показать',
          hide: 'Скрыть',
          visible: 'Виден ещё',
          seconds: 'сек.',
          placeholder: 'Пароль',
          strengths: ['Очень слабый', 'Слабый', 'Нормальный', 'Хороший', 'Отличный']
        },
        en: {
          title: 'Strong Password Generator',
          length: 'Password length:',
          useDigits: 'Use digits',
          useSpecial: 'Use special characters',
          excludeSimilar: 'Exclude similar characters',
          create: 'Create Password',
          copy: 'Copy',
          show: 'Show',
          hide: 'Hide',
          visible: 'Visible for',
          seconds: 'seconds',
          placeholder: 'Password',
          strengths: ['Very Weak', 'Weak', 'Normal', 'Good', 'Excellent']
        }
      }
    };
  },
  computed: {
    t() {
      return this.translations[this.lang];
    },
    strength() {
      if (!this.password) return 0;
      const len = this.password.length;
      let lenScore = 0;
      if (len >= 16) lenScore = 4;
      else if (len >= 12) lenScore = 3;
      else if (len >= 10) lenScore = 2;
      else if (len >= 8) lenScore = 1;
      const score = typeof zxcvbn === 'function' ? zxcvbn(this.password).score : 0;
      return Math.max(lenScore, score) + 1;
    },
    strengthLabel() {
      return this.t.strengths[this.strength - 1] || '';
    },
    strengthClass() {
      return `strength-${this.strength}`;
    }
  },
  methods: {
    setLength(len) {
      this.length = len;
    },
    generatePassword() {
      const letters = 'abcdefghijklmnopqrstuvwxyz';
      const similar = /[ilLIoO0]/g;
      let chars = letters + letters.toUpperCase();
      if (this.useDigits) chars += '0123456789';
      if (this.useSpecial) chars += '!@#$^&*_+-=?';
      if (this.excludeSimilar) chars = chars.replace(similar, '');
      let result = '';
      for (let i = 0; i < this.length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      this.password = result;
      this.masked = false;
      this.restartTimer();
    },
    restartTimer() {
      clearInterval(this.timer);
      this.countdown = 60;
      this.timer = setInterval(() => {
        if (this.countdown <= 1) {
          clearInterval(this.timer);
          this.masked = true;
          this.countdown = 0;
        } else {
          this.countdown--;
        }
      }, 1000);
    },
    copyPassword() {
      navigator.clipboard.writeText(this.password);
    },
    toggleMask() {
      this.masked = !this.masked;
      if (this.masked) {
        clearInterval(this.timer);
        this.countdown = 0;
      } else {
        this.restartTimer();
      }
    },
    toggleLang() {
      this.lang = this.lang === 'ru' ? 'en' : 'ru';
    }
  }
}).mount('#app');
