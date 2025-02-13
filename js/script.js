document.addEventListener('DOMContentLoaded', function() {
    const wardrobeContainer = document.querySelector('.wardrobe .items');
    const items = document.querySelectorAll('.item');
    const dropzones = document.querySelectorAll('.dropzone');
  
    // Modal elements
    const completionModal = document.getElementById('completionModal');
    const closeModal = document.getElementById('closeModal');
    const completionText = document.getElementById('completionText');
  
    // Hearts wrapper
    const heartWrapper = document.getElementById('heartWrapper');
  
    // Reset button
    const resetButton = document.getElementById('resetButton');
  
    // Compliments array for fun random messages
    const compliments = [
      "SLAYYYY!",
      "BURIDHAMAA OUTFIT EH THY!",
      "WEIGHT LIFTING FAIRYY",
      "You look dazzling!",
      "That's a show-stopper look!",
      "Stunning choice!",
      "Gorgeous from head to toe!"
    ];
  
    let draggedItem = null;
  
    /* ---------------------------
     *  DRAG & DROP EVENT HANDLERS
     * --------------------------- */
    items.forEach(item => {
      item.addEventListener('dragstart', dragStart);
      item.addEventListener('dragend', dragEnd);
    });
  
    dropzones.forEach(zone => {
      zone.addEventListener('dragover', dragOver);
      zone.addEventListener('dragenter', dragEnter);
      zone.addEventListener('dragleave', dragLeave);
      zone.addEventListener('drop', drop);
    });
  
    function dragStart(e) {
      draggedItem = this;
      this.classList.add('dragging');
      // Optional: Use a custom circular drag image
      // e.dataTransfer.setDragImage(createCircularDragImage(this), 50, 50);
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
  
    function drop(e) {
      e.preventDefault();
      this.classList.remove('drag-over');
      const itemType = draggedItem.getAttribute('data-type');
      const zoneType = this.getAttribute('data-type');
  
      if (itemType === zoneType) {
        // If an item already exists in this dropzone, send it back to the wardrobe
        const existing = this.querySelector('img');
        if (existing) {
          wardrobeContainer.appendChild(existing);
          existing.setAttribute('draggable', 'true');
          existing.style.width = '100px';
          existing.style.height = '100px';
        }
        // Move the dragged item into the dropzone
        this.innerHTML = ''; // Clear placeholder
        this.appendChild(draggedItem);
  
        // Resize the dropped item so it fits within the dropzone circle
        draggedItem.style.width = '110px';
        draggedItem.style.height = '110px';
        draggedItem.style.borderRadius = '50%';
  
        // Disable further dragging while in the outfit area
        draggedItem.setAttribute('draggable', 'false');
  
        checkCompleteOutfit();
      } else {
        alert("This item doesn't belong here!");
      }
    }
  
    /* ---------------------------
     *  CHECK OUTFIT COMPLETION
     * --------------------------- */
    function checkCompleteOutfit() {
      let complete = true;
      dropzones.forEach(zone => {
        if (!zone.querySelector('img')) {
          complete = false;
        }
      });
  
      if (complete) {
        // Show the modal
        showCompletionModal();
        // Trigger hearts animation
        startHeartsAnimation();
        // Show a random compliment
        displayRandomCompliment();
      }
    }
  
    /* ---------------------------
     *  MODAL HANDLING
     * --------------------------- */
    function showCompletionModal() {
      completionModal.classList.remove('hidden');
    }
  
    closeModal.addEventListener('click', () => {
      completionModal.classList.add('hidden');
    });
  
    // Clicking outside modal also closes it
    window.addEventListener('click', (e) => {
      if (e.target === completionModal) {
        completionModal.classList.add('hidden');
      }
    });
  
    /* ---------------------------
     *  HEARTS ANIMATION
     * --------------------------- */
    function showFloatingHearts() {
      // Create one heart
      const heart = document.createElement('div');
      heart.innerText = '♥';
      heart.style.position = 'absolute';
      heart.style.color = '#ff4d88';
      heart.style.fontSize = '2rem';
      heart.style.opacity = '0.8';
  
      // Random position along the width
      heart.style.left = Math.random() * 100 + '%';
      // Start at bottom and float up
      heart.style.bottom = '-50px';
  
      heartWrapper.appendChild(heart);
  
      // Animate the heart upward
      const animationDuration = 3000 + Math.random() * 2000; // 3-5 seconds
      heart.animate(
        [
          { transform: 'translateY(0)', opacity: 0.8 },
          { transform: `translateY(-${window.innerHeight}px)`, opacity: 0 }
        ],
        {
          duration: animationDuration,
          easing: 'ease-out'
        }
      );
  
      // Remove the heart from the DOM after animation ends
      setTimeout(() => {
        heart.remove();
      }, animationDuration);
    }
  
    function startHeartsAnimation() {
      heartWrapper.classList.remove('hidden');
      // Spawn hearts every 400ms for ~5 seconds
      const intervalId = setInterval(showFloatingHearts, 400);
  
      // Stop creating hearts after 5 seconds
      setTimeout(() => {
        clearInterval(intervalId);
        // Hide the wrapper after an additional delay
        setTimeout(() => {
          heartWrapper.classList.add('hidden');
        }, 3000);
      }, 5000);
    }
  
    /* ---------------------------
     *  COMPLIMENTS
     * --------------------------- */
    function displayRandomCompliment() {
      const randomIndex = Math.floor(Math.random() * compliments.length);
      const message = compliments[randomIndex];
      // Add it inside the modal text or as an alert
      completionText.insertAdjacentHTML(
        'beforeend',
        `<br/><span style="font-weight: bold;">${message}</span>`
      );
    }
  
    /* ---------------------------
     *  RESET OUTFIT
     * --------------------------- */
    resetButton.addEventListener('click', function() {
      dropzones.forEach(zone => {
        if (zone.querySelector('img')) {
          const img = zone.querySelector('img');
          wardrobeContainer.appendChild(img);
          // Reset image dimensions and make it draggable again
          img.style.width = '100px';
          img.style.height = '100px';
          img.setAttribute('draggable', 'true');
          zone.innerHTML = `<p>Drop ${zone.getAttribute('data-type')} Here</p>`;
        }
      });
  
      // Hide modal if open
      completionModal.classList.add('hidden');
      // Also clear any appended compliments from the completion text
      completionText.innerHTML = 'Your outfit is complete! You look fantastic!';
    });
  
    // (Optional) A helper function to create a circular drag image
    // Uncomment if you'd like a custom circular preview while dragging
    /*
    function createCircularDragImage(imgElement) {
      const size = Math.min(imgElement.clientWidth, imgElement.clientHeight);
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
  
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(imgElement, 0, 0, size, size);
  
      return canvas;
    }
    */
  });