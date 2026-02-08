// English Learning Data for Grade 5 - 20 Units
export interface QAPair {
  q: string;
  a: string;
  k: string[];
}

export interface Unit {
  n: string;
  qa: QAPair[];
}

export const unitsData: Record<number, Unit> = {
  1: {
    n: "All about me!",
    qa: [
      { q: "Can you tell me about yourself?", a: "My name's Alex. I'm ten years old. I'm in class 5/1.", k: ["yourself", "me", "name", "old"] },
      { q: "What's your favourite colour?", a: "It's blue.", k: ["colour", "color"] },
      { q: "What's your favourite animal?", a: "It's a dog.", k: ["animal"] },
      { q: "What's your favourite food?", a: "It's pizza.", k: ["food"] },
      { q: "What's your favourite sport?", a: "It's football.", k: ["sport"] }
    ]
  },
  2: {
    n: "Our homes",
    qa: [
      { q: "Do you live in this house?", a: "Yes, I do.", k: ["house"] },
      { q: "Do you live in this flat?", a: "No, I don't.", k: ["flat"] },
      { q: "Do you live in this building?", a: "No, I don't.", k: ["building"] },
      { q: "Do you live in this tower?", a: "No, I don't.", k: ["tower"] },
      { q: "What's your address?", a: "It's 65 Le Loi Street.", k: ["address"] }
    ]
  },
  3: {
    n: "My foreign friends",
    qa: [
      { q: "Do you have any friends?", a: "Yes, I do.", k: ["friends"] },
      { q: "What nationality is he?", a: "He's Vietnamese.", k: ["nationality", "he"] },
      { q: "What's he like?", a: "He's friendly and helpful.", k: ["like", "he"] }
    ]
  },
  4: {
    n: "Our free-time activities",
    qa: [
      { q: "What do you like doing in your free time?", a: "I like riding my bike and playing the violin.", k: ["free time", "doing"] },
      { q: "What do you do at the weekend?", a: "I usually read books and play table tennis.", k: ["weekend"] }
    ]
  },
  5: {
    n: "My future job",
    qa: [
      { q: "What would you like to be in the future?", a: "I'd like to be a teacher.", k: ["future", "be"] },
      { q: "Why would you like to be a teacher?", a: "Because I'd like to teach children.", k: ["why", "teacher"] }
    ]
  },
  6: {
    n: "Our school rooms",
    qa: [
      { q: "Where's the art room?", a: "It's on the second floor.", k: ["where", "art room"] },
      { q: "Could you tell me the way to the art room, please?", a: "Go upstairs, go past the library and turn right.", k: ["way", "art room"] }
    ]
  },
  7: {
    n: "Our favourite school activities",
    qa: [
      { q: "What school activity does he like?", a: "He likes reading books.", k: ["activity", "like"] },
      { q: "Why does he like reading books?", a: "Because he thinks it's interesting.", k: ["why", "reading"] }
    ]
  },
  8: {
    n: "In our classroom",
    qa: [
      { q: "Where are the crayons?", a: "They are on the table.", k: ["crayons"] },
      { q: "Whose pen is this?", a: "It's Huong's.", k: ["whose"] }
    ]
  },
  9: {
    n: "Our outdoor activities",
    qa: [
      { q: "Were you at the campsite last week?", a: "Yes, we were.", k: ["campsite"] },
      { q: "What did you do yesterday?", a: "We listened to music and danced around the campfire.", k: ["yesterday", "did"] }
    ]
  },
  10: {
    n: "Our school trip",
    qa: [
      { q: "Did they go to Ba Na Hills?", a: "Yes, they did.", k: ["ba na hills"] },
      { q: "What did they do there?", a: "They visited the old buildings and played games.", k: ["do there"] }
    ]
  },
  11: {
    n: "Family time",
    qa: [
      { q: "Did you swim?", a: "Yes, I did. I swam with my mother.", k: ["swim"] },
      { q: "What did your family do in Ha Long Bay?", a: "We took a boat trip around the bay.", k: ["ha long bay"] }
    ]
  },
  12: {
    n: "Our Tet holiday",
    qa: [
      { q: "Will you make banh chung for Tet?", a: "Yes, I will.", k: ["banh chung"] },
      { q: "Where will you go at Tet?", a: "I'll go to my grandparents' house.", k: ["where", "tet"] }
    ]
  },
  13: {
    n: "Our special days",
    qa: [
      { q: "What will you do on Children's Day?", a: "We'll dance.", k: ["children"] },
      { q: "What food will you have at the party?", a: "We'll have pizza and burgers.", k: ["food", "party"] }
    ]
  },
  14: {
    n: "Staying healthy",
    qa: [
      { q: "How does he stay healthy?", a: "He does morning exercise and eats healthy food.", k: ["healthy"] },
      { q: "How often does he play sports?", a: "Every day.", k: ["often", "sports"] }
    ]
  },
  15: {
    n: "Our health",
    qa: [
      { q: "What's the matter?", a: "I have a headache.", k: ["matter"] },
      { q: "What should you do?", a: "I should have a rest.", k: ["should"] }
    ]
  },
  16: {
    n: "Seasons and the weather",
    qa: [
      { q: "How's the weather in Ha Noi in spring?", a: "It's warm.", k: ["spring", "weather"] },
      { q: "What do you usually wear in spring?", a: "I wear a blouse.", k: ["wear", "spring"] },
      { q: "How's the weather in Ha Noi in summer?", a: "It's hot.", k: ["summer", "weather"] },
      { q: "What do you usually wear in summer?", a: "I wear a T-shirt.", k: ["wear", "summer"] },
      { q: "How's the weather in Ha Noi in winter?", a: "It's cold.", k: ["winter", "weather"] },
      { q: "What do you usually wear in winter?", a: "I wear a coat and a scarf.", k: ["wear", "winter"] }
    ]
  },
  17: {
    n: "Stories for children",
    qa: [
      { q: "Who are the main characters in the story?", a: "They're the fox and the crow.", k: ["characters"] },
      { q: "How did she sing?", a: "She sang beautifully.", k: ["sing"] }
    ]
  },
  18: {
    n: "Means of transport",
    qa: [
      { q: "Where do you want to visit?", a: "I want to visit Dragon Bridge.", k: ["visit"] },
      { q: "How can I get there?", a: "You can get there by bicycle.", k: ["get there", "how"] }
    ]
  },
  19: {
    n: "Places of interest",
    qa: [
      { q: "What do you think of Hoi An Old Town?", a: "I think it's exciting.", k: ["think", "hoi an"] },
      { q: "How far is it from Da Nang to Hoi An?", a: "It's about 29 kilometres.", k: ["far"] }
    ]
  },
  20: {
    n: "Our summer holidays",
    qa: [
      { q: "Where are you going to visit this summer?", a: "I'm going to visit Phu Quoc Island.", k: ["visit", "summer"] },
      { q: "What are you going to do?", a: "I'm going to go camping and practise swimming.", k: ["do", "going to"] }
    ]
  }
};
