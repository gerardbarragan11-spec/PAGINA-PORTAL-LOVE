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
        .map(item => ({
          ...item,
          price: Number.isFinite(item.price) ? item.price : null,
          customization: item.customization && typeof item.customization === 'object'
            ? item.customization
            : {}
        }));
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
    return this.getItems().reduce((sum, item) => sum + (Number.isFinite(item.price) ? item.price * item.quantity : 0), 0);
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
      <div class="cart-overlay" id="cartOverlay"></div>
      <div class="cart-panel" id="cartPanel">
        <div class="cart-header">
          <h3>Tu Carrito</h3>
          <button class="cart-close" id="cartClose">&times;</button>
        </div>
        <div class="cart-items" id="cartItems"></div>
        <div class="cart-footer">
          <div class="cart-total">
            <span>Total:</span>
            <span class="cart-total-price" id="cartTotal">$0</span>
          </div>
          <button class="cart-schedule" id="cartSchedule" disabled>
            📱 Agendar Pedido por WhatsApp
          </button>
        </div>
      </div>
    `;

    document.getElementById('cartClose').addEventListener('click', () => this.closeSidebar());
    document.getElementById('cartOverlay').addEventListener('click', () => this.closeSidebar());
    document.getElementById('cartSchedule').addEventListener('click', () => this.scheduleOrder());

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
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:1rem;color:#cd96a2;"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          <p>Tu carrito está vacío</p>
          <p style="font-size: 0.85rem; color: #8a6874; margin-top: 0.5rem;">Explora nuestro catálogo y personaliza tu regalo perfecto</p>
        </div>
      `;
      cartSchedule.disabled = true;
    } else {
      cartItems.innerHTML = items.map((item, index) => {
        const customization = item.customization;
        let customHTML = '';
        if (customization.phrase) customHTML += `<span>✍️ "${this.escapeHTML(customization.phrase)}"</span>`;
        if (customization.song) customHTML += `<span>🎵 ${this.escapeHTML(customization.song)}</span>`;
        if (customization.imageReference?.url) {
          customHTML += `<a class="cart-reference-link" href="${this.escapeHTML(customization.imageReference.url)}" target="_blank" rel="noopener noreferrer">🖼️ Imagen: ${this.escapeHTML(customization.imageReference.name)}</a>`;
        } else if (customization.uploadedImageName) {
          customHTML += `<span>📸 Imagen: ${this.escapeHTML(customization.uploadedImageName)}</span>`;
        }
        if (customization.audioReference?.url) {
          customHTML += `<a class="cart-reference-link" href="${this.escapeHTML(customization.audioReference.url)}" target="_blank" rel="noopener noreferrer">🎵 Audio: ${this.escapeHTML(customization.audioReference.name)}</a>`;
        }

        return `
          <div class="cart-item">
            <div class="cart-item-image"><img src="${this.escapeHTML(item.image)}" alt="${this.escapeHTML(item.name)}"></div>
            <div class="cart-item-details">
              <div class="cart-item-name">${this.escapeHTML(item.name)}</div>
              <div class="cart-item-custom">${customHTML}</div>
              <div class="cart-item-price">${Number.isFinite(item.price) ? '$' + item.price.toLocaleString('es-CO') : 'Precio por cotizar'}</div>
            </div>
            <div class="cart-item-actions">
              <button class="cart-item-remove" data-index="${index}">&times;</button>
              <div class="cart-item-qty">
                <button class="qty-minus" data-index="${index}">−</button>
                <span>${item.quantity}</span>
                <button class="qty-plus" data-index="${index}">+</button>
              </div>
            </div>
          </div>
        `;
      }).join('');
      cartSchedule.disabled = false;
    }

    const hasPriceOnRequest = items.some(item => !Number.isFinite(item.price));
    cartTotal.textContent = hasPriceOnRequest ? 'Por cotizar' : '$' + this.getTotal().toLocaleString('es-CO');
  },

  openSidebar() {
    const panel = document.getElementById('cartPanel');
    const overlay = document.getElementById('cartOverlay');
    if (panel) panel.classList.add('open');
    if (overlay) overlay.classList.add('open');
  },

  closeSidebar() {
    const panel = document.getElementById('cartPanel');
    const overlay = document.getElementById('cartOverlay');
    if (panel) panel.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
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
          ? `💰 Precio: $${item.price.toLocaleString('es-CO')}\n`
          : '💰 Precio: por cotizar\n';
      message += `🔢 Cantidad: ${item.quantity}\n`;
      
      const c = item.customization;
      if (c.imageReference?.url) message += `🖼️ Imagen de referencia: ${c.imageReference.url}\n`;
      else if (c.uploadedImageName) message += `📸 Imagen seleccionada: ${c.uploadedImageName} (sin enlace almacenado)\n`;
      if (c.audioReference?.url) message += `🎵 Audio de referencia: ${c.audioReference.url}\n`;
      if (c.phrase) {
        message += `✍️ Frase: "${c.phrase}"\n`;
      }
      if (c.song) {
        message += `🎵 Canción: ${c.song}\n`;
      }
      message += '\n';
    });
    
    const hasPriceOnRequest = items.some(item => !Number.isFinite(item.price));
    message += hasPriceOnRequest
      ? `💰 Subtotal de productos con precio: $${this.getTotal().toLocaleString('es-CO')}\n💬 Hay productos pendientes de cotización.\n`
      : `💰 Total: $${this.getTotal().toLocaleString('es-CO')}\n`;
    message += '¡Gracias! 🌸';
    
    return encodeURIComponent(message);
  },

  scheduleOrder() {
    const msg = this.generateWhatsAppMessage();
    window.open(`https://wa.me/${this.WA_NUMBER}?text=${msg}`, '_blank');
  }
};

document.addEventListener('DOMContentLoaded', () => Cart.init());
