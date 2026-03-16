import type { Course } from './types'

export const courses: Course[] = [
  // ═══════════════════════════════════════════
  // ART 🎨
  // ═══════════════════════════════════════════
  {
    id: 'art-impressionism-101',
    domain: 'art',
    title: 'Impressionism 101',
    subtitle: 'The rebels who changed how we see',
    description: 'How a group of rejected painters invented modern art in Parisian cafés.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Claude_Monet_-_Water_Lilies_-_1906%2C_Ryerson.jpg',
    color: '#2e7d32',
    difficulty: 'beginner',
    estimatedMinutes: 12,
    lessons: [
      {
        id: 'imp-1',
        title: 'The Salon Rejects',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Claude_Monet%2C_Impression%2C_soleil_levant%2C_1872.jpg/1280px-Claude_Monet%2C_Impression%2C_soleil_levant%2C_1872.jpg',
        content: `In 1874, a group of painters held their own exhibition in Paris after being rejected by the Salon — the official art establishment that decided what counted as "real art."\n\nA critic saw Claude Monet's painting *Impression, Sunrise* — a hazy harbor scene — and mocked it. He called the whole group "Impressionists." He meant it as an insult.\n\nThey kept the name.\n\nThe Salon wanted finished, polished paintings with mythological subjects and smooth brushwork. These rebels painted everyday life — cafés, train stations, gardens — with visible brushstrokes and vivid color. They painted *light itself*, not things.`,
        funFact: '"Impressionism" started as an insult from a critic. They kept the name anyway.',
        quiz: {
          question: 'How did the Impressionists get their name?',
          options: [
            'They chose it as a manifesto',
            'A critic used it mockingly, and they embraced it',
            'It was the name of their first gallery',
            'It comes from a French word meaning "light"',
          ],
          correctIndex: 1,
          explanation: 'A critic named Louis Leroy used "Impressionist" as an insult after seeing Monet\'s *Impression, Sunrise*. The group adopted the name with pride.',
        },
      },
      {
        id: 'imp-2',
        title: 'Monet\'s Obsession with Light',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Claude_Monet_-_Water_Lilies_-_1906%2C_Ryerson.jpg',
        content: `Claude Monet didn't paint things. He painted what light did to things.\n\nHe would set up multiple canvases in a row and switch between them as the sun moved. His series of Rouen Cathedral — over 30 paintings of the same building — shows how completely different a single subject looks at dawn, noon, and dusk.\n\nHe spent the last 30 years of his life painting his water garden in Giverny. Over 250 paintings of water lilies. By the end, his eyesight was failing from cataracts, and the paintings became more abstract — more blurred, more dissolved.\n\nHis failing eyes pushed him toward abstraction decades before it became a movement.`,
        funFact: 'Monet painted the same cathedral 30+ times — once for every change of light.',
        quiz: {
          question: 'Why did Monet set up multiple canvases side by side?',
          options: [
            'He was painting different subjects',
            'He liked to work fast on multiple paintings',
            'He switched canvases as the light changed throughout the day',
            'Each canvas was for a different buyer',
          ],
          correctIndex: 2,
          explanation: 'Monet would paint the same subject on different canvases as the light shifted, capturing how a scene transforms from dawn to dusk.',
        },
      },
      {
        id: 'imp-3',
        title: 'Renoir and the Joy of Living',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Pierre-Auguste_Renoir%2C_Le_Moulin_de_la_Galette.jpg/1280px-Pierre-Auguste_Renoir%2C_Le_Moulin_de_la_Galette.jpg',
        content: `If Monet painted light, Pierre-Auguste Renoir painted happiness.\n\nHis masterpiece *Bal du moulin de la Galette* shows a Sunday afternoon dance in Montmartre. Dappled sunlight falls through trees onto dancing couples. Everyone is smiling. The light is golden and warm.\n\nRenoir was the son of a tailor and a seamstress. He started as a porcelain painter at 13. He never forgot what it felt like to be poor, and he spent his life painting abundance — full tables, rosy cheeks, sun-drenched afternoons.\n\nIn his final years, his hands were so crippled by rheumatoid arthritis that brushes had to be strapped to his fingers. He kept painting. When asked why he continued through such pain, he said: "The pain passes, but the beauty remains."`,
        funFact: '"The pain passes, but the beauty remains." — Renoir, painting with brushes strapped to arthritic hands.',
        quiz: {
          question: 'What did Renoir say when asked why he kept painting despite his arthritis?',
          options: [
            '"Art is my only medicine"',
            '"The pain passes, but the beauty remains"',
            '"I have no choice — painting is breathing"',
            '"My hands may fail but my eyes never will"',
          ],
          correctIndex: 1,
          explanation: 'Renoir continued painting until his death in 1919, with brushes strapped to his arthritic hands, driven by the belief that beauty outlasts suffering.',
        },
      },
      {
        id: 'imp-4',
        title: 'Degas and the Unseen Moment',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Edgar_Degas_-_La_classe_de_danse_1874.jpg/1098px-Edgar_Degas_-_La_classe_de_danse_1874.jpg',
        content: `Edgar Degas hated being called an Impressionist. He preferred "Realist." But his work hung in their exhibitions, so the name stuck.\n\nDegas didn't paint landscapes or sunlight. He painted ballet dancers — but never during performances. He painted them stretching, resting, adjusting their shoes, practicing in empty studios. The unglamorous moments.\n\nHis compositions look like photographs — figures cut off at the edge, shot from odd angles, caught mid-movement. This wasn't accidental. Photography was new, and Degas studied it obsessively. He wanted paintings that felt like glimpsed moments, not posed scenes.\n\nMore than half of his works feature dancers. He knew their world intimately — the exhaustion, the discipline, the brief moments of grace.`,
        funFact: 'Degas hated being called an Impressionist. He painted ballet dancers at rest, never performing.',
        quiz: {
          question: 'What made Degas\'s compositions look unusual for his time?',
          options: [
            'He used very bright, unrealistic colors',
            'He composed them like photographs — cropped, angled, caught mid-motion',
            'He painted exclusively from memory',
            'He used only a single brushstroke technique',
          ],
          correctIndex: 1,
          explanation: 'Degas studied photography and brought its cropped, candid quality into his paintings — figures cut off at the frame edge, unusual angles, and unstaged moments.',
        },
      },
    ],
  },

  {
    id: 'art-iconic-paintings',
    domain: 'art',
    title: 'Stories Behind Iconic Paintings',
    subtitle: 'The truths you never knew',
    description: 'The real stories behind the world\'s most famous artworks — none of them are what you think.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg',
    color: '#1a237e',
    difficulty: 'beginner',
    estimatedMinutes: 15,
    lessons: [
      {
        id: 'icon-1',
        title: 'The Starry Night',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg',
        content: `Van Gogh painted this from the window of his asylum room in Saint-Rémy-de-Provence. He had voluntarily committed himself after severing part of his ear.\n\nThe swirling sky isn't madness on canvas — modern physicists discovered the turbulence patterns match Kolmogorov's mathematical model of turbulent flow with uncanny precision. Van Gogh was painting real physics he could somehow *see*.\n\nThe village below is calm, almost geometric. The cypress tree in the foreground reaches up like a dark flame connecting earth to sky.\n\nHe painted it from memory during the day, not at night. The starry sky was how he *remembered* feeling, not what he saw.`,
        funFact: 'The swirl patterns match a real mathematical model of turbulence. Van Gogh saw physics.',
        quiz: {
          question: 'When did Van Gogh paint The Starry Night?',
          options: [
            'At night, looking out his window',
            'During the day, from memory',
            'In a studio in Paris',
            'On a hilltop overlooking the village',
          ],
          correctIndex: 1,
          explanation: 'Van Gogh painted The Starry Night from memory during the day. The night sky is how he remembered feeling, not a direct observation.',
        },
      },
      {
        id: 'icon-2',
        title: 'Nighthawks',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Nighthawks_by_Edward_Hopper_1942.jpg/1280px-Nighthawks_by_Edward_Hopper_1942.jpg',
        content: `There is no door. Look carefully — the diner has no visible entrance. The four people inside are sealed in light, separated from the dark street by curved glass.\n\nHopper painted this weeks after Pearl Harbor. America had just entered World War II. The empty streets, the isolation, the harsh fluorescent light — it captured a nation's anxiety.\n\nThe couple sitting together don't touch. The man alone has his back to us. The server is the only one who seems at ease. Everyone is together, but everyone is alone.\n\nThe diner was based on a real restaurant in Greenwich Village, Manhattan. It was demolished long ago. The painting outlived the place.`,
        funFact: 'There is no door to the diner. The people inside are sealed in light.',
        quiz: {
          question: 'What historical event had just happened when Hopper painted Nighthawks?',
          options: [
            'The Great Depression began',
            'World War I ended',
            'The attack on Pearl Harbor',
            'The stock market crashed in 1929',
          ],
          correctIndex: 2,
          explanation: 'Hopper painted Nighthawks in early 1942, just weeks after Pearl Harbor. The painting\'s mood of isolation and anxiety mirrors the national feeling.',
        },
      },
      {
        id: 'icon-3',
        title: 'The Great Wave',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Tsunami_by_hokusai_19th_century.jpg/1280px-Tsunami_by_hokusai_19th_century.jpg',
        content: `Hokusai was 70 years old when he made this. He said: "All I have produced before the age of seventy is not worth taking into account."\n\nLook past the wave. Mount Fuji sits in the background — tiny, still, eternal. The fishermen in three boats cling to their vessels. The wave towers above everything, its fingers of foam reaching like claws.\n\nThis is a woodblock print, not a painting. Each color required a separate carved block, perfectly aligned. Thousands of copies were printed — this was pop art, sold for the price of a bowl of noodles.\n\nThe Prussian blue pigment was brand new to Japan, recently imported from Europe. Hokusai was one of the first to use it. Debussy hung a copy above his piano. It inspired *La Mer*.`,
        funFact: 'Hokusai was 70. It sold for the price of noodles. Debussy hung it above his piano.',
        quiz: {
          question: 'What is The Great Wave technically?',
          options: [
            'An oil painting on canvas',
            'A watercolor sketch',
            'A woodblock print',
            'A fresco on a temple wall',
          ],
          correctIndex: 2,
          explanation: 'The Great Wave is a woodblock print — carved into cherry wood, inked, and pressed onto paper. Thousands of copies were made, each requiring multiple blocks for different colors.',
        },
      },
      {
        id: 'icon-4',
        title: 'Guernica',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/7/74/Guernica.jpg',
        content: `On April 26, 1937, Nazi warplanes bombed the Basque town of Guernica. It was market day. The bombing lasted three hours.\n\nPicasso, living in Paris, read about it in the newspaper. He completed this 11-foot-tall, 25-foot-wide mural in just over a month.\n\nThere is no color. Only black, white, and grey — like the newspaper photos that brought the horror to the world. A bull stands over a woman holding her dead child. A horse screams. A light bulb shaped like an evil eye illuminates the scene.\n\nWhen asked by a Nazi officer if he had made this painting, Picasso replied: "No, you did."\n\nDuring Franco's dictatorship, Picasso refused to let it return to Spain. It went home in 1981, six years after Franco's death.`,
        funFact: 'A Nazi officer asked Picasso if he made this. "No, you did."',
        quiz: {
          question: 'Why is Guernica painted only in black, white, and grey?',
          options: [
            'Picasso was colorblind',
            'He couldn\'t afford color paint',
            'It mirrors the black-and-white newspaper photos that reported the bombing',
            'The Spanish government requested it',
          ],
          correctIndex: 2,
          explanation: 'The monochrome palette echoes the newspaper photographs that brought news of the bombing to the world — giving the painting the immediacy of reportage.',
        },
      },
    ],
  },

  // ═══════════════════════════════════════════
  // WINE 🍷
  // ═══════════════════════════════════════════
  {
    id: 'wine-red-grapes',
    domain: 'wine',
    title: 'Red Grapes You Should Know',
    subtitle: 'The big four — and why they matter',
    description: 'Learn the four red grapes that make most of the world\'s great wine.',
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80',
    color: '#722F37',
    difficulty: 'beginner',
    estimatedMinutes: 10,
    lessons: [
      {
        id: 'red-1',
        title: 'Cabernet Sauvignon — The King',
        imageUrl: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&q=80',
        imageCredit: 'Unsplash',
        content: `Cabernet Sauvignon is the most planted grape in the world. It grows almost everywhere, and almost everywhere it makes something good.\n\nIt's a genetic cross between Cabernet Franc and Sauvignon Blanc — an accidental marriage discovered in a 17th-century Bordeaux vineyard. The result: small, thick-skinned berries packed with tannin, color, and flavor.\n\nIn Bordeaux, it's blended with Merlot and other grapes. In Napa Valley, it stands alone. Both approaches produce legendary wines.\n\nThe flavor profile is distinctive: blackcurrant (cassis), cedar, tobacco, and often a touch of green bell pepper. That pepper note comes from a compound called pyrazine — if you can smell it, you'll never un-smell it.\n\nCabernet ages beautifully. Those aggressive tannins soften over decades into velvet.`,
        funFact: 'Cabernet Sauvignon is an accident — a natural cross between two other grapes in a Bordeaux vineyard.',
        quiz: {
          question: 'What two grapes naturally crossed to create Cabernet Sauvignon?',
          options: [
            'Pinot Noir and Chardonnay',
            'Merlot and Syrah',
            'Cabernet Franc and Sauvignon Blanc',
            'Grenache and Mourvèdre',
          ],
          correctIndex: 2,
          explanation: 'Cabernet Sauvignon is a natural cross of Cabernet Franc and Sauvignon Blanc, discovered in a Bordeaux vineyard in the 1600s.',
        },
      },
      {
        id: 'red-2',
        title: 'Pinot Noir — The Heartbreak Grape',
        imageUrl: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=800&q=80',
        imageCredit: 'Unsplash',
        content: `Winemakers call it the heartbreak grape. Thin-skinned, temperamental, susceptible to every disease. It refuses warm climates. It hates heavy soil. It punishes anyone who tries to control it.\n\nAnd when it's right — when terroir, vintage, and winemaker align — nothing else comes close.\n\nPinot Noir is the sole red grape of Burgundy, where a single vineyard can produce wine worth thousands while the field next door makes something merely good.\n\nCistercian monks spent centuries mapping which plots produced the best wine, stone by stone. Modern soil analysis confirmed what they knew by taste.\n\nGreat Pinot tastes like: red cherries, earth, mushroom, silk. It should make you pause. It should make you quiet.`,
        funFact: 'Monks mapped Burgundy\'s vineyards for 700 years. Modern science confirmed they were right.',
        quiz: {
          question: 'Why is Pinot Noir called "the heartbreak grape"?',
          options: [
            'It makes people emotional when they drink it',
            'It\'s thin-skinned and extremely difficult to grow well',
            'The vines die after only a few years',
            'It was the favorite grape of a heartbroken French king',
          ],
          correctIndex: 1,
          explanation: 'Pinot Noir is thin-skinned, disease-prone, climate-sensitive, and demands perfect conditions. It breaks the hearts of winemakers who try and fail to produce great wine from it.',
        },
      },
      {
        id: 'red-3',
        title: 'Merlot — The Misunderstood One',
        imageUrl: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=800&q=80',
        imageCredit: 'Unsplash',
        content: `Merlot got a bad reputation. The movie *Sideways* (2004) had a famous line — "I am NOT drinking any Merlot!" — and overnight, Merlot sales dropped across America.\n\nThe irony? The wine the character *loved* — Château Cheval Blanc — is mostly Merlot.\n\nMerlot is Cabernet's softer sibling. Where Cabernet is angular and tannic, Merlot is round and plush. Plums instead of blackcurrants. Chocolate instead of cedar. It's approachable young but can age with grace.\n\nIn Bordeaux's Right Bank — Pomerol and Saint-Émilion — Merlot dominates. Château Pétrus, one of the most expensive wines on Earth, is nearly 100% Merlot.\n\nDon't let a movie script tell you what to drink.`,
        funFact: 'The wine the Sideways character loved most — Château Cheval Blanc — is mostly Merlot.',
        quiz: {
          question: 'What happened to Merlot sales after the movie Sideways?',
          options: [
            'They skyrocketed because of the publicity',
            'They dropped significantly after the famous anti-Merlot line',
            'They stayed exactly the same',
            'The movie didn\'t mention Merlot',
          ],
          correctIndex: 1,
          explanation: 'After the character Miles dismisses Merlot in Sideways, real-world Merlot sales dropped measurably — the so-called "Sideways Effect."',
        },
      },
      {
        id: 'red-4',
        title: 'Syrah / Shiraz — Two Names, One Grape',
        imageUrl: 'https://images.unsplash.com/photo-1569919659476-f0852f9186be?w=800&q=80',
        imageCredit: 'Unsplash',
        content: `Syrah in France. Shiraz in Australia. Same grape, wildly different personalities.\n\nIn the Northern Rhône — Hermitage, Côte-Rôtie — Syrah makes elegant, peppery, smoky wines with notes of violets and dark fruit. These are some of the longest-lived wines in the world.\n\nIn Australia's Barossa Valley, the same grape becomes Shiraz: bigger, bolder, riper. Dark chocolate, espresso, blackberry jam. Turn the volume up to 11.\n\nThe grape's origin was a mystery for centuries. Legend placed it in Shiraz, Persia. DNA testing revealed the truth: it's a cross between two obscure French grapes, Dureza and Mondeuse Blanche. Not exotic at all — just French.\n\nBut it adapts to its home like no other grape. Same DNA, completely different expression. That's the magic of wine.`,
        funFact: 'DNA proved Syrah isn\'t from Persia — it\'s a cross between two obscure French grapes.',
        quiz: {
          question: 'Where does Syrah/Shiraz actually originate?',
          options: [
            'The city of Shiraz in Persia',
            'France — it\'s a cross of two obscure French grapes',
            'Ancient Rome',
            'South Africa',
          ],
          correctIndex: 1,
          explanation: 'Despite the name "Shiraz" suggesting Persian origins, DNA testing proved it\'s a natural cross of Dureza and Mondeuse Blanche — both from the Rhône Valley in France.',
        },
      },
    ],
  },

  {
    id: 'wine-how-to-taste',
    domain: 'wine',
    title: 'How to Actually Taste Wine',
    subtitle: 'Look. Smell. Sip. Think.',
    description: 'A no-nonsense guide to tasting wine like a pro — without the pretension.',
    imageUrl: 'https://images.unsplash.com/photo-1547595628-c61a32ede2e3?w=800&q=80',
    color: '#880e4f',
    difficulty: 'beginner',
    estimatedMinutes: 8,
    lessons: [
      {
        id: 'taste-1',
        title: 'Look — What Color Tells You',
        imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80',
        imageCredit: 'Unsplash',
        content: `Tilt your glass over a white surface. The color tells you more than you'd think.\n\n**Red wines** start purple-ruby when young and fade to garnet-brick with age. A deep, opaque red suggests thick-skinned grapes (Cabernet, Syrah) or warm climates. A pale, translucent red suggests thin-skinned grapes (Pinot Noir) or cool climates.\n\n**White wines** go the opposite direction: pale straw when young, deepening to gold and amber with age. If a white wine looks dark gold, it's either old, oak-aged, or both.\n\nLook at the "legs" — the rivulets that run down the glass after swirling. Thick, slow legs mean higher alcohol or sugar. It's physics (the Marangoni effect), not quality.`,
        funFact: 'Red wines get lighter with age. White wines get darker. They meet in the middle.',
        quiz: {
          question: 'What do thick, slow "legs" on a wine glass indicate?',
          options: [
            'High quality wine',
            'Higher alcohol or sugar content',
            'The wine is very old',
            'The glass is dirty',
          ],
          correctIndex: 1,
          explanation: 'Wine legs are caused by the Marangoni effect — a physics phenomenon related to alcohol evaporation. Thicker legs = more alcohol or sugar. It says nothing about quality.',
        },
      },
      {
        id: 'taste-2',
        title: 'Smell — Your Secret Weapon',
        imageUrl: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=800&q=80',
        imageCredit: 'Unsplash',
        content: `80% of what you "taste" is actually smell. Your tongue detects only five things: sweet, sour, salty, bitter, umami. Everything else — cherry, vanilla, leather, wet stone — that's your nose.\n\nFirst, smell the wine without swirling. These are the lightest, most volatile aromas: flowers, citrus, fresh fruit.\n\nThen swirl and smell again. The oxygen releases heavier compounds: spice, oak, earth, dried fruit.\n\n**Don't overthink it.** When you smell something, your brain is pattern-matching against memories. If it smells like your grandmother's garden — say that. If it smells like a new book — say that. There are no wrong answers.\n\nThe vocabulary will come with practice. The most important skill is paying attention.`,
        funFact: '80% of what you "taste" is actually smell. Your tongue only detects 5 basic tastes.',
        quiz: {
          question: 'Why should you smell wine before AND after swirling?',
          options: [
            'Swirling warms the wine up',
            'It\'s just tradition — no real difference',
            'Before reveals light aromas; after reveals heavier compounds released by oxygen',
            'Swirling removes bad smells',
          ],
          correctIndex: 2,
          explanation: 'Un-swirled wine releases its lightest, most volatile aromas first. Swirling introduces oxygen that releases heavier, more complex compounds — giving you two layers of information.',
        },
      },
      {
        id: 'taste-3',
        title: 'Sip — The Structure of Wine',
        imageUrl: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=800&q=80',
        imageCredit: 'Unsplash',
        content: `Take a sip. Don't swallow immediately. Let it coat your mouth.\n\nYou're looking for four things:\n\n**Sweetness** — detected at the tip of the tongue. Most table wines are dry (no residual sugar), but fruit flavors can trick you into thinking a wine is sweet when it isn't.\n\n**Acidity** — that mouth-watering, salivating sensation. It makes wine feel fresh and alive. Low acid wines feel flat and flabby.\n\n**Tannin** (reds only) — the drying, gripping sensation on your gums, like over-steeped tea. Tannins come from grape skins, seeds, and oak barrels. They soften with age.\n\n**Body** — is it light like water, medium like milk, or full like cream? This comes from alcohol, sugar, and extract.\n\nThe best wines have *balance* — no single element dominates. Acidity, tannin, fruit, and alcohol in harmony.`,
        funFact: 'Tannin is the same compound that makes over-steeped tea taste drying and bitter.',
        quiz: {
          question: 'What does "balance" mean when describing wine?',
          options: [
            'Equal parts red and white grapes',
            'No single element (acid, tannin, fruit, alcohol) dominates',
            'The wine is exactly room temperature',
            'It has equal amounts of sweetness and acidity',
          ],
          correctIndex: 1,
          explanation: 'A balanced wine has harmony between its key structural elements — acidity, tannin, fruit, and alcohol — with none overpowering the others.',
        },
      },
    ],
  },

  // ═══════════════════════════════════════════
  // CULTURE 🏛️
  // ═══════════════════════════════════════════
  {
    id: 'culture-design-principles',
    domain: 'culture',
    title: 'Design That Changed the World',
    subtitle: 'Ideas that shaped how we live',
    description: 'From Bauhaus to Apple — the design movements that defined modern life.',
    imageUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=800&q=80',
    color: '#37474f',
    difficulty: 'beginner',
    estimatedMinutes: 10,
    lessons: [
      {
        id: 'des-1',
        title: 'Bauhaus — Where Art Met Industry',
        imageUrl: 'https://images.unsplash.com/photo-1545060894-7843d1d0ae0e?w=800&q=80',
        imageCredit: 'Unsplash',
        content: `In 1919, Walter Gropius opened a school in Weimar, Germany with a radical idea: no distinction between artist and craftsman. A painter should learn to weave. A sculptor should learn to build furniture.\n\nThe Bauhaus lasted only 14 years. The Nazis closed it in 1933, calling it "degenerate." In those 14 years, it changed everything.\n\nMarcel Breuer invented the tubular steel chair — the one in every office you've ever worked in. Paul Klee and Wassily Kandinsky taught there simultaneously.\n\n"Form follows function" is often attributed to the Bauhaus, but they believed something subtler: form and function are inseparable. Beauty isn't decoration added on top. Beauty is what happens when something works perfectly.\n\nEvery minimal website, every clean app interface — that's Bauhaus.`,
        funFact: 'The Bauhaus lasted only 14 years before the Nazis closed it. Those 14 years changed everything.',
        quiz: {
          question: 'What was the Bauhaus\'s radical founding idea?',
          options: [
            'Art should only be in museums',
            'No distinction between artist and craftsman — art should serve life',
            'Machines should replace handcraft entirely',
            'Only abstract art is valid',
          ],
          correctIndex: 1,
          explanation: 'Gropius believed artists and craftsmen should learn from each other. A painter should know weaving, a sculptor should build furniture. Art and functional design were one discipline.',
        },
      },
      {
        id: 'des-2',
        title: 'Dieter Rams — Less, But Better',
        imageUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=800&q=80',
        imageCredit: 'Unsplash',
        content: `Dieter Rams spent 40 years as head of design at Braun. Every product he made still looks modern.\n\nHis principle: *Weniger, aber besser* — less, but better. Every element must justify its existence. If it doesn't serve function or understanding, remove it.\n\nHis ten principles of good design became a manifesto:\n\n• Good design is innovative\n• Good design makes a product useful\n• Good design is aesthetic\n• Good design is unobtrusive\n• Good design is honest\n• Good design is long-lasting\n• Good design is thorough down to the last detail\n• Good design is as little design as possible\n\nJony Ive cited Rams as his primary inspiration. The iPod, iPhone, MacBook — they're all conversations with Rams's work from decades earlier.\n\nRams is now in his 90s. He worries we're drowning in badly designed things. He might be right.`,
        funFact: '"Less, but better." The iPod was a direct conversation with Rams\'s Braun designs.',
        quiz: {
          question: 'What does Rams\'s motto "Weniger, aber besser" mean?',
          options: [
            'Cheaper is always better',
            'Less, but better',
            'Beauty over function',
            'Simple means incomplete',
          ],
          correctIndex: 1,
          explanation: '"Weniger, aber besser" — less, but better. Every element must earn its place. If removing something doesn\'t hurt the product, it shouldn\'t have been there.',
        },
      },
      {
        id: 'des-3',
        title: 'Wabi-Sabi — Beauty in Imperfection',
        imageUrl: 'https://images.unsplash.com/photo-1545048702-79362596cdc9?w=800&q=80',
        imageCredit: 'Unsplash',
        content: `In Japan, when a bowl breaks, it's sometimes repaired with gold. The cracks become the design — visible, celebrated, more beautiful than the original. This is kintsugi.\n\nKintsugi embodies wabi-sabi: the Japanese philosophy of finding beauty in imperfection, impermanence, and incompleteness.\n\nWabi originally meant the loneliness of living in nature. Sabi meant "lean" or "withered." Together: an appreciation for the authentic, the worn, the modest.\n\nThe tea ceremony is wabi-sabi made ritual. The tea room is small and simple. The ceramic is unglazed. The flower arrangement uses a single stem. Everything says: this imperfect moment is enough.\n\nIn a world that worships the new, the polished, the symmetrical — wabi-sabi is a radical act of attention.`,
        funFact: 'Kintsugi repairs broken pottery with gold. The cracks become the most beautiful part.',
        quiz: {
          question: 'What is kintsugi?',
          options: [
            'A Japanese martial art',
            'The practice of repairing broken pottery with gold',
            'A form of minimalist architecture',
            'A meditation technique',
          ],
          correctIndex: 1,
          explanation: 'Kintsugi (golden joinery) repairs broken ceramics with gold lacquer, making the breaks visible and beautiful — embodying wabi-sabi\'s embrace of imperfection.',
        },
      },
    ],
  },

  {
    id: 'culture-conversation',
    domain: 'culture',
    title: 'Social Intelligence',
    subtitle: 'The unwritten rules',
    description: 'How to hold a room, read a table, and never be the boring one at dinner.',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
    color: '#1565c0',
    difficulty: 'beginner',
    estimatedMinutes: 8,
    lessons: [
      {
        id: 'soc-1',
        title: 'The Art of Conversation',
        imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
        imageCredit: 'Unsplash',
        content: `The best conversationalists are not great talkers. They are great listeners who ask the right questions.\n\nSocrates knew this. His method wasn't lecturing — it was asking questions that made the other person discover the answer themselves.\n\n**Ask follow-up questions.** When someone tells you something, resist the urge to share your own experience. Ask: "What happened then?" People remember how you made them feel, not what you said.\n\n**Be comfortable with silence.** A pause after someone speaks isn't awkward — it's respectful. It means you're actually thinking.\n\n**Match energy, not topic.** If someone is excited about something you know nothing about, don't redirect. Ask them to explain. Their enthusiasm is the gift.\n\nThe French call it *l'art de la conversation* — treating a conversation like a tennis rally. The goal is to keep the ball in the air, not to win.`,
        funFact: 'The French treat conversation like tennis — the goal is rallying, not winning.',
        quiz: {
          question: 'According to the Socratic method, the most powerful conversation technique is:',
          options: [
            'Telling compelling stories',
            'Sharing your own experiences first',
            'Asking questions that let the other person discover answers',
            'Speaking with confidence and authority',
          ],
          correctIndex: 2,
          explanation: 'Socrates rarely lectured. He asked questions that guided people to discover insights on their own — making the learning (and the conversation) far more memorable.',
        },
      },
      {
        id: 'soc-2',
        title: 'Reading the Room',
        imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
        imageCredit: 'Unsplash',
        content: `Table placement at a dinner party is never random. In French dining tradition, the host and hostess sit at opposite ends. The most important guest sits to the right of the host. Couples are separated to encourage new conversations.\n\nKnowing this means you can read the social dynamics of any gathering before a word is spoken.\n\n**The bread rule:** your bread plate is on your left, your drink is on your right. Make "OK" signs with both hands — left makes a "b" (bread), right makes a "d" (drink).\n\n**Fork and knife signals:** Finished? Place both parallel on the plate at 4 o'clock. Pausing? Cross them in an X on the plate. Waitstaff are trained to read these.\n\n**The real skill** isn't memorizing rules — it's making everyone around you comfortable. The person who notices someone is left out and brings them into the conversation has more social intelligence than someone who knows which fork to use.`,
        funFact: 'Your silverware talks: crossed = pausing, parallel at 4 o\'clock = finished.',
        quiz: {
          question: 'At a formal dinner, where does the most important guest sit?',
          options: [
            'At the head of the table',
            'To the left of the hostess',
            'To the right of the host',
            'Wherever they choose',
          ],
          correctIndex: 2,
          explanation: 'In French dining tradition, the guest of honor sits to the right of the host. The second most important guest sits to the right of the hostess.',
        },
      },
    ],
  },
]

// ── Helpers ──

export function getAllCourses(): Course[] {
  return courses
}

export function getCourseById(id: string): Course | undefined {
  return courses.find(c => c.id === id)
}

export function getCoursesByDomain(domain: string): Course[] {
  if (domain === 'all') return courses
  return courses.filter(c => c.domain === domain)
}
