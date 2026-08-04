const listingUrl = document.getElementById('listing-url');
const pastedTextInput = document.getElementById('pasted-text');
const makeInput = document.getElementById('vehicle-make');
const modelInput = document.getElementById('vehicle-model');
const yearInput = document.getElementById('vehicle-year');
const priceInput = document.getElementById('vehicle-price');
const mileageInput = document.getElementById('vehicle-mileage');
const conditionInput = document.getElementById('vehicle-condition');
const analyzeBtn = document.getElementById('analyze-btn');
const statusBox = document.getElementById('status');
const listingPreviewCard = document.getElementById('listing-preview');
const breakdownCard = document.getElementById('breakdown');
const issuesCard = document.getElementById('issues');
const brandIssuesCard = document.getElementById('brand-issues');
const recommendationCard = document.getElementById('recommendation');
const autoFillBtn = document.getElementById('autofill-btn');


function updateStatus(message, variant = 'info') {
    statusBox.textContent = message;
    statusBox.classList.toggle('status-warning', variant === 'warning');
}

function showCard(card, title, content) {
    card.innerHTML = `
        <h3>${title}</h3>
        ${content}
    `;
    card.classList.remove('hidden');
}

const WARNING_ICONS = {
    engine: {
        label: 'Engine',
        color: 'var(--warn)',
        svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10h3V7h6v3h3l2 3v6H4v-6l2-3z"/><path d="M9 7V4h4v3"/><circle cx="16.5" cy="15" r="1.3" fill="currentColor" stroke="none"/></svg>'
    },
    oil: {
        label: 'Oil',
        color: 'var(--danger)',
        svg: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2.5c-2.6 3.7-5.3 7.2-5.3 10.4a5.3 5.3 0 0 0 10.6 0c0-3.2-2.7-6.7-5.3-10.4z"/></svg>'
    },
    brake: {
        label: 'Brake',
        color: 'var(--danger)',
        svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9 7c-1.5 2-1.5 8 0 10M15 7c1.5 2 1.5 8 0 10"/><line x1="12" y1="8" x2="12" y2="13"/><circle cx="12" cy="16.3" r="0.6" fill="currentColor" stroke="none"/></svg>'
    },
    battery: {
        label: 'Electrical',
        color: 'var(--danger)',
        svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="16" height="9" rx="1.5"/><rect x="19.5" y="11" width="1.5" height="3" fill="currentColor" stroke="none"/><line x1="7.5" y1="8" x2="7.5" y2="5.3"/><line x1="14.5" y1="8" x2="14.5" y2="5.3"/><path d="M9.5 10.5 8 13.5h3L9.5 16.5"/></svg>'
    },
    coolant: {
        label: 'Cooling',
        color: 'var(--danger)',
        svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.2a5 5 0 0 1 5 5v6.3a5 5 0 1 1-10 0V8.2a5 5 0 0 1 5-5z"/><path d="M8.2 12.8c1 1 2 1.5 3.8 1.5s2.8-.5 3.8-1.5"/></svg>'
    },
    gear: {
        label: 'Transmission',
        color: 'var(--warn)',
        svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 3v2.6M12 18.4V21M21 12h-2.6M5.6 12H3M18.5 5.5l-1.8 1.8M7.3 16.7l-1.8 1.8M18.5 18.5l-1.8-1.8M7.3 7.3 5.5 5.5"/></svg>'
    },
    wrench: {
        label: 'Suspension',
        color: 'var(--warn)',
        svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2-2z"/></svg>'
    },
    tire: {
        label: 'Tire',
        color: 'var(--warn)',
        svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="4" x2="12" y2="7"/><line x1="12" y1="17" x2="12" y2="20"/><line x1="4" y1="12" x2="7" y2="12"/><line x1="17" y1="12" x2="20" y2="12"/></svg>'
    },
    triangle: {
        label: 'Warning',
        color: 'var(--warn)',
        svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5 21.5 20h-19L12 3.5z"/><line x1="12" y1="9.7" x2="12" y2="14"/><circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none"/></svg>'
    }
};

function getWarningIcon(text) {
    const t = String(text || '').toLowerCase();
    const has = (...words) => words.some(word => t.includes(word));

    if (has('brake', 'abs ', 'caliper', 'rotor')) return WARNING_ICONS.brake;
    if (has('oil leak', 'oil consumption', 'oil pressure', 'oil pan', 'valve cover gasket', 'rear main seal')) return WARNING_ICONS.oil;
    if (has('coolant', 'cooling', 'radiator', 'thermostat', 'overheat', 'water pump')) return WARNING_ICONS.coolant;
    if (has('battery', 'electrical', 'wiring', 'sensor', 'module', 'charging system')) return WARNING_ICONS.battery;
    if (has('transmission', 'cvt', 'dsg', 'gearbox', 'clutch', 'shift', 'torque converter', 'mechatronic')) return WARNING_ICONS.gear;
    if (has('suspension', 'strut', 'steering', 'bushing', 'ball joint', 'sway bar', 'shock')) return WARNING_ICONS.wrench;
    if (has('rust', 'corrosion', 'body seam', 'wheel well')) return WARNING_ICONS.triangle;
    if (has('tire', 'wheel', 'alignment')) return WARNING_ICONS.tire;
    if (has('engine', 'misfire', 'timing', 'valve', 'piston', 'turbo', 'compression', 'spark', 'ignition', 'vtec', 'vanos', 'ims bearing')) return WARNING_ICONS.engine;
    return WARNING_ICONS.triangle;
}

function warningIconMarkup(text) {
    const icon = getWarningIcon(text);
    return `<span class="warn-icon" style="color:${icon.color}" title="${icon.label}" aria-hidden="true">${icon.svg}</span>`;
}

function makeIssueChips(issues) {
    return issues.map(issue => `<span class="issue-chip">${warningIconMarkup(issue)}<span>${issue}</span></span>`).join('');
}

function buildRecommendationText(score, priceRating, mileageRating, issueRating) {
    if (score >= 8) {
        return 'Strong buy: the price, mileage, and risk profile are favorable. This is a good candidate to pursue after inspection.';
    }
    if (score >= 6) {
        return 'Consider with caution: some factors are good, but inspect the vehicle carefully and negotiate on price or repairs.';
    }
    if (score >= 4) {
        return 'Risky purchase: this listing is average or has multiple warning signs. Only buy if condition is verified and you can lower the price significantly.';
    }
    return 'Not recommended: too many concerns based on price, mileage, or expected issues. Look for better options or wait for a cleaner listing.';
}

function renderScoreGauge(score) {
    const numeric = Number(score);
    const clamped = Math.min(10, Math.max(1, Number.isFinite(numeric) ? numeric : 1));

    const cx = 150;
    const cy = 160;
    const r = 130;
    const toPoint = (deg, radius) => {
        const rad = (deg * Math.PI) / 180;
        return { x: cx + radius * Math.cos(rad), y: cy - radius * Math.sin(rad) };
    };

    const p180 = toPoint(180, r);
    const p120 = toPoint(120, r);
    const p60 = toPoint(60, r);
    const p0 = toPoint(0, r);

    const ticks = [];
    for (let i = 1; i <= 10; i++) {
        const deg = 180 - ((i - 1) / 9) * 180;
        const outer = toPoint(deg, r);
        const inner = toPoint(deg, r - 16);
        ticks.push(`<line x1="${inner.x.toFixed(1)}" y1="${inner.y.toFixed(1)}" x2="${outer.x.toFixed(1)}" y2="${outer.y.toFixed(1)}" stroke="var(--muted)" stroke-width="2" stroke-linecap="round" />`);
    }

    const needleAngle = -90 + ((clamped - 1) / 9) * 180;
    const zoneColor = clamped < 4 ? 'var(--danger)' : clamped < 7 ? 'var(--warn)' : 'var(--ok)';
    const verdictLabel = clamped >= 8 ? 'Buy' : clamped >= 6 ? 'Consider' : clamped >= 4 ? 'Caution' : 'Avoid';
    const displayScore = Number.isInteger(clamped) ? clamped : clamped.toFixed(1);

    return `
        <div class="gauge">
            <svg viewBox="0 0 300 185" role="img" aria-label="Recommendation score ${displayScore} out of 10, verdict ${verdictLabel}">
                <path d="M ${p180.x.toFixed(1)} ${p180.y.toFixed(1)} A ${r} ${r} 0 0 1 ${p120.x.toFixed(1)} ${p120.y.toFixed(1)}" fill="none" stroke="var(--danger)" stroke-width="18" stroke-linecap="round" />
                <path d="M ${p120.x.toFixed(1)} ${p120.y.toFixed(1)} A ${r} ${r} 0 0 1 ${p60.x.toFixed(1)} ${p60.y.toFixed(1)}" fill="none" stroke="var(--warn)" stroke-width="18" stroke-linecap="round" />
                <path d="M ${p60.x.toFixed(1)} ${p60.y.toFixed(1)} A ${r} ${r} 0 0 1 ${p0.x.toFixed(1)} ${p0.y.toFixed(1)}" fill="none" stroke="var(--ok)" stroke-width="18" stroke-linecap="round" />
                ${ticks.join('')}
                <circle cx="${cx}" cy="${cy}" r="9" fill="var(--surface-2)" stroke="var(--border)" stroke-width="2" />
                <g class="needle" style="transform-origin:${cx}px ${cy}px; transform:rotate(${needleAngle.toFixed(1)}deg);">
                    <line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - (r - 30)}" stroke="#F4F6F8" stroke-width="5" stroke-linecap="round" />
                </g>
                <circle cx="${cx}" cy="${cy}" r="5" fill="var(--accent)" />
            </svg>
            <div class="gauge-value">${displayScore}/10</div>
            <div class="gauge-verdict" style="color:${zoneColor}">${verdictLabel}</div>
        </div>
    `;
}

function detectSource(url) {
    if (!url) return 'unknown';
    if (url.includes('facebook.com/marketplace') || url.includes('fbclid=')) return 'facebook';
    if (url.includes('craigslist.org')) return 'craigslist';
    return 'unknown';
}

function normalizeText(value) {
    return String(value || '').trim();
}

function getBrandInfo(make) {
    const normalized = normalizeText(make).toLowerCase();
    for (const brand of Object.keys(brandRiskDatabase)) {
        if (brand !== 'default' && brand.toLowerCase() === normalized) {
            return brandRiskDatabase[brand];
        }
    }
    return brandRiskDatabase.default;
}

function parseListingUrl(url) {
    const source = detectSource(url);
    const details = {
        source,
        listingType: source === 'facebook' ? 'Facebook Marketplace' : source === 'craigslist' ? 'Craigslist' : 'Unknown'
    };
    return details;
}

const brandRiskDatabase = {
    default: {
        description: 'This brand has no specific risk profile available. Verify the seller disclosures and inspection results before buying.',
        commonIssues: ['Verify service history', 'Check for accident damage', 'Inspect electrical systems', 'Confirm title status']
    },
    Toyota: {
        description: 'Toyota vehicles are generally reliable, but wear items and certain engine/transmission faults can appear on older examples.',
        commonIssues: ['Oil consumption on older 4-cylinder and V6 engines', 'Automatic transmission shudder or slipping', 'Suspension noises from worn bushings and struts', 'Faulty fuel injectors or catalytic converter issues', 'Timing belt or chain maintenance on older models']
    },
    Honda: {
        description: 'Honda is known for longevity, though some models have common issues with head gaskets, transmissions, and electrical accessories.',
        commonIssues: ['Valve cover gasket and oil leak problems', 'Automatic transmission hesitation or slipping', 'Sticky VTEC or VTC solenoids', 'Power window/regulator failures and A/C compressor faults', 'Timing belt replacement and cooling system care']
    },
    Ford: {
        description: 'Ford trucks and cars can be durable, but they often show age-related drivetrain, cooling, and electrical wear.',
        commonIssues: ['Transmission shifting issues on some F-Series and Explorer models', 'Ignition coil failure and misfires', 'Cooling system leaks at radiators and hoses', 'Front suspension and steering component wear', 'Transfer case and differential service needs on 4WD models']
    },
    Chevrolet: {
        description: 'Chevrolet examples often need inspection for cooling, electrical, and chassis wear, especially on older pickups and SUVs.',
        commonIssues: ['Cooling system leaks and thermostat failures', 'Electrical module and sensor faults', 'Old battery/charging system issues', 'Worn suspension bushings and ball joints', 'Exhaust manifold gasket leaks']
    },
    BMW: {
        description: 'BMWs can offer performance, but older units often have oil leaks, cooling failures, and high-maintenance electronics.',
        commonIssues: ['Oil pan and valve cover gasket leaks', 'Cooling system water pump and thermostat failures', 'VANOS or timing chain issues', 'Electronic module and sensor errors', 'Steering rack or suspension bushing wear']
    },
    Mercedes: {
        description: 'Mercedes vehicles can be luxurious but may show costly air suspension, transmission, and electronics concerns on used examples.',
        commonIssues: ['Air suspension compressor and strut leaks', 'Automatic transmission mechatronic and shift problems', 'A/C evaporator and blower motor failures', 'Electrical gremlins from aging wiring and modules', 'Turbocharger and intercooled engine issues']
    },
    Nissan: {
        description: 'Nissan cars often require attention for CVT drivetrains, oil consumption, and timing chain or gasket concerns.',
        commonIssues: ['CVT transmission hesitation or failure on many sedans', 'Oil consumption and valve cover gasket leaks', 'Timing chain tensioner noise on older engines', 'Wheel bearing and brake caliper wear', 'Intake manifold and sensor faults']
    },
    Hyundai: {
        description: 'Hyundai offers value, but some models can have engine, transmission, and cooling issues with higher mileage.',
        commonIssues: ['Timing chain and tensioner noise on GDI engines', 'Fuel pump and injector reliability concerns', 'Overheating due to failed cooling components', 'Electrical accessory and sensor failures', 'Transmission torque converter issues']
    },
    Kia: {
        description: 'Kia is closely related to Hyundai and shares many common wear points, especially on drivetrains and electronics.',
        commonIssues: ['Oil consumption and engine chain noise', 'Automatic transmission shifting concerns', 'Sunroof or window regulator failures', 'Steering rack and suspension wear', 'Brake caliper seizure on older models']
    },
    Volkswagen: {
        description: 'Volkswagen models can be fun to drive but often need careful inspection for DSG, coolant, and electrical issues.',
        commonIssues: ['DSG transmission mechatronic and clutch pack issues', 'Coolant leaks from water pumps and radiators', 'Carbon build-up on direct-injection engines', 'Interior electronics and dashboard warning lights', 'IGNT coil and ignition module faults']
    },
    Subaru: {
        description: 'Subaru is prized for AWD, but older models commonly show head gasket, oil leak, and drivetrain concerns.',
        commonIssues: ['Head gasket leaks on older boxer engines', 'Oil leaks from valve cover gaskets and rear main seals', 'CVT and clutch pack wear on high-mileage models', 'Differential or transfer case noise', 'Turbocharger wastegate and ringland issues']
    },
    Jeep: {
        description: 'Jeep ownership often means checking transfer case, electrical, and body/rust condition carefully.',
        commonIssues: ['Transfer case and 4WD engagement issues', 'Electrical faults with sensors and body modules', 'Oil leaks around front and rear crankshaft seals', 'Suspension bushings and sway bar links wear', 'Rust and body seam corrosion on older models']
    },
    Tesla: {
        description: 'Tesla vehicles have electric drivetrains, but used examples still need inspection for battery, electronics, and suspension failures.',
        commonIssues: ['Battery degradation and range loss', 'Door handle and latch mechanism failures', 'Suspension component wear after rough roads', 'HVAC and touchscreen software/hardware faults', 'High-voltage connector and inverter issues']
    },
    Mazda: {
        description: 'Mazda cars are fun to drive, but older units may show rust, engine oil leaks, and transmission wear.',
        commonIssues: ['Rust in rocker panels and wheel wells', 'Ignition coil and spark plug misfires', 'Timing chain and chain guide noise', 'Automatic transmission overheating or slipping', 'Rear main seal oil leaks']
    },
    Audi: {
        description: 'Audi vehicles are luxurious but often expensive to repair due to electronics, turbo, and transmission issues.',
        commonIssues: ['PCV valve and vacuum line leaks', 'DSG or multitronic transmission faults', 'Coolant leaks from seals and hoses', 'Oil consumption and turbocharger issues', 'Air suspension and electronic module failures']
    },
    Lexus: {
        description: 'Lexus models are usually reliable, though high-mileage luxury vehicles may still need attention for electronics and hybrid systems.',
        commonIssues: ['Hybrid battery degradation on RX and ES hybrids', 'Water pump and thermostat failures', 'Oil leaks from valve covers and gaskets', 'Adaptive suspension and steering components', 'Air suspension and electronic seat faults']
    },
    Ram: {
        description: 'Ram trucks can be robust but often need inspection for transmission, emissions, and suspension wear.',
        commonIssues: ['Transmission shifting issues on older automatic models', 'Diesel emissions system and EGR blockages', 'Air suspension and rear axle noise', 'Fuel system and injector problems', 'Brake wear and sensor faults']
    },
    Volvo: {
        description: 'Volvo is safety-focused, but aging Volvos may show electrical, cooling, and suspension concerns.',
        commonIssues: ['Electrical module and sensor faults', 'Cooling system leaks and thermostat failures', 'Suspension bushings and strut mount wear', 'Turbocharger and intake system issues', 'Brake caliper corrosion on older models']
    },
    GMC: {
        description: 'GMC trucks and SUVs share many GM drivetrain characteristics and need checks for cooling, transmission, and suspension wear.',
        commonIssues: ['Transmission slipping or hard shifting', 'Cooling system leaks at radiators and hoses', 'Steering and front suspension component wear', 'Electrical dashboard and sensor issues']
    },
    Dodge: {
        description: 'Dodge vehicles can have powerful engines, but they frequently need inspection for transmission, cooling, and engine mount issues.',
        commonIssues: ['Automatic transmission issues in Chargers and Durangos', 'Cooling system problems on Hemi engines', 'Engine mount and vibration concerns', 'Brake and ABS sensor faults']
    },
    Buick: {
        description: 'Buick models often ride smoothly, but older examples may have transmission, suspension, and electrical gremlins.',
        commonIssues: ['Transmission shifting hesitation', 'Air suspension leaks on luxury SUVs', 'Electrical accessory failures', 'Power steering pump and rack wear']
    },
    Cadillac: {
        description: 'Cadillac luxury cars may have expensive electronics and suspension faults, especially in older or high-mileage examples.',
        commonIssues: ['Air suspension and ride control faults', 'Infotainment and body control module issues', 'Automatic transmission and torque converter problems', 'Cooling system thermostat and pump leaks']
    },
    Acura: {
        description: 'Acura blends Honda reliability with luxury, but older cars may still need inspection for timing belt, transmission, and electronics issues.',
        commonIssues: ['Timing belt and water pump replacement', 'Transmission fluid service needs', 'ABS sensor and electrical accessory faults', 'Suspension bushing wear']
    },
    Infiniti: {
        description: 'Infiniti is Nissan-based luxury, and common concerns include CVT/drivetrain issues, electronics, and timing components.',
        commonIssues: ['CVT or automatic transmission hesitation', 'Timing chain noise and oil leaks', 'Electrical module and sensor problems', 'Suspension and steering component wear']
    },
    Porsche: {
        description: 'Porsche cars are performance-focused and require careful inspection for engine, cooling, and suspension costs.',
        commonIssues: ['Oil leaks from valve covers and cylinder heads', 'IMS bearing or chain tensioner issues on older models', 'Suspension bushing and ball joint wear', 'Coolant hose and radiator leaks']
    },
    'Land Rover': {
        description: 'Land Rover ownership often means expensive maintenance, with common issues around electronics, air suspension, and cooling systems.',
        commonIssues: ['Air suspension compressor and strut failures', 'Electrical and body control module faults', 'Cooling system leaks and thermostat failures', 'Transfer case and differential service needs']
    },
    Mini: {
        description: 'Mini vehicles can be enjoyable, but older models often show timing chain, cooling, and electronics issues.',
        commonIssues: ['Timing chain tensioner and guide noise', 'Coolant leaks from water pumps and hoses', 'Electrical accessory and module faults', 'Turbocharger and intake system issues']
    }
};

function calculatePriceScore(price, year, make, model) {
    if (!price || !year) return 5;
    const age = new Date().getFullYear() - year;
    if (age < 1) return price <= 30000 ? 8 : 6;
    if (age <= 5) return price <= 25000 ? 7 : 5;
    if (age <= 10) return price <= 18000 ? 6 : 4;
    return price <= 12000 ? 5 : 3;
}

function calculateMileageScore(mileage, year) {
    if (!mileage || !year) return 5;
    const age = new Date().getFullYear() - year;
    if (age <= 3) return mileage <= 40000 ? 8 : mileage <= 80000 ? 6 : 4;
    if (age <= 7) return mileage <= 80000 ? 7 : mileage <= 140000 ? 5 : 3;
    return mileage <= 120000 ? 5 : 2;
}

function calculateIssueScore(condition) {
    if (!condition) return 4;
    switch (condition.toLowerCase()) {
        case 'good': return 8;
        case 'fair': return 5;
        case 'poor': return 2;
        default: return 4;
    }
}

function computeRecommendation(priceRating, mileageRating, issueRating) {
    const total = (priceRating + mileageRating + issueRating) / 3;
    return Math.min(10, Math.max(1, Math.round(total * 1.25)));
}

function renderList(items, emptyMessage, withIcons = false) {
    const values = Array.isArray(items) ? items.filter(Boolean) : [];
    if (!values.length) {
        return `<p>${emptyMessage}</p>`;
    }

    return `<ul class="result-list">${values.map(item => {
        if (typeof item === 'string') {
            const icon = withIcons ? warningIconMarkup(item) : '';
            return `<li>${icon}<span>${item}</span></li>`;
        }

        if (item && typeof item === 'object') {
            const title = item.issue || item.text || item.title || '';
            const severity = item.severity ? `<div class="hint">Severity: ${item.severity}</div>` : '';
            const cost = item.estimatedCostRange ? `<div class="hint">Estimated repair: ${item.estimatedCostRange}</div>` : '';
            const icon = withIcons ? warningIconMarkup(title) : '';
            return `<li>${icon}<div><strong>${title}</strong>${severity}${cost}</div></li>`;
        }

        const icon = withIcons ? warningIconMarkup(String(item)) : '';
        return `<li>${icon}<span>${String(item)}</span></li>`;
    }).join('')}</ul>`;
}

function renderListingPreview(preview) {
    if (!preview) {
        listingPreviewCard.classList.add('hidden');
        return;
    }

    const imagesHtml = Array.isArray(preview.images) && preview.images.length
        ? `<div class="listing-images">${preview.images.slice(0, 4).map(src => `<img src="${src}" alt="Listing image">`).join('')}</div>`
        : '';

    const dates = [
        preview.postedDate ? `<p><strong>Posted:</strong> ${preview.postedDate}</p>` : '',
        preview.updatedDate ? `<p><strong>Updated:</strong> ${preview.updatedDate}</p>` : ''
    ].filter(Boolean).join('');

    showCard(listingPreviewCard, 'Listing Preview', `
        ${imagesHtml}
        <p><strong>Title:</strong> ${preview.title || 'Unknown'}</p>
        ${preview.location ? `<p><strong>Location:</strong> ${preview.location}</p>` : ''}
        ${dates}
        <p><strong>Details:</strong> ${preview.description || preview.details || 'No details available.'}</p>
    `);
}

async function fetchListingFields(url) {
    const response = await fetch('/api/parse-listing', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
    });

    if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const message = payload?.error || response.statusText || 'Unknown server error';
        throw new Error(message);
    }

    return response.json();
}

async function autoFillFromUrl() {
    const url = normalizeText(listingUrl.value);
    if (!url) {
        updateStatus('Please paste a listing URL before auto-filling.');
        return;
    }

    updateStatus('Auto-filling listing details from URL...');
    analyzeBtn.disabled = true;
    autoFillBtn.disabled = true;

    try {
        const result = await fetchListingFields(url);

        if (result.make) makeInput.value = result.make;
        if (result.model) modelInput.value = result.model;
        if (result.year) yearInput.value = result.year;
        if (result.price) priceInput.value = result.price;
        if (result.mileage) mileageInput.value = result.mileage;
        if (result.condition) conditionInput.value = result.condition;

        if (result.preview) {
            renderListingPreview(result.preview);
        }

        if (result.scrapeBlocked) {
            updateStatus(result.note || "This listing can't be auto-scraped. Paste the listing text below and click Analyze.", 'warning');
            return;
        }

        const runWarning = result.nonRunningPhrases?.length ? ' This listing appears to describe a non-running or non-drivable vehicle. Inspect carefully.' : '';
        updateStatus((result.note || 'Auto-fill complete. Review extracted details and then analyze the listing.') + runWarning);
    } catch (error) {
        updateStatus(`Auto-fill failed: ${error.message}`);
    } finally {
        analyzeBtn.disabled = false;
        autoFillBtn.disabled = false;
    }
}

analyzeBtn.addEventListener('click', async () => {
    const url = normalizeText(listingUrl.value);
    const pastedText = normalizeText(pastedTextInput.value);
    const make = normalizeText(makeInput.value);
    const model = normalizeText(modelInput.value);
    const year = Number(yearInput.value);
    const price = Number(priceInput.value);
    const mileage = Number(mileageInput.value);
    const condition = conditionInput.value;

    if (!url && !pastedText) {
        updateStatus('Please paste a listing URL, or paste the listing text, before analyzing.');
        return;
    }

    const listingDetails = url ? parseListingUrl(url) : { source: 'manual', listingType: 'Pasted listing text' };
    updateStatus(`Analyzing listing from ${listingDetails.listingType}...`);
    analyzeBtn.disabled = true;
    autoFillBtn.disabled = true;

    const priceRating = calculatePriceScore(price, year, make, model);
    const mileageRating = calculateMileageScore(mileage, year);
    const issueRating = calculateIssueScore(condition);
    const recommendationScore = computeRecommendation(priceRating, mileageRating, issueRating);

    const priceText = price ? `$${price.toLocaleString()}` : 'Not provided';
    const mileageText = mileage ? `${mileage.toLocaleString()} mi` : 'Not provided';
    const conditionText = condition.charAt(0).toUpperCase() + condition.slice(1);

    const issues = [];
    if (!make || !model) {
        issues.push('Make or model details are missing. Add them to improve the assessment.');
    }
    if (!price) {
        issues.push('Price is missing. The recommendation is less accurate without it.');
    }
    if (!mileage) {
        issues.push('Mileage is missing. Older vehicles with unknown miles are harder to evaluate.');
    }
    if (year && year < 2000) {
        issues.push('Older vehicles may need extra maintenance and parts can be harder to source.');
    }
    if (price && mileage && price / Math.max(mileage, 1) < 0.12) {
        issues.push('The listing price is unusually low for its mileage, which may indicate hidden issues.');
    }
    if (condition === 'poor') {
        issues.push('Poor condition suggests there may be maintenance or repair costs soon.');
    }
    if (!issues.length) {
        issues.push('No immediate red flags from the provided details. Still verify the vehicle in person.');
    }

    const fallbackRecommendationText = buildRecommendationText(recommendationScore, priceRating, mileageRating, issueRating);

    showCard(breakdownCard, 'Listing Summary', `
        <p><strong>Source:</strong> ${listingDetails.listingType}</p>
        <p><strong>Vehicle:</strong> ${make || 'Unknown'} ${model || ''}</p>
        <p><strong>Year:</strong> ${year || 'Unknown'}</p>
        <p><strong>Price:</strong> ${priceText}</p>
        <p><strong>Mileage:</strong> ${mileageText}</p>
        <p><strong>Condition:</strong> ${conditionText}</p>
    `);

    showCard(issuesCard, 'Potential Issues and Warnings', `<div class="result-list">${issues.map(item => `<p>${warningIconMarkup(item)}<span>${item}</span></p>`).join('')}</div>`);

    const brandInfo = getBrandInfo(make);
    showCard(brandIssuesCard, `${make || 'Brand'} Common Problems`, `
        <p>${brandInfo.description}</p>
        <div>${makeIssueChips(brandInfo.commonIssues)}</div>
    `);

    showCard(recommendationCard, 'Purchase Recommendation', `
        <p><strong>Overall score:</strong> ${recommendationScore} / 10</p>
        ${renderScoreGauge(recommendationScore)}
        <p>${fallbackRecommendationText}</p>
    `);

    try {
        const response = await fetch('/api/analyze-listing', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url,
                pastedText,
                overrides: {
                    make,
                    model,
                    year: Number.isNaN(year) ? null : year,
                    price: Number.isNaN(price) ? null : price,
                    mileage: Number.isNaN(mileage) ? null : mileage,
                    condition: condition === 'unknown' ? null : condition
                }
            })
        });

        if (!response.ok) {
            const payload = await response.json().catch(() => null);
            const message = payload?.error || 'The AI analysis endpoint returned an error.';
            updateStatus(`Basic review complete. ${message}`);
            return;
        }

        const payload = await response.json();

        if (payload?.scrapeBlocked) {
            updateStatus(payload.note || "This listing can't be auto-scraped. Paste the listing text and try again.", 'warning');
            return;
        }

        const analysis = payload?.analysis;
        const listing = payload?.listing;

        if (listing) {
            if (listing.make) makeInput.value = listing.make;
            if (listing.model) modelInput.value = listing.model;
            if (listing.year) yearInput.value = listing.year;
            if (listing.price) priceInput.value = listing.price;
            if (listing.mileage) mileageInput.value = listing.mileage;
            if (listing.condition) conditionInput.value = listing.condition;
        }

        if (analysis) {
            showCard(breakdownCard, 'Listing Summary', `
                <p><strong>Source:</strong> ${listingDetails.listingType}</p>
                <p><strong>Vehicle:</strong> ${listing?.make || make || 'Unknown'} ${listing?.model || model || ''}</p>
                <p><strong>Year:</strong> ${listing?.year || year || 'Unknown'}</p>
                <p><strong>Price:</strong> ${listing?.price ? `$${listing.price.toLocaleString()}` : priceText}</p>
                <p><strong>Mileage:</strong> ${listing?.mileage ? `${listing.mileage.toLocaleString()} mi` : mileageText}</p>
                <p><strong>Condition:</strong> ${listing?.condition ? listing.condition.charAt(0).toUpperCase() + listing.condition.slice(1) : conditionText}</p>
                <p><strong>AI price view:</strong> ${analysis.fairPriceAssessment || 'No price assessment available.'}</p>
            `);

            showCard(issuesCard, 'Potential Problems', `
                <p><strong>Listing red flags</strong></p>
                ${renderList(analysis.listingRedFlags || [], 'No obvious red flags were detected.', true)}
                <p><strong>Likely issues</strong></p>
                ${renderList(analysis.knownIssues || [], 'No common issues were flagged.', true)}
            `);

            showCard(brandIssuesCard, 'Questions for the Seller', `
                <p><strong>Questions to ask</strong></p>
                ${renderList(analysis.questionsForSeller || [], 'No seller questions were suggested.')}
                <p><strong>Inspection checklist</strong></p>
                ${renderList(analysis.inspectionChecklist || [], 'No inspection checklist was returned.')}
            `);

            showCard(recommendationCard, 'Purchase Recommendation', `
                <p><strong>Overall score:</strong> ${analysis.recommendationScore || recommendationScore} / 10</p>
                ${renderScoreGauge(analysis.recommendationScore || recommendationScore)}
                <p><strong>Verdict:</strong> ${analysis.overallRecommendation || fallbackRecommendationText}</p>
            `);

            updateStatus(analysis.overallRecommendation || 'AI analysis complete. Review the findings and decide whether to inspect the vehicle further.');
            return;
        }

        updateStatus('The AI response did not include a parseable analysis. Showing the basic review instead.');
    } catch (error) {
        updateStatus(`Basic review complete. AI analysis failed: ${error.message}`);
    } finally {
        analyzeBtn.disabled = false;
        autoFillBtn.disabled = false;
    }
});

autoFillBtn.addEventListener('click', autoFillFromUrl);

