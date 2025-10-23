document.addEventListener("DOMContentLoaded", async () => {
    const modelId = getModelIdFromURL();
    const modelDetailContainer = document.getElementById("model-detail");
    const carouselTrack = document.getElementById("carousel-track");
    const carouselDots = document.getElementById("carousel-dots");

    const response = await fetch("models.json");
    const models = await response.json();

    const currentModel = models.find(model => model.id === modelId);
    if (!currentModel) {
        modelDetailContainer.innerHTML = "<p>Model not found.</p>";
        return;
    }

    renderModelDetail(currentModel);
    const relatedModels = getRelatedModels(currentModel, models);
    setupCarousel(relatedModels);

    // ----- Helper Functions -----

    function getModelIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get("id");
    }

    function renderModelDetail(model) {
        modelDetailContainer.innerHTML = `
            <h1>${model.name}</h1>
            <p>${model.full_description}</p>
            <!-- You can style this further using your style.css -->
        `;
    }

    function getRelatedModels(current, allModels) {
        // Example logic: match by category
        return allModels.filter(m => m.category === current.category && m.id !== current.id).slice(0, 10);
    }

    function setupCarousel(models) {
        models.forEach((model, index) => {
            const card = createModelCard(model); // From modelCard.js
            card.classList.add("carousel-item");
            carouselTrack.appendChild(card);

            const dot = document.createElement("span");
            dot.classList.add("carousel-dot");
            if (index === 0) dot.classList.add("active");
            dot.dataset.index = index;
            carouselDots.appendChild(dot);
        });

        let currentIndex = 0;
        const updateCarousel = (index) => {
            const itemWidth = carouselTrack.children[0].offsetWidth;
            carouselTrack.style.transform = `translateX(-${itemWidth * index}px)`;

            [...carouselDots.children].forEach(dot => dot.classList.remove("active"));
            if (carouselDots.children[index]) {
                carouselDots.children[index].classList.add("active");
            }
        };

        document.querySelector(".prev-btn").addEventListener("click", () => {
            currentIndex = (currentIndex - 1 + models.length) % models.length;
            updateCarousel(currentIndex);
        });

        document.querySelector(".next-btn").addEventListener("click", () => {
            currentIndex = (currentIndex + 1) % models.length;
            updateCarousel(currentIndex);
        });

        [...carouselDots.children].forEach(dot => {
            dot.addEventListener("click", () => {
                currentIndex = parseInt(dot.dataset.index);
                updateCarousel(currentIndex);
            });
        });

        // Mobile Swipe Support
        let startX = 0;
        carouselTrack.addEventListener("touchstart", e => startX = e.touches[0].clientX);
        carouselTrack.addEventListener("touchend", e => {
            const diffX = e.changedTouches[0].clientX - startX;
            if (diffX > 50) {
                currentIndex = (currentIndex - 1 + models.length) % models.length;
            } else if (diffX < -50) {
                currentIndex = (currentIndex + 1) % models.length;
            }
            updateCarousel(currentIndex);
        });
    }
});
