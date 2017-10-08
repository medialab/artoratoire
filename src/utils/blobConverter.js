export function dataURLtoBlob(dataurl) {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {type: mime});
}

export function blobToDataURL(blob, callback) {
  const reader = new FileReader();
  reader.onload = e => callback(e.target.result);
  reader.readAsDataURL(blob);
}

export function blobToBuffer(blob, callback) {
  const reader = new FileReader();
  reader.onload = e => callback(e.target.result);
  reader.readAsArrayBuffer(blob);
}

