(function(){
  var Dictionary = require('./dictionary.js').Dictionary;

  var Room = (function () {

    /**
     * コンストラクタ
     */
    function Room (name, comment, password) {
      this.name           = name;
      this.comment        = comment;
      this.password       = password;
      this.dictionary     = new Dictionary('defalut', [
                              'じょうはんしん','かはんしん','あたま','かみのけ','ひたい','こめかみ','まゆげ','まつげ','まぶた','めだま',
                              'はな','ほほ','くち','くちびる','した','みみ','みみたぶ','あご','のど','あごひげ',
                              'くちひげ','ほおひげ','もみあげ','しわ','えくぼ','ほくろ','けあな','くび','てのひら','ゆび',
                              'おやゆび','ひとさしゆび','なかゆび','くすりゆび','こゆび','つめ','うで','ひじ','てくび','こぶし',
                              'かた','むね','おっぱい','わき','おなか','こし','へそ','せなか','しり','あし',
                              'ふともも','ふくらはぎ','ひざ','すね','あしくび','つまさき','かかと','あしのうら','つちふまず','ほね',
                              'がいこつ','ずがいこつ','せぼね','ろっこつ','かんせつ','ゆびかんせつ','こつずい','けつえき','けっかん','どうみゃく',
                              'じょうみゃく','のう','ないぞう','しんぞう','はい','い','ちょう','だいちょう','しょうちょう','じゅうにしちょう',
                              'かんぞう','じんぞう','ひぞう','しきゅう','へそのお','こうもん','きんにく','ごかん','しんけい','たいりょく',
                              'こっせつ','やけど','みずぶくれ','しゅっけつ','ないしゅっけつ','あざ','だぼく','ねんざ','きず','かすりきず',
                              'かみきず','きりきず','さしきず','むしさされ','かのう','うみ','かさぶた','たんこぶ','はなぢ','むちうち',
                              'しんさつ','しんだん','しゅじゅつ','ぞうきいしょく','ゆけつ','けつえきけんさ','れんとげん','いかめら','しんでんず','くすり',
                              'しょほうせん','ちゅうしゃ','よぼうせっしゅ','わくちん','めんえき','りはびり','じょうざい','かんぼうやく','こうせいぶっしつ','あすぴりん',
                              'ちんつうざい','すいみんやく','げどくざい','しょうかやく','げざい','ざやく','せきどめ','ふくさよう','たんか','ぎぷす',
                              'まつばづえ','ほうたい','ばんそうこう','がーぜ','きゅうきゅうばこ','いぬ','おおかみ','ねこ','うま','うし',
                              'しか','ひつじ','やぎ','ぶた','うさぎ','りす','ねずみ','はむすたー','もぐら','やまあらし',
                              'たぬき','きつね','いたち','いのしし','くま','さる','ちんぱんじー','おらんうーたん','なまけもの','ごりら',
                              'とら','らいおん','ひょう','くろひょう','じゃがー','ばっふぁろー','ばいそん','ぞう','ぱんだ','さい',
                              'かば','きりん','しまうま','らくだ','ろば','となかい','らっこ','すかんく','あらいぐま','ありくい',
                              'ばく','こあら','かんがるー','あしか','せいうち','あざらし','おっとせい','かめ','わに','へび',
                              'がらがらへび','とかげ','かえる','ひきがえる','おたまじゃくし','すずめ','つばめ','にわとり','ひよこ','からす',
                              'わたりがらす','はと','きじ','つる','わし','たか','はやぶさ','ひばり','ふくろう','みみずく',
                              'かも','あひる','がちょう','らいちょう','だちょう','あほうどり','しちめんちょう','さぎ','とき','こうのとり',
                              'はくちょう','かもめ','うみねこ','おうむ','いんこ','かなりあ','かわせみ','きつつき','くじゃく','ぺんぎん',
                              'ぺりかん','ふらみんご','こうもり','かぶとむし','くわがたむし','かなぶん','とんぼ','ばった','いなご','かまきり',
                              'かみきりむし','はさみむし','あり','しろあり','はち','みつばち','すずめばち','はえ','こおろぎ','てんとうむし',
                              'さなぎ','あげはちょう','もんしろちょう','せみ','ほたる','くも','いもむし','けむし','かいこ','むかで',
                              'みのむし','ありじごく','うすばかげろう','まつむし','あめんぼ','かたつむり','なめくじ','みみず','さそり','ごきぶり',
                              'ぷらなりあ','いわし','さば','あじ','かつお','まぐろ','かれい','ひらめ','あゆ','なまず',
                              'さけ','たら','あんこう','ちょうちんあんこう','さんま','かじき','ふぐ','はりせんぼん','ししゃも','たちうお',
                              'とびうお','こばんざめ','しーらかんす','めだか','きんぎょ','でめきん','ぶらっくばす','ぴらにあ','どじょう','えい',
                              'しゃち','さめ','いるか','くじら','うなぎ','でんきうなぎ','いか','ほたるいか','だいおういか','くらげ',
                              'ひとで','なまこ','うみうし','えび','いせえび','くるまえび','かに','たらばがに','ずわいがに','けがに',
                              'ざりがに','やどかり','あさり','しじみ','ほたて','はまぐり','あわび','さざえ','むーるがい','うに',
                              'わかめ','こんぶ','さんご','いくら','かずのこ','たらこ','ねぎ','にんじん','ぴーまん','ぱぷりか',
                              'なす','じゃがいも','さつまいも','さといも','ごぼう','きゃべつ','れたす','さにーれたす','さらだな','とまと',
                              'ぷちとまと','きゅうり','へちま','とうがん','ごーや','ずっきーに','だいこん','かいわれだいこん','れんこん','かぶ',
                              'びーつ','もやし','かぼちゃ','たけのこ','はくさい','とうもろこし','せろり','にんにく','らっきょう','ちこりー',
                              'ぶろっこりー','かりふらわー','あすぱらがす','ぱせり','にら','おくら','しそ','みつば','ほうれんそう','ちんげんさい',
                              'のざわな','こまつな','くれそん','けーる','もろへいや','ばじる','ぜんまい','みょうが','みずな','とうがらし',
                              'ししとう','しょうが','わさび','さんしょう','ごま','だいず','えだまめ','くろまめ','あずき','えんどう',
                              'さやえんどう','いんげんまめ','さやいんげん','そらまめ','りょくとう','ささげ','ひよこまめ','ぐりーんぴーす','げんまい','しいたけ',
                              'えのきだけ','なめこ','きくらげ','まっしゅるーむ','とりゅふ','あがりくす','すいか','めろん','さくらんぼ','ばなな',
                              'りんご','なし','ようなし','かりん','かんきつるい','みかん','きんかん','あまなつ','ぐれーぷふるーつ','れもん',
                              'らいむ','かき','ぶどう','いちご','ぶるーべりー','いちじく','ざくろ','びわ','あけび','なつめ',
                              'きぅい','らいち','あせろら','まんごー','ぱいなっぷる','ぱぱいや','すたーふるーつ','あぼかど','ぱっしょんふるーつ','どりあん',
                              'ここなっつ','かかお','こーひーまめ','おりーぶ','くり','らっかせい','あーもんど','かしゅーなっつ','ぴすたちお','くるみ',
                              'ぎんなん','どんぐり','ざっそう','きのみ','かじつ','このは','くき','えだ','こえだ','しんめ',
                              'つぼみ','たね','きゅうこん','とげ','すみれ','きく','らん','はす','あさがお','ひるがお',
                              'ゆうがお','すずらん','すいせん','すいれん','ばしょう','ゆり','もくれん','つつじ','しゃくやく','しょうぶ',
                              'ばら','たんぽぽ','ひまわり','あじさい','さざんか','なのはな','さくら','うめ','もも','つくし',
                              'さとうきび','やしのき','じてんしゃ','さんりんしゃ','いちりんしゃ','うばぐるま','くるまいす','すけぼー','じんりきしゃ','ばしゃ',
                              'ぎっしゃ','いぬぞり','おーとばい','すのーもーびる','せぐうぇい','かーと','じどうしゃ','きゃんぴんぐかー','たくしー','ばす',
                              'ぱとかー','きゅうきゅうしゃ','しょうぼうしゃ','はしごしゃ','じょせつしゃ','れっかーしゃ','とらっく','でことら','とれーらー','とらくたー',
                              'ふぉーくりふと','しょべるかー','ぶるどーざー','くれーんしゃ','ごみしゅうしゅうしゃ','そうこうしゃ','せんしゃ','じそうほう','きしゃ','でんしゃ',
                              'でぃーぜるしゃ','ちかてつ','ものれーる','とろりーばす','けーぶるかー','ろーぷうぇい','いかだ','ぼーと','かぬー','わたしぶね',
                              'やかたぶね','よっと','じぇっとすきー','ふね','ぎょせん','がれおんせん','もーたーぼーと','ほばーくらふと','ふぇりー','たんかー',
                              'せんかん','くちくかん','じゅんようかん','せんすいかん','すいらいてい','ようりくかん','ゆそうかん','いーじすかん','こうくうぼかん','ぱらしゅーと',
                              'はんぐぐらいだー','ぱらぐらいだー','ききゅう','ひこうせん','へりこぷたー','ひこうき','ぷろぺらき','じぇっとき','せんとうき','こうげきき',
                              'ばくげきき','うちゅうろけっと','すぺーすしゃとる','うでどけい','とけい','かばん','はんどばっぐ','りゅっくさっく','さいふ','ていきいれ',
                              'はんかち','ちりがみ','かさ','めがね','こんたくとれんず','えんぴつ','いろえんぴつ','えんぴつけずり','けしごむ','しゅうせいえき',
                              'しゃーぺん','ぼーるぺん','けいこうぺん','ぺん','ふで','すみ','すずり','ぶんちん','したじき','えふで',
                              'えのぐ','のーと','めもちょう','でんぴょう','ほうがんし','とれーしんぐぺーぱー','ばいんだー','はさみ','かったー','ほっちきす',
                              'くりっぷ','わごむ','がびょう','のり','せろはんてーぷ','りょうめんてーぷ','がむてーぷ','じょうぎ','さんかくじょうぎ','ぶんどき',
                              'こんぱす','ふうとう','びんせん','はがき','きって','でんたく','ぼーる','むしき','みずきり','ざる',
                              'ちゃこし','ふるい','おろしがね','あわたてき','かわむきき','おたま','へら','ふらいがえし','めんぼう','けいりょうかっぷ',
                              'けいりょうすぷーん','はかり','たいまー','ほうちょう','まないた','やかん','ふらいぱん','ふかなべ','ひらなべ','しちゅーなべ',
                              'あつりょくなべ','なべぶた','なべつかみ','なべしき','やきあみ','かんきり','せんぬき','こなびきき','にくひきき','ろうと',
                              'えぷろん','まほうびん','すいはんき','しゃもじ','しょっき','はし','ないふ','ふぉーく','すぷーん','ちゃさじ',
                              'さら','うけざら','さらだぼーる','ちゃわん','ようき','とうじき','しっき','ぎんしょっき','ぼん','かいてんとれー',
                              'たっぱー','こっぷ','わいんぐらす','びーるじょっき','かっぷ','まぐかっぷ','てぃーかっぷ','こーひーかっぷ','なぷきん','だいふきん',
                              'てーぶるくろす','らっぷ','あるみほいる','せんざい','くれんざー','しょっきふき','さいほうばこ','はり','まちばり','はりさし',
                              'いと','ゆびぬき','たちばさみ','あみぼう','まきじゃく','みしん','あいろん','あいろんだい','のこぎり','くぎ',
                              'かなづち','しゃべる','やすり','かんな','のみ','きり','はしご','ざいもく','じゃり','れんが',
                              'せめんと','しっくい','ぺんき','にす','どらいばー','ぺんち','はんだごて','でんりゅうけい','ほうき','ちりとり',
                              'はたき','ぞうきん','たわし','ごみ','なまごみ','かねんごみ','ふねんごみ','なまごみいれ','ごみばこ','ごみぶくろ',
                              'ばけつ','かんそうざい','さっちゅうざい','はえたたき','せんめんき','せんたくせっけん','ひょうはくざい','せんたくのり','せんたくばさみ','せんたくいた',
                              'ものほしだい','ものほしざお','おむつ','せっけん','せっけんうけ','すぽんじ','へちまたわし','かるいし','ぶらし','たおる',
                              'ばすたおる','たおるかけ','しゃんぷー','とりーとめんと','すーつ','えんびふく','たきしーど','ぶれざー','べすと','わいしゃつ',
                              'ぶらうす','てぃーしゃつ','せーたー','じーんず','ずぼん','はんずぼん','すかーと','きゅろっと','とらんくす','ぶりーふ',
                              'ぶらじゃー','ふんどし','くつした','ぱじゃま','ふだんぎ','ひらふく','せいふく','かわせいひん','すえーど','けがわ',
                              'ねくたい','ねくたいぴん','まふらー','てぶくろ','すかーふ','しょーる','べると','ふぁすなー','ぼたん','うらじ',
                              'ながぐつ','くつ','くつべら','さんだる','すりっぱ','ぼうし','きゃっぷ','べれーぼう','かつら','さてん',
                              'めん','きぬ','ようもう','ないろん','りねん','ぽりえすてる','あくせさりー','ゆびわ','いやりんぐ','ほうせき',
                              'ぶれすれっと','あんくれっと','ねっくれす','ぶろーち','かふすぼたん','けしょうひん','こうすい','しょうしゅうざい','くちべに','ろーしょん',
                              'ふぁんでーしょん','おしろい','ほおべに','まにきゅあ','ますから','くし','へあぶらし','かみそり','つめきり','みみかき',
                              'しょっきだな','とだな','たんす','ようふくだんす','ひきだし','きょうだい','ほんだな','たな','てーぶる','つくえ',
                              'そふぁー','いす','こしかけいす','じゅうたん','しきもの','べっど','かけぶとん','しきぶとん','もうふ','しーつ',
                              'まくら','ゆりかご','きんこ','しょうかき','かでんせいひん','れいぞうこ','れいとうこ','おーぶん','でんしれんじ','こんろ',
                              'たくじょうこんろ','ゆわかしき','みきさー','ふーどぷろせっさー','とーすたー','こーひーめーかー','じゅーさー','しょっきあらいき','せんたくき','かんそうき',
                              'そうじき','えあこん','せんぷうき','すとーぶ','かしつき','らじお','びでおでっき','あんぷ','どらいやー','でんち',
                              'たいようでんち','でんきゅう','けいこうとう','かいちゅうでんとう','こんせんと','やね','まるやね','かわら','ばるこにー','べらんだ',
                              'えんとつ','だんろ','あまどい','ひさし','もん','げんかん','うらぐち','しきい','どあ','ろうか',
                              'ゆか','あまど','まど','まどがらす','ぶらいんど','あみど','しょうじ','ふすま','てんじょう','はしら',
                              'かいだん','やねうら','ちかしつ','ちょぞうしつ','とこのま','おしいれ','いま','しょくどう','しょさい','しんしつ',
                              'ふろ','といれ','せんめんだい','ふろおけ','じゃぐち','だいどころ','ながしだい','ちょうりだい','みずきりだい','もとせん',
                              'かんきせん','にわ','うらにわ','しばふ','いけがき','かきね','しゃこ','ものおき','いけ','にわいし',
                              'にわき','さかなや','くすりや','くりーにんぐてん','ようふくや','ぶんぼうぐてん','めがねや','ほんや','おもちゃや','びよういん',
                              'ぎんこう','こんびに','ひゃっかてん','えれべーたー','えすかれーたー','すーぱー','しょっぴんぐせんたー','いちば','れすとらん','かふぇてりあ',
                              'さかば','いざかや','さかや','やたい','ほてる','やどや','おんせん','がっこう','ようちえん','しょうがっこう',
                              'ちゅうがっこう','こうこう','だいがく','びょういん','しんりょうじょ','けいさつしょ','しょうぼうしょ','ゆうびんきょく','としょかん','こうみんかん',
                              'はくぶつかん','びじゅつかん','すいぞくかん','どうぶつえん','げきじょう','うんどうじょう','きょうぎじょう','たいいくかん','やきゅうじょう','こうえん',
                              'べんち','ふんすい','じんじゃ','じいん','きょうかい','こうしゅうといれ','こうしゅうでんわ','でんわぼっくす','じどうはんばいき','げんきんじどうしはらいき',
                              'ゆうびんぽすと','ばーべきゅー','ごはん','おにぎり','すし','のりまき','ちらしずし','いなりずし','せきはん','くりごはん',
                              'おかゆ','ぞうすい','ぞうに','ちゃづけ','さけちゃづけ','もち','みそしる','つけもの','うめぼし','とうふ',
                              'ひややっこ','ゆどうふ','こうやどうふ','ゆば','おから','あぶらあげ','あつあげ','こんにゃく','しらたき','なっとう',
                              'さしみ','かつおのたたき','まぐろのやまかけ','やきざかな','あじのしおやき','ぶりのてりやき','さばのみそに','ぶりだいこん','かれいのにつけ','ざるそば',
                              'そば','うどん','そうめん','とんかつ','かつどん','ぎゅうどん','おやこどん','うなどん','てんどん','にくじゃが',
                              'かぼちゃのにもの','ちくぜんに','やきとり','からあげ','ぶたにくのしょうがやき','てんぷら','ちゃわんむし','あさりのさかむし','あつやきたまご','かまぼこ',
                              'ちくわ','はんぺん','おこのみやき','たこやき','やきそば','すきやき','しゃぶしゃぶ','おでん','しらあえ','いんげんのごまあえ',
                              'きゅうりとわかめのすのもの','ゆでたまご','はんじゅくたまご','めだまやき','すくらんぶるえっぐ','おとしたまご','かれーらいす','ころっけ','めんちかつ','えびふらい',
                              'かきふらい','さかなふらい','すぱげってぃ','はんばーぐ','みーとぼーる','おむれつ','おむらいす','ぴらふ','ぴざ','ぐらたん',
                              'まかろに','さらだ','こーるすろー','すーぷ','しちゅー','びーふしちゅー','おーとみーる','はんばーがー','ほっとどっく','さんどうぃっち',
                              'べーぐる','くろわっさん','がーりっくとーすと','すこーん','ろーすとちきん','ふらいどちきん','ふらいどぽてと','まりね','らーめん','ちゃーはん',
                              'ぎょうざ','しゅうまい','ちゃーしゅー','まーぼーどうふ','ほいこーろー','ればにらいため','ちんじゃおろーす','えびちり','ばんばんじー','ふかひれ',
                              'すぶた','はるまき','はるさめ','びーふん','にくまん','でざーと','あめ','わたあめ','あんこ','ぼたもち',
                              'だいふく','さくらもち','まんじゅう','だんご','くしだんご','いまがわやき','たいやき','もなか','おしるこ','ようかん',
                              'せんべい','かきごおり','けーき','ほっとけーき','わっふる','ぽっぷこーん','くっきー','くらっかー','しゅーくりーむ','どーなつ',
                              'ぱい','しゃーべっと','ぜりー','ぷりん','うえはーす','よーぐると','あいすくりーむ','あるこーるいんりょう','びーる','ういすきー',
                              'ばーぼん','わいん','あかわいん','しろわいん','ろぜわいん','しゃんぱん','かくてる','にほんしゅ','しょうちゅう','そふとどりんく',
                              'たんさんいんりょう','こーひー','こうちゃ','りょくちゃ','じゅーす','ぎゅうにゅう','ていしぼうにゅう','とうにゅう','こめ','おおむぎ',
                              'こむぎ','らいむぎ','こむぎこ','きょうりきこ','はくりきこ','ぜんりゅうふん','ぱんこ','ぱすた','めんるい','ぱん',
                              'みそ','あかみそ','しろみそ','くろみそ','はっちょうみそ','ぬかみそ','こめこうじ','さけかす','かんてん','かんぴょう',
                              'ひじき','べにしょうが','にゅうせいひん','れんにゅう','だっしにゅう','なまくりーむ','ほいっぷようくりーむ','ほいっぷくりーむ','さわーくりーむ','ちーず',
                              'ちぇだーちーず','もっつぁれら','たまご','なまたまご','らんおう','らんぱく','たまごのから','うずらたまご','にく','ぎゅうにく',
                              'こうしのにく','ぶたにく','ひつじにく','こひつじのにく','とりにく','しちめんちょうにく','かもにく','しかにく','ばにく','あかみ',
                              'あぶらみ','しもふり','ひれにく','ろーすにく','ばらにく','ひきにく','こまにく','ぶたこま','ぶたろーす','ぶたばら',
                              'ほねつきぶたばら','ぶたもも','ぎゅうかたばら','ぎゅうかたろーす','りぶろーす','さーろいん','ぎゅうもも','たん','ればー','とりむね',
                              'とりもも','ささみ','てばさき','ほねつきすねにく','すなぎも','はつ','ひなばと','ふぉあぐら','そーせーじ','ちょりそ',
                              'はむ','べーこん','ぱんちぇった','さらみ','れーずん','あなうんさー','あにめーたー','あるばいと','いし','いしく',
                              'いたまえ','いものこう','いらすとれーたー','いんてりあでざいなー','うえいたー','うえいとれす','うぇぶでざいなー','うかい','うちゅうひこうし','うらないし',
                              'うんてんしゅ','えいがかんとく','えいようし','えきいん','えすててぃしゃん','えほんさっか','えんかかしゅ','えんじにあ','えんしゅつか','おてつだいさん',
                              'おんがくか','かいけいし','かいせつしゃ','がいこうかん','かうんせらー','かいじょうほあんかん','がか','がくげいいん','がくしゃ','かしや',
                              'かじや','かしゅ','かじん','かせいふ','かていきょうし','かめらまん','がらすこう','がんかい','かんごし','かんとく',
                              'かんりょう','きかいこう','きかんし','ぎいん','こっかいぎいん','ぎたりすと','きゃくほんか','きょうせいしかい','きしゅ','ぎじゅつしゃ',
                              'きゃくしつじょうむいん','きゅうきゅうきゅうめいし','きゅうし','きょうし','ぎょうしょうにん','ぎょうせいかん','ぎょうせいしょし','ぎんこういん','ぐらふぃっくでざいなー','ぐんじん',
                              'けいえいしゃ','けいえいこんさるたんと','けいさつかん','けいびいん','けいむかん','げいにん','げいじゅつか','けいせいげかい','げかい','げきさっか',
                              'けんさつかん','けんしゅうい','けんちくし','こうかいし','こうくうかんせいかん','こうだんし','こうむいん','こっく','こめでぃあん','こぴーらいたー',
                              'こんさるたんと','さいばんかん','さかん','さっか','さっかーせんしゅ','さくしか','さっきょくか','さんふじんかい','さらりーまん','じえいかん',
                              'じえいぎょう','しかいしゃ','しかいし','しかぎこうし','しきしゃ','ししょ','しじん','しすてむえんじにあ','したてや','しちや',
                              'じつぎょうか','しつじ','しなりおらいたー','じびいんこうかい','しほうしょし','じむいん','じゃーなりすと','しゃいん','しゃしょう','しゃしんか',
                              'じゅういし','しょうせつか','しょうぼうかん','しょうにかい','しょくにん','しょか','じょさんぷ','しんぶんきしゃ','しんぶんはいたついん','しんぱん',
                              'せいじか','せいびし','ずいひつか','すたいりすと','すたんとまん','すぽーつせんしゅ','すり','せーるすまん','せいがくか','せいけいげかい',
                              'せいゆう','せんいん','せんすいし','そっきし','しゅうきょうか','せいたいし','ぜいりし','そうばし','そうりょ','そっきしゃ',
                              'そくりょうし','そむりえ','だいく','たいぴすと','たくしーうんてんしゅ','たんけんか','だんさー','たんてい','ちょうきょうし','ちょうりし',
                              'ちょうりつし','ちょうこくか','つうかんし','つうしんし','つうやく','でぃーらー','でぃれくたー','でざいなー','てれびたれんと','でんきこう',
                              'てんじょういん','つあーこんだくたー','とうげいか','とうしあなりすと','とうしか','とざんか','とこや','とび','なれーたー','ないかい',
                              'にくや','にほんごきょうし','にゅーすきゃすたー','にわし','のうか','ばーてんだー','はいかんこう','はいじん','ばいやー','はいゆう',
                              'ぱいろっと','ばすがいど','はつめいか','はなや','はりし','ばれえだんさー','ぱんや','ぴあにすと','ひしょ','ひふかい',
                              'びようし','ひょうろんか','ふぁっしょんでざいなー','ふどうさん','ぷろぐらま','ぷろでゅーさー','べびーしったー','べんごし','へんしゅうしゃ','べんりし',
                              'ほあんかん','ほうしゃせんぎし','ほうどうきしゃ','ぼくじょうけいえいしゃ','ほぼ','ほんやくか','まっさーじし','まんがか','めいど','もでる',
                              'やきゅうせんしゅ','やくざいし','ゆうびんはいたついん','ようせつこう','らくのうか','りょこうだいりてんいん','りょうし','れきしか','るぽらいたー','れーしんぐどらいばー',
                              'わがししょくにん','しゃちょう','まりお','るいーじ','ぴーちひめ','くっぱ','てれさ','ぱっくんふらわー','げっそー','くりぼー',
                              'のこのこ','りんく','わりお','かーびぃ','ぴかちゅう','どらごんくえすと','ふぁいなるふぁんたじー','ばいおはざーど','びーとまにあ','ろっくまん',
                              'ふぁみこん','すーぱーふぁみこん','げーむぼーい','げーむぼーいからー','げーむぼーいあどばんす','げーむぎあ','ぴーしーえんじん','めがどらいぶ','さたーん','ぷれいすてーしょん',
                              'ろくよん','ばーちゃるぼーい','げーむきゅーぶ','うぃー','えっくすぼっくす','ぴーしーえふえっくす','でぃーえす','さざえさん','いそのかつお','いそのわかめ',
                              'ますおさん','なみへい','あなごさん','こぼちゃん','どらえもん','のびた','しずちゃん','すねお','じゃいあん','どらごんぼーる',
                              'ゆうゆうはくしょ','すらむだんく','るろうにけんしん','せいんとせいや','ほくとのけん','じょじょのきみょうなぼうけん','こちらかつしかくかめありこうえんまえはしゅつじょ','ごるごさーてぃーん','おばけのきゅーたろう','えすぱーまみ',
                              'こいけさん','ぷろごるふぁーさる','はっとりくん','きてれつだいひゃっか','ころすけ','がらすのかめん','てつわんあとむ','じゃんぐるたいてい','ぶらっくじゃっく','りぼんのきし',
                              'どらきゅら','ふらんけんしゅたいん','おおかみおとこ','げげげのきたろう','いったんもめん','こなきじじい','すなかけばばあ','ぬりかべ','ねこむすめ','ぬらりひょん',
                              'めだまのおやじ','ねずみおとこ','きゅうけつき','ざしきわらし','ゆきおんな','かさおばけ','あずきあらい','のっぺらぼう','かぜのたにのなうしか','てんくうのしろらぴゅた',
                              'るぱんさんせい','まじょのたっきゅうびん','となりのととろ','くれないのぶた','もののけひめ','せんとちひろのかみかくし','はうるのうごくしろ','がけのうえのぽにょ','ぱとれいばー','てつじんにじゅうはちごう',
                              'まじんがーぜっと','げったーろぼ','がんだむ','ざく','ぐふ','じおんぐ','まくろす','がおがいがー','えう゛ぁんげりおん','おいしんぼ',
                              'あかしやさんま','びーとたけし','ところじょーじ','たもり','すまっぷ','しまだしんすけ','ひかわきよし','きたじまさぶろう','ひさもとまさみ','わだあきこ',
                              'やまだはなこ','なかまゆきえ','くろやなぎてつこ','じゃいあんとばば','あんとにおいのき','がっついしまつ','まつざきしげる','たけだてつや','てづかおさむ','みとこうもん',
                              'ひっさつしごとにん','とおやまのきんさん','ももたろうざむらい','さかなくん','えなりかずき','だうんたうん','ないんてぃないん','うっちゃんなんちゃん','ばくしょうもんだい','えがしらにじごじゅっぷん',
                              'きょろちゃん','あんぱんまん','きてぃちゃん','とっとこはむたろう','かめんらいだー','うるとらまん','うるとらせぶん','うるとらのちち','うるとらのはは','うるとらまんたろう',
                              'ふらんだーすのいぬ','ははをたずねてさんぜんり','あらいぐまらすかる','あかげのあん','ぴーたーぱん','あしながおじさん','めいけんらっしー','じゃいあんつ','どらごんず','べいすたーず',
                              'すわろーず','かーぷ','たいがーす','だいえーほーくす','らいおんず','にっぽんはむふぁいたーず','おりっくすばっふぁろーず','ちばろってまりーんず','そふとばんくほーくす','らくてんごーるでんいーぐるす',
                              'ちゅうごく','いんど','あめりか','いんどねしあ','ぶらじる','ろしあ','にっぽん','かなだ','いぎりす','どいつ',
                              'ふらんす','すいす','おらんだ','いたりあ','おーすとらりあ','すぺいん','ぎりしゃ','しんがぽーる','たい','たいわん',
                              'とるこ','めきしこ','あふりか','えべれすと','ちょもらんま','きりまんじゃろ','ふじさん','ちょこれーと','ぽてとちっぷす','すなっくがし',
                              'するめ','ぽっきー','かっぱえびせん','こーら','あーるえっくすせぶん','いんぷれっさ','らんさーえぼりゅーしょん','じーてぃーあーる','えぬえすえっくす','はっちばっく',
                              'くーぺ','えすゆーぶい','ふぇらーり','にっさん','ほんだ','とよた','まつだ','みつびし','すばる','すずき',
                              'だいはつ','でぃーたんし','えすたんし','こんぽーねんとたんし','こんぽじっとたんし','ちでじ','すぴーかー','てれび','れこーだー','あーるじーびー',
                              'みにじゃっく','せんとくん','まんとくん','ちーばくん','てんき','てんきよほう','しぜんさいがい','きおん','さいこうきおん','さいていきおん',
                              'へいきんきおん','きあつ','きあつはいち','こうきあつ','ていきあつ','しつど','こうすいかくりつ','こうすいりょう','かいせい','はれ',
                              'くもり','とおりあめ','にわかあめ','ゆうだち','こさめ','おおあめ','ぼうふうう','すこーる','ゆき','ふぶき',
                              'ぼうふうせつ','あられ','きりさめ','しも','つゆ','こおり','つらら','らいう','かみなり','いなびかり',
                              'かぜ','そよかぜ','きょうふう','とっぷう','あらし','すなあらし','たつまき','たいふう','はりけーん','さいくろん',
                              'しゅんかんさいだいふうそく','きせつふう','ぼうえきふう','こうずい','だいこうずい','かんばつ','まんちょう','かんちょう','あかしお','なみ',
                              'おおなみ','つなみ','じしん','ふんか','じすべり','ゆうやけ','にじ','おーろら','しんきろう','せいでんき',
                              'もや','にっしょく','げっしょく','まんげつ','みかづき','ひので','にちぼつ','じてん','こうてん','おぞんそう',
                              'おぞんほーる','ちきゅうおんだんか','おんしつこうか','おんどけい','しつどけい','きあつけい','ふうそくけい','じしんけい','せきどう','たいりく',
                              'ゆーらしあたいりく','あふりかたいりく','ほくべいたいりく','なんべいたいりく','なんきょく','こうち','ていち','しま','やま','さんみゃく',
                              'ひまらやさんみゃく','あるぷすさんみゃく','ろっきーさんみゃく','ひださんみゃく','ひょうが','ひょうざん','かざん','かつかざん','きゅうかざん','さんちょう',
                              'おね','だいきょうこく','ぐらんどきゃにおん','きょうこく','ぼんち','いわ','おか','どて','だいどうくつ','どうくつ',
                              'ほらあな','さばく','さはらさばく','すなち','こうや','ぬま','どろ','しっち','じゃんぐる','みつりん',
                              'しんりん','ぼくそうち','そうげん','のはら','たいへいよう','たいせいよう','いんどよう','ほっきょくかい','ちちゅうかい','にほんかい',
                              'おほーつくかい','ひがししなかい','くろしお','おやしお','さんごしょう','あんしょう','みさき','はんとう','いずはんとう','とうきょうわん',
                              'かいきょう','すいろ','うんが','かいこう','にほんかいこう','かいがん','うみべ','はまべ','すなはま','あさせ',
                              'きし','すいへいせん','ちへいせん','みずうみ','かすぴかい','びわこ','かわ','ないるがわ','おがわ','たき',
                              'ないあがらのたき','だむ','おあしす','ほっきょくてん','なんきょくてん','うちゅう','わくせい','ちきゅう','たいよう','つき',
                              'きんせい','かせい','もくせい','どせい','てんのうせい','かいおうせい','めいおうせい','おひつじざ','おうしざ','ふたござ',
                              'かにざ','ししざ','おとめざ','てんびんざ','さそりざ','いてざ','やぎざ','みずがめざ','うおざ','あまのがわ',
                              'ほくとしちせい','すいせい','えいせい','じんこうえいせい','きしょうえいせい','つうしんえいせい','じゅうりょく','ひょうこう','ちず','かいず',
                              'らしんばん','ほいくえん','だんしこう','じょしこう','よびこう','こうしゃ','こうてい','こうどう','ぶどうじょう','じゅうどうじょう',
                              'けんどうじょう','きゅうどうじょう','ちゃしつ','ぷーる','てにすこーと','がくせいりょう','ぶしつ','てつぼう','ぶらんこ','すべりだい',
                              'すなば','しーそー','かだん','ひゃくようばこ','きょうしつ','しょくいんしつ','じむしつ','こうちょうしつ','りかしつ','びじゅつしつ',
                              'おんがくしつ','ちょうりしつ','としょしつ','しちょうかくしつ','ほけんしつ','ぶんぼうぐ','ふでばこ','まじっくぺん','くれよん','がようし',
                              'ものさし','てんびん','しけんかん','けんびきょう','ちきゅうぎ','ぼうえんきょう','けいさんき','きょうかしょ','さんこうしょ','じしょ',
                              'ちずちょう','こくばん','ちょーく','こくばんけし','こうしょう','がくせいしょう','たいそうぎ','じゃーじ','みずぎ','さんすう',
                              'すうがく','きかがく','だいすうがく','とうけいがく','こてん','ようむいん','しゅえい','せいと','がっきゅういいん','しょうがくせい',
                              'せんぱい','こうはい','きょういくじっしゅうせい','じゅぎょう','じかんわり','しゅっせきぼ','しゅくだい','よしゅう','ふくしゅう','かんさつ',
                              'けんきゅう','じっけん','じっしゅう','さくぶん','れぽーと','せいせき','つうしんぼ','ないしんしょ','せいせきしょうめいしょ','しけんけっか',
                              'しけん','じつぎしけん','たいりょくしけん','けんこうしんだん','もぎしけん','ちゅうかんしけん','きまつしけん','がくねんまつしけん','にゅうがくしけん','せんたーしけん',
                              'てんこう','こうそく','がっき','がくねんど','うんどうかい','ぶんかさい','えんそく','どうそうかい','そつぎょうしき','そつぎょうろんぶん',
                              'そつぎょうしょうしょ','そつぎょうあるばむ','ひげそり','てぃっしゅ','はんがー','あまぐ','かっぱ','かーてん','めざましどけい','らばーかっぷ',
                              'りんす','こんでぃしょなー','はみがきこ','はぶらし','きゅうす','なべ','ぼうる','さしみぼうちょう','ぺてぃないふ','つまようじ',
                              'いんせき','ろーるぱん','しょくぱん','あんぱん','じゃむぱん','うぐいすぱん','むしぱん','ちーずむしぱん','さんどいっち','はむさんど',
                              'とまとさんど','たまごさんど','びーえるてぃーさんど','ほっとさんど','かつさんど','ころっけぱん','しゃこうだんす','ぶれいくだんす','こさっくだんす','じゃずだんす',
                              'すとりーとだんす','たっぷだんす','ふらめんこ','べりーだんす','おしょうがつ','せいじんしき','せつぶん','ひなまつり','おはなみ','こどものひ',
                              'なつまつり','たなばた','くりすます','おおみそか','いちごじゃむ','ぶるーべりーじゃむ','ぴーなっつくりーむ','つぶあん','こしあん','かがみもち',
                              'はねつき','こま','きもの','ゆかた','ささ','たんざく','なまはげ','くりすますけーき','としこしそば','こいのぼり',
                              'ひなだん','ひなあられ','あまざけ','ごがつにんぎょう','くりすますつりー','さんたくろーす','ぷれぜんと','はつでんしょ','かりょくはつでんしょ','げんしりょくはつでんしょ',
                              'ふうりょくはつでんしょ','おてら','おはか','すーぱーまーけっと','こぶとりじいさん','ももたろう','きんたろう','うらしまたろう','はなさかじいさん','さるかにがっせん',
                              'いっすんぼうし','したきりすずめ','かさじぞう','おむすびころりん','かちかちやま','つるのおんがえし','いなばのしろうさぎ','ねぶそく','ようつう','かたこり',
                              'めまい','いきぎれ','しんけいつう','かんせつつう','ふくざつこっせつ','ぺんたぶれっと','まうす','きーぼーど','りもこん','でじたるかめら',
                              'げーむぱっど','ゆーえすびーけーぶる','ゆーえすびーめもり','はーどでぃすく','ふろっぴーでぃすく','でぃーぶいでぃーどらいぶ','しーでぃーどらいぶ','ぶるーれいでぃすくどらいぶ','めもりーかーどりーだー','えきしょうもにた',
                              'ぷりんた','すきゃな','あいぽっど','いやほん','へっどほん','るーた','はぶ','とらっくぼーる','びんぼう','おかねもち',
                              'おりんぴっく','わーるどかっぷ','てじな','じゃぐりんぐ','おてだま','ぺんまわし','ゆびぱっちん','かーどまじっく','こいんまじっく','ろーぷまじっく',
                              'くろーすあっぷまじっく','すてーじまじっく','えびぞり','くっしんうんどう','ぜんくつ','はんぷくよことび','すいちょくとび','ふみだいしょうこう','すとれっち','とざん',
                              'ごるふ','ろっくくらいみんぐ','ぐらいだー','すかいだいびんぐ','ねつききゅう','つり','さーふぃん','ぼでぃーぼーど','うぃんどさーふぃん','すきゅーばだいびんぐ',
                              'すいじょうすきー','けいば','すもう','じゅうどう','からて','じゅうじゅつ','てこんどー','あいきどう','むえたい','たいきょくけん',
                              'ちゅうごくけんぽう','しょうりんじけんぽう','ほくとしんけん','なんとせいけん','ぼくしんぐ','けんどう','ふぇんしんぐ','いあい','ばんじーじゃんぷ','すけーとぼーど',
                              'すのーぼーど','とらいあすろん','けいりん','まうんてんばいく','ろーどれーす','しゃげき','あーちぇりー','きゅうどう','くれーしゃげき','びりやーど',
                              'だーつ','くろーる','ひらおよぎ','ばたふらい','しんくろないずどすいみんぐ','たちおよぎ','くろすかんとりー','もーぐる','えありある','ばいあすろん',
                              'ふぃぎゅあすけーと','すぴーどすけーと','あいすほっけー','ろーらーすけーと','かーりんぐ','しんたいそう','えあろびくす','ふぃっとねす','とらんぽりん','ばとんとわりんぐ',
                              'あめりかんふっとぼーる','えきでん','げーとぼーる','さっかー','ふっとさる','すいきゅう','せぱたくろー','そふとぼーる','どっじぼーる','ばすけっとぼーる',
                              'ばれーぼーる','びーちばれー','やきゅう','らぐびー','らくろす','ぼでぃーびる','ぼでぃーびるだー','ぱわーりふてぃんぐ','じゅうりょうあげ','つなひき',
                              'ちぇす','しょうぎ','いご','まーじゃん','いーすぽーつ','ばどみんとん','てにす','そふとてにす','たっきゅう','すかっしゅ',
                              'びんた','おうふくびんた','しっぺ','ぱんち','きっく','ぺこちゃん','さんりお','はろーきてぃ','まいめろでぃ','そうこばん',
                              'るーびっくきゅーぶ','くろすわーどぱずる','いらすとろじっく','つめしょうぎ','すーぱーぼーる','びーだま','ふぁーびー','ふうせん','ぶーめらん','ふらふーぷ',
                              'れごぶろっく','べーごま','ほっぴんぐ','ぼとるきゃっぷ','がしゃぽん','かみねんど','かみひこうき','きっくぼーど','こどもぎんこうけん','さいころ',
                              'ままごと','めんこ','もぐらたたき','わらいぶくろ','はりせん','おかもち','おんさ','かいらんばん','かみふぶき','ぎろちん',
                              'くうきいれ','くさび','すたんがん','といし','せんす','そろばん','ちゅうせんき','ちょうしんき','つえ','つるはし',
                              'てつぱいぷ','ぴっける','ひばし','ぴんせっと','ほーす','まうすぴーす','まごのて','ます','みみせん','くすだま',
                              'けいさんじゃく','ばーこーど','ぱいぷいす','とらばさみ','むすびめ','わごん'
                            ]);
      this.theme          = null;
      this.lastHint       = null;
      this.tokens         = {};
      // TODO : playersに変える
      this.users          = [];
      this.painterIndex   = 0;
      this.imagelog       = [];
      this.mode           = 'chat';
      this.turn           = 0;
      this.round          = 0;
      this.timeLeft       = 0;
      this.roundMax       = 2;
      this.playerCountMax = 8;
    }

    // 定数
    var turnSecond         = 120;
    var firstHintTime      = 90;
    var secondHintTime     = 60;
    var thirdHintTime      = 30;
    var intervalSecond     = 10;
    var messageLengthLimit = 100;

    /**
     * 部屋が満員かどうか
     */
    Room.prototype.isFull = function () {
      return this.users.length == this.playerCountMax;
    }

    /**
     * client送信用のプレイヤー情報を取得する
     */
    Room.prototype.getPlayersInfo = function () {
      var players = [];
      for (var i = 0; i < this.users.length; i++) {
        var user = this.users[i];
        players.push({
          name:      escapeHTML(user.name),
          score:     user.score,
          isReady:   user.isReady,
          isPainter: i == this.painterIndex ? true : false
        })
      }
      return players;
    }

    /**
     * プレイヤー情報をroomに送信
     */
    Room.prototype.updateMember = function () {
      // this.log('update member');

      // TODO : room存在チェックは呼び出し側で
      // TODO : painter情報と正解、優勝者の情報は別に管理するか？要検討
      sockets.to(this.name).emit('update member', this.getPlayersInfo());
    }

    /**
     * プレイヤーの名前からusersのindexを取得
     */
    Room.prototype.getPlayerIndex = function (playerName) {
      for (var i = 0; i < this.users.length; i++) {
        if (this.users[i].name == playerName) return i;
      }
      return -1;
    }

    /**
     * メッセージの長さチェック
     */
    Room.prototype.isValidMessage = function (message) {
      if (message.trim().length == 0 || message.length > messageLengthLimit) {
        return false;
      }
      return true;
    }

    /**
     * プレイヤーから送られてきたメッセージを処理
     */
    Room.prototype.procMessage = function (playerName, message) {
      // this.log('proc message:' + playerName + ' ' + message);

      if (this.mode == 'turn') {
        // turn中は正解かどうかチェックする
        if(message.trim() == this.theme) {
          // 正解
          var playerIndex = this.getPlayerIndex(playerName);
          if (this.users[this.painterIndex].name == playerName) {
            this.pushSystemMessage('ネタバレダメ。ゼッタイ。');
            return;
          }

          sockets.to(this.name).emit('push chat', { userName: escapeHTML(playerName), message: escapeHTML(message) });

          var player = this.users[playerIndex];
          var painter = this.users[this.painterIndex];
          player.score += this.timeLeft;
          painter.score += this.timeLeft;
          this.sendTheme(9);
          this.pushSystemMessage('正解は「' + this.theme + '」でした');
          this.pushSystemMessage('正解した' + player.name + 'さんに' + this.timeLeft + '点加算されます');
          this.pushSystemMessage('描いた' + painter.name + 'さんに' + this.timeLeft + '点加算されます');
          this.endTurn();
        } else {
          // 不正解
          sockets.to(this.name).emit('push chat', { userName: escapeHTML(playerName), message: escapeHTML(message) });
        }
      } else {
        sockets.to(this.name).emit('push chat', { userName: escapeHTML(playerName), message: escapeHTML(message) });
      }
    }

    /**
     * システムメッセージを送信する
     */
    Room.prototype.pushSystemMessage = function (message) {
      // this.log('push system message ' + this.name + ' ' + message);

      sockets.to(this.name).emit('push system message', escapeHTML(message));
    }

    /**
     * 送られてきた描画データを処理する
     */
    Room.prototype.procImage = function (data, userName) {
      if (data.lenght == 1 && data[0].type == 'fill') {
        this.imagelog.length = 0;
        this.imagelog.push(data);
      } else {
        this.imagelog.push(data);
      }

      // 通信量削減のため描いた人には送らない
      for (var i = 0; i < this.users.length; i++) {
        if (this.users[i].name != userName) {
          this.users[i].socket.emit('push image', data);
        }
      }
    }

    /**
     * 残り時間を送信する
     */
    Room.prototype.sendTimeLeft = function () {
      sockets.to(this.name).emit('send time left', this.timeLeft);
    }

    /**
     * お題とヒントを送る
     */
    Room.prototype.sendTheme = function (level) {
      // this.log('send theme');

      this.lastHint = Dictionary.getHint(this.theme, level);
      for (var i = 0; i < this.users.length; i++) {
        if (i == this.painterIndex) {
          if (level == 0) {
            this.users[i].socket.emit('send theme', this.theme);
          }
        } else {
          this.users[i].socket.emit('send theme', this.lastHint);
        }
      }
    }

    /**
     * プレイヤーがpainterかどうかを送る
     */
    Room.prototype.sendIsPainter = function () {
      // this.log('send painter');

      for (var i = 0; i < this.users.length; i++) {
        if (i == this.painterIndex) {
          this.users[i].socket.emit('send is painter', true);
        } else {
          this.users[i].socket.emit('send is painter', false);
        }
      }
    }

    /**
     * timerで呼び出される処理
     */
    Room.prototype.timerProc = function () {
      // this.log('mode:' + this.mode + ' time:' + this.timeLeft);

      switch(this.mode) {
        // お絵描きチャットモード
        case 'chat':
          // なにもしない
          break;

        // 準備完了 ゲーム開始カウントダウン
        case 'ready':
          this.timeLeft--;
          if (this.timeLeft == 0) {
            this.initGame();
            this.startTurn();
          } else {
            this.sendTimeLeft();
          }
          break;

        // ターン中
        case 'turn':
          this.timeLeft--;
          if (this.timeLeft == 0) {
            // 時間切れでターン終了
            this.endTurn();
          } else {
            this.sendTimeLeft();
            if (this.timeLeft == firstHintTime) {
              this.sendTheme(1);
            } else if (this.timeLeft == secondHintTime) {
              this.sendTheme(2);
            } else if (this.timeLeft == thirdHintTime) {
              this.sendTheme(3);
            }
          }
          break;

        // ターンとターンの間
        case 'interval':
          this.timeLeft--;
          if (this.timeLeft == 0) {
            // ターン開始
            this.startTurn();
          } else {
            this.sendTimeLeft();
          }
          break;

        // 該当なし ありえないケース
        default:
          throw new Error('不正なmodeです mode:' + this.mode);
          break;
      }
    }

    /**
     * ゲーム開始時の初期化処理
     */
    Room.prototype.initGame = function () {
      // this.log('init game');

      this.round = 1;
      this.turn = 0;
      this.painterIndex = 0;
      this.lastHint = null;;
      this.pushSystemMessage('ゲームを開始します');
    }

    /**
     * ターン開始処理
     */
    Room.prototype.startTurn = function () {
      // this.log('start turn');

      this.mode = 'turn';
      this.turn += 1;
      this.timeLeft = turnSecond;
      this.theme = this.dictionary.getNextWord();
      // DEBUG用
      // this.pushSystemMessage('debug お題:' + this.theme);
      // this.log('お題:' + this.theme);
      sockets.to(this.name).emit('change mode', 'turn');
      sockets.to(this.name).emit('clear canvas');
      this.imagelog.length = 0;
      if (this.painterIndex == 0) {
        this.pushSystemMessage('ラウンド' + this.round + '/' + this.roundMax + 'を開始します');
      }
      this.pushSystemMessage('ターン' + this.turn + 'を開始します');
      this.sendIsPainter();
      this.sendTimeLeft();
      this.sendTheme(0);
    };

    /**
     * ターン終了処理
     */
    Room.prototype.endTurn = function () {
      // this.log('end turn');

      if (this.timeLeft == 0) {
        this.pushSystemMessage('時間切れです');
        this.pushSystemMessage('正解は「' + this.theme + '」でした');
      }

      if (this.painterIndex == this.users.length - 1) {
        // round終了
        if (this.round == this.roundMax) {
          // ゲーム終了
          this.pushSystemMessage('ゲームが終了しました');

          var maxScore = 0;
          var winnerIndex = [];
          for (var i = 0; i < this.users.length; i++) {
            if (this.users[i].score > maxScore) {
              maxScore = this.users[i].score;
              winnerIndex = [i];
            } else if (this.users[i].score == maxScore) {
              winnerIndex.push(i);
            }
          }

          if (maxScore == 0) {
            this.pushSystemMessage('もっとがんばりましょう');
          } else if (winnerIndex.length == 1) {
            this.pushSystemMessage('優勝は' + this.users[winnerIndex[0]].name + 'さんでした');
          } else {
            var winners;
            for (var i = 0; i < winnerIndex.length; i++) {
              winners += this.users[winnerIndex[i]].name + 'さんと';
            }
            winners = winners.substr(0, winners.length - 1);
            this.pushSystemMessage('優勝は同率で' + winners + 'でした');
          }

          for (var i = 0; i < this.users.length; i++) {
            this.users[i].isReady = false;
          }
          this.changeModeChat();
        } else {
          // 次のroundに
          this.pushSystemMessage('ラウンド' + this.round + '/' + this.roundMax + 'が終了しました');
          this.round += 1;
          this.painterIndex = 0;
          this.pushSystemMessage('次に描く人は' + this.users[this.painterIndex].name + 'さんです');
          this.changeModeInterval();
        }
      } else {
        // 次のturnに
        this.painterIndex += 1;
        this.pushSystemMessage('次に描く人は' + this.users[this.painterIndex].name + 'さんです');
        this.changeModeInterval();
      }

      this.updateMember();
    }

    /**
     * モード変更 Chat
     */
    Room.prototype.changeModeChat = function () {
      // this.log('change mode chat');

      this.mode = 'chat';
      // this.pushSystemMessage('お絵描きチャットモード');
      sockets.to(this.name).emit('change mode', 'chat');
    }

    /**
     * モード変更 Ready
     */
    Room.prototype.changeModeReady = function () {
      // this.log('change mode ready');

      this.mode = 'ready';
      this.timeLeft = intervalSecond;
      this.pushSystemMessage(intervalSecond + '秒後にゲームを開始します');
      sockets.to(this.name).emit('change mode', 'ready');
    }

    /**
     * モード変更 Interval
     */
    Room.prototype.changeModeInterval = function () {
      // this.log('change mode interval');

      this.mode = 'interval';
      this.timeLeft = intervalSecond;
      this.pushSystemMessage(intervalSecond + '秒後に次のターンを開始します');
      sockets.to(this.name).emit('change mode', 'interval');
    }

    /**
     * player退出時の処理
     */
    Room.prototype.playerExit = function (userName) {
      this.log('player exit ' + userName);

      var exitPlayerIndex;
      for (exitPlayerIndex = 0; exitPlayerIndex < this.users.length; exitPlayerIndex++) {
        // TODO : 一致するユーザーがいない可能性はあるか？
        if (this.users[exitPlayerIndex].name == userName) {
          break;
        }
      }

      // roomからプレイヤーを削除
      this.users.splice(exitPlayerIndex, 1);

      // 誰もいない
      if (this.users.length == 0) {
        return;
      }

      this.pushSystemMessage(userName + 'さんが退室しました');

      // 残りプレイヤーが1人になったら強制的にゲーム終了
      if (this.users.length == 1 && this.mode != 'chat') {
        this.pushSystemMessage('1人になってしまいました');
        this.pushSystemMessage('ゲームを続行できないのでゲームを終了します');
        this.users[0].isReady = false;
        this.changeModeChat();
        this.updateMember();
        return;
      }

      // ゲーム中ならゲーム進行を調整する
      if (this.mode == 'turn' || this.mode == 'interval') {
        if (exitPlayerIndex < this.painterIndex) {
          // painterより前のプレイヤーが退室
          // usersのindexが1つ前にずれるためpainterIndexも1つ減らす
          this.painterIndex -= 1;
        } else if (exitPlayerIndex == this.painterIndex) {
          this.painterIndex -= 1;
          if (this.mode == 'turn') {
            this.pushSystemMessage('描く人が退室したのでターンを終了します');
          } else {
            this.pushSystemMessage('次に描く予定の人が退室しました');
            this.pushSystemMessage('次に描く人は' + this.users[this.painterIndex].name + 'さんです');
          }
          this.endTurn();
        } else {
          // painterより後のプレイヤーが退室してもゲーム進行には影響しない
        }
      }

      this.updateMember();
    }

    /**
     * log出力メソッド
     */
    Room.prototype.log = function (message) {
      console.log('[room:' + this.name + '] ' + message);
    }

    // TODO : app.jsでも使ってるので共通化する
    // TODO : 名前とかに&amp;入れると落ちる
    /**
     * HTMLエスケープ処理 
     */
    function escapeHTML (str) {
      return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    return Room;
  })();

  exports.Room = Room;
})();
