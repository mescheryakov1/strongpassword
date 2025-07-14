const { createApp } = Vue;

createApp({
  data() {
    return {
      length: 12,
      useDigits: true,
      useSpecial: true,
      excludeSimilar: true,
      password: '',
      masked: false,
      countdown: 0,
      timer: null,
      copied: false,
      lang: 'ru',
      langs: ['ru','en','es','zh'],
      profile: '',
      translations: {
        ru: {
          title: 'Генератор сложных паролей',
          length: 'Длина пароля:',
          useDigits: 'Использовать цифры',
          useSpecial: 'Использовать спецсимволы',
          excludeSimilar: 'Исключить похожие символы',
          create: 'Создать пароль',
          copy: 'Копировать',
          copied: 'Скопировано!',
          show: 'Показать',
          hide: 'Скрыть',
          visible: 'Виден ещё',
          seconds: 'сек.',
          placeholder: 'Пароль',
          localNote: 'Пароль генерируется локально, мы его не сохраняем',
          tipsTitle: 'Советы',
          tip1: 'Как придумать и запомнить пароль',
          tip2: 'Зачем использовать менеджер паролей',
          profile: 'Профиль:',
          profileSocial: 'Соцсети',
          profileBank: 'Банк',
          profileGov: 'Госуслуги',
          profileEmail: 'Почта',
          github: 'Код на GitHub',
          privacy: 'Политика конфиденциальности',
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
          copied: 'Copied!',
          show: 'Show',
          hide: 'Hide',
          visible: 'Visible for',
          seconds: 'seconds',
          placeholder: 'Password',
          localNote: 'Password is generated locally, we do not save it',
          tipsTitle: 'Tips',
          tip1: 'How to create and remember a password',
          tip2: 'Why use a password manager',
          profile: 'Profile:',
          profileSocial: 'Social',
          profileBank: 'Bank',
          profileGov: 'Government',
          profileEmail: 'Email',
          github: 'GitHub source',
          privacy: 'Privacy policy',
          strengths: ['Very Weak', 'Weak', 'Normal', 'Good', 'Excellent']
        },
        es: {
          title: 'Generador de contraseñas seguras',
          length: 'Longitud de la contraseña:',
          useDigits: 'Usar dígitos',
          useSpecial: 'Usar caracteres especiales',
          excludeSimilar: 'Excluir caracteres similares',
          create: 'Crear contraseña',
          copy: 'Copiar',
          copied: '¡Copiado!',
          show: 'Mostrar',
          hide: 'Ocultar',
          visible: 'Visible por',
          seconds: 'seg.',
          placeholder: 'Contraseña',
          localNote: 'La contraseña se genera localmente, no la guardamos',
          tipsTitle: 'Consejos',
          tip1: 'Cómo crear y recordar una contraseña',
          tip2: 'Por qué usar un gestor de contraseñas',
          profile: 'Perfil:',
          profileSocial: 'Redes sociales',
          profileBank: 'Banco',
          profileGov: 'Servicios públicos',
          profileEmail: 'Correo',
          github: 'Código en GitHub',
          privacy: 'Política de privacidad',
          strengths: ['Muy débil', 'Débil', 'Normal', 'Buena', 'Excelente']
        },
        zh: {
          title: '强密码生成器',
          length: '密码长度:',
          useDigits: '使用数字',
          useSpecial: '使用特殊字符',
          excludeSimilar: '排除相似字符',
          create: '生成密码',
          copy: '复制',
          copied: '已复制',
          show: '显示',
          hide: '隐藏',
          visible: '可见',
          seconds: '秒',
          placeholder: '密码',
          localNote: '密码在本地生成，我们不保存',
          tipsTitle: '提示',
          tip1: '如何创建并记住密码',
          tip2: '为什么使用密码管理器',
          profile: '配置:',
          profileSocial: '社交',
          profileBank: '银行',
          profileGov: '政府',
          profileEmail: '邮箱',
          github: 'GitHub 代码',
          privacy: '隐私政策',
          strengths: ['弱', '轻弱', '一般', '好', '优秀']
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
    applyProfile() {
      const map = {
        social: { length: 12, digits: true, special: true },
        bank: { length: 16, digits: true, special: true },
        gov: { length: 12, digits: true, special: true },
        email: { length: 10, digits: true, special: false }
      };
      const p = map[this.profile];
      if (p) {
        this.length = p.length;
        this.useDigits = p.digits;
        this.useSpecial = p.special;
        this.excludeSimilar = true;
      }
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
      navigator.clipboard.writeText(this.password).then(() => {
        this.copied = true;
        setTimeout(() => {
          this.copied = false;
        }, 1500);
      });
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
      const idx = this.langs.indexOf(this.lang);
      this.lang = this.langs[(idx + 1) % this.langs.length];
    }
  }
}).mount('#app');
