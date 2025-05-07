const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("card-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");
const addressContainer = document.getElementById("address-container");
const tipoPedidoRadios = document.querySelectorAll('input[name="tipo-pedido"]');
const pagamentoRadios = document.querySelectorAll('input[name="pagamento"]');
const trocoContainer = document.getElementById("troco-container");
const pixContainer = document.getElementById("pix-container");
const valorTroco = document.getElementById("valor-troco");
const chavePix = document.getElementById("chave-pix");

let cart = [];

tipoPedidoRadios.forEach(radio => {
    radio.addEventListener("change", function () {
        if (this.value === "entrega") {
            addressContainer.classList.remove("hidden");
        } else {
            addressContainer.classList.add("hidden");
            addressWarn.classList.add("hidden");
            addressInput.classList.remove("border-red-500");
        }
        updateCartModal(); // Atualiza o total automaticamente com ou sem taxa
    });
});

pagamentoRadios.forEach(radio => {
    radio.addEventListener("change", function () {
        if (this.value === "dinheiro") {
            trocoContainer.classList.remove("hidden");
            pixContainer.classList.add("hidden");
        } else if (this.value === "pix") {
            pixContainer.classList.remove("hidden");
            trocoContainer.classList.add("hidden");
        } else {
            trocoContainer.classList.add("hidden");
            pixContainer.classList.add("hidden");
        }
    });
});

cartBtn.addEventListener("click", function () {
    updateCartModal();
    cartModal.style.display = "flex";
});

cartModal.addEventListener("click", function (event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none";
    }
});

closeModalBtn.addEventListener("click", function () {
    cartModal.style.display = "none";
});

menu.addEventListener("click", function (event) {
    let parentButton = event.target.closest(".add-to-cart-btn");
    if (parentButton) {
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));
        addToCart(name, price);
    }
});

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    updateCartCounter();
}

function updateCartCounter() {
    let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCounter.textContent = totalItems;
}

function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;
    let totalItems = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");
        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-2">R$: ${item.price.toFixed(2)}</p>
                </div>
                <button class="remove-from-cart-btn" data-name="${item.name}">
                    Remover
                </button>
            </div>
        `;
        total += item.price * item.quantity;
        totalItems += item.quantity;
        cartItemsContainer.appendChild(cartItemElement);
    });

    const tipoPedido = document.querySelector('input[name="tipo-pedido"]:checked');
    if (tipoPedido && tipoPedido.value === "entrega") {
        total += 5;
    }

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.textContent = totalItems;
}

cartItemsContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name");
        removeItemCart(name);
    }
});

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);
    if (index !== -1) {
        const item = cart[index];
        if (item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            updateCartCounter();
            return;
        }
        cart.splice(index, 1);
        updateCartModal();
        updateCartCounter();
    }
}

addressInput.addEventListener("input", function (event) {
    if (event.target.value !== "") {
        addressInput.classList.remove("border-red-500");
    }
});

checkoutBtn.addEventListener("click", function () {
    const isOpen = checkRestauranteOpen();

    if (!isOpen) {
        Toastify({
            text: "Ops, o Restaurante está Fechado!!!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: { background: "#ef4444" },
        }).showToast();
        return;
    }

    if (cart.length === 0) return;

    const tipoPedido = document.querySelector('input[name="tipo-pedido"]:checked').value;

    if (tipoPedido === "entrega" && addressInput.value.trim() === "") {
        addressWarn.classList.remove("hidden");
        addressInput.classList.add("border-red-500");
        return;
    }

    const cartItems = cart.map(item => {
        return `• ${item.name} - Quantidade: ${item.quantity} - Preço: R$${item.price.toFixed(2)}`;
    }).join("\n");

    let totalValue = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const tipoPedidoSelecionado = document.querySelector('input[name="tipo-pedido"]:checked');
    let taxaEntregaTexto = "";
    if (tipoPedidoSelecionado && tipoPedidoSelecionado.value === "entrega") {
        totalValue += 5;
        taxaEntregaTexto = " (entrega R$ 5,00)";
    }

    const addressMessage = tipoPedido === "entrega"
        ? `Endereço: ${addressInput.value}`
        : "Pedido para retirada no local";

    const pagamentoSelecionado = document.querySelector('input[name="pagamento"]:checked');
    let pagamentoMsg = "";
    if (pagamentoSelecionado) {
        const tipoPagamento = pagamentoSelecionado.value;
        if (tipoPagamento === "dinheiro") {
            const troco = valorTroco.value.trim();
            pagamentoMsg = troco
                ? `Pagamento: Dinheiro (troco para R$ ${troco})`
                : `Pagamento: Dinheiro (sem troco)`;
        } else if (tipoPagamento === "pix") {
            pagamentoMsg = `Pagamento: Pix\nChave: ${chavePix.textContent}`;
        } else {
            pagamentoMsg = `Pagamento: Cartão de ${tipoPagamento === "debito" ? "Débito" : "Crédito"}`;
        }
    } else {
        pagamentoMsg = "Pagamento: não informado";
    }

    const totalFormatado = totalValue.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    const message = encodeURIComponent(
        `Pedido:\n${cartItems}\nTotal: ${totalFormatado}${taxaEntregaTexto}\n${addressMessage}\n${pagamentoMsg}`
    );

    const phone = "11961336586";
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

    cart = [];
    updateCartModal();
    updateCartCounter();
});

function checkRestauranteOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 9 && hora < 22;
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestauranteOpen();
spanItem.classList.toggle("bg-green-600", isOpen);
spanItem.classList.toggle("bg-red-500", !isOpen);
