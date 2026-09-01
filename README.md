# VINSight

**A vehicle-listing risk analyzer that turns a used-car ad into a structured buying decision.**

VINSight takes a Craigslist or Facebook Marketplace car listing as a URL or pasted text and returns a fast, structured risk assessment. This web app asses whether the price is fair, what problems are common for that year/make/model, what red flags appear in the listing, what to ask the seller, and what to physically check before buying.

*A full-stack project combining web scraping, LLM-backed analysis, and defensive server-side security.*

---

> **Fill in —** Add a screenshot or short GIF of an analyzed listing here — the rendered risk cards are the most convincing thing to show. Drop the file in a `/screenshots` folder and reference it:
> `![VINSight analysis](screenshots/analysis.png)`

---

## Overview

Buying a used car from an online listing means sorting real information from noise under time pressure. VINSight automates that first pass. When pasting a listing, it extracts the vehicle details, evaluates the asking price against the market, surfaces likely issues and red flags, and hands back a concrete plan for talking to the seller and inspecting the car with a single recommendation score to anchor your decision.

## Features

- **URL or paste input** — Drop in a listing URL or raw text; VINSight auto-fills make, model, year, price, mileage, and condition.
- **Structured risk report** — Returns a fair-price assessment against the market range, likely known issues with severity and estimated repair cost, red flags found in the listing text, questions to ask the seller, an in-person inspection checklist, and an overall 1–10 recommendation score.
- **Listing preview** — Shows the title, description, images, location, and posted date when the listing can be scraped.
- **Never dead-ends** — If scraping fails or the AI is unavailable, it falls back to a rule-based heuristic assessment instead of returning an error.

## How It Works

**Backend** — Node.js + Express (`server.js`).

**Scraping & parsing** — Craigslist pages are scraped and parsed by a custom parser (`lib/craigslistParser.js`) built on Cheerio. Facebook Marketplace blocks unauthenticated scraping, so instead of returning garbage, the server detects the login wall and prompts the user to paste the listing text manually.

**Extraction pipeline** — Structured data first: JSON-LD, Open Graph / meta tags, URL heuristics, and Craigslist's own markup. An Anthropic Claude call (`claude-haiku-4-5`) then fills in whatever fields the heuristics missed.

**Analysis** — A separate Claude call (`claude-sonnet-5`) acts as an experienced mechanic and buyer's advocate, returning strict JSON that the frontend renders into cards. If no API key is configured or the call fails, a local heuristic engine takes over — using price-per-mile ratios, keyword detection for issues like rust, leaks, salvage, and non-running vehicles, and mileage/age thresholds — to produce a comparable report.

**Frontend** — Vanilla HTML/CSS/JS (`public/`), no framework: a single form, clear status states, and cards that render the structured analysis.

## Security

Because the server fetches user-supplied URLs and feeds scraped content to an LLM, both were treated as untrusted:

- **SSRF protection** — Server-side fetches are restricted to an allowlist of hosts (`craigslist.org`, `facebook.com`), and DNS is resolved to block requests to private, loopback, and link-local IPs — defending against DNS rebinding.
- **Prompt-injection defense** — Untrusted scraped listing text is explicitly labeled as data, not instructions, in the LLM prompts, so a malicious listing can't hijack the analysis.

## Built With

- **Backend:** Node.js, Express
- **Scraping:** Cheerio
- **AI:** Anthropic SDK (Claude)
- **Frontend:** Vanilla HTML, CSS, JavaScript

## Running Locally

1. Clone the repository.
2. Install dependencies: `npm install`
3. Set your Anthropic API key (e.g. in a `.env` file or your shell): `ANTHROPIC_API_KEY=your-key-here`
4. Start the server: `node server.js`
5. Open the app in your browser at `http://localhost:3000`.
