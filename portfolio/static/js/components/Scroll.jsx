

const Scroll = () => {
    // Indica si hay un desplazamiento automático en curso. 
    // Evita que los eventos de scroll interrumpan o vuelvan a activar 
    // otro desplazamiento mientras la animación actual está funcionando.
    const isScrolling = React.useRef(false);

    // Guarda el elemento al que nos estamos desplazando automáticamente. 
    // Inicialmente no hay ningún proyecto como destino.
    const targetProject = React.useRef(null);

    // Guarda la posición vertical anterior de la ventana. 
    // Nos permite saber si el usuario está subiendo o bajando.
    const previousScrollY = React.useRef(window.scrollY);

    React.useEffect(() => {
        // Obtiene todos los elementos con la clase "project-card". 
        // querySelectorAll devuelve una colección de elementos HTML.
        const projects = document.querySelectorAll(".project-card");

        // Inicia el desplazamiento automático hacia un proyecto.
        const startAutoScroll = (target) => {
            // Si ya hay un desplazamiento automático en curso, no iniciamos otro.
            if (isScrolling.current) return;

            // Activamos el bloqueo para evitar que otros eventos de scroll inicien otra animación al mismo tiempo.
            isScrolling.current = true;

            // Guardamos el proyecto al que nos vamos a desplazar.
            targetProject.current = target;

            // Desplaza la página suavemente hasta el proyecto indicado. 
            // block: "start" coloca el inicio del elemento en la parte superior de la ventana.
            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        };

        // Se ejecuta cada vez que cambia la posición del scroll.
        const handleScroll = () => {
            // Posición vertical actual de la ventana.
            const currentScrollY = window.scrollY;

            // Compara la posición actual con la anterior para determinar la dirección del movimiento. 
            // true significa que el usuario está bajando. 
            // false significa que está subiendo o no ha cambiado la posición.
            const scrollingDown = currentScrollY > previousScrollY.current;

            // Si el desplazamiento automático sigue activo, 
            // actualizamos la posición guardada y salimos de la función. 
            // Así evitamos que la animación se interprete como un nuevo movimiento manual del usuario.
            if (isScrolling.current) {
                previousScrollY.current = currentScrollY;
                return;
            }

            // Recorre todos los proyectos para comprobar cuál ha llegado 
            // // al punto en el que debe activarse el desplazamiento automático.
            projects.forEach((project, index) => {
                // Obtiene la posición y las dimensiones del proyecto respecto a la ventana del navegador.
                const rect = project.getBoundingClientRect();

                // Calcula la mitad de la altura visible de la ventana.
                const halfway = window.innerHeight / 2;

                // ----------------------------------------------- 
                // CASO 1: EL USUARIO ESTÁ BAJANDO // 
                // -----------------------------------------------

                if (scrollingDown) {
                    // Comprueba si la parte superior del proyecto actual ya ha superado la mitad superior de la ventana 
                    // y si todavía queda parte del proyecto visible.
                    if (rect.top <= -halfway && rect.bottom > 0) {
                        // Busca el siguiente proyecto de la colección.
                        const target = projects[index + 1];
                        // Si existe un proyecto siguiente, desplázate hasta él. 
                        // La comprobación evita intentar acceder a un elemento 
                        // que no existe al llegar al último proyecto.
                        if (target) {
                            startAutoScroll(target, index + 1);
                        }
                    }

                // ----------------------------------------------- 
                // CASO 2: EL USUARIO ESTÁ SUBIENDO 
                // -----------------------------------------------
                } else {
                    // Comprueba si la parte superior del proyecto está dentro de la mitad superior visible de la ventana.
                    if (rect.top >= 0 && rect.top < halfway) {
                        // Comprueba que existe un proyecto anterior. // En este caso, "index" identifica el proyecto 
                        // que está entrando en pantalla desde arriba.
                        const target = projects[index];

                        if (target && index > 0) {
                            // Desplázate al proyecto anterior.
                            startAutoScroll(projects[index - 1], index - 1);
                        }
                    }
                }
            });
            // Guarda la posición actual para poder compararla con la
            // siguiente posición y detectar la dirección del scroll.
            previousScrollY.current = currentScrollY;
        };

        // Se ejecuta cuando termina el desplazamiento de la página.
        const handleScrollEnd = () => {
            // Quitamos el bloqueo para permitir otro desplazamiento.
            isScrolling.current = false;
            // Ya no hay un proyecto de destino activo.
            targetProject.current = null;
        };

        // Registra los eventos para detectar el scroll y su finalización.
        window.addEventListener("scroll", handleScroll);
        window.addEventListener("scrollend", handleScrollEnd);

        return () => {
            // Limpieza del efecto: elimina los eventos cuando el componente se desmonta. 
            // Evita que queden listeners activos innecesariamente.
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("scrollend", handleScrollEnd);

        };

    }, []); // El efecto se configura al montar el componente.

    return null;
};