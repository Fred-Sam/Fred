const buttons = document.querySelectorAll('.filter-button');
const gallery = document.getElementById('gallery');
const uploadForm = document.getElementById('upload-form');
const fileInput = document.getElementById('image-file');
const categoryInput = document.getElementById('image-category');
const titleInput = document.getElementById('image-title');
const uploadMessage = document.getElementById('upload-message');

const storageKey = 'galleryImages';
let selectedCategory = 'all';
let uploadedImages = loadStoredImages();

const builtInImages = [
  {
    id: 'builtin-1',
    title: 'Mountain Vista',
    category: 'landscape',
    src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80',
    alt: 'Mountain landscape'
  },
  {
    id: 'builtin-2',
    title: 'City Lines',
    category: 'architecture',
    src: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80',
    alt: 'Modern architecture'
  },
  {
    id: 'builtin-3',
    title: 'Seasonal Bite',
    category: 'food',
    src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80',
    alt: 'Food plate'
  },
  {
    id: 'builtin-4',
    title: 'Warm Portrait',
    category: 'portrait',
    src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
    alt: 'Portrait smiling woman'
  },
  {
    id: 'builtin-5',
    title: 'Misty Forest',
    category: 'landscape',
    src: 'https://images.unsplash.com/photo-1473187983305-f615310e7daa?auto=format&fit=crop&w=900&q=80',
    alt: 'Forest landscape'
  },
  {
    id: 'builtin-6',
    title: 'Facade Geometry',
    category: 'architecture',
    src: 'https://images.unsplash.com/photo-1531306728371-6956c67d818c?auto=format&fit=crop&w=900&q=80',
    alt: 'Historic building facade'
  }
];

buttons.forEach(button => {
  button.addEventListener('click', () => {
    selectedCategory = button.dataset.category;
    buttons.forEach(btn => btn.classList.toggle('active', btn === button));
    renderGallery();
  });
});

uploadForm.addEventListener('submit', event => {
  event.preventDefault();
  const file = fileInput.files[0];
  if (!file) {
    showUploadMessage('Please select an image file to upload.', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const image = {
      id: `upload-${Date.now()}`,
      title: titleInput.value.trim() || 'Uploaded image',
      category: categoryInput.value,
      src: reader.result,
      alt: titleInput.value.trim() || 'User uploaded image',
      uploaded: true
    };

    uploadedImages.push(image);
    saveStoredImages();
    renderGallery();
    uploadForm.reset();
    showUploadMessage('Image uploaded successfully! It will stay in your browser until you clear site data.', 'success');
  };
  reader.readAsDataURL(file);
});

function renderGallery() {
  gallery.innerHTML = '';
  const images = [...builtInImages, ...uploadedImages];
  const visibleImages = images.filter(image => selectedCategory === 'all' || image.category === selectedCategory);

  if (visibleImages.length === 0) {
    gallery.innerHTML = '<p class="empty-state">No images match this category yet. Upload your own to get started.</p>';
    return;
  }

  visibleImages.forEach(image => {
    const card = document.createElement('article');
    card.className = 'gallery-card';
    card.dataset.category = image.category;

    card.innerHTML = `
      <img src="${image.src}" alt="${image.alt}">
      ${image.uploaded ? '<button class="delete-button" type="button">Remove</button>' : ''}
      <div class="card-overlay">
        <h2>${image.title}</h2>
        <p>${capitalize(image.category)}</p>
      </div>
    `;

    if (image.uploaded) {
      card.querySelector('.delete-button').addEventListener('click', () => {
        removeUploadedImage(image.id);
      });
    }

    gallery.appendChild(card);
  });
}

function loadStoredImages() {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.warn('Failed to load stored images:', error);
    return [];
  }
}

function saveStoredImages() {
  localStorage.setItem(storageKey, JSON.stringify(uploadedImages));
}

function removeUploadedImage(id) {
  uploadedImages = uploadedImages.filter(item => item.id !== id);
  saveStoredImages();
  renderGallery();
  showUploadMessage('Image removed from your gallery.', 'info');
}

function showUploadMessage(text, type) {
  uploadMessage.textContent = text;
  uploadMessage.style.color = type === 'error' ? '#b43a3a' : type === 'info' ? '#4a5568' : '#1f7a5b';
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

renderGallery();
