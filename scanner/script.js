const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const result = document.getElementById('result');
const context = canvas.getContext('2d');

// Dark mode toggle
const toggleBtn = document.getElementById('toggle-theme');
toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  toggleBtn.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
});

// Access the camera
navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
  .then(stream => {
    video.srcObject = stream;
    video.setAttribute("playsinline", true);
    requestAnimationFrame(scanFrame);
  })
  .catch(err => {
    result.textContent = "Camera access denied or not available.";
    console.error(err);
  });

function scanFrame() {
  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    canvas.hidden = false;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, canvas.width, canvas.height);

    if (code) {
      result.textContent = `Scanned: ${code.data}`;
    }
  }
  requestAnimationFrame(scanFrame);
}

// File upload QR scan
const fileInput = document.getElementById('file-upload');
fileInput.addEventListener('change', function () {
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function () {
    const img = new Image();
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, canvas.width, canvas.height);

      if (code) {
        result.value = `Scanned from image: ${code.data}`;
result.value = `Scanned from camera: ${code.data}`;
      } else {
        result.textContent = 'No QR code found in image.';
      }
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
});
