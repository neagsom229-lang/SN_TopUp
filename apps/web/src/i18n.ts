import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        trackOrder: 'Track Order',
        support: 'Support',
      },
      home: {
        title: 'Game Top-Up in Cambodia',
        subtitle: 'Secure and transparent game top-ups',
        searchPlaceholder: 'Search games...',
        selectGame: 'Select Game',
      },
      game: {
        step1: '1. Enter Player ID',
        step2: '2. Select Package',
        step3: '3. Payment & Contact',
        playerId: 'Player ID',
        serverId: 'Server ID',
        checkPlayer: 'Verify Player',
        verifiedName: 'Player Name:',
        buyNow: 'Buy Now ($ {{price}})',
        contactPhone: 'Telegram / Phone Number',
        promoCode: 'Promo Code (Optional)',
        apply: 'Apply',
      },
      checkout: {
        title: 'Complete Your Payment',
        scanQr: 'Scan with Bakong or any KHQR banking app',
        statusWaiting: 'Waiting for payment...',
        statusPaid: 'Payment Successful! Delivering top-up...',
        statusDelivered: 'Top-Up Delivered Successfully!',
        openMockCheckout: 'Open Mock KHQR Payment Page',
        orderCode: 'Order Code:',
      },
    },
  },
  km: {
    translation: {
      nav: {
        home: 'ទំព័រដើម',
        trackOrder: 'ពិនិត្យការបញ្ជាទិញ',
        support: 'ជំនួយ',
      },
      home: {
        title: 'បំពេញកាក់ហ្គេមនៅកម្ពុជា',
        subtitle: 'ការបញ្ចូលទឹកប្រាក់ហ្គេមមានសុវត្ថិភាពនិងភាពច្បាស់លាស់',
        searchPlaceholder: 'ស្វែងរកហ្គេម...',
        selectGame: 'ជ្រើសរើសហ្គេម',
      },
      game: {
        step1: '១. បញ្ចូលអត្តសញ្ញាណអ្នកលេង (Player ID)',
        step2: '២. ជ្រើសរើសកញ្ចប់',
        step3: '៣. ទូទាត់ប្រាក់ និងទំនាក់ទំនង',
        playerId: 'អត្តសញ្ញាណអ្នកលេង (Player ID)',
        serverId: 'លេខ Server ID',
        checkPlayer: 'ផ្ទៀងផ្ទាត់ឈ្មោះ',
        verifiedName: 'ឈ្មោះអ្នកលេង៖',
        buyNow: 'ទិញឥឡូវនេះ ($ {{price}})',
        contactPhone: 'លេខទូរស័ព្ទ / Telegram',
        promoCode: 'កូដបញ្ចុះតម្លៃ',
        apply: 'ដាក់ស្នើ',
      },
      checkout: {
        title: 'បង់ប្រាក់តាម KHQR',
        scanQr: 'ស្កេនជាមួយแอป Bakong ឬធនាគារណាមួយ',
        statusWaiting: 'កំពុងរង់ចាំការទូទាត់...',
        statusPaid: 'បង់ប្រាក់ជោគជ័យ! កំពុងបញ្ជូនទំនិញ...',
        statusDelivered: 'ការបញ្ជូនកាក់ទទួលបានជោគជ័យ!',
        openMockCheckout: 'បើកទំព័រទូទាត់จำลอง KHQR',
        orderCode: 'លេខកូដបញ្ជាទិញ៖',
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
