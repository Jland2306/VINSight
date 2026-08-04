const cheerio = require('cheerio');

const KNOWN_MULTI_WORD_MAKES = ['Land Rover', 'Mercedes-Benz', 'Alfa Romeo', 'Aston Martin'];

function splitMakeModel(text) {
    const trimmed = String(text || '').replace(/\s+/g, ' ').trim();
    if (!trimmed) return { make: null, model: null };

    for (const make of KNOWN_MULTI_WORD_MAKES) {
        if (trimmed.toLowerCase().startsWith(make.toLowerCase())) {
            const rest = trimmed.slice(make.length).trim();
            return { make, model: rest || null };
        }
    }

    const parts = trimmed.split(' ');
    if (parts.length < 2) return { make: trimmed, model: null };
    return { make: parts[0], model: parts.slice(1).join(' ') };
}

function parseNumber(value) {
    if (value === null || value === undefined) return null;
    const digits = String(value).replace(/[^\d.]/g, '');
    if (!digits) return null;
    const num = Number(digits);
    return Number.isNaN(num) ? null : num;
}

function isCraigslistListingPage(html) {
    return /id=["']titletextonly["']/.test(html) && /class=["'][^"']*\battrgroup\b/.test(html);
}

// Parses a Craigslist vehicle listing page directly from its known DOM structure.
// Returns null (rather than throwing) when the expected markers aren't present,
// so callers can fall back to generic heuristics instead of crashing.
function parseCraigslistListing(html) {
    if (!isCraigslistListingPage(html)) return null;

    const $ = cheerio.load(html);
    const title = $('#titletextonly').first().text().trim() || null;
    if (!title) return null;

    const price = parseNumber($('.postingtitletext .price').first().text());

    const titleLineText = $('.postingtitletext').first().text().replace(/\s+/g, ' ').trim();
    const neighborhoodMatch = titleLineText.match(/\(([^)]+)\)\s*$/);
    const neighborhood = neighborhoodMatch ? neighborhoodMatch[1].trim() : null;

    const mapEl = $('#map').first();
    const latitude = mapEl.attr('data-latitude') ? Number(mapEl.attr('data-latitude')) : null;
    const longitude = mapEl.attr('data-longitude') ? Number(mapEl.attr('data-longitude')) : null;

    let year = null;
    let make = null;
    let model = null;
    const attributes = {};

    $('.attrgroup').each((_, group) => {
        $(group).find('.attr').each((__, attrEl) => {
            const attr = $(attrEl);
            if (attr.hasClass('important')) {
                const yearText = attr.find('.valu.year').text().trim();
                const makeModelText = attr.find('.valu.makemodel').text().replace(/\s+/g, ' ').trim();
                if (yearText) year = parseNumber(yearText);
                if (makeModelText) {
                    const split = splitMakeModel(makeModelText);
                    make = split.make;
                    model = split.model;
                }
                return;
            }

            const label = attr.find('.labl').text().replace(':', '').trim().toLowerCase();
            const value = attr.find('.valu').text().replace(/\s+/g, ' ').trim();
            if (!label || !value) return;
            attributes[label] = value;
        });
    });

    const bodyEl = $('#postingbody').clone();
    bodyEl.find('.print-qrcode-container, .print-information').remove();
    const description = bodyEl.text()
        .replace(/QR Code Link to This Post/gi, '')
        .split('\n').map(line => line.trim()).filter(Boolean).join('\n')
        .trim() || null;

    let postedDate = null;
    let updatedDate = null;
    $('.postinginfos .postinginfo').each((_, el) => {
        const text = $(el).text().toLowerCase();
        const datetime = $(el).find('time.date.timeago').attr('datetime');
        if (!datetime) return;
        if (text.includes('updated')) updatedDate = datetime;
        else if (text.includes('posted')) postedDate = datetime;
    });
    if (!postedDate) {
        postedDate = $('#display-date time.date.timeago').attr('datetime') || null;
    }

    const imageUrls = new Set();
    $('#thumbs a.thumb').each((_, el) => {
        const href = $(el).attr('href');
        if (href) imageUrls.add(href);
    });
    if (!imageUrls.size) {
        $('.gallery .slide img[src]').each((_, el) => {
            const src = $(el).attr('src');
            if (src) imageUrls.add(src);
        });
    }
    if (!imageUrls.size) {
        $('.gallery img[src]').each((_, el) => {
            const src = $(el).attr('src');
            if (src) imageUrls.add(src);
        });
    }
    const images = Array.from(imageUrls).slice(0, 6);

    return {
        title,
        price,
        neighborhood,
        latitude,
        longitude,
        description,
        postedDate,
        updatedDate,
        images,
        attributes,
        structured: {
            year,
            make,
            model,
            price,
            mileage: parseNumber(attributes['odometer']),
            condition: attributes['condition'] || null,
            titleStatus: attributes['title status'] || null,
            vin: attributes['vin'] || null,
            cylinders: attributes['cylinders'] || null,
            drivetrain: attributes['drive'] || null,
            fuelType: attributes['fuel'] || null,
            transmission: attributes['transmission'] || null,
            paintColor: attributes['paint color'] || null,
            bodyType: attributes['type'] || null,
        },
    };
}

module.exports = { parseCraigslistListing };
