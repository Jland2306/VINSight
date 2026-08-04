VINSight — Vehicle Listing Risk Analyzer

VINSight takes a Craigslist or Facebook Marketplace car listing (URL or pasted text) and returns a fast, structured risk assessment: is the price fair, what issues are common for that year/make/model, what red flags are in the listing, what to ask the seller, and what to physically check before buying.

What it does

Paste a listing URL (or raw text) and it auto-fills make, model, year, price, mileage, and condition.
Runs an AI-backed analysis that returns: fair-price assessment vs. market range, likely known issues with severity and estimated repair cost, red flags in the listing text, seller questions, an in-person inspection checklist, and an overall 1–10 recommendation score.
Shows a listing preview (title, description, images, location, posted date) when it can be scraped.
If scraping the URL fails or the AI is unavailable, it still returns a rule-based heuristic assessment instead of erroring out.

How it's built

Backend: Node.js + Express (server.js). 
Craigslist pages are scraped and parsed with a custom parser (lib/craigslistParser.js) using Cheerio; Facebook Marketplace requires pasted text since Facebook blocks unauthenticated scraping (the server detects the login wall and prompts for manual paste instead of returning garbage).

Extraction pipeline: structured data first — JSON-LD, Open Graph/meta tags, URL heuristics, and Craigslist's own markup — with an Anthropic Claude call (claude-haiku-4-5) filling in whatever fields heuristics missed.

Analysis: a separate Claude call (claude-sonnet-5) acts as an experienced mechanic and buyer's advocate returning strict JSON that the frontend renders. If the API key isn't set or the call fails, a local heuristic engine (price-per-mile ratio, keyword detection for rust/leaks/salvage/non-running, mileage/age thresholds) produces a comparable report.

Security: an SSRF guard restricts server-side fetches to an allowlist of hosts (craigslist.org, facebook.com) and resolves DNS to block requests to private/loopback/link-local IPs (defends against DNS rebinding). Untrusted scraped text is explicitly labeled as data-not-instructions in the LLM prompts to guard against prompt injection from listing content.

Frontend: vanilla HTML/CSS/JS (public/), no framework — a single form, status states, and cards that render the structured analysis.

Stack: Node/Express, Cheerio, Anthropic SDK, vanilla JS/CSS.
