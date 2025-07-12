document.addEventListener('DOMContentLoaded', () => {
    const fileUpload = document.getElementById('file-upload');
    const imagePreview = document.getElementById('image-preview');
    const form = document.getElementById('add-item-form');

    if (fileUpload && imagePreview) {
        fileUpload.addEventListener('change', (e) => {
            imagePreview.innerHTML = '';
            if (e.target.files.length > 0) {
                Array.from(e.target.files).forEach(file => {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const imgContainer = document.createElement('div');
                        imgContainer.className = 'relative';
                        const img = document.createElement('img');
                        img.src = event.target.result;
                        img.className = 'w-full h-24 object-cover rounded-md';
                        imgContainer.appendChild(img);
                        imagePreview.appendChild(imgContainer);
                    };
                    reader.readAsDataURL(file);
                });
            }
        });
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (window.showToast) {
                window.showToast('Item submitted for review!', 'success');
            } else {
                alert('Item submitted for review! (This is a demo)');
            }
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        });
    }
});
