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
          createNew: 'Создать новый пароль',
          copy: 'Копировать',
          show: 'Показать',
          hide: 'Скрыть',
          visible: 'Виден ещё',
          seconds: 'сек.',
          placeholder: 'Пароль'
        },
        en: {
          title: 'Strong Password Generator',
          length: 'Password length:',
          useDigits: 'Use digits',
          useSpecial: 'Use special characters',
          excludeSimilar: 'Exclude similar characters',
          create: 'Create Password',
          createNew: 'Create New Password',
          copy: 'Copy',
          show: 'Show',
          hide: 'Hide',
          visible: 'Visible for',
          seconds: 'seconds',
          placeholder: 'Password'
        }
      }
    };
  },
  computed: {
    t() {
      return this.translations[this.lang];
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
      if (this.useSpecial) chars += '!@#$^&*()_+-=[]{}|<>?';
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
      if (!this.masked && this.countdown === 0) {
        this.restartTimer();
      }
    }
  }
}).mount('#app');
