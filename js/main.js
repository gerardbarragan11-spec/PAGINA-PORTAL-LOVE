// js/main.js
document.addEventListener('DOMContentLoaded', () => {
  // Preloader
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    let preloaderTimer;
    const dismissPreloader = () => {
      if (preloaderTimer) return;
      preloaderTimer = window.setTimeout(() => preloader.classList.add('fade-out'), 250);
    };
    if (document.readyState === 'complete') dismissPreloader();
    else window.addEventListener('load', dismissPreloader, { once: true });
    window.setTimeout(dismissPreloader, 1800);
  }

  const header = document.querySelector('.header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = navMenu ? Array.from(navMenu.querySelectorAll('.nav-link')) : [];
  let menuOpen = false;

  const closeMenu = restoreFocus => {
    if (!menuToggle || !navMenu) return;
    menuOpen = false;
    menuToggle.classList.remove('active');
    navMenu.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    if (restoreFocus) menuToggle.focus();
  };

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuOpen = !menuOpen;
      menuToggle.classList.toggle('active', menuOpen);
      navMenu.classList.toggle('active', menuOpen);
      menuToggle.setAttribute('aria-expanded', String(menuOpen));
      document.body.classList.toggle('menu-open', menuOpen);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => closeMenu(false));
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menuOpen) closeMenu(true);
    });
    document.addEventListener('pointerdown', event => {
      if (menuOpen && !navMenu.contains(event.target) && !menuToggle.contains(event.target)) closeMenu(false);
    });
  }

  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const prefersReducedMotion = motionPreference.matches;
  const scrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';

  const heroVideo = document.querySelector('.hero-video');
  const heroStatic = document.querySelector('.hero-static');
  if (heroVideo && heroStatic) {
    const drawStaticHero = () => {
      if (!motionPreference.matches || !heroVideo.videoWidth || !heroVideo.videoHeight) return;
      heroStatic.width = heroVideo.videoWidth;
      heroStatic.height = heroVideo.videoHeight;
      const context = heroStatic.getContext('2d', { alpha: false });
      context.fillStyle = getComputedStyle(heroStatic).backgroundColor;
      context.fillRect(0, 0, heroStatic.width, heroStatic.height);
      context.globalCompositeOperation = 'darken';
      context.drawImage(heroVideo, 0, 0);
      heroVideo.pause();
      heroVideo.hidden = true;
      heroStatic.hidden = false;
    };

    const showStaticHero = () => {
      heroVideo.pause();
      const seekToLogo = () => {
        if (!motionPreference.matches) return;
        const posterTime = Math.min(6, Math.max(0, heroVideo.duration - 0.1));
        if (Math.abs(heroVideo.currentTime - posterTime) > 0.05) {
          heroVideo.addEventListener('seeked', drawStaticHero, { once: true });
          heroVideo.currentTime = posterTime;
        } else {
          drawStaticHero();
        }
      };

      if (heroVideo.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        seekToLogo();
      } else {
        heroVideo.preload = 'auto';
        heroVideo.addEventListener('loadeddata', seekToLogo, { once: true });
        heroVideo.load();
      }
    };

    const applyHeroMotionPreference = () => {
      if (motionPreference.matches) {
        heroVideo.autoplay = false;
        heroVideo.removeAttribute('autoplay');
        heroStatic.hidden = true;
        showStaticHero();
      } else {
        heroStatic.hidden = true;
        heroVideo.hidden = false;
        heroVideo.autoplay = true;
        heroVideo.play().catch(() => {});
      }
    };

    applyHeroMotionPreference();
    motionPreference.addEventListener('change', applyHeroMotionPreference);
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', event => {
      const targetId = anchor.getAttribute('href').slice(1);
      if (!targetId) return;
      const target = document.getElementById(decodeURIComponent(targetId));
      if (!target) return;
      event.preventDefault();
      window.history.pushState(null, '', `#${target.id}`);
      target.scrollIntoView({ behavior: scrollBehavior, block: 'start' });
    });
  });

  const backToTopBtn = document.getElementById('backToTop');
  const floatingWa = document.querySelector('.floating-wa');
  const packingParallaxLayers = document.querySelectorAll('[data-packing-parallax]');
  let previousScrollY = window.scrollY;
  let scrollFrame = 0;

  const updateScrollState = () => {
    scrollFrame = 0;
    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - previousScrollY;

    if (header) {
      header.classList.toggle('scrolled', currentScrollY > 50);
      if (currentScrollY < 96 || menuOpen) header.classList.remove('header-hidden');
      else if (Math.abs(scrollDelta) > 4 && currentScrollY > 260) {
        header.classList.toggle('header-hidden', scrollDelta > 0);
      }
    }

    if (backToTopBtn) backToTopBtn.classList.toggle('visible', currentScrollY > 300);
    if (floatingWa) floatingWa.classList.toggle('floating-wa-raised', currentScrollY > 300);
    if (packingParallaxLayers.length && !prefersReducedMotion && window.innerWidth > 768) {
      packingParallaxLayers.forEach(layer => {
        const bounds = layer.getBoundingClientRect();
        const center = bounds.top + bounds.height / 2;
        const depth = Number(layer.dataset.packingParallax) || 0;
        const offset = Math.max(-26, Math.min(26, (window.innerHeight / 2 - center) * depth));
        layer.style.setProperty('--packing-shift', `${offset}px`);
      });
    }
    previousScrollY = currentScrollY;
  };

  window.addEventListener('scroll', () => {
    if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateScrollState);
  }, { passive: true });
  window.addEventListener('resize', () => {
    if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateScrollState);
  }, { passive: true });
  updateScrollState();

  const sectionsById = new Map(navLinks.map(link => [link.getAttribute('href')?.slice(1), link]));
  const navigationSections = Array.from(sectionsById.keys())
    .map(sectionId => document.getElementById(sectionId))
    .filter(Boolean);

  if ('IntersectionObserver' in window && navigationSections.length) {
    const navigationObserver = new IntersectionObserver(entries => {
      const visibleSections = entries.filter(entry => entry.isIntersecting);
      if (!visibleSections.length) return;
      visibleSections.sort((first, second) =>
        Math.abs(first.boundingClientRect.top - 110) - Math.abs(second.boundingClientRect.top - 110)
      );
      const activeId = visibleSections[0].target.id;
      sectionsById.forEach((link, sectionId) => {
        const isActive = sectionId === activeId;
        link.classList.toggle('active', isActive);
        if (isActive) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-18% 0px -62% 0px', threshold: 0 });
    navigationSections.forEach(section => navigationObserver.observe(section));
  }

  const catalogCollections = window.PORTALOVERS_CATALOG || [];
  const catalogGrid = document.getElementById('productCatalogGrid');
  const lunaSubcategories = document.getElementById('lunaSubcategories');
  const lunaFilterButton = document.querySelector('.filter-btn[data-filter="lunas"]');

  const personalizationUrl = (productId, imagePath) => {
    const params = new URLSearchParams({ id: productId, image: imagePath });
    return `personalizar.html?${params.toString()}`;
  };

  function createCollectionCard(collection) {
    const card = document.createElement('article');
    card.className = `product-card collection-card reveal${collection.featured ? ' collection-card--featured' : ''}`;
    card.id = collection.id;
    card.dataset.category = collection.category;

    const imageFrame = document.createElement('div');
    imageFrame.className = 'collection-image-frame';
    let featuredImage = null;
    if (collection.video) {
      const featuredVideo = document.createElement('video');
      featuredVideo.className = 'collection-video';
      featuredVideo.src = collection.video;
      featuredVideo.autoplay = false;
      featuredVideo.muted = true;
      featuredVideo.loop = true;
      featuredVideo.playsInline = true;
      featuredVideo.preload = 'metadata';
      featuredVideo.setAttribute('aria-hidden', 'true');
      imageFrame.append(featuredVideo);
    } else {
      featuredImage = document.createElement('img');
      featuredImage.className = 'collection-image';
      featuredImage.src = collection.images[0];
      featuredImage.alt = `${collection.title}, foto 1`;
      featuredImage.loading = 'lazy';
      featuredImage.decoding = 'async';
      imageFrame.append(featuredImage);
    }

    const info = document.createElement('div');
    info.className = 'product-info collection-info';
    const category = document.createElement('span');
    category.className = 'product-category';
    category.textContent = collection.categoryName;
    const title = document.createElement('h3');
    title.className = 'product-title';
    title.textContent = collection.title;
    const photoCount = document.createElement('span');
    photoCount.className = 'collection-photo-count';
    photoCount.textContent = collection.photoCountLabel || (collection.photoLimit
      ? `${collection.photoLimit} fotos requeridas`
      : `${collection.images.length} fotos`);
    const price = document.createElement('span');
    price.className = 'collection-price';
    if (collection.category === 'lunas') {
      const lunaPricing = window.PORTALOVERS_LUNA_PRICING;
      const startingPrice = lunaPricing.products?.[collection.id]?.[lunaPricing.cardSize];
      price.textContent = Number.isFinite(startingPrice)
        ? `Desde ${window.PORTALOVERS_FORMAT_COP(startingPrice)}`
        : 'Precio por cotizar';
    } else {
      price.textContent = Number.isFinite(collection.price)
        ? window.PORTALOVERS_FORMAT_COP(collection.price)
        : 'Precio por cotizar';
    }

    const thumbnails = document.createElement('div');
    thumbnails.className = 'collection-thumbnails';
    thumbnails.setAttribute('role', 'group');
    thumbnails.setAttribute('aria-label', `Fotos de ${collection.title}`);
    collection.images.forEach((imagePath, index) => {
      const thumbnail = document.createElement('button');
      thumbnail.className = 'collection-thumbnail';
      thumbnail.type = 'button';
      thumbnail.dataset.image = imagePath;
      thumbnail.dataset.index = String(index);
      thumbnail.setAttribute('aria-label', `Ver foto ${index + 1} de ${collection.images.length}: ${collection.title}`);
      thumbnail.setAttribute('aria-pressed', String(index === 0));
      const thumbnailImage = document.createElement('img');
      thumbnailImage.src = imagePath;
      thumbnailImage.alt = '';
      thumbnailImage.loading = 'lazy';
      thumbnailImage.decoding = 'async';
      thumbnail.append(thumbnailImage);
      thumbnails.append(thumbnail);
    });

    const inquiry = document.createElement('a');
    inquiry.className = 'btn btn-primary btn-sm collection-inquiry';
    if (collection.contactOnly) {
      inquiry.href = `https://wa.me/${Cart.WA_NUMBER}?text=${encodeURIComponent(collection.inquiryMessage)}`;
      inquiry.target = '_blank';
      inquiry.rel = 'noopener noreferrer';
      inquiry.textContent = 'Cotiza tu evento con nosotros';
    } else {
      inquiry.href = personalizationUrl(collection.id, collection.images[0]);
      inquiry.textContent = 'Personalizar';
    }

    info.append(category, title);
    if (!collection.contactOnly) info.append(price, photoCount);
    if (collection.images.length > 1) info.append(thumbnails);
    info.append(inquiry);
    card.append(imageFrame, info);
    return card;
  }

  if (catalogGrid) {
    const categoryOrder = { lunas: 0, acrilicos: 1 };
    const orderedCollections = [...catalogCollections].sort((first, second) => {
      const priorityDifference = (categoryOrder[first.category] ?? 2) - (categoryOrder[second.category] ?? 2);
      if (priorityDifference !== 0) return priorityDifference;
      return Number(Boolean(second.featured)) - Number(Boolean(first.featured));
    });
    orderedCollections.forEach(collection => catalogGrid.append(createCollectionCard(collection)));
  }
  const collectionVideos = catalogGrid ? Array.from(catalogGrid.querySelectorAll('.collection-video')) : [];
  if (!prefersReducedMotion && collectionVideos.length) {
    if ('IntersectionObserver' in window) {
      const collectionVideoObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.play().catch(() => {});
          else entry.target.pause();
        });
      }, { rootMargin: '120px 0px' });
      collectionVideos.forEach(video => collectionVideoObserver.observe(video));
    } else {
      collectionVideos.forEach(video => video.play().catch(() => {}));
    }
  }

  const productShowcaseTrack = document.getElementById('showcaseTrack');
  if (productShowcaseTrack) {
    const clientMedia = window.PORTALOVERS_CLIENT_MEDIA || [];
    const videoClock = new Map();
    const activeVideos = new Set();

    // Copies of the same clip share one clock so the loop reset shows no jump.
    const clockTarget = video => {
      const duration = video.duration;
      if (!Number.isFinite(duration) || duration <= 0) return 0;
      const start = videoClock.get(video.dataset.src);
      return (((performance.now() - start) / 1000) % duration);
    };
    const alignVideo = video => {
      if (!videoClock.has(video.dataset.src)) videoClock.set(video.dataset.src, performance.now());
      const target = clockTarget(video);
      const drift = Math.abs(video.currentTime - target);
      if (drift > 0.35 && drift < video.duration - 0.35) video.currentTime = target;
    };
    const startVideo = video => {
      if (prefersReducedMotion) return;
      activeVideos.add(video);
      if (!video.getAttribute('src')) {
        video.preload = 'auto';
        video.src = encodeURI(video.dataset.src);
        video.load();
      }
      const play = () => {
        alignVideo(video);
        video.play().catch(() => {});
      };
      if (video.readyState >= 2) play();
      else {
        video.addEventListener('loadeddata', play, { once: true });
        video.addEventListener('canplay', play, { once: true });
      }
    };

    // Mobile browsers (data saver, low power) may block autoplay until the first touch.
    const retryPlayback = () => activeVideos.forEach(video => {
      if (video.paused) video.play().catch(() => {});
    });
    ['touchstart', 'pointerdown', 'scroll'].forEach(type => {
      window.addEventListener(type, retryPlayback, { passive: true, once: true });
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        activeVideos.forEach(video => video.pause());
        collectionVideos.forEach(video => video.pause());
        return;
      }
      retryPlayback();
      if (!prefersReducedMotion) collectionVideos.forEach(video => {
        const bounds = video.getBoundingClientRect();
        if (bounds.top < window.innerHeight && bounds.bottom > 0) video.play().catch(() => {});
      });
    });
    const videoObserver = 'IntersectionObserver' in window
      ? new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) startVideo(entry.target);
          else {
            activeVideos.delete(entry.target);
            entry.target.pause();
          }
        });
      }, { rootMargin: '0px 900px' })
      : null;
    window.setInterval(() => activeVideos.forEach(video => {
      if (!video.paused && video.readyState >= 2) alignVideo(video);
    }), 2000);

    const createShowcaseSlide = item => {
      const slide = document.createElement('div');
      slide.className = 'showcase-slide showcase-media';
      if (item.type === 'video') {
        const video = document.createElement('video');
        video.dataset.src = item.src;
        video.muted = true;
        video.defaultMuted = true;
        video.setAttribute('muted', '');
        video.loop = true;
        video.playsInline = true;
        video.setAttribute('playsinline', '');
        video.disablePictureInPicture = true;
        video.setAttribute('aria-label', 'Video de un cliente satisfecho con su pedido de Portal Love');
        slide.append(video);
        if (videoObserver) videoObserver.observe(video);
        else startVideo(video);
      } else {
        const image = document.createElement('img');
        image.src = item.src;
        image.alt = 'Fotografía de un cliente satisfecho con su pedido de Portal Love';
        image.loading = 'lazy';
        image.decoding = 'async';
        slide.append(image);
      }
      return slide;
    };

    productShowcaseTrack.replaceChildren();
    clientMedia.forEach(item => {
      productShowcaseTrack.append(createShowcaseSlide(item));
    });
    clientMedia.forEach(item => {
      const repeatedSlide = createShowcaseSlide(item);
      repeatedSlide.setAttribute('aria-hidden', 'true');
      productShowcaseTrack.append(repeatedSlide);
    });
  }

  if (catalogGrid) {
    catalogGrid.addEventListener('click', event => {
      const thumbnail = event.target.closest('.collection-thumbnail');
      if (!thumbnail) return;
      const card = thumbnail.closest('.collection-card');
      const featuredImage = card.querySelector('.collection-image');
      if (!featuredImage) return;
      featuredImage.src = thumbnail.dataset.image;
      featuredImage.alt = `${card.querySelector('.product-title').textContent}, foto ${Number(thumbnail.dataset.index) + 1}`;
      card.querySelector('.collection-inquiry').href = personalizationUrl(card.id, thumbnail.dataset.image);
      card.querySelectorAll('.collection-thumbnail').forEach(button => {
        button.setAttribute('aria-pressed', String(button === thumbnail));
      });
      if (!prefersReducedMotion) {
        featuredImage.animate(
          [{ opacity: 0.72, transform: 'scale(0.985)' }, { opacity: 1, transform: 'scale(1)' }],
          { duration: 260, easing: 'ease-out' }
        );
      }
    });
  }

  // Category Filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = catalogGrid ? Array.from(catalogGrid.querySelectorAll('.product-card')) : [];
  const cardFilterTimers = new WeakMap();

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class
      filterBtns.forEach(filterButton => {
        filterButton.classList.remove('active');
        filterButton.setAttribute('aria-pressed', 'false');
      });
      // Add active class
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      const filter = btn.getAttribute('data-filter');
      const showLunaSubcategories = filter === 'lunas';
      if (lunaSubcategories) lunaSubcategories.hidden = !showLunaSubcategories;
      if (lunaFilterButton) lunaFilterButton.setAttribute('aria-expanded', String(showLunaSubcategories));

      productCards.forEach(card => {
        clearTimeout(cardFilterTimers.get(card));
        const shouldShow = filter === 'todos' || card.getAttribute('data-category') === filter;
        if (shouldShow) {
          const wasHidden = card.style.display === 'none';
          card.style.display = 'flex';
          card.classList.remove('filter-exit');
          if (!prefersReducedMotion && wasHidden) {
            card.classList.add('filter-enter');
            window.requestAnimationFrame(() => card.classList.remove('filter-enter'));
          } else {
            card.classList.remove('filter-enter');
          }
        } else if (prefersReducedMotion) {
          card.classList.remove('filter-enter', 'filter-exit');
          card.style.display = 'none';
        } else {
          card.classList.remove('filter-enter');
          card.classList.add('filter-exit');
          cardFilterTimers.set(card, setTimeout(() => {
            card.style.display = 'none';
            card.classList.remove('filter-exit');
            cardFilterTimers.delete(card);
          }, 320));
        }
      });
    });
  });

  const counters = document.querySelectorAll('.counter');
  const aboutSection = document.querySelector('.about-stats-band');
  const animateCounters = () => {
    counters.forEach(counter => {
      const target = Number(counter.getAttribute('data-target'));
      const startTime = performance.now();
      const duration = 1200;
      const updateCounter = now => {
        const progress = Math.min((now - startTime) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.round(target * easedProgress);
        counter.textContent = `${currentValue.toLocaleString('es-CO')}${progress === 1 && target > 1000 ? '+' : ''}`;
        if (progress < 1) window.requestAnimationFrame(updateCounter);
      };
      window.requestAnimationFrame(updateCounter);
    });
  };

  if (aboutSection && counters.length && !prefersReducedMotion && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      animateCounters();
      counterObserver.disconnect();
    }, { threshold: 0.25 });
    counterObserver.observe(aboutSection);
  } else if (counters.length) {
    counters.forEach(counter => {
      const target = Number(counter.getAttribute('data-target'));
      counter.textContent = `${target.toLocaleString('es-CO')}${target > 1000 ? '+' : ''}`;
    });
  }

  const contactMessage = document.getElementById('contactMessage');
  if (contactMessage) {
    document.querySelectorAll('[data-support-message]').forEach(link => {
      link.addEventListener('click', () => {
        contactMessage.value = link.dataset.supportMessage;
        contactMessage.focus({ preventScroll: true });
      });
    });
  }

  // Contact Form Submission (WhatsApp)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName').value;
      const message = document.getElementById('contactMessage').value;
      const text = encodeURIComponent(`Hola, mi nombre es ${name}. ${message}`);
      window.open(`https://wa.me/${Cart.WA_NUMBER}?text=${text}`, '_blank', 'noopener,noreferrer');
    });
  }

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: scrollBehavior });
    });
  }
  
  // Scroll Reveal Animation
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-up, .section-header, .trust-item');
  revealElements.forEach(element => {
    if (!element.matches('.reveal, .reveal-left, .reveal-right, .reveal-up')) element.classList.add('reveal-up');
  });
  if (revealElements.length > 0) {
    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('active');
          revealObserver.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });
      revealElements.forEach(element => revealObserver.observe(element));
    } else {
      revealElements.forEach(element => element.classList.add('active'));
    }
  }

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const ambientMotionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        entry.target.classList.toggle('motion-paused', !entry.isIntersecting);
      });
    }, { rootMargin: '120px 0px' });
    document.querySelectorAll('.hero, .showcase, .testimonials').forEach(section => {
      ambientMotionObserver.observe(section);
    });
  }

  // Showcase Arrows
  const showcaseTrack = document.getElementById('showcaseTrack');
  const showcasePrev = document.getElementById('showcasePrev');
  const showcaseNext = document.getElementById('showcaseNext');
  const showcaseWrapper = showcaseTrack ? showcaseTrack.closest('.showcase-wrapper') : null;

  if (showcaseTrack && showcaseWrapper && showcasePrev && showcaseNext) {
    const moveShowcase = direction => {
      const firstSlide = showcaseTrack.querySelector('.showcase-slide');
      if (!firstSlide) return;
      const gap = parseFloat(getComputedStyle(showcaseTrack).columnGap) || 0;
      const step = (firstSlide.getBoundingClientRect().width + gap) * 2;
      const animation = showcaseTrack.getAnimations().find(item => item.animationName === 'scrollShowcase');

      if (!animation || !Number.isFinite(animation.effect.getTiming().duration)) {
        showcaseWrapper.scrollBy({ left: step * direction, behavior: scrollBehavior });
        return;
      }

      const duration = animation.effect.getTiming().duration;
      const loopDistance = showcaseTrack.scrollWidth / 2 - gap / 2;
      const timeStep = duration * step / loopDistance;
      const currentTime = Number(animation.currentTime) || 0;
      animation.currentTime = (currentTime + direction * timeStep + duration) % duration;
    };

    showcaseNext.addEventListener('click', () => moveShowcase(1));
    showcasePrev.addEventListener('click', () => moveShowcase(-1));
    showcaseWrapper.addEventListener('keydown', event => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      moveShowcase(event.key === 'ArrowRight' ? 1 : -1);
    });
  }

  // Cart Icon click
  const cartIcon = document.getElementById('cartIcon');
  if (cartIcon) {
    cartIcon.addEventListener('click', () => {
      if (typeof Cart !== 'undefined') {
        Cart.openSidebar();
      } else if (window.Cart) {
        window.Cart.openSidebar();
      }
    });
  }
});
