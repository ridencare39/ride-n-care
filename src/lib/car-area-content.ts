/**
 * Car × area wave 1 — QUALITY-GATED published set (Batch 3, Parts 2–3).
 *
 * This file IS the gate: a car service × area page exists only if a fully
 * written, pair-specific entry appears here. There is no template renderer
 * that swaps locality names — every entry below carries its own answer-first
 * paragraph, local access notes, preparation list and three pair FAQs drawn
 * from the confirmed service data (src/lib/car-services.ts) and the
 * owner-verified locality data (src/lib/areas.ts).
 *
 * Wave composition = the scorer's canonical top-5 areas (plan mode,
 * scripts/score-car-area.py: electronic-city, indiranagar, koramangala,
 * bellandur, btm-layout) × the 4 preferred services = 20 pairs. Rejected
 * combinations and the rubric live in docs/seo/car-area-wave-1.md; later
 * waves extend this file together with that doc.
 *
 * Content rules:
 * - Landmarks/roads appear only where areas.ts lists them (owner-verified).
 * - No invented job counts, response times, customer stories or prices
 *   (car services are quoted in writing; pricing sections explain drivers).
 * - Operational promises stay limited to: background-verified mechanics,
 *   written quote before work starts, OEM-grade parts, digital invoice on
 *   WhatsApp, 45-day service warranty, workshop transport when a job
 *   genuinely needs the workshop.
 */

import { AREAS, PRIORITY_AREA_SLUGS } from "@/lib/areas";

export interface CarAreaEntry {
  serviceSlug: string;
  areaSlug: string;
  /** Answer-first paragraph (40–60 words), self-contained for AEO. */
  areaAnswer: string;
  /** 1–2 paragraphs of local access/context, unique to this pair. */
  areaNotes: string[];
  /** What to have ready when booking this pair. */
  prepare: string[];
  /** Exactly three pair-specific FAQs (visible + FAQPage schema). */
  faqs: [string, string][];
}

export const CAR_AREA_WAVE_1: CarAreaEntry[] = [
  // ── Car periodic service ────────────────────────────────────────────────────
  {
    serviceSlug: "car-periodic-service",
    areaSlug: "electronic-city",
    areaAnswer:
      "Car periodic service at your Electronic City home or office parking — oil, filters, brakes, fluids and a full multi-point checklist at your gate. You approve the written quote on WhatsApp before work starts; OEM-grade parts are shown sealed before fitting and invoiced digitally.",
    areaNotes: [
      "Electronic City bookings split between apartment bays off Neeladri Road and office parking near the Infosys and Wipro gates — the Flyover and Hosur Road commute in between. Long weekday parking followed by dense stop-start runs is the pattern, so the checklist pays particular attention to battery health and brake wear.",
      "Office-parking jobs need the vehicle's bay number and any visitor formalities sorted in advance; share both when booking. As everywhere, the mechanic works with hand tools in the bay, shows you every part that comes out, and the invoice lands on WhatsApp before you pay.",
    ],
    prepare: [
      "Bay number and whether the car sits in office or residential parking",
      "Car model and fuel type for the written quote",
      "Preferred time window around your commute",
    ],
    faqs: [
      [
        "Can the mechanic come to my office parking in Electronic City?",
        "Yes — share the campus or building, bay number and any visitor formalities when booking. The job needs one bay and no lift, and the same written-quote process applies as at home.",
      ],
      [
        "My car stands all week while I commute by bus. Is that a problem?",
        "Long parked spells are the classic battery-killer, so the visit includes a battery and charging-system test as part of the checklist. Tyres are checked for pressure and age as well.",
      ],
      [
        "How is the price confirmed for periodic service?",
        "It depends on your car's make, model and engine — oil grade and capacity, filter type and brake condition all change the quote. Share the model and the exact amount is confirmed in writing before work starts.",
      ],
    ],
  },
  {
    serviceSlug: "car-periodic-service",
    areaSlug: "indiranagar",
    areaAnswer:
      "Car periodic service in your Indiranagar parking bay — engine oil and filter, air filter, brake measurement, fluids, battery test and a multi-point inspection. A written quote is approved on WhatsApp before anything is opened, and the digital invoice follows the completed job.",
    areaNotes: [
      "Indiranagar splits between the 100 Feet Road and CMH Road commercial stretch — where office and showroom parking needs the bay details shared upfront — and the residential 2nd Stage lanes where one basement bay covers the job. Mention your cross street (12th Main, 100 Feet Road side) when booking so the mechanic's route and window are confirmed on WhatsApp.",
      "Short errand runs plus Old Airport Road commutes mean engines often idle long in traffic with the AC on; the checklist responds by measuring rather than assuming — pad thickness, fluid condition and battery voltage are all read, and anything worn is photographed and quoted separately.",
    ],
    prepare: [
      "Cross street or landmark (100 Feet Road, CMH Road, 12th Main side)",
      "Car model and engine for the written quote",
      "Basement or stilt bay details if the car is not street-parked",
    ],
    faqs: [
      [
        "Can you work in the tight lanes off 100 Feet Road?",
        "Yes — the job needs one parking bay and no lift, which most buildings here have. Share your cross street and bay details when booking so the mechanic reaches the right entrance within the confirmed window.",
      ],
      [
        "My car mostly does short trips in Indiranagar. Does that change the service?",
        "Short trips keep the engine from fully warming, so oil shears and collects moisture faster than the calendar suggests. The checklist still covers everything due, and the mechanic records your usage so the next interval is set honestly.",
      ],
      [
        "What happens if the inspection finds extra work?",
        "The mechanic photographs the finding, explains it and quotes it separately at MRP. Nothing beyond the approved checklist is done without your written approval, and old parts are handed back with the invoice.",
      ],
    ],
  },
  {
    serviceSlug: "car-periodic-service",
    areaSlug: "koramangala",
    areaAnswer:
      "Car periodic service at your Koramangala doorstep — engine oil and filter, air filter, brake check, coolant and fluids, battery test and a multi-point inspection in your parking bay. A written quote is approved on WhatsApp before anything is opened, and the digital invoice follows the job.",
    areaNotes: [
      "Koramangala mixes tight inner lanes around the 5th and 6th blocks and 80 Feet Road with bigger complex parking near Forum Mall and St. John's Hospital side. Street-parked cars are the exception here: most bookings happen in basement bays, so mention your block and gate when booking and the mechanic comes prepared with drip trays.",
      "Stop-start driving between the junctions is hard on oil and brakes, which is why the periodic checklist here leans on measuring — pad thickness, fluid condition, battery voltage — instead of assuming from the odometer. Anything worn is shown to you before replacement is quoted.",
    ],
    prepare: [
      "Car model and engine so the quote reflects the right oil grade and capacity",
      "Basement level and block/gate details for the mechanic's arrival",
      "Two parking bays' worth of clear space where possible",
    ],
    faqs: [
      [
        "Can you do a full periodic service in a Koramangala basement bay?",
        "Yes — the checklist is built for a parking bay: no hoist or pit is needed. Tight basements just need the boot and bonnet reachable, and the mechanic brings drip trays and containment for fluid work.",
      ],
      [
        "How long will the mechanic be at my place in Koramangala?",
        "The arrival window is confirmed when you book, and the visit runs until the checklist is complete and you have inspected the work — we do not quote durations we cannot guarantee.",
      ],
      [
        "What if the inspection finds extra work on my car?",
        "The mechanic photographs the finding, explains it and quotes it separately at MRP. Nothing beyond the approved checklist is done without your written approval.",
      ],
    ],
  },
  {
    serviceSlug: "car-periodic-service",
    areaSlug: "bellandur",
    areaAnswer:
      "Car periodic service at your Bellandur home or office parking — oil and filters, brake measurement, fluids, battery test and a multi-point checklist in your bay. Written quote approved on WhatsApp before work starts; OEM-grade parts shown sealed, digital invoice after you inspect the job.",
    areaNotes: [
      "Bellandur sits on the ORR corridor between the Iblur Junction crawl and the tech-park stretches — RMZ Ecospace and the office blocks along the ring road — with apartment bays filling the side streets. Commuter cars here see long idling runs and dusty ORR air, so the checklist gives the air and cabin filters a genuine inspection and measures brake wear against actual stopping patterns.",
      "Office-parking jobs need the campus or building, bay number and visitor formalities shared at booking; apartment bookings need the block and gate. Either way the mechanic works inside the bay with hand tools, shows every part that comes off, and quotes anything extra at MRP before fitting.",
    ],
    prepare: [
      "Bay number plus campus/building (office) or block/gate (apartment) details",
      "Car model and fuel type for the written quote",
      "A plug point within reach of the bay if one is available",
    ],
    faqs: [
      [
        "Does dusty ORR driving change what the service checks?",
        "Yes — dust loads the air and cabin filters faster, so both are inspected with their condition shown to you. Replacement is quoted at MRP only when a filter is genuinely due, never on a fixed schedule.",
      ],
      [
        "Can you service my car at my office parking near RMZ Ecospace?",
        "Yes — share the campus, bay number and any visitor registration when booking. The job needs one bay and no lift, with the same written-quote and digital-invoice process as at home.",
      ],
      [
        "How is the periodic service price confirmed?",
        "It depends on your car's make, model and engine — oil grade and capacity, filter type and brake condition all change the quote. Share the model and the exact amount is confirmed in writing before work starts.",
      ],
    ],
  },
  {
    serviceSlug: "car-periodic-service",
    areaSlug: "btm-layout",
    areaAnswer:
      "Car periodic service in your BTM Layout parking bay — engine oil and filter change, air filter, brake measurement, coolant and fluids, battery test and a multi-point inspection. The written quote is approved on WhatsApp before work starts, and the invoice reaches your WhatsApp after the job.",
    areaNotes: [
      "BTM Layout's 16th Main spine and the 1st and 2nd Stage grid funnel traffic towards Silk Board Junction and Madiwala Checkpost — which means most cars here accumulate the stop-start kilometres that age oil and wear brakes early. The checklist responds by measuring: pad thickness, fluid condition and battery voltage are read, not assumed from the odometer.",
      "Parking is mostly basement or stilt bays in the 2nd Stage apartments and smaller layouts; one bay and a nearby plug point cover the full job. Share your stage and cross street when booking so the arrival window is confirmed on WhatsApp, and the mechanic arrives with drip trays for the fluid work.",
    ],
    prepare: [
      "Stage and cross street (16th Main side, 2nd Stage, etc.)",
      "Car model and engine capacity for the written quote",
      "Basement/stilt bay details and plug point access if available",
    ],
    faqs: [
      [
        "Does the Silk Board crawl really wear the car faster?",
        "Stop-start running ages oil faster than distance suggests and works the brakes hard — which is why the visit measures pad thickness and fluid condition instead of going by the calendar alone.",
      ],
      [
        "Can the full checklist happen in a BTM basement bay?",
        "Yes — no hoist or pit is needed, just one bay with the bonnet and boot reachable. The mechanic brings drip trays and containment, and the invoice is on WhatsApp before you pay.",
      ],
      [
        "What if my car is due its free service at the company workshop?",
        "Use the free visits first — we say so honestly at booking. Doorstep periodic service fits between free services and once the free-service period has ended.",
      ],
    ],
  },

  // ── Car AC service ──────────────────────────────────────────────────────────
  {
    serviceSlug: "car-ac-service",
    areaSlug: "electronic-city",
    areaAnswer:
      "Car AC service at your Electronic City home or office bay — vent temperature, gas level and compressor engagement measured first, then cooling coil cleaning and cabin filter inspection. Written quote approved on WhatsApp before work starts; leak findings shared before any gas is refilled.",
    areaNotes: [
      "The Hosur Road and Flyover commute punishes ACs twice — heavy idling in jams and full-blow on the move — so a cooling complaint here gets the full measurement sequence, not a guess. Office-parking bookings are welcome: share the campus, bay and any visitor formalities when booking.",
      "Coil cleaning happens in the bay with drip trays and containment, so basement and podium parking both work. If the diagnosis points to a leak or compressor fault, the repair is quoted separately — the visit never turns into a refill on a system that cannot hold gas.",
    ],
    prepare: [
      "Car model for the refrigerant type and quote",
      "Bay number and campus/building access details for office jobs",
      "Symptom notes: cooling at speed vs at idle",
    ],
    faqs: [
      [
        "My AC cools while driving but not in traffic — can you find why?",
        "That pattern usually points to the compressor or condenser airflow rather than gas level. The visit measures vent temperature at idle and revving, which separates the two before anything is quoted.",
      ],
      [
        "Can the visit happen in my office parking at Electronic City?",
        "Yes — with the bay number and any campus formalities arranged when booking. The same written-quote and digital-invoice process applies as at home.",
      ],
      [
        "Will you tell me if the AC just needs cleaning, not gas?",
        "That is the point of measuring first — a dirty coil and a loaded cabin filter are found before any refill is suggested, and cleaning is quoted separately if that is all the system needs.",
      ],
    ],
  },
  {
    serviceSlug: "car-ac-service",
    areaSlug: "indiranagar",
    areaAnswer:
      "Car AC service in your Indiranagar parking bay — vent temperature measured before and after, gas level checked, compressor engagement tested, cooling coil cleaned and cabin filter inspected. A written quote is approved first, and any leak finding is shared in writing before gas goes in.",
    areaNotes: [
      "Between the 100 Feet Road crawl and the CMH Road metro traffic, Indiranagar cars idle heavily with the AC on — exactly when a weak compressor or dirty coil shows up. The visit measures each suspect in order, so the fix is justified by readings rather than a refill habit.",
      "Basement and stilt bays in the 2nd Stage lanes work fine: the engine runs briefly for vent readings, coil cleaning is contained with drip trays, and the cabin filter's condition is shown to you before a replacement is quoted at MRP. Share your cross street when booking so the window is confirmed on WhatsApp.",
    ],
    prepare: [
      "Car model — refrigerant type and quantity differ by model and change the quote",
      "Cross street and bay details (100 Feet Road side, 12th Main, 2nd Stage)",
      "Symptom description: gradual loss, sudden failure, or smell",
    ],
    faqs: [
      [
        "My AC smells musty — is that the cabin filter?",
        "Often, yes — a saturated cabin filter or dirty coil holds moisture and smells. Both are inspected during the visit and their condition shown to you; cleaning or replacement is quoted before anything is done.",
      ],
      [
        "How long does the AC visit take in Indiranagar?",
        "The arrival window is confirmed at booking and the visit runs until the gas check, coil cleaning, filter check and compressor test are complete — you feel the before-and-after vent readings yourself.",
      ],
      [
        "Do you refill gas without a leak check?",
        "No — a top-up on a leaking system is money wasted and gone in weeks. If the system does not hold gas, you get the finding in writing and a quote for the real repair.",
      ],
    ],
  },
  {
    serviceSlug: "car-ac-service",
    areaSlug: "koramangala",
    areaAnswer:
      "Car AC service in your Koramangala parking bay — vent temperature, gas level, compressor engagement, cooling coil cleaning and cabin filter inspection, all measured before anything is refilled. A written quote is approved on WhatsApp; leak findings are shared honestly before any gas goes in.",
    areaNotes: [
      "Between the Sony World Junction crawls and the food-street loops, Koramangala cars idle a lot with the AC on — which is exactly when a weak compressor or a dirty coil shows up. The doorstep visit measures each suspect in order, so the fix is the real one.",
      "Basement bays in the 5th and 6th block apartments work fine: the car runs briefly for readings, coil cleaning is contained with drip trays, and the cabin filter's condition is shown to you before a replacement is quoted at MRP.",
    ],
    prepare: [
      "Car model — refrigerant type differs across models and changes the quote",
      "Basement level and block/gate details",
      "A description of the symptom (slow loss, sudden failure, smell) for the diagnosis",
    ],
    faqs: [
      [
        "My AC smells musty after rain in Koramangala — is that the filter?",
        "Often, yes — a saturated cabin filter or a dirty coil holds moisture and smells. Both are inspected during the visit and their condition shown to you; cleaning or replacement is quoted before anything is done.",
      ],
      [
        "How long does the AC visit take?",
        "The arrival window is confirmed at booking and the visit runs until the gas check, coil cleaning, filter check and compressor test are complete and you have felt the before-and-after vent readings.",
      ],
      [
        "Do you replace cabin filters on the spot?",
        "Yes — the filter's condition is shown to you first, and a replacement is quoted at MRP before fitting. The old filter comes out in front of you.",
      ],
    ],
  },
  {
    serviceSlug: "car-ac-service",
    areaSlug: "bellandur",
    areaAnswer:
      "Car AC service at your Bellandur home or office bay — vent temperature and gas level measured, compressor engagement tested, cooling coil cleaned and cabin filter inspected in your parking bay. Written quote before work starts; if the system leaks, the finding comes before any refill.",
    areaNotes: [
      "Bellandur's ORR corridor driving means long stretches of full-blow AC through the Iblur and ring-road crawls, with construction dust along the corridor loading cabin filters quickly. The diagnosis therefore inspects the filter and coil before assuming low gas — measurement first, refill second.",
      "Tech-park and apartment bays both work: the engine runs briefly for vent readings and coil cleaning is contained with drip trays. Office jobs need the campus and bay number shared at booking; if the diagnosis points to a leak or compressor fault, the repair is quoted separately — never a refill onto a system that cannot hold gas.",
    ],
    prepare: [
      "Car model for the refrigerant type and written quote",
      "Bay number plus campus/building or block/gate access details",
      "When the cooling loss started and whether it was gradual or sudden",
    ],
    faqs: [
      [
        "The AC was refilled last year and is weak again — why?",
        "If cooling faded over months, the system may have a slow leak — refilling without finding it wastes the gas. The visit checks whether the system holds pressure and shares the finding in writing before any top-up.",
      ],
      [
        "Can the coil cleaning be done in a basement bay?",
        "Yes — coil cleaning is done in the bay with drip trays and containment so nothing pools. The before-and-after vent readings show the difference on the spot.",
      ],
      [
        "Do you check the cabin filter before suggesting gas?",
        "Yes — a loaded cabin filter and dirty coil are found first because they starve cooling on their own. Their condition is shown to you, and replacement is quoted at MRP only if genuinely due.",
      ],
    ],
  },
  {
    serviceSlug: "car-ac-service",
    areaSlug: "btm-layout",
    areaAnswer:
      "Car AC service in your BTM Layout parking bay — vent temperature measured at idle and revving, gas level checked, compressor tested, cooling coil cleaned and cabin filter inspected. The written quote is approved on WhatsApp first, and leak findings are shared before any refill happens.",
    areaNotes: [
      "The Silk Board Junction crawl means long idling with the AC working flat out, and the Madiwala Checkpost approach adds stop-start heat soak — patterns that show up as weak vent temperatures before gas is actually low. The visit measures first so the refill, if needed, is justified by readings.",
      "Basement and stilt bays across the 1st and 2nd Stage apartments are routine; the engine runs briefly during testing and coil cleaning is contained with drip trays. Share your stage and cross street when booking — the arrival window is confirmed on WhatsApp and the invoice follows the job.",
    ],
    prepare: [
      "Car model and refrigerant history if known (last refill, if any)",
      "Stage and cross street for the mechanic's arrival",
      "Whether the cabin smells dusty or musty — it points the diagnosis",
    ],
    faqs: [
      [
        "Why is my AC weakest when stuck at Silk Board?",
        "Idle cooling depends on the compressor and condenser airflow — exactly what the visit measures at idle versus revving. The readings separate a weak compressor from low gas before anything is quoted.",
      ],
      [
        "Can AC service happen in my BTM basement?",
        "Yes — testing and coil cleaning are done in the bay with drip trays. The car runs briefly for vent readings, so a bay with reasonable airflow is preferred.",
      ],
      [
        "What does AC service cost in BTM Layout?",
        "It depends on your model — refrigerant type and quantity, cabin filter cost and the system's condition change the quote. Share the model and the exact amount is confirmed in writing before work starts.",
      ],
    ],
  },

  // ── Car battery service ─────────────────────────────────────────────────────
  {
    serviceSlug: "car-battery-service",
    areaSlug: "electronic-city",
    areaAnswer:
      "Car battery testing and replacement at your Electronic City home or office parking — free load, voltage and charging-system test first, then a doorstep replacement in your bay only if the test says the battery is finished. Quote confirmed in writing before fitting; invoice on WhatsApp.",
    areaNotes: [
      "Long weekdays parked near the office campuses or at home off Neeladri Road, then dense start-stop runs on Hosur Road — that cycle is hard on batteries and explains most slow-cranks here. The test-first visit separates a tired battery from a charging fault or drain before money is spent.",
      "Office-bay and basement jobs both work; share the campus or building, bay number and visitor formalities when booking. Common battery sizes travel with the van so most replacements are a single visit, with disposal of the old battery confirmed with you at booking.",
    ],
    prepare: [
      "Car model and parking details (campus/office or home bay)",
      "Symptom history: jump starts, slow cranks, warning light",
      "Access notes if the car sits behind a barrier",
    ],
    faqs: [
      [
        "Can you come to my office parking for a dead battery?",
        "Yes — share the campus, bay number and any visitor registration when you call or WhatsApp. The mechanic tests first; replacement follows only with your approval on the written quote.",
      ],
      [
        "Was it a one-off drain or is my battery dying?",
        "The voltage reading before and after, plus the charging response, answers that — the mechanic shares the battery health reading with you so the decision is yours on real numbers.",
      ],
      [
        "What if the battery is swollen or leaking?",
        "A swollen or leaking battery is not jump-started — replacement is the safe path, quoted on the written estimate before the swap happens in your bay.",
      ],
    ],
  },
  {
    serviceSlug: "car-battery-service",
    areaSlug: "indiranagar",
    areaAnswer:
      "Car battery service in your Indiranagar parking bay — a free load and voltage test plus a charging-system and drain check comes first, and a replacement is fitted on the spot only if the test says the battery is genuinely finished. The written quote states the total before work starts.",
    areaNotes: [
      "Short evening runs between the 100 Feet Road cafés and home rarely give the alternator enough running time to recover a start — the classic pattern behind batteries ageing early here. The free test measures load, voltage and charging response so a tired battery is told from a charging fault before any purchase.",
      "Basement and stilt bays across the 2nd Stage are routine; the car stays parked throughout and common battery sizes travel with the van, so most replacements are a single visit. Terminals are cleaned and protected on the new fit, and the old battery's disposal is confirmed with you at booking.",
    ],
    prepare: [
      "Car model and battery location if you know it (some models hide it)",
      "Cross street and bay details for the mechanic's arrival",
      "Whether the car was jump-started recently",
    ],
    faqs: [
      [
        "My car cranks slowly some mornings — is it the battery?",
        "The free test answers it: load and voltage on the battery, then alternator output and standing drain. If the battery passes, we say so — the fault is elsewhere and you have paid nothing.",
      ],
      [
        "Can the replacement happen in my apartment's stilt parking?",
        "Yes — the swap needs no lift and common sizes are carried in the van. Share your cross street and bay details when booking so the arrival window is confirmed on WhatsApp.",
      ],
      [
        "Do the batteries carry a warranty?",
        "Warranty terms for the battery fitted are stated on the written quote and the invoice before you pay — you see the terms before the work starts.",
      ],
    ],
  },
  {
    serviceSlug: "car-battery-service",
    areaSlug: "koramangala",
    areaAnswer:
      "Car battery service in your Koramangala parking bay — free load and voltage test, charging-system and drain check first, then doorstep replacement only if the test condemns the battery. Terminals cleaned and protected, disposal confirmed at booking, invoice on WhatsApp before payment.",
    areaNotes: [
      "Short-hop driving between Koramangala's junctions gives the alternator little time to recharge after each start, which ages batteries faster than the odometer suggests — so the test measures the real state, not the age. A battery that passes gets an honest pass.",
      "Basement bays in the blocks off 80 Feet Road and around Forum side are routine for the van; the car stays parked throughout. If the alternator or a parasitic drain is the real fault, the finding is written down and quoted separately — no battery sold to mask it.",
    ],
    prepare: [
      "Car model and battery location if you know it (some models hide it)",
      "Basement/block access details",
      "Whether the car was jump-started recently",
    ],
    faqs: [
      [
        "Do you check the alternator too, or just sell batteries?",
        "Both — charging output and standing drain are tested before any replacement is recommended. A new battery fitted to a faulty charging system dies the same way, so the root cause is found first.",
      ],
      [
        "What happens to my old battery?",
        "Disposal of the old battery is confirmed with you at booking and the swap happens in your bay — nothing is left behind, and the invoice on WhatsApp lists what was fitted.",
      ],
      [
        "My car is completely dead right now — can you still help?",
        "Yes — call 080 6940 9289 or WhatsApp 82969 50339 with your location. The mechanic jump-starts safely with proper leads, tests the battery and charging system, and replacement follows only if the test says so.",
      ],
    ],
  },
  {
    serviceSlug: "car-battery-service",
    areaSlug: "bellandur",
    areaAnswer:
      "Car battery testing and replacement at your Bellandur doorstep — the free load, voltage and charging-system test comes first, and a replacement is fitted in your bay only if the test says the battery is genuinely finished. The total, including fitting, is confirmed in writing before work starts.",
    areaNotes: [
      "Bellandur's mix of office-parked weekdays and ORR idling runs is hard on batteries — heat plus long parked spells is the ageing pattern. The visit starts with the test, not the sale: battery load and voltage, alternator output, and a standing-drain look so a new battery does not die the same way.",
      "Tech-park bays and apartment basements both work; the car does not need to be driven. Common battery sizes travel with the van, so most replacements finish in one visit — terminals cleaned and protected, old battery's disposal confirmed with you at booking, invoice on WhatsApp before you pay.",
    ],
    prepare: [
      "Car model and where it is parked (campus bay, basement level, gate)",
      "Symptom notes: slow crank, jump-start history, dashboard battery light",
      "Rough age of the current battery if known",
    ],
    faqs: [
      [
        "My car sat through a long weekend near the office and now cranks slowly — battery or alternator?",
        "The free test separates the two: battery load and voltage first, then alternator output and standing drain. If the battery passes, the finding says so and you have paid nothing.",
      ],
      [
        "Can you replace the battery in a tech-park basement?",
        "Yes, if the bay is reachable — the job needs no lift and common sizes are carried. Share the campus, level and access details when booking so the mechanic comes prepared.",
      ],
      [
        "What does a replacement battery cost?",
        "Batteries are priced by your car's model and capacity and quoted at MRP before fitting; the test is free. The total including fitting is confirmed in writing before work starts.",
      ],
    ],
  },
  {
    serviceSlug: "car-battery-service",
    areaSlug: "btm-layout",
    areaAnswer:
      "Car battery service at your BTM Layout doorstep — a free battery and charging-system test in your bay, with replacement fitted on the spot only if the battery is genuinely finished. The written quote is approved before work starts, and common sizes mean a single-visit fit.",
    areaNotes: [
      "BTM's short-trip rhythm — school runs, Silk Board hops, errands on the 16th Main spine — gives the alternator little recharge time between starts, which is why batteries here often age before their sticker says. The test measures load, voltage and charging response so the verdict is the battery's real state.",
      "Basement and stilt bays across the 1st and 2nd Stage are routine; the swap happens with the car parked, terminals cleaned and protected, and warranty terms stated on the quote and invoice before you pay. Share your stage when booking so the arrival window is confirmed on WhatsApp.",
    ],
    prepare: [
      "Stage and cross street for the mechanic's arrival",
      "Car model for the correct battery capacity",
      "How long the car typically sits between drives",
    ],
    faqs: [
      [
        "How long should a car battery last with BTM's short-trip driving?",
        "Around three to five years, and frequent short trips pull that towards the lower end. The free test tells you where your battery actually stands instead of guessing from its age.",
      ],
      [
        "If the battery is fine, do I pay anything?",
        "No — the test is free. If the alternator or a drain is the real culprit, that finding is shared in writing and quoted separately instead of selling you a battery.",
      ],
      [
        "My car is dead in the basement right now — what do I do?",
        "Call 080 6940 9289 or WhatsApp 82969 50339 with your exact parking location. The mechanic jump-starts safely, runs the tests, and quotes a replacement only if the battery genuinely needs it.",
      ],
    ],
  },

  // ── Car brake service ───────────────────────────────────────────────────────
  {
    serviceSlug: "car-brake-service",
    areaSlug: "electronic-city",
    areaAnswer:
      "Car brake service at your Electronic City home or office bay — free inspection with pad thickness measured on all wheels, disc and fluid condition checked, and replacement quoted at MRP before fitting. Old parts returned; work done in your bay with the 45-day service warranty.",
    areaNotes: [
      "The Hosur Road and Flyover commute means sustained speed followed by hard stops at the exits — exactly the braking pattern that wears pads fastest. The visit measures each wheel's actual thickness, so the quote reflects real wear rather than a mileage rule of thumb.",
      "Office and apartment bays both work; share the campus or complex, bay number and any access formalities when booking. Discs, pads and fluid are all doorstep-capable, replacements are shown sealed before fitting, and the invoice on WhatsApp lists parts and labour separately.",
    ],
    prepare: [
      "Car model and parking details (campus bay or home)",
      "Brake symptom: noise, pedal feel, vibration, warning light",
      "Roughly when the pads were last changed, if known",
    ],
    faqs: [
      [
        "My brakes vibrate when braking from highway speed — is it the discs?",
        "Likely disc runout or uneven deposit build-up — both are measured during the free inspection. If the discs are within spec, cleaning and pad condition get checked before any replacement is suggested.",
      ],
      [
        "Can you do the job in office parking at Electronic City?",
        "Yes — pad, disc and fluid work needs one bay and a level surface. Share the campus and bay details when booking so access is arranged.",
      ],
      [
        "What does brake pad replacement cost?",
        "Pads are priced by your car's model and quoted at MRP before fitting; the inspection is free. The total including labour is confirmed in writing before work starts.",
      ],
    ],
  },
  {
    serviceSlug: "car-brake-service",
    areaSlug: "indiranagar",
    areaAnswer:
      "Car brake service in your Indiranagar parking bay — pad thickness measured on all four wheels, discs checked for scoring, brake fluid inspected, and replacement quoted at MRP only with your approval. Old parts are handed back with the wear numbers; the job carries a 45-day warranty.",
    areaNotes: [
      "100 Feet Road and CMH Road traffic means constant light braking with the occasional hard stop — a pattern that glazes pads and wears them unevenly, so the measurement visit checks each wheel separately rather than quoting a blanket change. Squeal, a soft pedal or a pull to one side are all traced to numbers.",
      "Basement and stilt bays across the 2nd Stage lanes are routine; the job needs one level bay and wheel clearance, nothing more. Fluid condition is checked on the same visit, a fluid change is quoted only when the test shows it is due, and the finished work is inspected with you before you pay.",
    ],
    prepare: [
      "Car model for correct pad and disc specification",
      "Cross street and bay details (100 Feet Road side, 12th Main, 2nd Stage)",
      "When the symptom happens: cold, hot, reversing, or under hard braking",
    ],
    faqs: [
      [
        "Is the brake inspection really free?",
        "Yes — pad, disc and fluid inspection is free, and you pay only if you approve a quoted replacement. The measurements are shared with you before any decision is made.",
      ],
      [
        "The car pulls slightly left when braking — can you diagnose that at home?",
        "Yes — a pull usually traces to uneven pad wear, a sticking caliper slider or tyre pressures, all checked during the visit. The finding is shared in writing before any repair is quoted.",
      ],
      [
        "Do I get the old pads back?",
        "Yes — old parts are handed back with the wear visible, which is the proof the replacement actually happened. Everything fitted also appears on the digital invoice.",
      ],
    ],
  },
  {
    serviceSlug: "car-brake-service",
    areaSlug: "koramangala",
    areaAnswer:
      "Car brake service in your Koramangala parking bay — pad thickness measured on all wheels, discs checked for scoring, brake fluid condition inspected, and any replacement quoted at MRP before fitting. Old parts are returned to you, and the work carries the 45-day service warranty.",
    areaNotes: [
      "Koramangala's junction-crawl driving is the kind that wears pads well ahead of the manufacturer interval — stop-start braking is exactly what the measurement-first visit is for. Squeal, a soft pedal or a pull to one side are all checked against actual wear numbers.",
      "Basement bays across the 5th and 6th blocks and the 80 Feet Road side are routine; the job needs a level bay and wheel clearance, nothing more. Fluid condition is checked on the same visit, and a fluid change is quoted only when the test shows it is due.",
    ],
    prepare: [
      "Car model for correct pad and disc specification",
      "Basement/block and gate details",
      "When the symptom happens: cold, hot, while reversing, under hard braking",
    ],
    faqs: [
      [
        "Is brake inspection free?",
        "Yes — pad, disc and fluid inspection is free, and you pay only if you approve a quoted replacement. The measurements are shared with you before any decision.",
      ],
      [
        "Can you change brake fluid in my basement?",
        "Yes — a fluid change is a bay job. It is quoted only when the fluid's condition shows it is due, typically every two years or when the pedal feels spongy.",
      ],
      [
        "How often do Koramangala's conditions wear pads out?",
        "Heavy city braking can halve the manufacturer interval — which is why the visit measures actual thickness instead of assuming from the service sticker.",
      ],
    ],
  },
  {
    serviceSlug: "car-brake-service",
    areaSlug: "bellandur",
    areaAnswer:
      "Car brake service at your Bellandur home or office bay — pads measured wheel by wheel, discs and fluid checked, replacement quoted at MRP and done in your bay only with your approval. Wear numbers are shown to you, old parts come back, and the job carries a 45-day warranty.",
    areaNotes: [
      "ORR driving into the Iblur Junction crawl loads brakes with sustained speed followed by hard stops — front pads wear fastest and often unevenly, so each wheel is measured separately. The free inspection converts a symptom like squeal or a soft pedal into actual numbers before anything is quoted.",
      "Tech-park bays and apartment basements both work — one level bay and the job is done: pads, discs and fluid are all fully doorstep-capable. Share the campus or block details when booking; replacements are shown sealed before fitting and the finished work is inspected with you before you pay.",
    ],
    prepare: [
      "Car model and parking details (campus bay or apartment basement)",
      "Brake symptom and when it occurs",
      "Roughly when pads were last changed, if known",
    ],
    faqs: [
      [
        "Why do my brakes squeal after rainy ORR runs?",
        "Surface moisture and dust cause light squeal that usually clears — but persistent squeal under braking can be the wear indicator. The measurement on all four wheels settles which one you have.",
      ],
      [
        "Can disc replacement happen in my parking bay?",
        "Yes when the measurement shows discs are due — the inspection is free, parts are quoted at MRP before fitting, and the old discs stay with you if you want them.",
      ],
      [
        "Is there a warranty on the brake work?",
        "A 45-day service warranty applies to the brake work performed, plus the manufacturer warranty on the parts fitted — both stated before you approve the quote.",
      ],
    ],
  },
  {
    serviceSlug: "car-brake-service",
    areaSlug: "btm-layout",
    areaAnswer:
      "Car brake service in your BTM Layout parking bay — pads measured on all four wheels, discs checked for scoring and runout, brake fluid inspected, and replacement quoted at MRP only with your approval. Old parts are returned; the job carries the 45-day service warranty.",
    areaNotes: [
      "Braking into the Silk Board Junction crawl and the Madiwala Checkpost approach works the front pads hard — the measurement-first visit catches uneven wear between axles early. Squeal after rain, a soft pedal or vibration all get traced to actual measurements, not guesses.",
      "Basement and stilt bays across the 1st and 2nd Stage are straightforward for the van; the job needs one level bay. Pad, disc and fluid work is fully doorstep-capable, parts are shown sealed before fitting, and the finished work is inspected with you before you pay by UPI, card or cash.",
    ],
    prepare: [
      "Car model for correct pad and disc parts",
      "Stage and cross street for the mechanic's arrival",
      "Whether the noise happens cold, hot or only when braking",
    ],
    faqs: [
      [
        "Why do my brakes squeal after a rainy week?",
        "Surface rust from overnight moisture usually scrapes off in a few stops — harmless. Persistent squeal while braking can be the wear indicator telling you the pads are due, which the measurement settles.",
      ],
      [
        "Do you replace just the front pads if the rears are fine?",
        "Yes — the quote follows the measurements, not a blanket package. If the rear pads still have life, they stay; the written quote lists exactly what is being replaced and at what price.",
      ],
      [
        "Can rear drum brakes be serviced at the doorstep too?",
        "Drum-brake shoe work on some older models is a workshop job with transport arranged and the estimate shared first — the inspection visit tells you honestly which side your car falls on.",
      ],
    ],
  },

  // ── Wave 2 (Batch 4, 2026-09-27): the four Batch-3 shortlisted pairs, each
  // re-scored before publishing. Same gate: owner-verified landmarks only,
  // pair-specific usage and access narrative, 3 pair FAQs.
  {
    serviceSlug: "car-periodic-service",
    areaSlug: "hsr-layout",
    areaAnswer:
      "Car periodic service at your HSR Layout doorstep — engine oil and filter, air filter, brake measurement, fluids, battery test and a multi-point inspection in your sector's parking bay. The written quote is approved on WhatsApp before anything is opened, and the digital invoice follows the job.",
    areaNotes: [
      "HSR Layout runs on the 27th Main spine and its sector grid, with Agara Lake at one end and the Harlur Road side at the other. Bookings split between house frontages along the main roads and basement bays in the apartment clusters — share your sector and gate or bay number when booking so the mechanic reaches the right entrance with the right kit.",
      "The sector grid funnels traffic through a handful of junctions on the way to the Outer Ring Road and Koramangala, so most cars here see dense stop-start runs twice a day. The periodic checklist responds by measuring rather than assuming: pad thickness, fluid condition and battery voltage are all read, and anything near its limit is photographed and quoted separately.",
    ],
    prepare: [
      "Sector number and gate/bay details for the mechanic's arrival",
      "Car model and engine for the written quote",
      "Preferred time window around your commute",
    ],
    faqs: [
      [
        "Do you cover every sector of HSR Layout?",
        "Yes — all sectors along and off the 27th Main spine, including the BDA Complex neighbourhood and the Harlur Road side. Your sector and gate number go into the booking so the arrival window is confirmed against the right entrance.",
      ],
      [
        "My car mostly idles in HSR traffic with the AC on. Does that change the service?",
        "Long idling and short runs age oil faster than the odometer suggests, so the visit still follows the calendar-and-km interval and the mechanic records your usage pattern to set the next one honestly.",
      ],
      [
        "What if the inspection finds work beyond the checklist?",
        "Nothing extra is done without your approval — the finding is photographed, explained and quoted at MRP, and the old parts come back with the digital invoice.",
      ],
    ],
  },
  {
    serviceSlug: "car-ac-service",
    areaSlug: "jayanagar",
    areaAnswer:
      "Car AC service at your Jayanagar home or office parking — gas level check, cooling-coil cleaning, cabin filter inspection, compressor and vent-temperature checks, done in one bay with hand tools. The written quote is approved on WhatsApp before work starts; no refrigerant is added without a passed leak check.",
    areaNotes: [
      "Jayanagar's 4th Block shopping complex and South End Circle anchor the commercial side, while the 11th Main corridors and the blocks around Jayanagar Metro Station are residential — most bookings here are street or stilt parking, with basement bays in the newer complexes. Say which block and cross street you're near when booking.",
      "The 4th Block and South End Circle loops mean long idle stretches in the shade with the AC running — blower bearings and cooling coils see constant summer load. The service measures before and after: vent temperature readings at the start and end of the visit show you exactly what improved.",
    ],
    prepare: [
      "Block number and nearest cross street (4th Block, 11th Main, South End Circle side)",
      "Whether the cooling is weak all the time or only in traffic",
      "Car model so the refrigerant type and filter are confirmed before arrival",
    ],
    faqs: [
      [
        "The AC is fine in the morning but weak by evening traffic. Why?",
        "Weak cooling under load with acceptable cooling when moving usually points to airflow — a choked cooling coil or cabin filter — rather than lost gas. The service checks both before any refrigerant is discussed.",
      ],
      [
        "Can the compressor be repaired at the doorstep in Jayanagar?",
        "The compressor is checked on site; a failed one is a quoted, scheduled job because replacement needs parts ordering — the diagnosis and quote happen at your bay, the heavy work is arranged honestly.",
      ],
      [
        "How do I know if my car uses R134a or the newer refrigerant?",
        "You don't need to — the model decides it, and the correct refrigerant and quantity are confirmed in the written quote before the visit. Topping up with the wrong gas is not offered at any price.",
      ],
    ],
  },
  {
    serviceSlug: "car-battery-service",
    areaSlug: "jp-nagar",
    areaAnswer:
      "Car battery service at your JP Nagar doorstep — free load and voltage test, charging-system and drain check, terminal cleaning, jump-start or replacement with the correct specification battery. The written quote is approved on WhatsApp before work starts, and the old battery is handed back with the invoice.",
    areaNotes: [
      "JP Nagar bookings cluster around the Jayadeva Hospital corner, the Metro Station approach and the Puttenahalli Lake side, with Bannerghatta Road apartments further south. Basement bays are common in the newer complexes — share level and bay number when booking; street and stilt parking are straightforward anywhere in the locality.",
      "The Bannerghatta Road corridor's long stop-start commutes and short evening runs are hard on batteries — repeated partial recharges without a full drive shorten life well before the three-year mark. The load test reads the actual state of health, and the alternator check confirms the charging side before a replacement is recommended.",
    ],
    prepare: [
      "Whether the car starts slow, needs a jump already, or is just due for a check",
      "Car model and diesel/petrol for the correct battery specification",
      "Basement level and bay number if applicable",
    ],
    faqs: [
      [
        "The car starts fine most days but failed once last week. Replace or test?",
        "Test first — the free load test reads the battery's actual state of health, and the charging-system check shows whether the alternator is keeping it topped up. Replacement is quoted only if the numbers say so.",
      ],
      [
        "Do you take the old battery away?",
        "The old battery is yours — it is disconnected safely and left with you along with the invoice, so you can hand it to a recycler of your choice. Ride N Care does not claim any exchange value.",
      ],
      [
        "Can you fit a battery in a JP Nagar basement without power?",
        "Yes — fitting needs hand tools and the car's own systems, not mains power. The only access requirement is that the mechanic and trolley can reach the bay.",
      ],
    ],
  },
  {
    serviceSlug: "car-brake-service",
    areaSlug: "marathahalli",
    areaAnswer:
      "Car brake service at your Marathahalli parking spot — pads measured on all four wheels, discs checked for scoring and runout, fluid inspected, and replacement quoted at MRP only with your approval. Old parts are returned; the finished work carries the 45-day service warranty.",
    areaNotes: [
      "Marathahalli Bridge and the Outer Ring Road junction compress the locality's traffic into a few choke points, with AECS Layout and the Kundalahalli Gate side feeding in — braking into that crawl twice a day works the front pads hard. The measurement-first visit catches uneven axle wear early, before it becomes a disc problem.",
      "Tech-park and apartment parking dominate here, so most jobs are basement or stilt bays needing just one level spot. Pad, disc and fluid work is fully doorstep-capable; parts are shown sealed before fitting, and the job is inspected with you before payment by UPI, card or cash.",
    ],
    prepare: [
      "Car model for correct pad and disc parts",
      "Where the car sits — tech-park bay, apartment basement or street",
      "Whether the noise happens cold, hot or only when braking",
    ],
    faqs: [
      [
        "My car grinds after the Marathahalli Bridge crawl. Is it urgent?",
        "A metal-on-metal grind means the pads are worn through to the backing — that needs inspection before the next drive rather than waiting for the weekend, because every stop is scoring the disc. The measurement visit will show exactly what remains.",
      ],
      [
        "Do you service brakes in office-parking basements around AECS Layout?",
        "Yes — one level bay is enough, with visitor formalities sorted when you book. The same measurement, written quote and approval process applies as at home.",
      ],
      [
        "The pedal vibrates when I brake from speed. What does that mean?",
        "Pulsation usually points to disc thickness variation or runout — the discs are measured, not guessed at. A disc within limits is kept; one past limit is quoted for replacement with the measurements written into the quote.",
      ],
    ],
  },
];

export const CAR_AREA_INDEX = new Map(
  CAR_AREA_WAVE_1.map((e) => [`${e.serviceSlug}/${e.areaSlug}`, e]),
);

/** Gate check: is this car×area pair part of a published wave? */
export function isCarAreaPublished(serviceSlug: string, areaSlug: string): boolean {
  return CAR_AREA_INDEX.has(`${serviceSlug}/${areaSlug}`);
}

export function getCarAreaEntry(serviceSlug: string, areaSlug: string): CarAreaEntry | undefined {
  return CAR_AREA_INDEX.get(`${serviceSlug}/${areaSlug}`);
}

/**
 * Published car×area pairs grouped per service (registry-driven, never hand-
 * written). Drives the "Local Car Service Areas" module on /car-* hub pages so
 * every published pair is linked from its parent hub. Area display order
 * follows the sitemap's priority-area ordering, then alphabetical.
 */
export function carAreaLinksForService(serviceSlug: string): { slug: string; name: string }[] {
  return CAR_AREA_WAVE_1.filter((e) => e.serviceSlug === serviceSlug)
    .map((e) => AREAS.find((a) => a.slug === e.areaSlug))
    .filter((a): a is NonNullable<typeof a> => Boolean(a))
    .sort((a, b) => {
      const pa = PRIORITY_AREA_SLUGS.indexOf(a.slug as (typeof PRIORITY_AREA_SLUGS)[number]);
      const pb = PRIORITY_AREA_SLUGS.indexOf(b.slug as (typeof PRIORITY_AREA_SLUGS)[number]);
      const wa = pa === -1 ? 99 : pa;
      const wb = pb === -1 ? 99 : pb;
      return wa !== wb ? wa - wb : a.name.localeCompare(b.name);
    })
    .map((a) => ({ slug: a.slug, name: a.name }));
}
