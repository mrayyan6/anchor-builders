/* Anchor Associates — site data (projects, clients, services, testimonials) */

export const SITE_DATA = (function () {

  // ===== Image pool — Unsplash construction/architecture stock =====
  // Each project gets a hero + 3-4 gallery images
  const IMG = {
    // architectural / building exteriors
    archA: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=80',
    archB: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1600&q=80',
    archC: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&q=80',
    archD: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1600&q=80',
    archE: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=1600&q=80',
    archF: 'https://images.unsplash.com/photo-1448630360428-65456885c650?w=1600&q=80',
    archG: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600&q=80',
    // construction sites
    constA: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1600&q=80',
    constB: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=1600&q=80',
    constC: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=1600&q=80',
    constD: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1600&q=80',
    constE: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1600&q=80',
    // interiors
    intA: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80',
    intB: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1600&q=80',
    intC: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80',
    intD: 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=1600&q=80',
    intE: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80',
    // industrial / warehouse / agri
    indA: 'https://images.unsplash.com/photo-1518833895646-04b41dd0f63a?w=1600&q=80',
    indB: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1600&q=80',
    indC: 'https://images.unsplash.com/photo-1592833167001-55c4f3884a91?w=1600&q=80',
    // greenhouses / glass
    greenA: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ce?w=1600&q=80',
    greenB: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1600&q=80',
    // residential
    resA: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1600&q=80',
    resB: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80',
    resC: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1600&q=80',
    // canopy / structure
    canA: 'https://images.unsplash.com/photo-1473773508845-188df298d2d1?w=1600&q=80',
    canB: 'https://images.unsplash.com/photo-1429497419816-9ca5cfb4571a?w=1600&q=80',
    // theatre / studio
    studA: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=1600&q=80',
    studB: 'https://images.unsplash.com/photo-1485217988980-11786ced9454?w=1600&q=80',
    // people / team
    teamA: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=80',
    teamB: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&q=80',
    teamC: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80',
    teamD: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&q=80',
  };

  // ===== Categories =====
  const CATEGORIES = [
    { id: 'civil', name: 'Civil & MEP' },
    { id: 'prefab', name: 'Pre-Fab & Steel' },
    { id: 'agri', name: 'Agricultural' },
    { id: 'reno', name: 'Renovation & Interiors' },
    { id: 'tensile', name: 'Tensile & Canopies' },
    { id: 'studios', name: 'Studios & Set Design' },
  ];

  // ===== Services =====
  const SERVICES = [
    {
      id: 'civil',
      number: '01',
      name: 'Civil & MEP Construction',
      tagline: 'Turnkey delivery, ground-up.',
      description: 'Civil works, mechanical, electrical, plumbing and final commissioning — delivered as a single contract.',
      hero: IMG.constA,
      categoryId: 'civil',
      scope: ['Civil structure', 'MEP integration', 'Procurement', 'Quality control', 'Safety management', 'Commissioning']
    },
    {
      id: 'prefab',
      number: '02',
      name: 'Pre-Fabricated & Steel',
      tagline: 'Built off-site, raised in days.',
      description: 'High-performance insulated sandwich panels, modular steel buildings, and rapid-deploy facilities.',
      hero: IMG.indA,
      categoryId: 'prefab',
      scope: ['Steel fabrication', 'Insulated panels', 'On-site assembly', 'Acoustic treatment', 'Finishing']
    },
    {
      id: 'tensile',
      number: '03',
      name: 'Tensile Fabric & Shades',
      tagline: 'Engineered membranes, architectural form.',
      description: 'Parking canopies, walkway covers and tensile architectural shades engineered for Pakistan\'s climate.',
      hero: IMG.canA,
      categoryId: 'tensile',
      scope: ['Steel framework', 'Tensile membrane', 'Drainage', 'Lighting integration']
    },
    {
      id: 'reno',
      number: '04',
      name: 'Renovation & Interiors',
      tagline: 'Old walls, new chapter.',
      description: 'Office fit-outs, washrooms, café interiors, and full institutional remodels — demolition to handover.',
      hero: IMG.intA,
      categoryId: 'reno',
      scope: ['Demolition', 'Partitions & joinery', 'Finishes & fit-out', 'MEP retrofit', 'Furniture']
    },
    {
      id: 'agri',
      number: '05',
      name: 'Agricultural Structures',
      tagline: 'Climate, controlled.',
      description: 'Glass houses, climate-controlled photoperiod chambers, hydroponic systems and tunnel cultivation.',
      hero: IMG.greenA,
      categoryId: 'agri',
      scope: ['Foundations', 'Steel skeleton', 'Glazing & cooling', 'HVAC', 'Hydroponics']
    },
    {
      id: 'studios',
      number: '06',
      name: 'Studios & Set Design',
      tagline: 'Soundproof, stage-ready.',
      description: 'Recording studios, board rooms and theatre sets — built to acoustic, visual and performance specs.',
      hero: IMG.studA,
      categoryId: 'studios',
      scope: ['Acoustic treatment', 'Stage construction', 'Lighting', 'Modular fabrication']
    },
  ];

  // ===== Clients =====
  const CLIENTS = [
    { id: 'parc',     name: 'PARC',                     fullName: 'Pakistan Agricultural Research Council', sector: 'Government',  since: 2015, projects: 8 },
    { id: 'narc',     name: 'NARC',                     fullName: 'National Agricultural Research Centre',   sector: 'Government',  since: 2016, projects: 6 },
    { id: 'aiou',     name: 'AIOU',                     fullName: 'Allama Iqbal Open University',            sector: 'Government',  since: 2018, projects: 4 },
    { id: 'nust',     name: 'NUST',                     fullName: 'National University of Sciences & Tech',  sector: 'Government',  since: 2017, projects: 3 },
    { id: 'cui',      name: 'COMSATS',                  fullName: 'COMSATS University Islamabad',            sector: 'Government',  since: 2019, projects: 5 },
    { id: 'numl',     name: 'NUML',                     fullName: 'National University of Modern Languages', sector: 'Government',  since: 2020, projects: 2 },
    { id: 'pmdc',     name: 'PMDC',                     fullName: 'Pakistan Mineral Development Corporation',sector: 'Government',  since: 2018, projects: 3 },
    { id: 'cda',      name: 'CDA',                      fullName: 'Capital Development Authority',           sector: 'Government',  since: 2021, projects: 2 },
    { id: 'statelife',name: 'State Life',               fullName: 'State Life Insurance Corporation',        sector: 'Government',  since: 2020, projects: 2 },
    { id: 'ptcl',     name: 'PTCL',                     fullName: 'Pakistan Telecommunication Company',      sector: 'Retainer',    since: 2014, projects: 11 },
    { id: 'ufone',    name: 'Ufone',                    fullName: 'Ufone',                                   sector: 'Retainer',    since: 2015, projects: 7 },
    { id: 'allied',   name: 'Allied Bank',              fullName: 'Allied Bank Limited',                     sector: 'Retainer',    since: 2017, projects: 4 },
    { id: 'kingdom',  name: 'Kingdom Valley',           fullName: 'Kingdom Valley Islamabad',                sector: 'Private',     since: 2022, projects: 5 },
    { id: 'parkview', name: 'Park View City',           fullName: 'Park View City',                          sector: 'Private',     since: 2021, projects: 3 },
    { id: 'chajees',  name: 'Chai Jee\'s Café',         fullName: 'Chai Jee\'s Café',                        sector: 'Private',     since: 2023, projects: 1 },
    { id: 'fourthwall',name:'Fourth Wall Studios',      fullName: 'Fourth Wall Studios',                     sector: 'Private',     since: 2022, projects: 3 },
  ];

  // ===== Projects =====
  const PROJECTS = [
    { id: 'azri', name: 'PARC AZRI Office & Laboratory', clientId: 'parc', categoryId: 'civil', location: 'Umerkot, Sindh', year: 2024, area: '38,000 sqft', scope: 'Turnkey · Civil · MEP · Finishing', hero: IMG.archA, gallery: [IMG.constA, IMG.archB, IMG.intA], tagline: 'A working monolith for arid-zone research.', body: 'Delivered as a complete turnkey solution — civil works, MEP systems, interior finishing and external development. Procurement, quality control, safety management and final commissioning sat under one contract. The result is a fully functional modern office and laboratory facility purpose-built for PARC\'s research activities in Arid-Zone Agriculture.' },
    { id: 'cold', name: 'NIGAB Cold Storage', clientId: 'narc', categoryId: 'civil', location: 'NARC, Islamabad', year: 2023, area: '8,500 sqft', scope: 'Turnkey · RCC · Insulation · Cold storage', hero: IMG.indA, gallery: [IMG.indB, IMG.indC, IMG.constB], tagline: 'A controlled environment, anchored in concrete.', body: 'A dedicated cold-storage facility built using a reinforced RCC frame combined with insulated sandwich panels. The controlled environment supports research materials and agricultural samples. Anchor managed structural development through the installation of insulation systems and final external finishing.' },
    { id: 'dme',  name: 'Mechanical Engineering Lab — DME, E&ME', clientId: 'nust', categoryId: 'civil', location: 'Rawalpindi', year: 2023, area: '12,000 sqft', scope: 'Civil · Finishing', hero: IMG.archB, gallery: [IMG.archC, IMG.intB, IMG.constC], tagline: 'A new lab for the Department of Mechanical Engineering.', body: 'Complete construction and finishing of a laboratory building for the College of Electrical & Mechanical Engineering. The structure complements existing campus architecture while introducing a clean, modern aesthetic.' },
    { id: 'alkaram', name: 'Alkaram University Administration Block', clientId: 'parc', categoryId: 'civil', location: 'Islamabad', year: 2024, area: '46,000 sqft', scope: 'Grey structure · Dome · Twin wings', hero: IMG.archC, gallery: [IMG.archD, IMG.archE, IMG.constD], tagline: 'A central dome, two symmetrical wings.', body: 'The complete grey-structure works of the Administration Block at Alkaram University Islamabad — from ground-breaking to final structural completion. The building features a strong, distinctive architectural form, anchored by a central dome and two symmetrical wings.' },
    { id: 'callctr', name: 'AIOU Prefab Call Center', clientId: 'aiou', categoryId: 'prefab', location: 'Islamabad', year: 2023, area: '6,200 sqft', scope: 'Prefab · Soundproofed cabins', hero: IMG.indC, gallery: [IMG.intC, IMG.indA, IMG.archG], tagline: 'A communications hub, raised in weeks.', body: 'A dedicated communication hub for Allama Iqbal Open University — high-performance insulated prefab panels, branded entrance, and acoustically enhanced cabins giving call agents a controlled, noise-free space.' },
    { id: 'sfc',  name: 'AIOU Student Facilitation Centre', clientId: 'aiou', categoryId: 'prefab', location: 'Islamabad', year: 2023, area: '4,800 sqft', scope: 'Prefab · Service interior', hero: IMG.intB, gallery: [IMG.intC, IMG.intD, IMG.indB], tagline: 'Approachable, student-centric, fast-deployed.', body: 'A long structured counter system, digital numbering displays, and ample space to accommodate large groups during peak hours. Clear circulation paths and well-planned seating arrangements ensure smooth movement and efficient service delivery.' },
    { id: 'photoperiod', name: 'PARC Photoperiod Chambers HVAC', clientId: 'parc', categoryId: 'agri', location: 'Makli, Thatta', year: 2023, area: '3,200 sqft', scope: 'HVAC · Insulation · Light control', hero: IMG.greenA, gallery: [IMG.greenB, IMG.indC, IMG.archG], tagline: 'Old polycarbonate, new precision.', body: 'Conversion of old transparent polycarbonate chambers into state-of-the-art insulated and air-tight photoperiod facilities at PARC NSTHRI. High-grade thermal and light insulation, full HVAC system, and a stable, energy-efficient environment for crop and horticulture experimentation.' },
    { id: 'maize', name: 'Maize Isolation Glass House', clientId: 'narc', categoryId: 'agri', location: 'CSI, NARC Islamabad', year: 2024, area: '2,400 sqft', scope: 'Foundations · Steel · Glazing', hero: IMG.greenB, gallery: [IMG.greenA, IMG.archA, IMG.indA], tagline: 'A transparent envelope for isolated maize trials.', body: 'Raised concrete foundations, a fabricated steel skeleton supporting the lightweight glazing system, and integration of cooling pads, airflow louvers and structural bracing — a fully climate-managed space for maize isolation research.' },
    { id: 'intelligent', name: 'Intelligent Glass House', clientId: 'narc', categoryId: 'agri', location: 'NARC Islamabad', year: 2024, area: '5,400 sqft', scope: 'Smart ventilation · Climate balancing', hero: IMG.archG, gallery: [IMG.greenA, IMG.greenB, IMG.intD], tagline: 'A new standard in agricultural innovation.', body: 'A refined steel and glass architecture combined with smart ventilation and climate-balancing systems. The facility supports advanced crop studies, experimental trials and long-term research programs.' },
    { id: 'tunnels', name: 'Multi-Tunnel Agricultural Zone', clientId: 'parc', categoryId: 'agri', location: 'Islamabad', year: 2023, area: '1.2 acres', scope: 'Tunnels · Hydroponics · Site works', hero: IMG.indB, gallery: [IMG.greenA, IMG.greenB, IMG.constE], tagline: 'Eight tunnels, full site works, modular hydroponics.', body: 'Eight well-structured growing tunnels supported by neatly executed civil works — tuff tile paving, secure boundary fence, raised tunnel foundations, organized access pathways. Modular vertical grow towers and integrated nutrient reservoirs designed for high-yield, water-efficient cultivation.' },
    { id: 'kingdom', name: 'Kingdom Valley Residential Villas', clientId: 'kingdom', categoryId: 'civil', location: 'Kingdom Valley Islamabad', year: 2024, area: '12 villas', scope: 'Civil · Masonry · External finishes', hero: IMG.resA, gallery: [IMG.resB, IMG.resC, IMG.archF], tagline: 'A community of villas, built to spec.', body: 'Complete construction of multiple residential villas — civil works, structural execution, masonry, plastering and external finishes. Strong focus on workmanship, material quality and timely delivery, with consistent standards across the development.' },
    { id: 'statelife', name: 'State Life Office Renovation', clientId: 'statelife', categoryId: 'reno', location: 'Building No 9, Islamabad', year: 2023, area: '14,000 sqft', scope: 'Demolition · Partitions · Fit-out', hero: IMG.intA, gallery: [IMG.intB, IMG.intC, IMG.intE], tagline: 'A complete corporate transformation.', body: 'Full demolition and rebuild of the State Life Health & Accident Insurance Office — polished glass partitions, premium marble-finish flooring, suspended ceilings and a clean, organized layout aligned with State Life\'s professional identity.' },
    { id: 'pmdc-wash', name: 'PMDC Premium Washroom', clientId: 'pmdc', categoryId: 'reno', location: 'PMDC H-9, Islamabad', year: 2024, area: '480 sqft', scope: 'Tiling · Sanitary · Lighting', hero: IMG.intC, gallery: [IMG.intD, IMG.intE, IMG.archA], tagline: 'A washroom that looks like a hotel.', body: 'Modern, premium-grade facility — sleek tiling, updated sanitary fixtures, concealed plumbing, and a contemporary floating vanity with LED-backlit mirror.' },
    { id: 'chajees', name: 'Chai Jee\'s Café', clientId: 'chajees', categoryId: 'reno', location: 'Islamabad', year: 2024, area: '2,800 sqft', scope: 'Concept · Interior · MEP · Joinery', hero: IMG.intC, gallery: [IMG.intD, IMG.intE, IMG.intB], tagline: 'A café crafted end-to-end.', body: 'A complete end-to-end transformation — rich wooden textures, ambient ceiling lighting, a streamlined service counter, and bold feature walls. Ergonomic kitchen layout, durable finishes and efficient MEP works support high-volume café operations.' },
    { id: 'vu-studio', name: 'Virtual University Recording Studio', clientId: 'parc', categoryId: 'studios', location: 'Islamabad', year: 2023, area: '900 sqft', scope: 'Acoustic · Lighting · Cyclorama', hero: IMG.studA, gallery: [IMG.studB, IMG.intD, IMG.archA], tagline: 'A controlled, echo-free environment.', body: 'A fully soundproof production studio designed for professional recording, broadcasting and digital content creation. Acoustic wall treatments, isolated construction, controlled lighting, and a seamless green-screen cyclorama.' },
    { id: 'pmdc-board', name: 'PMDC Soundproof Board Room', clientId: 'pmdc', categoryId: 'studios', location: 'PMDC HQ, Islamabad', year: 2024, area: '600 sqft', scope: 'Acoustic · Ceiling · Flooring', hero: IMG.intB, gallery: [IMG.intC, IMG.studB, IMG.archG], tagline: 'A sound-controlled executive room.', body: 'Acoustic panel installation, flooring, ceiling work and high-end conference furniture — every detail engineered to support focused discussions in a disturbance-free environment.' },
    { id: 'irith', name: 'Set Design — It Runs in the Family', clientId: 'fourthwall', categoryId: 'studios', location: 'Islamabad Club', year: 2023, area: 'Stage', scope: 'Modular set · Backdrops · Props', hero: IMG.studB, gallery: [IMG.studA, IMG.intE, IMG.archB], tagline: 'A custom-built, fully moveable site set.', body: 'Custom-built, fully moveable site-assembled stage set combining artistic design with engineering precision. Three successful shows at Islamabad Club.' },
    { id: 'tpgw', name: 'Set Design — The Play That Goes Wrong', clientId: 'fourthwall', categoryId: 'studios', location: 'Islamabad Club', year: 2024, area: 'Stage', scope: 'Modular set · Special effects · Multi-level', hero: IMG.studA, gallery: [IMG.studB, IMG.archA, IMG.intB], tagline: 'Controlled chaos on cue.', body: 'Breakaway walls, collapsing props, a safe collapsing-stair feature and a functional small first floor. Precision off-site fabrication, on-site assembly, and thematic detailing.' },
    { id: 'lk', name: 'Set Design — The Ladykillers', clientId: 'fourthwall', categoryId: 'studios', location: 'Islamabad Club', year: 2024, area: 'Stage', scope: 'Two-storey set · Custom furniture · Staircase', hero: IMG.studB, gallery: [IMG.studA, IMG.intD, IMG.archD], tagline: 'A two-storey environment for fast-paced storytelling.', body: 'Functional upper floor, detailed interior decor, custom-built furniture and a carefully engineered staircase — a high-impact set delivered safe, durable, and visually rich.' },
    { id: 'miap', name: 'MIAP Multan Entry Canopy', clientId: 'parc', categoryId: 'tensile', location: 'Multan', year: 2023, area: '1,200 sqft', scope: 'Steel · Roofing · Site planning', hero: IMG.canA, gallery: [IMG.canB, IMG.archA, IMG.indC], tagline: 'A clean, modern entrance experience.', body: 'A robust steel structure, precision roofing installation and enhanced site planning — reliable coverage for incoming traffic and a significant aesthetic upgrade.' },
    { id: 'cui-shades', name: 'CUI Wah Tensile & Fiber Sheds', clientId: 'cui', categoryId: 'tensile', location: 'CUI Wah Campus', year: 2023, area: 'Multiple', scope: 'Tensile · Walkways · Café shed', hero: IMG.canB, gallery: [IMG.canA, IMG.archG, IMG.intD], tagline: 'A series of beautifully shaded spaces.', body: 'Custom fiber sheds, tensile structures and window shades across multiple locations — walkway coverings, staircase shelters, large-span tensile canopies and a complete café shed.' },
    { id: 'numl-tensile', name: 'NUML Tensile Parking & Canopies', clientId: 'numl', categoryId: 'tensile', location: 'NUML Islamabad', year: 2024, area: '14,000 sqft', scope: 'Steel · Tensile membrane', hero: IMG.canA, gallery: [IMG.canB, IMG.archE, IMG.archF], tagline: 'Engineered steel structures with high-performance membranes.', body: 'Tensile parking sheds and architectural canopies throughout NUML University — beautifully constructed shaded spaces that elevate comfort, usability and the overall campus environment.' },
    { id: 'bf-shade', name: 'B.F Building Tensile Shade', clientId: 'statelife', categoryId: 'tensile', location: 'Islamabad', year: 2023, area: '6,000 sqft', scope: 'Steel · Tensile membrane', hero: IMG.canB, gallery: [IMG.canA, IMG.archD, IMG.archE], tagline: 'Premium tensile shade for the front car park.', body: 'A premium tensile fabric shade system for the main front car-parking area of the B.F Building — durable steel framework, high-performance tensile fabric, long-lasting protection against heat, UV exposure and rainfall.' },
    { id: 'f6-road', name: 'F-6 Road & Drainage Development', clientId: 'cda', categoryId: 'civil', location: 'F-6, Islamabad', year: 2024, area: '0.8 km', scope: 'Subgrade · Asphalt · Drainage', hero: IMG.constB, gallery: [IMG.constA, IMG.constE, IMG.archC], tagline: 'From sandy lot to functional infrastructure.', body: 'Comprehensive road and parking development — subgrade preparation, compaction, road layering, asphalt surfacing, integrated drainage works, underground drainage lines and surface channels.' },
    { id: 'comsats-park', name: 'COMSATS Wah Parking Development', clientId: 'cui', categoryId: 'civil', location: 'COMSATS Wah Campus', year: 2024, area: '32,000 sqft', scope: 'Drainage · Pavers · Access roads', hero: IMG.constE, gallery: [IMG.constB, IMG.canA, IMG.archG], tagline: 'A fully developed parking facility.', body: 'Complete transformation of an unpaved, sand-based area — proper ground preparation, an underground drainage network, durable paved access roads and parking lanes using high-quality interlocking pavers.' },
    { id: 'narc-fence', name: 'NARC Fence & Prefab Store', clientId: 'narc', categoryId: 'prefab', location: 'NARC Islamabad', year: 2023, area: '0.6 acre boundary', scope: 'Steel · Fencing · Prefab store', hero: IMG.indA, gallery: [IMG.indB, IMG.indC, IMG.constC], tagline: 'Boundary security plus weather-resistant storage.', body: 'Precision steel fabrication, RC foundation preparation, chain-link fencing installation, gate fixing and assembly of a fully insulated prefab storage unit designed for long-term use.' },
  ];

  // ===== Testimonials =====
  const TESTIMONIALS = [
    { quote: 'Anchor delivered our research facility ahead of schedule and to spec. Their attention to safety standards is what set them apart.', who: 'Project Director, PARC', clientId: 'parc' },
    { quote: 'A turnkey contractor in the truest sense. They handled the dome, the wings, the finish — we just watched it rise.', who: 'Vice Chancellor, Alkaram University', clientId: 'parc' },
    { quote: 'They built our café around our brand, not the other way around. The kitchen flow is exactly what we needed for high-volume service.', who: 'Founder, Chai Jee\'s Café', clientId: 'chajees' },
    { quote: 'Three plays, three different sets — every single one assembled flawlessly. A genuine theatre-construction partner.', who: 'Director, Fourth Wall Studios', clientId: 'fourthwall' },
    { quote: 'The intelligent glass house lets us control more variables than ever. NARC\'s research capacity has stepped up.', who: 'Head of Crop Research, NARC', clientId: 'narc' },
  ];

  // ===== Helpers =====
  const byId = (arr, id) => arr.find(x => x.id === id);
  const projectsByCategory = (catId) => PROJECTS.filter(p => p.categoryId === catId);
  const projectsByClient = (clientId) => PROJECTS.filter(p => p.clientId === clientId);

  return {
    IMG, CATEGORIES, SERVICES, CLIENTS, PROJECTS, TESTIMONIALS,
    byId, projectsByCategory, projectsByClient,
  };
})();
