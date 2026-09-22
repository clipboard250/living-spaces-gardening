// Living Spaces Gardening — portfolio data
// Single source of truth. Edit here, re-run `node build-portfolio.js`.
//
// before:  { src, alt, pos }              — optional before photo, drives the slider
// facts:   { size, lot, environment, status }
// plans:   [{ src, alt, label }]          — site plan, planting plan, design book, care guide
// species: [{ common, latin, role }]      — the species guide

const SERVICES = [
  'Native Landscape Design',
  'Hardscape Design',
  'Permaculture Design',
  'Specimen Trees',
  'Irrigation & Lighting'
];

const LOCATIONS = ['St. Petersburg', 'Largo', 'Tarpon Springs', 'Tampa Bay'];

const PROJECTS = [
  {
    slug: 'q-lamb-native-front-tampa-bay',
    title: 'The side yard that kept holding water',
    location: 'Tampa Bay',
    locationFull: 'Tampa Bay, FL',
    service: 'Native Landscape Design',
    year: '2026',
    before: null,
    facts: { size: '', lot: '', environment: 'Established neighborhood', status: 'Completed' },
    plans: [],
    species: [
      { common: 'Wild coffee', latin: 'Psychotria nervosa', role: 'Shade-loving native shrub that fills the beds and feeds pollinators', photo: 'assets/gallery/species-wild-coffee-psychotria-nervosa.webp', credit: 'Photo: Sam Sailor, CC BY-SA 4.0' }
    ],
    scope: 'Native plants, pavers, rocks, mulch, an irrigation system and a French drain',
    summary: 'Water pooled along the side of the house. We drained it and planted it native.',
    problem:
      'Water was pooling along the side of the house with nowhere to go. Standing water against a foundation is the kind of thing that quietly causes bigger problems the longer it sits.',
    approach:
      'We installed a French drain to carry the water away from the house, then ran new irrigation and drip lines so the plants get efficient watering without wasting a drop. A paver walkway runs to both the front entrance and the backyard, framed by decorative rock. The planting beds got mulch and a mix of Florida native species set around the home.',
    result:
      'The side of the house no longer pools. The drainage is handled, and the natives are matched to the environment around their home, so the whole yard works with the site instead of fighting it.',
    plants: ['Wild coffee'],
    images: [
      {
        src: 'assets/gallery/native-landscape-008-q-lamb-front-tampa-bay.webp',
        alt: 'Native front yard with flagstone pathway, river rock, and Florida native plantings installed by Living Spaces Gardening in Tampa Bay FL',
        caption: 'Native beds, a flagstone path, and river rock across the whole front of the house.',
        pos: 'center center'
      },
      {
        src: 'assets/gallery/native-landscape-009-q-lamb-side-path-tampa-bay.webp',
        alt: 'Side-yard flagstone stepping stones set in river rock with native plants along a vinyl fence by Living Spaces Gardening in Tampa Bay FL',
        caption: 'The side yard that used to hold water. Now it drains, and you can walk it.',
        pos: 'center center'
      },
      {
        src: 'assets/gallery/native-landscape-010-q-lamb-walkway-tampa-bay.webp',
        alt: 'Flagstone and river rock walkway leading from the driveway through native plantings by Living Spaces Gardening in Tampa Bay FL',
        caption: 'Flagstone set in river rock, running from the drive through the new beds.',
        pos: 'center center'
      }
    ]
  }
];

module.exports = { PROJECTS, SERVICES, LOCATIONS };
