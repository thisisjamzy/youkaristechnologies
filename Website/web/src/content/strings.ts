/**
 * THE single source of every user-facing string.
 *
 * Transcribed without rewording from Website/sfm-website-build-kit/content/strings-master.md,
 * in the same order: `common`, then one key per page, then one key per section.
 * strings.test.ts checks every line of the master is here and nothing here is invented.
 *
 * Shapes:
 * - Two-tone headlines: `{ main, muted }` (main clause ink, second clause muted).
 * - Other two-part lines: `{ main, emphasis }` (the component decides how the second part is styled).
 * - Lists: arrays of objects. Text with a number from the server: functions.
 * - Keys starting with TODO are not in the master yet. Do not ship them.
 */

const placesOfTotal = "of 20 places still open";

export const strings = {
  common: {
    site: {
      name: "Strangers for Mary",
      slogan: "PASS IT ON.",
      url: "https://www.strangersformary.org",
      email: "admin@strangersformary.org",
    },

    header: {
      homeAria: "Strangers for Mary home",
      logoAlt: "Strangers for Mary",
      navAria: "Main",
      nav: {
        ourStory: "Our Story",
        pray: "Pray",
        give: "Give",
        gather: "Gather",
        buildWithUs: "Build With Us",
      },
      cta: "Join the strangers",
      // Tablets and phones (prompts/03-responsive-header-and-menu.md; built after phase 8).
      joinShort: "Join us",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      menuTitle: "Menu",
    },

    closingCard: {
      lead: "We called you here to show you what we do.",
      whatWeDo: "We pray. We give. We gather.",
      headline: "Now pass it on.",
      whatsApp: "Share on WhatsApp",
      copyLink: "Copy the link",
      linkCopied: "Link copied",
    },

    footer: {
      logoAlt: "Strangers for Mary",
      slogan: "PASS IT ON.",
      social: {
        instagramAria: "Instagram",
        whatsAppAria: "WhatsApp channel",
        emailAria: "Email us",
      },
      navAria: "Footer",
      explore: {
        title: "Explore",
        ourStory: "Our Story",
        pray: "Pray",
        give: "Give",
        gather: "Gather",
      },
      getInvolved: {
        title: "Get involved",
        join: "Join the strangers",
        buildWithUs: "Build With Us",
      },
      contact: {
        title: "Contact",
        email: "admin@strangersformary.org",
        instagram: "Instagram",
        whatsApp: "WhatsApp channel",
      },
      copyright: "© 2026 Strangers for Mary · Powered by Youkaris",
      privacyPolicy: "Privacy policy",
    },

    share: {
      afterSignup:
        "I just joined Strangers for Mary, a network of Catholics who pray a full Rosary every day for each other's intentions. Add yours, pray for someone else's, and pass it on. Be one of the first: https://www.strangersformary.org",
      fromClosingCard:
        "Strangers for Mary: a network of Catholics who pray a full Rosary every day for each other's intentions. Add yours, pray for someone else's, and pass it on. https://www.strangersformary.org",
      linkCopied: "Link copied",
    },

    /** The four core teams. Ids match src/entities/team. */
    teams: {
      strangerRelations: {
        name: "Stranger Relations",
        role: "You are the welcome",
        text: "You walk with new strangers, answer their questions, and reach out when someone misses a day, so nobody who joins is ever left alone.",
        alt: "A smiling young woman at a gathering",
      },
      outreach: {
        name: "Outreach",
        role: "You are the voice",
        text: "You tell our story on social media, through design and film, and in parishes, schools and communities, so the call reaches every Catholic who needs to hear it.",
        alt: "A young man laughing at an event",
      },
      coreAndContent: {
        name: "Core and Content",
        role: "You are the heart",
        text: "You write the prayer guides, reflections and teaching that strangers will read, always faithful to the Catechism of the Catholic Church.",
        alt: "Hands holding a rosary beside a lit candle",
      },
      technology: {
        name: "Technology",
        role: "You are the hands",
        text: "You build Youkaris and the tools behind it, so that a prayer typed in one country lands safely in another.",
        alt: "Two colleagues talking, one holding a laptop",
      },
    },

    places: {
      ofTotal: placesOfTotal,
      sentence: (left: number) => `${left} ${placesOfTotal}.`,
      sentenceWithInterview: (left: number) =>
        `${left} ${placesOfTotal}. Applicants may be invited to a short interview.`,
      complete: "All 20 places are taken. You can still join as a stranger.",
    },

    form: {
      fullName: { label: "Full name", placeholder: "First and last name" },
      baptismName: { label: "Baptism name", placeholder: "The name you were baptised with" },
      email: { label: "Email", placeholder: "you@example.com" },
      parish: { label: "Your parish", placeholder: "Parish name" },
      city: { label: "City and country", placeholder: "e.g. Lagos, Nigeria" },
      whatsApp: { label: "WhatsApp number", placeholder: "Optional, for updates" },
      about: {
        label: "Tell us about yourself",
        placeholder: "What you do, what you would love to help with and how much time you can give",
      },
      interviewNote: "Applicants may be invited to a short interview.",
      privacyNote: "We will only use your details to contact you about Strangers for Mary.",
      privacyLink: "Privacy policy",
      sending: "Sending",
      signUpSomeoneElse: "Sign up someone else",
      passItOn: "Pass it on.",
      shareOnWhatsApp: "Share on WhatsApp",
    },

    errors: {
      fullNameMissing: "Please tell us your full name.",
      baptismNameMissing: "Please add the name you were baptised with.",
      emailMissing: "Please add your email.",
      emailInvalid: "That email does not look right. Please check it.",
      parishMissing: "Please tell us your parish.",
      cityMissing: "Please add your city and country.",
      whatsAppInvalid: "That number does not look right. Include your country code, or leave it empty.",
      noChoice: "Please choose at least one: join as a stranger or apply for the core team.",
      server: "Something went wrong on our side. Please try again in a moment.",
      tooManyAttempts: "Please wait a minute and try again.",
      applicationsClosed: "All 20 places are taken. You can still join as a stranger.",
    },

    meta: {
      /** Defaults for links shared on WhatsApp, Facebook, LinkedIn and X (pages override title and description). */
      share: {
        title: "Strangers for Mary | A Rosary a day for a stranger",
        description:
          "Every day, a stranger prays a full Rosary for your intention, and you pray one for someone else. Join Catholics everywhere in the network, and be one of the first.",
        siteName: "Strangers for Mary",
        /** Also in src/app/opengraph-image.alt.txt and twitter-image.alt.txt (a test keeps them equal). */
        imageAlt:
          "Strangers for Mary. Every friend of Mary is a stranger we cannot wait to pray for, care for, and gather with. A network of Catholics around the world, linked like beads on a Rosary. Hands of strangers holding rosaries together, and a lime card reading: Mon to Sat, 1 Rosary a day, for a different stranger.",
      },
      home: {
        title: "Strangers for Mary | A Rosary a day for a stranger",
        description:
          "Every day, a stranger prays a full Rosary for your intention, and you pray one for someone else. Join Catholics everywhere in the network, and be one of the first.",
      },
      ourStory: {
        title: "Our Story | Strangers for Mary",
        description:
          "It started in 2017 with ten text messages. Why Strangers for Mary began, and why it is coming back stronger.",
      },
      pray: {
        title: "Pray | Strangers for Mary",
        description:
          "A Rosary a day for someone who can never thank you. How intentions move through the network.",
      },
      give: {
        title: "Give | Strangers for Mary",
        description:
          "Charity, one small act at a time. We give what we have worked for, to strangers waiting to receive it.",
      },
      gather: {
        title: "Gather | Strangers for Mary",
        description: "Twice a year, the strangers meet. It is always a party for our Mother.",
      },
      buildWithUs: {
        title: "Build With Us | Strangers for Mary",
        description:
          "Twenty places on the core team, one for every mystery of the Rosary. Apply for yours.",
      },
      notFound: {
        title: "This page has wandered off.",
        link: "Back to the home page",
      },
    },
  },

  home: {
    opening: {
      headline: {
        main: "Every friend of Mary is a stranger",
        muted: "we cannot wait to pray for, care for, and gather with.",
      },
      body: "Strangers for Mary is a network of Catholics around the world, linked like beads on a Rosary. We help people live out their Catholic faith every single day, out loud, alongside a community that shares the same values and the same hunger for Christ.",
      primaryCta: "Join the strangers",
      secondaryCta: "Help us build it",
      photoAlt: "Hands of different strangers holding rosaries together",
      photoCard: "Every decade is a gift from one stranger to another.",
      limeCard: {
        label: "Mon to Sat",
        value: "1 Rosary",
        caption: "a day, for a different stranger",
      },
    },

    challenge: {
      label: "The challenge",
      headline: { main: "Sunday is easy.", muted: "Monday is where we lose." },
      photoAlt: "A young man alone, looking at his phone",
      chips: ["Old habits", "Easy compromises", "A quiet drift"],
      body: [
        "You go to Mass. You sing, you pray, you mean every word. Then you walk out of the church doors and the week begins to pull: old habits, easy compromises, the quiet drift away from Christ that nobody around you seems to notice.",
        "Most of us do not stop believing. We just stop living it between Sundays. Strangers for Mary is a way back. Not a lecture and not a programme, but a daily path to Christ, walked with Mary and with strangers who are walking it too, one Rosary at a time.",
      ],
      pullLine: "A Rosary a day, prayed together, is a road back to Christ.",
    },

    whoWeAre: {
      label: "We are strangers",
      headline: { main: "Different cities.", muted: "Different languages. Different stories." },
      body: "Most of us will never stand in the same room. But every one of us has run to the same Mother, and found her already waiting.",
      closing: { main: "Whoever identifies with her,", emphasis: "identifies with us." },
    },

    difference: {
      headline: { main: "Not another", muted: "prayer group." },
      intro:
        "There are many good Christian communities. Strangers for Mary is built differently, on purpose.",
      reasons: [
        {
          n: "01",
          title: "Every day, not once a week.",
          text: "We meet you where faith is hardest: on an ordinary Tuesday, in your own room, with your own beads.",
        },
        {
          n: "02",
          title: "For someone else, not only for you.",
          text: "Each day you carry a stranger’s intention to Jesus. Somebody is counting on your Rosary, and that changes how faithfully you pray it.",
        },
        {
          n: "03",
          title: "Nobody to impress.",
          text: "Every stranger is known only by their baptism name. No status, no cliques, no performance. Just prayer.",
        },
        {
          n: "04",
          title: "A network, not a group.",
          text: "Each stranger is a bead in one long Rosary that circles the world. When one bead goes quiet, the network notices and reaches out.",
        },
        {
          n: "05",
          title: "Prayer that becomes action.",
          text: "What we pray for, we also work for, through small acts of charity for people waiting to receive them.",
        },
      ],
    },

    pray: {
      photoAlt: "A rosary passed from one hand to another",
      headline: "We pray.",
      body: "Each week, before 6 pm on Sunday, you add your intention to the many already in the network, and trust us to pass it on. Monday to Saturday, a different stranger takes their turn to pray a full Rosary for you, every single day. And every day you do the same for someone else. On Sunday, you carry one of them with you to Mass.",
      link: "See how we pray",
      numberCard: {
        label: "Every week",
        value: "6",
        caption: "strangers you pray for, a full Rosary for each.",
      },
      photoCard: "Every decade is a gift from one stranger to another.",
    },

    give: {
      headline: "We give.",
      body: "We are built on the charity of small actions. A meal. A hospital visit. A school fee. A few hours of work. Each one small, each one offered for someone waiting to receive it. And we give only what we have worked for: every campaign is carried by the effort of the strangers themselves.",
      link: "See how we give",
      photoAlt: "Volunteers helping people in a community outdoors",
      card: {
        label: "Small acts",
        line: { main: "Many small hands.", emphasis: "One real gift." },
      },
      pullLine: "Charity that costs us something is charity that means something.",
    },

    gather: {
      photoAlt: "A large crowd of young people gathered together",
      label: "Twice a year",
      headline: "We gather.",
      body: "Twice a year, the strangers meet. Not to become familiar, since a room can hold a hundred Pauls and still keep every prayer's secret, but to share the communion our prayers have made us hungry for. We pray, praise and worship together, talk honestly about what makes daily prayer hard, go deeper into the faith and break bread with the strangers we trusted to care for ours. It is always a party for our Mother.",
      link: "See how we gather",
      closing: "We arrive as strangers. We leave stronger.",
    },

    whyStrangers: {
      headline: { main: "They will never be able", muted: "to thank you." },
      body: "Your intention travels with your baptism name and nothing more. In a network with a thousand Marys and a thousand Pauls, nobody can trace a prayer back to its owner. So when you pray, you pray for someone who can never repay you. That is the point. With every decade we do what Mary did at Cana: we carry to Jesus a problem that was never ours to carry.",
    },

    ambition: {
      label: "Our ambition",
      headline: { main: "A chain of Rosaries around the world", muted: "that never breaks." },
      body: "We dream of a day when every intention shared with us is prayed for, every day, by someone who loves Mary. When no hospital bed, exam hall, empty kitchen or broken heart goes unprayed for. When a whole generation of Catholics, in every country, learns to live their faith every day because a stranger once needed them to.",
      closing: { main: "It starts with one Rosary.", emphasis: "Yours." },
    },

    buildBand: {
      headline: "Do not just join the strangers. Bring them together.",
      body: "We are building a core team of twenty people, one for every mystery of the Rosary.",
      placesCaption: placesOfTotal,
      linkAria: "Build it with us",
    },

    join: {
      headline: "Take your place in the network.",
      body: "Youkaris, our app, opens soon. Sign up today and you will be invited in on the first day, ready to add your first intention and receive your first strangers.",
      benefits: [
        {
          title: "Open to every Catholic, everywhere",
          text: "Wherever you are, there is a place in the chain for you.",
        },
        {
          title: "Known only by your baptism name",
          text: "Your full name stays private. Your intention travels with your baptism name only.",
        },
        { title: "Leave any time", text: "One click and you are off the list." },
      ],
      form: {
        choiceLegend: "I want to",
        joinAsStranger: {
          label: "Join as a stranger.",
          hint: "Invite me in the day Youkaris opens.",
        },
        applyCoreTeam: {
          label: "Apply for the core team.",
          hint: "One of 20 places, one for every mystery.",
        },
        teamsLegend: "Which team fits you?",
        submit: "Count me in",
      },
      success: {
        title: "Welcome, stranger.",
        body: "You are on the list. The day Youkaris opens, you will be among the first to know. If you applied for the core team, someone will be in touch soon.",
        prompt: "Now do what every stranger does.",
      },
    },
  },

  ourStory: {
    opening: {
      label: "Our story",
      headline: { main: "It started with", muted: "ten text messages." },
      body: "In 2017, a few young Catholics had just finished university and were working around the city of Buea. What they saw around them would not let them go.",
      photoAlt: "Three young men talking outside a university building",
    },

    whatWeSaw: {
      label: "What we saw",
      headline: "Faith that ended at the church door.",
      body: [
        "Young people went to Mass and took part with their whole hearts. They sang, they prayed, they received. Then they walked out of church and were pulled straight back into a life with little room for Christ: living together before marriage, and every small vice that draws a person a little further from Him each week.",
        "Not because they had stopped believing, but because nothing carried their faith from Sunday into Monday.",
      ],
      sunday: { photoAlt: "A priest celebrating Mass at the altar", caption: "Sunday" },
      monday: { photoAlt: "A young man laughing at a party", caption: "Monday" },
    },

    whatWeKnew: {
      pullQuote: { main: "We had seen", emphasis: "the Rosary work." },
      label: "What we knew",
      body: "We had seen it in our own lives. A Rosary prayed every day had held us close to Christ when nothing else could. Mary has never kept anyone for herself: everyone who comes close to her is handed on to her Son. So we wondered what would happen if we prayed it for each other.",
      photoAlt: "Hands holding a rosary, in black and white",
    },

    tenFriends: {
      label: "Ten friends",
      headline: `"Would you be interested in a random prayer?"`,
      body: "We sent that message to ten friends. Each would pray the Rosary for an intention that was not their own, and a stranger would pray for theirs. They said yes. They told their friends. Before long, the ten had grown into a network of hundreds.",
      photoAlt: "A young woman smiling at her phone",
      numbers: [
        { label: "2017", value: "10", caption: "text messages" },
        { label: "Before long", value: "100s", caption: "of strangers praying" },
      ],
    },

    whenItBroke: {
      label: "When it broke",
      headline: "It grew faster than we could carry it.",
      body: [
        "The simple tools we used to pass intentions around could not keep up, and they failed. Keeping the network running took more than we had, and we wrestled with the question every builder asks in the dark: who are we to lead this?",
        "The rest of the story is better told in person. Come and hear us tell it at a gathering some day.",
      ],
    },

    whyWeAreBack: {
      photoAlt: "Young men talking together in a modern office",
      label: "Why we are back",
      headline: { main: "Because the need", muted: "never went away." },
      body: "The young people we saw in 2017 are still out there, along with millions more, in every city and every language, going to Mass on Sunday and losing the fight by Monday. This time we are building it properly: Youkaris, an app made to carry intentions safely between strangers, and a core team ready to keep the chain moving.",
    },

    nameAndMark: {
      markAlt:
        "The Strangers for Mary mark: an M drawn as two forward chevrons with a small i between them",
      label: "Our name and mark",
      body: [
        `Our mark is the letter M for Mary, drawn as two chevrons moving forward. Between them stands a small "i". That "i" is you: every stranger, held in a personal friendship with the Blessed Virgin Mary, and carried forward by her.`,
        "Our slogan is three words. Everything we have, our faith, our graces, our daily bread, came to us as a gift from the goodness of the Father. We do not keep it.",
      ],
      slogan: "PASS IT ON.",
    },

    close: {
      headline: {
        main: "Our story is still being written.",
        muted: "The next chapter is the one where you take your place in the network.",
      },
      cta: "Join the strangers",
    },
  },

  pray: {
    opening: {
      label: "We pray",
      headline: { main: "A Rosary a day", muted: "for someone who can never thank you." },
      body: "Prayer is where Strangers for Mary begins, and where it always returns. Every day of the week but Sunday, beads move through the fingers of strangers, and every one of them is moving for someone else.",
      photoAlt: "Open hands holding a rosary",
      appCard: { label: "Youkaris · Today's stranger", progress: "Decade 3 of 5" },
    },

    model: {
      label: "How the exchange works",
      headline: "Your week as a stranger.",
      intro: "Six days, six strangers, a full Rosary for each. Then Mass on Sunday.",
      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      dayCaption: "A new stranger, a full Rosary",
      sunday: {
        photoAlt: "A priest celebrating Mass at the altar",
        label: "Sun · Mass",
        text: "No Rosary assigned. Offer a Mass for one of the week's intentions.",
      },
      steps: [
        {
          n: "01",
          title: "You add your intention.",
          text: "Each week, before 6 pm on Sunday, you add one intention to the many already in the network. It travels with your baptism name and nothing more.",
        },
        {
          n: "02",
          title: "We pass it on.",
          text: "We hand it to a series of strangers. Each day from Monday to Saturday, a different one takes their turn to pray a full Rosary for you.",
        },
        {
          n: "03",
          title: "You pray for six.",
          text: "Every day you receive a new stranger's intention and pray a full Rosary for it. Six days, six strangers, every week.",
        },
        {
          n: "04",
          title: "Sunday, at Mass.",
          text: "No Rosary is assigned on Sunday. Instead, you are encouraged to choose one of the week's intentions and offer a Mass for it.",
        },
        {
          n: "05",
          title: "The chain keeps moving.",
          text: "While you hold another stranger's intention, someone else is holding yours with the same care.",
        },
      ],
      pullLine: "Every decade is a gift from one stranger to another.",
      photoStripAlts: [
        "A young woman praying with folded hands",
        "A young man praying with a rosary",
        "A woman walking with a rosary in her hand",
      ],
    },

    rosaryAndHabit: {
      photoAlts: ["A wooden rosary held in a hand", "A rosary passed from one hand to another"],
      cana: {
        label: "Every decade is a little Cana",
        headline: { main: "We carry what is", muted: "not ours to carry." },
        body: [
          "At the wedding at Cana, Mary noticed a need that was not hers. The wine had run out at someone else's feast. She did not wait to be asked. She carried it to her Son, and He answered. Every decade we pray for a stranger, we do the same: we take to Jesus a problem that was never naturally ours to carry.",
          "The Rosary is simple enough for a child and deep enough for a lifetime. In it we walk with Mary through the life of her Son: his birth, his suffering, his rising, his glory. Alongside it, we keep the other Marian devotions the Church has treasured for centuries.",
        ],
      },
      neverThank: {
        label: "Why they can never thank you",
        headline: { main: "A gift with no way", muted: "back to the giver." },
        body: "Every intention carries a baptism name, but nothing that identifies the person behind it. In a network with a thousand Pauls and a thousand Marys, nobody can trace a prayer back to its owner. So the stranger you pray for can never thank you, and you never pray to be thanked. That is what keeps every gift pure.",
      },
      habit: {
        label: "Why it lasts",
        headline: { main: "A habit for every day,", muted: "not a feeling for one." },
        body: "Most of us do not stop believing. We just stop practising, one busy day at a time. A stranger waiting on your Rosary changes that. It gives every day a reason to pick up the beads, and a quiet strength against everything that pulls you away from Christ between Sundays.",
      },
    },

    ambition: {
      label: "Our ambition",
      headline: { main: "A chain of prayer around the world", muted: "that never breaks." },
      body: "We dream of a day when every intention shared with us is prayed for, every day, by someone who loves Mary. When no hospital bed, exam hall, empty kitchen or broken heart goes unprayed for. When a whole generation of Catholics, in every country, grows up knowing how to pray daily, because a stranger once needed them to.",
      closing: { main: "It starts with one Rosary.", emphasis: "Yours." },
    },

    youkaris: {
      label: "Where it happens",
      headline: { main: "Youkaris.", muted: "A home for daily prayer." },
      body: "Youkaris is the app that holds it all together. Each morning it hands you that day's stranger, keeps your place in the week and gently brings you back when life gets loud. It does not replace anything on your phone. It gives your daily prayer a home.",
      phone: {
        eyebrow: "THIS WEEK'S STRANGER",
        prompt: "Pray the Rosary for this intention today.",
        progress: "Day 3 of 6 this week",
      },
    },

    questions: {
      headline: "Questions people ask.",
      photoAlt: "A woman praying alone in a church pew",
      items: [
        {
          question: "How long does it take?",
          answer:
            "A Rosary takes about twenty minutes. Many people pray it on the way to work, before bed or with their family.",
        },
        {
          question: "What can I share as an intention?",
          answer:
            "Anything you would bring to Mary herself, kept short. Please leave out personal details and the long history of the problem, and do not name other people in full. A few honest words, offered in faith, are enough.",
        },
        {
          question: "When do I add my intention?",
          answer: "Once a week, before 6 pm on Sunday. Each stranger adds one intention per week.",
        },
        {
          question: "Will anyone know it is mine?",
          answer:
            "Your intention carries your baptism name, but nothing that identifies you. Because so many strangers share the same baptism name, nobody can tell whose intention they are holding.",
        },
        {
          question: "What if I miss a day?",
          answer:
            "Nothing bad happens. A missed day is never punished. It is flagged, so we know who might need support, and someone makes sure you get it.",
        },
      ],
    },

    close: {
      headline: "Somebody is waiting for your Rosary.",
      body: "They will never know it was you. They will never be able to thank you. They need you anyway.",
      cta: "Join the strangers",
    },

    switcher: {
      give: { title: "Next: We give.", text: "Charity, one small act at a time." },
      gather: { title: "Then: We gather.", text: "It is always a party for our Mother." },
    },
  },

  give: {
    opening: {
      label: "We give",
      headline: { main: "Charity,", muted: "one small act at a time." },
      body: "We are built on the charity of small actions. A meal shared. A hospital bill paid. A school fee covered. An afternoon spent with someone who is alone. None of it is grand. All of it is offered for a stranger waiting to receive it.",
      photoAlt: "Volunteers helping people in a community outdoors",
      photoChip: "Every gift here was worked for",
    },

    workedFor: {
      label: "Worked for, then given",
      headline: "We give what we have worked for.",
      body: [
        "Strangers for Mary does not pass a collection basket. Every campaign we run is funded by the work of the strangers themselves: things we make, sell, organise and build together. If we give a meal, someone worked for it. If we pay a hospital bill, someone laboured for it.",
        "That is what makes our charity mean something. And it means anyone can take part, whatever is in their pocket, because everyone has time and hands.",
      ],
      pullLine: "Charity that costs us something is charity that means something.",
      pullCaption: "Every small act, offered for someone waiting to receive it.",
    },

    giftTravels: {
      label: "How a gift travels",
      headline: { main: "From a stranger's need", muted: "to a stranger's door." },
      steps: [
        {
          n: "01",
          title: "A need is found.",
          text: "Through the network we hear of the sick, the poor and anyone who is struggling.",
        },
        {
          n: "02",
          title: "A campaign is set.",
          text: "The need becomes a clear goal everyone can see: what it is, who it is for and what it will take.",
        },
        {
          n: "03",
          title: "We work for it.",
          text: "Strangers take part in the activities that raise what the campaign needs, each in the way they can.",
        },
        {
          n: "04",
          title: "We carry it.",
          text: "The gift is delivered in person wherever we can, with prayer and with the respect every child of God deserves.",
        },
        {
          n: "05",
          title: "We pass it on.",
          text: "We tell the story to the whole network, so every stranger knows what their small act became.",
        },
      ],
    },

    whoWeGiveTo: {
      photoAlt: "People working through a plan together at a table",
      label: "Who we give to",
      headline: "The ones Mary would notice first.",
      body: [
        "The sick and those who care for them. Families who do not have enough. Young people who cannot afford to keep learning. Anyone carrying something too heavy to carry alone. Like Mary at Cana, we try to see the need before anyone has to ask.",
        "And we give as we pray: not to be thanked, but because they are her children too.",
      ],
    },

    ambition: {
      label: "Our ambition",
      headline: { main: "A network that can move mountains,", muted: "one pair of hands at a time." },
      body: "Imagine strangers in every country, each giving an hour of work, and all of it flowing to the same hospital ward, the same village, the same family on the same day. That is what a network of prayer can become when it learns to give. We want Strangers for Mary to be the place where Catholics everywhere turn their faith into something a stranger can touch.",
    },

    close: {
      headline: "Your hands are a gift too.",
      body: "Join the strangers, and when the first campaign opens, you will be among the first to hear and the first to help. Or join the team that builds our giving from the ground up.",
      cta: "Join the strangers",
      secondaryCta: "Build it with us",
    },

    switcher: {
      pray: { title: "Where it starts: We pray.", text: "A Rosary a day, for a different stranger." },
      gather: { title: "Next: We gather.", text: "It is always a party for our Mother." },
    },
  },

  gather: {
    opening: {
      label: "We gather",
      headline: { main: "It is always a party", muted: "for our Mother." },
      body: "For months you have prayed for strangers known to you only by a baptism name, and strangers have prayed for you. Then, twice a year, the doors open and the strangers walk in.",
      photoAlt: "A large crowd of young people gathered together",
      photoLabel: "Twice a year",
    },

    roomOfPauls: {
      headline: {
        main: "A room full of Pauls,",
        muted: "and nobody knows which one prayed for you.",
      },
      body: "Everyone in the network is known by their baptism name. Even in the same room, you will never know whose intentions you carried, or who carried yours. That is not why we gather. We gather to share the physical communion that a network of prayer makes us hunger for.",
    },

    whatHappens: {
      label: "What happens when we gather",
      headline: { main: "We pray. We talk.", muted: "We learn. We eat." },
      // The mosaic in reading order: photo and text tiles alternate.
      tiles: [
        { kind: "photo", alt: "A congregation in worship" },
        {
          kind: "text",
          title: "We pray, praise and worship.",
          text: "The beads we have held alone all season are finally held side by side. We sing loud, we fall quiet before the Lord, and we remember who all of this has been for.",
        },
        { kind: "photo", alt: "People talking together around a table of food" },
        {
          kind: "text",
          title: "We tell the truth about prayer.",
          text: "We talk honestly about the weeks we struggled and the weeks we thrived: what stopped us praying, what helped us keep going, and what we will do differently.",
        },
        {
          kind: "text",
          title: "We go deeper into the faith.",
          text: "We take time to strengthen our understanding of what the Church teaches, so the faith we pray every day is a faith we understand.",
        },
        { kind: "photo", alt: "Young people smiling together in church" },
        {
          kind: "text",
          title: "We break bread.",
          text: "Then the tables fill, and we share a meal with the strangers we trusted to care for our faith.",
        },
        { kind: "photo", alt: "Guests talking at a dinner table" },
      ],
    },

    whyWeGather: {
      label: "Why we gather",
      headline: "This is what keeps us praying.",
      body: "Every gathering is built around one practical question: what stops us from praying every day, and how do we overcome it together? We leave with honest stories, habits that work and fresh strength for the next six months of the Rosary.",
      closing: { main: "We arrive as strangers.", emphasis: "We leave stronger." },
    },

    howOften: {
      number: "2",
      headline: "Twice a year, the strangers meet.",
      body: "Every six months, Strangers for Mary comes together in person. Some gatherings are also held for a stranger's need, when the network rallies around someone waiting to receive help. Dates and places are announced as each gathering is set, and every stranger who signs up hears first.",
    },

    lookForward: {
      label: "Something to look forward to",
      headline: { main: "A date every stranger", muted: "circles on the calendar." },
      body: "We are not starting a new church or a new parish; our home is the parish you already belong to. A gathering is a one-time occasion, a celebration our Mother hosts twice a year, that strangers can look forward to, plan for and bring their hunger to.",
    },

    close: {
      headline: { main: "Save a seat.", muted: "Better still, save two." },
      body: "Join the strangers today, and bring someone with you to the first gathering.",
      cta: "Join the strangers",
    },

    switcher: {
      pray: { title: "Where it starts: We pray.", text: "A Rosary a day, for a different stranger." },
      give: { title: "And between: We give.", text: "Charity, one small act at a time." },
    },
  },

  buildWithUs: {
    opening: {
      label: "Build with us",
      headline: { main: "Someone has to bring the strangers together.", muted: "Why not you?" },
      body: "Every stranger who prays will one day stand on something built by someone else: an app that works, a welcome that feels warm, a message that reached them at the right moment, a prayer guide they can trust. Those things do not build themselves. They are being built right now, by people who decided to give their gifts to Mary's mission.",
      cta: "Apply for a place",
      placesCard: {
        total: "20",
        totalCaption: "places, one for every mystery",
        openCaption: "still open",
      },
    },

    photo: {
      photoAlt: "A small team working together around a laptop",
      placesCaption: placesOfTotal,
    },

    twentyPlaces: {
      headline: { main: "Twenty people.", muted: "One for every mystery." },
      body: "We are building a core team of no more than twenty people, one for every mystery of the Rosary. Small enough to know each other well, strong enough to carry a network that reaches across the world. When the twenty places are filled, the team is complete.",
      placesCaption: placesOfTotal,
    },

    whyNow: {
      label: "Why now",
      headline: { main: "The first builders", muted: "shape everything that follows." },
      body: "Strangers for Mary is at its beginning. The people who join now will set the tone, write the first words, welcome the first strangers and lay the first stones. Years from now, when a stranger on the other side of the world prays their first Rosary on Youkaris, part of what holds them will be yours.",
    },

    fourTeams: {
      headline: { main: "Four teams.", muted: "Find yours." },
      body: "Each team carries one part of the mission. Pick the one that sounds like you, or more than one.",
      joinTeam: "Join this team",
    },

    form: {
      headline: "What it asks of you.",
      body: "You do not need to live in any particular place. Most of our work happens online, and the teams are coordinated on our own internal tool. We welcome everyone, but we keep high standards, so you may be invited to a short interview before you join the team. There are no fixed hours: the work is organised by project, and you make your own time. The one firm commitment is Sunday, when core team members work all day.",
      asks: ["Your skill", "Your time", "Your love for Mary"],
      title: "Got a gift? Mary has a place for it.",
      teamsLegend: "Which team fits you? Pick any",
      alsoJoin: "Also invite me to join as a stranger the day Youkaris opens.",
      submit: "Apply for a place",
      success: {
        title: "Thank you for applying.",
        body: "Thank you for offering your gifts to Mary's mission. Someone from the team will be in touch soon, and may invite you to a short interview to find the place where your gifts do the most good.",
      },
      closing: { main: "Do not just join the strangers.", emphasis: "Bring them together." },
    },
  },
} as const;

export type Strings = typeof strings;
