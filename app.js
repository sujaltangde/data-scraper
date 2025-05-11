import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer'
import axios from 'axios'
import xml2js from 'xml2js'
const currentDirectory = process.cwd();



async function webScraper(feed) {
  try {
    const browser = await puppeteer.launch({});
    const page = await browser.newPage();
    await page.goto(feed.url);

    let titleElement = await page.waitForSelector(".dAzQyd");
    let title = await page.evaluate(
      (element) => element.textContent,
      titleElement
    );

    let authorElement = await page.waitForSelector(".lasLGY");
    let author = await page.evaluate(
      (element) => element.textContent,
      authorElement
    );

    let datetimeElement = await page.waitForSelector(".IvNnh", { visible: true });
    let publish_date = await page.evaluate(
      (element) => element.getAttribute("datetime"),
      datetimeElement
    );

    let content = await page.evaluate(() => {
      const elements = document.querySelectorAll(
        ".sc-9a00e533-0.hxuGS:not(.class3):not(.class4)"
      );

      return Array.from(elements)
        .map((element) => element.textContent)
        .join(" ");
    });

    let tags = await page.evaluate(() => {
      const tagElements = document.querySelectorAll(".emeJAW");
      return Array.from(tagElements)
        .map((element) => element.textContent.trim())
        .join(", ");
    });

    let result = {
      title,
      content,
      author,
      url: feed.url,
      category: feed.category,
      publish_date,
      tags,
    };

    await browser.close();
    return result;

  } catch (error) {
    console.error(`Error scraping ${feed.url}:`, error.message);
    return null; // Return null if scraping fails for this article
  }
}

const allArticles = [
  {
    category: 'Culture',
    url: 'https://www.bbc.com/culture/article/20250508-eurovision-2025-the-provocative-estonian-pop-song-that-has-outraged-some-italian?ocid=global_culture_rss'
  },
  {
    category: 'Culture',
    url: 'https://www.bbc.com/culture/article/20250507-the-stunning-retro-space-age-homes-that-are-perfect-for-today?ocid=global_culture_rss'
  },
  {
    category: 'Culture',
    url: 'https://www.bbc.com/culture/article/20250506-the-lost-1934-novel-that-gave-a-chilling-warning-about-the-horrors-of-nazi-germany?ocid=global_culture_rss'
  },
  {
    category: 'Culture',
    url: 'https://www.bbc.com/culture/article/20250501-the-terrifying-stunts-of-a-french-film-legend?ocid=global_culture_rss'
  },
  {
    category: 'Culture',
    url: 'https://www.bbc.com/culture/article/20240607-it-was-the-cleverest-escape-in-the-prisons-30-years-the-men-who-broke-out-of-alcatraz-with-a-spoon?ocid=global_culture_rss'
  },
  {
    category: 'Culture',
    url: 'https://www.bbc.com/culture/article/20250501-the-cold-war-spy-mystery-of-buster-crabb?ocid=global_culture_rss'
  },
  {
    category: 'Culture',
    url: 'https://www.bbc.com/culture/article/20250502-how-black-men-have-used-bold-fashion-as-resistance?ocid=global_culture_rss'
  },
  {
    category: 'World',
    url: 'https://www.bbc.com/news/articles/ce821nl3251o'
  },
  {
    category: 'World',
    url: 'https://www.bbc.com/news/articles/cvg9d913v20o'
  },
  {
    category: 'World',
    url: 'https://www.bbc.com/news/articles/c0qgz18glljo'
  },
  {
    category: 'World',
    url: 'https://www.bbc.com/news/articles/c1kv7v3z70jo'
  },
  {
    category: 'World',
    url: 'https://www.bbc.com/news/articles/c0r18dp9lxxo'
  },
  {
    category: 'World',
    url: 'https://www.bbc.com/news/articles/cn053edex5eo'
  },
  {
    category: 'World',
    url: 'https://www.bbc.com/news/articles/c071elp1rv1o'
  },
  {
    category: 'World Asia',
    url: 'https://www.bbc.com/news/articles/c74qjjvzlgjo'
  },
  {
    category: 'World Asia',
    url: 'https://www.bbc.com/news/articles/clyzg8ygeezo'
  },
  {
    category: 'World Asia',
    url: 'https://www.bbc.com/news/articles/cp8dnre9901o'
  },
  {
    category: 'World Asia',
    url: 'https://www.bbc.com/news/articles/c753ng233nvo'
  },
  {
    category: 'World Asia',
    url: 'https://www.bbc.com/news/articles/cwy6w6507wqo'
  },
  {
    category: 'World Asia',
    url: 'https://www.bbc.com/news/articles/c4gkvp6438ko'
  },
  {
    category: 'World Asia',
    url: 'https://www.bbc.com/news/articles/cjrndypy3l4o'
  },
  {
    category: 'Entertainment & Arts',
    url: 'https://www.bbc.com/news/articles/c7875y27y08o'
  },
  {
    category: 'Entertainment & Arts',
    url: 'https://www.bbc.com/news/articles/cvgpge1lmkyo'
  },
  {
    category: 'Entertainment & Arts',
    url: 'https://www.bbc.com/news/articles/cdr5lvgzz07o'
  },
  {
    category: 'Entertainment & Arts',
    url: 'https://www.bbc.com/news/articles/c1kv7v3z70jo'
  },
  {
    category: 'Entertainment & Arts',
    url: 'https://www.bbc.com/news/articles/c9vg8k4zxk9o'
  },
  {
    category: 'Entertainment & Arts',
    url: 'https://www.bbc.com/news/articles/c2e3dvjkdmxo'
  },
  {
    category: 'Entertainment & Arts',
    url: 'https://www.bbc.com/news/articles/c071elp1rv1o'
  },
  {
    category: 'Business',
    url: 'https://www.bbc.com/news/articles/cvgn3ngvm8eo'
  },
  {
    category: 'Business',
    url: 'https://www.bbc.com/news/articles/cddegv618ezo'
  },
  {
    category: 'Business',
    url: 'https://www.bbc.com/news/articles/c4g2j45d5zeo'
  },
  {
    category: 'Business',
    url: 'https://www.bbc.com/news/articles/c74qjjvzlgjo'
  },
  {
    category: 'Business',
    url: 'https://www.bbc.com/news/articles/cp3q50p7820o'
  },
  {
    category: 'Business',
    url: 'https://www.bbc.com/news/articles/c4gkvp6438ko'
  },
  {
    category: 'Business',
    url: 'https://www.bbc.com/news/articles/c89pw3j7z9zo'
  },
  {
    category: 'Technology',
    url: 'https://www.bbc.com/news/articles/c071elp1rv1o'
  },
  {
    category: 'Technology',
    url: 'https://www.bbc.com/news/articles/cx2qn1j0jd6o'
  },
  {
    category: 'Technology',
    url: 'https://www.bbc.com/news/articles/c7875w07l93o'
  },
  {
    category: 'Technology',
    url: 'https://www.bbc.com/news/articles/c62j2gr8866o'
  },
  {
    category: 'Technology',
    url: 'https://www.bbc.com/news/articles/c3r8rg4w2v0o'
  },
  {
    category: 'Technology',
    url: 'https://www.bbc.com/news/articles/cq808px90wxo'
  },
  {
    category: 'Technology',
    url: 'https://www.bbc.com/news/articles/cz7974l151po'
  },
  {
    category: 'Science & Tech',
    url: 'https://www.bbc.com/news/articles/c4g3krykxypo'
  },
  {
    category: 'Science & Tech',
    url: 'https://www.bbc.com/news/articles/c1dr1k6933no'
  },
  {
    category: 'Science & Tech',
    url: 'https://www.bbc.com/news/articles/cy9vz28nyedo'
  },
  {
    category: 'Science & Tech',
    url: 'https://www.bbc.com/news/articles/ce848g8l8vro'
  },
  {
    category: 'Science & Tech',
    url: 'https://www.bbc.com/news/articles/c8074ry1yr5o'
  },
  {
    category: 'Science & Tech',
    url: 'https://www.bbc.com/news/articles/ckgrwxxzxkjo'
  },
  {
    category: 'Science & Tech',
    url: 'https://www.bbc.com/news/articles/cm2xr2jzelyo'
  },
  {
    category: 'Health',
    url: 'https://www.bbc.com/news/articles/cgle2xkg3wpo'
  },
  {
    category: 'Health',
    url: 'https://www.bbc.com/news/articles/cz7972zj5nzo'
  },
  {
    category: 'Health',
    url: 'https://www.bbc.com/news/articles/c2lzlnwjzxno'
  },
  {
    category: 'Health',
    url: 'https://www.bbc.com/news/articles/cze1en36kg1o'
  },
  {
    category: 'Health',
    url: 'https://www.bbc.com/news/articles/cx28erkmm3yo'
  },
  {
    category: 'Health',
    url: 'https://www.bbc.com/news/articles/c4g9y9rzmkyo'
  },
  {
    category: 'Health',
    url: 'https://www.bbc.com/news/articles/cly5gkl3dg5o'
  }
]


async function processOneByOne() {
  const finalData = [];

  for (let i = 0; i < allArticles.length; i++) {
    const feed = allArticles[i];
    const result = await webScraper(feed);

    // Only push to finalData if the result is not null (successful scrape)
    if (result) {
      finalData.push(result);
      console.log(`Processed article ${i + 1} of ${allArticles.length}`);
    } else {
      console.log(`Skipped article ${i + 1} due to error.`);
    }
  }

  // After processing all articles, write the data to a file
  const filePath = path.join(currentDirectory, 'finalData.json');

  fs.writeFile(filePath, JSON.stringify(finalData, null, 2), (err) => {
    if (err) {
      console.error('Error writing to file:', err);
    } else {
      console.log('Data has been written to finalData.json');
    }
  });
}


// use below function to scrap articles
// await processOneByOne();

////////////////////


// Categorized RSS feed URLs
const categorizedFeeds = [
  {
    category: "World Asia",
    feedUrl: "https://feeds.bbci.co.uk/news/world/asia/rss.xml",
  },
  {
    category: "Technology",
    feedUrl: "http://feeds.bbci.co.uk/news/technology/rss.xml",
  },
  { category: "Sport", feedUrl: "https://feeds.bbci.co.uk/sport/rss.xml" },
  {
    category: "Science & Tech",
    feedUrl:
      "http://newsrss.bbc.co.uk/rss/newsonline_uk_edition/sci/tech/rss.xml",
  },
  {
    category: "Entertainment & Arts",
    feedUrl: "http://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml",
  },
  { category: "Culture", feedUrl: "https://www.bbc.com/culture/feed.rss" },
  {
    category: "Business",
    feedUrl: "http://feeds.bbci.co.uk/news/business/rss.xml",
  },
  {
    category: "Health",
    feedUrl: "http://feeds.bbci.co.uk/news/health/rss.xml",
  },
  { category: "World", feedUrl: "http://feeds.bbci.co.uk/news/world/rss.xml" },
];

// Array to store final collected articles
const allFeedLinks = [];
const maxUrlsPerCategory = 7; // Limit of URLs to collect per category

// Function to fetch and extract <item><link> URLs
async function fetchFeedLinks(feedObj) {
  const { category, feedUrl } = feedObj;
  try {
    const response = await axios.get(feedUrl);
    const xml = response.data;

    const result = await xml2js.parseStringPromise(xml);
    const items = result.rss.channel[0].item;

    if (items && items.length) {
      const links = items
        .map((item) => item.link[0])
        .filter(
          (link) =>
            !link.includes("/videos/") &&
            !link.includes("/sounds/") &&
            !link.includes("/iplayer/") // Exclude links with 'videos', 'sounds', and 'iplayer'
        )
        .map((link) => ({ category, url: link }))
        .slice(0, maxUrlsPerCategory); // Limit to the max URLs per category

      allFeedLinks.push(...links);
      console.log(`Fetched ${links.length} valid links from ${category}`);
    }
  } catch (error) {
    console.error(`Error fetching/parsing ${feedUrl}:`, error.message);
  }
}

// Function to fetch all feeds
async function fetchAllFeeds() {
  // Fetch links from each feed URL
  await Promise.all(categorizedFeeds.map(fetchFeedLinks));

  // If there are more than 50 links, trim the array to 50
  if (allFeedLinks.length > 80) {
    allFeedLinks.length = 50;
  }

  console.log("Collected Articles:", allFeedLinks);
  console.log("Total Articles:", allFeedLinks.length);
}



// extracting articles urls from rss feeds
// fetchAllFeeds();



