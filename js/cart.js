// js/cart.js
const Cart = {
  STORAGE_KEY: 'portalovers_cart',
  WA_NUMBER: '573106969740',

  getItems() {
    try {
      const items = localStorage.getItem(this.STORAGE_KEY);
      const parsedItems = items ? JSON.parse(items) : [];
      if (!Array.isArray(parsedItems)) return [];
      return parsedItems
        .filter(item => item && typeof item === 'object'
          && typeof item.name === 'string'
          && typeof item.image === 'string'
          && (Number.isFinite(item.price) || item.priceOnRequest === true)
          && Number.isInteger(item.quantity)
          && item.quantity > 0)
        .map(item => {
          const customization = item.customization && typeof item.customization === 'object'
            ? item.customization
            : {};
          const collection = (window.PORTALOVERS_CATALOG || []).find(product => product.id === item.id);
          const configuredPrice = customization.luna
            ? window.PORTALOVERS_LUNA_PRICING?.products?.[item.id]?.[customization.luna.size]
            : collection?.price;
          const price = Number.isFinite(configuredPrice)
            ? configuredPrice
            : Number.isFinite(item.price) ? item.price : null;
          return {
            ...item,
            price,
            priceOnRequest: !Number.isFinite(price) && item.priceOnRequest === true,
            customization
          };
        });
    } catch (e) {
      return [];
    }
  },
  
  saveItems(items) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
      return true;
    } catch (e) {
      return false;
    }
  },
  
  addItem(item) {
    const items = this.getItems();
    items.push(item);
    if (!this.saveItems(items)) return false;
    this.updateBadge();
    this.renderSidebar();
    return true;
  },
  
  removeItem(index) {
    const items = this.getItems();
    if (!Number.isInteger(index) || !items[index]) return;
    items.splice(index, 1);
    if (!this.saveItems(items)) return;
    this.updateBadge();
    this.renderSidebar();
  },
  
  updateQuantity(index, qty) {
    if (qty < 1) return;
    const items = this.getItems();
    if (items[index]) {
      items[index].quantity = qty;
      if (!this.saveItems(items)) return;
      this.updateBadge();
      this.renderSidebar();
    }
  },
  
  getCount() {
    return this.getItems().reduce((sum, item) => sum + item.quantity, 0);
  },
  
  getTotal() {
    return this.getItems().reduce((sum, item) => {
      const productTotal = Number.isFinite(item.price) ? item.price * item.quantity : 0;
      const baseAddon = Number.isFinite(item.customization.luna?.base?.addonPrice)
        ? item.customization.luna.base.addonPrice * item.quantity
        : 0;
      return sum + productTotal + baseAddon;
    }, 0);
  },

  getBaseAddonsTotal() {
    return this.getItems().reduce((sum, item) => {
      const addonPrice = item.customization.luna?.base?.addonPrice;
      return sum + (Number.isFinite(addonPrice) ? addonPrice * item.quantity : 0);
    }, 0);
  },
  
  clear() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (e) {
      return false;
    }
    this.updateBadge();
    this.renderSidebar();
    return true;
  },

  escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[character]));
  },

  init() {
    const sidebarContainer = document.getElementById('cart-sidebar');
    if (!sidebarContainer) return;

    sidebarContainer.innerHTML = `
      <div class="cart-overlay" id="cartOverlay" aria-hidden="true"></div>
      <div class="cart-panel" id="cartPanel" role="region" aria-label="Carrito de compras" aria-hidden="true">
        <div class="cart-header">
          <h3>Tu Carrito</h3>
          <button class="cart-close" id="cartClose" type="button" aria-label="Cerrar carrito">&times;</button>
        </div>
        <div class="cart-items" id="cartItems"></div>
        <div class="cart-footer">
          <div class="cart-total">
            <span>Total:</span>
            <span class="cart-total-price" id="cartTotal">$0</span>
          </div>
          <button class="cart-schedule" id="cartSchedule" type="button" disabled>
            📱 Agendar Pedido por WhatsApp
          </button>
        </div>
      </div>
    `;

    document.getElementById('cartClose').addEventListener('click', () => this.closeSidebar());
    document.getElementById('cartOverlay').addEventListener('click', () => this.closeSidebar());
    document.getElementById('cartSchedule').addEventListener('click', () => this.scheduleOrder());
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && document.getElementById('cartPanel')?.classList.contains('open')) {
        this.closeSidebar();
      }
    });

    document.getElementById('cartItems').addEventListener('click', (e) => {
      const removeBtn = e.target.closest('.cart-item-remove');
      if (removeBtn) {
        const index = parseInt(removeBtn.dataset.index);
        this.removeItem(index);
        return;
      }
      
      const minusBtn = e.target.closest('.qty-minus');
      if (minusBtn) {
        const index = parseInt(minusBtn.dataset.index);
        const item = this.getItems()[index];
        this.updateQuantity(index, item.quantity - 1);
        return;
      }

      const plusBtn = e.target.closest('.qty-plus');
      if (plusBtn) {
        const index = parseInt(plusBtn.dataset.index);
        const item = this.getItems()[index];
        if (item) this.updateQuantity(index, item.quantity + 1);
        return;
      }
    });

    this.updateBadge();
    this.renderSidebar();
  },

  renderSidebar() {
    const items = this.getItems();
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartSchedule = document.getElementById('cartSchedule');
    
    if (!cartItems || !cartTotal || !cartSchedule) return;

    if (items.length === 0) {
      cartItems.innerHTML = `
        <div class="cart-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:1rem;color:#b93851;"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          <p>Tu carrito está vacío</p>
          <p style="font-size: 0.85rem; color: #b93851; margin-top: 0.5rem;">Explora nuestro catálogo y personaliza tu regalo perfecto</p>
        </div>
      `;
      cartSchedule.disabled = true;
    } else {
      cartItems.innerHTML = items.map((item, index) => {
        const customization = item.customization;
        let customHTML = '';
        if (customization.phrase && !customization.luna && !customization.portrait) customHTML += `<span>✍️ "${this.escapeHTML(customization.phrase)}"</span>`;
        if (customization.song && !customization.luna && !customization.portrait) customHTML += `<span>🎵 ${this.escapeHTML(customization.song)}</span>`;
        if (customization.imageReference?.url) {
          customHTML += `<a class="cart-reference-link" href="${this.escapeHTML(customization.imageReference.url)}" target="_blank" rel="noopener noreferrer">🖼️ Imagen: ${this.escapeHTML(customization.imageReference.name)}</a>`;
        } else if (customization.uploadedImageName) {
          customHTML += `<span>📸 Imagen: ${this.escapeHTML(customization.uploadedImageName)}</span>`;
        }
        if (customization.audioReference?.url) {
          customHTML += `<a class="cart-reference-link" href="${this.escapeHTML(customization.audioReference.url)}" target="_blank" rel="noopener noreferrer">🎵 Audio: ${this.escapeHTML(customization.audioReference.name)}</a>`;
        }
        const cristalLove = customization.cristalLove;
        if (cristalLove) {
          customHTML += `<span>Variante: ${this.escapeHTML(cristalLove.variant)}</span>`;
          (Array.isArray(cristalLove.photos) ? cristalLove.photos : []).forEach((photo, photoIndex) => {
            if (photo?.url) {
              customHTML += `<a class="cart-reference-link" href="${this.escapeHTML(photo.url)}" target="_blank" rel="noopener noreferrer">Foto ${photoIndex + 1}: ${this.escapeHTML(photo.name)}</a>`;
            }
          });
          if (cristalLove.messageOption?.phrase) {
            customHTML += `<span>Mensaje: ${this.escapeHTML(cristalLove.messageOption.label)} · ${this.escapeHTML(cristalLove.messageOption.phrase)}</span>`;
          } else if (cristalLove.messageOption?.label) {
            customHTML += `<span>Mensaje: ${this.escapeHTML(cristalLove.messageOption.label)}</span>`;
          }
          if (cristalLove.dedication) customHTML += `<span class="cart-cristal-detail">Dedicatoria: ${this.escapeHTML(cristalLove.dedication)}</span>`;
          if (cristalLove.baseColor?.label) customHTML += `<span>Base: ${this.escapeHTML(cristalLove.baseColor.label)}</span>`;
          if (cristalLove.includedBenefit?.item && cristalLove.includedBenefit.cost === 0) {
            customHTML += `<span>Incluido sin costo adicional: ${this.escapeHTML(cristalLove.includedBenefit.item)}</span>`;
          }
          if (cristalLove.complement?.label) {
            customHTML += `<span>Complemento sin costo: ${this.escapeHTML(cristalLove.complement.label)}</span>`;
            const lovePhrase = cristalLove.complement.phrase;
            if (lovePhrase?.mode === 'predeterminada') {
              customHTML += `<span>Frase Love: Opción ${this.escapeHTML(lovePhrase.option)} (frase pendiente de definir)</span>`;
            } else if (lovePhrase?.mode === 'personalizada' && lovePhrase.text) {
              customHTML += `<span class="cart-cristal-detail">Frase Love: ${this.escapeHTML(lovePhrase.text)}</span>`;
            }
          }
        }
        const luna = customization.luna;
        if (luna) {
          customHTML += `<span>Talla: ${this.escapeHTML(luna.sizeLabel)}</span>`;
          (Array.isArray(luna.photos) ? luna.photos : []).forEach((photo, photoIndex) => {
            if (photo?.url) {
              customHTML += `<a class="cart-reference-link" href="${this.escapeHTML(photo.url)}" target="_blank" rel="noopener noreferrer">Foto ${photoIndex + 1}: ${this.escapeHTML(photo.name)}</a>`;
            }
          });
          if (luna.qr?.option === 'audio') customHTML += '<span>QR: Audio o latido del corazón</span>';
          if (luna.qr?.option === 'song-link' && luna.qr.songLink) {
            customHTML += `<span>QR: ${this.escapeHTML(luna.qr.songLink)}</span>`;
          }
          if (luna.qr?.option === 'song' && luna.qr.song) {
            customHTML += `<span>Canción: ${this.escapeHTML(luna.qr.song)}</span>`;
          }
          if (luna.dedication) customHTML += `<span>Dedicatoria grabada: ${this.escapeHTML(luna.dedication)}</span>`;
          if (luna.base?.added) {
            const baseDescription = luna.base.included
              ? 'Base personalizada incluida'
              : `Base personalizada +$${luna.base.addonPrice.toLocaleString('es-CO')} COP`;
            customHTML += `<span>${this.escapeHTML(baseDescription)}</span>`;
            if (luna.base.text) customHTML += `<span>Texto de la base: ${this.escapeHTML(luna.base.text)}</span>`;
          }
          if (luna.printedCard?.from) customHTML += `<span>De: ${this.escapeHTML(luna.printedCard.from)}</span>`;
          if (luna.printedCard?.to) customHTML += `<span>Para: ${this.escapeHTML(luna.printedCard.to)}</span>`;
        }
        const portrait = customization.portrait;
        if (portrait) {
          (Array.isArray(portrait.photos) ? portrait.photos : []).forEach((photo, photoIndex) => {
            if (photo?.url) {
              customHTML += `<a class="cart-reference-link" href="${this.escapeHTML(photo.url)}" target="_blank" rel="noopener noreferrer">Foto ${photoIndex + 1}: ${this.escapeHTML(photo.name)}</a>`;
            }
          });
          if (portrait.song?.mode === 'name-or-link') customHTML += `<span>Canción: ${this.escapeHTML(portrait.song.value)}</span>`;
          if (portrait.song?.mode === 'link') customHTML += `<span>Enlace de la canción: ${this.escapeHTML(portrait.song.value)}</span>`;
          if (portrait.song?.mode === 'audio') customHTML += '<span>Canción: archivo de audio adjunto</span>';
          if (portrait.names?.first) customHTML += `<span>Nombres: ${this.escapeHTML(portrait.names.first)} y ${this.escapeHTML(portrait.names.second)}</span>`;
          if (portrait.anniversaryDate) customHTML += `<span>Fecha: ${this.escapeHTML(portrait.anniversaryDate)}</span>`;
          if (portrait.dedication?.text) {
            const dedicationLabel = portrait.dedication.type === 'grabada' ? 'Dedicatoria grabada' : 'Dedicatoria impresa';
            customHTML += `<span>${dedicationLabel}: ${this.escapeHTML(portrait.dedication.text)}</span>`;
          }
          if (portrait.card?.message) customHTML += `<span>Mensaje para tarjeta impresa: ${this.escapeHTML(portrait.card.message)}</span>`;
          else {
            if (portrait.card?.from) customHTML += `<span>De: ${this.escapeHTML(portrait.card.from)}</span>`;
            if (portrait.card?.to) customHTML += `<span>Para: ${this.escapeHTML(portrait.card.to)}</span>`;
          }
          if (portrait.includedBenefit?.label && portrait.includedBenefit.cost === 0) {
            customHTML += `<span>Incluido sin costo: ${this.escapeHTML(portrait.includedBenefit.label)}</span>`;
          }
        }
        const shipping = customization.shipping;
        if (shipping) {
          customHTML += '<span class="cart-shipping-detail"><strong>Datos de envío</strong></span>';
          if (shipping.fullName) customHTML += `<span class="cart-shipping-detail">Destinatario: ${this.escapeHTML(shipping.fullName)}</span>`;
          if (shipping.address) customHTML += `<span class="cart-shipping-detail">Dirección: ${this.escapeHTML(shipping.address)}</span>`;
          if (shipping.neighborhood) customHTML += `<span class="cart-shipping-detail">Barrio: ${this.escapeHTML(shipping.neighborhood)}</span>`;
          if (shipping.city) customHTML += `<span class="cart-shipping-detail">Ciudad: ${this.escapeHTML(shipping.city)}</span>`;
          if (shipping.phone) customHTML += `<span class="cart-shipping-detail">Teléfono: ${this.escapeHTML(shipping.phone)}</span>`;
          if (shipping.additionalDetails) customHTML += `<span class="cart-shipping-detail">Detalles adicionales: ${this.escapeHTML(shipping.additionalDetails)}</span>`;
        }

        return `
          <div class="cart-item">
            <div class="cart-item-image"><img src="${this.escapeHTML(item.image)}" alt="${this.escapeHTML(item.name)}"></div>
            <div class="cart-item-details">
              <div class="cart-item-name">${this.escapeHTML(item.name)}</div>
              <div class="cart-item-custom">${customHTML}</div>
              <div class="cart-item-price">${Number.isFinite(item.price) ? window.PORTALOVERS_FORMAT_COP(item.price) : 'Precio por cotizar'}</div>
            </div>
            <div class="cart-item-actions">
              <button class="cart-item-remove" type="button" data-index="${index}" aria-label="Eliminar ${this.escapeHTML(item.name)} del carrito">&times;</button>
              <div class="cart-item-qty">
                <button class="qty-minus" type="button" data-index="${index}" aria-label="Disminuir cantidad de ${this.escapeHTML(item.name)}">−</button>
                <span>${item.quantity}</span>
                <button class="qty-plus" type="button" data-index="${index}" aria-label="Aumentar cantidad de ${this.escapeHTML(item.name)}">+</button>
              </div>
            </div>
          </div>
        `;
      }).join('');
      cartSchedule.disabled = false;
    }

    const hasPriceOnRequest = items.some(item => !Number.isFinite(item.price));
    const confirmedTotal = this.getTotal();
    cartTotal.textContent = hasPriceOnRequest
      ? confirmedTotal > 0
        ? `${window.PORTALOVERS_FORMAT_COP(confirmedTotal)} confirmados + productos por cotizar`
        : 'Precio por cotizar'
      : window.PORTALOVERS_FORMAT_COP(confirmedTotal);
  },

  openSidebar() {
    const panel = document.getElementById('cartPanel');
    const overlay = document.getElementById('cartOverlay');
    if (panel) {
      panel.classList.add('open');
      panel.setAttribute('aria-hidden', 'false');
    }
    if (overlay) overlay.classList.add('open');
    document.getElementById('cartIcon')?.setAttribute('aria-expanded', 'true');
    document.getElementById('cartClose')?.focus();
  },

  closeSidebar() {
    const panel = document.getElementById('cartPanel');
    const overlay = document.getElementById('cartOverlay');
    if (panel) {
      panel.classList.remove('open');
      panel.setAttribute('aria-hidden', 'true');
    }
    if (overlay) overlay.classList.remove('open');
    document.getElementById('cartIcon')?.setAttribute('aria-expanded', 'false');
    document.getElementById('cartIcon')?.focus();
  },

  updateBadge() {
    const badge = document.getElementById('cartBadge');
    if (!badge) return;
    const count = this.getCount();
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  },

  generateWhatsAppMessage() {
    const items = this.getItems();
    let message = '¡Hola! 🎁 Quiero agendar el siguiente pedido:\n\n';
    
    items.forEach((item, i) => {
      message += `📦 Producto ${i + 1}: ${item.name}\n`;
        message += Number.isFinite(item.price)
          ? `💰 Precio: ${window.PORTALOVERS_FORMAT_COP(item.price)}\n`
          : '💰 Precio: por cotizar\n';
      message += `🔢 Cantidad: ${item.quantity}\n`;
      
      const c = item.customization;
      if (c.imageReference?.url) message += `🖼️ Imagen de referencia: ${c.imageReference.url}\n`;
      else if (c.uploadedImageName) message += `📸 Imagen seleccionada: ${c.uploadedImageName} (sin enlace almacenado)\n`;
      if (c.audioReference?.url) message += `🎵 Audio de referencia: ${c.audioReference.url}\n`;
      if (c.phrase && !c.luna && !c.portrait) {
        message += `✍️ Frase: "${c.phrase}"\n`;
      }
      if (c.song && !c.luna && !c.portrait) {
        message += `🎵 Canción: ${c.song}\n`;
      }
      const cristalLove = c.cristalLove;
      if (cristalLove) {
        message += `🧩 Variante Cristal Love: ${cristalLove.variant} (${cristalLove.theme})\n`;
        (Array.isArray(cristalLove.photos) ? cristalLove.photos : []).forEach((photo, photoIndex) => {
          if (photo?.url) message += `📸 Fotografía ${photoIndex + 1}: ${photo.url}\n`;
        });
        if (cristalLove.messageOption?.label) {
          const messagePhrase = cristalLove.messageOption.phrase;
          message += `💌 Mensaje predeterminado: ${cristalLove.messageOption.label}${messagePhrase ? ` · ${messagePhrase}` : ''}\n`;
        }
        if (cristalLove.dedication) message += `📝 Dedicatoria de tarjeta: ${cristalLove.dedication}\n`;
        if (cristalLove.baseColor?.label) message += `🎨 Color de la base: ${cristalLove.baseColor.label}\n`;
        if (cristalLove.includedBenefit?.item && cristalLove.includedBenefit.cost === 0) {
          message += `🎁 Incluido sin costo adicional: ${cristalLove.includedBenefit.item}\n`;
        }
        if (cristalLove.complement?.id === 'vela') {
          message += '🎁 Complemento sin costo adicional: Vela de corazón tejido\n';
        } else if (cristalLove.complement?.id === 'frase-love') {
          message += '🎁 Complemento sin costo adicional: Frase Love\n';
          const lovePhrase = cristalLove.complement.phrase;
          if (lovePhrase?.mode === 'predeterminada') {
            message += `💬 Frase Love: Opción ${lovePhrase.option} (frase pendiente de definir)\n`;
          } else if (lovePhrase?.mode === 'personalizada') {
            message += `💬 Frase Love personalizada: ${lovePhrase.text}\n`;
          }
        }
      }
      const luna = c.luna;
      if (luna) {
        message += `🌙 Luna: ${luna.productName} · Talla ${luna.sizeLabel}\n`;
        (Array.isArray(luna.photos) ? luna.photos : []).forEach((photo, photoIndex) => {
          if (photo?.url) message += `📸 Foto ${photoIndex + 1}: ${photo.url}\n`;
        });
        if (luna.qr?.option === 'audio') message += '🔊 QR: Audio o latido del corazón del bebé\n';
        if (luna.qr?.option === 'song-link') message += `🔗 Enlace del QR: ${luna.qr.songLink}\n`;
        if (luna.qr?.option === 'song' && luna.qr.song) message += `🎵 Canción: ${luna.qr.song}\n`;
        if (luna.dedication) message += `✍️ Dedicatoria grabada: ${luna.dedication}\n`;
        if (luna.base?.added) {
          message += luna.base.included
            ? '🪵 Base personalizada: incluida en la talla\n'
            : `🪵 Base personalizada: $${luna.base.addonPrice.toLocaleString('es-CO')} COP x ${item.quantity} = $${(luna.base.addonPrice * item.quantity).toLocaleString('es-CO')} COP\n`;
          if (luna.base.text) message += `🖋️ Texto de la base: ${luna.base.text}\n`;
        }
        if (luna.printedCard?.from) message += `💌 De: ${luna.printedCard.from}\n`;
        if (luna.printedCard?.to) message += `💌 Para: ${luna.printedCard.to}\n`;
      }
      const portrait = c.portrait;
      if (portrait) {
        (Array.isArray(portrait.photos) ? portrait.photos : []).forEach((photo, photoIndex) => {
          if (photo?.url) message += `📸 Foto ${photoIndex + 1}: ${photo.url}\n`;
        });
        if (portrait.song?.mode === 'name-or-link') message += `🎵 Canción: ${portrait.song.value}\n`;
        if (portrait.song?.mode === 'link') message += `🔗 Enlace de la canción: ${portrait.song.value}\n`;
        if (portrait.song?.mode === 'audio') message += '🎵 Canción: archivo de audio adjunto\n';
        if (portrait.names?.first) message += `💑 Nombres: ${portrait.names.first} y ${portrait.names.second}\n`;
        if (portrait.anniversaryDate) message += `📅 Fecha: ${portrait.anniversaryDate}\n`;
        if (portrait.dedication?.text) {
          const dedicationLabel = portrait.dedication.type === 'grabada' ? 'Dedicatoria grabada' : 'Dedicatoria impresa';
          message += `✍️ ${dedicationLabel}: ${portrait.dedication.text}\n`;
        }
        if (portrait.card?.message) message += `💌 Mensaje para tarjeta impresa: ${portrait.card.message}\n`;
        else {
          if (portrait.card?.from) message += `💌 De: ${portrait.card.from}\n`;
          if (portrait.card?.to) message += `💌 Para: ${portrait.card.to}\n`;
        }
        if (portrait.includedBenefit?.label && portrait.includedBenefit.cost === 0) {
          message += `🎁 Incluido sin costo adicional: ${portrait.includedBenefit.label}\n`;
        }
      }
      const shipping = c.shipping;
      if (shipping) {
        message += '🚚 Datos de envío:\n';
        if (shipping.fullName) message += `👤 Nombre y apellido: ${shipping.fullName}\n`;
        if (shipping.address) message += `🏠 Dirección: ${shipping.address}\n`;
        if (shipping.neighborhood) message += `📍 Barrio: ${shipping.neighborhood}\n`;
        if (shipping.city) message += `🏙️ Ciudad: ${shipping.city}\n`;
        if (shipping.phone) message += `📞 Teléfono: ${shipping.phone}\n`;
        if (shipping.additionalDetails) message += `📝 Detalles adicionales: ${shipping.additionalDetails}\n`;
      }
      message += '\n';
    });
    
    const hasPriceOnRequest = items.some(item => !Number.isFinite(item.price));
    if (hasPriceOnRequest) {
      const confirmedTotal = this.getTotal();
      if (confirmedTotal > 0) message += `💰 Subtotal confirmado: ${window.PORTALOVERS_FORMAT_COP(confirmedTotal)}\n`;
      message += '💬 El precio de una o más tallas está pendiente de cotización.\n';
    } else {
      message += `💰 Total: ${window.PORTALOVERS_FORMAT_COP(this.getTotal())}\n`;
    }
    message += '¡Gracias! 🌸';
    
    return encodeURIComponent(message);
  },

  scheduleOrder() {
    const msg = this.generateWhatsAppMessage();
    window.open(`https://wa.me/${this.WA_NUMBER}?text=${msg}`, '_blank', 'noopener,noreferrer');
  }
};

document.addEventListener('DOMContentLoaded', () => Cart.init());
