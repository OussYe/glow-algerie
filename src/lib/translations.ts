export type Lang = 'ar' | 'fr'

export const translations = {
  ar: {
    // Navigation
    home: 'الرئيسية',
    cart: 'السلة',

    // Hero
    heroBadge: 'التوصيل في جميع أنحاء الجزائر',
    heroTitle: 'اكتشف متجرنا',
    heroSubtitle: 'منتجات مختارة بعناية. جودة مضمونة، توصيل سريع.',
    copyright: '© 2026 Glow Algérie. جميع الحقوق محفوظة.',

    // Categories & Products
    categories: 'الأقسام',
    allProducts: 'كل المنتجات',
    all: 'الكل',
    noProducts: 'لا توجد منتجات في هذه الفئة حالياً.',
    loadingError: 'خطأ في التحميل.',

    // Product card / detail
    addToCart: 'أضف إلى السلة',
    addedToCart: 'تمت الإضافة إلى السلة',
    addedQtyToCart: 'تمت إضافة {qty} منتج إلى السلة',
    viewCart: 'عرض السلة',
    outOfStock: 'نفد المخزون',
    inStock: 'متوفر',
    description: 'الوصف',
    quantity: 'الكمية :',
    enlarge: 'تكبير',
    clickToEnlarge: '🔍 انقر للتكبير',
    savings: 'وفر {amount}',
    productCount: '{count} منتج',
    deliveryInfo: '🚚 التوصيل متاح في جميع أنحاء الجزائر',
    paymentInfo: '🔒 الدفع عند الاستلام (نقداً)',
    qualityInfo: '⭐ جودة مضمونة',
    mediaAlt: 'وسيط {n}',
    selectSize: 'اختر المقاس',
    sizeRequired: 'يرجى اختيار المقاس قبل الإضافة إلى السلة',

    // Cart page
    myCart: 'سلتي',
    cartEmpty: 'سلتك فارغة',
    cartEmptyHint: 'أضف منتجات للبدء.',
    subtotal: 'المجموع الجزئي ({count} منتج)',
    delivery: 'التوصيل',
    selectWilaya: '— اختر الولاية',
    freeDelivery: 'مجاناً',
    totalTTC: 'الإجمالي',
    deliveryInfoSection: 'معلومات التوصيل',
    fullName: 'الاسم الكامل *',
    fullNamePlaceholder: 'الاسم الأول والأخير',
    phone: 'الهاتف *',
    phonePlaceholder: '0550 123 456',
    wilaya: 'الولاية *',
    wilayaPlaceholder: 'اختر الولاية...',
    commune: 'البلدية *',
    communePlaceholder: 'اختر البلدية...',
    communeDisabled: 'اختر الولاية أولاً',
    notes: 'ملاحظات (اختياري)',
    notesPlaceholder: 'تعليمات خاصة...',
    loading: 'جار التحميل...',
    sending: 'جار الإرسال...',
    placeOrder: '🛒 تأكيد الطلب',
    totalToPay: 'الإجمالي للدفع',
    subtotalLabel: 'المجموع الجزئي',

    // Validation
    nameRequired: 'الاسم مطلوب',
    phoneRequired: 'رقم الهاتف مطلوب',
    phoneInvalid: 'رقم غير صالح (مثال: 0550123456)',
    wilayaRequired: 'الولاية مطلوبة',
    communeRequired: 'البلدية مطلوبة',

    // Errors (cart / api)
    loadingWilayasError: 'خطأ في تحميل الولايات',
    loadingCommunesError: 'خطأ في تحميل البلديات',
    sendingError: 'خطأ في الإرسال. يرجى المحاولة مجدداً.',

    // Confirmation
    orderConfirmed: 'تم تأكيد الطلب !',
    orderSuccess: 'تم تسجيل طلبك بنجاح.',
    orderNumber: 'رقم الطلب',
    orderContact: 'سنتصل بك قريباً لتأكيد التوصيل. شكراً لثقتك !',
    continueShopping: 'متابعة التسوق',
  },

  fr: {
    // Navigation
    home: 'Accueil',
    cart: 'Panier',

    // Hero
    heroBadge: 'Livraison partout en Algérie',
    heroTitle: 'Découvrez notre boutique',
    heroSubtitle: 'Des produits soigneusement sélectionnés. Qualité garantie, livraison rapide.',
    copyright: '© 2026 Glow Algérie. Tous droits réservés.',

    // Categories & Products
    categories: 'Catégories',
    allProducts: 'Tous les articles',
    all: 'Tous',
    noProducts: 'Aucun article dans cette catégorie pour le moment.',
    loadingError: 'Erreur de chargement.',

    // Product card / detail
    addToCart: 'Ajouter au panier',
    addedToCart: 'Ajouté au panier',
    addedQtyToCart: '{qty} article(s) ajouté(s) au panier',
    viewCart: 'Voir le panier',
    outOfStock: 'Rupture de stock',
    inStock: 'En stock',
    description: 'Description',
    quantity: 'Quantité :',
    enlarge: 'Agrandir',
    clickToEnlarge: '🔍 Cliquer pour agrandir',
    savings: 'Économie {amount}',
    productCount: '{count} article{s}',
    deliveryInfo: '🚚 Livraison disponible partout en Algérie',
    paymentInfo: '🔒 Paiement à la livraison (cash)',
    qualityInfo: '⭐ Qualité garantie',
    mediaAlt: 'Média {n}',
    selectSize: 'Choisissez votre taille',
    sizeRequired: 'Veuillez choisir une taille avant d\'ajouter au panier',

    // Cart page
    myCart: 'Mon Panier',
    cartEmpty: 'Votre panier est vide',
    cartEmptyHint: 'Ajoutez des articles pour commencer.',
    subtotal: 'Sous-total ({count} article{s})',
    delivery: 'Livraison',
    selectWilaya: '— sélectionnez une wilaya',
    freeDelivery: 'Gratuit',
    totalTTC: 'Total TTC',
    deliveryInfoSection: 'Informations de livraison',
    fullName: 'Nom complet *',
    fullNamePlaceholder: 'Prénom et nom',
    phone: 'Téléphone *',
    phonePlaceholder: '0550 123 456',
    wilaya: 'Wilaya *',
    wilayaPlaceholder: 'Sélectionner une wilaya...',
    commune: 'Commune *',
    communePlaceholder: 'Sélectionner une commune...',
    communeDisabled: "Sélectionnez d'abord une wilaya",
    notes: 'Notes (optionnel)',
    notesPlaceholder: 'Instructions spéciales...',
    loading: 'Chargement...',
    sending: 'Envoi en cours...',
    placeOrder: '🛒 Passer la commande',
    totalToPay: 'Total à payer',
    subtotalLabel: 'Sous-total',

    // Validation
    nameRequired: 'Nom requis',
    phoneRequired: 'Téléphone requis',
    phoneInvalid: 'Numéro invalide (ex: 0550123456)',
    wilayaRequired: 'Wilaya requise',
    communeRequired: 'Commune requise',

    // Errors (cart / api)
    loadingWilayasError: 'Erreur chargement des wilayas',
    loadingCommunesError: 'Erreur chargement des communes',
    sendingError: "Erreur lors de l'envoi. Veuillez réessayer.",

    // Confirmation
    orderConfirmed: 'Commande confirmée !',
    orderSuccess: 'Votre commande a été enregistrée avec succès.',
    orderNumber: 'Numéro de commande',
    orderContact: 'Nous vous contacterons bientôt pour confirmer la livraison. Merci pour votre confiance !',
    continueShopping: 'Continuer les achats',
  },
} as const

export type TranslationKey = keyof typeof translations['fr']

export function interpolate(
  str: string,
  params: Record<string, string | number>
): string {
  return Object.entries(params).reduce(
    (s, [k, v]) => s.replace(`{${k}}`, String(v)),
    str
  )
}
