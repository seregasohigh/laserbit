document.addEventListener('DOMContentLoaded', () => {
  const galleryItems = document.querySelectorAll('.gallery-item img');
  const modal = document.getElementById('fullscreen-modal');
  const modalImage = document.getElementById('fullscreen-image');
  const prevButton = document.getElementById('prev-image');
  const nextButton = document.getElementById('next-image');
  const form = document.getElementById('orderForm');
  const formMessage = document.getElementById('formMessage');

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
    modalImage.src = galleryItems[currentIndex].src;
  }

  galleryItems.forEach((img, index) => {
    img.addEventListener('click', () => openModal(index));
    img.addEventListener('keydown', (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(index);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (modal.style.display === 'block') {
      if (e.key === 'Escape') {
        closeModal();
      }
      else if (e.key === 'ArrowLeft') {
        showImage(currentIndex - 1);
      }
      else if (e.key === 'ArrowRight') {
        showImage(currentIndex + 1);
      }
    }
  });

  prevButton.addEventListener('click', () => showImage(currentIndex - 1));
  nextButton.addEventListener('click', () => showImage(currentIndex + 1));

  prevButton.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      showImage(currentIndex - 1);
    }
  });
  nextButton.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      showImage(currentIndex + 1);
    }
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  setInterval(() => {
    if (modal.style.display === 'block') {
      showImage(currentIndex + 1);
    }
  }, 5000);

  form.addEventListener('submit', e => {
    e.preventDefault();

    if (!form.checkValidity()) {
      formMessage.textContent = 'Пожалуйста, заполните все поля корректно.';
      formMessage.style.color = 'red';
      return;
    }

    formMessage.textContent = 'Отправка…';
    formMessage.style.color = '#fff';

    fetch(form.action, {
      method: form.method,
      headers: { 'Accept': 'application/json' },
      body: new FormData(form),
    }).then(response => {
      if (response.ok) {
        formMessage.textContent = 'Спасибо! Ваш запрос отправлен.';
        formMessage.style.color = '#27ae60';
        form.reset();
      } else {
        response.json().then(data => {
          if (data.errors) {
            formMessage.textContent = data.errors.map(e => e.message).join(", ");
          } else {
            formMessage.textContent = 'Произошла ошибка при отправке.';
          }
          formMessage.style.color = 'red';
        });
      }
    }).catch(() => {
      formMessage.textContent = 'Ошибка сети. Попробуйте позже.';
      formMessage.style.color = 'red';
    });
  });
});
