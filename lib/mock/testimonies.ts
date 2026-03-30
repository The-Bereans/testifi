export type Category = "Addiction" | "Mental Health" | "Relationships" | "Identity" | "Spiritual";

export interface Testimony {
  id: string;
  word: string;
  category: Category;
  excerpt: string;
  full: string;
  date: string;
}

export const testimonies: Testimony[] = [
  //  Addiction 
  {
    id: "t1",
    word: "alcohol",
    category: "Addiction",
    excerpt: "I still think about it every single day. Some days I win. Some days I don't.",
    full: "I still think about it every single day. Some days I win. Some days I don't. I used to think freedom meant the craving would just disappear. It doesn't work like that. But I'm still here, and I'm still trying, and that counts for something. God met me in the \"I don't know if I can do this\" moments more than anywhere else.",
    date: "2026-03-27T09:14:00Z",
  },
  {
    id: "t2",
    word: "pornography",
    category: "Addiction",
    excerpt: "Ten years. I didn't think I'd ever get out. I was ashamed to even say the word out loud.",
    full: "Ten years. I didn't think I'd ever get out. I was ashamed to even say the word out loud in church  like just naming it would make me less. But the shame was keeping me in. I finally told one person. That was the beginning. Not the end  the beginning. There's still work to do, but I'm not alone in it anymore.",
    date: "2026-03-24T21:47:00Z",
  },
  {
    id: "t3",
    word: "drugs",
    category: "Addiction",
    excerpt: "The hardest part wasn't quitting. It was figuring out who I was without it.",
    full: "The hardest part wasn't quitting. It was figuring out who I was without it. I'd been using since I was 15. I didn't know who \"sober me\" was. I'm still finding out. Some of what I'm finding is embarrassing. Some of it is better than I expected. I think God is less concerned with my past than I am.",
    date: "2026-02-18T14:32:00Z",
  },

  //  Mental Health 
  {
    id: "t4",
    word: "anxiety",
    category: "Mental Health",
    excerpt: "I used to plan my own funeral in my head  not because I wanted to die, just to feel in control of something.",
    full: "I used to plan my own funeral in my head  not because I wanted to die, just to feel in control of something. Anxiety had taken everything else. I couldn't make a single decision without spiraling. Therapy helped. Medication helped. But honestly, the moment someone said \"me too\" without flinching  that helped more than anything. I'm not fixed. I'm functional. That's enough for today.",
    date: "2026-03-20T07:55:00Z",
  },
  {
    id: "t5",
    word: "depression",
    category: "Mental Health",
    excerpt: "I stayed in bed for 11 days. My mom called every morning. I didn't pick up once.",
    full: "I stayed in bed for 11 days. My mom called every morning. I didn't pick up once. On day 12 I picked up, and she just said \"I'm still here.\" That's it. No lecture. No fix. She was just still there. I cried for a long time after that. I think that's what grace sounds like sometimes  just someone being still there.",
    date: "2026-03-15T18:22:00Z",
  },
  {
    id: "t6",
    word: "suicide",
    category: "Mental Health",
    excerpt: "I was on the edge of a bridge. I'm not entirely sure why I got off. I'm glad I did.",
    full: "I was on the edge of a bridge. I'm not entirely sure why I got off. I don't have a clean story about a voice or a vision. I just got off. I went home. I called a number I'd been avoiding. That was three years ago. I still have bad days  genuinely bad ones. But I'm here to have them, and that matters more than I used to think it did.",
    date: "2026-01-05T11:08:00Z",
  },

  //  Relationships 
  {
    id: "t7",
    word: "loneliness",
    category: "Relationships",
    excerpt: "I was surrounded by people every weekend and still the loneliest I'd ever been in my life.",
    full: "I was surrounded by people every weekend and still the loneliest I'd ever been in my life. I was performing closeness. Laughing at the right moments. Nobody knew what was actually going on. I think I was afraid that if they did, they'd leave. When I finally let one person in  actually in  they didn't leave. I hadn't expected that.",
    date: "2026-03-10T16:40:00Z",
  },
  {
    id: "t8",
    word: "betrayal",
    category: "Relationships",
    excerpt: "My closest friend told everyone my secret. I still don't fully trust anyone  I'm working on it.",
    full: "My closest friend told everyone my secret. I still don't fully trust anyone  I'm working on it. I used to think I was just broken for not being able to move on. But a counselor helped me understand that what happened was real and it made sense that it changed me. I'm learning to trust again slowly. Not naively. Just slowly.",
    date: "2026-02-28T20:03:00Z",
  },
  {
    id: "t9",
    word: "forgiveness",
    category: "Relationships",
    excerpt: "I forgave him not because he deserved it. Because I couldn't keep carrying it.",
    full: "I forgave him not because he deserved it. Because I couldn't keep carrying it. For a long time I thought forgiving meant pretending it didn't happen, or that it was okay. It wasn't okay. It happened. Forgiveness just meant I stopped letting it live rent-free in the center of my chest. It took years. It still feels incomplete sometimes. That's okay.",
    date: "2026-03-05T08:17:00Z",
  },

  //  Identity 
  {
    id: "t10",
    word: "worthless",
    category: "Identity",
    excerpt: "My father told me I'd never amount to anything. I believed him for almost thirty years.",
    full: "My father told me I'd never amount to anything. I believed him for almost thirty years. The lie was so deep I couldn't see it. I thought it was just \"who I was.\" The first time someone told me God saw something in me I nearly laughed. It took a long time for that to land anywhere real. It's landing now. Slowly.",
    date: "2026-03-22T13:29:00Z",
  },
  {
    id: "t11",
    word: "invisible",
    category: "Identity",
    excerpt: "I used to wonder if anyone would actually notice if I just disappeared one day.",
    full: "I used to wonder if anyone would actually notice if I just disappeared one day. Not in a dark way  just in a quiet, hollow way. Like I was taking up space without mattering. I started showing up to a small group even though I hated small groups. Someone remembered my name week two. It sounds small. It wasn't.",
    date: "2026-02-12T22:51:00Z",
  },
  {
    id: "t12",
    word: "broken",
    category: "Identity",
    excerpt: "I kept waiting to feel fixed. I eventually stopped waiting and started living with the cracks.",
    full: "I kept waiting to feel fixed. I eventually stopped waiting and started living with the cracks. There's a Japanese art form  kintsugi  where they repair broken pottery with gold. I saw a picture of it once and had to sit down. I'm not a metaphor person. But that one got me. Maybe broken and beautiful aren't opposites.",
    date: "2026-03-01T10:44:00Z",
  },

  //  Spiritual 
  {
    id: "t13",
    word: "doubt",
    category: "Spiritual",
    excerpt: "I spent three years furious at God. I think He was okay with that.",
    full: "I spent three years furious at God. I think He was okay with that. I kept waiting to lose faith entirely but I couldn't  even my anger was directed at Someone. When I came back it wasn't because I had answers. It was because the doubt itself had somehow kept me tethered. I'm still not sure about a lot of things. But I'm here.",
    date: "2026-03-18T06:38:00Z",
  },
  {
    id: "t14",
    word: "anger",
    category: "Spiritual",
    excerpt: "I screamed at God in my car once. Just screamed. And then something shifted.",
    full: "I screamed at God in my car once. Just screamed. Nothing dramatic happened  no thunder, no peace descending. But something shifted. Like I'd finally stopped performing for someone who already knew. I think He'd been waiting for me to drop it. The pretending that I was fine. The polished prayers. He wanted the real version. That was terrifying. Also kind of a relief.",
    date: "2026-03-12T19:05:00Z",
  },
  {
    id: "t15",
    word: "surrender",
    category: "Spiritual",
    excerpt: "I didn't want to surrender. I wanted to fix it myself. I really, genuinely couldn't.",
    full: "I didn't want to surrender. I wanted to fix it myself. I really, genuinely couldn't. Every attempt made it worse or made me more exhausted. The night I finally said \"I don't know what to do and I can't do this alone\" wasn't a beautiful moment. It was me on a bathroom floor. But it was real. And real was apparently what was needed.",
    date: "2026-02-05T23:16:00Z",
  },
];
