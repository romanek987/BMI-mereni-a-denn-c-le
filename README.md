# 🏃 FitPulse – BMI & Denní Cíle Tracker

Moderní webová aplikace pro měření a sledování indexu tělesné hmotnosti (BMI), metabolických parametrů (BMR, TDEE) a každodenní plnění zdravých návyků a cílů.

---

## 🌟 Hlavní funkce

### 1. 📏 BMI & Tělesné metriky
- **Okamžitý výpočet BMI**: Výška, váha, věk, pohlaví.
- **Barevné grafické měřidlo**: Zobrazení pozice na škále od podváhy po těžkou obezitu.
- **Ideální váhové rozpětí**: Přesný výpočet zdravé hmotnosti a rozdílu (kolik kg zbývá k normálu).
- **Bazální metabolismus (BMR)**: Kolik kalorií tělo spálí v klidovém režimu (Mifflin-St Jeor).
- **Celkový denní výdej energie (TDEE)**: Kalorická potřeba dle fyzické aktivity.
- **Doporučený kalorický příjem**: Automatický propočet deficitu pro udržitelné hubnutí (-500 kcal).
- **Denní potřeba tekutin**: Doporučený objem vody v litrech podle hmotnosti.
- **Ukládání měření**: Záznam do osobní historie včetně volitelné poznámky.

### 2. ✅ Denní cíle a návyky (Habit Tracker)
- **Rychlé odklikávání cílů**: Interaktivní zaškrtávátka s příjemným zvukovým feedbackem.
- **Kruhový ukazatel dne v %**: Přehledný stav denního splnění.
- **Počítadlo aktivní šňůry (Streak)**: Motivace udržet zdravé návyky nepřerušeně každý den.
- **Vlastní cíle**: Možnost přidávat i mazat libovolné vlastní návyky s výběrem ikon a kategorií (Pohyb, Strava, Mindset).
- **Oslavný efekt konfet**: Při 100% splnění všech cílů dne.

### 3. 💧 Sledování pitného režimu
- Interaktivní sklenice vody (8 × 250 ml = 2 000 ml).
- Kliknutí na jednotlivé sklenky nebo rychlá tlačítka `+ 250 ml` / `- 250 ml`.
- Automatické zvukové efekty bublinek a propojení s odznaky.

### 4. 📈 Historie & Interaktivní Graf
- **Vývoj váhy v čase**: Canvas graf s plynulou křivkou a body pro jednotlivá měření.
- **Přehledové statistiky**: Počáteční váha, aktuální stav, celková změna (± kg) a počet záznamů.
- **Tabulka měření**: Kompletní archiv s datem, BMI, kategorií, poznámkou a možností mazání.

### 5. 🏆 Úspěchy & Odborné Tipy
- **8 odemykatelných odznaků**: Za konzistenci, pitný režim, první měření i udržení šňůry.
- **Praktické tipy**: Rady ohledně stravy (pravidlo talíře), regenerace, spánku a přirozeného pohybu (NEAT).
- **Záloha a obnova**: Export všech dat do souboru JSON a snadné nahrání zpět.

---

## 🚀 Jak aplikaci spustit

Aplikace je plně samostatná a nevyžaduje instalaci žádných doplňků ani serveru.

### Možnost A: Otevření ve vašem webovém prohlížeči
Stačí poklepat na soubor **`index.html`** nebo spustit **`launch.bat`**.

### Možnost B: Spuštění z příkazové řádky
```powershell
Start-Process "C:\Users\Student\.gemini\antigravity\scratch\fit-tracker-app\index.html"
```
nebo přímo v Microsoft Edge či Google Chrome:
```powershell
msedge "C:\Users\Student\.gemini\antigravity\scratch\fit-tracker-app\index.html"
```

---

## 🔒 Soukromí a data
Všechna data jsou uložena **pouze lokálně ve vašem prohlížeči** (`localStorage`). Žádná data se neodesílají na žádné vzdálené servery.
