document.addEventListener("DOMContentLoaded", async () => {
    const modelId = parseInt(getModelIdFromURL());
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

    // ---- Helper Functions ----

    function getModelIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get("id");
    }

    function renderModelDetail(model) {
        const description = model.description && model.description !== "N/A"
            ? model.description
            : "No description provided for this model.";

        modelDetailContainer.innerHTML = `
            <div class="p-4 max-w-4xl mx-auto fade-in">
                <h1 class="text-3xl font-bold mb-4">${model.name}</h1>
                <img src="${model.image}" alt="${model.name}" class="w-full max-w-md mx-auto rounded-lg mb-6">
                <p class="text-lg text-gray-200 leading-relaxed mb-6">${description}</p>
                ${model.link ? `<a href="${model.link}" target="_blank" class="btn btn-primary px-6 py-2 text-lg">Visit Official Site</a>` : ""}
            </div>
        `;
    }

    function getRelatedModels(current, allModels) {
        // Example: match category and exclude the current model
        return allModels.filter(m => m.category === current.category && m.id !== current.id).slice(0, 10);
    }

    function setupCarousel(models) {
        models.forEach((model, index) => {
            const card = createModelCard(model); // from modelCard.js
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

        document.querySelector(".prev-btn")?.addEventListener("click", () => {
            currentIndex = (currentIndex - 1 + models.length) % models.length;
            updateCarousel(currentIndex);
        });

        document.querySelector(".next-btn")?.addEventListener("click", () => {
            currentIndex = (currentIndex + 1) % models.length;
            updateCarousel(currentIndex);
        });

        [...carouselDots.children].forEach(dot => {
            dot.addEventListener("click", () => {
                currentIndex = parseInt(dot.dataset.index);
                updateCarousel(currentIndex);
            });
        });

        // Mobile swipe support
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
