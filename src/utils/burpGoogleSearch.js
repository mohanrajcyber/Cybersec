/** Smart Google search simulation — query-relevant results for Burp Suite lab */

function normalizeQuery(query) {
  return String(query || '').trim().toLowerCase().replace(/\s+/g, ' ')
}

function titleCase(str) {
  return String(str || '')
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function slugify(str) {
  return titleCase(str).replace(/\s+/g, '_').replace(/[^\w-]/g, '')
}

function hashQuery(query) {
  let h = 0
  const s = normalizeQuery(query)
  for (let i = 0; i < s.length; i += 1) h = ((h << 5) - h) + s.charCodeAt(i)
  return Math.abs(h)
}

function highlightSnippet(text, query) {
  const words = normalizeQuery(query).split(/\s+/).filter((w) => w.length > 2)
  if (!words.length) return text
  let out = text
  words.forEach((word) => {
    const re = new RegExp(`(${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    out = out.replace(re, '⟨$1⟩')
  })
  return out
}

function resultItem({ title, url, snippet, favicon = '🌐', date = '' }) {
  return { title, url, snippet, favicon, date }
}

const CURATED = {
  'thalapathy vijay': {
    knowledgePanel: {
      title: 'Vijay',
      subtitle: 'Indian actor · Born 22 June 1974',
      emoji: '🎬',
      facts: ['Also known as Thalapathy', 'Works in Tamil cinema', 'Latest films: Leo, GOAT', 'One of highest-paid actors in India'],
    },
    results: [
      resultItem({ title: 'Vijay (actor) - Wikipedia', url: 'https://en.wikipedia.org/wiki/Vijay_(actor)', favicon: '📘', snippet: 'Joseph Vijay Chandrasekhar, known mononymously as Vijay, is an Indian actor and singer who works in Tamil cinema. Referred to as "Thalapathy", he has appeared in over 65 films.', date: 'Updated 2 days ago' }),
      resultItem({ title: 'Vijay | IMDb', url: 'https://www.imdb.com/name/nm0706787/', favicon: '🎞️', snippet: 'Vijay was born in Chennai and made his cinematic debut as a child actor. Known for Ghilli, Thuppakki, Master, Leo and the upcoming GOAT.', date: 'Filmography · Ratings' }),
      resultItem({ title: 'Thalapathy Vijay - Latest News | The Hindu', url: 'https://www.thehindu.com/search/?q=thalapathy+vijay', favicon: '📰', snippet: 'Latest news, interviews and updates on actor Vijay — box office, audio launches, and Tamil cinema headlines from The Hindu.', date: '3 hours ago' }),
      resultItem({ title: 'Vijay (@actorvijay) • Instagram', url: 'https://www.instagram.com/actorvijay/', favicon: '📸', snippet: 'Official Instagram profile. Followers in millions. Film announcements, behind-the-scenes and fan engagement posts.', date: 'Social media' }),
      resultItem({ title: 'Leo (2023 film) - Wikipedia', url: 'https://en.wikipedia.org/wiki/Leo_(2023_film)', favicon: '📘', snippet: 'Leo is a 2023 Indian Tamil-language action thriller film directed by Lokesh Kanagaraj and starring Vijay in the lead role.', date: 'Box office · Reviews' }),
      resultItem({ title: 'Thalapathy Vijay songs - YouTube Music', url: 'https://music.youtube.com/search?q=thalapathy+vijay', favicon: '▶️', snippet: 'Stream popular Vijay movie songs, album tracks and live performance clips on YouTube Music.', date: 'Videos & albums' }),
    ],
    peopleAlsoAsk: [
      'What is Vijay\'s latest movie?',
      'Why is Vijay called Thalapathy?',
      'How many films has Vijay acted in?',
      'What is Vijay\'s real name?',
    ],
    relatedSearches: ['vijay latest movie 2026', 'thalapathy vijay age', 'vijay family', 'vijay net worth', 'vijay songs', 'vijay upcoming movies'],
  },
  vijay: {
    knowledgePanel: {
      title: 'Vijay',
      subtitle: 'Indian actor · Tamil cinema',
      emoji: '🎬',
      facts: ['Nickname: Thalapathy', 'Debut as child artist', 'Major box-office star in South India'],
    },
    results: [
      resultItem({ title: 'Vijay (actor) - Wikipedia', url: 'https://en.wikipedia.org/wiki/Vijay_(actor)', favicon: '📘', snippet: 'Indian actor and playback singer in Tamil cinema. Popular films include Pokkiri, Kaththi, Mersal, Master and Leo.', date: 'Encyclopedia' }),
      resultItem({ title: 'Vijay Movies List | Rotten Tomatoes', url: 'https://www.rottentomatoes.com/celebrity/vijay', favicon: '🍅', snippet: 'Explore Vijay\'s filmography with critic scores, audience ratings and trailers from Tamil blockbuster releases.', date: 'Ratings' }),
      resultItem({ title: 'Vijay - Latest updates | Times of India', url: 'https://timesofindia.indiatimes.com/topic/Vijay', favicon: '📰', snippet: 'Breaking news, photos and videos about Vijay — cinema, events and entertainment coverage.', date: 'Today' }),
    ],
    peopleAlsoAsk: ['Who is Vijay in Tamil cinema?', 'Vijay latest movie name?', 'Vijay vs Ajith box office?'],
    relatedSearches: ['vijay actor', 'vijay songs', 'vijay movies list', 'thalapathy vijay'],
  },
  nlc: {
    knowledgePanel: {
      title: 'NLC India Limited',
      subtitle: 'Public sector enterprise · Mining & power',
      emoji: '🏭',
      facts: ['Formerly Neyveli Lignite Corporation', 'Headquarters: Neyveli, Tamil Nadu', 'Coal mining & thermal power generation', 'Listed on BSE & NSE'],
    },
    results: [
      resultItem({ title: 'NLC India Limited | Official Website', url: 'https://www.nlcindia.in', favicon: '🏢', snippet: 'NLC India Limited — Navratna CPSE under Ministry of Coal. Lignite mining, power generation, renewable energy and coal mining operations across India.', date: 'Official site' }),
      resultItem({ title: 'NLC India Ltd. (NLCINDIA) Stock Price', url: 'https://finance.yahoo.com/quote/NLCINDIA.NS', favicon: '📈', snippet: 'Live stock quote, historical charts, quarterly results and analyst coverage for NLC India Limited on NSE.', date: 'Market data' }),
      resultItem({ title: 'NLC India Limited - Wikipedia', url: 'https://en.wikipedia.org/wiki/NLC_India_Limited', favicon: '📘', snippet: 'NLC India Limited is a Indian public sector undertaking engaged in mining of lignite and generation of electricity from lignite and coal.', date: 'Company history' }),
      resultItem({ title: 'NLC India recruitment 2026 | Employment news', url: 'https://www.nlcindia.in/careers', favicon: '💼', snippet: 'Current job openings, apprentice notifications and application procedures for NLC India Limited vacancies.', date: 'Careers' }),
      resultItem({ title: 'NLC India news - The Hindu BusinessLine', url: 'https://www.thehindubusinessline.com/search/?q=NLC+India', favicon: '📰', snippet: 'Business news on NLC India — power projects, expansion plans, quarterly earnings and government policy updates.', date: 'This week' }),
    ],
    peopleAlsoAsk: [
      'What is the full form of NLC?',
      'Where is NLC India headquarters?',
      'Is NLC a government company?',
      'NLC India share price today?',
    ],
    relatedSearches: ['nlc india share price', 'nlc recruitment 2026', 'nlc neyveli', 'nlc india careers', 'nlc india limited'],
  },
  'cyber security': {
    knowledgePanel: {
      title: 'Cybersecurity',
      subtitle: 'Protection of computer systems & networks',
      emoji: '🔐',
      facts: ['CIA Triad: Confidentiality, Integrity, Availability', 'Growing career field globally', 'Includes ethical hacking & SOC analysis'],
    },
    results: [
      resultItem({ title: 'What is Cybersecurity? | IBM', url: 'https://www.ibm.com/topics/cybersecurity', favicon: '🔵', snippet: 'Cybersecurity is the practice of protecting systems, networks and programs from digital attacks aimed at accessing, changing or destroying sensitive information.', date: 'Guide' }),
      resultItem({ title: 'Cybersecurity - Wikipedia', url: 'https://en.wikipedia.org/wiki/Computer_security', favicon: '📘', snippet: 'Computer security, cybersecurity or information technology security is the protection of computer systems and networks from information disclosure, theft or damage.', date: 'Overview' }),
      resultItem({ title: 'OWASP Top Ten Web Application Security Risks', url: 'https://owasp.org/www-project-top-ten/', favicon: '🛡️', snippet: 'The OWASP Top 10 is a reference standard for the most critical web application security risks — injection, broken access control, XSS and more.', date: 'Security standard' }),
      resultItem({ title: 'Cyber Security Courses | Coursera', url: 'https://www.coursera.org/courses?query=cyber%20security', favicon: '🎓', snippet: 'Online courses in cybersecurity fundamentals, network security, ethical hacking and incident response from top universities.', date: 'Courses' }),
      resultItem({ title: 'Cybersecurity & Infrastructure Security Agency (CISA)', url: 'https://www.cisa.gov/topics/cybersecurity', favicon: '🇺🇸', snippet: 'Official U.S. guidance on cyber threats, best practices, alerts and resources for organizations and individuals.', date: 'Government' }),
    ],
    peopleAlsoAsk: ['What are the types of cyber attacks?', 'How do I start a career in cybersecurity?', 'What is ethical hacking?', 'What is the CIA triad?'],
    relatedSearches: ['cyber security courses', 'cyber security jobs', 'cyber security salary', 'ethical hacking', 'cyber security pdf'],
  },
  'burp suite': {
    knowledgePanel: {
      title: 'Burp Suite',
      subtitle: 'Web application security testing platform',
      emoji: '🔶',
      facts: ['Developed by PortSwigger', 'Proxy, Scanner, Intruder, Repeater', 'Industry standard for pentesting', 'Used in authorized security assessments'],
    },
    results: [
      resultItem({ title: 'Burp Suite | Web Security Testing Toolkit', url: 'https://portswigger.net/burp', favicon: '🔶', snippet: 'Burp Suite is the leading software for web security testing. Used by security professionals to find vulnerabilities in web applications.', date: 'Official' }),
      resultItem({ title: 'Burp Suite Documentation - PortSwigger', url: 'https://portswigger.net/burp/documentation', favicon: '📄', snippet: 'Complete documentation for Burp Suite Professional and Community Edition — proxy setup, scanner, intruder payloads and extensions.', date: 'Docs' }),
      resultItem({ title: 'Burp Suite Tutorial for Beginners - YouTube', url: 'https://www.youtube.com/results?search_query=burp+suite+tutorial', favicon: '▶️', snippet: 'Step-by-step video tutorials on configuring Burp Proxy, intercepting HTTPS traffic and testing web apps safely in lab environments.', date: 'Videos' }),
      resultItem({ title: 'Web Security Academy - PortSwigger', url: 'https://portswigger.net/web-security', favicon: '🎓', snippet: 'Free online training on web security vulnerabilities with hands-on labs — SQL injection, XSS, CSRF and authentication flaws.', date: 'Free labs' }),
    ],
    peopleAlsoAsk: ['Is Burp Suite free?', 'How does Burp Proxy work?', 'Burp Suite vs OWASP ZAP?', 'What is HTTP intercept?'],
    relatedSearches: ['burp suite download', 'burp suite proxy setup', 'burp suite community edition', 'web security testing tools'],
  },
  python: {
    knowledgePanel: {
      title: 'Python',
      subtitle: 'Programming language · First released 1991',
      emoji: '🐍',
      facts: ['High-level, interpreted language', 'Popular for AI, web, automation', 'Created by Guido van Rossum'],
    },
    results: [
      resultItem({ title: 'Welcome to Python.org', url: 'https://www.python.org', favicon: '🐍', snippet: 'Official Python programming language site. Downloads, documentation, community and the latest Python 3 releases.', date: 'Official' }),
      resultItem({ title: 'Python (programming language) - Wikipedia', url: 'https://en.wikipedia.org/wiki/Python_(programming_language)', favicon: '📘', snippet: 'Python is a high-level, general-purpose programming language emphasizing code readability with significant indentation.', date: 'History' }),
      resultItem({ title: 'Python Tutorial - W3Schools', url: 'https://www.w3schools.com/python/', favicon: '📗', snippet: 'Learn Python basics — syntax, variables, loops, functions, file handling and modules with interactive examples.', date: 'Tutorial' }),
    ],
    peopleAlsoAsk: ['Is Python easy to learn?', 'What is Python used for?', 'Python vs Java — which is better?'],
    relatedSearches: ['python tutorial', 'python download', 'python online compiler', 'python projects'],
  },
  chatgpt: {
    knowledgePanel: {
      title: 'ChatGPT',
      subtitle: 'AI chatbot by OpenAI',
      emoji: '🤖',
      facts: ['Launched November 2022', 'Large language model based', 'Used for writing, coding, Q&A'],
    },
    results: [
      resultItem({ title: 'ChatGPT', url: 'https://chat.openai.com', favicon: '🤖', snippet: 'ChatGPT is an AI assistant by OpenAI that can answer questions, write code, summarize documents and help with creative tasks.', date: 'OpenAI' }),
      resultItem({ title: 'ChatGPT - Wikipedia', url: 'https://en.wikipedia.org/wiki/ChatGPT', favicon: '📘', snippet: 'ChatGPT is a generative artificial intelligence chatbot developed by OpenAI and released in November 2022.', date: 'Overview' }),
      resultItem({ title: 'How to use ChatGPT effectively | ZDNET', url: 'https://www.zdnet.com/article/how-to-use-chatgpt/', favicon: '📰', snippet: 'Tips and prompts to get better results from ChatGPT for work, study and everyday tasks.', date: 'Guide' }),
    ],
    peopleAlsoAsk: ['Is ChatGPT free?', 'Who created ChatGPT?', 'ChatGPT vs Google Gemini?'],
    relatedSearches: ['chatgpt login', 'chatgpt app', 'openai', 'chatgpt free online'],
  },
}

function findCurated(query) {
  const n = normalizeQuery(query)
  if (CURATED[n]) return CURATED[n]

  const keys = Object.keys(CURATED).sort((a, b) => b.length - a.length)
  for (const key of keys) {
    if (n.includes(key) || key.includes(n)) return CURATED[key]
  }
  return null
}

function generateDynamicResults(query) {
  const title = titleCase(query)
  const slug = slugify(query)
  const enc = encodeURIComponent(query)
  const h = hashQuery(query)
  const count = 1_200_000 + (h % 48_000_000)
  const seconds = `0.${18 + (h % 52)}`

  const isPerson = /^[a-z]+(\s+[a-z]+){1,3}$/i.test(query.trim()) && query.trim().split(/\s+/).length <= 4
  const knowledgePanel = isPerson ? {
    title,
    subtitle: 'Public figure · Search results',
    emoji: '👤',
    facts: [`Popular search: "${query}"`, 'Results generated from simulated Google index', 'Click any link to inspect HTTP traffic in Burp'],
  } : null

  const results = [
    resultItem({
      title: `${title} - Wikipedia`,
      url: `https://en.wikipedia.org/wiki/${slug}`,
      favicon: '📘',
      snippet: `${title} — encyclopedia article covering background, history, and key facts. Wikipedia is a free online encyclopedia with millions of articles.`,
      date: 'en.wikipedia.org',
    }),
    resultItem({
      title: `${query} - Latest News | The Hindu`,
      url: `https://www.thehindu.com/search/?q=${enc}`,
      favicon: '📰',
      snippet: `Breaking news and in-depth coverage about ${query}. Read articles, analysis and updates from The Hindu editorial team.`,
      date: `${1 + (h % 5)} hours ago`,
    }),
    resultItem({
      title: `${title} | Official Website`,
      url: `https://www.${slug.replace(/_/g, '').toLowerCase()}.com`,
      favicon: '🏢',
      snippet: `Welcome to the official ${title} website. Find products, services, contact information and the latest announcements.`,
      date: 'Official site',
    }),
    resultItem({
      title: `${query} - YouTube`,
      url: `https://www.youtube.com/results?search_query=${enc}`,
      favicon: '▶️',
      snippet: `Videos about ${query} — tutorials, reviews, interviews and popular clips from creators worldwide.`,
      date: 'Videos',
    }),
    resultItem({
      title: `What is ${title}? - Quora`,
      url: `https://www.quora.com/topic/${slug}`,
      favicon: '💬',
      snippet: `Community answers and discussions about ${query}. Experts and users share opinions, explanations and recommendations.`,
      date: 'Q&A',
    }),
    resultItem({
      title: `${query} - Images`,
      url: `https://www.google.com/search?q=${enc}&tbm=isch`,
      favicon: '🖼️',
      snippet: `Images of ${query} — photos, illustrations, screenshots and visual results from across the web.`,
      date: 'Google Images',
    }),
    resultItem({
      title: `${query} site:reddit.com`,
      url: `https://www.reddit.com/search/?q=${enc}`,
      favicon: '🔴',
      snippet: `Reddit threads and comments discussing ${query}. Community opinions, memes and trending conversations.`,
      date: 'Reddit',
    }),
    resultItem({
      title: `${title} - Amazon.in`,
      url: `https://www.amazon.in/s?k=${enc}`,
      favicon: '🛒',
      snippet: `Shop for ${query} on Amazon.in. Deals, customer reviews, ratings and fast delivery options available.`,
      date: 'Shopping',
    }),
  ]

  const peopleAlsoAsk = [
    `What is ${query}?`,
    `Who is ${title}?`,
    `${title} latest news`,
    `How to learn about ${query}?`,
  ]

  const relatedSearches = [
    `${query} news`,
    `${query} wikipedia`,
    `${query} 2026`,
    `${query} tamil`,
    `${query} latest update`,
    `${query} photos`,
  ]

  return { resultCount: count, seconds, knowledgePanel, results, peopleAlsoAsk, relatedSearches }
}

export function buildGoogleSearchResponse(query) {
  const curated = findCurated(query)
  if (curated) {
    const h = hashQuery(query)
    return {
      resultCount: 2_400_000 + (h % 12_000_000),
      seconds: `0.${22 + (h % 38)}`,
      knowledgePanel: curated.knowledgePanel || null,
      results: curated.results.map((r) => ({
        ...r,
        snippet: highlightSnippet(r.snippet, query),
      })),
      peopleAlsoAsk: curated.peopleAlsoAsk,
      relatedSearches: curated.relatedSearches,
    }
  }

  const dynamic = generateDynamicResults(query)
  return {
    ...dynamic,
    results: dynamic.results.map((r) => ({
      ...r,
      snippet: highlightSnippet(r.snippet, query),
    })),
  }
}

export function buildSitePageContent(page) {
  const { url, siteTitle, sourceQuery } = page
  let host = page.siteHost || page.host || 'example.com'
  try {
    host = new URL(url).host
  } catch { /* keep */ }

  const q = sourceQuery || siteTitle || host
  const title = siteTitle || titleCase(q)

  if (host.includes('wikipedia.org')) {
    return {
      host,
      favicon: '📘',
      heading: title,
      body: `${title} is a topic with extensive coverage on Wikipedia. This simulated article summarizes publicly known information about ${q}.`,
      sections: [
        { h: 'Overview', p: `Readers search for "${q}" to learn background, history, and notable facts. Wikipedia articles are collaboratively edited and cited.` },
        { h: 'See also', p: 'Related topics, references and external links would appear in the full article.' },
      ],
    }
  }

  if (host.includes('youtube.com') || host.includes('music.youtube.com')) {
    return {
      host,
      favicon: '▶️',
      heading: `Videos for "${q}"`,
      body: 'Simulated YouTube results page — video thumbnails, view counts and channel names would load here.',
      sections: [
        { h: 'Top results', p: `Tutorial videos, official clips and fan uploads related to ${q}.` },
      ],
    }
  }

  if (host.includes('instagram.com')) {
    return {
      host,
      favicon: '📸',
      heading: title,
      body: `Instagram profile page for ${title}. Posts, followers count and bio would display in a real browser.`,
      sections: [],
    }
  }

  if (host.includes('thehindu.com') || host.includes('timesofindia') || host.includes('businessline')) {
    return {
      host,
      favicon: '📰',
      heading: `Latest news: ${titleCase(q)}`,
      body: `News desk coverage and analysis on ${q}. Headlines, datelines and reporter bylines appear on the live site.`,
      sections: [
        { h: 'Top story', p: `Editors pick the most relevant developing story connected to "${q}" today.` },
      ],
    }
  }

  if (host.includes('nlcindia.in')) {
    return {
      host,
      favicon: '🏢',
      heading: 'NLC India Limited',
      body: 'Navratna CPSE — lignite mining, thermal power generation and renewable energy projects across India.',
      sections: [
        { h: 'About', p: 'Headquartered at Neyveli, Tamil Nadu. Operations include open-cast lignite mining and power stations.' },
        { h: 'Investors', p: 'Quarterly results, annual reports and stock exchange disclosures.' },
      ],
    }
  }

  if (host.includes('portswigger.net')) {
    return {
      host,
      favicon: '🔶',
      heading: 'Burp Suite — Web Security Testing',
      body: 'Industry-leading toolkit for finding and exploiting web application vulnerabilities during authorized assessments.',
      sections: [
        { h: 'Products', p: 'Burp Suite Professional, Community Edition, and Burp Suite DAST.' },
        { h: 'Web Security Academy', p: 'Free hands-on labs for learning OWASP Top 10 vulnerabilities.' },
      ],
    }
  }

  if (host.includes('imdb.com')) {
    return {
      host,
      favicon: '🎞️',
      heading: title,
      body: `IMDb filmography, biography and ratings for ${title}. Cast, crew, awards and user reviews.`,
      sections: [],
    }
  }

  if (host.includes('amazon.')) {
    return {
      host,
      favicon: '🛒',
      heading: `Amazon results for "${q}"`,
      body: 'Product listings with prices, ratings and delivery estimates would appear here.',
      sections: [],
    }
  }

  if (host.includes('quora.com') || host.includes('reddit.com')) {
    return {
      host,
      favicon: '💬',
      heading: `Discussions about ${titleCase(q)}`,
      body: 'Community questions, answers and threads from users worldwide.',
      sections: [],
    }
  }

  return {
    host,
    favicon: '🌐',
    heading: title,
    body: `Welcome to ${host}. This page was opened from a Google search for "${q}".`,
    sections: [
      { h: 'Content', p: 'In a real browser, the server would return HTML, CSS, JavaScript and media assets for this URL.' },
    ],
  }
}
