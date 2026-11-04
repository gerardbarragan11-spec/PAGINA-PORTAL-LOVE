window.PORTALOVERS_CATALOG = Object.freeze([
  Object.freeze({
    id: 'acrilicos',
    category: 'acrilicos',
    categoryName: 'Acrílicos',
    title: 'Acrílicos personalizados',
    images: Object.freeze([
      'assets/images/ACRILICOS/ACRI1.JPG',
      'assets/images/ACRILICOS/ACRI2.JPG',
      'assets/images/ACRILICOS/ACRI3.JPG'
    ])
  }),
  Object.freeze({
    id: 'lunas-eco',
    category: 'lunas',
    categoryName: 'Lunas',
    title: 'Lunas Eco',
    images: Object.freeze([
      'assets/images/LUNAS/LUNAS ECO/Lunaeco.jpg',
      'assets/images/LUNAS/LUNAS ECO/Lunaeco1.jpg',
      'assets/images/LUNAS/LUNAS ECO/Lunaeco2.jpg',
      'assets/images/LUNAS/LUNAS ECO/Lunaeco3.jpg',
      'assets/images/LUNAS/LUNAS ECO/Lunaeco4.jpg',
      'assets/images/LUNAS/LUNAS ECO/Lunaeco5.jpg'
    ])
  }),
  Object.freeze({
    id: 'lunas-love',
    category: 'lunas',
    categoryName: 'Lunas',
    title: 'Lunas Love',
    images: Object.freeze([
      'assets/images/LUNAS/LUNAS LOVE/LUNALOVE.JPG',
      'assets/images/LUNAS/LUNAS LOVE/LUNALOVE2.JPG',
      'assets/images/LUNAS/LUNAS LOVE/LUNALOVE3.JPG',
      'assets/images/LUNAS/LUNAS LOVE/LUNALOVE4.JPG',
      'assets/images/LUNAS/LUNAS LOVE/LUNALOVE5.JPG',
      'assets/images/LUNAS/LUNAS LOVE/LUNALOVE6.JPG'
    ])
  }),
  Object.freeze({
    id: 'lunas-mascotas',
    category: 'lunas',
    categoryName: 'Lunas',
    title: 'Lunas Mascotas',
    images: Object.freeze([
      'assets/images/LUNAS/LUNAS MASCOTAS/LunaM.jpg',
      'assets/images/LUNAS/LUNAS MASCOTAS/LunaM1.jpg',
      'assets/images/LUNAS/LUNAS MASCOTAS/LunaM2.jpg',
      'assets/images/LUNAS/LUNAS MASCOTAS/LunaM3.jpg',
      'assets/images/LUNAS/LUNAS MASCOTAS/LunaM4.jpg',
      'assets/images/LUNAS/LUNAS MASCOTAS/LunaM5.jpg',
      'assets/images/LUNAS/LUNAS MASCOTAS/LunaM6.jpg'
    ])
  }),
  Object.freeze({
    id: 'portarretratos',
    category: 'portarretratos',
    categoryName: 'Portarretratos',
    title: 'Portarretratos personalizados',
    images: Object.freeze([
      'assets/images/PORTARETRATOS/PORTA1.JPG',
      'assets/images/PORTARETRATOS/PORTA2.JPG',
      'assets/images/PORTARETRATOS/PORTA3.JPG'
    ])
  }),
  Object.freeze({
    id: 'velas-baby',
    category: 'velas',
    categoryName: 'Velas Baby',
    title: 'Velas Baby',
    images: Object.freeze([
      'assets/images/VELAS/VELASBABY.JPG',
      'assets/images/VELAS/VELASBABY2.JPG',
      'assets/images/VELAS/VELASBABY3.JPG',
      'assets/images/VELAS/VELASBABY4.JPG',
      'assets/images/VELAS/VELASBABY5.JPG',
      'assets/images/VELAS/VELASBABY6.JPG',
      'assets/images/VELAS/VELASBABY7.JPG'
    ])
  })
]);
window.PORTALOVERS_CLIENT_MEDIA = (() => {
  const base = 'assets/images/CLIENTES SATISFECHOS/';
  const video = stamp => ({ type: 'video', src: `${base}WhatsApp Video 2026-11-04 at ${stamp}.mp4` });
  const image = stamp => ({ type: 'image', src: `${base}WhatsApp Image 2026-11-04 at ${stamp}.jpeg` });
  return Object.freeze([
    video('8.48.48 AM'),
    image('8.48.48 AM'),
    video('8.48.48 AM (1)'),
    image('8.48.48 AM (1)'),
    video('8.48.51 AM'),
    image('8.48.48 AM (2)'),
    video('8.55.13 AM'),
    image('8.48.51 AM'),
    video('8.59.21 AM'),
    image('8.59.21 AM'),
    image('8.59.21 AM (1)')
  ].map(Object.freeze));
})();

// Per-luna 3D model and design image; file names are exactly as on disk.
window.PORTALOVERS_LUNA_ASSETS = (() => {
  const base = 'assets/models/LUNAS/';
  return Object.freeze({
    'lunas-love': Object.freeze({
      label: 'Luna Love',
      image: `${base}LUNAS LOVE/LUNA LOVE.png`,
      model: `${base}LUNAS LOVE/LUNA LOVE.stl`
    }),
    'lunas-eco': Object.freeze({
      label: 'Luna Eco',
      image: `${base}LUNAS ECO/LUNA ECO.png`,
      model: `${base}LUNAS ECO/LUNA ECO.stl`
    }),
    'lunas-mascotas': Object.freeze({
      label: 'Luna Mascotas',
      image: `${base}LUNAS MASCOTAS/LUNA MASCOTAS.png`,
      model: `${base}LUNAS MASCOTAS/LUNA MASCOTA.stl`
    })
  });
})();
