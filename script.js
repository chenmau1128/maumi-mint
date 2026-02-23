const connectBtn = document.getElementById('connectBtn');
const mintBtn = document.getElementById('mintBtn');
const progress = document.getElementById('progressCircle');

let provider;
let signer;

connectBtn.onclick = async () => {
    if (!window.ethereum) {
        alert("請安裝 MetaMask 或其他支援的錢包！");
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
        alert("連接失敗：" + err.message);
    }
};

// 假的 mint 進度動畫（真實要接合約）
mintBtn.onclick = () => {
    let percent = 0;
    const timer = setInterval(() => {
        percent += 5;
        progress.textContent = percent + "%";
        progress.style.background = `conic-gradient(#a8e6cf ${percent}%, #333 ${percent}%)`;

        if (percent >= 100) {
            clearInterval(timer);
            alert("Mint 成功！（這是假的，之後換成真合約呼叫）");
        }
    }, 200);
};