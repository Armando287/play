(function() {
    function createButtons(player) {
        var playerContainer = document.querySelector('.jwplayer');
        if (!playerContainer) return;

        // Eliminar botones si ya existen
        var existingControls = document.querySelector('.center-custom-controls');
        if (existingControls) existingControls.remove();

        // Verificar si es una pantalla pequeña (móvil o tablet)
        if (window.matchMedia("(max-width: 768px)").matches) {
            console.log("Pantalla pequeña detectada, los botones de 10s no se mostrarán.");
            return; // No agregar botones en dispositivos pequeños
        }

        var centerControls = document.createElement('div');
        centerControls.className = 'center-custom-controls';
        centerControls.style.position = 'absolute';
        centerControls.style.top = '50%';
        centerControls.style.left = '50%';
        centerControls.style.transform = 'translate(-50%, -50%)';
        centerControls.style.display = 'flex';
        centerControls.style.alignItems = 'center';
        centerControls.style.justifyContent = 'center';
        centerControls.style.gap = '250px'; 
        centerControls.style.zIndex = '10';
        centerControls.style.pointerEvents = 'none';

        function createButton(className, iconUrl, isPlayButton = false) {
            var button = document.createElement('div');
            button.className = className;
            button.innerHTML = `<img src="${iconUrl}" width="50">`;
            button.style.pointerEvents = 'auto';
            button.style.cursor = 'pointer';
            button.style.display = 'flex';
            button.style.justifyContent = 'center';
            button.style.alignItems = 'center';
            button.style.transition = 'transform 0.2s ease, opacity 0.3s ease';
            button.style.opacity = '0.8';

            if (!isPlayButton) {
                button.style.background = 'rgba(0, 0, 0, 0.7)';
                button.style.borderRadius = '50%';
                button.style.padding = '15px';
                button.style.border = '2px solid rgba(255, 255, 255, 0.5)';
                button.style.backdropFilter = 'blur(5px)';

                button.addEventListener('mouseenter', function() {
                    button.style.transform = 'scale(1.2)';
                    button.style.opacity = '1';
                });

                button.addEventListener('mouseleave', function() {
                    button.style.transform = 'scale(1)';
                    button.style.opacity = '0.8';
                });
            }

            return button;
        }

        var rewindBtn = createButton('custom-rewind', 'atras.png');
        var forwardBtn = createButton('custom-forward', 'adelante.png');
        var playBtn = createButton('custom-play', 'https://huggingface.co/spaces/cinemaxx/P3L1X/resolve/main/icons8-play-100.png', true);

        // Estilos específicos para el botón de Play (sin fondo ni borde)
        playBtn.style.position = 'absolute';
        playBtn.style.top = '50%';
        playBtn.style.left = '50%';
        playBtn.style.transform = 'translate(-50%, -50%)';
        playBtn.style.zIndex = '20';
        playBtn.style.display = 'none'; // Oculto por defecto
        playBtn.style.pointerEvents = 'auto';
        playBtn.style.opacity = '1'; // Opacidad completa
        playBtn.style.transition = 'opacity 0.2s ease, transform 0.2s ease';

        function highlightButton(button) {
            button.style.background = 'rgba(0, 150, 255, 0.8)';
            button.style.border = '2px solid white';
            setTimeout(() => {
                button.style.background = 'rgba(0, 0, 0, 0.7)';
                button.style.border = '2px solid rgba(255, 255, 255, 0.5)';
            }, 300);
        }

        rewindBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            var currentTime = player.getPosition();
            player.seek(Math.max(0, currentTime - 10));
            highlightButton(rewindBtn);
        });

        forwardBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            var currentTime = player.getPosition();
            var duration = player.getDuration();
            player.seek(Math.min(duration, currentTime + 10));
            highlightButton(forwardBtn);
        });

        playBtn.addEventListener('click', function() {
            player.play();
        });

        centerControls.appendChild(rewindBtn);
        centerControls.appendChild(forwardBtn);
        playerContainer.appendChild(centerControls);
        playerContainer.appendChild(playBtn); // Agregar botón de play al contenedor

        player.on('userActive', function() {
            centerControls.style.opacity = '1';
        });

        player.on('userInactive', function() {
            centerControls.style.opacity = '0';
        });

        player.on('pause', function() {
            playBtn.style.display = 'block'; // Mostrar botón de play al pausar
            playBtn.style.transform = 'translate(-50%, -50%) scale(1.2)';
            setTimeout(() => {
                playBtn.style.transform = 'translate(-50%, -50%) scale(1)';
            }, 100);
        });

        player.on('play', function() {
            playBtn.style.display = 'none'; // Ocultar botón de play al reproducir
        });

        console.log("Botones agregados con estilo Prime Video.");
    }

    document.addEventListener("DOMContentLoaded", function() {
        var player = jwplayer();

        player.on('play', function() {
            createButtons(player);
        });
    });
})();
