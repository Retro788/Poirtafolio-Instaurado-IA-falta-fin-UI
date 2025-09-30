const es = {
  language: {
    english: 'Inglés',
    spanish: 'Español',
    switchLabel: 'Selector de idioma',
  },
  toolbar: {
    start: 'Inicio',
    shutdown: 'A<underline>p</underline>agar...',
  },
  desktop: {
    apps: {
      showcase: 'Mi Exhibición',
      oregonTrail: 'La Ruta de Oregón',
      doom: 'Doom',
      scrabble: 'Scrabble',
      henordle: 'Henordle',
      credits: 'Créditos',
      thisComputer: 'Este Equipo',
    },
  },
  resume: {
    prompt: '¿Buscas mi CV?',
    downloadCta: '¡Haz clic aquí para descargarlo!',
  },
  showcase: {
    windowTitle: 'RetroTheDev - Showcase 2022',
    windowFooter: '© Copyright 2022 X',
    nav: {
      headerLabel: "Muestra '22",
      home: 'INICIO',
      about: 'SOBRE MÍ',
      experience: 'EXPERIENCIA',
      projects: 'PROYECTOS',
      software: 'SOFTWARE',
      music: 'MÚSICA',
      art: 'ARTE',
      contact: 'CONTACTO',
    },
    home: {
      subtitle: 'Ingeniero de software',
    },
    about: {
      headerTitle: 'Bienvenido',
      headerSubtitle: 'Soy {{name}}',
      intro: {
        paragraph1: 'Soy ingeniero de software y actualmente trabajo en Vercel. En mayo de 2022 me gradué del Rensselaer Polytechnic Institute con una licenciatura en Ciencias de la Computación.',
        paragraph2: 'Gracias por tomarte el tiempo de revisar mi portafolio. Espero que disfrutes explorarlo tanto como yo disfruté construirlo. Si tienes preguntas o comentarios, contáctame mediante <contactLink>este formulario</contactLink> o envíame un correo a <emailLink>X@gmail.com</emailLink>.',
      },
      aboutMe: {
        title: 'Sobre mí',
        paragraph1: 'Desde pequeño sentí curiosidad por cómo funcionaban las cosas. Eso me llevó a obsesionarme con Lego y a enamorarme de construir. En primaria me uní al equipo de robótica Lego de mi escuela, que fue mi primera experiencia real con la programación. En 2008 mi familia y yo nos mudamos de California a Nueva York, donde cursé la secundaria y la universidad.',
        figure1: '<bold>Figura 1:</bold> Una foto real de mí desarrollando este sitio :)',
        paragraph2: 'Comencé a programar con mayor seriedad en la preparatoria, aprendiendo a automatizar e interactuar con sitios web. Realicé muchos proyectos personales, varios junto a uno de mis mejores amigos, <friendLink>Scott Bass</friendLink>. Trabajamos juntos en bots de chat, varios juegos, aplicaciones y más. Uno de esos proyectos puede verse en mi página de <softwareLink>Proyectos de Software</softwareLink>.',
        paragraph3: 'En 2017 fui aceptado en Rensselaer Polytechnic Institute para estudiar Ciencias de la Computación. Era mi primera opción y estaba emocionado por asistir a una gran universidad. Al final de mi segundo año obtuve una pasantía en la startup Hover, enfocándome principalmente en frontend. Continué trabajando con Hover intermitentemente durante año y medio, hasta que al iniciar mi último año decidí enfocarme en otras oportunidades.',
      },
      hobbies: {
        title: 'Mis Pasatiempos',
        paragraph1: 'Además del software tengo muchos pasatiempos que disfruto en mi tiempo libre. Entre los más tangibles están la <musicLink>Producción Musical</musicLink> y la creación de <artLink>Arte Digital</artLink>. Puedes leer más sobre cada uno en sus páginas dentro de la sección de proyectos. Otros intereses que disfruto son hacer ejercicio, cocinar y (como era de esperarse) jugar videojuegos.',
        paragraph2: 'En la universidad fui miembro activo de la fraternidad Sigma Alpha Epsilon y desempeñé varios cargos. Conocí a personas increíbles y disfruté muchísimo de la comunidad.',
        figure2: '<bold>Figura 2:</bold> Yo, abril de 2022',
      },
      closing: {
        paragraph1: '¡Gracias por leer sobre mí! Espero que disfrutes el resto de mi portafolio y todo lo que ofrece. Si encuentras el easter egg avísame en Twitter <twitterLink>X</twitterLink>. ¡Éxitos y diviértete!',
        paragraph2: 'Si tienes alguna pregunta o comentario me encantaría escucharlo. Puedes contactarme desde la <contactLink>página de contacto</contactLink> o enviarme un correo a <emailLink>X@gmail.com</emailLink>.',
      },
    },
    projects: {
      title: 'Proyectos',
      subtitle: '& Pasatiempos',
      description: 'Haz clic en alguna de las áreas para ver algunos de mis proyectos favoritos en ese campo. Dedique mucho tiempo para incluir recursos visuales e interacciones que resaltan cada trabajo. ¡Disfrútalo!',
      tiles: {
        software: {
          title: 'Software',
          subtitle: 'PROYECTOS',
        },
        music: {
          title: 'Música',
          subtitle: 'VENTURAS',
        },
        art: {
          title: 'Arte',
          subtitle: 'ESFUERZOS',
        },
        threeD: {
          title: 'Proyectos 3D',
          subtitle: 'INTERACTIVOS',
        },
      },
    },
    experience: {
      hover: {
        company: 'Hover',
        website: 'www.hover.gg',
        role: 'Frontend Engineer',
        dates: 'Verano 2020 - Otoño 2021',
        description: 'Pensada para creadores y streamers que buscan construir una marca, Hover reúne a más de 150 mil usuarios. Desarrollada en Typescript con React, React-Native, Framer, Express y Redux.',
        bullets: [
          'Diseñé y desarrollé el reproductor de descubrimiento con desplazamiento vertical que, en su pico diario, generó más de 600.000 visualizaciones entre 20.000 usuarios activos.',
          'Implementé múltiples funciones para mejorar la usabilidad y experiencia del aplicativo, asegurando la calidad, mantenibilidad y escalabilidad del frontend mientras la base de usuarios crecía en más de 50.000 personas.',
          'Coordiné grandes refactorizaciones enfocadas en optimizar el rendimiento, eliminando más del 50% de los renderizados y llamadas redundantes a la API.',
          'Dirigí y ejecuté la migración interna de tres repositorios a un único monorepo, reduciendo significativamente el esfuerzo para crear nuevas funciones, corregir errores y gestionar dependencias.',
          'Reconstruí el sitio web con React y componentes compartidos con la app móvil para que los usuarios pudieran acceder a una amplia variedad de interacciones desde la web, logrando más de 700.000 visitas totales.',
        ],
      },
      bracs: {
        company: 'BrACS',
        website: 'www.bracs.co',
        role: 'Líder de equipo e ingeniero',
        dates: 'Otoño 2021 - Primavera 2022',
        description: 'Supervisé y desarrollé el frontend de bracs.co, un motor elegante y eficaz para crear y gestionar brackets. Construido en Typescript con React y desplegado en AWS Elastic Beanstalk.',
        bullets: [
          'Gestioné el proyecto y al equipo mediante reuniones quincenales.',
          'Diseñé la interfaz del bracket con React Flow y tipos de datos personalizados basados en árboles binarios.',
          'Creé algoritmos de conversión para serializar los datos del bracket y permitir su almacenamiento en la nube.',
          'Implementé utilidades para generar brackets que emplean gray code y aseguran el seeding correcto de los equipos.',
        ],
      },
      kfx: {
        company: 'K-F/X',
        website: 'www.kfxnyc.com',
        role: 'Técnico de efectos especiales',
        dates: 'Otoño 2019, Verano 2021',
        description: 'Apliqué habilidades técnicas y de resolución de problemas para operar máquinas de lluvia y niebla, pequeños explosivos y sistemas de aparejo junto a un equipo profesional de más de 50 personas.',
        creditsTitle: 'Créditos en pantalla:',
        credits: [
          { title: '• Ray Donovan', url: 'https://www.sho.com/ray-donovan', network: 'SHOWTIME' },
          { title: '• Ray Donovan: The Movie', url: 'https://www.sho.com/titles/3508117/ray-donovan-the-movie', network: 'SHOWTIME' },
          { title: '• Hightown', url: 'https://www.starz.com/us/en/series/hightown/57463', network: 'STARZ' },
          { title: '• Bull', url: 'https://www.cbs.com/shows/bull/', network: 'CBS' },
          { title: '• At Home with Amy Sedaris', url: 'https://www.trutv.com/shows/at-home-with-amy-sedaris', network: 'truTV' },
        ],
      },
    },
    contact: {
      title: 'Contacto',
      intro: 'Actualmente estoy empleado, pero si tienes alguna oportunidad no dudes en escribirme; me encantará conversar. Puedes contactarme por mi correo personal o llenar el formulario.',
      emailLabel: 'Correo:',
      emailAddress: 'X@gmail.com',
      validationError: 'No fue posible validar el formulario, por favor intenta de nuevo.',
      success: 'Mensaje enviado con éxito. ¡Gracias {{name}}!',
      genericError: 'Hubo un error al enviar tu mensaje. Inténtalo nuevamente.',
      resumePrompt: '¿Necesitas una copia de mi CV?',
      form: {
        nameLabel: 'Tu nombre:',
        namePlaceholder: 'Nombre',
        emailLabel: 'Correo:',
        emailPlaceholder: 'Correo',
        companyLabel: 'Empresa (opcional):',
        companyPlaceholder: 'Empresa',
        messageLabel: 'Mensaje:',
        messagePlaceholder: 'Mensaje',
        submit: 'Enviar mensaje',
        sending: 'Enviando',
        forwardingInfo: 'Todos los mensajes se reenvían directamente a mi correo personal',
        required: 'obligatorio',
        nbsp: '\u00a0',
      },
    },
  },
  credits: {
    windowTitle: 'Créditos',
    windowFooter: '© Copyright 2022 X',
    heading: 'Créditos',
    subtitle: 'X.com, 2022',
    clickPrompt: 'Haz clic para continuar...',
    sections: [
      {
        title: 'Ingeniería y Diseño',
        rows: [['X', 'Todo']],
      },
      {
        title: 'Modelado y texturizado',
        rows: [
          ['X', 'Texturizado, composición y UV'],
          ['Mickael Boitte', 'Modelo de computadora'],
          ['Sean Nicolas', 'Modelos de entorno'],
        ],
      },
      {
        title: 'Diseño de sonido',
        rows: [
          ['X', 'Mezcla, composición y foley'],
          ['Sound Cassette', 'Ambiente de oficina'],
          ['Windows 95 Startup Sound', 'Microsoft'],
        ],
      },
      {
        title: 'Agradecimientos especiales',
        rows: [
          ['Bruno Simon', 'SimonDev'],
          ['Lorelei Kravinsky', 'Scott Bass'],
          ['Trey Briccetti', 'Mamá, Papá y Angela'],
        ],
      },
      {
        title: 'Inspiración',
        rows: [
          ['Bruno Simon', 'Jesse Zhou'],
          ['Pink Yellow', 'Vivek Patel'],
        ],
      },
    ],
  },
} as const;

export default es;





