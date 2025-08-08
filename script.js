function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}


function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}


function updateCartDisplay() {
  const cartItemsContainer = document.getElementById('cart-items');
  if (!cartItemsContainer) return;
  const cart = getCart();
  cartItemsContainer.innerHTML = '';
  let total = 0;
  let itemsCount = 0;
  cart.forEach(product => {
    total += product.price * product.quantity;
    itemsCount += product.quantity;
    // إنشاء صف جدول بدلاً من div
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${product.name}</td>
      <td>${product.price.toFixed(2)} ج.م</td>
      <td>${product.quantity}</td>
      <td>${(product.price * product.quantity).toFixed(2)} ج.م</td>
      <td><button onclick="removeFromCart('${product.id}')">حذف</button></td>
    `;
    cartItemsContainer.appendChild(row);
  });
  // تحديث ملخص الطلب
  const totalItemsEl = document.getElementById('total-items');
  const totalPriceEl = document.getElementById('total-price');
  if (totalItemsEl) totalItemsEl.textContent = itemsCount;
  if (totalPriceEl) totalPriceEl.textContent = total.toFixed(2);
}



function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
  updateCartDisplay();
}


function performSearch(query) {
  query = query.toLowerCase().trim();
  const productCards = document.querySelectorAll('.product-card');
  productCards.forEach(card => {
    const productTitle = card.querySelector('h2, h1').innerText.toLowerCase();
   
    if (productTitle.includes(query) || query === '') {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {

  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  addToCartButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      const productCard = button.closest('.product-card, .product-detail');
      const productName = productCard.querySelector('h2, h1').innerText;
      const productPriceText = productCard.querySelector('.price').innerText;
      const productPrice = parseFloat(productPriceText.replace(/[^0-9.]/g, ''));
      const productId = button.getAttribute('data-id');
      const product = { id: productId, name: productName, price: productPrice, quantity: 1 };

      let cart = getCart();
      const existingProduct = cart.find(item => item.id === productId);
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.push(product);
      }
      saveCart(cart);
      alert(`${productName} تمت إضافته إلى السلة`);
      updateCartDisplay();
    });
  });


  if (document.getElementById('cart-items')) {
    updateCartDisplay();
    // تفعيل زر إتمام الشراء في صفحة الكارت
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.onclick = function() {
        if (getCart().length === 0) {
          alert('السلة فارغة!');
          return;
        }
        // يمكنك تعديل هذه الرسالة أو تحويل المستخدم لصفحة الدفع
        alert('شكراً لطلبك! سيتم تحويلك لصفحة الدفع.');
        window.location.href = 'checkout.html';
      };
    }
  }

  
  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('تم تقديم طلبك بنجاح!');
      localStorage.removeItem('cart');
      window.location.href = 'home.html';
    });
  }

  
  const searchBtn = document.getElementById('search-btn');
  const searchInput = document.getElementById('search-input');
  
  if (searchBtn && searchInput) {
    
    searchBtn.addEventListener('click', function() {
      performSearch(searchInput.value);
    });
    
    
    searchInput.addEventListener('keyup', function() {
      performSearch(searchInput.value);
    });
  }
});