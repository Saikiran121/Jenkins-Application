document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('species-container');

    async function fetchSpecies() {
        try {
            const response = await fetch('/species');
            const data = await response.json();

            renderSpecies(data);
        } catch (error) {
            console.error('Error fetching deep sea data:', error);
            container.innerHTML = `
                <div class="specie-card">
                    <h3 style="color: #ff5555">Sonar Failure</h3>
                    <p>Could not connect to the marine database.</p>
                </div>
            `;
        }
    }

    function renderSpecies(species) {
        container.innerHTML = '';

        species.forEach((s, index) => {
            const card = document.createElement('div');
            card.className = 'specie-card';
            card.style.animationDelay = `${index * 0.5}s`;

            card.innerHTML = `
                <h3>${s.name}</h3>
                <p><span class="stat-label">Discovery Depth:</span> ${s.depth}</p>
                <p><span class="stat-label">Observation:</span> ${s.status}</p>
                <p><span class="stat-label">ID:</span> #00${s.id}</p>
            `;

            container.appendChild(card);
        });
    }

    fetchSpecies();
});
