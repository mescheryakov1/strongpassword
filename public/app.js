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
      timer: null
    };
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
      if (this.useSpecial) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
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
