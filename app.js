// Basisconfiguratie voor de BiNaS viewer.
const PDF_URL = 'https://drive.google.com/uc?export=download&id=1PvuI4LDnkbfIyujRxe74Urau2quj1hk-';
// Basisconfiguratie voor de BiNaS viewer zonder externe download.
const DEFAULT_SPREAD = true;
const MIN_SCALE = 0.5;
const MAX_SCALE = 3.5;
const SCALE_STEP = 0.15;

// Voorbeeldindex, makkelijk uitbreidbaar zodra de echte pagina's bekend zijn.
// Geïmporteerde inhoud van BiNaS (overzicht + fundering), paginanummers volgen later.
const CATEGORY_CLASSES = {
  'Algemeen': 'category--algemeen',
  'Algemeen – Achterin': 'category--algemeen-achterin',
  'Natuurkunde': 'category--natuurkunde',
  'Natuurkunde vervolg': 'category--natuurkunde',
  'Wiskunde': 'category--wiskunde',
  'Scheikunde': 'category--scheikunde',
  'Biologie': 'category--biologie',
};
const BINAS_INDEX = [
  { category: 'Algemeen', code: '1', title: 'Grieks alfabet', pageStart: 7, pageEnd: 7 },
  { category: 'Algemeen', code: '3', title: 'Grootheden en eenheden in het SI', pageStart: 9, pageEnd: 11 },
  { category: 'Algemeen', code: '7', title: 'Omrekenfactoren van eenheden', pageStart: 15, pageEnd: 16 },
  { category: 'Natuurkunde', code: '10', title: 'Waarden van enkele constanten', pageStart: 25, pageEnd: 26 },
  { category: 'Natuurkunde', code: '14A', title: 'Kook- en smeltpunten', pageStart: 33, pageEnd: 34 },
  { category: 'Natuurkunde', code: '15', title: 'Dichtheden van vaste stoffen', pageStart: 35, pageEnd: 35 },
  { category: 'Wiskunde', code: '24', title: 'Standaardafwijking', pageStart: 47, pageEnd: 47 },
  { category: 'Scheikunde', code: '40', title: 'Naamgeving binair', pageStart: 65, pageEnd: 66 },
  { category: 'Biologie', code: '78', title: 'Samenstelling bloedplasma en serum', pageStart: 96, pageEnd: 97 },
  { category: 'Biologie', code: '87', title: 'Hormoonsystemen', pageStart: 110, pageEnd: 112 },
  { category: 'Biologie', code: '93', title: 'Afweer en immuniteit', pageStart: 122, pageEnd: 125 },
  { category: 'Algemeen', title: 'Grieks alfabet', pageStart: null, pageEnd: null },
  { category: 'Algemeen', title: 'Vermenigvuldigingsfactoren', pageStart: null, pageEnd: null },
  { category: 'Algemeen', title: 'Basisgrootheden en grondeenheden in het SI', pageStart: null, pageEnd: null },
  { category: 'Algemeen', title: 'Grootheden en eenheden in het SI', pageStart: null, pageEnd: null },
  { category: 'Algemeen', title: 'Omrekencoefficiënten van eenheden', pageStart: null, pageEnd: null },
  { category: 'Algemeen', title: 'Machten van tien – Massa', pageStart: null, pageEnd: null },
  { category: 'Algemeen', title: 'Machten van tien – Tijd', pageStart: null, pageEnd: null },
  { category: 'Algemeen', title: 'Machten van tien – Temperatuur', pageStart: null, pageEnd: null },
  { category: 'Algemeen', title: 'Machten van tien – Energie', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde', title: 'Waarden van enige constanten – Natuurconstanten', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde', title: 'Waarden van enige constanten – Massa en energie', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde', title: 'Waarden van enige constanten – Planck-eenheden', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde', title: 'Gegevens van metalen', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde', title: 'Gegevens van vlamgassen', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde', title: 'Gegevens van vaste stoffen – Fysische eigenschappen', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde', title: 'Gegevens van vaste stoffen – Materiaaleigenschappen', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde', title: 'Gegevens van vloeistoffen', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde', title: 'Gegevens van gassen en dampen', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde', title: 'Verzadigingsdrukken – Water', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde', title: 'Verzadigingsdrukken – Koolstofdioxide, propaan, butaan, etheen, alcohol en water', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde', title: 'Kook- en smeltpunten', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde', title: 'Geluid – Voortplantingssnelheden', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde', title: 'Geluid – Absorptiecoëfficiënten', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde', title: 'Geluid – Muziek', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde', title: 'Geluid – Akoestische schaal voor de mens', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde', title: 'Elektriciteit en magnetisme – Relatieve diëlektrische constanten', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde', title: 'Elektriciteit en magnetisme – Soorten magneten', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde', title: 'Elektriciteit en magnetisme – Halogeenlampen en spaarlampen', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde', title: 'Elektriciteit en magnetisme – Thermo-elektriciteit', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde', title: 'Elektriciteit en magnetisme – Elektromagneten', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde', title: 'Elektriciteit en magnetisme – Kleuren', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde', title: 'Elektriciteit en magnetisme – Elektrotechnische symbolen', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde', title: 'Elektriciteit en magnetisme – Digitale schakelingen', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde', title: 'Brekingsindices', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde', title: 'Elektromagnetisch spectrum – Zichtbaar licht / kleuren', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde', title: 'Elektromagnetisch spectrum – Algemeen overzicht', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde', title: 'Spectraallijnen', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde', title: 'Atoomfysica – Als bolmodel', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde', title: 'Atoomfysica – Ionisatie-energieën', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde', title: 'Atoomfysica – Plasma', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde', title: 'Atoomfysica – Spectra', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde', title: 'Planck-krommen', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde vervolg', title: 'Quantummechanica', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde vervolg', title: 'Foto-elektrisch effect', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde vervolg', title: 'Isotopen – Isotopenblad', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde vervolg', title: 'Isotopen – Isotopenkaart', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde vervolg', title: 'Bouw en structuur van de materie – Elementaire deeltjes', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde vervolg', title: 'Bouw en structuur van de materie – Wisselwerkingsdeeltjes', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde vervolg', title: 'Bouw en structuur van de materie – Hadronen, samengesteld uit quarks', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde vervolg', title: 'Biofysica – Zicht', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde vervolg', title: 'Biofysica – Huid en ultraviolet, verblijf bij de zon', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde vervolg', title: 'Biofysica – Geluid', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde vervolg', title: 'Biofysica – Radioactiviteit', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde vervolg', title: 'Fysica en milieu – Luchtverontreinigingscoëfficiënten', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde vervolg', title: 'Fysica en milieu – Stofconcentraties', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde vervolg', title: 'Fysica en milieu – Lichtabsorptie in water', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde vervolg', title: 'Fysica en milieu – Radioactiviteit – U-waarden van bouwmaterialen', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde vervolg', title: 'Fysica en milieu – Zuiver geïoniseerde lucht', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde vervolg', title: 'Fysica en milieu – Luchtverontreinigingscoëfficiënten van bouwen- en verbrandingsprocessen', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde vervolg', title: 'Medische beeldvorming – Röntgen', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde vervolg', title: 'Medische beeldvorming – Echografie', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde vervolg', title: 'Medische beeldvorming – MRI', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde vervolg', title: 'Medische beeldvorming – PET', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde vervolg', title: 'Kosmische straling – Samenvatting', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde vervolg', title: 'Sterren – Sterren en sterrenstelsels', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde vervolg', title: 'Sterren – Hertzsprung-Russell-diagram', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde vervolg', title: 'Sterren – Kosmologie', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde vervolg', title: 'Evolutie van sterren – Stervorming', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde vervolg', title: 'Evolutie van sterren – Sterren', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde vervolg', title: 'Evolutie van sterren – Beëindiging (Melkweg, lokale groep, clusters)', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde vervolg', title: 'Evolutie van sterren – Kosmische achtergrondstraling', pageStart: null, pageEnd: null },
  { category: 'Natuurkunde vervolg', title: 'Evolutie van sterren – Oerknal en evolutie van het heelal', pageStart: null, pageEnd: null },
  { category: 'Wiskunde', title: 'Wiskundeformules – Verhoudingen', pageStart: null, pageEnd: null },
  { category: 'Wiskunde', title: 'Wiskundeformules – Lengtes, oppervlakken en volumes', pageStart: null, pageEnd: null },
  { category: 'Wiskunde', title: 'Wiskundeformules – Vertaaloefeningen', pageStart: null, pageEnd: null },
  { category: 'Wiskunde', title: 'Wiskundeformules – Machten en logaritmen', pageStart: null, pageEnd: null },
  { category: 'Wiskunde', title: 'Wiskundeformules – Cirkel, ellips, hyperbool, parabool', pageStart: null, pageEnd: null },
  { category: 'Wiskunde', title: 'Wiskundeformules – Differentiëren en integreren', pageStart: null, pageEnd: null },
  { category: 'Wiskunde', title: 'Wiskundeformules – Goniometrie', pageStart: null, pageEnd: null },
  { category: 'Wiskunde', title: 'Wiskundeformules – Rijen en reeksen', pageStart: null, pageEnd: null },
  { category: 'Wiskunde', title: 'Wiskundeformules – Wiskundige notaties', pageStart: null, pageEnd: null },
  { category: 'Scheikunde', title: 'Scheikundeformules – Reactiesnelheid', pageStart: null, pageEnd: null },
  { category: 'Scheikunde', title: 'Scheikundeformules – Chemisch evenwicht', pageStart: null, pageEnd: null },
  { category: 'Scheikunde', title: 'Scheikundeformules – Thermodynamica', pageStart: null, pageEnd: null },
  { category: 'Scheikunde', title: 'Scheikundeformules – Elektrochemie', pageStart: null, pageEnd: null },
  { category: 'Scheikunde', title: 'Scheikundeformules – Spectrometrie', pageStart: null, pageEnd: null },
  { category: 'Scheikunde', title: 'Scheikundeformules – Chromatografie', pageStart: null, pageEnd: null },
  { category: 'Scheikunde', title: 'Scheikundeformules – Een aantal basiswaarden', pageStart: null, pageEnd: null },
  { category: 'Scheikunde', title: 'Scheikundeformules – Hoeveelheid stof', pageStart: null, pageEnd: null },
  { category: 'Scheikunde', title: 'Scheikundeformules – Zuurmaat', pageStart: null, pageEnd: null },
  { category: 'Scheikunde', title: 'Scheikunde symbolen – Symbolen en eenheden', pageStart: null, pageEnd: null },
  { category: 'Scheikunde', title: 'Scheikunde symbolen – Structuurformules', pageStart: null, pageEnd: null },
  { category: 'Scheikunde', title: 'Spectrometrie – UV/Vis-spectrometrie', pageStart: null, pageEnd: null },
  { category: 'Scheikunde', title: 'Spectrometrie – NMR-spectrometrie', pageStart: null, pageEnd: null },
  { category: 'Scheikunde', title: 'Spectrometrie – IR-spectrometrie', pageStart: null, pageEnd: null },
  { category: 'Scheikunde', title: 'Spectrometrie – Massaspectrometrie', pageStart: null, pageEnd: null },
  { category: 'Scheikunde', title: 'Elementen – Gegevens', pageStart: null, pageEnd: null },
  { category: 'Scheikunde', title: 'Elementen – Oplosbaarheid, kernmassa-naam en natuurlijk voorkomen', pageStart: null, pageEnd: null },
  { category: 'Scheikunde', title: 'Molair en molecuulgebonden', pageStart: null, pageEnd: null },
  { category: 'Scheikunde', title: 'Smelt- en kookpunten', pageStart: null, pageEnd: null },
  { category: 'Scheikunde', title: 'Oplosbaarheid van bindingen', pageStart: null, pageEnd: null },
  { category: 'Scheikunde', title: 'Dichterheden en molaire massa’s', pageStart: null, pageEnd: null },
  { category: 'Scheikunde', title: 'Dampdrukken', pageStart: null, pageEnd: null },
  { category: 'Scheikunde', title: 'Evenwichtsreacties in water', pageStart: null, pageEnd: null },
  { category: 'Scheikunde', title: 'Evenwicht van zuren en basen, complexen', pageStart: null, pageEnd: null },
  { category: 'Scheikunde', title: 'Sterk en zwak zuur', pageStart: null, pageEnd: null },
  { category: 'Scheikunde', title: 'Zuur-base diagrammen', pageStart: null, pageEnd: null },
  { category: 'Scheikunde', title: 'Ionisatieconstanten van zuivere vloeistoffen – Water bij verschillende temperaturen', pageStart: null, pageEnd: null },
  { category: 'Scheikunde', title: 'Bindingseigenschappen – Bindingslengte', pageStart: null, pageEnd: null },
  { category: 'Scheikunde', title: 'Evenwichtsconstanten', pageStart: null, pageEnd: null },
  { category: 'Scheikunde', title: 'Indicatoren – Zuur-/base-indicatoren', pageStart: null, pageEnd: null },
  { category: 'Scheikunde', title: 'Reactiemechanismen – Nucleofiele substitutie volgens SN2', pageStart: null, pageEnd: null },
  { category: 'Scheikunde', title: 'Reactiemechanismen – Nucleofiele substitutie volgens SN1', pageStart: null, pageEnd: null },
  { category: 'Scheikunde', title: 'Reactiemechanismen – Eliminatiereacties, substitutie SN1/SN2', pageStart: null, pageEnd: null },
  { category: 'Scheikunde', title: 'Reactiemechanismen – Eliminatiereacties', pageStart: null, pageEnd: null },
  { category: 'Scheikunde', title: 'Reactiemechanismen – Eliminatiereacties volgens E1', pageStart: null, pageEnd: null },
  { category: 'Scheikunde', title: 'Reactiemechanismen – Eliminatiereacties volgens E2', pageStart: null, pageEnd: null },
  { category: 'Scheikunde', title: 'Verbindingen en bindingen', pageStart: null, pageEnd: null },
  { category: 'Scheikunde', title: 'Vormingstemperaturen', pageStart: null, pageEnd: null },
  { category: 'Scheikunde', title: 'Verbrandingswarmten', pageStart: null, pageEnd: null },
  { category: 'Scheikunde', title: 'Bindingslengten', pageStart: null, pageEnd: null },
  { category: 'Scheikunde', title: 'Ionisatie-energieën en elektronenaffiniteiten', pageStart: null, pageEnd: null },
  { category: 'Scheikunde', title: 'Enthalpie', pageStart: null, pageEnd: null },
  { category: 'Scheikunde', title: 'Entropie', pageStart: null, pageEnd: null },
  { category: 'Scheikunde', title: 'Hydrolyse van zuur-base oplossingen', pageStart: null, pageEnd: null },
  { category: 'Scheikunde', title: 'Gaswetten', pageStart: null, pageEnd: null },
  { category: 'Scheikunde', title: 'Oplosbaarheid', pageStart: null, pageEnd: null },
  { category: 'Scheikunde', title: 'Eigenschappen van chemicaliën – Vlamtemperaturen', pageStart: null, pageEnd: null },
  { category: 'Scheikunde', title: 'Eigenschappen van chemicaliën – Kleuren van chemicaliën', pageStart: null, pageEnd: null },
  { category: 'Scheikunde', title: 'Naamgeving chemische stoffen – Triviale namen', pageStart: null, pageEnd: null },
  { category: 'Scheikunde', title: 'Naamgeving chemische stoffen – Enkelvoudige stoffen', pageStart: null, pageEnd: null },
  { category: 'Scheikunde', title: 'Naamgeving chemische stoffen – Enkele formules in IUPAC', pageStart: null, pageEnd: null },
  { category: 'Scheikunde', title: 'Naamgeving chemische stoffen – Enkele regels voor systematische naamgeving', pageStart: null, pageEnd: null },
  { category: 'Scheikunde', title: 'Naamgeving chemische stoffen – Macromoleculaire materialen (ISO-code)', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Structuurformules en structuren – Suikeralcoholen, koolhydraten', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Structuurformules en structuren – Vetzuur, vetten, fosfolipiden', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Structuurformules en structuren – Aminozuren en eiwitten', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Structuurformules en structuren – Hormonen', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Structuurformules en structuren – Hormonale stoffen van de mens', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Structuurformules en structuren – Transmitters', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Structuurformules en structuren – Enzymen', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Dissimilatie – Overzicht dissimilatie van glucose', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Dissimilatie – Glycolyse en gist', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Dissimilatie – Citroenzuurcyclus', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Dissimilatie – Oxidatieve fosforylering', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Dissimilatie – Dissimilatie van eiwitten, koolhydraten en vetten', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Fotosynthese – Overzicht fotosynthese', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Fotosynthese – Lichtreactie', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Fotosynthese – Donkerreactie', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Fotosynthese – Fotosynthese-coëfficiënten', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Chromosomen van de mens – Structuur van een chromosoom', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Chromosomen van de mens – Karyogram', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Chromosomen van de mens – Bandpatroon', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Chromosomen van de mens – Geslachtschromosomen', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'DNA/RNA – Nucleïnezuren, structuurformules', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'DNA/RNA – Baseopbouw', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'DNA/RNA – Bouw van DNA en RNA', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'DNA/RNA – Schema replicatie', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'DNA/RNA – Transcriptie en translatie', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'DNA/RNA – Schema regeling transcriptie', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'DNA/RNA – Codons', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'DNA/RNA – DNA-reparatie', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'DNA/RNA – DNA-synthese', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'DNA/RNA – Schema transcriptie/expressie', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'DNA/RNA – RNA', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'DNA/RNA – Apoptose', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'DNA/RNA – DNA-techniek', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Absorptiespectra van bladpigmenten', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Plantenanatomie', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Fysiologie van de plant', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Osmotische waarden', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Celdeling – Celdeling', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Celdeling – Mitosestadia', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Celdeling – Meiose', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Celdeling – Oorsprong', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Virussen – Virusstructuur', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Virussen – Infectie', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Virussen – Vermenigvuldiging', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Virussen – Retrovirussen', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Het bloed – Samenstelling van het bloed', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Het bloed – Bloedgroepen', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Het bloed – Afweer', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Cellen – Bacteriecel', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Cellen – Dierlijke cel', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Cellen – Plantaardige cel', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Spijsvertering – Overzicht spijsvertering', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Spijsvertering – Verteringsorganen', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Plantafgeleide weefsels', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Transport – Overzicht transport in mens en plant', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Transport – Transport in de plant', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Transport – Transport in het menselijk lichaam', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Afweer – Afweer in de mens', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Bloed en bloedsomloop – Hart', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Bloed en bloedsomloop – Bloedvaten', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Bloed en bloedsomloop – Bloeddruk', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Bloed en bloedsomloop – Werking', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Voortplanting', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Ontwikkeling', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Zenuwstelsel – Overzicht', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Zenuwstelsel – Hersenen', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Zenuwstelsel – Ruggenmerg', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Zenuwstelsel – Zenuwbanen', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Hormonenstelsel – Hormonen van de mens', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Hormonenstelsel – Werkingsmechanismen', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Hormonenstelsel – Hormonen bij voortplanting', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Beweging en conditie', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Skeletten', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Plantkunde', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Systematiek', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Ecologie', pageStart: null, pageEnd: null },
  { category: 'Biologie', title: 'Evolutie', pageStart: null, pageEnd: null },
  { category: 'Algemeen – Achterin', title: 'Veiligheid en milieu', pageStart: null, pageEnd: null },
  { category: 'Algemeen – Achterin', title: 'Nanotechnologie', pageStart: null, pageEnd: null },
  { category: 'Algemeen – Achterin', title: 'Molaire massa’s van veel gebruikte stoffen', pageStart: null, pageEnd: null },
  { category: 'Algemeen – Achterin', title: 'Periodiek systeem der elementen', pageStart: null, pageEnd: null },
];

// DOM referenties
const searchInput = document.getElementById('search-input');
const topicList = document.getElementById('topic-list');
const statusEl = document.getElementById('status');
const errorBanner = document.getElementById('error-banner');
const canvasWrapper = document.getElementById('canvas-wrapper');
const viewerContainer = document.getElementById('viewer-container');
const toggleViewBtn = document.getElementById('toggle-view');
const zoomInBtn = document.getElementById('zoom-in');
const zoomOutBtn = document.getElementById('zoom-out');
const fitWidthBtn = document.getElementById('fit-width');
const fitPageBtn = document.getElementById('fit-page');
const prevBtn = document.getElementById('prev-page');
const nextBtn = document.getElementById('next-page');
const firstBtn = document.getElementById('first-page');
const lastBtn = document.getElementById('last-page');
const pageInput = document.getElementById('page-input');
const goToPageBtn = document.getElementById('go-to-page');
const pageInfo = document.getElementById('page-info');
const pdfUploadInput = document.getElementById('pdf-upload');

// PDF variabelen
let pdfDoc = null;
let currentPage = 1;
let totalPages = 0;
let spreadMode = DEFAULT_SPREAD;
let currentScale = 1;
let lastFitMode = 'fit-width'; // 'fit-width' | 'fit-page' | null

// Basale panning ondersteuning
let isDragging = false;
let dragStart = { x: 0, y: 0 };
let scrollStart = { left: 0, top: 0 };

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.worker.min.js';
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.worker.min.mjs';

// Utility: toon status of fouten
function setStatus(message) {
  statusEl.textContent = message;
}

function showError(message) {
  errorBanner.textContent = message;
  errorBanner.hidden = false;
}

function clearError() {
  errorBanner.hidden = true;
  errorBanner.textContent = '';
}

// Index rendering + filtering
function groupByCategory(items) {
  return items.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});
}

function renderIndex(filterValue = '') {
  const query = filterValue.trim().toLowerCase();
  const filtered = BINAS_INDEX.filter((item) => {
    if (!query) return true;
    return (
      item.title.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.code.toLowerCase().includes(query)
      item.category.toLowerCase().includes(query)
    );
  });

  topicList.innerHTML = '';
  const grouped = groupByCategory(filtered);
  Object.entries(grouped).forEach(([category, items]) => {
    const groupEl = document.createElement('div');
    groupEl.className = 'category-group';

    const categoryClass = CATEGORY_CLASSES[category];
    if (categoryClass) {
      groupEl.classList.add(categoryClass);
    }

    const header = document.createElement('h3');
    header.className = 'category-header';
    if (categoryClass) {
      header.classList.add(`${categoryClass}__title`);
    }
    header.textContent = category;
    groupEl.appendChild(header);

    items.forEach((item) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'topic-item';
      button.setAttribute('data-page', item.pageStart);
      button.setAttribute('data-page', item.pageStart ?? '');
      const pagesLabel = item.pageStart ? `Pagina's ${item.pageStart}${item.pageEnd ? `–${item.pageEnd}` : ''}` : 'Pagina volgt';
      button.innerHTML = `
        <div class="topic-meta">
          <p class="topic-title">${item.title}</p>
          <span class="topic-code">Tabel ${item.code}</span>
        </div>
        <p class="topic-pages">Pagina's ${item.pageStart}–${item.pageEnd}</p>
        <p class="topic-pages">${pagesLabel}</p>
      `;
      button.addEventListener('click', () => {
        goToPage(item.pageStart);
      });

      if (item.pageStart) {
        button.addEventListener('click', () => goToPage(item.pageStart));
      } else {
        button.classList.add('topic-item--inactive');
        button.title = 'Pagina koppeling volgt';
      }

      groupEl.appendChild(button);
    });

    topicList.appendChild(groupEl);
  });

  if (!filtered.length) {
    const empty = document.createElement('p');
    empty.textContent = 'Geen resultaten gevonden.';
    empty.style.color = '#5f6368';
    empty.style.padding = '4px 8px';
    topicList.appendChild(empty);
  }
}

// PDF helpers
function clampPage(page) {
  if (!pdfDoc) return 1;
  return Math.min(Math.max(page, 1), totalPages);
}

function getSpreadPages(page) {
  if (!spreadMode) return [clampPage(page)];
  const target = clampPage(page);
  const first = target % 2 === 0 ? target - 1 : target;
  const pages = [first];
  if (first + 1 <= totalPages) pages.push(first + 1);
  return pages;
}

async function renderPages() {
  if (!pdfDoc) return;
  if (!pdfDoc) {
    setStatus('Upload een BiNaS-PDF om te starten.');
    canvasWrapper.innerHTML = '';
    return;
  }
  clearError();
  setStatus('Bezig met renderen…');
  canvasWrapper.innerHTML = '';

  const pagesToRender = getSpreadPages(currentPage);
  const firstPage = await pdfDoc.getPage(pagesToRender[0]);
  const viewport = firstPage.getViewport({ scale: 1 });

  // schaal berekenen op basis van gekozen modus of laatste fit.
  const scale = computeScale(viewport.width, viewport.height, pagesToRender.length);
  currentScale = scale;

  for (const pageNum of pagesToRender) {
    const page = pageNum === pagesToRender[0] ? firstPage : await pdfDoc.getPage(pageNum);
    const vp = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.width = vp.width;
    canvas.height = vp.height;
    canvas.setAttribute('data-page-number', pageNum);
    canvasWrapper.appendChild(canvas);

    const context = canvas.getContext('2d');
    await page.render({ canvasContext: context, viewport: vp }).promise;
  }

  pageInfo.textContent = spreadMode && pagesToRender.length === 2
    ? `Pagina ${pagesToRender[0]}–${pagesToRender[1]} / ${totalPages}`
    : `Pagina ${pagesToRender[0]} / ${totalPages}`;
  pageInput.value = pagesToRender[0];
  setStatus('Gereed');
}

function computeScale(pageWidth, pageHeight, pagesShown) {
  const containerWidth = viewerContainer.clientWidth - 40; // marge voor padding
  const containerHeight = viewerContainer.clientHeight - 40;
  if (lastFitMode === 'fit-page') {
    return Math.min(
      containerWidth / (pageWidth * pagesShown + 12 * (pagesShown - 1)),
      containerHeight / pageHeight
    );
  }
  if (lastFitMode === 'fit-width') {
    return containerWidth / (pageWidth * pagesShown + 12 * (pagesShown - 1));
  }
  return currentScale;
}

function goToPage(target) {
  if (!pdfDoc) {
    showError('Upload eerst een PDF om naar een pagina te gaan.');
    return;
  }
  currentPage = clampPage(target);
  renderPages();
}

function toggleSpread() {
  spreadMode = !spreadMode;
  toggleViewBtn.textContent = spreadMode ? 'Spread' : 'Enkele pagina';
  toggleViewBtn.classList.toggle('is-active', spreadMode);
  renderPages();
}

function zoom(delta) {
  if (!pdfDoc) return;
  lastFitMode = null;
  currentScale = Math.min(Math.max(currentScale + delta, MIN_SCALE), MAX_SCALE);
  renderPages();
}

function fitWidth() {
  if (!pdfDoc) return;
  lastFitMode = 'fit-width';
  renderPages();
}

function fitPage() {
  if (!pdfDoc) return;
  lastFitMode = 'fit-page';
  renderPages();
}

function goNext() {
  const step = spreadMode ? 2 : 1;
  goToPage(currentPage + step);
}

function goPrev() {
  const step = spreadMode ? 2 : 1;
  goToPage(currentPage - step);
}

function goFirst() {
  goToPage(1);
}

function goLast() {
  goToPage(totalPages);
}

function disableControls() {
  [toggleViewBtn, zoomInBtn, zoomOutBtn, fitWidthBtn, fitPageBtn, prevBtn, nextBtn, firstBtn, lastBtn, goToPageBtn, pageInput]
    .forEach((el) => {
      el.setAttribute('disabled', 'disabled');
    });
}

function enableControls() {
  [toggleViewBtn, zoomInBtn, zoomOutBtn, fitWidthBtn, fitPageBtn, prevBtn, nextBtn, firstBtn, lastBtn, goToPageBtn, pageInput]
    .forEach((el) => {
      el.removeAttribute('disabled');
    });
}

// Event binding
searchInput.addEventListener('input', (e) => renderIndex(e.target.value));
toggleViewBtn.addEventListener('click', toggleSpread);
zoomInBtn.addEventListener('click', () => zoom(SCALE_STEP));
zoomOutBtn.addEventListener('click', () => zoom(-SCALE_STEP));
fitWidthBtn.addEventListener('click', fitWidth);
fitPageBtn.addEventListener('click', fitPage);
nextBtn.addEventListener('click', goNext);
prevBtn.addEventListener('click', goPrev);
firstBtn.addEventListener('click', goFirst);
lastBtn.addEventListener('click', goLast);
goToPageBtn.addEventListener('click', () => {
  const target = Number(pageInput.value);
  if (Number.isFinite(target)) goToPage(target);
});

pageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const target = Number(pageInput.value);
    if (Number.isFinite(target)) goToPage(target);
  }
});

// Panning (muis slepen)
canvasWrapper.addEventListener('mousedown', (e) => {
@@ -296,49 +546,70 @@ window.addEventListener('keydown', (e) => {
  if (e.target.closest('input, textarea')) return;
  switch (e.key) {
    case 'ArrowRight':
      goNext();
      break;
    case 'ArrowLeft':
      goPrev();
      break;
    case '+':
    case '=':
      zoom(SCALE_STEP);
      break;
    case '-':
      zoom(-SCALE_STEP);
      break;
    default:
      break;
  }
});

// Rescale bij resize
window.addEventListener('resize', () => {
  if (lastFitMode) renderPages();
});

// PDF laden
async function loadPdf() {
function resetViewer() {
  currentPage = 1;
  totalPages = 0;
  lastFitMode = 'fit-width';
  spreadMode = DEFAULT_SPREAD;
  currentScale = 1;
  pageInput.value = '';
  pageInfo.textContent = 'Pagina - / -';
  toggleViewBtn.classList.toggle('is-active', spreadMode);
  disableControls();
}

async function loadPdfFromFile(file) {
  if (!file) return;
  pdfUploadInput.value = '';
  resetViewer();
  setStatus('PDF laden…');
  clearError();
  try {
    const loadingTask = pdfjsLib.getDocument({ url: PDF_URL, withCredentials: false });
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    pdfDoc = await loadingTask.promise;
    totalPages = pdfDoc.numPages;
    pageInput.max = totalPages;
    toggleViewBtn.textContent = spreadMode ? 'Spread' : 'Enkele pagina';
    toggleViewBtn.classList.toggle('is-active', spreadMode);
    enableControls();
    await renderPages();
  } catch (err) {
    console.error(err);
    showError('Kon de PDF niet laden. Controleer de internetverbinding of CORS-instellingen.');
    showError('Kon de PDF niet laden. Controleer of het bestand geldig is.');
    setStatus('Laden mislukt');
  }
}

pdfUploadInput.addEventListener('change', (event) => {
  const file = event.target.files?.[0];
  loadPdfFromFile(file);
});

function init() {
  renderIndex();
  loadPdf();
  resetViewer();
}

init();
index.html
+84
-16

<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BiNaS Viewer</title>
  <link rel="stylesheet" href="styles.css">
  <!-- pdf.js via CDN -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.min.js" integrity="sha512-uWH+Wh0xblZqTtNpC1ErmLROE2/p4O9fI2G3Vy7FiJm+f9Y9fKQhKzyUIqogQBEw5rLDQO5/nbY5z3K5pTAxGw==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
</head>
<body>
  <div class="app-shell">
    <aside class="sidebar">
      <header class="sidebar__header">
        <h1>BiNaS Viewer</h1>
        <p class="subtitle">Zoek snel naar tabellen en onderwerpen</p>
        <div class="brand">
          <div class="brand__icon" aria-hidden="true">𝛽</div>
          <div>
            <h1>BiNaS Viewer</h1>
            <p class="subtitle">Zoek snel naar tabellen en onderwerpen</p>
          </div>
        </div>
        <div class="upload">
          <input id="pdf-upload" type="file" accept="application/pdf" hidden />
          <label class="upload__button" for="pdf-upload">
            <svg viewBox="0 0 24 24" role="presentation" aria-hidden="true" focusable="false">
              <path d="M12 3c.3 0 .5.1.7.3l5 5a1 1 0 0 1-1.4 1.4L13 7.4V16a1 1 0 1 1-2 0V7.4L7.7 9.7A1 1 0 1 1 6.3 8.3l5-5c.2-.2.4-.3.7-.3Z" />
              <path d="M5 14a1 1 0 0 1 2 0 3 3 0 0 0 3 3h4a3 3 0 0 0 3-3 1 1 0 1 1 2 0 5 5 0 0 1-5 5H10a5 5 0 0 1-5-5Z" />
            </svg>
            <span>Upload PDF</span>
          </label>
          <p class="upload__hint">Selecteer je eigen BiNaS-PDF.</p>
        </div>
        <label class="search-label" for="search-input">Zoeken in BiNaS</label>
        <input id="search-input" type="search" placeholder="Zoek op onderwerp of tabelnummer" autocomplete="off" />
        <div class="search-bar">
          <svg viewBox="0 0 24 24" role="presentation" aria-hidden="true" focusable="false">
            <path d="m20.7 19.3-4-4a7 7 0 1 0-1.4 1.4l4 4a1 1 0 0 0 1.4-1.4ZM6 11a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z" />
          </svg>
          <input id="search-input" type="search" placeholder="Zoek op onderwerp of tabelnummer" autocomplete="off" />
        </div>
      </header>
      <div id="topic-list" class="topic-list" aria-live="polite"></div>
    </aside>

    <main class="viewer">
      <div class="toolbar">
        <div class="toolbar__group">
          <button id="prev-page" type="button">Vorige</button>
          <button id="next-page" type="button">Volgende</button>
          <button id="first-page" type="button">Eerste</button>
          <button id="last-page" type="button">Laatste</button>
          <button id="first-page" type="button" class="icon-button" aria-label="Eerste pagina" title="Eerste pagina">
            <svg viewBox="0 0 24 24" role="presentation" aria-hidden="true" focusable="false">
              <path d="M18 5a1 1 0 1 0-2 0v14a1 1 0 1 0 2 0V5Zm-4.7 7.7a1 1 0 0 0 0-1.4l-5-5A1 1 0 0 0 7 7v10a1 1 0 0 0 1.7.7l5-5Z" />
            </svg>
          </button>
          <button id="prev-page" type="button" class="icon-button" aria-label="Vorige pagina" title="Vorige pagina">
            <svg viewBox="0 0 24 24" role="presentation" aria-hidden="true" focusable="false">
              <path d="m14.7 5.3-6 6a1 1 0 0 0 0 1.4l6 6a1 1 0 0 0 1.4-1.4L10.41 12l5.7-5.7A1 1 0 0 0 14.7 5.3Z" />
            </svg>
          </button>
          <button id="next-page" type="button" class="icon-button" aria-label="Volgende pagina" title="Volgende pagina">
            <svg viewBox="0 0 24 24" role="presentation" aria-hidden="true" focusable="false">
              <path d="m9.3 5.3 6 6a1 1 0 0 1 0 1.4l-6 6a1 1 0 0 1-1.4-1.4l5.29-5.3-5.3-5.3A1 1 0 0 1 9.3 5.3Z" />
            </svg>
          </button>
          <button id="last-page" type="button" class="icon-button" aria-label="Laatste pagina" title="Laatste pagina">
            <svg viewBox="0 0 24 24" role="presentation" aria-hidden="true" focusable="false">
              <path d="M6 19a1 1 0 1 0 2 0V5a1 1 0 1 0-2 0v14Zm4.7-7.7a1 1 0 0 1 0-1.4l5-5A1 1 0 0 1 17 7v10a1 1 0 0 1-1.7.7l-5-5Z" />
            </svg>
          </button>
        </div>

        <div class="toolbar__group">
          <button id="toggle-view" type="button">Spread</button>
          <button id="toggle-view" type="button" class="icon-button" aria-label="Wissel spread" title="Spread / enkele pagina">
            <svg viewBox="0 0 24 24" role="presentation" aria-hidden="true" focusable="false">
              <path d="M10 5a1 1 0 0 1 1 1v12a1 1 0 0 1-1.5.86l-6-3.5A1 1 0 0 1 2 14.5v-5a1 1 0 0 1 .5-.86l6-3.5A1 1 0 0 1 10 5Zm4 0a1 1 0 0 0-1 1v12a1 1 0 0 0 1.5.86l6-3.5a1 1 0 0 0 .5-.86v-5a1 1 0 0 0-.5-.86l-6-3.5A1 1 0 0 0 14 5Z" />
            </svg>
          </button>
          <span class="divider" aria-hidden="true"></span>
          <button id="zoom-out" type="button">Zoom uit</button>
          <button id="zoom-in" type="button">Zoom in</button>
          <button id="fit-width" type="button">Passend breedte</button>
          <button id="fit-page" type="button">Hele pagina</button>
          <button id="zoom-out" type="button" class="icon-button" aria-label="Zoom uit" title="Zoom uit">
            <svg viewBox="0 0 24 24" role="presentation" aria-hidden="true" focusable="false">
              <path d="M4 12a8 8 0 1 1 16 0 8 8 0 0 1-16 0Zm8-6a6 6 0 1 0 0 12 6 6 0 0 0 0-12Zm-3 5a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H9Z" />
            </svg>
          </button>
          <button id="zoom-in" type="button" class="icon-button" aria-label="Zoom in" title="Zoom in">
            <svg viewBox="0 0 24 24" role="presentation" aria-hidden="true" focusable="false">
              <path d="M4 12a8 8 0 1 1 16 0 8 8 0 0 1-16 0Zm8-6a6 6 0 1 0 0 12 6 6 0 0 0 0-12Zm-1 3a1 1 0 0 1 2 0v2h2a1 1 0 1 1 0 2h-2v2a1 1 0 1 1-2 0v-2H9a1 1 0 0 1 0-2h2V9Z" />
            </svg>
          </button>
          <button id="fit-width" type="button" class="icon-button" aria-label="Passend op breedte" title="Passend op breedte">
            <svg viewBox="0 0 24 24" role="presentation" aria-hidden="true" focusable="false">
              <path d="M14 6a1 1 0 0 0 0 2h2.59L6.3 18.3a1 1 0 0 0 1.4 1.4L18 9.41V12a1 1 0 1 0 2 0V7a1 1 0 0 0-1-1h-5Z" />
              <path d="M5 5a1 1 0 0 0-1 1v5a1 1 0 1 0 2 0V8.41l9.3 9.3a1 1 0 0 0 1.4-1.42L7.41 7H10a1 1 0 1 0 0-2H5Z" />
            </svg>
          </button>
          <button id="fit-page" type="button" class="icon-button" aria-label="Hele pagina" title="Hele pagina">
            <svg viewBox="0 0 24 24" role="presentation" aria-hidden="true" focusable="false">
              <path d="M11 4a1 1 0 0 1 2 0v3a2 2 0 0 0 2 2h3a1 1 0 1 1 0 2h-3a4 4 0 0 1-4-4V4Zm-6 7a1 1 0 0 1 1 1v3a2 2 0 0 0 2 2h3a1 1 0 1 1 0 2H8a4 4 0 0 1-4-4v-3a1 1 0 0 1 1-1Z" />
              <path d="M4 11a1 1 0 0 1 0-2h3a2 2 0 0 0 2-2V4a1 1 0 1 1 2 0v3a4 4 0 0 1-4 4H4Zm10-7a1 1 0 0 1 1 1v3a2 2 0 0 0 2 2h3a1 1 0 1 1 0 2h-3a4 4 0 0 1-4-4V5a1 1 0 0 1 1-1Z" />
            </svg>
          </button>
        </div>

        <div class="toolbar__group">
          <label for="page-input">Ga naar pagina</label>
          <input id="page-input" type="number" min="1" step="1" />
          <button id="go-to-page" type="button">Ga</button>
          <label for="page-input" class="sr-only">Ga naar pagina</label>
          <div class="pill-input">
            <svg viewBox="0 0 24 24" role="presentation" aria-hidden="true" focusable="false">
              <path d="M12 5a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm-9 7a9 9 0 1 1 18 0 9 9 0 0 1-18 0Zm9-6a1 1 0 0 1 1 1v4.6l2.1 1.2a1 1 0 1 1-1 1.8l-2.6-1.5A1 1 0 0 1 11 13V7a1 1 0 0 1 1-1Z" />
            </svg>
            <input id="page-input" type="number" min="1" step="1" placeholder="Pg." />
          </div>
          <button id="go-to-page" type="button" class="icon-button" aria-label="Ga naar pagina" title="Ga naar pagina">
            <svg viewBox="0 0 24 24" role="presentation" aria-hidden="true" focusable="false">
              <path d="M5 12a1 1 0 0 1 1-1h10.59l-3.3-3.3a1 1 0 0 1 1.42-1.4l5 5a1 1 0 0 1 0 1.4l-5 5a1 1 0 0 1-1.42-1.4l3.3-3.3H6a1 1 0 0 1-1-1Z" />
            </svg>
          </button>
          <span id="page-info" class="page-info">Pagina - / -</span>
        </div>
      </div>

      <div id="status" class="status" role="status">Bezig met laden…</div>
      <div id="status" class="status" role="status">Upload een BiNaS-PDF om te starten.</div>
      <div id="viewer-container" class="viewer-container">
        <div id="canvas-wrapper" class="canvas-wrapper"></div>
      </div>
    </main>
  </div>

  <div id="error-banner" class="error-banner" hidden></div>
  <script src="app.js"></script>
</body>
</html>
styles.css
+263
-54

:root {
  --sidebar-width: 320px;
  --border-color: #e0e0e0;
  --bg-light: #f7f7f9;
  --sidebar-width: 360px;
  --border-color: #e3e7ef;
  --bg-light: #f5f7fb;
  --bg-card: #ffffff;
  --accent: #2a7f62;
  --text: #1f1f1f;
  --muted: #5f6368;
  --accent-strong: #25674f;
  --text: #161c2d;
  --muted: #6b7280;
  --danger: #b3261e;
  --shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  --cat-algemeen: #7c3aed;
  --cat-algemeen-achterin: #8b5e3c;
  --cat-natuurkunde: #2563eb;
  --cat-wiskunde: #8b5e3c;
  --cat-scheikunde: #dc2626;
  --cat-biologie: #16a34a;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
  background: #fff;
  background: linear-gradient(135deg, #eef1f7 0%, #f8fafc 40%, #eef6f2 100%);
  color: var(--text);
  height: 100vh;
  display: flex;
}

h1, h2, h3, h4 {
  color: var(--text);
}

.app-shell {
  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr;
  width: 100%;
  height: 100vh;
}

.sidebar {
  background: var(--bg-light);
  border-right: 1px solid var(--border-color);
  padding: 16px;
  padding: 18px 18px 24px;
  overflow-y: auto;
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, 0.02);
}

.sidebar__header {
  position: sticky;
  top: 0;
  background: var(--bg-light);
  padding-bottom: 12px;
  padding-bottom: 16px;
  z-index: 1;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.brand__icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: radial-gradient(circle at 30% 30%, #6fe3ab 0%, #2a7f62 70%);
  display: grid;
  place-items: center;
  font-weight: 700;
  color: #fff;
  font-size: 18px;
  box-shadow: var(--shadow);
}

.sidebar h1 {
  margin: 0 0 4px;
  margin: 0;
  font-size: 20px;
}

.subtitle {
  margin: 0 0 12px;
  margin: 2px 0 0;
  color: var(--muted);
  font-size: 14px;
}

.upload {
  background: var(--bg-card);
  border: 1px dashed var(--border-color);
  border-radius: 12px;
  padding: 12px 14px;
  margin: 14px 0;
  box-shadow: var(--shadow);
}

.upload__button {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 10px;
  background: linear-gradient(135deg, #2a7f62, #5abf9f);
  color: #fff;
  cursor: pointer;
  font-weight: 600;
  letter-spacing: 0.01em;
  transition: transform 0.12s ease, box-shadow 0.2s ease;
  box-shadow: 0 12px 30px rgba(42, 127, 98, 0.35);
}

.upload__button svg {
  width: 20px;
  height: 20px;
  fill: currentColor;
}

.upload__button:hover {
  transform: translateY(-1px);
  box-shadow: 0 18px 38px rgba(42, 127, 98, 0.35);
}

.upload__hint {
  margin: 8px 0 0;
  color: var(--muted);
  font-size: 13px;
}

.search-label {
  display: block;
  font-size: 14px;
  margin-bottom: 6px;
  margin: 0 0 6px;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 10px 12px;
  box-shadow: var(--shadow);
}

.search-bar svg {
  width: 18px;
  height: 18px;
  fill: var(--muted);
}

.sidebar input[type="search"] {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  border: none;
  font-size: 14px;
  outline: none;
  background: transparent;
}

.topic-list {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.category-group {
  background: #fff;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow);
}

.category--algemeen {
  border-color: rgba(124, 58, 237, 0.25);
}

.category--algemeen-achterin {
  border-color: rgba(139, 94, 60, 0.25);
}

.category--natuurkunde {
  border-color: rgba(37, 99, 235, 0.25);
}

.category--wiskunde {
  border-color: rgba(139, 94, 60, 0.35);
}

.category--scheikunde {
  border-color: rgba(220, 38, 38, 0.25);
}

.category--biologie {
  border-color: rgba(22, 163, 74, 0.25);
}

.category-header {
  margin: 0;
  padding: 10px 12px;
  background: var(--bg-light);
  padding: 12px 14px;
  background: linear-gradient(120deg, #f5f7fb 0%, #eef6f2 100%);
  border-bottom: 1px solid var(--border-color);
  font-size: 15px;
  font-weight: 600;
  font-weight: 700;
}

.category--algemeen__title {
  color: var(--cat-algemeen);
}

.category--algemeen-achterin__title {
  color: var(--cat-algemeen-achterin);
}

.category--wiskunde__title {
  color: var(--cat-wiskunde);
}

.category--natuurkunde__title {
  color: var(--cat-natuurkunde);
}

.category--scheikunde__title {
  color: var(--cat-scheikunde);
}

.category--biologie__title {
  color: var(--cat-biologie);
}

.topic-item {
  padding: 10px 12px;
  padding: 12px 14px;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  transition: background 0.2s ease;
  transition: background 0.2s ease, transform 0.1s ease;
  text-align: left;
  background: #fff;
}

.topic-item:last-child {
  border-bottom: none;
}

.topic-item:hover,
.topic-item:focus {
  background: #eef7f3;
}

.topic-item--inactive {
  cursor: not-allowed;
  color: var(--muted);
  background: #fafbfc;
}

.topic-meta {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
}

.topic-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}

.topic-code {
  font-size: 12px;
  color: var(--accent);
  font-weight: 700;
}

.topic-pages {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--muted);
}

.viewer {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.toolbar {
  display: flex;
  gap: 16px;
  padding: 12px;
  gap: 18px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border-color);
  align-items: center;
  flex-wrap: wrap;
  background: #fff;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 2;
  box-shadow: var(--shadow);
}

.toolbar__group {
  display: inline-flex;
  gap: 8px;
  align-items: center;
}

.toolbar button {
  padding: 8px 12px;
.icon-button {
  width: 40px;
  height: 40px;
  border: 1px solid var(--border-color);
  background: #fff;
  border-radius: 6px;
  background: linear-gradient(145deg, #fff, #f5f7fb);
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.15s ease, transform 0.1s ease;
  display: grid;
  place-items: center;
  transition: transform 0.1s ease, box-shadow 0.15s ease, border-color 0.2s ease;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.06);
}

.toolbar button:hover {
  background: #eef7f3;
.icon-button svg {
  width: 18px;
  height: 18px;
  fill: var(--text);
}

.icon-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 24px rgba(0, 0, 0, 0.08);
  border-color: #d0d7e4;
}

.toolbar button:active {
  transform: translateY(1px);
.icon-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

.is-active {
  border-color: var(--accent);
  box-shadow: 0 12px 26px rgba(42, 127, 98, 0.18);
}

.pill-input {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #fff;
  border: 1px solid var(--border-color);
  border-radius: 999px;
  padding: 6px 10px;
  box-shadow: var(--shadow);
}

.pill-input svg {
  width: 16px;
  height: 16px;
  fill: var(--muted);
}

.toolbar input[type="number"] {
  width: 70px;
  padding: 8px 10px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 6px 6px;
  border: none;
  font-size: 14px;
  background: transparent;
  outline: none;
}

.divider {
  width: 1px;
  height: 28px;
  background: var(--border-color);
  display: inline-block;
}

.viewer-container {
  position: relative;
  flex: 1;
  overflow: hidden;
  background: #f2f3f5;
  background: linear-gradient(135deg, #f3f6fb 0%, #eef6f2 100%);
}

.canvas-wrapper {
  position: absolute;
  inset: 0;
  display: flex;
  gap: 12px;
  justify-content: center;
  align-items: flex-start;
  overflow: auto;
  padding: 20px;
  padding: 24px;
}

canvas {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.14);
  background: #fff;
  border-radius: 10px;
}

.status {
  padding: 8px 12px;
  padding: 10px 14px;
  color: var(--muted);
  font-size: 14px;
  border-bottom: 1px solid var(--border-color);
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(6px);
}

.page-info {
  font-size: 14px;
  color: var(--muted);
  padding: 6px 10px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow);
}

.error-banner {
  position: fixed;
  bottom: 16px;
  right: 16px;
  padding: 12px 14px;
  background: #feecec;
  color: var(--danger);
  border: 1px solid #f5b5b5;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
}

@media (max-width: 900px) {
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 1100px) {
  :root {
    --sidebar-width: 280px;
    --sidebar-width: 320px;
  }

  .toolbar {
    gap: 8px;
    gap: 10px;
  }
}

@media (max-width: 720px) {
@media (max-width: 900px) {
  :root {
    --sidebar-width: 100%;
  }

  .app-shell {
    grid-template-columns: 1fr;
  }

  .sidebar {
    height: 40vh;
    height: auto;
    max-height: 50vh;
  }

  .viewer {
    height: 60vh;
    height: 50vh;
  }

  .canvas-wrapper {
    justify-content: flex-start;
  }
}
