(() => {
  const $ = (id) => document.getElementById(id);
  const dialog = $("gameDialog");
  const title = $("dialogTitle");
  const description = $("dialogText");
  const labels = {
    fives: ["All Fives", "هنضيف لعبة All Fives في مرحلة مستقلة."],
    chess: ["شطرنج", "هنجهّز رقعة الشطرنج وقواعد الحركة في مرحلة مستقلة."],
    cards: ["ألعاب الكوتشينة", "هنضيف ألعاب الكوتشينة واحدة واحدة حسب اختيارك."],
    tarneeb: ["طرنيب", "واجهة طرنيب وقواعد اللعب هتتضاف في المرحلة التالية."],
    baloot: ["بلوت", "واجهة بلوت وقواعد اللعب هتتضاف في المرحلة التالية."],
    turk: ["تركس", "واجهة تركس وقواعد اللعب هتتضاف في المرحلة التالية."],
    istimish: ["استميشن", "واجهة استميشن وقواعد اللعب هتتضاف في المرحلة التالية."],
    hand: ["هاند", "واجهة هاند وقواعد اللعب هتتضاف في المرحلة التالية."],
    basra: ["بصرة", "واجهة بصرة وقواعد اللعب هتتضاف في المرحلة التالية."]
  };
  let state = null;

  function makeDeck() {
    const deck = [];
    for (let a = 0; a <= 6; a++) for (let b = a; b <= 6; b++) deck.push({a,b,id:`${a}-${b}`});
    return deck;
  }
  function shuffle(items) {
    for (let i=items.length-1;i>0;i--) { const j=Math.floor(Math.random()*(i+1)); [items[i],items[j]]=[items[j],items[i]]; }
    return items;
  }
  function pipMarkup(n) {
    const patterns = {0:[],1:[4],2:[0,8],3:[0,4,8],4:[0,2,6,8],5:[0,2,4,6,8],6:[0,2,3,5,6,8]};
    return `<span class="pips">${(patterns[n]||[]).map(i=>`<i class="pip p${i}"></i>`).join("")}</span>`;
  }
  function tileMarkup(tile, extra="") {
    return `<span class="domino-tile ${extra}"><span class="tile-half">${pipMarkup(tile.a)}</span><span class="tile-divider"></span><span class="tile-half">${pipMarkup(tile.b)}</span></span>`;
  }
  function newGame() {
    const deck=shuffle(makeDeck());
    const human=deck.splice(0,7), cpu=deck.splice(0,7);
    state={human,cpu,boneyard:deck,chain:[],left:null,right:null,turn:"human",over:false,selected:null};
    $("gameMessage").textContent="اختار أي قطعة عشان تبدأ.";
    render();
  }
  function showDomino() {
    $("homeMain").hidden=true; $("dominoScreen").hidden=false;
    document.querySelector(".bottom-nav").hidden=true;
    newGame(); window.scrollTo({top:0,behavior:"smooth"});
  }
  function backHome() {
    $("dominoScreen").hidden=true; $("homeMain").hidden=false;
    document.querySelector(".bottom-nav").hidden=false;
  }
  function legalSides(tile) {
    if (!state.chain.length) return ["right"];
    const sides=[];
    if (tile.a===state.left || tile.b===state.left) sides.push("left");
    if (tile.a===state.right || tile.b===state.right) sides.push("right");
    return sides;
  }
  function orient(tile, side) {
    if (!state.chain.length) return {...tile};
    if (side==="left") return tile.b===state.left ? {...tile} : {a:tile.b,b:tile.a,id:tile.id};
    return tile.a===state.right ? {...tile} : {a:tile.b,b:tile.a,id:tile.id};
  }
  function play(player,index,side) {
    if (state.over || state.turn!==player) return;
    const hand=state[player], tile=hand[index];
    if (!tile || !legalSides(tile).includes(side)) return;
    const placed=orient(tile,side);
    hand.splice(index,1);
    if (!state.chain.length) { state.chain=[placed]; state.left=placed.a; state.right=placed.b; }
    else if (side==="left") { state.chain.unshift(placed); state.left=placed.a; }
    else { state.chain.push(placed); state.right=placed.b; }
    state.selected=null;
    $("gameMessage").textContent=player==="human"?"حركة ممتازة!":"الكمبيوتر لعب قطعة.";
    checkEnd();
    if (!state.over) { state.turn=player==="human"?"cpu":"human"; render(); if(state.turn==="cpu") setTimeout(cpuMove,750); }
    else render();
  }
  function checkEnd() {
    if (!state.human.length || !state.cpu.length) {
      state.over=true;
      const winner=!state.human.length?"أنت كسبت 🎉":"الكمبيوتر كسب الجولة.";
      $("gameMessage").textContent=winner+" اضغط «لعبة جديدة» للعب مرة تانية.";
      return;
    }
    const humanCan=state.human.some(t=>legalSides(t).length);
    const cpuCan=state.cpu.some(t=>legalSides(t).length);
    if (!humanCan && !cpuCan && !state.boneyard.length) {
      state.over=true;
      const h=state.human.reduce((s,t)=>s+t.a+t.b,0), c=state.cpu.reduce((s,t)=>s+t.a+t.b,0);
      $("gameMessage").textContent=h<c?"اللعبة اتقفلت — أنت كسبت بأقل نقاط!":h>c?"اللعبة اتقفلت — الكمبيوتر كسب بأقل نقاط.":"اللعبة اتقفلت — تعادل!";
    }
  }
  function cpuMove() {
    if(state.over || state.turn!=="cpu") return;
    let moves=[];
    state.cpu.forEach((t,i)=>legalSides(t).forEach(side=>moves.push({i,side,t,score:t.a+t.b})));
    if(moves.length) {
      moves.sort((x,y)=>y.score-x.score);
      const m=moves[0]; play("cpu",m.i,m.side); return;
    }
    if(state.boneyard.length) { state.cpu.push(state.boneyard.pop()); render(); setTimeout(cpuMove,500); }
    else {
      state.turn="human";
      checkEnd();
      if(!state.over) $("gameMessage").textContent="الكمبيوتر عدّى دوره. دورك.";
      render();
    }
  }
  function chooseTile(index) {
    if(state.over || state.turn!=="human") return;
    const tile=state.human[index], sides=legalSides(tile);
    if(!sides.length) { $("gameMessage").textContent="القطعة دي مش راكبة. جرّب قطعة تانية أو اسحب."; return; }
    if(sides.length===1) { play("human",index,sides[0]); return; }
    state.selected=index;
    $("gameMessage").textContent="القطعة تركب من الناحيتين — اختار الطرف.";
    render();
  }
  function render() {
    $("humanCount").textContent=state.human.length+" قطع";
    $("cpuCount").textContent=state.cpu.length+" قطع";
    $("turnStatus").textContent=state.over?"انتهت الجولة":state.turn==="human"?"دورك":"دور الكمبيوتر";
    $("chainCount").textContent=state.chain.length+" قطعة على الترابيزة";
    $("leftEnd").textContent=state.chain.length?state.left:"—";
    $("rightEnd").textContent=state.chain.length?state.right:"—";
    $("dominoChain").innerHTML=state.chain.length?state.chain.map(t=>tileMarkup(t)).join(""):'<div class="empty-table">ابدأ أول نقلة بقطعة من إيدك</div>';
    $("humanHand").innerHTML=state.human.map((t,i)=>`<button class="hand-tile ${state.selected===i?"selected":""}" data-index="${i}" aria-label="قطعة ${t.a} و${t.b}">${tileMarkup(t)}</button>`).join("");
    $("humanHand").querySelectorAll("[data-index]").forEach(btn=>btn.addEventListener("click",()=>chooseTile(Number(btn.dataset.index))));
    $("drawTile").disabled=state.over||state.turn!=="human"||!state.boneyard.length||state.human.some(t=>legalSides(t).length);
    $("drawTile").textContent=state.boneyard.length?"اسحب قطعة ("+state.boneyard.length+")":"المخزن خلص";
    $("passTurn").disabled=state.over||state.turn!=="human"||state.human.some(t=>legalSides(t).length)||state.boneyard.length>0;
    $("drawTile").onclick=drawForHuman;
    $("passTurn").onclick=passHuman;
    if(state.selected!==null) {
      $("gameMessage").innerHTML='اختار الطرف: <button class="end-choice" id="chooseLeft">الشمال</button> <button class="end-choice" id="chooseRight">اليمين</button>';
      $("chooseLeft").onclick=()=>play("human",state.selected,"left");
      $("chooseRight").onclick=()=>play("human",state.selected,"right");
    }
  }
  function drawForHuman() {
    if(state.over||state.turn!=="human"||!state.boneyard.length||state.human.some(t=>legalSides(t).length))return;
    state.human.push(state.boneyard.pop());
    $("gameMessage").textContent="سحبت قطعة. العب لو تنفع، أو اسحب تاني.";
    render();
    if(state.human.some(t=>legalSides(t).length)) $("gameMessage").textContent="عندك نقلة متاحة. اختار قطعة.";
  }
  function passHuman() {
    if(state.over||state.turn!=="human"||state.human.some(t=>legalSides(t).length)||state.boneyard.length)return;
    state.turn="cpu";
    checkEnd();
    if(state.over){render();return;}
    $("gameMessage").textContent="عدّيت دورك."; render(); setTimeout(cpuMove,650);
  }

  function hideScreens() {
    $("homeMain").hidden=true; $("cafeScreen").hidden=true; $("tablesScreen").hidden=true; $("dominoScreen").hidden=true;
    document.querySelector(".bottom-nav").hidden=false;
  }
  function showHome() { hideScreens(); $("homeMain").hidden=false; setActive("home"); window.scrollTo({top:0,behavior:"smooth"}); }
  function showCafe() { hideScreens(); $("cafeScreen").hidden=false; setActive("cafe"); window.scrollTo({top:0,behavior:"smooth"}); }
  function showTables(seats=2) {
    hideScreens(); $("tablesScreen").hidden=false;
    $("tablesTitle").textContent=seats===4?"ترابيزات لأربعة لاعبين":"ترابيزات لشخصين";
    document.querySelectorAll(".available-table").forEach((el,i)=>{el.querySelector(".seat-count").textContent=seats===4?["2/4","1/4","3/4"][i]:["1/2","0/2","2/2"][i];});
    setActive("tables"); window.scrollTo({top:0,behavior:"smooth"});
  }
  function setActive(tab) {
    document.querySelectorAll(".nav-item").forEach(nav=>nav.classList.toggle("active",nav.dataset.tab===tab));
  }
  function showDialog(t,d) { title.textContent=t; description.textContent=d; dialog.showModal(); }
  $("cafeBackHome").addEventListener("click",showHome);
  $("tablesBackCafe").addEventListener("click",showCafe);
  document.querySelectorAll(".table-option").forEach(btn=>btn.addEventListener("click",()=>showTables(Number(btn.dataset.seats))));
  document.querySelectorAll(".available-table").forEach(btn=>btn.addEventListener("click",()=>{
    showDialog("اختيار اللعبة","الترابيزة اتحددت كتجربة مبدئية. اختار دومينو كلاسيك للعب ضد الكمبيوتر، أو ارجع للقائمة.");
  }));
  $("privateRoomButton").addEventListener("click",()=>showDialog("ترابيزة خاصة","إنشاء الغرف برمز دعوة واللعب أونلاين هيتضافوا مع ربط الخادم. دي حاليًا واجهة تجريبية."));
  $("quickPlay").addEventListener("click",()=>showDomino());
  $("createRoomHome").addEventListener("click",showCafe);
  $("inviteFriends").addEventListener("click",()=>showDialog("اعزم أصحابك","دعوات الأصدقاء واللعب الجماعي أونلاين ضمن المرحلة التالية."));
  document.querySelectorAll("[data-game]").forEach(button=>button.addEventListener("click",()=>{
    const game=button.dataset.game;
    if(game==="domino"){showDomino();return;}
    const [name,text]=labels[game]; showDialog(name,text);
  }));
  $("backHome").addEventListener("click",showHome);
  $("restartDomino").addEventListener("click",newGame);
  $("closeDialog").addEventListener("click",()=>dialog.close());
  $("dialogAction").addEventListener("click",()=>dialog.close());
  document.querySelectorAll(".nav-item").forEach(item=>item.addEventListener("click",()=>{
    const tab=item.dataset.tab;
    if(tab==="home") showHome();
    else if(tab==="cafe") showCafe();
    else if(tab==="tables") showTables(2);
    else if(tab==="friends") showDialog("الأصحاب","قائمة الأصدقاء والدعوات هتكون متاحة بعد إضافة الحسابات واللعب أونلاين.");
    else showDialog("حسابك الشخصي","هنضيف الاسم والصورة والرصيد والإحصائيات في مرحلة الحسابات.");
  }));
  $("profileButton").addEventListener("click",()=>showDialog("الإعدادات","إعدادات الحساب والصوت والإشعارات هتتضاف في مرحلة الحسابات."));
  $("menuButton").addEventListener("click",()=>showDialog("قائمة القهوة","اختار لعبتك من القائمة الرئيسية أو ادخل على الترابيزات."));
  $("addCoins").addEventListener("click",()=>showDialog("رصيد العملات","المتجر وشراء العملات هيتضافوا بعد ربط الحسابات والدفع."));
  if("serviceWorker" in navigator) window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
})();