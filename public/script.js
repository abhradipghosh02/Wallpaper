document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const wallpapersGrid = document.getElementById('wallpapers-grid');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const categoryBtns = document.querySelectorAll('.category-btn');
    const loadMoreBtn = document.getElementById('load-more');
    const loadingElement = document.getElementById('loading');
    const modal = document.getElementById('wallpaper-modal');
    const modalImage = document.getElementById('modal-image');
    const imageTags = document.getElementById('image-tags');
    const downloadBtn = document.getElementById('download-btn');
    const closeModal = document.getElementById('close-modal');

    // Variables
    let currentPage = 1;
    let currentQuery = 'nature';
    let isLoading = false;

    // Initialize
    fetchWallpapers(currentQuery, currentPage);

    // Event Listeners
    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            currentQuery = query;
            currentPage = 1;
            wallpapersGrid.innerHTML = '';
            fetchWallpapers(currentQuery, currentPage);
        }
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                currentQuery = query;
                currentPage = 1;
                wallpapersGrid.innerHTML = '';
                fetchWallpapers(currentQuery, currentPage);
            }
        }
    });

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            currentQuery = category;
            currentPage = 1;
            wallpapersGrid.innerHTML = '';
            
            // Update active category
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            fetchWallpapers(currentQuery, currentPage);
        });
    });

    loadMoreBtn.addEventListener('click', () => {
        currentPage++;
        fetchWallpapers(currentQuery, currentPage);
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Functions
    async function fetchWallpapers(query, page) {
        if (isLoading) return;
        
        isLoading = true;
        loadingElement.style.display = 'flex';
        loadMoreBtn.disabled = true;

        try {
            const response = await fetch(`/api/wallpapers?query=${query}&page=${page}`);
            const wallpapers = await response.json();
            
            if (page === 1) {
                wallpapersGrid.innerHTML = '';
            }
            
            if (wallpapers.length === 0 && page === 1) {
                wallpapersGrid.innerHTML = '<p class="no-results">No wallpapers found. Try a different search.</p>';
                loadMoreBtn.style.display = 'none';
            } else if (wallpapers.length < 20) {
                loadMoreBtn.style.display = 'none';
            } else {
                loadMoreBtn.style.display = 'block';
            }
            
            displayWallpapers(wallpapers);
        } catch (error) {
            console.error('Error:', error);
            wallpapersGrid.innerHTML = '<p class="error">Failed to load wallpapers. Please try again later.</p>';
        } finally {
            isLoading = false;
            loadingElement.style.display = 'none';
            loadMoreBtn.disabled = false;
        }
    }

    function displayWallpapers(wallpapers) {
        wallpapers.forEach(wallpaper => {
            const wallpaperCard = document.createElement('div');
            wallpaperCard.className = 'wallpaper-card';
            
            const img = document.createElement('img');
            img.src = wallpaper.webformatURL;
            img.alt = wallpaper.tags;
            img.loading = 'lazy';
            
            const overlay = document.createElement('div');
            overlay.className = 'wallpaper-overlay';
            overlay.innerHTML = `<p>${wallpaper.tags.split(',').slice(0, 3).join(' • ')}</p>`;
            
            wallpaperCard.appendChild(img);
            wallpaperCard.appendChild(overlay);
            
            wallpaperCard.addEventListener('click', () => {
                openModal(wallpaper);
            });
            
            wallpapersGrid.appendChild(wallpaperCard);
        });
    }

    function openModal(wallpaper) {
        modalImage.src = wallpaper.largeImageURL;
        imageTags.textContent = wallpaper.tags.split(',').join(' • ');
        downloadBtn.href = wallpaper.largeImageURL;
        downloadBtn.download = `wallpaper-${wallpaper.id}.jpg`;
        modal.style.display = 'flex';
    }
});