import 'package:flutter/material.dart';

void main() => runApp(const AlQahwaApp());

const deep = Color(0xFF031B14);
const green = Color(0xFF073A2B);
const cardGreen = Color(0xFF0B543B);
const gold = Color(0xFFE4BD70);
const cream = Color(0xFFF8E9C7);

class AlQahwaApp extends StatelessWidget {
  const AlQahwaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'القهوة | Al Qahwa',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        fontFamily: 'Arial',
        scaffoldBackgroundColor: deep,
        colorScheme: ColorScheme.fromSeed(seedColor: gold, brightness: Brightness.dark),
      ),
      home: const HomeScreen(),
    );
  }
}

class GameInfo {
  const GameInfo(this.name, this.subtitle, this.symbol);
  final String name;
  final String subtitle;
  final String symbol;
}

const games = <GameInfo>[
  GameInfo('الشطرنج', 'خطط واكسب', '♞'),
  GameInfo('All Fives', 'الدومينو ٥', '⚄'),
  GameInfo('الدومينو', 'دومينو كلاسيك', '⚁'),
  GameInfo('تركس', 'اختار خطتك', '🎲'),
  GameInfo('طرنيب', 'لمة الورق', '♦ ♠ ♥'),
  GameInfo('بلوت', 'تحدي الشركاء', '♣ ♥ ♠'),
  GameInfo('استميشن', 'احسبها صح', '🂡'),
  GameInfo('هاند', 'ورق وتكتيك', 'A K Q'),
  GameInfo('بصرة', 'لمّ الورق', '♥ ♦ ♠'),
];

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});
  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int tab = 0;
  String? selectedGame;

  void openGame(GameInfo game) {
    setState(() => selectedGame = game.name);
    if (game.name == 'الدومينو') {
      Navigator.of(context).push(MaterialPageRoute(builder: (_) => const DominoIntroScreen()));
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('لعبة ${game.name} ضمن خطة التطوير القادمة')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        body: SafeArea(
          bottom: false,
          child: CustomScrollView(
            slivers: [
              SliverToBoxAdapter(child: _topBar()),
              SliverToBoxAdapter(child: _hero()),
              SliverToBoxAdapter(child: _sectionTitle()),
              SliverPadding(
                padding: const EdgeInsets.symmetric(horizontal: 14),
                sliver: SliverGrid(
                  delegate: SliverChildBuilderDelegate(
                    (context, index) => _gameCard(games[index]),
                    childCount: games.length,
                  ),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 3,
                    mainAxisSpacing: 10,
                    crossAxisSpacing: 10,
                    childAspectRatio: .78,
                  ),
                ),
              ),
              SliverToBoxAdapter(child: _homeActions()),
              const SliverToBoxAdapter(child: SizedBox(height: 100)),
            ],
          ),
        ),
        bottomNavigationBar: _bottomNav(),
      ),
    );
  }

  Widget _topBar() => Container(
    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
    decoration: const BoxDecoration(border: Border(bottom: BorderSide(color: Color(0x66E4BD70)))),
    child: Row(children: [
      _iconButton(Icons.settings_outlined),
      const SizedBox(width: 8),
      Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 7),
        decoration: BoxDecoration(color: green, border: Border.all(color: gold), borderRadius: BorderRadius.circular(24)),
        child: const Text('🪙 12,450', style: TextStyle(color: cream, fontWeight: FontWeight.bold)),
      ),
      const Spacer(),
      const CircleAvatar(backgroundColor: gold, child: Text('إ', style: TextStyle(color: deep, fontWeight: FontWeight.bold))),
      const SizedBox(width: 8),
      const Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text('Islam Samir', style: TextStyle(color: cream, fontWeight: FontWeight.bold, fontSize: 12)),
        Text('★ 1250 نقطة · متصل الآن', style: TextStyle(color: gold, fontSize: 10)),
      ]),
      const SizedBox(width: 8),
      _iconButton(Icons.menu),
    ]),
  );

  Widget _iconButton(IconData icon) => Container(
    width: 38, height: 38,
    decoration: BoxDecoration(color: green, border: Border.all(color: gold), borderRadius: BorderRadius.circular(12)),
    child: Icon(icon, color: gold, size: 21),
  );

  Widget _hero() => Container(
    height: 300,
    margin: const EdgeInsets.fromLTRB(14, 14, 14, 22),
    decoration: BoxDecoration(
      borderRadius: BorderRadius.circular(24),
      border: Border.all(color: gold, width: 1.4),
      gradient: const LinearGradient(begin: Alignment.topLeft, end: Alignment.bottomRight, colors: [Color(0xFF174B35), Color(0xFF061D15), Color(0xFF392417)]),
      boxShadow: const [BoxShadow(color: Colors.black54, blurRadius: 18, offset: Offset(0, 9))],
    ),
    child: Stack(children: [
      Positioned.fill(child: Opacity(opacity: .10, child: CustomPaint(painter: TablePatternPainter()))),
      Center(child: Column(mainAxisSize: MainAxisSize.min, children: [
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 34, vertical: 12),
          decoration: BoxDecoration(
            border: Border.all(color: gold, width: 4),
            borderRadius: BorderRadius.circular(13),
            gradient: const LinearGradient(colors: [Color(0xFF8B562C), Color(0xFF321C11), Color(0xFF70421E)]),
          ),
          child: const Column(children: [
            Text('☕', style: TextStyle(fontSize: 30)),
            Text('القهوة', style: TextStyle(fontSize: 38, color: Color(0xFFFFE4A0), fontWeight: FontWeight.w900)),
            Text('لعبة .. ومتعة .. مع القهوة', style: TextStyle(color: cream, fontSize: 11)),
          ]),
        ),
        const SizedBox(height: 18),
        const Text('✦ أهلاً بيك في قهوتنا ✦', style: TextStyle(color: gold, fontWeight: FontWeight.bold)),
        const SizedBox(height: 4),
        const Text('القعدة تحلى باللمة', style: TextStyle(fontSize: 25, color: Color(0xFFFFE3A0), fontWeight: FontWeight.w900)),
        const Text('اختار لعبتك وخلي القعدة تحلى', style: TextStyle(color: cream, fontSize: 12)),
        const SizedBox(height: 12),
        FilledButton(
          style: FilledButton.styleFrom(backgroundColor: gold, foregroundColor: deep),
          onPressed: () => setState(() => tab = 1),
          child: const Text('ابدأ القعدة ←', style: TextStyle(fontWeight: FontWeight.bold)),
        ),
      ])),
    ]),
  );

  Widget _sectionTitle() => Padding(
    padding: const EdgeInsets.fromLTRB(18, 0, 18, 12),
    child: Row(crossAxisAlignment: CrossAxisAlignment.end, children: [
      const Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text('لمة أصحابك تبدأ من هنا', style: TextStyle(color: gold, fontSize: 11, fontWeight: FontWeight.bold)),
        Text('اختار لعبتك', style: TextStyle(color: Color(0xFFFFE2A0), fontSize: 25, fontWeight: FontWeight.w900)),
      ])),
      Text('٩ ألعاب من قلب القهوة', style: TextStyle(color: cream.withValues(alpha: .8), fontSize: 10)),
    ]),
  );

  Widget _gameCard(GameInfo game) => InkWell(
    borderRadius: BorderRadius.circular(19),
    onTap: () => openGame(game),
    child: Container(
      padding: const EdgeInsets.all(7),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(19),
        border: Border.all(color: const Color(0xFFD6AA5E), width: 1.5),
        gradient: const LinearGradient(begin: Alignment.topLeft, end: Alignment.bottomRight, colors: [cardGreen, Color(0xFF04291E)]),
        boxShadow: const [BoxShadow(color: Colors.black38, blurRadius: 8, offset: Offset(0, 4))],
      ),
      child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
        Expanded(child: Container(
          width: double.infinity,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: const Color(0x55DFBD76)),
            gradient: const RadialGradient(colors: [Color(0xFF27694A), Color(0xFF082B20)]),
          ),
          child: Text(game.symbol, textAlign: TextAlign.center, style: const TextStyle(fontSize: 30, color: Color(0xFFF0DFBB), fontWeight: FontWeight.bold)),
        )),
        const SizedBox(height: 6),
        Text(game.name, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(color: Color(0xFFFFE2A0), fontWeight: FontWeight.bold, fontSize: 13)),
        Text(game.subtitle, maxLines: 1, style: const TextStyle(color: Color(0xFFE1D6BD), fontSize: 9)),
      ]),
    ),
  );

  Widget _homeActions() => Padding(
    padding: const EdgeInsets.all(14),
    child: Row(children: [
      Expanded(child: _actionButton('▶ ابدأ اللعب', () => setState(() => tab = 1))),
      const SizedBox(width: 7),
      Expanded(child: _actionButton('＋ إنشاء ترابيزة', () => setState(() => tab = 2))),
      const SizedBox(width: 7),
      Expanded(child: _actionButton('♧ أصدقائي', () => setState(() => tab = 3))),
    ]),
  );

  Widget _actionButton(String text, VoidCallback action) => FilledButton(
    onPressed: action,
    style: FilledButton.styleFrom(backgroundColor: gold, foregroundColor: deep, padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 4), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
    child: FittedBox(child: Text(text, style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 11))),
  );

  Widget _bottomNav() => NavigationBar(
    backgroundColor: const Color(0xFF031E17),
    indicatorColor: const Color(0x553D7656),
    selectedIndex: tab,
    onDestinationSelected: (value) => setState(() => tab = value),
    destinations: const [
      NavigationDestination(icon: Icon(Icons.home_outlined), selectedIcon: Icon(Icons.home), label: 'الرئيسية'),
      NavigationDestination(icon: Icon(Icons.coffee_outlined), label: 'القهوة'),
      NavigationDestination(icon: Icon(Icons.table_restaurant_outlined), label: 'الترابيزات'),
      NavigationDestination(icon: Icon(Icons.people_outline), label: 'الأصحاب'),
      NavigationDestination(icon: Icon(Icons.person_outline), label: 'حسابي'),
    ],
  );
}

class TablePatternPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final p = Paint()..color = gold.withValues(alpha: .22)..strokeWidth = 1;
    for (var x = 0.0; x < size.width; x += 26) {
      canvas.drawLine(Offset(x, 0), Offset(x + 40, size.height), p);
    }
    for (var y = 0.0; y < size.height; y += 26) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y + 30), p);
    }
  }
  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class DominoIntroScreen extends StatelessWidget {
  const DominoIntroScreen({super.key});
  @override
  Widget build(BuildContext context) => Directionality(
    textDirection: TextDirection.rtl,
    child: Scaffold(
      appBar: AppBar(backgroundColor: deep, foregroundColor: gold, title: const Text('دومينو كلاسيك')),
      body: Container(
        decoration: const BoxDecoration(gradient: LinearGradient(begin: Alignment.topCenter, end: Alignment.bottomCenter, colors: [green, deep])),
        child: Center(child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(mainAxisSize: MainAxisSize.min, children: [
            const Text('⚄   ⚁   ⚅', style: TextStyle(fontSize: 42, color: cream)),
            const SizedBox(height: 18),
            const Text('ترابيزة القهوة', style: TextStyle(color: gold, fontSize: 26, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            const Text('النسخة الأولى من واجهة الدومينو. منطق اللعب المحلي ضد الكمبيوتر قيد النقل من نسخة الويب.', textAlign: TextAlign.center, style: TextStyle(color: cream, height: 1.7)),
            const SizedBox(height: 22),
            FilledButton.icon(
              onPressed: () => Navigator.pop(context),
              icon: const Icon(Icons.arrow_back),
              label: const Text('العودة للرئيسية'),
              style: FilledButton.styleFrom(backgroundColor: gold, foregroundColor: deep),
            ),
          ]),
        )),
      ),
    ),
  );
}
