
document.addEventListener("DOMContentLoaded", () => {
  // --- Обработка формы ---
  const form = document.getElementById("orderForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      const button = form.querySelector("button[type='submit']");
      if (button) {
        button.disabled = true;
        button.textContent = "Отправка...";
      }
    });
  }

  // --- Модальная галерея с доступностью ---
  const galleryItems = document.querySelectorAll('.gallery-item img');
  const modal = document.getElementById('fullscreen-modal');
  const modalImage = document.getElementById('fullscreen-image');
  const prevButton = document.getElementById('prev-image');
  const nextButton = document.getElementById('next-image');

  let currentIndex = 0;

  function openModal(index) {
    currentIndex = index;
    modalImage.src = galleryItems[currentIndex].src;
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modal.focus();
  }

  function closeModal() {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function showImage(index) {
    currentIndex = (index + galleryItems.length) % galleryItems.length;
    modalImage.style.opacity = 0;
    setTimeout(() => {
      modalImage.src = galleryItems[currentIndex].src;
      modalImage.onload = () => {
        modalImage.style.opacity = 1;
      };
    }, 200);
  }

  galleryItems.forEach((img, index) => {
    img.setAttribute("tabindex", "0"); // делаем доступным с клавиатуры
    img.addEventListener('click', () => openModal(index));
    img.addEventListener('keydown', (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(index);
      }
    });
  });

  prevButton.addEventListener('click', () => {
    showImage(currentIndex - 1);
  });

  nextButton.addEventListener('click', () => {
    showImage(currentIndex + 1);
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target === modalImage) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (modal.style.display === 'block') {
      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'ArrowLeft') {
        showImage(currentIndex - 1);
      } else if (e.key === 'ArrowRight') {
        showImage(currentIndex + 1);
      }
    }
  });
});
