# Strangers for Mary: strings master

Every user-facing word on the website, taken from the approved design in `design-reference/`, in page order and section by section. This is the source for `src/content/strings.ts`. Do not reword anything.

How to read it:

- `##` is a page, `###` is a section (named from the design file comments).
- Each line is `Kind: text`. Kinds are H1, H2, H3, Paragraph, Label (small uppercase eyebrow), Link, Button, Image alt, Aria label, Placeholder and so on.
- `{{name}}` is a value filled in by the page script or the server. The page script block under each page shows the lists (steps, reasons, teams, FAQ, form errors and states) and the dynamic text. There is no places counter any more.
- Where two phrases sit side by side in one heading (a two-tone headline), they are listed as separate lines in order: the first is ink, the second is muted.

## Shared: site header (every page)

- Aria label: Strangers for Mary home
- Image alt: Strangers for Mary
- Aria label: Main
- Link: Our Story
- Link: Pray
- Link: Give
- Link: Gather
- Link: Volunteer
- Link: Join the strangers

## Home

### Opening

- H1: Every friend of Mary is a stranger
- H1: we cannot wait to pray for, care for, and gather with.
- Paragraph: Strangers for Mary is a network of Marian devotees who carry one another to Jesus. Linked like beads on a Rosary, we help each other live the Catholic faith every single day, alongside people who share the same values and the same hunger for Christ.
- Link: Join the strangers
- Link: Volunteer with us
- Image alt: Young people smiling together in church
- Paragraph: Every decade is a gift from one stranger to another.
- Label: Mon to Sat
- Text: 1 Rosary
- Text: a day, for a different stranger

### The challenge

- Label: The challenge
- H2: Faith is for every day,
- H2: not only for Sunday.
- Image alt: A young man alone, looking at his phone
- Text: Old habits
- Text: Easy compromises
- Text: A quiet drift
- Paragraph: You go to Mass. You sing, you pray, you mean every word. Then you walk out of the church doors and the week begins to pull: old habits, easy compromises, the quiet drift away from Christ that nobody around you seems to notice.
- Paragraph: Most of us do not stop believing. We just stop living it between Sundays. Strangers for Mary is a way back. Not a lecture and not a programme, but a daily path to Christ, walked with Mary and with strangers who are walking it too, one Rosary at a time.
- Paragraph: A Rosary a day, prayed together, is a road back to Christ.

### Who we are

- Label: We are strangers
- H2: Different cities.
- H2: Different languages. Different stories.
- Paragraph: Most of us will never stand in the same room. But every one of us has run to the same Mother, and found her already waiting.
- Paragraph: Whoever identifies with her,
- Paragraph: identifies with us.

### Strangers in prayer (photo band)

- Aria label (section): Strangers in prayer
- Image alt: A young man holding up a rosary
- Image alt: A family worshipping with a child on his father's shoulders
- Image alt: A young woman praying alone by a window

### What makes us different

- H2: Not another
- H2: prayer group.
- Paragraph: There are many good Christian communities. Strangers for Mary is built differently, on purpose.
- Repeats: for each {{reasons}}
- List item: {{r.n}}
- List item: {{r.title}}
- List item: {{r.text}}

### We pray

- Image alt: A rosary passed from one hand to another
- H2: We pray.
- Paragraph: Each week, before 6 pm on Sunday, you add your intention to the many already in the network, and trust us to pass it on. Monday to Saturday, a different stranger takes their turn to pray a full Rosary for you, every single day. And every day you do the same for someone else. On Sunday, you carry one of them with you to Mass.
- Link: See how we pray
- Label: Every week
- Paragraph: 6
- Paragraph: strangers you pray for, a full Rosary for each.
- Paragraph: Every decade is a gift from one stranger to another.

### We give

- H2: We give.
- Paragraph: We are built on the charity of small actions: a day with orphaned children, a lesson that helps a young person live chastely and love well, an hour spent bringing peace to a divided community. Each one small, each one offered for someone waiting to receive it. And we give only what we have worked for: every campaign is carried by the effort of the strangers themselves.
- Link: See how we give
- Image alt: Two women embracing
- Label: Small acts
- Paragraph: Many small hands.
- Paragraph: One real gift.
- Paragraph: Charity that costs us something is charity that means something.

### We gather

- Image alt: A crowd of people worshipping together
- Label: Once a year
- H2: We gather.
- Paragraph: Once a year, on the last Saturday of October, the strangers meet in person. Not to become familiar, since a room can hold a hundred Pauls and still keep every prayer's secret, but to share the communion our prayers have made us hungry for. We pray the Rosary together, celebrate Holy Mass, talk honestly about what makes daily prayer hard, learn more of the faith and end the day with a feast.
- Link: See how we gather
- Paragraph: We arrive as strangers. We leave stronger.

### Why strangers

- H2: They will never be able
- H2: to thank you.
- Paragraph: Your intention travels with your baptism name and nothing more. In a network with a thousand Marys and a thousand Pauls, nobody can trace a prayer back to its owner. So when you pray, you pray for someone who can never repay you. That is the point. With every decade we do what Mary did at Cana: we carry to Jesus a problem that was never ours to carry.

### Ambition

- Label: Our ambition
- H2: A chain of Rosaries around the world
- H2: that never breaks.
- Paragraph: We dream of a day when every intention shared with us is prayed for, every day, by someone who loves Mary. When no hospital bed, exam hall, empty kitchen or broken heart goes unprayed for. When a whole generation of Catholics, in every country, learns to live their faith every day because a stranger once needed them to.
- Paragraph: It starts with one Rosary.
- Paragraph: Yours.

### Build with us

- H2: Do not just join the strangers. Bring them together.
- Paragraph: Strangers for Mary is built and carried by volunteers. Find the role that fits your gifts and apply for it.
- Link: See the volunteer roles
- Aria label: Volunteer with us

### Join

- H2: Take your place in the network.
- Paragraph: Youkaris, our app, opens on 1 January 2027. Sign up today and you will be invited in on the first day, ready to add your first intention and receive your first strangers.
- List item: Open to every Catholic, everywhere
- List item: Wherever you are, there is a place in the chain for you.
- List item: Known only by your baptism name
- List item: We never ask for your full name. Your intention travels with your baptism name and nothing more.
- List item: Leave any time
- List item: One click and you are off the list.
- Condition: shown when {{notSent}}
- Label: Baptism name
- Placeholder: The name you were baptised with
- Label: Phone number
- Placeholder: With country code
- Label: Your parish
- Placeholder: Parish name
- Label: City and country
- Placeholder: e.g. Lagos, Nigeria
- Label: Email
- Label: (optional)
- Placeholder: you@example.com
- Legend: I want to
- Label: Join as a stranger.
- Label: Invite me in the day Youkaris opens.
- Paragraph: Want to volunteer? Each role has its own application.
- Link: See the volunteer roles
- Button: Count me in
- Paragraph: We will only use your details to contact you about Strangers for Mary.
- Link: [Privacy policy]
- Condition: shown when {{sent}}
- H3: Welcome, stranger.
- Paragraph: You are on the list. The day Youkaris opens, you will be among the first to know.
- Paragraph: Now do what every stranger does.
- Paragraph: Pass it on.
- Link: Share on WhatsApp

### Page script: lists and dynamic text

```js
class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.state = { sent: false };
  }
  renderVals() {
    var self = this;
    return {
      sent: this.state.sent,
      notSent: !this.state.sent,
      reasons: [
        { n: '01', title: 'Every day, not once a week.', text: 'We meet you where faith is hardest: on an ordinary Tuesday, in your own room, with your own beads.' },
        { n: '02', title: 'For someone else, not only for you.', text: 'Each day you carry a stranger’s intention to Jesus. Somebody is counting on your Rosary, and that changes how faithfully you pray it.' },
        { n: '03', title: 'Nobody to impress.', text: 'Every stranger is known only by their baptism name. No status, no cliques, no performance. Just prayer.' },
        { n: '04', title: 'A network, not a group.', text: 'Each stranger is a bead in one long Rosary that circles the world. When one bead goes quiet, the network notices and reaches out.' },
        { n: '05', title: 'Prayer that becomes action.', text: 'What we pray for, we also work for, through small acts of charity for people waiting to receive them.' },
        { n: '06', title: 'Fully Catholic, at home in your parish.', text: 'We are not a new church, parish or prayer group. Everything we pray and teach is faithful to the Catechism, and your home stays the parish you already belong to.' }
      ],
      submit: function (e) { if (e && e.preventDefault) { e.preventDefault(); } self.setState({ sent: true }); }
    };
  }
}
```

## Our Story

### Opening

- Label: Our story
- H1: It started with
- H1: ten text messages.
- Paragraph: In 2017, a few young Catholics had just finished university and were working around the city of Buea. What they saw around them would not let them go.
- Image alt: A row of people praying with open hands in church

### What we saw

- Label: What we saw
- H2: Faith that ended at the church door.
- Paragraph: Young people went to Mass and took part with their whole hearts. They sang, they prayed, they received. Then they walked out of church and were pulled straight back into a life with little room for Christ: living together before marriage, and every small vice that draws a person a little further from Him each week.
- Paragraph: Not because they had stopped believing, but because nothing carried their faith from Sunday into Monday.
- Image alt: A priest celebrating Mass at the altar
- Text: Sunday
- Image alt: A young man laughing at a party
- Text: Monday

### What we knew

- Paragraph: We had seen
- Paragraph: the Rosary work.
- Label: What we knew
- Paragraph: We had seen it in our own lives. A Rosary prayed every day had held us close to Christ when nothing else could. Mary has never kept anyone for herself: everyone who comes close to her is handed on to her Son. So we wondered what would happen if we prayed it for each other.
- Image alt: Hands holding a rosary, in black and white

### Ten friends

- Label: Ten friends
- H2: "Would you be interested in a random prayer?"
- Paragraph: We sent that message to ten friends. Each would pray the Rosary for an intention that was not their own, and a stranger would pray for theirs. They said yes. They told their friends. Before long, the ten had grown into a network of hundreds.
- Image alt: A young woman smiling at her phone
- Label: 2017
- Paragraph: 10
- Paragraph: text messages
- Label: Before long
- Paragraph: 100s
- Paragraph: of strangers praying

### When it broke

- Label: When it broke
- H2: It grew faster than we could carry it.
- Paragraph: The simple tools we used to pass intentions around could not keep up, and they failed. Keeping the network running took more than we had, and we wrestled with the question every builder asks in the dark: who are we to lead this?
- Paragraph: The rest of the story is better told in person. Come and hear us tell it at a gathering some day.

### Why we are back

- Image alt: Young people praying together in a crowded room
- Label: Why we are back
- H2: Because the need
- H2: never went away.
- Paragraph: The young people we saw in 2017 are still out there, along with millions more, in every city and every language, going to Mass on Sunday and losing the fight by Monday. This time we are building it properly: Youkaris, an app made to carry intentions safely between strangers, and a core team ready to keep the chain moving.

### Name and mark

- Image alt: The Strangers for Mary mark: an M drawn as two forward chevrons with a small i between them
- Label: Our name and mark
- Paragraph: Our mark is the letter M for Mary, drawn as two chevrons moving forward. Between them stands a small "i". That "i" is you: every stranger, held in a personal friendship with the Blessed Virgin Mary, and carried forward by her.
- Paragraph: Our slogan is three words. Everything we have, our faith, our graces, our daily bread, came to us as a gift from the goodness of the Father. We do not keep it.
- Paragraph: PASS IT ON.

### Close

- H2: Our story is still being written.
- H2: The next chapter is the one where you take your place in the network.
- Link: Join the strangers

## Pray

### Opening

- Label: We pray
- H1: A Rosary a day
- H1: for someone who can never thank you.
- Paragraph: Prayer is where Strangers for Mary begins, and where it always returns. Every day of the week but Sunday, beads move through the fingers of strangers, and every one of them is moving for someone else.
- Image alt: Hands raised in prayer
- Label: Youkaris · Today's stranger
- Text: Decade 3 of 5

### The model

- Label: How the exchange works
- H2: Your week as a stranger.
- Paragraph: Six days, six strangers, a full Rosary for each. Then Mass on Sunday.
- Repeats: for each {{days}}
- Label: {{day}}
- Text: A new stranger, a full Rosary
- Image alt: A priest celebrating Mass at the altar
- Label: Sun · Mass
- Text: No Rosary assigned. Offer a Mass for one of the week's intentions.
- List item: 01
- List item: You add your intention.
- List item: Each week, before 6 pm on Sunday, you add one intention to the many already in the network. It travels with your baptism name and nothing more.
- List item: 02
- List item: We pass it on.
- List item: We hand it to a series of strangers. Each day from Monday to Saturday, a different one takes their turn to pray a full Rosary for you.
- List item: 03
- List item: You pray for six.
- List item: Every day you receive a new stranger's intention and pray a full Rosary for it. Six days, six strangers, every week.
- List item: 04
- List item: Sunday, at Mass.
- List item: No Rosary is assigned on Sunday. Instead, you are encouraged to choose one of the week's intentions and offer a Mass for it.
- List item: 05
- List item: The chain keeps moving.
- List item: While you hold another stranger's intention, someone else is holding yours with the same care.
- Paragraph: Every decade is a gift from one stranger to another.
- Image alt: A young woman praying with folded hands
- Image alt: A young man praying with a rosary
- Image alt: A woman walking with a rosary in her hand

### Why the rosary + habit

- Image alt: A wooden rosary held in a hand
- Image alt: A rosary passed from one hand to another
- Label: Every decade is a little Cana
- H2: We carry what is
- H2: not ours to carry.
- Paragraph: At the wedding at Cana, Mary noticed a need that was not hers. The wine had run out at someone else's feast. She did not wait to be asked. She carried it to her Son, and He answered. Every decade we pray for a stranger, we do the same: we take to Jesus a problem that was never naturally ours to carry.
- Paragraph: The Rosary is simple enough for a child and deep enough for a lifetime. In it we walk with Mary through the life of her Son: his birth, his suffering, his rising, his glory. Alongside it, we keep the other Marian devotions the Church has treasured for centuries.
- Label: Why they can never thank you
- H2: A gift with no way
- H2: back to the giver.
- Paragraph: Every intention carries a baptism name, but nothing that identifies the person behind it. In a network with a thousand Pauls and a thousand Marys, nobody can trace a prayer back to its owner. So the stranger you pray for can never thank you, and you never pray to be thanked. That is what keeps every gift pure.
- Label: Why it lasts
- H2: A habit for every day,
- H2: not a feeling for one.
- Paragraph: Most of us do not stop believing. We just stop practising, one busy day at a time. A stranger waiting on your Rosary changes that. It gives every day a reason to pick up the beads, and a quiet strength against everything that pulls you away from Christ between Sundays.

### Ambition

- Label: Our ambition
- H2: A chain of prayer around the world
- H2: that never breaks.
- Paragraph: We dream of a day when every intention shared with us is prayed for, every day, by someone who loves Mary. When no hospital bed, exam hall, empty kitchen or broken heart goes unprayed for. When a whole generation of Catholics, in every country, grows up knowing how to pray daily, because a stranger once needed them to.
- Paragraph: It starts with one Rosary.
- Paragraph: Yours.

### Youkaris

- Label: Where it happens
- H2: Youkaris.
- H2: A home for daily prayer.
- Paragraph: Youkaris is the app that holds it all together. Each morning it hands you that day's stranger, keeps your place in the week and gently brings you back when life gets loud. It does not replace anything on your phone. It gives your daily prayer a home.
- Text: THIS WEEK'S STRANGER
- Text: Pray the Rosary for this intention today.
- Text: Day 3 of 6 this week

### Questions

- H2: Questions people ask.
- Image alt: A woman praying alone in a church pew
- Question: How long does it take?
- Question: +
- Paragraph: A Rosary takes about twenty minutes. Many people pray it on the way to work, before bed or with their family.
- Question: What can I share as an intention?
- Question: +
- Paragraph: Anything you would bring to Mary herself, kept short. Please leave out personal details and the long history of the problem, and do not name other people in full. A few honest words, offered in faith, are enough.
- Question: When do I add my intention?
- Question: +
- Paragraph: Once a week, before 6 pm on Sunday. Each stranger adds one intention per week.
- Question: Will anyone know it is mine?
- Question: +
- Paragraph: Your intention carries your baptism name, but nothing that identifies you. Because so many strangers share the same baptism name, nobody can tell whose intention they are holding.
- Question: What if I miss a day?
- Question: +
- Paragraph: Nothing bad happens. A missed day is never punished. It is flagged, so we know who might need support, and someone makes sure you get it.

### Close + switcher

- H2: Somebody is waiting for your Rosary.
- Paragraph: They will never know it was you. They will never be able to thank you. They need you anyway.
- Link: Join the strangers
- Link: Next: We give.
- Link: Charity, one small act at a time.
- Link: Then: We gather.
- Link: It is always a party for our Mother.

## Give

### Opening

- Label: We give
- H1: Charity,
- H1: one small act at a time.
- Paragraph: We are built on the charity of small actions. A meal shared. A hospital bill paid. A school fee covered. An afternoon spent with someone who is alone. None of it is grand. All of it is offered for a stranger waiting to receive it.
- Image alt: Two women embracing
- Text: Every gift here was worked for

### No free meals

- Label: Worked for, then given
- H2: We give what we have worked for.
- Paragraph: Strangers for Mary does not pass a collection basket. Every campaign we run is funded by the work of the strangers themselves: things we make, sell, organise and build together. If we give a meal, someone worked for it. If we pay a hospital bill, someone laboured for it.
- Paragraph: That is what makes our charity mean something. And it means anyone can take part, whatever is in their pocket, because everyone has time and hands.
- Paragraph: Charity that costs us something is charity that means something.
- Paragraph: Every small act, offered for someone waiting to receive it.

### How a gift travels

- Label: How a gift travels
- H2: From a stranger's need
- H2: to a stranger's door.
- Repeats: for each {{steps}}
- List item: {{step.n}}
- List item: {{step.title}}
- List item: {{step.text}}

### Who we give to

- Image alt: People working through a plan together at a table
- Label: Who we give to
- H2: The ones Mary would notice first.
- Paragraph: The sick and those who care for them. Families who do not have enough. Young people who cannot afford to keep learning. Anyone carrying something too heavy to carry alone. Like Mary at Cana, we try to see the need before anyone has to ask.
- Paragraph: And we give as we pray: not to be thanked, but because they are her children too.

### Ambition

- Label: Our ambition
- H2: A network that can move mountains,
- H2: one pair of hands at a time.
- Paragraph: Imagine strangers in every country, each giving an hour of work, and all of it flowing to the same hospital ward, the same village, the same family on the same day. That is what a network of prayer can become when it learns to give. We want Strangers for Mary to be the place where Catholics everywhere turn their faith into something a stranger can touch.

### Close + switcher

- H2: Your hands are a gift too.
- Paragraph: Join the strangers, and when the first campaign opens, you will be among the first to hear and the first to help. Or join the team that builds our giving from the ground up.
- Link: Join the strangers
- Link: Build it with us
- Link: Where it starts: We pray.
- Link: A Rosary a day, for a different stranger.
- Link: Next: We gather.
- Link: It is always a party for our Mother.

### Page script: lists and dynamic text

```js
class Component extends DCLogic {
  renderVals() {
    return {
      steps: [
        { n: '01', title: 'A need is found.', text: 'Through the network we hear of the sick, the poor and anyone who is struggling.' },
        { n: '02', title: 'A campaign is set.', text: 'The need becomes a clear goal everyone can see: what it is, who it is for and what it will take.' },
        { n: '03', title: 'We work for it.', text: 'Strangers take part in the activities that raise what the campaign needs, each in the way they can.' },
        { n: '04', title: 'We carry it.', text: 'The gift is delivered in person wherever we can, with prayer and with the respect every child of God deserves.' },
        { n: '05', title: 'We pass it on.', text: 'We tell the story to the whole network, so every stranger knows what their small act became.' }
      ]
    };
  }
}
```

## Gather

### Opening

- Label: We gather
- H1: It is always a party
- H1: for our Mother.
- Paragraph: For months you have prayed for strangers known to you only by a baptism name, and strangers have prayed for you. Then, once a year, the doors open and the strangers walk in.
- Image alt: A crowd of people worshipping together
- Label: Once a year

### Not to become familiar

- H2: A room full of Pauls,
- H2: and nobody knows which one prayed for you.
- Paragraph: Everyone in the network is known by their baptism name. Even in the same room, you will never know whose intentions you carried, or who carried yours. That is not why we gather. We gather to share the physical communion that a network of prayer makes us hunger for.

### What happens

- Label: What happens when we gather
- H2: We pray. We talk.
- H2: We learn. We eat.
- Image alt: A congregation in worship
- H3: We pray, praise and worship.
- Paragraph: The beads we have held alone all season are finally held side by side. We sing loud, we fall quiet before the Lord, and we remember who all of this has been for.
- Image alt: People talking together around a table of food
- H3: We tell the truth about prayer.
- Paragraph: We talk honestly about the weeks we struggled and the weeks we thrived: what stopped us praying, what helped us keep going, and what we will do differently.
- H3: We go deeper into the faith.
- Paragraph: We take time to strengthen our understanding of what the Church teaches, so the faith we pray every day is a faith we understand.
- Image alt: Young people smiling together in church
- H3: We break bread.
- Paragraph: Then the tables fill, and we share a meal with the strangers we trusted to care for our faith.
- Image alt: Strangers talking together at a gathering

### Why we gather

- Label: Why we gather
- H2: This is what keeps us praying.
- Paragraph: Every gathering is built around one practical question: what stops us from praying every day, and how do we overcome it together? We leave with honest stories, habits that work and fresh strength for the year of the Rosary ahead.
- Paragraph: We arrive as strangers.
- Paragraph: We leave stronger.

### How often

- Paragraph: 1
- H2: Once a year, the strangers meet.
- Paragraph: Once a year, on the last Saturday of October, Strangers for Mary comes together in person. Some gatherings are also held for a stranger's need, when the network rallies around someone waiting to receive help. The place is announced as each gathering is set, and every stranger who signs up hears first.

### Something to look forward to

- Label: Something to look forward to
- H2: A date every stranger
- H2: circles on the calendar.
- Paragraph: We are not starting a new church or a new parish; our home is the parish you already belong to. A gathering is a one-time occasion, a celebration our Mother hosts once a year, that strangers can look forward to, plan for and bring their hunger to.

### Close + switcher

- H2: Save a seat.
- H2: Better still, save two.
- Paragraph: Join the strangers today, and bring someone with you to the first gathering.
- Link: Join the strangers
- Link: Where it starts: We pray.
- Link: A Rosary a day, for a different stranger.
- Link: And between: We give.
- Link: Charity, one small act at a time.

## Volunteer

Replaces "Build With Us". Route `/volunteer`; `/build-with-us` redirects here.

### Opening

- Label: Volunteer
- H1: Someone has to bring the strangers together.
- H1: Why not you?
- Paragraph: Every stranger who prays stands on something built by a volunteer: an app that works, a welcome that feels warm, a message that reached them at the right moment, a prayer guide they can trust. Strangers for Mary is built and carried by people who give their gifts to Mary's mission.
- Link: See the volunteer roles
- Label: Volunteering, not a job
- Text: Unpaid. Not full-time. Online.
- Text: You serve alongside your studies, work and family life, from anywhere in the world. Sunday is the one firm commitment.

### Photo

- Image alt: A small team working together around a laptop

### Why volunteer

- Label: Why volunteer
- H2: Your gifts,
- H2: carried to strangers you will never meet.
- Paragraph: The work you do reaches people who will never know your name. A stranger on the other side of the world prays their Rosary on Youkaris, reads a reflection you edited or finds the welcome you wrote, and part of what holds them is yours. That is Cana: carrying to Jesus what we were never asked to carry.

### Four teams

- H2: Four teams.
- H2: Find yours.
- Paragraph: Each team carries one part of the mission. Read its roles and apply for the one that fits your gifts.
- Repeats: for each {{teams}}
- Image alt: {{team.alt}}
- Label: {{team.role}}
- Text: {{team.name}}
- Text: {{team.text}}
- Link: See the roles

### How to volunteer

- H2: How to volunteer.
- Paragraph: We welcome everyone, and we keep high standards. Every role is unpaid and none is full-time, and we train you in the role. Most of the work happens online and is organised by project on our own internal tool, so you make your own time. The one firm commitment is Sunday.
- Link: See the volunteer roles
- Repeats: for each {{steps}}
- Text: {{s.n}}
- H3: {{s.h}}
- Paragraph: {{s.t}}
- Paragraph: Do not just join the strangers.
- Paragraph: Bring them together.

### Page script: lists and dynamic text

```js
steps: [
  { n: '01', h: 'Read the roles', t: 'Each role has a full description: what it carries, what you will do and what we look for.' },
  { n: '02', h: 'Apply for one role', t: 'Answer the questions for that role, attach your CV and confirm you understand it is unpaid and not full-time.' },
  { n: '03', h: 'A short interview', t: 'We may invite you to a short online conversation, built around the role you chose.' },
  { n: '04', h: 'Welcome to the team', t: 'You are welcomed onto your team and our internal tool. If the role is filled, we keep your application for when it opens again.' }
],
teams: [
  { img: '../assets/photos/hero-smile.jpg', alt: 'A smiling young woman at a gathering', role: 'You are the welcome', name: 'Stranger Relations', text: 'Onboarding, support, retention and events. You look after every member from the day they join, so nobody is ever left alone.' },
  { img: '../assets/photos/event-laugh.jpg', alt: 'A young man laughing at an event', role: 'You are the voice', name: 'Outreach', text: 'Brand, social media, partnerships, campaigns, logistics and finance. You grow the network and the income that funds its charity.' },
  { img: '../assets/photos/candle-rosary.jpg', alt: 'Hands holding a rosary beside a lit candle', role: 'You are the heart', name: 'Core and Content', text: 'You write the prayer guides, reflections and teaching that strangers will read, always faithful to the Catechism of the Catholic Church.' },
  { img: '../assets/photos/team-talk.jpg', alt: 'Two colleagues talking, one holding a laptop', role: 'You are the hands', name: 'Technology', text: 'You build Youkaris and the tools behind it, so that a prayer typed in one country lands safely in another.' }
]
```

## Roles

Route `/volunteer/roles`. Role content (titles, team descriptions, summaries, responsibilities, requirements, questions, link labels, PDFs) is in `content/roles.json`, not here.

### Opening

- Link (tag): Volunteer · Roles
- H1: Read the role.
- H1: Then apply for it.
- Paragraph: Strangers for Mary is built and carried by volunteers. Each role is described here: what it carries, what you will do and what we look for. Choose the one that fits your gifts and apply for that role. No experience? Many roles come with training. If a role is already filled, we keep your application for when it opens again.
- Link: See the roles
- Label: Before you apply
- Text: Every role is unpaid. None is full-time.
- Text: You serve alongside your studies, work and family life, online from anywhere. Sunday is the one firm commitment, and we train you in the role.
- Link: The nature of the work

### Nature of the work

- H2: Volunteering,
- H2: not a job.
- Paragraph: Please read this before you apply, so nobody mistakes a place on the team for paid or full-time work.
- Repeats: the six items in `roles.json` `nature`:
- H3: Unpaid
- Paragraph: Every role is voluntary. There is no salary, allowance, stipend or payment of any kind, now or later.
- H3: Not full-time
- Paragraph: You serve alongside your studies, work and family life. This is not a job, and a place on the team is not employment.
- H3: Training is provided
- Paragraph: We train every volunteer in their role. Roles marked "Training provided" are open to people with no experience in the work, as long as you are willing to learn and to deliver. Roles marked "Experience required" need someone who has done the work before; you still receive onboarding.
- H3: Project-based
- Paragraph: Outside Sunday there are no fixed hours. Work is organised by project on our internal tool, and you deliver what you agree to deliver.
- H3: Sunday
- Paragraph: Sunday is the one firm commitment. After Holy Mass, core team members keep the day for the network.
- H3: Online
- Paragraph: You can serve from anywhere in the world. We meet in person once a year, at the gathering on the last Saturday of October.
- H3: Rooted in prayer
- Paragraph: You pray the Rosary daily and the Strangers' Prayer after it, and you may be invited to pray an extra Rosary for a stranger whose intention would otherwise go unprayed.

### Who we look for

- H2: Every role asks two things.
- H2: Faith, and real skill.
- Label: Every role
- H3: A practising Catholic who loves Mary
- Paragraph: You pray the Rosary daily and the Strangers' Prayer after it, and you may be invited to pray an extra Rosary when a stranger's intention would otherwise go unprayed.
- Label: Technology
- H3: Mid-level developers who think in systems
- Paragraph: We build with a lot of AI assistance, so we look for people who understand system design and can judge what AI produces. Native Android and iOS, hybrid apps and React on the web all matter here.
- Label: A pivotal role
- H3: A brand designer who is genuinely good at it
- Paragraph: The brand drives most of our outreach and our charity work. The Brand and Graphic Designer needs strong, proven brand identity experience, and a portfolio that shows it.

### The roles

- H2: The roles.
- H2: Find yours.
- Paragraph: Each role has its own description and its own application. Many roles come with training, and are open to people with no experience in the work.
- Aria label (filter group): Filter by team
- Button: All roles
- Button: Core and Content
- Button: Technology
- Button: Stranger Relations
- Button: Outreach
- Repeats: for each role
- Label: {{role.team}}
- H3: {{role.title}}
- Paragraph: {{role.summary}}
- Summary (closed): Read the full role
- Summary (open): Show less
- Label: The team
- Paragraph: {{role.teamDescription}}
- Label: The role
- Paragraph: {{role.purpose}}
- Label: What you will do
- Label: You will need
- Text: Reports to: {{role.reportsTo}}
- Link: Download PDF
- Link: Apply for this role

### Application

- H2: Apply for
- H2: one role.
- Paragraph: Each application is for one role, so we can judge you on what that role needs. Choose the role, answer its questions and attach your CV. Applicants may be invited to a short online interview.
- Link (in the chosen role card): Download the role description
- Text: This is not a paid job.
- Text: Every role is unpaid and none is full-time. There is no salary, allowance, stipend or payment of any kind.
- Label: The role you are applying for
- Option (empty): Choose a role
- Option: {{role.title}} ({{role.team}})
- Label: Full name
- Placeholder: First and last name
- Label: Baptism name
- Placeholder: The name you were baptised with
- Label: Phone number
- Placeholder: With country code
- Label: Email
- Placeholder: you@example.com
- Label: Your parish
- Placeholder: Parish name
- Label: City and country
- Placeholder: e.g. Lagos, Nigeria
- Label: Questions for this role
- Label: {{question.text}} (three, from `roles.json`)
- Placeholder: Your answer
- Label: {{role.application.linkLabel}}
- Placeholder: https://
- Paragraph (no role chosen): Choose a role above to see the questions for that role.
- Label: Your CV
- Button: Upload your CV
- Button (after a file is chosen): Change file
- Text (no file yet): No file chosen yet
- Hint: PDF or Word document
- Label: Besides Sunday, how much time can you give in a typical week?
- Option (empty): Choose one
- Option: Up to 3 hours
- Option: 4 to 6 hours
- Option: 7 hours or more
- Legend: Please confirm
- Label: I understand this is an unpaid volunteer role. It is not a job and not full-time, and there is no salary, allowance or payment of any kind.
- Label: I can keep Sunday for the network, after Holy Mass.
- Label: I pray the Rosary daily, or I am ready to begin.
- Label: Also invite me to join the network as a stranger.
- Button: Send my application
- Paragraph: We will only use your details to consider your application and contact you about Strangers for Mary.
- Link: [Privacy policy]
- Condition: shown when sent
- H3: Thank you for applying.
- Paragraph: Your application is in. Someone from the team will review it and may invite you to a short online interview. If the role is filled, we will keep your application for when it opens again.
- Paragraph: Pass it on.
- Paragraph: Do not just join the strangers.
- Paragraph: Bring them together.

## Shared: closing card and footer (every page)

### Closing card

- Paragraph: We called you here to show you what we do.
- Paragraph: We pray. We give. We gather.
- Paragraph: Now pass it on.
- Link: Share on WhatsApp
- Button: {{copyLabel}}

### Footer

- Image alt: Strangers for Mary
- Paragraph: PASS IT ON.
- Aria label: Instagram [link to add]
- Aria label: WhatsApp channel [link to add]
- Aria label: Email us
- Aria label: Footer
- Paragraph: Explore
- Link: Our Story
- Link: Pray
- Link: Give
- Link: Gather
- Paragraph: Get involved
- Link: Join the strangers
- Link: Volunteer
- Link: Volunteer roles
- Paragraph: Contact
- Link: admin@strangersformary.org
- Link: [Instagram]
- Link: [WhatsApp channel]
- Paragraph: © 2026 Strangers for Mary · Powered by Youkaris
- Link: [Privacy policy]

### Page script: lists and dynamic text

```js
class Component extends DCLogic {
  constructor(props) { super(props); this.state = { copied: false }; }
  renderVals() {
    var self = this;
    return {
      copyLabel: this.state.copied ? 'Link copied' : 'Copy the link',
      copy: function () {
        try { if (navigator.clipboard) { navigator.clipboard.writeText('https://www.strangersformary.org'); } } catch (e) {}
        self.setState({ copied: true });
      }
    };
  }
}
```


## Added for the build (not visible in the design)

These strings are needed by the code but have no place in the static design. They follow the same voice. Use them as written; the owner may refine them later in `strings.ts`.

### Header on tablets and phones

- Aria label (mark link): Strangers for Mary home
- Button (small, next to the menu button): Join us
- Aria label (menu button, closed): Open menu
- Aria label (menu button, open): Close menu
- Visually hidden heading of the menu panel: Menu
- Menu panel links: Our Story, Pray, Give, Gather, Volunteer
- Menu panel button: Join the strangers
- Menu panel footer: PASS IT ON. / admin@strangersformary.org

### Share messages

- After signing up (success panel): I just joined Strangers for Mary and I think you would love it. Strangers pray for your intentions, your small acts of charity become real help for someone in need, and once a year we gather to celebrate our Mother. It is a way to keep your faith alive beyond Sunday. Be one of the first: https://www.strangersformary.org
- From the closing card (someone who has not joined yet): Never carry your faith alone. With Strangers for Mary, strangers pray for your intentions, your small acts become real help for someone in need, and you gather with Catholics who keep you strong between Sundays. Be one of the first: https://www.strangersformary.org
- Copy link button, after click: Link copied

### Form errors and states

Home sign-up:

- Baptism name missing: Please add the name you were baptised with.
- Phone missing: Please add your phone number, with your country code.
- Phone not valid: That number does not look right. Include your country code.
- Email not valid (only checked when filled): That email does not look right. Please check it.
- Parish missing: Please tell us your parish.
- City missing: Please add your city and country.
- Sending (button): Sending
- Network or server failure: Something went wrong on our side. Please try again in a moment.
- Too many attempts: Please wait a minute and try again.

Volunteer application (Roles page):

- Role missing: Please choose the role you are applying for.
- Full name missing: Please tell us your full name.
- Baptism name missing: Please add the name you were baptised with.
- Phone missing: Please add your phone number, with your country code.
- Phone not valid: That number does not look right. Include your country code.
- Email missing: Please add your email.
- Email not valid: That email does not look right. Please check it.
- Parish missing: Please tell us your parish.
- City missing: Please add your city and country.
- Answer missing: Please answer this question.
- Answer too long: Please keep your answer under 3,000 characters.
- Link missing (Brand and Graphic Designer only): Please add a link to your portfolio.
- Link not valid: Please add a full link, starting with https://
- CV missing: Please upload your CV.
- CV wrong type: Please upload your CV as a PDF or Word document.
- CV too large: Your CV is larger than 4 MB. Please upload a smaller file.
- Time missing: Please choose how much time you can give.
- Unpaid not confirmed: Please confirm you understand this is an unpaid volunteer role.
- Sunday not confirmed: Please confirm you can keep Sunday for the network.
- Rosary not confirmed: Please confirm the daily Rosary.
- Applications closed: We are not taking applications right now. Please check back soon.
- Role closed: This role is not taking applications right now. Please choose another role or check back soon.
- Sending (button): Sending
- Network or server failure: Something went wrong on our side. Your application was not sent. Please try again in a moment.
- Too many attempts: Please wait a minute and try again.

### Page titles and descriptions (metadata)

- Home: Strangers for Mary | Prayer that becomes action. Description: We help strangers live the Catholic faith every single day, alongside people who share the same values and the same hunger for Christ.

### Social sharing (Open Graph and X)

These apply to every page unless a page sets its own title and description above.

- Share title: Strangers for Mary | Prayer that becomes action
- Share description: We help strangers live the Catholic faith every single day, alongside people who share the same values and the same hunger for Christ.
- Share image alt text: Young people smiling together in church. Text: Every friend of Mary is a stranger we cannot wait to pray for, care for, and gather with. Strangers for Mary.
- Site name: Strangers for Mary
- Our Story: Our Story | Strangers for Mary. Description: It started in 2017 with ten text messages. Why Strangers for Mary began, and why it is coming back stronger.
- Pray: Pray | Strangers for Mary. Description: A Rosary a day for someone who can never thank you. How intentions move through the network.
- Give: Give | Strangers for Mary. Description: Charity, one small act at a time. We give what we have worked for, to strangers waiting to receive it.
- Gather: Gather | Strangers for Mary. Description: Once a year, on the last Saturday of October, the strangers meet in person to pray, learn and break bread together.
- Volunteer: Volunteer | Strangers for Mary. Description: Strangers for Mary is built and carried by volunteers. Unpaid, online and rooted in prayer. Find the role that fits your gifts.
- Roles: Volunteer roles | Strangers for Mary. Description: Read each volunteer role, then apply for the one that fits your gifts. Every role is unpaid and not full-time, and we train you in the role.
- Not found page: This page has wandered off. Link: Back to the home page
