const connectBtn = document.getElementById("connectBtn");
const mintBtn = document.getElementById("mintBtn");
const progress = document.getElementById("progressCircle");
const carouselImage = document.getElementById("carouselImage");
const decreaseQtyBtn = document.getElementById("decreaseQty");
const increaseQtyBtn = document.getElementById("increaseQty");
const quantityValue = document.getElementById("quantityValue");

let provider;
let signer;
let quantity = 1;
const MIN_QTY = 1;
const MAX_QTY = 10;

function updateMintButtonLabel() {
  if (!mintBtn) return;
  mintBtn.textContent = `Mint ${quantity} Now →`;
}

if (quantityValue) {
  quantityValue.textContent = quantity.toString();
  updateMintButtonLabel();
}

connectBtn.onclick = async () => {
  if (!window.ethereum) {
    alert(
      "Please install MetaMask or another Ethereum wallet extension first."
    );
    return;
  }

  try {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();

    const address = await signer.getAddress();
    connectBtn.textContent = address.slice(0, 6) + "..." + address.slice(-4);
    connectBtn.disabled = true;
    mintBtn.disabled = false;
  } catch (err) {
    console.error(err);
    alert("Failed to connect: " + err.message);
  }
};

// Simulated mint progress for demo only
mintBtn.onclick = () => {
  let percent = 0;
  const timer = setInterval(() => {
    percent += 5;
    progress.textContent = percent + "%";
    progress.style.background = `conic-gradient(#a8e6cf ${percent}%, #333 ${percent}%)`;

    if (percent >= 100) {
      clearInterval(timer);
      alert(
        `Mint complete! (Demo only, contract is not connected yet. Qty: ${quantity})`
      );
    }
  }, 200);
};

// Quantity controls
if (decreaseQtyBtn && increaseQtyBtn && quantityValue) {
  decreaseQtyBtn.onclick = () => {
    if (quantity > MIN_QTY) {
      quantity -= 1;
      quantityValue.textContent = quantity.toString();
      updateMintButtonLabel();
    }
  };

  increaseQtyBtn.onclick = () => {
    if (quantity < MAX_QTY) {
      quantity += 1;
      quantityValue.textContent = quantity.toString();
      updateMintButtonLabel();
    }
  };
}

// NFT preview carousel
if (carouselImage) {
  const carouselSources = ["輪播1.png", "輪播2.png", "輪播3.png"];
  let index = 0;
  let isTransitioning = false;

  const cycle = () => {
    if (isTransitioning) return;
    isTransitioning = true;

    carouselImage.classList.remove("fade-in");
    carouselImage.classList.add("fade-out");

    const onTransitionEnd = (event) => {
      if (event.propertyName !== "opacity") return;
      carouselImage.removeEventListener("transitionend", onTransitionEnd);

      index = (index + 1) % carouselSources.length;
      carouselImage.src = carouselSources[index];

      // force reflow so the next transition triggers correctly
      void carouselImage.offsetWidth;

      carouselImage.classList.remove("fade-out");
      carouselImage.classList.add("fade-in");
      isTransitioning = false;
    };

    carouselImage.addEventListener("transitionend", onTransitionEnd);
  };

  // start with a slight pop-in
  carouselImage.classList.add("fade-in");
  setInterval(cycle, 4000);
}
