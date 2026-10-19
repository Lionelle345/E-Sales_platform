const productCatalog = [
            { id: 'linen-throw', name: 'Washed linen throw', category: 'Home', price: 68, label: 'Bestseller', detail: 'Softened flax · Oat', image: 'photo-1600210492486-724fe5c67fb0' },
            { id: 'ceramic-vase', name: 'Sunday ceramic vase', category: 'Home', price: 42, label: 'Hand-finished', detail: 'Stoneware · Chalk', image: 'photo-1578500494198-246f612d3b3d' },
            { id: 'table-lamp', name: 'Little light table lamp', category: 'Home', price: 89, label: 'New', detail: 'Brushed brass · 10 in', image: 'photo-1507473885765-e6ed057f782c' },
            { id: 'glass-set', name: 'Everyday glass set', category: 'Home', price: 36, label: 'Set of 4', detail: 'Recycled glass · Clear', image: 'photo-1513558161293-cdaf765edfd7' },
            { id: 'crossbody', name: 'Daytrip crossbody', category: 'Accessories', price: 74, label: 'Bestseller', detail: 'Soft leather · Cider', image: 'photo-1548036328-c9fa89d128fa' },
            { id: 'gold-hoops', name: 'Small gold hoops', category: 'Accessories', price: 38, label: 'Everyday favorite', detail: 'Recycled gold vermeil', image: 'photo-1535632066927-ab7c9ab60908' },
            { id: 'weekender', name: 'The easy weekender', category: 'Accessories', price: 112, label: 'Just landed', detail: 'Cotton canvas · Natural', image: 'photo-1553062407-98eeb64c6a62' },
            { id: 'silk-scarf', name: 'Printed silk scarf', category: 'Accessories', price: 52, label: 'Limited run', detail: 'Mulberry silk · Rust', image: 'photo-1601924994987-69e26d50dc26' },
            { id: 'face-oil', name: 'Daily ritual face oil', category: 'Beauty', price: 46, label: 'Plant powered', detail: '30 ml · All skin types', image: 'photo-1608248543803-ba4f8c70ae0b' },
            { id: 'hand-cream', name: 'Soft hands hand cream', category: 'Beauty', price: 24, label: 'A little treat', detail: 'Shea + oat · 75 ml', image: 'photo-1601049541289-9b1b7bbbfe19' },
            { id: 'scent-candle', name: 'Slow Sunday candle', category: 'Beauty', price: 32, label: 'Customer favorite', detail: 'Cedar + fig · 45 hr', image: 'photo-1603006905003-be475563bc59' },
            { id: 'body-wash', name: 'Daily body wash', category: 'Beauty', price: 29, label: 'Gentle formula', detail: 'Botanical blend · 250 ml', image: 'photo-1608571423902-eed4a5ad8108' },
            { id: 'journal', name: 'The good things journal', category: 'Stationery', price: 22, label: 'Made to keep', detail: 'Linen cover · 160 pages', image: 'photo-1544947950-fa07a98d237f' },
            { id: 'notecards', name: 'Little note card set', category: 'Stationery', price: 18, label: 'Set of 8', detail: 'Cotton paper · Mixed', image: 'photo-1455390582262-044c5357e0b6' },
            { id: 'desk-tray', name: 'Catch-all desk tray', category: 'Stationery', price: 34, label: 'Useful things', detail: 'Recycled leather · Clay', image: 'photo-1499951360447-b19be8fe80f5' },
            { id: 'pencils', name: 'The pencil collection', category: 'Stationery', price: 16, label: 'Set of 6', detail: 'Responsibly sourced wood', image: 'photo-1453738773917-9c3eff1db985' }
        ];
        const categories = ['All finds', 'Home', 'Accessories', 'Beauty', 'Stationery'];
        const descriptions = { 'All finds': 'Little upgrades for your everyday.', 'Home': 'Make a little room for the good stuff.', 'Accessories': 'The ones you will reach for on repeat.', 'Beauty': 'Small rituals. A softer start.', 'Stationery': 'For plans, thoughts, and everything in between.' };
        let selectedCategory = 'All finds';
        let cart = JSON.parse(localStorage.getItem('esales-cart') || '{}');
        let activeSlide = 0;
        let toastTimer;
        const productsEl = document.getElementById('products');
        const cartCountEl = document.getElementById('cartCount');
        const cartItemsEl = document.getElementById('cartItems');
        const overlay = document.getElementById('overlay');
        const cartDrawer = document.getElementById('cartDrawer');
        const loginModal = document.getElementById('loginModal');
        const money = value => `$${value.toFixed(2)}`;
        function imageUrl(image, width = 700) { return `https://images.unsplash.com/${image}?auto=format&fit=crop&w=${width}&q=82`; }
        function renderCategories() { document.getElementById('categoryTabs').innerHTML = categories.map(category => `<button class="category-tab${category === selectedCategory ? ' active' : ''}" role="tab" aria-selected="${category === selectedCategory}" data-category="${category}">${category}</button>`).join(''); }
        function renderProducts() {
            const matches = selectedCategory === 'All finds' ? productCatalog.slice(0, 8) : productCatalog.filter(product => product.category === selectedCategory);
            document.getElementById('categoryDescription').textContent = descriptions[selectedCategory];
            productsEl.innerHTML = matches.map((product, index) => `<article class="product" style="animation-delay:${index * 35}ms"><div class="product-image"><img loading="lazy" src="${imageUrl(product.image)}" alt="${product.name}" onerror="this.src='https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=700&q=80'"><span class="product-tag">${product.label}</span><button class="quick-add" data-add="${product.id}">Add to bag &nbsp; +</button></div><div class="product-info"><div class="product-title-row"><h3>${product.name}</h3><span class="product-price">${money(product.price)}</span></div><p class="product-caption">${product.detail}</p></div></article>`).join('');
        }
        function persistCart() { localStorage.setItem('esales-cart', JSON.stringify(cart)); renderCart(); }
        function cartQuantity() { return Object.values(cart).reduce((sum, quantity) => sum + quantity, 0); }
        function renderCart() {
            const quantity = cartQuantity();
            const entries = productCatalog.filter(product => cart[product.id]);
            cartCountEl.textContent = quantity;
            document.getElementById('bagItemCount').textContent = quantity ? `(${quantity})` : '';
            const subtotal = entries.reduce((sum, product) => sum + product.price * cart[product.id], 0);
            document.getElementById('cartSubtotal').textContent = money(subtotal);
            document.getElementById('shippingNote').textContent = subtotal >= 75 ? 'Your order ships free. Nice choice.' : 'You are a little way from free shipping at $75.';
            cartItemsEl.innerHTML = entries.length ? entries.map(product => `<article class="cart-line"><img src="${imageUrl(product.image, 220)}" alt="${product.name}"><div><h3>${product.name}</h3><p>${product.detail}</p><div class="quantity"><button data-quantity="${product.id}" data-delta="-1" aria-label="Remove one ${product.name}">−</button><span>${cart[product.id]}</span><button data-quantity="${product.id}" data-delta="1" aria-label="Add one ${product.name}">+</button></div></div><span class="cart-line-price">${money(product.price * cart[product.id])}</span></article>`).join('') : '<div class="cart-empty">Your bag is taking a little breather.<br><br>Find something you love and it will show up here.</div>';
        }
        function showToast(message) { const toast = document.getElementById('toast'); toast.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2200); }
        function setCategory(category) { selectedCategory = categories.includes(category) ? category : 'All finds'; renderCategories(); renderProducts(); }
        function showCart(open) { cartDrawer.classList.toggle('open', open); overlay.classList.toggle('open', open); document.body.style.overflow = open ? 'hidden' : ''; if (open) document.getElementById('closeCart').focus(); }
        function showLogin(open) { loginModal.classList.toggle('open', open); document.body.style.overflow = open ? 'hidden' : ''; if (open) document.getElementById('emailInput').focus(); }
        function setSlide(index) { const slides = [...document.querySelectorAll('.slide')]; activeSlide = (index + slides.length) % slides.length; slides.forEach((slide, i) => slide.classList.toggle('active', i === activeSlide)); document.getElementById('heroCount').textContent = `0${activeSlide + 1} / 0${slides.length}`; document.querySelectorAll('.hero-dot').forEach((dot, i) => dot.classList.toggle('active', i === activeSlide)); }
        renderCategories(); renderProducts(); renderCart();
        document.getElementById('heroDots').innerHTML = [0, 1, 2].map(index => `<button class="hero-dot${index === 0 ? ' active' : ''}" data-slide="${index}" aria-label="Go to slide ${index + 1}"></button>`).join('');
        document.getElementById('categoryTabs').addEventListener('click', event => { const tab = event.target.closest('[data-category]'); if (tab) setCategory(tab.dataset.category); });
        productsEl.addEventListener('click', event => { const button = event.target.closest('[data-add]'); if (!button) return; cart[button.dataset.add] = (cart[button.dataset.add] || 0) + 1; persistCart(); showToast('Added to your bag'); });
        cartItemsEl.addEventListener('click', event => { const button = event.target.closest('[data-quantity]'); if (!button) return; const id = button.dataset.quantity; cart[id] += Number(button.dataset.delta); if (cart[id] <= 0) delete cart[id]; persistCart(); });
        document.getElementById('cartButton').addEventListener('click', () => showCart(true));
        document.getElementById('closeCart').addEventListener('click', () => showCart(false));
        overlay.addEventListener('click', () => showCart(false));
        document.getElementById('loginButton').addEventListener('click', () => showLogin(true));
        document.getElementById('closeLogin').addEventListener('click', () => showLogin(false));
        loginModal.addEventListener('click', event => { if (event.target === loginModal) showLogin(false); });
        document.getElementById('loginForm').addEventListener('submit', event => { event.preventDefault(); const email = document.getElementById('emailInput').value.trim(); const password = document.getElementById('passwordInput').value; if (!email || password.length < 6) return; localStorage.setItem('esales-user', email); document.getElementById('loginButton').textContent = 'Hi, ' + email.split('@')[0]; document.getElementById('formMessage').textContent = 'You are signed in on this device.'; setTimeout(() => showLogin(false), 900); });
        const savedUser = localStorage.getItem('esales-user'); if (savedUser) document.getElementById('loginButton').textContent = 'Hi, ' + savedUser.split('@')[0];
        document.getElementById('previousSlide').addEventListener('click', () => setSlide(activeSlide - 1));
        document.getElementById('nextSlide').addEventListener('click', () => setSlide(activeSlide + 1));
        document.getElementById('heroDots').addEventListener('click', event => { const dot = event.target.closest('[data-slide]'); if (dot) setSlide(Number(dot.dataset.slide)); });
        document.querySelectorAll('[data-nav-category],[data-hero-category]').forEach(link => link.addEventListener('click', () => { const category = link.dataset.navCategory || link.dataset.heroCategory; if (category) setCategory(category); document.getElementById('navLinks').classList.remove('open'); }));
        document.getElementById('menuButton').addEventListener('click', () => document.getElementById('navLinks').classList.toggle('open'));
        document.getElementById('checkoutButton').addEventListener('click', () => { if (!cartQuantity()) return showToast('Your bag is empty for now'); showToast('Checkout is ready to connect to your store backend'); });
        setInterval(() => setSlide(activeSlide + 1), 6500);