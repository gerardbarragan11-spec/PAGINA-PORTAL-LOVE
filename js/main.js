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

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', event => {
      const targetId = anchor.getAttribute('href').slice(1);
      if (!targetId) return;
      const target = document.getElementById(decodeURIComponent(targetId));
      if (!target) return;
      event.preventDefault();
      window.history.pushState(null, '', `#${target.id}`);
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const backToTopBtn = document.getElementById('backToTop');
  const floatingWa = document.querySelector('.floating-wa');
  const aboutImage = document.querySelector('.about-story-image img');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
    if (aboutImage && !prefersReducedMotion && window.innerWidth > 768) {
      const imageBounds = aboutImage.parentElement.getBoundingClientRect();
      const imageCenter = imageBounds.top + imageBounds.height / 2;
      const parallaxOffset = Math.max(-18, Math.min(18, (window.innerHeight / 2 - imageCenter) * 0.04));
      aboutImage.style.setProperty('--about-parallax', `${parallaxOffset}px`);
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
      featuredVideo.autoplay = true;
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
    if (!collection.contactOnly) info.append(photoCount);
    if (collection.images.length > 1) info.append(thumbnails);
    info.append(inquiry);
    card.append(imageFrame, info);
    return card;
  }

  if (catalogGrid) {
    const orderedCollections = [...catalogCollections].sort((first, second) => Number(Boolean(second.featured)) - Number(Boolean(first.featured)));
    orderedCollections.forEach(collection => catalogGrid.append(createCollectionCard(collection)));
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
      if (!document.hidden) retryPlayback();
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
        if (filter === 'todos' || card.getAttribute('data-category') === filter) {
          card.style.display = 'flex';
          cardFilterTimers.set(card, setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
            cardFilterTimers.delete(card);
          }, 10));
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          cardFilterTimers.set(card, setTimeout(() => {
            card.style.display = 'none';
            cardFilterTimers.delete(card);
          }, 300));
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
        counter.textContent = `${currentValue}${progress === 1 && target > 1000 ? '+' : ''}`;
        if (progress < 1) window.requestAnimationFrame(updateCounter);
      };
      window.requestAnimationFrame(updateCounter);
    });
  };

  if (aboutSection && counters.length && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      animateCounters();
      counterObserver.disconnect();
    }, { threshold: 0.25 });
    counterObserver.observe(aboutSection);
  } else if (counters.length) {
    counters.forEach(counter => {
      const target = Number(counter.getAttribute('data-target'));
      counter.textContent = `${target}${target > 1000 ? '+' : ''}`;
    });
  }

  // Contact Form Submission (WhatsApp)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName').value;
      const message = document.getElementById('contactMessage').value;
      const waNumber = '573106969740';
      const text = encodeURIComponent(`Hola, mi nombre es ${name}. ${message}`);
      window.open(`https://wa.me/${waNumber}?text=${text}`, '_blank');
    });
  }

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
        showcaseWrapper.scrollBy({ left: step * direction, behavior: 'smooth' });
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
