const portalArticles = [
  {
    id: 'aniversario',
    category: 'Inspiración',
    title: 'Cinco ideas para un aniversario que cuentan algo real',
    image: 'assets/images/blog_1.png',
    imageAlt: 'Lámpara, portarretrato y detalles dispuestos para celebrar un aniversario',
    intro: 'Hay regalos que se agradecen y, con el tiempo, se olvidan. Otros vuelven a una conversación años después porque guardan una escena, una frase o una forma de mirar a alguien. Para un aniversario, la diferencia no suele estar en el tamaño del obsequio, sino en lo bien que reconoce la historia compartida.',
    sections: [
      {
        label: 'Punto de partida',
        heading: 'Antes de elegir, recuerda una escena',
        blocks: [
          { t: 'p', text: 'En vez de empezar preguntándote qué comprar, prueba con otra pregunta: ¿qué momento de este último año te gustaría poder volver a visitar? Puede ser una caminata bajo la lluvia, una canción que sonó durante un viaje o una tarde cualquiera que terminó siendo importante.' },
          { t: 'quote', text: 'Una escena concreta ayuda a encontrar un regalo con sentido sin convertir la búsqueda en una competencia por sorprender.' },
          { t: 'p', text: 'También vale pensar en la persona que lo recibirá. ¿Le gusta tener recuerdos a la vista o prefiere los detalles discretos? No hace falta responder todo; basta con una pista que conecte el objeto con su manera de vivir.' },
          { t: 'callout', title: 'Prueba esto', text: 'Escribe en una sola línea la escena que elegiste. Si no cabe, quédate con la parte que más te emocione.' }
        ]
      },
      {
        label: 'Idea 1',
        heading: 'Una fotografía con un lugar en la casa',
        blocks: [
          { t: 'p', text: 'Una foto suele quedarse en el teléfono porque parece demasiado cotidiana para imprimirla. Sin embargo, puede ser justamente la imagen que mejor cuenta la relación: no la más perfecta, sino aquella en la que ambos recuerdan qué pasó antes o después del instante capturado.' },
          { t: 'figure', src: 'assets/images/PORTARETRATOS/PORTA1.JPG', alt: 'Portarretrato personalizado con una fotografía de pareja y el nombre de una canción', caption: 'Portarretrato personalizado con fotografía y canción, de la colección de Portarretratos.' },
          { t: 'p', text: 'Un portarretrato personalizado convierte esa imagen en algo que puede formar parte de un escritorio, una repisa o una mesa de noche. Un recuerdo que se ve durante la rutina puede acompañar más que una foto guardada para ocasiones especiales.' },
          { t: 'link', text: 'Explora los portarretratos y demás productos del catálogo' }
        ]
      },
      {
        label: 'Idea 2',
        heading: 'Una luz que vuelva visible ese recuerdo',
        blocks: [
          { t: 'p', text: 'Si la escena que elegiste está ligada a una canción, una fecha o un lugar, una lámpara puede ser una manera distinta de mantenerla presente. La colección de Lunas de Portal Love parte de una idea personal y propone llevarla a un objeto para exhibir, no de una fórmula que convierta todas las historias en la misma.' },
          { t: 'figure', src: 'assets/images/LUNAS/LUNAS LOVE/LUNALOVE.JPG', alt: 'Lámpara Luna encendida con un mensaje escrito sobre su superficie', caption: 'Lámpara Luna de la colección Lunas Love, con un mensaje escrito.' },
          { t: 'p', text: 'Antes de escoger una referencia, piensa qué te gustaría reconocer cada vez que la veas. Esa respuesta puede orientarte mejor que buscar “el regalo perfecto” en una lista interminable.' }
        ]
      },
      {
        label: 'Idea 3',
        heading: 'Una frase que solo podría ser de ustedes',
        blocks: [
          { t: 'p', text: 'Las dedicatorias más memorables no siempre son solemnes. A veces basta una frase que se repite en casa, el nombre de un lugar o una forma particular de decir “estoy aquí”.' },
          { t: 'callout', title: 'Antes de escribirla', text: 'Léela en voz alta. Si suena a tarjeta de catálogo, cámbiala por algo que dirías de verdad.' },
          { t: 'p', text: 'En la página de personalización puedes escribir una dedicatoria y señalar una canción. No necesitas llenar cada campo ni explicar toda la historia; un detalle bien elegido puede dar contexto suficiente.' }
        ]
      },
      {
        label: 'Idea 4',
        heading: 'Un objeto que encuentre su espacio cotidiano',
        blocks: [
          { t: 'p', text: 'Un regalo también se vuelve especial cuando encaja en la vida real. Un acrílico puede ser una opción para quien disfruta los objetos decorativos; una vela Baby, para una celebración relacionada con la llegada de un bebé; un portarretrato, para quien guarda fotografías impresas.' },
          { t: 'figure', src: 'assets/images/ACRILICOS/ACRI1.JPG', alt: 'Acrílico transparente con un collage de fotografías y una frase', caption: 'Acrílico personalizado con un collage de fotografías y una frase.' },
          { t: 'p', text: 'Imagina dónde podría estar el objeto una semana después de la celebración. Si puedes visualizarlo en un rincón que la persona usa, ya tienes una señal de que la idea conversa con su rutina.' }
        ]
      },
      {
        label: 'Idea 5',
        heading: 'Celebrar también fuera de la fecha redonda',
        blocks: [
          { t: 'p', text: 'Un aniversario ofrece una fecha para reunirse, pero el afecto no depende del calendario. Un agradecimiento después de una etapa difícil, una bienvenida o una nota que diga “vi esto y pensé en ti” pueden tener un peso propio.' },
          { t: 'p', text: 'Si vas a regalar sin una ocasión marcada, hazlo sencillo: elige un recuerdo, explica por qué lo escogiste y deja que el objeto haga el resto.' }
        ]
      },
      {
        label: 'Para decidir',
        heading: 'El detalle importa más que la lista',
        blocks: [
          { t: 'p', text: 'Para decidir entre varias ideas, vuelve a la escena inicial. ¿Cuál de los formatos la representa mejor? ¿Cuál se adapta a los gustos de quien lo recibirá? ¿Qué te gustaría que recordara al encontrarlo más adelante?' },
          { t: 'quote', text: 'Lo valioso está en la atención que pusiste antes de elegirlo.' }
        ]
      }
    ],
    closingTitle: 'Que el regalo abra una conversación',
    closing: 'Cuando un objeto señala un recuerdo compartido, la celebración no termina al guardar la envoltura: queda una historia para volver a contar. Piensa en la escena que quieres conservar y elige el formato que mejor le haga espacio.',
    productIds: ['portarretratos', 'lunas-love', 'acrilicos'],
    cta: 'Explorar productos personalizados'
  },
  {
    id: 'lampara-luna',
    category: 'Detrás de escena',
    title: 'De una fotografía a una lámpara Luna: un recuerdo encuentra su lugar',
    image: 'assets/images/blog_2.png',
    imageAlt: 'Sala de estar con lámparas y luz cálida al final de la tarde',
    intro: 'Una fotografía no es solo lo que aparece dentro del encuadre. También puede guardar el viaje que llevó hasta allí, una persona que ya no está cerca o un día que todavía consigue cambiarte el ánimo. Convertir esa referencia en un objeto empieza por decidir qué parte de la historia quieres conservar.',
    sections: [
      {
        label: 'Punto de partida',
        heading: 'El recuerdo empieza antes de elegir la lámpara',
        blocks: [
          { t: 'p', text: 'Piensa en una imagen que tenga contexto para ti. Puede ser un retrato, una mascota, un sitio o una escena cotidiana. No tiene que ser una fotografía profesional: lo importante es que represente algo que puedas explicar con tus propias palabras.' },
          { t: 'figure', src: 'assets/images/LUNAS/LUNAS MASCOTAS/LunaM.jpg', alt: 'Lámpara Luna encendida con la imagen de una mascota sobre una mesa auxiliar', caption: 'Lámpara Luna de la colección Lunas Mascotas, con la imagen de una mascota.' },
          { t: 'p', text: 'Portal Love reúne colecciones de Lunas, acrílicos personalizados, portarretratos y Velas Baby. Aunque aquí hablamos de la Luna, la pregunta sirve para cualquier formato: ¿qué quiero que esta persona recuerde al verlo?' }
        ]
      },
      {
        label: 'Elige',
        heading: 'Elegir una imagen con intención',
        blocks: [
          { t: 'p', text: 'Recorre tus fotos sin buscar de inmediato la más reciente. A veces una imagen antigua resulta más elocuente porque ya reúne varias etapas: el primer paseo con una mascota, una visita familiar o el lugar donde empezó una costumbre.' },
          { t: 'quote', text: 'La conexión personal pesa más que una composición perfecta.' },
          { t: 'p', text: 'Antes de subirla, confirma que sea el archivo que quieres compartir. Si tienes varias opciones, escoge una principal y decide qué detalle debería reconocerse primero.' },
          { t: 'link', text: 'Conoce las colecciones de Lunas en el catálogo' }
        ]
      },
      {
        label: 'Ten presente',
        heading: 'Una aclaración sobre el modelo 3D',
        blocks: [
          { t: 'p', text: 'La página de personalización incluye una demostración 3D de una Lámpara Luna y una imagen de referencia del diseño utilizado para ese ejemplo. Es una muestra fija para conocer el tipo de producto.' },
          { t: 'figure', wide: true, src: 'assets/images/luna-diseno-referencia.webp.webp', alt: 'Diseño de ejemplo con una fotografía, un mensaje y un código QR sobre una textura lunar', caption: 'Imagen de referencia del diseño usado en el ejemplo 3D de la página de personalización.' },
          { t: 'callout', title: 'Importante', text: 'El modelo 3D no cambia al subir tu fotografía. Tu imagen se utiliza como referencia para personalizar tu propia Luna.' },
          { t: 'p', text: 'Si algo del ejemplo te genera dudas, descríbelo al solicitar la cotización.' }
        ]
      },
      {
        label: 'Cuéntalo',
        heading: 'Dar contexto sin escribir una historia completa',
        blocks: [
          { t: 'p', text: 'Una referencia puede necesitar pocas palabras para cobrar sentido. “La foto del viaje en que nos perdimos y terminamos encontrando este café” da una pista más útil que “una foto bonita”, porque nombra la relación con el recuerdo.' },
          { t: 'quote', text: 'No hace falta escribir un relato largo: basta con señalar qué elemento importa y por qué.' },
          { t: 'p', text: 'El formulario permite escribir una dedicatoria, indicar una canción y adjuntar imagen o audio de referencia. Puedes usar solo lo que ayude a expresar la idea.' }
        ]
      },
      {
        label: 'Imagínalo',
        heading: 'Imaginar dónde vivirá ese recuerdo',
        blocks: [
          { t: 'p', text: 'Antes de elegir, piensa en el espacio de quien recibirá el regalo. ¿Hay una repisa libre, una mesa de noche o un escritorio que use todos los días? Imaginar el lugar ayuda a tomar una decisión más personal.' },
          { t: 'p', text: 'La luz tiene una presencia particular en una habitación: cambia cómo se siente un rincón y acompaña momentos distintos del día. Por eso una lámpara puede ser una forma significativa de presentar un recuerdo.' }
        ]
      },
      {
        label: 'Compara',
        heading: 'El mismo recuerdo puede pedir otro formato',
        blocks: [
          { t: 'p', text: 'No todas las historias se expresan igual. Si la imagen es el centro, un portarretrato personalizado puede mantenerla visible. Si buscas una pieza decorativa, puedes revisar los acrílicos. Para una celebración relacionada con un bebé, existen las Velas Baby.' },
          { t: 'figure', src: 'assets/images/VELAS/VELASBABY.JPG', alt: 'Dos velas con forma de animal sentadas frente a bases rosadas', caption: 'Velas Baby, de la colección del mismo nombre.' },
          { t: 'p', text: 'La mejor elección no es la más llamativa, sino la que permite que quien la recibe entienda por qué pensaste en ese objeto.' }
        ]
      },
      {
        label: 'Da el paso',
        heading: 'De la pantalla a una idea que puedes regalar',
        blocks: [
          { t: 'p', text: 'No hace falta tener resuelta cada decisión desde el principio; ayuda mucho saber qué quieres conservar. Así se recorre el camino en la página:' },
          {
            t: 'steps',
            items: [
              { title: 'Elige una referencia', text: 'Una fotografía o idea con significado para ti.' },
              { title: 'Añade contexto', text: 'Dedicatoria, canción o audio, solo lo que ayude.' },
              { title: 'Agrega al carrito', text: 'Revisa la cantidad y confirma tu selección.' },
              { title: 'Agenda por WhatsApp', text: 'Envía tu pedido para coordinar los detalles.' }
            ]
          }
        ]
      }
    ],
    closingTitle: 'Una imagen puede convertirse en parte de la rutina',
    closing: 'El recuerdo no cambia por estar en un objeto; cambia la frecuencia con que puedes volver a encontrarlo. Si tienes una fotografía o una idea que quisieras compartir, elige una referencia que cuente por qué esa historia merece quedarse cerca.',
    productIds: ['lunas-eco', 'lunas-love', 'lunas-mascotas'],
    cta: 'Explorar el catálogo de Portal Love'
  }
];

const articleWordCount = article => {
  const blockText = block => {
    if (block.t === 'quote') return '';
    if (block.t === 'steps') return block.items.map(item => `${item.title} ${item.text}`).join(' ');
    if (block.t === 'callout') return `${block.title} ${block.text}`;
    return block.text || '';
  };
  const text = [
    article.title,
    article.intro,
    ...article.sections.flatMap(section => [section.heading, ...section.blocks.map(blockText)]),
    article.closingTitle,
    article.closing
  ].join(' ');
  return text.trim().split(/\s+/).filter(Boolean).length;
};
const articleMinutes = article => Math.max(1, Math.ceil(articleWordCount(article) / 200));

document.addEventListener('DOMContentLoaded', () => {
  const dialog = document.getElementById('articleDialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;

  const reader = document.getElementById('articleReader');
  const scroller = document.getElementById('articleReaderScroll');
  const titleEl = document.getElementById('articleTitle');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const catalog = window.PORTALOVERS_CATALOG || [];
  let returnFocus = null;
  let returnScrollY = 0;
  let currentArticle = null;
  let observers = [];

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  };
  const arrowIcon = () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '16');
    svg.setAttribute('height', '16');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M5 12h14M12 5l7 7-7 7');
    svg.append(path);
    return svg;
  };

  function buildBlock(block) {
    if (block.t === 'p') return el('p', '', block.text);
    if (block.t === 'quote') {
      const quote = el('blockquote', 'article-quote article-reveal');
      quote.append(el('p', '', block.text));
      return quote;
    }
    if (block.t === 'callout') {
      const callout = el('aside', 'article-callout article-reveal');
      callout.append(el('strong', 'article-callout-title', block.title), el('p', '', block.text));
      return callout;
    }
    if (block.t === 'figure') {
      const figure = el('figure', `article-figure article-reveal${block.wide ? ' is-wide' : ''}`);
      const frame = el('div', 'article-figure-frame');
      const image = el('img');
      image.src = block.src;
      image.alt = block.alt;
      image.loading = 'lazy';
      image.decoding = 'async';
      frame.append(image);
      figure.append(frame, el('figcaption', '', block.caption));
      return figure;
    }
    if (block.t === 'steps') {
      const list = el('ol', 'article-steps article-reveal');
      block.items.forEach((item, index) => {
        const step = el('li', 'article-step');
        step.append(el('span', 'article-step-number', String(index + 1).padStart(2, '0')), el('strong', '', item.title), el('p', '', item.text));
        list.append(step);
      });
      return list;
    }
    if (block.t === 'link') {
      const link = el('a', 'article-inline-cta');
      link.href = '#catalogo';
      link.dataset.articleCatalogLink = '';
      link.append(document.createTextNode(block.text), arrowIcon());
      return link;
    }
    return document.createComment('');
  }

  function buildProducts(article) {
    const wrap = document.getElementById('articleProducts');
    wrap.replaceChildren();
    article.productIds.forEach(id => {
      const item = catalog.find(collection => collection.id === id);
      if (!item) return;
      const link = el('a', 'article-product');
      link.href = `personalizar.html?${new URLSearchParams({ id: item.id, image: item.images[0] })}`;
      const image = el('img');
      image.src = item.images[0];
      image.alt = '';
      image.loading = 'lazy';
      image.decoding = 'async';
      const text = el('span', 'article-product-text');
      text.append(el('small', '', item.categoryName), el('strong', '', item.title));
      const action = el('span', 'article-product-action', 'Personalizar');
      action.append(arrowIcon());
      link.append(image, text, action);
      wrap.append(link);
    });
  }

  function buildNext(article) {
    const other = portalArticles.find(item => item.id !== article.id);
    const button = document.getElementById('articleNext');
    button.replaceChildren();
    button.dataset.articleId = other.id;
    const image = el('img');
    image.src = other.image;
    image.alt = '';
    image.loading = 'lazy';
    image.decoding = 'async';
    const text = el('span', 'article-next-text');
    text.append(el('small', '', `${other.category} · ${articleMinutes(other)} min de lectura`), el('strong', '', other.title));
    const action = el('span', 'article-next-action', 'Leer');
    action.append(arrowIcon());
    button.append(image, text, action);
  }

  function setupObservers(sections) {
    observers.forEach(observer => observer.disconnect());
    observers = [];
    const toc = Array.from(document.querySelectorAll('#articleToc a'));

    const spy = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        toc.forEach(link => {
          const active = link.dataset.target === entry.target.id;
          link.classList.toggle('is-active', active);
          if (active) link.setAttribute('aria-current', 'true');
          else link.removeAttribute('aria-current');
        });
      });
    }, { root: scroller, rootMargin: '-15% 0px -70% 0px', threshold: 0 });
    sections.forEach(section => spy.observe(section));
    observers.push(spy);

    reader.classList.toggle('has-motion', !prefersReducedMotion.matches);
    if (!prefersReducedMotion.matches) {
      const reveal = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          reveal.unobserve(entry.target);
        });
      }, { root: scroller, rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      scroller.querySelectorAll('.article-reveal').forEach(node => reveal.observe(node));
      observers.push(reveal);
    }
  }

  function renderArticle(article) {
    currentArticle = article;
    const minutes = `${articleMinutes(article)} min de lectura`;
    document.getElementById('articleCategory').textContent = article.category;
    document.getElementById('articleReadingTime').textContent = minutes;
    document.getElementById('articleBarTime').textContent = minutes;
    titleEl.textContent = article.title;
    document.getElementById('articleIntro').textContent = article.intro;
    const hero = document.getElementById('articleImage');
    hero.src = article.image;
    hero.alt = article.imageAlt;

    const sectionsEl = document.getElementById('articleSections');
    const tocEl = document.getElementById('articleToc');
    sectionsEl.replaceChildren();
    tocEl.replaceChildren();
    const sectionNodes = article.sections.map((section, index) => {
      const node = el('section', 'article-section article-reveal');
      node.id = `article-section-${index}`;
      node.append(el('span', 'article-kicker', section.label), el('h2', '', section.heading));
      section.blocks.forEach(block => node.append(buildBlock(block)));
      sectionsEl.append(node);

      const item = el('li');
      const link = el('a', '', section.heading);
      link.href = `#${node.id}`;
      link.dataset.target = node.id;
      item.append(link);
      tocEl.append(item);
      return node;
    });

    document.getElementById('articleClosingTitle').textContent = article.closingTitle;
    document.getElementById('articleClosing').textContent = article.closing;
    document.getElementById('articleCta').textContent = article.cta;
    buildProducts(article);
    buildNext(article);
    setupObservers(sectionNodes);
    updateProgress();
  }

  function updateProgress() {
    const max = scroller.scrollHeight - scroller.clientHeight;
    const ratio = max > 0 ? Math.min(1, scroller.scrollTop / max) : 0;
    document.getElementById('articleProgress').style.transform = `scaleX(${ratio})`;
  }

  function showArticle(article) {
    renderArticle(article);
    scroller.scrollTop = 0;
    titleEl.focus({ preventScroll: true });
    updateProgress();
  }

  function openArticle(article, trigger) {
    returnFocus = trigger;
    returnScrollY = window.scrollY;
    dialog.returnValue = '';
    dialog.showModal();
    showArticle(article);
  }

  scroller.addEventListener('scroll', () => window.requestAnimationFrame(updateProgress), { passive: true });

  document.querySelectorAll('.blog-card[data-article-id]').forEach(card => {
    card.addEventListener('click', event => {
      event.preventDefault();
      event.stopImmediatePropagation();
      const article = portalArticles.find(item => item.id === card.dataset.articleId);
      if (article) openArticle(article, card);
    }, { capture: true });
  });

  document.getElementById('articleBack').addEventListener('click', () => dialog.close());
  document.getElementById('articleNext').addEventListener('click', event => {
    const next = portalArticles.find(item => item.id === event.currentTarget.dataset.articleId);
    if (next) showArticle(next);
  });
  document.getElementById('articleToc').addEventListener('click', event => {
    const link = event.target.closest('a[data-target]');
    if (!link) return;
    event.preventDefault();
    document.getElementById(link.dataset.target)?.scrollIntoView({ behavior: prefersReducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
  });

  dialog.addEventListener('click', event => {
    if (event.target.closest('[data-article-home-link]')) {
      event.preventDefault();
      event.stopImmediatePropagation();
      dialog.close('home');
      return;
    }
    if (event.target.closest('[data-article-catalog-link]')) {
      event.preventDefault();
      event.stopImmediatePropagation();
      dialog.close('catalog');
    }
  }, { capture: true });

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !dialog.open) return;
    event.preventDefault();
    dialog.close();
  }, { capture: true });

  dialog.addEventListener('close', () => {
    observers.forEach(observer => observer.disconnect());
    observers = [];
    const behavior = prefersReducedMotion.matches ? 'auto' : 'smooth';
    window.requestAnimationFrame(() => {
      if (dialog.returnValue === 'home') {
        document.getElementById('inicio')?.scrollIntoView({ behavior });
        document.querySelector('.header .logo')?.focus({ preventScroll: true });
        return;
      }
      if (dialog.returnValue === 'catalog') {
        document.getElementById('catalogo')?.scrollIntoView({ behavior });
        document.querySelector('.catalog-filters .filter-btn')?.focus({ preventScroll: true });
        return;
      }
      window.scrollTo(0, returnScrollY);
      returnFocus?.focus({ preventScroll: true });
    });
  });

  portalArticles.forEach(article => {
    const label = document.querySelector(`[data-reading-for="${article.id}"]`);
    if (label) label.textContent = `${articleMinutes(article)} min`;
  });
});
