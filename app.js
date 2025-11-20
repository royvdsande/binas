// Basisconfiguratie voor de BiNaS viewer zonder externe download.
const DEFAULT_SPREAD = true;
const MIN_SCALE = 0.5;
const MAX_SCALE = 3.5;
const SCALE_STEP = 0.15;

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
      button.setAttribute('data-page', item.pageStart ?? '');
      const pagesLabel = item.pageStart ? `Pagina's ${item.pageStart}${item.pageEnd ? `–${item.pageEnd}` : ''}` : 'Pagina volgt';
      button.innerHTML = `
        <div class="topic-meta">
          <p class="topic-title">${item.title}</p>
        </div>
        <p class="topic-pages">${pagesLabel}</p>
      `;

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
  isDragging = true;
  dragStart = { x: e.clientX, y: e.clientY };
  scrollStart = { left: canvasWrapper.scrollLeft, top: canvasWrapper.scrollTop };
  canvasWrapper.classList.add('dragging');
});

window.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const dx = e.clientX - dragStart.x;
  const dy = e.clientY - dragStart.y;
  canvasWrapper.scrollLeft = scrollStart.left - dx;
  canvasWrapper.scrollTop = scrollStart.top - dy;
});

window.addEventListener('mouseup', () => {
  isDragging = false;
  canvasWrapper.classList.remove('dragging');
});

canvasWrapper.addEventListener('wheel', (e) => {
  if (e.ctrlKey) {
    e.preventDefault();
    zoom(e.deltaY > 0 ? -SCALE_STEP : SCALE_STEP);
  }
});

// Keyboard shortcuts
window.addEventListener('keydown', (e) => {
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
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    pdfDoc = await loadingTask.promise;
    totalPages = pdfDoc.numPages;
    pageInput.max = totalPages;
    toggleViewBtn.classList.toggle('is-active', spreadMode);
    enableControls();
    await renderPages();
  } catch (err) {
    console.error(err);
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
  resetViewer();
}

init();
