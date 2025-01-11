const AES_KEY = "secretkey16"; 
const DES_KEY = "secretkey8";
const HMAC_KEY = "hmacsecretkey"; 

function logResult(message) {
    const outputText = document.getElementById('outputText');
    outputText.value = message;
}

function setDecryptAlgorithm(encryptAlgorithm) {
    const decryptAlgorithmSelect = document.getElementById('decryptAlgorithm');
    decryptAlgorithmSelect.value = encryptAlgorithm;
}

function clearInputText() {
    const inputText = document.getElementById('inputText');
    inputText.value = '';
}

function pasteInputText() {
    navigator.clipboard.readText().then(text => {
        const inputText = document.getElementById('inputText');
        inputText.value = text;
    }).catch(err => {
        console.error('Failed to read clipboard contents: ', err);
    });
}

function copyOutputText() {
    const outputText = document.getElementById('outputText');
    outputText.select();
    document.execCommand('copy');
}

function encryptText() {
    const inputText = document.getElementById('inputText').value;
    const algorithm = document.getElementById('encryptAlgorithm').value;

    let encryptedText = '';
    switch (algorithm) {
        case 'aes':
            encryptedText = CryptoJS.AES.encrypt(inputText, AES_KEY).toString();
            break;
        case 'des':
            encryptedText = CryptoJS.DES.encrypt(inputText, CryptoJS.enc.Utf8.parse(DES_KEY), {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            }).toString();
            break;
        case 'hmac':
            encryptedText = CryptoJS.HmacSHA256(inputText, HMAC_KEY).toString();
            break;
        case 'base64':
            encryptedText = btoa(inputText);
            break;
        default:
            logResult('请选择一个加密算法');
            return;
    }

    logResult(encryptedText);
}

function decryptText() {
    const encryptedText = document.getElementById('inputText').value;
    const algorithm = document.getElementById('decryptAlgorithm').value;

    let decryptedText = '';
    switch (algorithm) {
        case 'aes':
            try {
                decryptedText = CryptoJS.AES.decrypt(encryptedText, AES_KEY).toString(CryptoJS.enc.Utf8);
            } catch (e) {
                decryptedText = '解密失败: ' + e.message;
            }
            break;
        case 'des':
            try {
                decryptedText = CryptoJS.DES.decrypt(encryptedText, CryptoJS.enc.Utf8.parse(DES_KEY), {
                    mode: CryptoJS.mode.ECB,
                    padding: CryptoJS.pad.Pkcs7
                }).toString(CryptoJS.enc.Utf8);
            } catch (e) {
                decryptedText = '解密失败: ' + e.message;
            }
            break;
        case 'hmac':
            decryptedText = 'HMAC不可逆，无法解密';
            break;
        case 'base64':
            try {
                decryptedText = atob(encryptedText);
            } catch (e) {
                decryptedText = '解密失败: ' + e.message;
            }
            break;
        default:
            logResult('请选择一个解密算法');
            return;
    }

    logResult(decryptedText);
}