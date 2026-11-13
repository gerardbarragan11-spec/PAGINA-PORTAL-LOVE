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
    if (collection.contactOnly) return;
    products[collection.id] = {
      name: collection.title,
      price: null,
      priceOnRequest: true,
      image: collection.images[0],
      images: collection.images,
      category: collection.categoryName,
      categoryKey: collection.category,
      isLuna: collection.category === 'lunas',
      isCristalLove: collection.isCristalLove === true,
      portraitType: collection.portraitType || '',
      isPortrait: Boolean(collection.portraitType),
      includedBenefit: collection.includedBenefit || null,
      variantLabel: collection.variantLabel || '',
      theme: collection.theme || '',
      photoLimit: Number.isInteger(collection.photoLimit) ? collection.photoLimit : 0
    };
  });
  const cristalMessagesByTheme = {
    Amor: [
      'Amor gracias por ser la luz en mi vida.',
      'Amor feliz aniversario.',
      'Hogar es donde estoy contigo.',
      'Juntos todo es mejor.',
      'Siempre tu y yo.',
      'Suerte es tenerte en mi vida.'
    ],
    Amistad: [
      'Gracias por ser mi lugar seguro.',
      'Siempre seras mi lugar seguro.',
      'Tu amistad me llena el alma.'
    ]
  };
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

  const shippingFeedback = document.getElementById('shippingFeedback');
  const shippingFields = {
    fullName: document.getElementById('shippingFullName'),
    address: document.getElementById('shippingAddress'),
    neighborhood: document.getElementById('shippingNeighborhood'),
    city: document.getElementById('shippingCity'),
    phone: document.getElementById('shippingPhone'),
    additionalDetails: document.getElementById('shippingDetails')
  };
  const requiredShippingFields = [
    ['Nombre y apellido', shippingFields.fullName],
    ['Dirección', shippingFields.address],
    ['Barrio', shippingFields.neighborhood],
    ['Ciudad', shippingFields.city],
    ['Teléfono', shippingFields.phone]
  ];

  Object.values(shippingFields).forEach(field => {
    field.addEventListener('input', () => {
      field.removeAttribute('aria-invalid');
      shippingFeedback.textContent = '';
    });
  });

  function getShippingData() {
    return Object.fromEntries(Object.entries(shippingFields).map(([key, field]) => [key, field.value.trim()]));
  }

  function validateShippingData() {
    const missingFields = requiredShippingFields.filter(([, field]) => !field.value.trim());
    requiredShippingFields.forEach(([, field]) => {
      if (missingFields.some(([, missingField]) => missingField === field)) field.setAttribute('aria-invalid', 'true');
      else field.removeAttribute('aria-invalid');
    });
    if (!missingFields.length) return null;
    return {
      field: missingFields[0][1],
      message: `Completa los campos obligatorios: ${missingFields.map(([label]) => label).join(', ')}.`
    };
  }

  if (product.isCristalLove) {
    document.body.classList.add('cristal-love-page');
    document.getElementById('cristalCustomization').hidden = false;
    document.getElementById('cristalPhotoRequirement').textContent = `Carga exactamente ${product.photoLimit} fotografías para esta variante.`;
    const quantityStep = document.getElementById('quantityStep');
    document.querySelectorAll('.customize-step').forEach(step => {
      step.hidden = step !== quantityStep;
    });
    quantityStep.querySelector('.step-number').hidden = true;
  }
  if (product.isPortrait) {
    document.body.classList.add('portrait-product-page');
    const portraitCustomization = document.getElementById('portraitCustomization');
    const quantityStep = document.getElementById('quantityStep');
    const portraitSongStep = document.getElementById('portraitSongStep');
    const portraitAnniversaryStep = document.getElementById('portraitAnniversaryStep');
    const portraitAmoreStep = document.getElementById('portraitAmoreStep');
    const portraitSendToStep = document.getElementById('portraitSendToStep');
    portraitCustomization.hidden = false;
    document.querySelectorAll('.customize-step').forEach(step => { step.hidden = step !== quantityStep; });
    portraitSongStep.hidden = product.portraitType === 'amore-mio';
    portraitAnniversaryStep.hidden = product.portraitType !== 'box-aniversario';
    portraitAmoreStep.hidden = product.portraitType !== 'amore-mio';
    portraitSendToStep.hidden = product.portraitType !== 'box-aniversario';
    document.getElementById('portraitDedicationTitle').textContent = product.portraitType === 'box-aniversario'
      ? 'Dedicatoria grabada'
      : 'Dedicatoria impresa';
    document.getElementById('portraitDedicationHint').textContent = product.portraitType === 'box-aniversario'
      ? 'Máximo 80 caracteres.'
      : 'Escribe la dedicatoria para imprimir.';
    if (product.portraitType === 'box-aniversario') {
      document.getElementById('portraitDedicationNumber').textContent = '4';
      document.getElementById('portraitDedication').setAttribute('maxlength', '80');
      document.getElementById('portraitDedicationCounter').hidden = false;
    }
    const benefit = document.getElementById('portraitIncludedBenefit');
    if (product.includedBenefit) {
      document.getElementById('portraitIncludedBenefitText').textContent = `${product.includedBenefit.label} · Sin costo adicional.`;
      benefit.hidden = false;
    }
    quantityStep.querySelector('.step-number').hidden = true;
    portraitCustomization.append(quantityStep);
  }
  if (product.isLuna) {
    document.body.classList.add('luna-product-page');
    const lunaCustomization = document.getElementById('lunaCustomization');
    const lunaFlow = document.getElementById('lunaFlow');
    const quantityStep = document.getElementById('quantityStep');
    lunaCustomization.hidden = false;
    document.querySelectorAll('.customize-step').forEach(step => { step.hidden = true; });
    document.getElementById('lunaAudioMount').append(document.getElementById('lunaAudioControls'));
    document.getElementById('lunaSongMount').append(document.getElementById('lunaSongControls'));
    const dedicationStep = document.getElementById('dedicationStep');
    dedicationStep.querySelector('.step-number').textContent = '3';
    dedicationStep.querySelector('.step-label span:last-child').textContent = 'Dedicatoria grabada en la lámpara';
    dedicationStep.hidden = false;
    document.getElementById('lunaDedicationMount').append(dedicationStep);
    quantityStep.querySelector('.step-number').hidden = true;
    lunaFlow.append(quantityStep);
    document.getElementById('addToCartBtn').disabled = true;
  }

  // 2. Populate preview
  const previewProductImage = document.getElementById('previewProductImg');
  const previewImages = product.images?.length ? product.images : [product.image];
  const previousPreviewImageButton = document.getElementById('previewImagePrevious');
  const nextPreviewImageButton = document.getElementById('previewImageNext');
  const previewImageCounter = document.getElementById('previewImageCounter');
  let previewImageIndex = Math.max(0, previewImages.indexOf(product.image));
  const hasPreviewGallery = previewImages.length > 1;

  previousPreviewImageButton.hidden = !hasPreviewGallery;
  nextPreviewImageButton.hidden = !hasPreviewGallery;
  previewImageCounter.hidden = !hasPreviewGallery;

  function showPreviewImage(index) {
    previewImageIndex = (index + previewImages.length) % previewImages.length;
    previewProductImage.src = previewImages[previewImageIndex];
    previewProductImage.alt = `${product.name}, foto ${previewImageIndex + 1} de ${previewImages.length}`;
    previewImageCounter.textContent = `Foto ${previewImageIndex + 1} de ${previewImages.length}`;
  }

  showPreviewImage(previewImageIndex);
  if (hasPreviewGallery) {
    previousPreviewImageButton.addEventListener('click', () => showPreviewImage(previewImageIndex - 1));
    nextPreviewImageButton.addEventListener('click', () => showPreviewImage(previewImageIndex + 1));
  }

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
  const cristalPhotoFiles = Array(product.isCristalLove ? product.photoLimit : 0).fill(null);
  const cristalPhotoPreviewUrls = Array(cristalPhotoFiles.length).fill('');
  const portraitPhotoFiles = Array(product.isPortrait ? product.photoLimit : 0).fill(null);
  const portraitPhotoPreviewUrls = Array(portraitPhotoFiles.length).fill('');
  const lunaPhotoFiles = [];
  const lunaPhotoPreviewUrls = [];
  let selectedLunaSize = '';
  let selectedLunaQrOption = '';
  let selectedPortraitSongMode = '';
  const cristalChoices = Object.create(null);
  const cristalPhotoGrid = document.getElementById('cristalPhotoGrid');
  const cristalPhotoFeedback = document.getElementById('cristalPhotoFeedback');
  const portraitPhotoGrid = document.getElementById('portraitPhotoGrid');
  const portraitPhotoFeedback = document.getElementById('portraitPhotoFeedback');
  const lunaPhotoGrid = document.getElementById('lunaPhotoGrid');
  const lunaPhotoFeedback = document.getElementById('lunaPhotoFeedback');
  const lunaPricing = window.PORTALOVERS_LUNA_PRICING;
  if (product.isLuna) {
    document.getElementById('lunaBaseAddonPriceLabel').textContent = `Complemento adicional: $${lunaPricing.baseAddonPrice.toLocaleString('es-CO')} COP`;
    document.querySelectorAll('[data-luna-size]').forEach(button => {
      const sizePrice = lunaPricing.products[product.id][button.dataset.lunaSize];
      button.querySelector('.luna-size-price').textContent = Number.isFinite(sizePrice)
        ? `$${sizePrice.toLocaleString('es-CO')}`
        : 'Precio por cotizar';
    });
  }
  const referenceControls = [imageInput, audioInput, changeImageBtn, removeImageBtn, changeAudioBtn, removeAudioBtn];

  function setReferenceControlsDisabled(disabled) {
    referenceControls.forEach(control => { control.disabled = disabled; });
    document.querySelectorAll('#cristalCustomization button, #cristalCustomization input, #cristalCustomization textarea')
      .forEach(control => { control.disabled = disabled; });
    document.querySelectorAll('#lunaCustomization button, #lunaCustomization input, #lunaCustomization textarea')
      .forEach(control => { control.disabled = disabled; });
    document.querySelectorAll('#portraitCustomization button, #portraitCustomization input, #portraitCustomization textarea')
      .forEach(control => { control.disabled = disabled; });
    document.querySelectorAll('#shippingDataStep input, #shippingDataStep textarea')
      .forEach(control => { control.disabled = disabled; });
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
      animatePreviewEntry(uploadPreview);
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

  function animatePreviewEntry(element) {
    if (prefersReducedMotion || typeof element.animate !== 'function') return;
    element.animate(
      [
        { opacity: 0, transform: 'translate3d(0, 10px, 0) scale(0.99)' },
        { opacity: 1, transform: 'translate3d(0, 0, 0) scale(1)' }
      ],
      { duration: 280, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
    );
  }

  function renderPhotoSlots(grid, files, previewUrls, feedback, limit, onUpdate = () => {}) {
    files.splice(0, files.length, ...Array(limit).fill(null));
    previewUrls.splice(0, previewUrls.length, ...Array(limit).fill(''));
    const updateFeedback = message => {
      const count = files.filter(Boolean).length;
      feedback.textContent = message || `Fotografías seleccionadas: ${count} de ${limit}.`;
      onUpdate();
    };
    grid.replaceChildren();
    files.forEach((_, index) => {
      const slot = document.createElement('div');
      slot.className = 'cristal-photo-slot';

      const input = document.createElement('input');
      input.className = 'cristal-photo-input';
      input.type = 'file';
      input.accept = '.jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp';
      input.hidden = true;
      input.setAttribute('aria-label', `Seleccionar fotografía ${index + 1}`);

      const picker = document.createElement('button');
      picker.className = 'cristal-photo-picker';
      picker.type = 'button';
      picker.innerHTML = `<span class="cristal-photo-plus" aria-hidden="true">+</span><span>Agregar foto ${index + 1}</span>`;

      const preview = document.createElement('div');
      preview.className = 'cristal-photo-preview';
      preview.hidden = true;
      const image = document.createElement('img');
      image.alt = `Fotografía ${index + 1} seleccionada`;
      const actions = document.createElement('div');
      actions.className = 'cristal-photo-actions';
      const replace = document.createElement('button');
      replace.className = 'cristal-photo-action';
      replace.type = 'button';
      replace.textContent = 'Reemplazar';
      const remove = document.createElement('button');
      remove.className = 'cristal-photo-action';
      remove.type = 'button';
      remove.textContent = 'Eliminar';
      actions.append(replace, remove);
      preview.append(image, actions);
      slot.append(input, picker, preview);
      grid.append(slot);

      const openPicker = () => {
        if (isAddingToCart) return;
        input.value = '';
        input.click();
      };
      picker.addEventListener('click', openPicker);
      replace.addEventListener('click', openPicker);
      remove.addEventListener('click', () => {
        if (isAddingToCart) return;
        if (previewUrls[index]) URL.revokeObjectURL(previewUrls[index]);
        previewUrls[index] = '';
        files[index] = null;
        image.removeAttribute('src');
        preview.hidden = true;
        slot.classList.remove('has-photo');
        updateFeedback();
      });
      input.addEventListener('change', event => {
        const file = event.target.files?.[0];
        if (!file) return;
        const extension = file.name.split('.').pop().toLowerCase();
        const validExtensions = ['jpg', 'jpeg', 'png', 'webp'];
        const validMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validExtensions.includes(extension) || (file.type && !validMimeTypes.includes(file.type.toLowerCase()))) {
          updateFeedback('Formato no válido. Selecciona JPG, JPEG, PNG o WEBP.');
          input.value = '';
          return;
        }
        if (file.size === 0 || file.size > 5 * 1024 * 1024) {
          updateFeedback(file.size === 0 ? 'El archivo está vacío.' : 'Cada fotografía debe pesar máximo 5 MB.');
          input.value = '';
          return;
        }

        const nextPreviewUrl = URL.createObjectURL(file);
        const verifier = new Image();
        verifier.onload = () => {
          if (previewUrls[index]) URL.revokeObjectURL(previewUrls[index]);
          previewUrls[index] = nextPreviewUrl;
          files[index] = file;
          image.src = nextPreviewUrl;
          preview.hidden = false;
          slot.classList.add('has-photo');
          animatePreviewEntry(preview);
          updateFeedback();
          input.value = '';
        };
        verifier.onerror = () => {
          URL.revokeObjectURL(nextPreviewUrl);
          updateFeedback('El archivo no contiene una imagen válida. Selecciona otra.');
          input.value = '';
        };
        verifier.src = nextPreviewUrl;
      });
    });
    updateFeedback();
  }

  if (product.isCristalLove) {
    renderPhotoSlots(cristalPhotoGrid, cristalPhotoFiles, cristalPhotoPreviewUrls, cristalPhotoFeedback, product.photoLimit);
    const cristalMessageOptions = cristalMessagesByTheme[product.theme] || [];
    const cristalMessageChoices = document.getElementById('cristalMessageChoices');
    cristalMessageOptions.forEach((phrase, index) => {
      const option = document.createElement('button');
      option.type = 'button';
      option.className = 'cristal-choice-card';
      option.dataset.choiceGroup = 'cristal-message';
      option.dataset.value = String(index + 1);
      option.setAttribute('aria-pressed', 'false');

      const label = document.createElement('strong');
      label.textContent = `Opción ${index + 1}`;
      const text = document.createElement('span');
      text.textContent = phrase;
      option.append(label, text);
      cristalMessageChoices.append(option);
    });
  }
  if (product.isPortrait) {
    renderPhotoSlots(portraitPhotoGrid, portraitPhotoFiles, portraitPhotoPreviewUrls, portraitPhotoFeedback, product.photoLimit);
  }

  function resetCristalChoice(group) {
    document.querySelectorAll(`#cristalCustomization [data-choice-group="${group}"]`).forEach(button => {
      button.classList.remove('is-selected');
      button.setAttribute('aria-pressed', 'false');
    });
    delete cristalChoices[group];
  }

  const cristalLoveOptions = document.getElementById('cristalLoveOptions');
  const cristalLovePresetChoices = document.getElementById('cristalLovePresetChoices');
  const cristalLoveCustomField = document.getElementById('cristalLoveCustomField');
  const cristalLoveText = document.getElementById('cristalLoveText');
  const cristalLoveCount = document.getElementById('cristalLoveCount');
  const cristalDedication = document.getElementById('cristalDedication');
  const cristalDedicationCount = document.getElementById('cristalDedicationCount');

  document.querySelectorAll('#cristalCustomization [data-choice-group]').forEach(button => {
    button.addEventListener('click', () => {
      const { choiceGroup: group, value } = button.dataset;
      document.querySelectorAll(`#cristalCustomization [data-choice-group="${group}"]`).forEach(option => {
        const selected = option === button;
        option.classList.toggle('is-selected', selected);
        option.setAttribute('aria-pressed', String(selected));
      });
      cristalChoices[group] = value;

      if (group === 'cristal-complement') {
        cristalLoveOptions.hidden = value !== 'frase-love';
        if (!cristalLoveOptions.hidden) animatePreviewEntry(cristalLoveOptions);
        if (value !== 'frase-love') {
          resetCristalChoice('cristal-love-mode');
          resetCristalChoice('cristal-love-preset');
          cristalLoveText.value = '';
          cristalLoveCount.textContent = '0';
          cristalLovePresetChoices.hidden = true;
          cristalLoveCustomField.hidden = true;
        }
      }
      if (group === 'cristal-love-mode') {
        resetCristalChoice('cristal-love-preset');
        cristalLoveText.value = '';
        cristalLoveCount.textContent = '0';
        cristalLovePresetChoices.hidden = value !== 'predeterminada';
        cristalLoveCustomField.hidden = value !== 'personalizada';
        if (!cristalLovePresetChoices.hidden) animatePreviewEntry(cristalLovePresetChoices);
        if (!cristalLoveCustomField.hidden) animatePreviewEntry(cristalLoveCustomField);
      }
    });
  });

  cristalDedication.addEventListener('input', () => {
    cristalDedicationCount.textContent = cristalDedication.value.length;
  });
  cristalLoveText.addEventListener('input', () => {
    cristalLoveCount.textContent = cristalLoveText.value.length;
  });

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
    animatePreviewEntry(audioPreview);
    audioUploadArea.hidden = true;
    audioFeedback.textContent = `Audio listo: ${file.name} (${formatFileSize(file.size)}). Se almacenará al agregar el producto.`;
    if (product.isLuna) updateLunaProgress();
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
    if (product.isLuna) updateLunaProgress();
  });

  const portraitSongLinkField = document.getElementById('portraitSongLinkField');
  const portraitSongLink = document.getElementById('portraitSongLink');
  const portraitAudioMount = document.getElementById('portraitAudioMount');
  const audioStep = document.getElementById('audioStep');
  document.querySelectorAll('[data-portrait-song-mode]').forEach(button => {
    button.addEventListener('click', () => {
      selectedPortraitSongMode = button.dataset.portraitSongMode;
      document.querySelectorAll('[data-portrait-song-mode]').forEach(option => {
        const selected = option === button;
        option.classList.toggle('is-selected', selected);
        option.setAttribute('aria-pressed', String(selected));
      });
      const audioSelected = selectedPortraitSongMode === 'audio';
      portraitSongLinkField.hidden = audioSelected;
      portraitAudioMount.hidden = !audioSelected;
      if (audioSelected) animatePreviewEntry(portraitAudioMount);
      audioInput.required = audioSelected;
      if (audioSelected) {
        portraitSongLink.value = '';
        portraitAudioMount.append(audioStep);
        audioStep.hidden = false;
        audioStep.classList.add('is-visible');
        audioStep.querySelector('.step-number').hidden = true;
        audioStep.querySelector('.step-label span:last-child').textContent = 'Archivo de audio de tu canción';
      } else {
        audioStep.hidden = true;
        if (selectedAudioFile || audioPreviewUrl) removeAudioBtn.click();
      }
    });
  });

  document.getElementById('portraitDedication').addEventListener('input', event => {
    document.getElementById('portraitDedicationCount').textContent = event.target.value.length;
  });

  const lunaFlow = document.getElementById('lunaFlow');
  const lunaQrStep = document.getElementById('lunaQrStep');
  const lunaQrChoices = document.getElementById('lunaQrChoices');
  const lunaQrTitle = document.getElementById('lunaQrTitle');
  const lunaQrHint = document.getElementById('lunaQrHint');
  const lunaAudioMount = document.getElementById('lunaAudioMount');
  const lunaSongMount = document.getElementById('lunaSongMount');
  const lunaBaseAddonOption = document.getElementById('lunaBaseAddonOption');
  const lunaBaseAddonToggle = document.getElementById('lunaBaseAddonToggle');
  const lunaBaseField = document.getElementById('lunaBaseField');
  const lunaBaseText = document.getElementById('lunaBaseText');
  const lunaBaseTextLabel = document.getElementById('lunaBaseTextLabel');
  const lunaBaseCount = document.getElementById('lunaBaseCount');
  const lunaCardFrom = document.getElementById('lunaCardFrom');
  const lunaCardTo = document.getElementById('lunaCardTo');
  const lunaSizeFeedback = document.getElementById('lunaSizeFeedback');
  const lunaProgress = document.querySelector('.luna-progress');
  const lunaProgressText = document.getElementById('lunaProgressText');
  const lunaProgressFill = document.getElementById('lunaProgressFill');

  function updateLunaProgress() {
    if (!product.isLuna || !selectedLunaSize) return;
    const stepCount = selectedLunaSize === 'esencial' ? 4 : 5;
    const completed = [lunaPhotoFiles.length > 0 && lunaPhotoFiles.every(Boolean)];
    if (selectedLunaSize !== 'esencial') {
      if (product.id === 'lunas-eco') {
        const validSongLink = (() => {
          if (selectedLunaQrOption !== 'song-link') return false;
          try {
            return ['http:', 'https:'].includes(new URL(songInput.value.trim()).protocol);
          } catch (error) {
            return false;
          }
        })();
        completed.push(selectedLunaQrOption === 'audio' ? Boolean(selectedAudioFile) : validSongLink);
      } else {
        completed.push(Boolean(songInput.value.trim()));
      }
    }
    completed.push(Boolean(phraseInput.value.trim()));
    completed.push(selectedLunaSize === 'esencial' && !lunaBaseAddonToggle.checked
      || Boolean(lunaBaseText.value.trim()));
    completed.push(Boolean(lunaCardFrom.value.trim() && lunaCardTo.value.trim()));
    const completedCount = completed.filter(Boolean).length;
    lunaProgress.setAttribute('aria-valuemax', String(stepCount));
    lunaProgress.setAttribute('aria-valuenow', String(completedCount));
    lunaProgressText.textContent = `${completedCount} de ${stepCount} pasos completados · ${selectedLunaSize[0].toUpperCase()}${selectedLunaSize.slice(1)}`;
    lunaProgressFill.style.width = `${completedCount / stepCount * 100}%`;
  }

  function resetLunaInputs() {
    lunaPhotoPreviewUrls.forEach(url => { if (url) URL.revokeObjectURL(url); });
    lunaPhotoFiles.splice(0);
    lunaPhotoPreviewUrls.splice(0);
    lunaPhotoGrid.replaceChildren();
    lunaPhotoFeedback.textContent = '';
    if (selectedAudioFile || audioPreviewUrl) removeAudioBtn.click();
    audioInput.required = false;
    songInput.required = false;
    selectedLunaQrOption = '';
    document.querySelectorAll('[data-luna-qr]').forEach(button => {
      button.classList.remove('is-selected');
      button.setAttribute('aria-pressed', 'false');
    });
    songInput.value = '';
    phraseInput.value = '';
    phraseCount.textContent = '0';
    lunaBaseAddonToggle.checked = false;
    lunaBaseText.value = '';
    lunaBaseCount.textContent = '0';
    lunaCardFrom.value = '';
    lunaCardTo.value = '';
    updatePreviewOverlay();
    updateLunaProgress();
  }

  function selectLunaSize(size) {
    if (!product.isLuna) return;
    resetLunaInputs();
    selectedLunaSize = size;
    document.querySelectorAll('[data-luna-size]').forEach(button => {
      const selected = button.dataset.lunaSize === size;
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });

    const photoLimit = size === 'premium' ? 2 : 1;
    renderPhotoSlots(lunaPhotoGrid, lunaPhotoFiles, lunaPhotoPreviewUrls, lunaPhotoFeedback, photoLimit, updateLunaProgress);
    document.getElementById('lunaPhotoRequirement').textContent = `Carga ${photoLimit === 1 ? '1 fotografía' : 'las 2 fotografías'} para continuar.`;
    lunaFlow.hidden = false;
    animatePreviewEntry(lunaFlow);
    document.getElementById('quantityStep').hidden = false;
    lunaQrStep.hidden = size === 'esencial';
    if (!lunaQrStep.hidden) animatePreviewEntry(lunaQrStep);

    if (size === 'esencial') {
      lunaQrChoices.hidden = true;
      lunaAudioMount.hidden = true;
      lunaSongMount.hidden = true;
      lunaBaseAddonOption.hidden = false;
      lunaBaseField.hidden = true;
      document.getElementById('lunaBaseHint').textContent = `Complemento opcional · $${lunaPricing.baseAddonPrice.toLocaleString('es-CO')} COP. Al agregarlo, el texto será obligatorio.`;
      lunaBaseText.setAttribute('aria-required', String(lunaBaseAddonToggle.checked));
      lunaBaseTextLabel.textContent = 'Texto para la base (obligatorio)';
    } else {
      lunaQrTitle.textContent = product.id === 'lunas-eco'
        ? 'Elige la opción para tu QR'
        : 'Elige la canción que quieres dedicar';
      lunaQrHint.textContent = product.id === 'lunas-eco'
        ? 'Obligatorio: selecciona una sola opción.'
        : 'Nombre o enlace de la canción.';
      lunaQrChoices.hidden = product.id !== 'lunas-eco';
      lunaAudioMount.hidden = true;
      lunaSongMount.hidden = product.id === 'lunas-eco';
      songInput.type = product.id === 'lunas-eco' ? 'url' : 'text';
      songInput.placeholder = product.id === 'lunas-eco'
        ? 'Pega el enlace de la canción'
        : 'Nombre o enlace de la canción';
      lunaBaseAddonOption.hidden = true;
      lunaBaseField.hidden = false;
      document.getElementById('lunaBaseHint').textContent = 'Obligatorio · incluida en esta talla · máximo 30 caracteres.';
      lunaBaseText.setAttribute('aria-required', 'true');
      lunaBaseTextLabel.textContent = 'Texto para la base (obligatorio)';
    }

    updateLunaProgress();
    lunaSizeFeedback.textContent = `Talla ${size[0].toUpperCase()}${size.slice(1)} seleccionada.`;
    updateLunaPricePreview();
    document.getElementById('addToCartBtn').disabled = false;
  }

  if (product.isLuna) {
    document.querySelectorAll('[data-luna-size]').forEach(button => {
      button.addEventListener('click', () => selectLunaSize(button.dataset.lunaSize));
    });
    document.querySelectorAll('[data-luna-qr]').forEach(button => {
      button.addEventListener('click', () => {
        selectedLunaQrOption = button.dataset.lunaQr;
        document.querySelectorAll('[data-luna-qr]').forEach(option => {
          const selected = option === button;
          option.classList.toggle('is-selected', selected);
          option.setAttribute('aria-pressed', String(selected));
        });
        const isAudioOption = selectedLunaQrOption === 'audio';
        lunaAudioMount.hidden = !isAudioOption;
        lunaSongMount.hidden = isAudioOption;
        animatePreviewEntry(isAudioOption ? lunaAudioMount : lunaSongMount);
        audioInput.required = isAudioOption;
        songInput.required = selectedLunaQrOption === 'song-link';
        if (isAudioOption) {
          songInput.value = '';
        } else if (selectedAudioFile || audioPreviewUrl) {
          removeAudioBtn.click();
        }
        updatePreviewOverlay();
        updateLunaProgress();
      });
    });
    lunaBaseAddonToggle.addEventListener('change', () => {
      lunaBaseField.hidden = !lunaBaseAddonToggle.checked;
      if (!lunaBaseField.hidden) animatePreviewEntry(lunaBaseField);
      lunaBaseText.setAttribute('aria-required', String(lunaBaseAddonToggle.checked));
      if (!lunaBaseAddonToggle.checked) {
        lunaBaseText.value = '';
        lunaBaseCount.textContent = '0';
      }
      updateLunaPricePreview();
      updateLunaProgress();
    });
    lunaBaseText.addEventListener('input', () => {
      lunaBaseCount.textContent = lunaBaseText.value.length;
      updateLunaProgress();
    });
    lunaCardFrom.addEventListener('input', updateLunaProgress);
    lunaCardTo.addEventListener('input', updateLunaProgress);
  }

  function updateLunaPricePreview() {
    if (!product.isLuna) return;
    const productPrice = lunaPricing.products?.[product.id]?.[selectedLunaSize];
    const baseExtra = selectedLunaSize === 'esencial' && lunaBaseAddonToggle.checked
      ? lunaPricing.baseAddonPrice
      : 0;
    const productPriceText = Number.isFinite(productPrice)
      ? `$${productPrice.toLocaleString('es-CO')}`
      : 'Precio por cotizar';
    document.getElementById('previewPrice').textContent = baseExtra
      ? `${productPriceText} + $${baseExtra.toLocaleString('es-CO')} COP por la base`
      : productPriceText;
  }

  function getLunaValidationError() {
    if (!selectedLunaSize) return 'Selecciona una talla antes de personalizar.';
    const requiredPhotos = selectedLunaSize === 'premium' ? 2 : 1;
    if (lunaPhotoFiles.filter(Boolean).length !== requiredPhotos) {
      return `Carga ${requiredPhotos === 1 ? 'tu fotografía' : 'las dos fotografías'} para continuar.`;
    }
    if (selectedLunaSize !== 'esencial' && product.id === 'lunas-eco') {
      if (!selectedLunaQrOption) return 'Selecciona una opción para tu QR.';
      if (selectedLunaQrOption === 'audio' && !selectedAudioFile) return 'Carga el audio o latido para tu QR.';
      if (selectedLunaQrOption === 'song-link') {
        const value = songInput.value.trim();
        if (!value) return 'Escribe el enlace de la canción para tu QR.';
        try {
          const link = new URL(value);
          if (!['http:', 'https:'].includes(link.protocol)) throw new Error('URL inválida');
        } catch (error) {
          return 'Escribe un enlace válido que comience con http:// o https://.';
        }
      }
    }
    const baseIsRequired = selectedLunaSize !== 'esencial' || lunaBaseAddonToggle.checked;
    if (baseIsRequired && !lunaBaseText.value.trim()) return 'Escribe el texto para la base personalizada.';
    if (lunaBaseText.value.length > 30) return 'El texto de la base no puede superar los 30 caracteres.';
    return '';
  }

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
    const photos = [];
    if (product.isPortrait) {
      for (const [index, file] of portraitPhotoFiles.entries()) {
        if (!file) continue;
        portraitPhotoFeedback.textContent = `Guardando fotografía ${index + 1}…`;
        photos.push(await uploadReferenceFile(file, 'image', portraitPhotoFeedback));
      }
    } else if (product.isCristalLove || product.isLuna) {
      const photoFiles = product.isLuna ? lunaPhotoFiles : cristalPhotoFiles;
      const photoFeedback = product.isLuna ? lunaPhotoFeedback : cristalPhotoFeedback;
      const photoLimit = product.isLuna ? (selectedLunaSize === 'premium' ? 2 : 1) : product.photoLimit;
      for (const [index, file] of photoFiles.entries()) {
        photoFeedback.textContent = `Guardando fotografía ${index + 1} de ${photoLimit}…`;
        photos.push(await uploadReferenceFile(file, 'image', photoFeedback));
      }
    }
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
    return { image: storedImageReference, audio: storedAudioReference, photos };
  }

  function getCristalValidationError() {
    const photoCount = cristalPhotoFiles.filter(Boolean).length;
    if (photoCount !== product.photoLimit) return `Selecciona las ${product.photoLimit} fotografías para continuar.`;
    if (!cristalChoices['cristal-message']) return 'Selecciona una opción en “Elige tu mensaje”.';
    if (cristalDedication.value.length > 150) return 'La dedicatoria no puede superar los 150 caracteres.';
    if (!cristalChoices['cristal-base']) return 'Selecciona el color de la base.';
    if (!cristalChoices['cristal-complement']) return 'Selecciona un complemento sin costo adicional.';
    if (cristalChoices['cristal-complement'] === 'frase-love') {
      if (!cristalChoices['cristal-love-mode']) return 'Elige una modalidad para Frase Love.';
      if (cristalChoices['cristal-love-mode'] === 'predeterminada' && !cristalChoices['cristal-love-preset']) {
        return 'Selecciona una opción predeterminada de Frase Love.';
      }
      if (cristalChoices['cristal-love-mode'] === 'personalizada' && !cristalLoveText.value.trim()) {
        return 'Escribe tu frase Love personalizada.';
      }
      if (cristalLoveText.value.length > 30) return 'La frase Love no puede superar los 30 caracteres.';
    }
    return '';
  }

  function getPortraitValidationError() {
    if (portraitPhotoFiles.filter(Boolean).length === 0) return 'Agrega al menos una fotografía para continuar.';
    const dedication = document.getElementById('portraitDedication').value.trim();
    if (!dedication) return 'Escribe la dedicatoria para continuar.';

    if (product.portraitType === 'box-musical' || product.portraitType === 'box-aniversario') {
      if (!document.getElementById('portraitSongInput').value.trim()) return 'Escribe el nombre o enlace de la canción.';
    }
    if (product.portraitType === 'box-aniversario') {
      const firstName = document.getElementById('portraitNameOne').value.trim();
      const secondName = document.getElementById('portraitNameTwo').value.trim();
      if (!firstName || !secondName) return 'Completa los nombres de la pareja.';
      const day = Number(document.getElementById('portraitDay').value);
      const month = Number(document.getElementById('portraitMonth').value);
      const year = Number(document.getElementById('portraitYear').value);
      const date = new Date(0);
      date.setUTCHours(0, 0, 0, 0);
      date.setUTCFullYear(year, month - 1, day);
      if (!Number.isInteger(day) || !Number.isInteger(month) || !Number.isInteger(year)
        || year < 1 || year > 9999 || date.getUTCDate() !== day
        || date.getUTCMonth() !== month - 1 || date.getUTCFullYear() !== year) {
        return 'Escribe una fecha válida en formato Día / Mes / Año.';
      }
      if (dedication.length > 80) return 'La dedicatoria grabada no puede superar los 80 caracteres.';
      if (!document.getElementById('portraitFrom').value.trim() || !document.getElementById('portraitTo').value.trim()) {
        return 'Completa los campos De y Para de la tarjeta.';
      }
    }
    if (product.portraitType === 'amore-mio') {
      if (selectedPortraitSongMode === 'link') {
        const linkValue = portraitSongLink.value.trim();
        if (!linkValue) return 'Pega el enlace de la canción.';
        try {
          const link = new URL(linkValue);
          if (!['http:', 'https:'].includes(link.protocol)) throw new Error('URL inválida');
        } catch (error) {
          return 'Escribe un enlace válido que comience con http:// o https://.';
        }
      } else if (selectedPortraitSongMode === 'audio') {
        if (!selectedAudioFile) return 'Sube el archivo de audio de la canción.';
      } else {
        return 'Elige si compartirás el enlace o subirás un audio.';
      }
    }
    return '';
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
    if (product.isLuna) updateLunaProgress();
  });

  // 5. Song input with live preview
  const songInput = document.getElementById('songInput');
  songInput.addEventListener('input', () => {
    updatePreviewOverlay();
    if (product.isLuna) updateLunaProgress();
  });

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
    if (product.isLuna) {
      const validationError = getLunaValidationError();
      if (validationError) {
        orderFeedback.textContent = validationError;
        return;
      }
    }
    if (product.isCristalLove) {
      const validationError = getCristalValidationError();
      if (validationError) {
        orderFeedback.textContent = validationError;
        return;
      }
    }
    if (product.isPortrait) {
      const validationError = getPortraitValidationError();
      if (validationError) {
        orderFeedback.textContent = validationError;
        return;
      }
    }
    const shippingValidation = validateShippingData();
    if (shippingValidation) {
      shippingFeedback.textContent = shippingValidation.message;
      shippingValidation.field.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'center' });
      shippingValidation.field.focus({ preventScroll: true });
      return;
    }
    shippingFeedback.textContent = '';
    isAddingToCart = true;
    setReferenceControlsDisabled(true);
    addToCartBtn.disabled = true;
    addToCartBtn.setAttribute('aria-busy', 'true');
    addToCartBtn.textContent = selectedImageFile || selectedAudioFile || cristalPhotoFiles.some(Boolean) || lunaPhotoFiles.some(Boolean) || portraitPhotoFiles.some(Boolean)
      ? 'Subiendo referencias…'
      : 'Agregando al carrito…';
    orderFeedback.textContent = '';
    let itemAdded = false;

    try {
      const references = await uploadSelectedReferences();
      const customization = {
        uploadedImageName: selectedImageFile?.name || '',
        imageReference: references.image,
        audioReference: references.audio,
        phrase: phraseInput.value.trim(),
        song: songInput.value.trim(),
        shipping: getShippingData()
      };
      const lunaSizePrice = product.isLuna ? lunaPricing.products?.[product.id]?.[selectedLunaSize] : null;
      const itemPrice = Number.isFinite(lunaSizePrice) ? lunaSizePrice : product.price;
      if (product.isLuna) {
        const baseIsIncluded = selectedLunaSize !== 'esencial';
        const baseAddonPrice = !baseIsIncluded && lunaBaseAddonToggle.checked
          ? lunaPricing.baseAddonPrice
          : 0;
        customization.luna = {
          productId: product.id,
          productName: product.name,
          size: selectedLunaSize,
          sizeLabel: selectedLunaSize[0].toUpperCase() + selectedLunaSize.slice(1),
          price: Number.isFinite(lunaSizePrice) ? lunaSizePrice : null,
          photoLimit: selectedLunaSize === 'premium' ? 2 : 1,
          photos: references.photos,
          qr: selectedLunaSize === 'esencial'
            ? null
            : product.id === 'lunas-eco'
              ? {
                option: selectedLunaQrOption,
                songLink: selectedLunaQrOption === 'song-link' ? songInput.value.trim() : '',
                audioReference: selectedLunaQrOption === 'audio' ? references.audio : null
              }
              : { option: 'song', song: songInput.value.trim() },
          dedication: phraseInput.value.trim(),
          base: {
            included: baseIsIncluded,
            added: baseIsIncluded || baseAddonPrice > 0,
            text: baseIsIncluded || baseAddonPrice > 0 ? lunaBaseText.value.trim() : '',
            addonPrice: baseAddonPrice
          },
          printedCard: { from: lunaCardFrom.value.trim(), to: lunaCardTo.value.trim() }
        };
      }
      if (product.isCristalLove) {
        const messageOptionId = cristalChoices['cristal-message'];
        const messagePhrase = cristalMessagesByTheme[product.theme]?.[Number(messageOptionId) - 1] || '';
        const selectedBase = cristalChoices['cristal-base'];
        const baseLabels = { rojo: 'Rojo', lila: 'Lila', 'beige-arequipe': 'Beige arequipe' };
        const complementId = cristalChoices['cristal-complement'];
        customization.cristalLove = {
          variantId: product.id,
          variant: product.variantLabel,
          theme: product.theme,
          photoLimit: product.photoLimit,
          photos: references.photos,
          messageOption: {
            id: messageOptionId,
            label: `Opción ${messageOptionId}`,
            phrase: messagePhrase
          },
          dedication: cristalDedication.value.trim(),
          baseColor: { id: selectedBase, label: baseLabels[selectedBase] },
          complement: complementId === 'vela'
            ? { id: 'vela', label: 'Vela de corazón tejido', cost: 0 }
            : {
              id: 'frase-love',
              label: 'Frase Love',
              cost: 0,
              phrase: cristalChoices['cristal-love-mode'] === 'predeterminada'
                ? {
                  mode: 'predeterminada',
                  option: cristalChoices['cristal-love-preset'],
                  contentPending: true
                }
                : { mode: 'personalizada', text: cristalLoveText.value.trim() }
            }
        };
      }
      if (product.isPortrait) {
        const portraitType = product.portraitType;
        const dedicationType = portraitType === 'box-aniversario' ? 'grabada' : 'impresa';
        const portrait = {
          type: portraitType,
          photos: references.photos,
          dedication: { type: dedicationType, text: document.getElementById('portraitDedication').value.trim() },
          includedBenefit: product.includedBenefit
        };
        if (portraitType === 'box-musical' || portraitType === 'box-aniversario') {
          portrait.song = { mode: 'name-or-link', value: document.getElementById('portraitSongInput').value.trim() };
        }
        if (portraitType === 'box-aniversario') {
          const day = document.getElementById('portraitDay').value.padStart(2, '0');
          const month = document.getElementById('portraitMonth').value.padStart(2, '0');
          const year = document.getElementById('portraitYear').value.padStart(4, '0');
          portrait.names = {
            first: document.getElementById('portraitNameOne').value.trim(),
            second: document.getElementById('portraitNameTwo').value.trim()
          };
          portrait.anniversaryDate = `${day}/${month}/${year}`;
          portrait.card = {
            from: document.getElementById('portraitFrom').value.trim(),
            to: document.getElementById('portraitTo').value.trim()
          };
        }
        if (portraitType === 'amore-mio') {
          portrait.song = selectedPortraitSongMode === 'link'
            ? { mode: 'link', value: portraitSongLink.value.trim() }
            : { mode: 'audio', reference: references.audio };
        }
        customization.portrait = portrait;
      }
      const item = {
        id: product.id,
        name: product.name,
        price: itemPrice,
        priceOnRequest: !Number.isFinite(itemPrice) && product.priceOnRequest === true,
        image: product.image,
        category: product.category,
        quantity: quantity,
        customization
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
