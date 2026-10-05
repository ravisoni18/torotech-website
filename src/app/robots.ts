import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// Search engines and AI assistants are welcome everywhere public. Only private areas are closed:
// /admin and /sign-in (staff login) and /api (form and analytics endpoints, nothing to read).
const PRIVATE = ["/admin", "/api/", "/sign-in"];

// Named explicitly so the welcome is unambiguous to crawlers that look for their own entry.
const CRAWLERS = [
  "Googlebot", "Google-Extended", "Bingbot", "DuckDuckBot", "Applebot", "Applebot-Extended", "YandexBot",
  "GPTBot", "OAI-SearchBot", "ChatGPT-User",
  "ClaudeBot", "Claude-User", "Claude-SearchBot", "anthropic-ai",
  "PerplexityBot", "Perplexity-User", "CCBot", "meta-externalagent", "Amazonbot", "cohere-ai", "MistralAI-User",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: PRIVATE }, { userAgent: CRAWLERS, allow: "/", disallow: PRIVATE }],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
