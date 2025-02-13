document.addEventListener('DOMContentLoaded', function() {
  /* =======================================
   *          DESKTOP DRAG & DROP
   * ======================================= */
  const wardrobeContainer = document.querySelector('.wardrobe .items');
  const items = document.querySelectorAll('.item');
  const dropzones = document.querySelectorAll('.dropzone');

  let draggedItem = null;

  items.forEach(item => {
    item.addEventListener('dragstart', dragStart);
    item.addEventListener('dragend', dragEnd);
  });

  dropzones.forEach(zone => {
    zone.addEventListener('dragover', dragOver);
    zone.addEventListener('dragenter', dragEnter);
    zone.addEventListener('dragleave', dragLeave);
    zone.addEventListener('drop', dropItem);
  });

  function dragStart(e) {
    draggedItem = this;
    this.classList.add('dragging');
  }
  function dragEnd(e) {
    this.classList.remove('dragging');
  }
  function dragOver(e) {
    e.preventDefault();
  }
  function dragEnter(e) {
    e.preventDefault();
    this.classList.add('drag-over');
  }
  function dragLeave(e) {
    this.classList.remove('drag-over');
  }

  function dropItem(e) {
    e.preventDefault();
    this.classList.remove('drag-over');

    const itemType = draggedItem.getAttribute('data-type');
    const zoneType = this.getAttribute('data-type');

    if (itemType === zoneType) {
      // If an item already exists, return it to the wardrobe
      const existing = this.querySelector('img');
      if (existing) {
        wardrobeContainer.appendChild(existing);
        existing.setAttribute('draggable', 'true');
        existing.style.width = '100px';
        existing.style.height = '100px';
      }
      // Move dragged item
      this.innerHTML = '';
      this.appendChild(draggedItem);

      // Resize to fit zone
      draggedItem.style.width = '110px';
      draggedItem.style.height = '110px';
      draggedItem.style.borderRadius = '50%';
      draggedItem.setAttribute('draggable', 'false');

      checkCompleteDesktop();
    } else {
      alert("This item doesn't belong here!");
    }
  }

  function checkCompleteDesktop() {
    let complete = true;
    dropzones.forEach(zone => {
      if (!zone.querySelector('img')) {
        complete = false;
      }
    });
    if (complete) {
      showCompletionModal();
      startHeartsAnimation();
      displayRandomCompliment();
    }
  }

  // Desktop reset
  const resetButton = document.getElementById('resetButton');
  resetButton.addEventListener('click', function() {
    dropzones.forEach(zone => {
      if (zone.querySelector('img')) {
        const img = zone.querySelector('img');
        wardrobeContainer.appendChild(img);
        img.setAttribute('draggable', 'true');
        img.style.width = '100px';
        img.style.height = '100px';
        zone.innerHTML = `<p>Drop ${zone.getAttribute('data-type')} Here</p>`;
      }
    });
    hideCompletionModal();
  });


  /* =======================================
   *       MOBILE SLIDER-BASED SELECTION
   * ======================================= */

  // Arrays for each type
  const hatOptions = [
    'assets/hat1.png',
    'assets/hat2.png'
  ];
  const topOptions = [
    'assets/top1.png',
    'assets/top2.png'
  ];
  const skirtOptions = [
    'assets/skirt1.png',
    'assets/skirt2.png'
  ];

  // Current index
  let hatIndex = 0;
  let topIndex = 0;
  let skirtIndex = 0;

  // Overlapped images
  const mobileHatImg   = document.getElementById('mobileHat');
  const mobileTopImg   = document.getElementById('mobileTop');
  const mobileSkirtImg = document.getElementById('mobileSkirt');

  // Arrows & “slots”
  const hatLeft    = document.getElementById('hatLeft');
  const hatRight   = document.getElementById('hatRight');
  const topLeft    = document.getElementById('topLeft');
  const topRight   = document.getElementById('topRight');
  const skirtLeft  = document.getElementById('skirtLeft');
  const skirtRight = document.getElementById('skirtRight');

  // “Done” button
  const mobileDoneBtn = document.getElementById('mobileDoneBtn');

  // Initialize
  updateHat();
  updateTop();
  updateSkirt();

  // Hat arrows
  hatLeft.addEventListener('click', () => {
    hatIndex = (hatIndex - 1 + hatOptions.length) % hatOptions.length;
    updateHat();
  });
  hatRight.addEventListener('click', () => {
    hatIndex = (hatIndex + 1) % hatOptions.length;
    updateHat();
  });

  // Top arrows
  topLeft.addEventListener('click', () => {
    topIndex = (topIndex - 1 + topOptions.length) % topOptions.length;
    updateTop();
  });
  topRight.addEventListener('click', () => {
    topIndex = (topIndex + 1) % topOptions.length;
    updateTop();
  });

  // Skirt arrows
  skirtLeft.addEventListener('click', () => {
    skirtIndex = (skirtIndex - 1 + skirtOptions.length) % skirtOptions.length;
    updateSkirt();
  });
  skirtRight.addEventListener('click', () => {
    skirtIndex = (skirtIndex + 1) % skirtOptions.length;
    updateSkirt();
  });

  function updateHat() {
    mobileHatImg.src = hatOptions[hatIndex];
  }
  function updateTop() {
    mobileTopImg.src = topOptions[topIndex];
  }
  function updateSkirt() {
    mobileSkirtImg.src = skirtOptions[skirtIndex];
  }

  mobileDoneBtn.addEventListener('click', () => {
    // If all selected images exist, we consider it complete
    if (hatOptions[hatIndex] && topOptions[topIndex] && skirtOptions[skirtIndex]) {
      showCompletionModal();
      startHeartsAnimation();
      displayRandomCompliment();
    } else {
      alert('Please select Hat, Top, and Skirt!');
    }
  });


  /* =======================================
   *   MODAL, HEARTS, COMPLIMENTS (SHARED)
   * ======================================= */
  const completionModal = document.getElementById('completionModal');
  const closeModal = document.getElementById('closeModal');
  const completionText = document.getElementById('completionText');
  const heartWrapper = document.getElementById('heartWrapper');

  const compliments = [
    "You're absolutely radiant!",
    "SLAYYYY",
    "ATE AND LEFT NO CRUMBS",
    "BURI DHAMAA OUTFIT EH THY",
    "That's a show-stopper look!",
    "Stunning choice!",
    "Gorgeous from head to toe!"
  ];

  function showCompletionModal() {
    completionModal.classList.remove('hidden');
  }
  function hideCompletionModal() {
    completionModal.classList.add('hidden');
    // Reset appended text
    completionText.innerHTML = "Your outfit is complete! You look fantastic!";
  }

  closeModal.addEventListener('click', () => {
    hideCompletionModal();
  });
  window.addEventListener('click', (e) => {
    if (e.target === completionModal) {
      hideCompletionModal();
    }
  });

  function displayRandomCompliment() {
    const randomIndex = Math.floor(Math.random() * compliments.length);
    const msg = compliments[randomIndex];
    completionText.insertAdjacentHTML(
      'beforeend',
      `<br/><span style="font-weight: bold;">${msg}</span>`
    );
  }

  function showFloatingHearts() {
    const heart = document.createElement('div');
    heart.innerText = '♥';
    heart.style.position = 'absolute';
    heart.style.color = '#ff4d88';
    heart.style.fontSize = '2rem';
    heart.style.opacity = '0.8';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.bottom = '-50px';

    heartWrapper.appendChild(heart);

    const duration = 3000 + Math.random() * 2000; // 3-5s
    heart.animate(
      [
        { transform: 'translateY(0)',   opacity: 0.8 },
        { transform: `translateY(-${window.innerHeight}px)`, opacity: 0 }
      ],
      { duration, easing: 'ease-out' }
    );

    setTimeout(() => heart.remove(), duration);
  }

  function startHeartsAnimation() {
    heartWrapper.classList.remove('hidden');
    const intervalId = setInterval(showFloatingHearts, 400);
    setTimeout(() => {
      clearInterval(intervalId);
      setTimeout(() => {
        heartWrapper.classList.add('hidden');
      }, 3000);
    }, 5000);
  }
});