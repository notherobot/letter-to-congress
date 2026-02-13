/* ============================================
   LETTER TO CONGRESS — APPLICATION
   Congress data, lookup, letter builder,
   map, leaderboard, gamification
   ============================================ */

const app = (() => {

// ─── STATE ABBREVIATION MAP ───
const STATES = {
    AL:'Alabama',AK:'Alaska',AZ:'Arizona',AR:'Arkansas',CA:'California',
    CO:'Colorado',CT:'Connecticut',DE:'Delaware',FL:'Florida',GA:'Georgia',
    HI:'Hawaii',ID:'Idaho',IL:'Illinois',IN:'Indiana',IA:'Iowa',
    KS:'Kansas',KY:'Kentucky',LA:'Louisiana',ME:'Maine',MD:'Maryland',
    MA:'Massachusetts',MI:'Michigan',MN:'Minnesota',MS:'Mississippi',MO:'Missouri',
    MT:'Montana',NE:'Nebraska',NV:'Nevada',NH:'New Hampshire',NJ:'New Jersey',
    NM:'New Mexico',NY:'New York',NC:'North Carolina',ND:'North Dakota',OH:'Ohio',
    OK:'Oklahoma',OR:'Oregon',PA:'Pennsylvania',RI:'Rhode Island',SC:'South Carolina',
    SD:'South Dakota',TN:'Tennessee',TX:'Texas',UT:'Utah',VT:'Vermont',
    VA:'Virginia',WA:'Washington',WV:'West Virginia',WI:'Wisconsin',WY:'Wyoming'
};
const ABBR = Object.fromEntries(Object.entries(STATES).map(([k,v])=>[v,k]));

// ─── ZIP PREFIX → STATE ───
// Maps first 3 digits of zip to state abbreviation
const ZIP3 = {
    '006':'PR','007':'PR','008':'PR','009':'PR',
    '010':'MA','011':'MA','012':'MA','013':'MA','014':'MA','015':'MA','016':'MA','017':'MA','018':'MA','019':'MA',
    '020':'MA','021':'MA','022':'MA','023':'MA','024':'MA','025':'MA','026':'MA','027':'MA',
    '028':'RI','029':'RI',
    '030':'NH','031':'NH','032':'NH','033':'NH','034':'NH','035':'NH','036':'NH','037':'NH','038':'NH',
    '039':'ME',
    '040':'ME','041':'ME','042':'ME','043':'ME','044':'ME','045':'ME','046':'ME','047':'ME','048':'ME','049':'ME',
    '050':'VT','051':'VT','052':'VT','053':'VT','054':'VT','055':'VT','056':'VT','057':'VT','058':'VT','059':'VT',
    '060':'CT','061':'CT','062':'CT','063':'CT','064':'CT','065':'CT','066':'CT','067':'CT','068':'CT','069':'CT',
    '070':'NJ','071':'NJ','072':'NJ','073':'NJ','074':'NJ','075':'NJ','076':'NJ','077':'NJ','078':'NJ','079':'NJ',
    '080':'NJ','081':'NJ','082':'NJ','083':'NJ','084':'NJ','085':'NJ','086':'NJ','087':'NJ','088':'NJ','089':'NJ',
    '100':'NY','101':'NY','102':'NY','103':'NY','104':'NY','105':'NY','106':'NY','107':'NY','108':'NY','109':'NY',
    '110':'NY','111':'NY','112':'NY','113':'NY','114':'NY','115':'NY','116':'NY','117':'NY','118':'NY','119':'NY',
    '120':'NY','121':'NY','122':'NY','123':'NY','124':'NY','125':'NY','126':'NY','127':'NY','128':'NY','129':'NY',
    '130':'NY','131':'NY','132':'NY','133':'NY','134':'NY','135':'NY','136':'NY','137':'NY','138':'NY','139':'NY',
    '140':'NY','141':'NY','142':'NY','143':'NY','144':'NY','145':'NY','146':'NY','147':'NY','148':'NY','149':'NY',
    '150':'PA','151':'PA','152':'PA','153':'PA','154':'PA','155':'PA','156':'PA','157':'PA','158':'PA','159':'PA',
    '160':'PA','161':'PA','162':'PA','163':'PA','164':'PA','165':'PA','166':'PA','167':'PA','168':'PA','169':'PA',
    '170':'PA','171':'PA','172':'PA','173':'PA','174':'PA','175':'PA','176':'PA','177':'PA','178':'PA','179':'PA',
    '180':'PA','181':'PA','182':'PA','183':'PA','184':'PA','185':'PA','186':'PA','187':'PA','188':'PA','189':'PA',
    '190':'PA','191':'PA',
    '193':'PA','194':'PA','195':'PA','196':'PA',
    '197':'DE','198':'DE','199':'DE',
    '200':'DC','201':'VA','202':'DC','203':'DC','204':'DC','205':'DC',
    '206':'MD','207':'MD','208':'MD','209':'MD',
    '210':'MD','211':'MD','212':'MD','213':'MD','214':'MD','215':'MD','216':'MD','217':'MD','218':'MD','219':'MD',
    '220':'VA','221':'VA','222':'VA','223':'VA','224':'VA','225':'VA','226':'VA','227':'VA','228':'VA','229':'VA',
    '230':'VA','231':'VA','232':'VA','233':'VA','234':'VA','235':'VA','236':'VA','237':'VA','238':'VA','239':'VA',
    '240':'VA','241':'VA','242':'VA','243':'VA','244':'VA','245':'VA','246':'WV',
    '247':'WV','248':'WV','249':'WV',
    '250':'WV','251':'WV','252':'WV','253':'WV','254':'WV','255':'WV','256':'WV','257':'WV','258':'WV','259':'WV',
    '260':'WV','261':'WV','262':'WV','263':'WV','264':'WV','265':'WV','266':'WV','267':'WV','268':'WV',
    '270':'NC','271':'NC','272':'NC','273':'NC','274':'NC','275':'NC','276':'NC','277':'NC','278':'NC','279':'NC',
    '280':'NC','281':'NC','282':'NC','283':'NC','284':'NC','285':'NC','286':'NC','287':'NC','288':'NC','289':'NC',
    '290':'SC','291':'SC','292':'SC','293':'SC','294':'SC','295':'SC','296':'SC','297':'SC','298':'SC','299':'SC',
    '300':'GA','301':'GA','302':'GA','303':'GA','304':'GA','305':'GA','306':'GA','307':'GA','308':'GA','309':'GA',
    '310':'GA','311':'GA','312':'GA','313':'GA','314':'GA','315':'GA','316':'GA','317':'GA','318':'GA','319':'GA',
    '320':'FL','321':'FL','322':'FL','323':'FL','324':'FL','325':'FL','326':'FL','327':'FL','328':'FL','329':'FL',
    '330':'FL','331':'FL','332':'FL','333':'FL','334':'FL','335':'FL','336':'FL','337':'FL','338':'FL','339':'FL',
    '340':'FL','341':'FL','342':'FL','344':'FL','346':'FL','347':'FL','349':'FL',
    '350':'AL','351':'AL','352':'AL','354':'AL','355':'AL','356':'AL','357':'AL','358':'AL','359':'AL',
    '360':'AL','361':'AL','362':'AL','363':'AL','364':'AL','365':'AL','366':'AL','367':'AL','368':'AL','369':'AL',
    '370':'TN','371':'TN','372':'TN','373':'TN','374':'TN','375':'TN','376':'TN','377':'TN','378':'TN','379':'TN',
    '380':'TN','381':'TN','382':'TN','383':'TN','384':'TN','385':'TN',
    '386':'MS','387':'MS','388':'MS','389':'MS',
    '390':'MS','391':'MS','392':'MS','393':'MS','394':'MS','395':'MS','396':'MS','397':'MS',
    '398':'GA',
    '400':'KY','401':'KY','402':'KY','403':'KY','404':'KY','405':'KY','406':'KY','407':'KY','408':'KY','409':'KY',
    '410':'KY','411':'KY','412':'KY','413':'KY','414':'KY','415':'KY','416':'KY','417':'KY','418':'KY',
    '420':'KY','421':'KY','422':'KY','423':'KY','424':'KY','425':'KY','426':'KY','427':'KY',
    '430':'OH','431':'OH','432':'OH','433':'OH','434':'OH','435':'OH','436':'OH','437':'OH','438':'OH','439':'OH',
    '440':'OH','441':'OH','442':'OH','443':'OH','444':'OH','445':'OH','446':'OH','447':'OH','448':'OH','449':'OH',
    '450':'OH','451':'OH','452':'OH','453':'OH','454':'OH','455':'OH','456':'OH','457':'OH','458':'OH',
    '460':'IN','461':'IN','462':'IN','463':'IN','464':'IN','465':'IN','466':'IN','467':'IN','468':'IN','469':'IN',
    '470':'IN','471':'IN','472':'IN','473':'IN','474':'IN','475':'IN','476':'IN','477':'IN','478':'IN','479':'IN',
    '480':'MI','481':'MI','482':'MI','483':'MI','484':'MI','485':'MI','486':'MI','487':'MI','488':'MI','489':'MI',
    '490':'MI','491':'MI','492':'MI','493':'MI','494':'MI','495':'MI','496':'MI','497':'MI','498':'MI','499':'MI',
    '500':'IA','501':'IA','502':'IA','503':'IA','504':'IA','505':'IA','506':'IA','507':'IA','508':'IA','509':'IA',
    '510':'IA','511':'IA','512':'IA','513':'IA','514':'IA','515':'IA','516':'IA',
    '520':'WI','521':'WI','522':'WI','523':'WI','524':'WI','525':'WI','526':'WI','527':'WI','528':'WI','529':'WI',
    '530':'WI','531':'WI','532':'WI','534':'WI','535':'WI','537':'WI','538':'WI','539':'WI',
    '540':'MN','541':'MN','542':'MN','543':'MN','544':'MN','545':'MN','546':'MN','547':'MN','548':'MN','549':'MN',
    '550':'MN','551':'MN','553':'MN','554':'MN','555':'MN','556':'MN','557':'MN','558':'MN','559':'MN',
    '560':'MN','561':'MN','562':'MN','563':'MN','564':'MN','565':'MN','566':'MN','567':'ND',
    '570':'SD','571':'SD','572':'SD','573':'SD','574':'SD','575':'SD','576':'SD','577':'SD',
    '580':'ND','581':'ND','582':'ND','583':'ND','584':'ND','585':'ND','586':'ND','587':'ND','588':'ND',
    '590':'MT','591':'MT','592':'MT','593':'MT','594':'MT','595':'MT','596':'MT','597':'MT','598':'MT','599':'MT',
    '600':'IL','601':'IL','602':'IL','603':'IL','604':'IL','605':'IL','606':'IL','607':'IL','608':'IL','609':'IL',
    '610':'IL','611':'IL','612':'IL','613':'IL','614':'IL','615':'IL','616':'IL','617':'IL','618':'IL','619':'IL',
    '620':'IL','621':'IL','622':'IL','623':'IL','624':'IL','625':'IL','626':'IL','627':'IL','628':'IL','629':'IL',
    '630':'MO','631':'MO','633':'MO','634':'MO','635':'MO','636':'MO','637':'MO','638':'MO','639':'MO',
    '640':'KS','641':'KS','644':'KS','645':'KS','646':'KS','647':'KS','648':'KS','649':'KS',
    '650':'MO','651':'MO','652':'MO','653':'MO','654':'MO','655':'MO','656':'MO','657':'MO','658':'MO','659':'MO',
    '660':'KS','661':'KS','662':'KS','664':'KS','665':'KS','666':'KS','667':'KS','668':'KS','669':'KS',
    '670':'KS','671':'KS','672':'KS','673':'KS','674':'KS','675':'KS','676':'KS','677':'KS','678':'KS','679':'KS',
    '680':'NE','681':'NE','683':'NE','684':'NE','685':'NE','686':'NE','687':'NE','688':'NE','689':'NE',
    '690':'NE','691':'NE','692':'NE','693':'NE',
    '700':'LA','701':'LA','703':'LA','704':'LA','705':'LA','706':'LA','707':'LA','708':'LA','710':'LA','711':'LA','712':'LA','713':'LA','714':'LA',
    '716':'AR','717':'AR','718':'AR','719':'AR','720':'AR','721':'AR','722':'AR','723':'AR','724':'AR','725':'AR','726':'AR','727':'AR','728':'AR','729':'AR',
    '730':'OK','731':'OK','734':'OK','735':'OK','736':'OK','737':'OK','738':'OK','739':'OK',
    '740':'OK','741':'OK','743':'OK','744':'OK','745':'OK','746':'OK','747':'OK','748':'OK','749':'OK',
    '750':'TX','751':'TX','752':'TX','753':'TX','754':'TX','755':'TX','756':'TX','757':'TX','758':'TX','759':'TX',
    '760':'TX','761':'TX','762':'TX','763':'TX','764':'TX','765':'TX','766':'TX','767':'TX','768':'TX','769':'TX',
    '770':'TX','771':'TX','772':'TX','773':'TX','774':'TX','775':'TX','776':'TX','777':'TX','778':'TX','779':'TX',
    '780':'TX','781':'TX','782':'TX','783':'TX','784':'TX','785':'TX','786':'TX','787':'TX','788':'TX','789':'TX',
    '790':'TX','791':'TX','792':'TX','793':'TX','794':'TX','795':'TX','796':'TX','797':'TX','798':'TX','799':'TX',
    '800':'CO','801':'CO','802':'CO','803':'CO','804':'CO','805':'CO','806':'CO','807':'CO','808':'CO','809':'CO',
    '810':'CO','811':'CO','812':'CO','813':'CO','814':'CO','815':'CO','816':'CO',
    '820':'WY','821':'WY','822':'WY','823':'WY','824':'WY','825':'WY','826':'WY','827':'WY','828':'WY','829':'WY','830':'WY','831':'WY',
    '832':'ID','833':'ID','834':'ID','835':'ID','836':'ID','837':'ID','838':'ID',
    '840':'UT','841':'UT','842':'UT','843':'UT','844':'UT','845':'UT','846':'UT','847':'UT',
    '850':'AZ','851':'AZ','852':'AZ','853':'AZ','855':'AZ','856':'AZ','857':'AZ','859':'AZ','860':'AZ',
    '863':'AZ','864':'AZ','865':'AZ',
    '870':'NM','871':'NM','873':'NM','874':'NM','875':'NM','877':'NM','878':'NM','879':'NM','880':'NM','881':'NM','882':'NM','883':'NM','884':'NM',
    '889':'NV','890':'NV','891':'NV','893':'NV','894':'NV','895':'NV','896':'NV','897':'NV','898':'NV',
    '900':'CA','901':'CA','902':'CA','903':'CA','904':'CA','905':'CA','906':'CA','907':'CA','908':'CA','909':'CA',
    '910':'CA','911':'CA','912':'CA','913':'CA','914':'CA','915':'CA','916':'CA','917':'CA','918':'CA','919':'CA',
    '920':'CA','921':'CA','922':'CA','923':'CA','924':'CA','925':'CA','926':'CA','927':'CA','928':'CA',
    '930':'CA','931':'CA','932':'CA','933':'CA','934':'CA','935':'CA','936':'CA','937':'CA','938':'CA','939':'CA',
    '940':'CA','941':'CA','942':'CA','943':'CA','944':'CA','945':'CA','946':'CA','947':'CA','948':'CA','949':'CA',
    '950':'CA','951':'CA','952':'CA','953':'CA','954':'CA','955':'CA','956':'CA','957':'CA','958':'CA','959':'CA',
    '960':'CA','961':'CA',
    '967':'HI','968':'HI',
    '970':'OR','971':'OR','972':'OR','973':'OR','974':'OR','975':'OR','976':'OR','977':'OR','978':'OR','979':'OR',
    '980':'WA','981':'WA','982':'WA','983':'WA','984':'WA','985':'WA','986':'WA','988':'WA','989':'WA',
    '990':'WA','991':'WA','992':'WA','993':'WA','994':'WA',
    '995':'AK','996':'AK','997':'AK','998':'AK','999':'AK'
};

// ─── SENATORS (119th Congress, 2025–2027) ───
const SENATORS = {
    AL: [
        {name:'Tommy Tuberville',party:'R',phone:'(202) 224-4124',website:'https://www.tuberville.senate.gov',contact:'https://www.tuberville.senate.gov/contact/'},
        {name:'Katie Britt',party:'R',phone:'(202) 224-5744',website:'https://www.britt.senate.gov',contact:'https://www.britt.senate.gov/contact/'}
    ],
    AK: [
        {name:'Lisa Murkowski',party:'R',phone:'(202) 224-6665',website:'https://www.murkowski.senate.gov',contact:'https://www.murkowski.senate.gov/contact/'},
        {name:'Dan Sullivan',party:'R',phone:'(202) 224-3004',website:'https://www.sullivan.senate.gov',contact:'https://www.sullivan.senate.gov/contact/'}
    ],
    AZ: [
        {name:'Mark Kelly',party:'D',phone:'(202) 224-2235',website:'https://www.kelly.senate.gov',contact:'https://www.kelly.senate.gov/contact/'},
        {name:'Ruben Gallego',party:'D',phone:'(202) 224-4521',website:'https://www.gallego.senate.gov',contact:'https://www.gallego.senate.gov/contact/'}
    ],
    AR: [
        {name:'John Boozman',party:'R',phone:'(202) 224-4843',website:'https://www.boozman.senate.gov',contact:'https://www.boozman.senate.gov/contact/'},
        {name:'Tom Cotton',party:'R',phone:'(202) 224-2353',website:'https://www.cotton.senate.gov',contact:'https://www.cotton.senate.gov/contact/'}
    ],
    CA: [
        {name:'Alex Padilla',party:'D',phone:'(202) 224-3553',website:'https://www.padilla.senate.gov',contact:'https://www.padilla.senate.gov/contact/'},
        {name:'Adam Schiff',party:'D',phone:'(202) 224-3841',website:'https://www.schiff.senate.gov',contact:'https://www.schiff.senate.gov/contact/'}
    ],
    CO: [
        {name:'Michael Bennet',party:'D',phone:'(202) 224-5852',website:'https://www.bennet.senate.gov',contact:'https://www.bennet.senate.gov/contact/'},
        {name:'John Hickenlooper',party:'D',phone:'(202) 224-5941',website:'https://www.hickenlooper.senate.gov',contact:'https://www.hickenlooper.senate.gov/contact/'}
    ],
    CT: [
        {name:'Richard Blumenthal',party:'D',phone:'(202) 224-2823',website:'https://www.blumenthal.senate.gov',contact:'https://www.blumenthal.senate.gov/contact/'},
        {name:'Chris Murphy',party:'D',phone:'(202) 224-4041',website:'https://www.murphy.senate.gov',contact:'https://www.murphy.senate.gov/contact/'}
    ],
    DE: [
        {name:'Chris Coons',party:'D',phone:'(202) 224-5042',website:'https://www.coons.senate.gov',contact:'https://www.coons.senate.gov/contact/'},
        {name:'Lisa Blunt Rochester',party:'D',phone:'(202) 224-2441',website:'https://www.bluntrochester.senate.gov',contact:'https://www.bluntrochester.senate.gov/contact/'}
    ],
    FL: [
        {name:'Rick Scott',party:'R',phone:'(202) 224-5274',website:'https://www.rickscott.senate.gov',contact:'https://www.rickscott.senate.gov/contact/'},
        {name:'Ashley Moody',party:'R',phone:'(202) 224-3041',website:'https://www.moody.senate.gov',contact:'https://www.moody.senate.gov/contact/'}
    ],
    GA: [
        {name:'Jon Ossoff',party:'D',phone:'(202) 224-3521',website:'https://www.ossoff.senate.gov',contact:'https://www.ossoff.senate.gov/contact/'},
        {name:'Raphael Warnock',party:'D',phone:'(202) 224-3643',website:'https://www.warnock.senate.gov',contact:'https://www.warnock.senate.gov/contact/'}
    ],
    HI: [
        {name:'Mazie Hirono',party:'D',phone:'(202) 224-6361',website:'https://www.hirono.senate.gov',contact:'https://www.hirono.senate.gov/contact/'},
        {name:'Brian Schatz',party:'D',phone:'(202) 224-3934',website:'https://www.schatz.senate.gov',contact:'https://www.schatz.senate.gov/contact/'}
    ],
    ID: [
        {name:'Mike Crapo',party:'R',phone:'(202) 224-6142',website:'https://www.crapo.senate.gov',contact:'https://www.crapo.senate.gov/contact/'},
        {name:'Jim Risch',party:'R',phone:'(202) 224-2752',website:'https://www.risch.senate.gov',contact:'https://www.risch.senate.gov/contact/'}
    ],
    IL: [
        {name:'Dick Durbin',party:'D',phone:'(202) 224-2152',website:'https://www.durbin.senate.gov',contact:'https://www.durbin.senate.gov/contact/'},
        {name:'Tammy Duckworth',party:'D',phone:'(202) 224-2854',website:'https://www.duckworth.senate.gov',contact:'https://www.duckworth.senate.gov/contact/'}
    ],
    IN: [
        {name:'Todd Young',party:'R',phone:'(202) 224-5623',website:'https://www.young.senate.gov',contact:'https://www.young.senate.gov/contact/'},
        {name:'Jim Banks',party:'R',phone:'(202) 224-5623',website:'https://www.banks.senate.gov',contact:'https://www.banks.senate.gov/contact/'}
    ],
    IA: [
        {name:'Chuck Grassley',party:'R',phone:'(202) 224-3744',website:'https://www.grassley.senate.gov',contact:'https://www.grassley.senate.gov/contact/'},
        {name:'Joni Ernst',party:'R',phone:'(202) 224-3254',website:'https://www.ernst.senate.gov',contact:'https://www.ernst.senate.gov/contact/'}
    ],
    KS: [
        {name:'Jerry Moran',party:'R',phone:'(202) 224-6521',website:'https://www.moran.senate.gov',contact:'https://www.moran.senate.gov/contact/'},
        {name:'Roger Marshall',party:'R',phone:'(202) 224-4774',website:'https://www.marshall.senate.gov',contact:'https://www.marshall.senate.gov/contact/'}
    ],
    KY: [
        {name:'Mitch McConnell',party:'R',phone:'(202) 224-2541',website:'https://www.mcconnell.senate.gov',contact:'https://www.mcconnell.senate.gov/contact/'},
        {name:'Rand Paul',party:'R',phone:'(202) 224-4343',website:'https://www.paul.senate.gov',contact:'https://www.paul.senate.gov/contact/'}
    ],
    LA: [
        {name:'Bill Cassidy',party:'R',phone:'(202) 224-5824',website:'https://www.cassidy.senate.gov',contact:'https://www.cassidy.senate.gov/contact/'},
        {name:'John Kennedy',party:'R',phone:'(202) 224-4623',website:'https://www.kennedy.senate.gov',contact:'https://www.kennedy.senate.gov/contact/'}
    ],
    ME: [
        {name:'Susan Collins',party:'R',phone:'(202) 224-2523',website:'https://www.collins.senate.gov',contact:'https://www.collins.senate.gov/contact/'},
        {name:'Angus King',party:'I',phone:'(202) 224-5344',website:'https://www.king.senate.gov',contact:'https://www.king.senate.gov/contact/'}
    ],
    MD: [
        {name:'Chris Van Hollen',party:'D',phone:'(202) 224-4654',website:'https://www.vanhollen.senate.gov',contact:'https://www.vanhollen.senate.gov/contact/'},
        {name:'Angela Alsobrooks',party:'D',phone:'(202) 224-4524',website:'https://www.alsobrooks.senate.gov',contact:'https://www.alsobrooks.senate.gov/contact/'}
    ],
    MA: [
        {name:'Elizabeth Warren',party:'D',phone:'(202) 224-4543',website:'https://www.warren.senate.gov',contact:'https://www.warren.senate.gov/contact/'},
        {name:'Ed Markey',party:'D',phone:'(202) 224-2742',website:'https://www.markey.senate.gov',contact:'https://www.markey.senate.gov/contact/'}
    ],
    MI: [
        {name:'Gary Peters',party:'D',phone:'(202) 224-6221',website:'https://www.peters.senate.gov',contact:'https://www.peters.senate.gov/contact/'},
        {name:'Elissa Slotkin',party:'D',phone:'(202) 224-4822',website:'https://www.slotkin.senate.gov',contact:'https://www.slotkin.senate.gov/contact/'}
    ],
    MN: [
        {name:'Amy Klobuchar',party:'D',phone:'(202) 224-3244',website:'https://www.klobuchar.senate.gov',contact:'https://www.klobuchar.senate.gov/contact/'},
        {name:'Tina Smith',party:'D',phone:'(202) 224-5641',website:'https://www.smith.senate.gov',contact:'https://www.smith.senate.gov/contact/'}
    ],
    MS: [
        {name:'Roger Wicker',party:'R',phone:'(202) 224-6253',website:'https://www.wicker.senate.gov',contact:'https://www.wicker.senate.gov/contact/'},
        {name:'Cindy Hyde-Smith',party:'R',phone:'(202) 224-5054',website:'https://www.hydesmith.senate.gov',contact:'https://www.hydesmith.senate.gov/contact/'}
    ],
    MO: [
        {name:'Josh Hawley',party:'R',phone:'(202) 224-6154',website:'https://www.hawley.senate.gov',contact:'https://www.hawley.senate.gov/contact/'},
        {name:'Eric Schmitt',party:'R',phone:'(202) 224-5721',website:'https://www.schmitt.senate.gov',contact:'https://www.schmitt.senate.gov/contact/'}
    ],
    MT: [
        {name:'Steve Daines',party:'R',phone:'(202) 224-2651',website:'https://www.daines.senate.gov',contact:'https://www.daines.senate.gov/contact/'},
        {name:'Tim Sheehy',party:'R',phone:'(202) 224-2644',website:'https://www.sheehy.senate.gov',contact:'https://www.sheehy.senate.gov/contact/'}
    ],
    NE: [
        {name:'Deb Fischer',party:'R',phone:'(202) 224-6551',website:'https://www.fischer.senate.gov',contact:'https://www.fischer.senate.gov/contact/'},
        {name:'Pete Ricketts',party:'R',phone:'(202) 224-4224',website:'https://www.ricketts.senate.gov',contact:'https://www.ricketts.senate.gov/contact/'}
    ],
    NV: [
        {name:'Catherine Cortez Masto',party:'D',phone:'(202) 224-3542',website:'https://www.cortezmasto.senate.gov',contact:'https://www.cortezmasto.senate.gov/contact/'},
        {name:'Jacky Rosen',party:'D',phone:'(202) 224-6244',website:'https://www.rosen.senate.gov',contact:'https://www.rosen.senate.gov/contact/'}
    ],
    NH: [
        {name:'Jeanne Shaheen',party:'D',phone:'(202) 224-2841',website:'https://www.shaheen.senate.gov',contact:'https://www.shaheen.senate.gov/contact/'},
        {name:'Maggie Hassan',party:'D',phone:'(202) 224-3324',website:'https://www.hassan.senate.gov',contact:'https://www.hassan.senate.gov/contact/'}
    ],
    NJ: [
        {name:'Cory Booker',party:'D',phone:'(202) 224-3224',website:'https://www.booker.senate.gov',contact:'https://www.booker.senate.gov/contact/'},
        {name:'Andy Kim',party:'D',phone:'(202) 224-4744',website:'https://www.kim.senate.gov',contact:'https://www.kim.senate.gov/contact/'}
    ],
    NM: [
        {name:'Martin Heinrich',party:'D',phone:'(202) 224-5521',website:'https://www.heinrich.senate.gov',contact:'https://www.heinrich.senate.gov/contact/'},
        {name:'Ben Ray Lujan',party:'D',phone:'(202) 224-6621',website:'https://www.lujan.senate.gov',contact:'https://www.lujan.senate.gov/contact/'}
    ],
    NY: [
        {name:'Chuck Schumer',party:'D',phone:'(202) 224-6542',website:'https://www.schumer.senate.gov',contact:'https://www.schumer.senate.gov/contact/'},
        {name:'Kirsten Gillibrand',party:'D',phone:'(202) 224-4451',website:'https://www.gillibrand.senate.gov',contact:'https://www.gillibrand.senate.gov/contact/'}
    ],
    NC: [
        {name:'Thom Tillis',party:'R',phone:'(202) 224-6342',website:'https://www.tillis.senate.gov',contact:'https://www.tillis.senate.gov/contact/'},
        {name:'Ted Budd',party:'R',phone:'(202) 224-3154',website:'https://www.budd.senate.gov',contact:'https://www.budd.senate.gov/contact/'}
    ],
    ND: [
        {name:'John Hoeven',party:'R',phone:'(202) 224-2551',website:'https://www.hoeven.senate.gov',contact:'https://www.hoeven.senate.gov/contact/'},
        {name:'Kevin Cramer',party:'R',phone:'(202) 224-2043',website:'https://www.cramer.senate.gov',contact:'https://www.cramer.senate.gov/contact/'}
    ],
    OH: [
        {name:'Sherrod Brown',party:'D',phone:'(202) 224-2315',website:'https://www.brown.senate.gov',contact:'https://www.brown.senate.gov/contact/'},
        {name:'Bernie Moreno',party:'R',phone:'(202) 224-3353',website:'https://www.moreno.senate.gov',contact:'https://www.moreno.senate.gov/contact/'}
    ],
    OK: [
        {name:'James Lankford',party:'R',phone:'(202) 224-5754',website:'https://www.lankford.senate.gov',contact:'https://www.lankford.senate.gov/contact/'},
        {name:'Markwayne Mullin',party:'R',phone:'(202) 224-4721',website:'https://www.mullin.senate.gov',contact:'https://www.mullin.senate.gov/contact/'}
    ],
    OR: [
        {name:'Ron Wyden',party:'D',phone:'(202) 224-5244',website:'https://www.wyden.senate.gov',contact:'https://www.wyden.senate.gov/contact/'},
        {name:'Jeff Merkley',party:'D',phone:'(202) 224-3753',website:'https://www.merkley.senate.gov',contact:'https://www.merkley.senate.gov/contact/'}
    ],
    PA: [
        {name:'Bob Casey',party:'D',phone:'(202) 224-6324',website:'https://www.casey.senate.gov',contact:'https://www.casey.senate.gov/contact/'},
        {name:'Dave McCormick',party:'R',phone:'(202) 224-4254',website:'https://www.mccormick.senate.gov',contact:'https://www.mccormick.senate.gov/contact/'}
    ],
    RI: [
        {name:'Jack Reed',party:'D',phone:'(202) 224-4642',website:'https://www.reed.senate.gov',contact:'https://www.reed.senate.gov/contact/'},
        {name:'Sheldon Whitehouse',party:'D',phone:'(202) 224-2921',website:'https://www.whitehouse.senate.gov',contact:'https://www.whitehouse.senate.gov/contact/'}
    ],
    SC: [
        {name:'Lindsey Graham',party:'R',phone:'(202) 224-5972',website:'https://www.lgraham.senate.gov',contact:'https://www.lgraham.senate.gov/contact/'},
        {name:'Tim Scott',party:'R',phone:'(202) 224-6121',website:'https://www.scott.senate.gov',contact:'https://www.scott.senate.gov/contact/'}
    ],
    SD: [
        {name:'John Thune',party:'R',phone:'(202) 224-2321',website:'https://www.thune.senate.gov',contact:'https://www.thune.senate.gov/contact/'},
        {name:'Mike Rounds',party:'R',phone:'(202) 224-5842',website:'https://www.rounds.senate.gov',contact:'https://www.rounds.senate.gov/contact/'}
    ],
    TN: [
        {name:'Marsha Blackburn',party:'R',phone:'(202) 224-3344',website:'https://www.blackburn.senate.gov',contact:'https://www.blackburn.senate.gov/contact/'},
        {name:'Bill Hagerty',party:'R',phone:'(202) 224-4944',website:'https://www.hagerty.senate.gov',contact:'https://www.hagerty.senate.gov/contact/'}
    ],
    TX: [
        {name:'John Cornyn',party:'R',phone:'(202) 224-2934',website:'https://www.cornyn.senate.gov',contact:'https://www.cornyn.senate.gov/contact/'},
        {name:'Ted Cruz',party:'R',phone:'(202) 224-5922',website:'https://www.cruz.senate.gov',contact:'https://www.cruz.senate.gov/contact/'}
    ],
    UT: [
        {name:'Mike Lee',party:'R',phone:'(202) 224-5444',website:'https://www.lee.senate.gov',contact:'https://www.lee.senate.gov/contact/'},
        {name:'John Curtis',party:'R',phone:'(202) 224-5251',website:'https://www.curtis.senate.gov',contact:'https://www.curtis.senate.gov/contact/'}
    ],
    VT: [
        {name:'Patrick Leahy',party:'D',phone:'(202) 224-4242',website:'https://www.leahy.senate.gov',contact:'https://www.leahy.senate.gov/contact/'},
        {name:'Bernie Sanders',party:'I',phone:'(202) 224-5141',website:'https://www.sanders.senate.gov',contact:'https://www.sanders.senate.gov/contact/'}
    ],
    VA: [
        {name:'Mark Warner',party:'D',phone:'(202) 224-2023',website:'https://www.warner.senate.gov',contact:'https://www.warner.senate.gov/contact/'},
        {name:'Tim Kaine',party:'D',phone:'(202) 224-4024',website:'https://www.kaine.senate.gov',contact:'https://www.kaine.senate.gov/contact/'}
    ],
    WA: [
        {name:'Patty Murray',party:'D',phone:'(202) 224-2621',website:'https://www.murray.senate.gov',contact:'https://www.murray.senate.gov/contact/'},
        {name:'Maria Cantwell',party:'D',phone:'(202) 224-3441',website:'https://www.cantwell.senate.gov',contact:'https://www.cantwell.senate.gov/contact/'}
    ],
    WV: [
        {name:'Shelley Moore Capito',party:'R',phone:'(202) 224-6472',website:'https://www.capito.senate.gov',contact:'https://www.capito.senate.gov/contact/'},
        {name:'Jim Justice',party:'R',phone:'(202) 224-3954',website:'https://www.justice.senate.gov',contact:'https://www.justice.senate.gov/contact/'}
    ],
    WI: [
        {name:'Ron Johnson',party:'R',phone:'(202) 224-5323',website:'https://www.ronjohnson.senate.gov',contact:'https://www.ronjohnson.senate.gov/contact/'},
        {name:'Tammy Baldwin',party:'D',phone:'(202) 224-5653',website:'https://www.baldwin.senate.gov',contact:'https://www.baldwin.senate.gov/contact/'}
    ],
    WY: [
        {name:'John Barrasso',party:'R',phone:'(202) 224-6441',website:'https://www.barrasso.senate.gov',contact:'https://www.barrasso.senate.gov/contact/'},
        {name:'Cynthia Lummis',party:'R',phone:'(202) 224-3424',website:'https://www.lummis.senate.gov',contact:'https://www.lummis.senate.gov/contact/'}
    ]
};

// ─── LETTER TEMPLATES (Mad Libs style) ───
const TEMPLATES = {
    healthcare: {
        icon: '🏥',
        label: 'Healthcare',
        fields: [
            {id:'yourName', label:'Your Full Name', placeholder:'Jane Doe', type:'text'},
            {id:'city', label:'Your City', placeholder:'Springfield', type:'text'},
            {id:'state', label:'Your State', placeholder:'(auto-filled)', type:'text'},
            {id:'healthIssue', label:'Healthcare Issue', placeholder:'e.g., prescription drug costs, insurance coverage', type:'text'},
            {id:'personalStory', label:'A Brief Personal Story', placeholder:'e.g., My family has struggled with...', type:'textarea'},
            {id:'specificAsk', label:'What You Want Them To Do', placeholder:'e.g., support the Affordable Prescriptions Act', type:'text'}
        ],
        template: `Dear [REP_TITLE] [REP_NAME],

My name is [yourName], and I am a constituent from [city], [state]. I am writing to you today about an issue that directly affects me and my community: [healthIssue].

[personalStory]

Healthcare is not a partisan issue — it is a human issue. I respectfully urge you to [specificAsk].

Your constituents are counting on you to act. I look forward to your response and to seeing meaningful action on this critical matter.

Sincerely,
[yourName]
[city], [state]`
    },
    education: {
        icon: '📚',
        label: 'Education',
        fields: [
            {id:'yourName', label:'Your Full Name', placeholder:'Jane Doe', type:'text'},
            {id:'city', label:'Your City', placeholder:'Springfield', type:'text'},
            {id:'state', label:'Your State', placeholder:'(auto-filled)', type:'text'},
            {id:'eduIssue', label:'Education Issue', placeholder:'e.g., school funding, student loans, teacher pay', type:'text'},
            {id:'personalStory', label:'A Brief Personal Story', placeholder:'e.g., As a parent of two school-age children...', type:'textarea'},
            {id:'specificAsk', label:'What You Want Them To Do', placeholder:'e.g., vote to increase Title I funding', type:'text'}
        ],
        template: `Dear [REP_TITLE] [REP_NAME],

My name is [yourName], and I am writing from [city], [state] to share my concerns about [eduIssue].

[personalStory]

Education is the foundation of our democracy and our economy. I urge you to [specificAsk]. Our children and our future depend on it.

Thank you for your time and service. I hope to see action on this important matter.

Respectfully,
[yourName]
[city], [state]`
    },
    environment: {
        icon: '🌍',
        label: 'Environment',
        fields: [
            {id:'yourName', label:'Your Full Name', placeholder:'Jane Doe', type:'text'},
            {id:'city', label:'Your City', placeholder:'Springfield', type:'text'},
            {id:'state', label:'Your State', placeholder:'(auto-filled)', type:'text'},
            {id:'envIssue', label:'Environmental Issue', placeholder:'e.g., clean water, climate policy, air quality', type:'text'},
            {id:'personalStory', label:'A Brief Personal Story', placeholder:'e.g., In my community, we have seen...', type:'textarea'},
            {id:'specificAsk', label:'What You Want Them To Do', placeholder:'e.g., co-sponsor the Clean Water Act amendment', type:'text'}
        ],
        template: `Dear [REP_TITLE] [REP_NAME],

I am [yourName] from [city], [state]. I am reaching out because I am deeply concerned about [envIssue].

[personalStory]

We have a responsibility to protect our environment for current and future generations. I strongly urge you to [specificAsk].

The health of our communities and our planet cannot wait. Thank you for your consideration.

With respect,
[yourName]
[city], [state]`
    },
    economy: {
        icon: '💼',
        label: 'Economy & Jobs',
        fields: [
            {id:'yourName', label:'Your Full Name', placeholder:'Jane Doe', type:'text'},
            {id:'city', label:'Your City', placeholder:'Springfield', type:'text'},
            {id:'state', label:'Your State', placeholder:'(auto-filled)', type:'text'},
            {id:'econIssue', label:'Economic Issue', placeholder:'e.g., minimum wage, job creation, cost of living', type:'text'},
            {id:'personalStory', label:'A Brief Personal Story', placeholder:'e.g., As a small business owner...', type:'textarea'},
            {id:'specificAsk', label:'What You Want Them To Do', placeholder:'e.g., support the Working Families Tax Credit', type:'text'}
        ],
        template: `Dear [REP_TITLE] [REP_NAME],

My name is [yourName], and I am a resident of [city], [state]. I am writing because [econIssue] is an issue that impacts my daily life and the lives of many in our community.

[personalStory]

A strong economy works for everyone, not just a few. I respectfully ask that you [specificAsk].

I trust you will represent the economic interests of your constituents. Thank you for your service.

Sincerely,
[yourName]
[city], [state]`
    },
    infrastructure: {
        icon: '🏗️',
        label: 'Infrastructure',
        fields: [
            {id:'yourName', label:'Your Full Name', placeholder:'Jane Doe', type:'text'},
            {id:'city', label:'Your City', placeholder:'Springfield', type:'text'},
            {id:'state', label:'Your State', placeholder:'(auto-filled)', type:'text'},
            {id:'infraIssue', label:'Infrastructure Issue', placeholder:'e.g., road conditions, broadband, public transit', type:'text'},
            {id:'personalStory', label:'A Brief Personal Story', placeholder:'e.g., The roads in our county are...', type:'textarea'},
            {id:'specificAsk', label:'What You Want Them To Do', placeholder:'e.g., allocate funding for rural broadband expansion', type:'text'}
        ],
        template: `Dear [REP_TITLE] [REP_NAME],

I am [yourName], writing from [city], [state] about an infrastructure issue that requires your attention: [infraIssue].

[personalStory]

Strong infrastructure is the backbone of a strong nation. I urge you to [specificAsk] and invest in the future of our community.

Thank you for listening to your constituents.

Best regards,
[yourName]
[city], [state]`
    },
    rights: {
        icon: '⚖️',
        label: 'Civil Rights',
        fields: [
            {id:'yourName', label:'Your Full Name', placeholder:'Jane Doe', type:'text'},
            {id:'city', label:'Your City', placeholder:'Springfield', type:'text'},
            {id:'state', label:'Your State', placeholder:'(auto-filled)', type:'text'},
            {id:'rightsIssue', label:'Civil Rights Issue', placeholder:'e.g., voting rights, equality, discrimination', type:'text'},
            {id:'personalStory', label:'A Brief Personal Story', placeholder:'e.g., I have witnessed firsthand...', type:'textarea'},
            {id:'specificAsk', label:'What You Want Them To Do', placeholder:'e.g., support the Voting Rights Advancement Act', type:'text'}
        ],
        template: `Dear [REP_TITLE] [REP_NAME],

My name is [yourName], and I am a proud resident of [city], [state]. I write to you today regarding a matter of fundamental importance: [rightsIssue].

[personalStory]

The promise of America is liberty and justice for all. I urge you to uphold that promise and [specificAsk].

History is watching. Thank you for your attention to this critical issue.

Respectfully,
[yourName]
[city], [state]`
    },
    technology: {
        icon: '💻',
        label: 'Tech & Privacy',
        fields: [
            {id:'yourName', label:'Your Full Name', placeholder:'Jane Doe', type:'text'},
            {id:'city', label:'Your City', placeholder:'Springfield', type:'text'},
            {id:'state', label:'Your State', placeholder:'(auto-filled)', type:'text'},
            {id:'techIssue', label:'Technology/Privacy Issue', placeholder:'e.g., data privacy, AI regulation, net neutrality', type:'text'},
            {id:'personalStory', label:'A Brief Personal Story', placeholder:'e.g., As someone who works in technology...', type:'textarea'},
            {id:'specificAsk', label:'What You Want Them To Do', placeholder:'e.g., support comprehensive data privacy legislation', type:'text'}
        ],
        template: `Dear [REP_TITLE] [REP_NAME],

I am [yourName] from [city], [state]. I am writing to express my concerns about [techIssue].

[personalStory]

Technology shapes every aspect of modern life. We need thoughtful legislation that protects citizens while fostering innovation. I urge you to [specificAsk].

Thank you for taking the time to consider this important issue.

Sincerely,
[yourName]
[city], [state]`
    },
    custom: {
        icon: '✉️',
        label: 'Custom Letter',
        fields: [
            {id:'yourName', label:'Your Full Name', placeholder:'Jane Doe', type:'text'},
            {id:'city', label:'Your City', placeholder:'Springfield', type:'text'},
            {id:'state', label:'Your State', placeholder:'(auto-filled)', type:'text'},
            {id:'subject', label:'Subject', placeholder:'e.g., Issue that matters to you', type:'text'},
            {id:'paragraph1', label:'Opening — Introduce Yourself & Your Issue', placeholder:'I am writing because...', type:'textarea'},
            {id:'paragraph2', label:'Body — Your Story & Evidence', placeholder:'This issue affects me because...', type:'textarea'},
            {id:'specificAsk', label:'Your Specific Request', placeholder:'I ask that you...', type:'text'}
        ],
        template: `Dear [REP_TITLE] [REP_NAME],

My name is [yourName], and I am a constituent from [city], [state]. I am writing regarding: [subject].

[paragraph1]

[paragraph2]

I respectfully request that you [specificAsk]. I look forward to your response.

Sincerely,
[yourName]
[city], [state]`
    }
};

// ─── ACHIEVEMENTS ───
const ACHIEVEMENTS = [
    {id:'first_letter', icon:'📨', name:'First Letter', desc:'Send your first letter', check: s => s.letters >= 1},
    {id:'five_letters', icon:'📬', name:'Pen Pal', desc:'Send 5 letters', check: s => s.letters >= 5},
    {id:'ten_letters', icon:'🏆', name:'Dedicated Citizen', desc:'Send 10 letters', check: s => s.letters >= 10},
    {id:'twentyfive_letters', icon:'⭐', name:'Democracy Champion', desc:'Send 25 letters', check: s => s.letters >= 25},
    {id:'both_senators', icon:'🤝', name:'Both Sides', desc:'Write to both senators', check: s => s.senatorCount >= 2},
    {id:'multi_topic', icon:'📋', name:'Well Rounded', desc:'Use 3 different templates', check: s => s.topicsUsed >= 3},
    {id:'all_topics', icon:'🎓', name:'Policy Expert', desc:'Use all letter templates', check: s => s.topicsUsed >= Object.keys(TEMPLATES).length},
    {id:'streak_3', icon:'🔥', name:'On Fire', desc:'3 day streak', check: s => s.streak >= 3},
    {id:'streak_7', icon:'💪', name:'Unstoppable', desc:'7 day streak', check: s => s.streak >= 7},
    {id:'multi_state', icon:'🗺️', name:'Nationwide', desc:'Look up reps in 3+ states', check: s => s.statesSearched >= 3},
    {id:'level5', icon:'🎖️', name:'Civic Leader', desc:'Reach Level 5', check: s => s.level >= 5},
    {id:'century', icon:'💯', name:'Century Club', desc:'Earn 100 points', check: s => s.points >= 100}
];

const LEVEL_TITLES = [
    'Concerned Citizen',     // 1
    'Active Voter',          // 2
    'Community Voice',       // 3
    'Civic Advocate',        // 4
    'Democracy Defender',    // 5
    'Legislative Liaison',   // 6
    'Capitol Correspondent', // 7
    'Senatorial Scribe',     // 8
    'Congressional Champion',// 9
    'Founding Father/Mother'  // 10
];

// ─── APP STATE ───
let currentState = null;
let currentZip = '';
let currentRep = null;
let currentTopic = null;

// ─── SEED LEADERBOARD DATA ───
function getSeededScores() {
    const seed = {
        CA:320, TX:290, FL:250, NY:240, PA:180, IL:170, OH:160, GA:150,
        NC:140, MI:130, NJ:120, VA:115, WA:110, AZ:105, MA:100,
        TN:95, IN:90, MO:85, MD:82, WI:80, CO:78, MN:75, SC:70,
        AL:68, LA:65, KY:62, OR:60, OK:58, CT:55, UT:50, IA:48,
        NV:45, AR:42, MS:40, KS:38, NM:35, NE:32, ID:30, WV:28,
        HI:25, NH:24, ME:22, MT:20, RI:18, DE:16, SD:14, ND:12,
        AK:10, VT:8, WY:6
    };
    return seed;
}

function loadUserData() {
    const raw = localStorage.getItem('ltc_user');
    if (raw) return JSON.parse(raw);
    return {
        letters: 0,
        points: 0,
        streak: 0,
        lastDate: null,
        senatorCount: 0,
        senatorsWritten: [],
        topicsUsed: 0,
        topicsList: [],
        statesSearched: 0,
        statesList: [],
        level: 1,
        achievements: [],
        statePoints: {}
    };
}

function saveUserData(data) {
    localStorage.setItem('ltc_user', JSON.stringify(data));
}

function loadLeaderboard() {
    const raw = localStorage.getItem('ltc_leaderboard');
    if (raw) return JSON.parse(raw);
    return getSeededScores();
}

function saveLeaderboard(lb) {
    localStorage.setItem('ltc_leaderboard', JSON.stringify(lb));
}

// ─── ZIP LOOKUP ───
function zipToState(zip) {
    const prefix = zip.substring(0, 3);
    return ZIP3[prefix] || null;
}

function lookupZip() {
    const input = document.getElementById('heroZip');
    const zip = input.value.trim();
    if (!/^\d{5}$/.test(zip)) {
        showToast('Please enter a valid 5-digit ZIP code', 'error');
        input.focus();
        return;
    }
    const stAbbr = zipToState(zip);
    if (!stAbbr || !SENATORS[stAbbr]) {
        showToast('Could not find representatives for this ZIP code. Try another.', 'error');
        return;
    }
    currentState = stAbbr;
    currentZip = zip;

    // Track states searched
    const user = loadUserData();
    if (!user.statesList.includes(stAbbr)) {
        user.statesList.push(stAbbr);
        user.statesSearched = user.statesList.length;
        saveUserData(user);
    }

    showResults(stAbbr, zip);
    document.getElementById('results-section').scrollIntoView({behavior: 'smooth'});
}

// ─── SHOW RESULTS ───
function showResults(stAbbr, zip) {
    const section = document.getElementById('results-section');
    section.classList.remove('hidden');
    document.getElementById('resultsStateName').textContent = STATES[stAbbr];
    document.getElementById('resultsZip').textContent = zip;

    const container = document.getElementById('rep-cards');
    container.innerHTML = '';

    const senators = SENATORS[stAbbr] || [];
    senators.forEach((sen, i) => {
        const partyClass = sen.party === 'D' ? 'dem' : sen.party === 'R' ? 'rep' : 'ind';
        const partyFull = sen.party === 'D' ? 'Democrat' : sen.party === 'R' ? 'Republican' : 'Independent';
        const initials = sen.name.split(' ').map(n => n[0]).join('');
        const card = document.createElement('div');
        card.className = 'rep-card';
        card.innerHTML = `
            <div class="rep-card-header">
                <div class="rep-avatar ${partyClass}">${initials}</div>
                <div class="rep-info">
                    <h3>${sen.name}</h3>
                    <div class="rep-title">
                        <span>U.S. Senator</span>
                        <span class="party-badge ${partyClass}">${partyFull}</span>
                    </div>
                </div>
            </div>
            <div class="rep-card-body">
                <div class="rep-contact-row">📞 <a href="tel:${sen.phone}">${sen.phone}</a></div>
                <div class="rep-contact-row">🌐 <a href="${sen.website}" target="_blank" rel="noopener">Official Website</a></div>
                <div class="rep-contact-row">✉️ <a href="${sen.contact}" target="_blank" rel="noopener">Contact Form</a></div>
            </div>
            <div class="rep-card-footer">
                <button class="btn-write-letter" onclick="app.startLetter(${i}, 'senator')">
                    ✍️ <span>Write a Letter</span>
                </button>
            </div>
        `;
        container.appendChild(card);
    });

    // Add House rep lookup card
    const houseCard = document.createElement('div');
    houseCard.className = 'rep-card';
    houseCard.innerHTML = `
        <div class="rep-card-header">
            <div class="rep-avatar" style="background:#6b7280;font-size:1.4rem;">🏛️</div>
            <div class="rep-info">
                <h3>Your House Representative</h3>
                <div class="rep-title">
                    <span>U.S. House of Representatives</span>
                </div>
            </div>
        </div>
        <div class="rep-card-body">
            <div class="rep-contact-row">📞 <strong>Capitol Switchboard:</strong> <a href="tel:2022243121">(202) 224-3121</a></div>
            <div class="rep-contact-row">🔍 <a href="https://www.house.gov/representatives/find-your-representative" target="_blank" rel="noopener">Find your exact Representative on House.gov</a></div>
            <p style="font-size:0.82rem;color:#666;margin-top:8px;">ZIP codes can span multiple congressional districts. Use the link above to find your specific House member, then use the Custom Letter template to write to them.</p>
        </div>
    `;
    container.appendChild(houseCard);
}

// ─── LETTER BUILDER ───
function startLetter(repIndex, repType) {
    const section = document.getElementById('letter-builder');
    section.classList.remove('hidden');

    const senators = SENATORS[currentState] || [];
    currentRep = senators[repIndex];
    document.getElementById('letterRecipient').textContent = `Senator ${currentRep.name} (${STATES[currentState]})`;

    // Reset
    currentTopic = null;
    document.getElementById('madlibsForm').classList.add('hidden');
    document.getElementById('letterPreview').classList.add('hidden');

    // Build topic buttons
    const topicContainer = document.getElementById('topicButtons');
    topicContainer.innerHTML = '';
    for (const [key, tmpl] of Object.entries(TEMPLATES)) {
        const btn = document.createElement('button');
        btn.className = 'topic-btn';
        btn.textContent = `${tmpl.icon} ${tmpl.label}`;
        btn.onclick = () => selectTopic(key);
        topicContainer.appendChild(btn);
    }

    section.scrollIntoView({behavior: 'smooth'});
}

function selectTopic(topicKey) {
    currentTopic = topicKey;
    const tmpl = TEMPLATES[topicKey];

    // Highlight active button
    document.querySelectorAll('.topic-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');

    // Build form
    const form = document.getElementById('madlibsForm');
    form.classList.remove('hidden');
    form.innerHTML = `<h3>${tmpl.icon} ${tmpl.label} — Fill in the Blanks</h3>`;

    tmpl.fields.forEach(f => {
        const div = document.createElement('div');
        div.className = 'madlib-field';
        const label = document.createElement('label');
        label.setAttribute('for', `ml_${f.id}`);
        label.textContent = f.label;
        div.appendChild(label);

        if (f.type === 'textarea') {
            const ta = document.createElement('textarea');
            ta.id = `ml_${f.id}`;
            ta.rows = 3;
            ta.placeholder = f.placeholder;
            div.appendChild(ta);
        } else {
            const inp = document.createElement('input');
            inp.type = 'text';
            inp.id = `ml_${f.id}`;
            inp.placeholder = f.placeholder;
            // Auto-fill state
            if (f.id === 'state') inp.value = STATES[currentState] || '';
            div.appendChild(inp);
        }
        form.appendChild(div);
    });

    // Generate button
    const submitDiv = document.createElement('div');
    submitDiv.className = 'madlibs-submit';
    submitDiv.innerHTML = `<button class="btn btn-generate" onclick="app.generateLetter()">✨ Generate Letter</button>`;
    form.appendChild(submitDiv);

    document.getElementById('letterPreview').classList.add('hidden');
}

function generateLetter() {
    const tmpl = TEMPLATES[currentTopic];
    let text = tmpl.template;

    // Replace rep placeholders
    text = text.replace(/\[REP_TITLE\]/g, 'Senator');
    text = text.replace(/\[REP_NAME\]/g, currentRep.name);

    // Replace field placeholders
    let allFilled = true;
    tmpl.fields.forEach(f => {
        const el = document.getElementById(`ml_${f.id}`);
        const val = el ? el.value.trim() : '';
        if (!val) allFilled = false;
        const highlighted = val || `[${f.label}]`;
        text = text.replace(new RegExp(`\\[${f.id}\\]`, 'g'), highlighted);
    });

    if (!allFilled) {
        showToast('Please fill in all fields to generate your letter', 'error');
        return;
    }

    // Show preview
    const preview = document.getElementById('letterPreview');
    preview.classList.remove('hidden');

    // Format with highlights
    const letterDiv = document.getElementById('letterContent');
    letterDiv.textContent = text;

    preview.scrollIntoView({behavior: 'smooth'});
}

function getLetterText() {
    return document.getElementById('letterContent').textContent;
}

function sendViaEmail() {
    const text = getLetterText();
    const subject = `Letter from a Constituent — ${STATES[currentState]}`;
    const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
    window.open(mailto, '_blank');
    showToast('Opening your email client...', 'success');
}

function copyLetter() {
    const text = getLetterText();
    navigator.clipboard.writeText(text).then(() => {
        showToast('Letter copied to clipboard!', 'success');
    }).catch(() => {
        // Fallback
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast('Letter copied to clipboard!', 'success');
    });
}

function printLetter() {
    const text = getLetterText();
    const w = window.open('', '_blank');
    w.document.write(`
        <html><head><title>Letter to Senator ${currentRep.name}</title>
        <style>body{font-family:Georgia,serif;max-width:700px;margin:40px auto;padding:20px;line-height:1.8;font-size:14px;color:#222;}
        .header{border-bottom:3px double #333;padding-bottom:10px;margin-bottom:30px;text-align:center;font-size:12px;color:#666;}
        .footer{border-top:1px solid #ccc;padding-top:10px;margin-top:30px;font-size:11px;color:#999;text-align:center;}</style>
        </head><body>
        <div class="header">CONSTITUENT LETTER — ${STATES[currentState]}</div>
        <pre style="white-space:pre-wrap;font-family:Georgia,serif;">${text}</pre>
        <div class="footer">Generated with Letter to Congress — an independent civic engagement tool</div>
        </body></html>
    `);
    w.document.close();
    w.print();
}

function claimPoints() {
    if (!currentState) return;

    const user = loadUserData();
    const lb = loadLeaderboard();

    // Update leaderboard
    lb[currentState] = (lb[currentState] || 0) + 10;
    saveLeaderboard(lb);

    // Update user data
    user.letters += 1;
    user.points += 10;
    user.statePoints[currentState] = (user.statePoints[currentState] || 0) + 10;

    // Track senator
    if (currentRep && !user.senatorsWritten.includes(currentRep.name)) {
        user.senatorsWritten.push(currentRep.name);
        user.senatorCount = user.senatorsWritten.length;
    }

    // Track topic
    if (currentTopic && !user.topicsList.includes(currentTopic)) {
        user.topicsList.push(currentTopic);
        user.topicsUsed = user.topicsList.length;
    }

    // Streak
    const today = new Date().toISOString().slice(0, 10);
    if (user.lastDate) {
        const last = new Date(user.lastDate);
        const diff = Math.floor((new Date(today) - last) / 86400000);
        if (diff === 1) {
            user.streak += 1;
        } else if (diff > 1) {
            user.streak = 1;
        }
    } else {
        user.streak = 1;
    }
    user.lastDate = today;

    // Level up check
    const oldLevel = user.level;
    user.level = Math.min(10, Math.floor(user.points / 30) + 1);

    saveUserData(user);

    // Show points popup
    showPointsPopup(currentState);

    // Confetti!
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 80,
            spread: 70,
            origin: {y: 0.6},
            colors: ['#c9a84c', '#1a2744', '#b22234', '#ffffff']
        });
    }

    // Level up modal
    if (user.level > oldLevel) {
        setTimeout(() => showLevelUp(user.level), 1500);
    }

    // Check new achievements
    checkAchievements(user);

    // Update all displays
    updateUI();
    renderLeaderboard('top');
    renderMap();

    showToast(`+10 points for ${STATES[currentState]}! Total: ${user.points} pts`, 'success');
}

// ─── POINTS POPUP ───
function showPointsPopup(stAbbr) {
    const popup = document.getElementById('points-popup');
    document.getElementById('pointsStateName').textContent = STATES[stAbbr];
    popup.classList.remove('hidden');
    setTimeout(() => popup.classList.add('hidden'), 2000);
}

// ─── LEVEL UP ───
function showLevelUp(level) {
    const modal = document.getElementById('levelup-modal');
    document.getElementById('newLevel').textContent = level;
    document.getElementById('levelTitle').textContent = LEVEL_TITLES[level - 1] || 'Supreme Citizen';
    modal.classList.remove('hidden');

    if (typeof confetti === 'function') {
        confetti({particleCount: 150, spread: 100, origin: {y: 0.5}});
    }
}

function closeLevelUp() {
    document.getElementById('levelup-modal').classList.add('hidden');
}

// ─── ACHIEVEMENTS ───
function checkAchievements(user) {
    const stats = {
        letters: user.letters,
        points: user.points,
        streak: user.streak,
        senatorCount: user.senatorCount,
        topicsUsed: user.topicsUsed,
        statesSearched: user.statesSearched,
        level: user.level
    };

    ACHIEVEMENTS.forEach(ach => {
        if (!user.achievements.includes(ach.id) && ach.check(stats)) {
            user.achievements.push(ach.id);
            saveUserData(user);
            setTimeout(() => {
                showToast(`🏅 Achievement Unlocked: ${ach.name}!`, 'achievement');
            }, 800);
        }
    });
}

function renderAchievements() {
    const user = loadUserData();
    const grid = document.getElementById('achievements-grid');
    grid.innerHTML = '';

    ACHIEVEMENTS.forEach(ach => {
        const unlocked = user.achievements.includes(ach.id);
        const card = document.createElement('div');
        card.className = `achievement-card ${unlocked ? 'unlocked' : 'locked'}`;
        card.innerHTML = `
            ${unlocked ? '<div class="ach-check">✅</div>' : ''}
            <div class="ach-icon">${ach.icon}</div>
            <div class="ach-name">${ach.name}</div>
            <div class="ach-desc">${ach.desc}</div>
        `;
        grid.appendChild(card);
    });
}

// ─── TOAST ───
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icons = {success: '✅', error: '❌', achievement: '🏅', info: 'ℹ️'};
    toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span> ${message}`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(40px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// ─── LEADERBOARD ───
function showLeaderboard(tab) {
    document.querySelectorAll('.lb-tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    renderLeaderboard(tab);
}

function renderLeaderboard(mode = 'top') {
    const lb = loadLeaderboard();
    const user = loadUserData();
    const list = document.getElementById('leaderboard-list');
    list.innerHTML = '';

    let entries = Object.entries(lb).sort((a, b) => b[1] - a[1]);
    const maxScore = entries.length > 0 ? entries[0][1] : 1;

    if (mode === 'top') {
        entries = entries.slice(0, 10);
    } else if (mode === 'you' && currentState) {
        // Show user's state + surrounding states
        const idx = entries.findIndex(e => e[0] === currentState);
        const start = Math.max(0, idx - 3);
        const end = Math.min(entries.length, idx + 4);
        entries = entries.slice(start, end);
    }

    const medals = ['🥇', '🥈', '🥉'];

    entries.forEach(([st, score], i) => {
        const rank = Object.entries(lb).sort((a, b) => b[1] - a[1]).findIndex(e => e[0] === st) + 1;
        const isUser = st === currentState;
        const row = document.createElement('div');
        row.className = `lb-row ${isUser ? 'highlight' : ''}`;
        const pct = Math.max(5, (score / maxScore) * 100);
        row.innerHTML = `
            <div class="lb-rank">${rank <= 3 ? medals[rank - 1] : rank}</div>
            <div class="lb-state">${STATES[st] || st}</div>
            <div class="lb-bar-wrap"><div class="lb-bar" style="width:${pct}%"></div></div>
            <div class="lb-score">${score} pts</div>
        `;
        list.appendChild(row);
    });
}

// ─── US MAP (Tile Grid) ───
// Using a tile grid map approach for simplicity and beauty
const MAP_GRID = {
    //         col, row
    AK: [0, 0], ME: [11, 0],
    WI: [6, 1], VT: [10, 1], NH: [11, 1],
    WA: [1, 2], ID: [2, 2], MT: [3, 2], ND: [4, 2], MN: [5, 2], IL: [6, 2], MI: [7, 2], NY: [9, 2], MA: [10, 2], CT: [11, 2],
    OR: [1, 3], NV: [2, 3], WY: [3, 3], SD: [4, 3], IA: [5, 3], IN: [6, 3], OH: [7, 3], PA: [8, 3], NJ: [9, 3], RI: [10, 3],
    CA: [1, 4], UT: [2, 4], CO: [3, 4], NE: [4, 4], MO: [5, 4], KY: [6, 4], WV: [7, 4], VA: [8, 4], MD: [9, 4], DE: [10, 4],
    AZ: [2, 5], NM: [3, 5], KS: [4, 5], AR: [5, 5], TN: [6, 5], NC: [7, 5], SC: [8, 5], DC: [9, 5],
    OK: [4, 6], LA: [5, 6], MS: [6, 6], AL: [7, 6], GA: [8, 6],
    HI: [0, 7], TX: [4, 7], FL: [8, 7],
};

function renderMap() {
    const wrapper = document.getElementById('us-map');
    wrapper.innerHTML = '';

    const lb = loadLeaderboard();
    const scores = Object.values(lb);
    const maxScore = Math.max(...scores, 1);

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 520 360');
    svg.style.width = '100%';
    svg.style.height = '100%';

    const cellW = 40;
    const cellH = 40;
    const gap = 3;
    const offsetX = 5;
    const offsetY = 5;

    // Tooltip div
    let tooltip = document.querySelector('.map-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.className = 'map-tooltip';
        tooltip.style.display = 'none';
        wrapper.style.position = 'relative';
        wrapper.appendChild(tooltip);
    }

    for (const [st, [col, row]] of Object.entries(MAP_GRID)) {
        const x = offsetX + col * (cellW + gap);
        const y = offsetY + row * (cellH + gap);
        const score = lb[st] || 0;
        const intensity = score / maxScore;
        const color = scoreToColor(intensity);

        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.style.cursor = 'pointer';

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x);
        rect.setAttribute('y', y);
        rect.setAttribute('width', cellW);
        rect.setAttribute('height', cellH);
        rect.setAttribute('rx', '4');
        rect.setAttribute('fill', color);
        rect.setAttribute('stroke', st === currentState ? '#c9a84c' : 'rgba(255,255,255,0.15)');
        rect.setAttribute('stroke-width', st === currentState ? '3' : '1');

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x + cellW / 2);
        text.setAttribute('y', y + cellH / 2 + 1);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.setAttribute('fill', intensity > 0.4 ? '#fff' : 'rgba(255,255,255,0.9)');
        text.setAttribute('font-size', '11');
        text.setAttribute('font-weight', '700');
        text.setAttribute('font-family', "'Source Sans 3', sans-serif");
        text.textContent = st;

        g.appendChild(rect);
        g.appendChild(text);

        g.addEventListener('mouseenter', (e) => {
            tooltip.innerHTML = `<div class="tt-state">${STATES[st]}</div><div class="tt-score">${score} pts</div>`;
            tooltip.style.display = 'block';
        });
        g.addEventListener('mousemove', (e) => {
            const bounds = wrapper.getBoundingClientRect();
            tooltip.style.left = (e.clientX - bounds.left + 12) + 'px';
            tooltip.style.top = (e.clientY - bounds.top - 40) + 'px';
        });
        g.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
        });

        svg.appendChild(g);
    }

    wrapper.insertBefore(svg, wrapper.firstChild);
}

function scoreToColor(intensity) {
    // From dark navy to vibrant gold
    const r = Math.round(26 + intensity * (201 - 26));
    const g = Math.round(39 + intensity * (168 - 39));
    const b = Math.round(68 + intensity * (76 - 68));
    return `rgb(${r},${g},${b})`;
}

// ─── UPDATE UI ───
function updateUI() {
    const user = loadUserData();
    const lb = loadLeaderboard();
    const totalLetters = Object.values(lb).reduce((a, b) => a + b, 0) / 10;

    // Animate number changes
    animateNumber('globalLetterCount', Math.round(totalLetters));
    animateNumber('yourScore', user.points);
    animateNumber('statLetters', user.letters);
    animateNumber('statStreak', user.streak);
    animateNumber('statLevel', user.level);
    animateNumber('statStates', user.statesSearched);

    renderAchievements();
}

function animateNumber(elId, target) {
    const el = document.getElementById(elId);
    if (!el) return;
    const current = parseInt(el.textContent) || 0;
    if (current === target) { el.textContent = target; return; }
    const diff = target - current;
    const steps = Math.min(20, Math.abs(diff));
    const stepVal = diff / steps;
    let step = 0;
    const interval = setInterval(() => {
        step++;
        el.textContent = Math.round(current + stepVal * step);
        if (step >= steps) {
            el.textContent = target;
            clearInterval(interval);
        }
    }, 30);
}

// ─── ENTER KEY SUPPORT ───
function setupEvents() {
    const heroInput = document.getElementById('heroZip');
    if (heroInput) {
        heroInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') lookupZip();
        });
    }
}

// ─── INIT ───
function init() {
    setupEvents();
    updateUI();
    renderLeaderboard('top');
    renderMap();
}

document.addEventListener('DOMContentLoaded', init);

// ─── PUBLIC API ───
return {
    lookupZip,
    startLetter,
    selectTopic,
    generateLetter,
    sendViaEmail,
    copyLetter,
    printLetter,
    claimPoints,
    showLeaderboard,
    closeLevelUp,
    showToast,
};

})();
