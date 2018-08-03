const blake = require('blakejs');

const removeHeader = (input) => {
		return input.substring(0, 2) == "0x" ? input.substring(2) : input;
}

const hexToUint8Array = (input) => {
	const hexInput = removeHeader(input);
	const bytes = new Uint8Array(hexInput.length / 2);
	for (let i = 0; i < bytes.length; i++)
		bytes[i] = parseInt(hexInput.substr(i * 2, 2), 16);
	return bytes;
}


/// Submit input as a 0x padded hex string
const checksum = (hexInput) => {
	const input = removeHeader(hexInput).toLowerCase();
	const hashed = blake.blake2b(hexToUint8Array(hexInput), null, 32);
	console.log(byteToHexString(hashed));
	// probably a more javascript-esque way to do this
	let checksummed = "";
	for (let k = 0; k < input.length; k++) {
		const c = input.charAt(k);
		if (/\d/.test(c)) {
			checksummed += c;
			continue;
		}
		// otherwise its a alphabetical character
		checksummed += bit(hashed, k) === 0x1 ? c.toUpperCase() : c;
	}
	return checksummed;
}

const bit = (arr, index) => {
	const byteOffset = Math.floor(index / 8);
	const bitOffset = index % 8;
	const uint8 = arr[byteOffset];
	return (uint8 >> (bitOffset)) & 0x1;
}

const byteToHexString = (uint8arr) => {
  if (!uint8arr) {
    return '';
  }
  
  var hexStr = '';
  for (var i = 0; i < uint8arr.length; i++) {
    var hex = (uint8arr[i] & 0xff).toString(16);
    hex = (hex.length === 1) ? '0' + hex : hex;
    hexStr += hex;
  }
  
  return hexStr.toUpperCase();
}

const addr = "0xa08896b9366f09e5efb1fa2ed9f3820b865ae97adbc6f364d691eb17784c9b1b";
console.log(addr);
console.log(checksum(addr));