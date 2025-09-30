const en = {
  language: {
    english: 'English',
    spanish: 'Spanish',
    switchLabel: 'Language switch',
  },
  toolbar: {
    start: 'Start',
    shutdown: 'Sh<underline>u</underline>t down...',
  },
  desktop: {
    apps: {
      showcase: 'My Showcase',
      oregonTrail: 'The Oregon Trail',
      doom: 'Doom',
      scrabble: 'Scrabble',
      henordle: 'Henordle',
      credits: 'Credits',
      thisComputer: 'This Computer',
    },
  },
  resume: {
    prompt: 'Looking for my resume?',
    downloadCta: 'Click here to download it!',
  },
  showcase: {
    windowTitle: 'RetroTheDev - Showcase 2022',
    windowFooter: '© Copyright 2022 X',
    nav: {
      headerLabel: "Showcase '22",
      home: 'HOME',
      about: 'ABOUT',
      experience: 'EXPERIENCE',
      projects: 'PROJECTS',
      software: 'SOFTWARE',
      music: 'MUSIC',
      art: 'ART',
      contact: 'CONTACT',
    },
    home: {
      subtitle: 'Software Engineer',
    },
    about: {
      headerTitle: 'Welcome',
      headerSubtitle: "I\'m {{name}}",
      intro: {
        paragraph1: "I'm a software engineer currently working at Vercel! In May of 2022 I graduated from Rensselaer Polytechnic Institute with my BS in Computer Science.",
        paragraph2: 'Thank you for taking the time to check out my portfolio. I really hope you enjoy exploring it as much as I enjoyed building it. If you have any questions or comments, feel free to contact me using <contactLink>this form</contactLink> or shoot me an email at <emailLink>X@gmail.com</emailLink>.',
      },
      aboutMe: {
        title: 'About Me',
        paragraph1: 'From a young age, I have had a curiosity about how things worked. This naturally led me to become absolutely obsessed with Lego and I fell in love with building things. In elementary school, I joined the Lego Robotics team at my local middle school, which was my first real exposure to programming. In 2008, my family and I moved across the country from California to New York, where I attended middle school, high school, and college.',
        figure1: '<bold>Figure 1:</bold> A real photo of me developing this website :)',
        paragraph2: 'I started programming more seriously in high school, initially learning how to scrape and interact with websites. I went on to do a ton of passion projects, many of them with one of my closest friends, <friendLink>Scott Bass</friendLink>. We worked on many projects together, including chat bots, multiple game projects, apps, and more. One of these projects is viewable on my <softwareLink>Software Projects</softwareLink> page.',
        paragraph3: 'In 2017, I got accepted into Rensselaer Polytechnic Institute to study Computer Science. It was my first choice and I was absolutely ecstatic to be going to such a great university. At the end of my sophomore year, I got an internship working for the startup Hover, primarily focusing on frontend work. I continued to work at Hover on and off for about a year and a half, until the start of my senior year when I decided to focus on other opportunities.',
      },
      hobbies: {
        title: 'My Hobbies',
        paragraph1: 'Beyond software, I have a lot of hobbies that I enjoy doing in my free time. The more tangible hobbies I have are <musicLink>Music Production</musicLink> and creating <artLink>Digital Art</artLink>. You can read more about each of these on their respective pages under my projects tab. Some other hobbies I enjoy are working out, cooking, and (unsurprisingly) playing video games.',
        paragraph2: 'In college, I was an active member in the fraternity Sigma Alpha Epsilon and held multiple positions in the chapter. I met a lot of amazing people through my fraternity and thoroughly enjoyed the community.',
        figure2: '<bold>Figure 2:</bold> Me, April 2022',
      },
      closing: {
        paragraph1: 'Thanks for reading about me! I hope that you enjoy exploring the rest of my portfolio website and everything it has to offer. If you find the easter egg make sure to let me know on Twitter <twitterLink>X</twitterLink>. Good luck and have fun!',
        paragraph2: 'If you have any questions or comments I would love to hear them. You can reach me through the <contactLink>contact page</contactLink> or shoot me an email at <emailLink>X@gmail.com</emailLink>.',
      },
    },
    projects: {
      title: 'Projects',
      subtitle: '& Hobbies',
      description: "Click on one of the areas below to check out some of my favorite projects I've done in that field. I spent a lot of time to include a lot of visuals and interactive media to showcase each project. Enjoy!",
      tiles: {
        software: {
          title: 'Software',
          subtitle: 'PROJECTS',
        },
        music: {
          title: 'Music',
          subtitle: 'VENTURES',
        },
        art: {
          title: 'Art',
          subtitle: 'ENDEAVORS',
        },
        threeD: {
          title: '3D Projects',
          subtitle: 'INTERACTIVE',
        },
      },
    },
    experience: {
      hover: {
        company: 'Hover',
        website: 'www.hover.gg',
        role: 'Frontend Engineer',
        dates: 'Summer 2020 - Fall 2021',
        description: 'Targeted towards online content creators and streamers looking to build a brand, Hover is the home of over 150K users. Written in Typescript using React, React-Native, Framer, Express, and Redux.',
        bullets: [
          'Architected and engineered the vertical scrolling discover player which, at its daily peak, was responsible for generating over 600,000 views across 20,000 active users.',
          'Designed and implemented multiple features to increase app usability and user experience while ensuring the quality, maintainability and scalability of the front end as the user base grew by over 50,000.',
          'Coordinated major refactors targeted towards app optimization and performance, eliminating redundant re-renders and API calls by over 50%.',
          'Directed and executed an internal migration of three individual repositories to a single monorepo, greatly reducing overhead for new features, bug fixes, and dependency management.',
          'Rebuilt the website with React and shared mobile app components so users could access a wide variety of interactions entirely on the web, resulting in over 700,000 total site visits.',
        ],
      },
      bracs: {
        company: 'BrACS',
        website: 'www.bracs.co',
        role: 'Team Lead & Engineer',
        dates: 'Fall 2021 - Spring 2022',
        description: 'Supervised and developed the front end of bracs.co, a beautifully simple and effective bracket creation and management engine. Built in Typescript with React and deployed via AWS Elastic Beanstalk.',
        bullets: [
          'Managed the project and team members by conducting bi-weekly stand-ups.',
          'Architected bracket view UI using React Flow and custom bracket data types built from binary trees.',
          'Created conversion algorithms to serialize bracket tree data to allow for saving in the cloud.',
          'Implemented bracket generation utilities which employ gray code for proper team seeding and placement.',
        ],
      },
      kfx: {
        company: 'K-F/X',
        website: 'www.kfxnyc.com',
        role: 'Special Effects Technician',
        dates: 'Fall 2019, Summer 2021',
        description: 'Applied problem solving and technical skills to operate rain machines, fog machines, small explosives and general rigging alongside a professional crew of 50+ people.',
        creditsTitle: 'Screen Credits:',
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
      title: 'Contact',
      intro: 'I am currently employed, however if you have any opportunities, feel free to reach out - I would love to chat! You can reach me via my personal email, or fill out the form below!',
      emailLabel: 'Email:',
      emailAddress: 'X@gmail.com',
      validationError: 'Form unable to validate, please try again.',
      success: 'Message successfully sent. Thank you {{name}}!',
      genericError: 'There was an error sending your message. Please try again.',
      resumePrompt: 'Need a copy of my Resume?',
      form: {
        nameLabel: 'Your name:',
        namePlaceholder: 'Name',
        emailLabel: 'Email:',
        emailPlaceholder: 'Email',
        companyLabel: 'Company (optional):',
        companyPlaceholder: 'Company',
        messageLabel: 'Message:',
        messagePlaceholder: 'Message',
        submit: 'Send Message',
        sending: 'Sending',
        forwardingInfo: 'All messages get forwarded straight to my personal email',
        required: 'required',
        nbsp: '\u00a0',
      },
    },
  },
  credits: {
    windowTitle: 'Credits',
    windowFooter: '© Copyright 2022 X',
    heading: 'Credits',
    subtitle: 'X.com, 2022',
    clickPrompt: 'Click to continue...',
    sections: [
      {
        title: 'Engineering & Design',
        rows: [['X', 'All']],
      },
      {
        title: 'Modeling & Texturing',
        rows: [
          ['X', 'Texturing, Composition, & UV'],
          ['Mickael Boitte', 'Computer Model'],
          ['Sean Nicolas', 'Environment Models'],
        ],
      },
      {
        title: 'Sound Design',
        rows: [
          ['X', 'Mixing, Composition, & Foley'],
          ['Sound Cassette', 'Office Ambience'],
          ['Windows 95 Startup Sound', 'Microsoft'],
        ],
      },
      {
        title: 'Special Thanks',
        rows: [
          ['Bruno Simon', 'SimonDev'],
          ['Lorelei Kravinsky', 'Scott Bass'],
          ['Trey Briccetti', 'Mom, Dad & Angela'],
        ],
      },
      {
        title: 'Inspiration',
        rows: [
          ['Bruno Simon', 'Jesse Zhou'],
          ['Pink Yellow', 'Vivek Patel'],
        ],
      },
    ],
  },
} as const;

export default en;








