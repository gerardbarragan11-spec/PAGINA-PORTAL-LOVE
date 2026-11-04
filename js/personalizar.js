document.addEventListener('DOMContentLoaded', () => {
  // Product details come from this catalog, not editable URL values.
  const params = new URLSearchParams(window.location.search);
  const products = {
    lamp_1: { name: 'Lámpara Silueta de Amor', price: 89900, image: 'assets/images/lamp_1.png', category: 'Lámparas 3D' },
    lamp_2: { name: 'Lámpara Corazón LED', price: 79900, image: 'assets/images/lamp_2.png', category: 'Lámparas 3D' },
    lamp_3: { name: 'Lámpara Luna Encantada', price: 94900, image: 'assets/images/lamp_3.png', category: 'Lámparas 3D' },
    frame_1: { name: 'Marco Rústico Artesanal', price: 54900, image: 'assets/images/frame_1.png', category: 'Portarretratos' },
    frame_2: { name: 'Marco LED Luminoso', price: 69900, image: 'assets/images/frame_2.png', category: 'Portarretratos' },
    frame_3: { name: 'Collage de Recuerdos', price: 64900, image: 'assets/images/frame_3.png', category: 'Portarretratos' },
    candle_1: { name: 'Vela Artesanal de Soya', price: 39900, image: 'assets/images/candle_1.png', category: 'Velas' },
    candle_2: { name: 'Set de Velas Pilar', price: 59900, image: 'assets/images/candle_2.png', category: 'Velas' },
    candle_3: { name: 'Vela Cerámica Pintada', price: 49900, image: 'assets/images/candle_3.png', category: 'Velas' }
  };
  (window.PORTALOVERS_CATALOG || []).forEach(collection => {
    products[collection.id] = {
      name: collection.title,
      price: null,
      priceOnRequest: true,
      image: collection.images[0],
      images: collection.images,
      category: collection.categoryName,
      categoryKey: collection.category,
      isLuna: collection.category === 'lunas'
    };
  });
  const productId = params.get('id');
  const product = Object.prototype.hasOwnProperty.call(products, productId)
    ? { id: productId, ...products[productId] }
    : null;

  const requestedImage = params.get('image');
  if (product?.images?.includes(requestedImage)) product.image = requestedImage;

  if (!product) {
    window.location.href = 'index.html#catalogo';
    return;
  }

  // 2. Populate preview
  document.getElementById('previewProductImg').src = product.image;
  document.getElementById('previewProductImg').alt = product.name;
  document.getElementById('previewName').textContent = product.name;
  document.getElementById('previewPrice').textContent = product.priceOnRequest
    ? 'Precio por cotizar'
    : '$' + product.price.toLocaleString('es-CO');
  document.getElementById('uploadExampleNote').hidden = product.id !== 'lamp_3' && !product.isLuna;
  if (product.id === 'lamp_3' || product.isLuna) {
    document.body.classList.add('luna-product-page');
    document.querySelector('.personalize-grid').classList.add('luna-product-layout');
    document.querySelector('.preview-column').appendChild(document.getElementById('lunaShowcase'));
  }

  const motionTargets = document.querySelectorAll('.customize-step, .luna-design-figure');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (motionTargets.length && !prefersReducedMotion && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('motion-enabled');
    const motionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        motionObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });
    motionTargets.forEach((element, index) => {
      element.classList.add('motion-item');
      element.style.setProperty('--motion-delay', `${Math.min(index % 5, 4) * 55}ms`);
      motionObserver.observe(element);
    });
  }

  async function initializeLunaShowcase() {
    if (product.id !== 'lamp_3' && !product.isLuna) return;

    const lunaAssets = (window.PORTALOVERS_LUNA_ASSETS || {})[product.id];
    const showcase = document.getElementById('lunaShowcase');
    const referenceImage = document.getElementById('lunaReferenceImage');

    if (lunaAssets) {
      const stlViewer = document.getElementById('lunaStlViewer');
      showcase.hidden = false;
      stlViewer.hidden = false;
      referenceImage.alt = `Diseño utilizado en el ejemplo de ${lunaAssets.label}`;
      referenceImage.addEventListener('error', () => {
        console.warn(`No se pudo cargar la imagen de ${lunaAssets.label}.`);
      }, { once: true });
      referenceImage.setAttribute('loading', 'eager');
      referenceImage.setAttribute('src', lunaAssets.image);
      try {
        await import('./luna-viewer.js');
        const viewer = window.PortaloversLunaViewer.mount(stlViewer, { modelUrl: lunaAssets.model, label: lunaAssets.label });
        window.addEventListener('pagehide', () => viewer.dispose(), { once: true });
      } catch (error) {
        const fromFile = window.location.protocol === 'file:';
        const message = document.createElement('div');
        message.className = 'luna-stl-status';
        message.setAttribute('role', 'status');
        message.append(Object.assign(document.createElement('span'), {
          textContent: fromFile
            ? 'Chrome bloquea los modelos 3D al abrir el archivo directamente. Abre el sitio con un servidor local, por ejemplo la extensión Live Server de VS Code.'
            : 'No se pudo cargar el visor 3D. Revisa tu conexión a internet y recarga la página.'
        }));
        stlViewer.replaceChildren(message);
        console.error('El visor 3D no está disponible:', error);
      }
      return;
    }

    const modelPath = 'assets/models/luna-ejemplo.glb';
    const referencePath = 'assets/images/luna-diseno-referencia.webp.webp';
    const modelViewer = document.getElementById('lunaModel');

    try {
      const viewerScript = document.createElement('script');
      viewerScript.type = 'module';
      viewerScript.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js';
      await new Promise((resolve, reject) => {
        viewerScript.addEventListener('load', resolve, { once: true });
        viewerScript.addEventListener('error', () => reject(new Error('No se pudo cargar el visualizador 3D.')), { once: true });
        document.head.appendChild(viewerScript);
      });
      await customElements.whenDefined('model-viewer');

      showcase.hidden = false;
      modelViewer.hidden = false;
      referenceImage.addEventListener('error', () => {
        console.warn('No se pudo cargar la imagen de referencia de la Lámpara Luna.');
      }, { once: true });
      modelViewer.addEventListener('error', () => {
        console.warn('No se pudo cargar el modelo 3D de la Lámpara Luna.');
      }, { once: true });
      referenceImage.setAttribute('loading', 'eager');
      referenceImage.setAttribute('src', referencePath);
      modelViewer.setAttribute('loading', 'eager');
      modelViewer.setAttribute('src', modelPath);
      modelViewer.setAttribute('camera-controls', '');
      modelViewer.setAttribute('touch-action', 'pan-y');
    } catch (error) {
      showcase.hidden = false;
      modelViewer.hidden = false;
      console.warn('La demostración de la Lámpara Luna no está disponible:', error.message);
    }
  }

  initializeLunaShowcase();

  // 3. Image Upload (drag & drop + click)
  const uploadArea = document.getElementById('uploadArea');
  const imageInput = document.getElementById('imageInput');
  const uploadPreview = document.getElementById('uploadPreview');
  const uploadedImage = document.getElementById('uploadedImage');
  const changeImageBtn = document.getElementById('changeImage');
  const removeImageBtn = document.getElementById('removeImage');
  const uploadFeedback = document.getElementById('uploadFeedback');
  let uploadedImageName = '';
  const audioUploadArea = document.getElementById('audioUploadArea');
  const audioInput = document.getElementById('audioInput');
  const audioPreview = document.getElementById('audioPreview');
  const audioPlayer = document.getElementById('audioPlayer');
  const audioFileName = document.getElementById('audioFileName');
  const audioFileSize = document.getElementById('audioFileSize');
  const changeAudioBtn = document.getElementById('changeAudio');
  const removeAudioBtn = document.getElementById('removeAudio');
  const audioFeedback = document.getElementById('audioFeedback');
  const orderFeedback = document.getElementById('orderFeedback');
  const storageConfig = window.PORTALOVERS_STORAGE || {};
  let selectedImageFile = null;
  let selectedAudioFile = null;
  let imagePreviewUrl = '';
  let audioPreviewUrl = '';
  let storedImageReference = null;
  let storedAudioReference = null;
  let isAddingToCart = false;
  const referenceControls = [imageInput, audioInput, changeImageBtn, removeImageBtn, changeAudioBtn, removeAudioBtn];

  function setReferenceControlsDisabled(disabled) {
    referenceControls.forEach(control => { control.disabled = disabled; });
    uploadArea.setAttribute('aria-disabled', String(disabled));
    audioUploadArea.setAttribute('aria-disabled', String(disabled));
  }

  uploadArea.addEventListener('click', (event) => {
    if (!isAddingToCart && event.target !== imageInput) imageInput.click();
  });
  uploadArea.addEventListener('keydown', (event) => {
    if (!isAddingToCart && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      imageInput.click();
    }
  });
  uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('dragover'); });
  uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    if (isAddingToCart) return;
    const file = e.dataTransfer.files[0];
    if (file) handleImageUpload(file);
  });
  imageInput.addEventListener('change', (e) => {
    if (e.target.files[0]) handleImageUpload(e.target.files[0]);
  });

  function handleImageUpload(file) {
    const extension = file.name.split('.').pop().toLowerCase();
    const validExtensions = ['jpg', 'jpeg', 'png', 'webp'];
    const validMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validExtensions.includes(extension) || (file.type && !validMimeTypes.includes(file.type.toLowerCase()))) {
      uploadFeedback.textContent = 'Formato no válido. Selecciona JPG, JPEG, PNG o WEBP.';
      imageInput.value = '';
      return;
    }
    if (file.size === 0 || file.size > 5 * 1024 * 1024) {
      uploadFeedback.textContent = file.size === 0 ? 'El archivo está vacío.' : 'La imagen supera el máximo de 5 MB.';
      imageInput.value = '';
      return;
    }

    const nextPreviewUrl = URL.createObjectURL(file);
    uploadedImage.onload = () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
      imagePreviewUrl = nextPreviewUrl;
      selectedImageFile = file;
      storedImageReference = null;
      uploadedImageName = file.name;
      uploadPreview.classList.add('has-image');
      uploadArea.style.display = 'none';
      uploadFeedback.textContent = `Imagen lista: ${file.name} (${formatFileSize(file.size)}). Se almacenará al agregar el producto.`;
    };
    uploadedImage.onerror = () => {
      URL.revokeObjectURL(nextPreviewUrl);
      uploadFeedback.textContent = 'El archivo no contiene una imagen válida. Selecciona otro.';
      imageInput.value = '';
    };
    uploadedImage.src = nextPreviewUrl;
  }

  removeImageBtn.addEventListener('click', () => {
    if (isAddingToCart) return;
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    imagePreviewUrl = '';
    selectedImageFile = null;
    storedImageReference = null;
    uploadedImageName = '';
    uploadedImage.src = '';
    uploadPreview.classList.remove('has-image');
    uploadArea.style.display = '';
    imageInput.value = '';
    uploadFeedback.textContent = 'JPG, JPEG, PNG o WEBP. Máximo 5 MB. Se almacenará al agregar el producto.';
  });
  changeImageBtn.addEventListener('click', () => {
    if (!isAddingToCart) imageInput.click();
  });

  function formatFileSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  function handleAudioSelection(file) {
    const extension = file.name.split('.').pop().toLowerCase();
    const validExtensions = ['mp3', 'wav', 'm4a', 'ogg'];
    const validMimeTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/wave', 'audio/mp4', 'audio/x-m4a', 'audio/ogg', 'application/ogg'];
    if (!validExtensions.includes(extension) || (file.type && !validMimeTypes.includes(file.type.toLowerCase()))) {
      audioFeedback.textContent = 'Formato no válido. Selecciona MP3, WAV, M4A u OGG.';
      audioInput.value = '';
      return;
    }
    if (file.size === 0 || file.size > 15 * 1024 * 1024) {
      audioFeedback.textContent = file.size === 0 ? 'El archivo está vacío.' : 'El audio supera el máximo de 15 MB.';
      audioInput.value = '';
      return;
    }

    if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl);
    audioPreviewUrl = URL.createObjectURL(file);
    selectedAudioFile = file;
    storedAudioReference = null;
    audioFileName.textContent = file.name;
    audioFileSize.textContent = formatFileSize(file.size);
    audioPlayer.src = audioPreviewUrl;
    audioPlayer.load();
    audioPreview.hidden = false;
    audioUploadArea.hidden = true;
    audioFeedback.textContent = `Audio listo: ${file.name} (${formatFileSize(file.size)}). Se almacenará al agregar el producto.`;
  }

  audioUploadArea.addEventListener('click', (event) => {
    if (!isAddingToCart && event.target !== audioInput) audioInput.click();
  });
  audioUploadArea.addEventListener('keydown', (event) => {
    if (!isAddingToCart && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      audioInput.click();
    }
  });
  audioInput.addEventListener('change', (event) => {
    if (event.target.files[0]) handleAudioSelection(event.target.files[0]);
  });
  changeAudioBtn.addEventListener('click', () => {
    if (!isAddingToCart) audioInput.click();
  });
  removeAudioBtn.addEventListener('click', () => {
    if (isAddingToCart) return;
    if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl);
    audioPreviewUrl = '';
    selectedAudioFile = null;
    storedAudioReference = null;
    audioPlayer.pause();
    audioPlayer.removeAttribute('src');
    audioPlayer.load();
    audioPreview.hidden = true;
    audioUploadArea.hidden = false;
    audioFileName.textContent = '';
    audioFileSize.textContent = '';
    audioInput.value = '';
    audioFeedback.textContent = 'MP3, WAV, M4A u OGG. Máximo 15 MB. Se almacenará al agregar el producto.';
  });

  async function uploadReferenceFile(file, resourceType, feedbackElement) {
    const cloudName = String(storageConfig.cloudName || '').trim().toLowerCase();
    const uploadPreset = String(storageConfig.uploadPreset || '').trim();
    if (!/^[a-z0-9-]+$/.test(cloudName) || !uploadPreset) {
      throw new Error('La configuración del almacenamiento no está completa.');
    }

    feedbackElement.textContent = `Subiendo ${file.name} a almacenamiento seguro…`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    let response;
    try {
      response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
        method: 'POST',
        body: formData
      });
    } catch (error) {
      throw new Error('No se pudo conectar con el almacenamiento. Revisa tu conexión e inténtalo de nuevo.');
    }

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(result.error?.message || 'El almacenamiento rechazó el archivo. Revisa la configuración del preset.');
    }

    let fileUrl;
    try {
      fileUrl = new URL(result.secure_url);
    } catch (error) {
      throw new Error('El almacenamiento no devolvió un enlace válido para el archivo.');
    }
    if (fileUrl.protocol !== 'https:') {
      throw new Error('El almacenamiento devolvió un enlace no seguro.');
    }
    feedbackElement.textContent = `${file.name} se almacenó correctamente y quedó asociado al producto.`;
    return { url: fileUrl.href, name: file.name, size: file.size };
  }

  async function uploadSelectedReferences() {
    const uploads = [];
    if (selectedImageFile && !storedImageReference) {
      uploads.push(uploadReferenceFile(selectedImageFile, 'image', uploadFeedback)
        .then(reference => { storedImageReference = reference; })
        .catch(error => { uploadFeedback.textContent = error.message; throw error; }));
    }
    if (selectedAudioFile && !storedAudioReference) {
      uploads.push(uploadReferenceFile(selectedAudioFile, 'video', audioFeedback)
        .then(reference => { storedAudioReference = reference; })
        .catch(error => { audioFeedback.textContent = error.message; throw error; }));
    }

    const results = await Promise.allSettled(uploads);
    const failedUpload = results.find(result => result.status === 'rejected');
    if (failedUpload) throw failedUpload.reason;
    return { image: storedImageReference, audio: storedAudioReference };
  }

  // 4. Phrase input with counter + live preview
  const phraseInput = document.getElementById('phraseInput');
  const phraseCount = document.getElementById('phraseCount');
  const previewOverlay = document.getElementById('previewOverlay');
  const previewPhrase = document.getElementById('previewPhrase');
  const previewSong = document.getElementById('previewSong');

  phraseInput.addEventListener('input', () => {
    phraseCount.textContent = phraseInput.value.length;
    updatePreviewOverlay();
  });

  // 5. Song input with live preview
  const songInput = document.getElementById('songInput');
  songInput.addEventListener('input', () => updatePreviewOverlay());

  function updatePreviewOverlay() {
    const hasPhrase = phraseInput.value.trim();
    const hasSong = songInput.value.trim();
    if (hasPhrase || hasSong) {
      previewOverlay.style.display = 'block';
      previewPhrase.textContent = hasPhrase ? `"${phraseInput.value}"` : '';
      previewSong.textContent = hasSong ? `🎵 ${songInput.value}` : '';
    } else {
      previewOverlay.style.display = 'none';
    }
  }

  // 6. Quantity selector
  let quantity = 1;
  const qtyValue = document.getElementById('qtyValue');
  document.getElementById('qtyMinus').addEventListener('click', () => {
    if (quantity > 1) { quantity--; qtyValue.textContent = quantity; }
  });
  document.getElementById('qtyPlus').addEventListener('click', () => {
    if (quantity < 10) { quantity++; qtyValue.textContent = quantity; }
  });

  // 7. Add to Cart
  const addToCartBtn = document.getElementById('addToCartBtn');
  addToCartBtn.addEventListener('click', async () => {
    if (isAddingToCart) return;
    isAddingToCart = true;
    setReferenceControlsDisabled(true);
    addToCartBtn.disabled = true;
    addToCartBtn.setAttribute('aria-busy', 'true');
    addToCartBtn.textContent = selectedImageFile || selectedAudioFile
      ? 'Subiendo referencias…'
      : 'Agregando al carrito…';
    orderFeedback.textContent = '';
    let itemAdded = false;

    try {
      const references = await uploadSelectedReferences();
      const item = {
        id: product.id,
        name: product.name,
        price: product.price,
        priceOnRequest: product.priceOnRequest === true,
        image: product.image,
        category: product.category,
        quantity: quantity,
        customization: {
          uploadedImageName: selectedImageFile?.name || '',
          imageReference: references.image,
          audioReference: references.audio,
          phrase: phraseInput.value.trim(),
          song: songInput.value.trim()
        }
      };

      if (!Cart.addItem(item)) {
        throw new Error('No se pudo guardar el producto. Revisa el espacio disponible en el navegador.');
      }
      itemAdded = true;
      addToCartBtn.classList.add('added');
      addToCartBtn.textContent = '✓ Agregado al Carrito';
      orderFeedback.textContent = 'Producto y referencias guardados. Los enlaces se incluirán en el pedido de WhatsApp.';
      setTimeout(() => Cart.openSidebar(), 500);
      setTimeout(() => {
        addToCartBtn.classList.remove('added');
        if (!isAddingToCart) addToCartBtn.textContent = '🛒 Agregar al Carrito';
      }, 2000);
    } catch (error) {
      orderFeedback.textContent = error.message || 'No se pudo agregar el producto. Inténtalo de nuevo.';
    } finally {
      isAddingToCart = false;
      setReferenceControlsDisabled(false);
      addToCartBtn.disabled = false;
      addToCartBtn.removeAttribute('aria-busy');
      if (!itemAdded) addToCartBtn.textContent = '🛒 Agregar al Carrito';
    }
  });

  // 8. Header scroll and mobile navigation
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
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
    navMenu.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', () => closeMenu(false)));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menuOpen) closeMenu(true);
    });
    document.addEventListener('pointerdown', event => {
      if (menuOpen && !navMenu.contains(event.target) && !menuToggle.contains(event.target)) closeMenu(false);
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && menuOpen) closeMenu(false);
    }, { passive: true });
  }

  const pageHeader = document.querySelector('.personalize-header-bar');
  let previousPageScrollY = window.scrollY;
  let pageScrollFrame = 0;
  window.addEventListener('scroll', () => {
    if (pageScrollFrame) return;
    pageScrollFrame = window.requestAnimationFrame(() => {
      pageScrollFrame = 0;
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - previousPageScrollY;
      if (pageHeader) {
        pageHeader.classList.toggle('scrolled', currentScrollY > 20);
        if (currentScrollY < 96 || menuOpen) pageHeader.classList.remove('header-hidden');
        else if (Math.abs(scrollDelta) > 4 && currentScrollY > 260) {
          pageHeader.classList.toggle('header-hidden', scrollDelta > 0);
        }
      }
      previousPageScrollY = currentScrollY;
    });
  }, { passive: true });

  // Cart icon click
  const cartIcon = document.getElementById('cartIcon');
  if (cartIcon) {
    cartIcon.addEventListener('click', () => Cart.openSidebar());
  }
});
