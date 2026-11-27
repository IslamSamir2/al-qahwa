(() => {
  const $ = (id) => document.getElementById(id);
  const dialog = $("gameDialog");
  const title = $("dialogTitle");
  const description = $("dialogText");
  const labels = {
    fives: ["All Fives", "هنضيف لعبة All Fives في مرحلة مستقلة."],
    chess: ["شطرنج", "هنجهّز رقعة الشطرنج وقواعد الحركة في مرحلة مستقلة."],
    cards: ["ألعاب الكوتشينة", "هنضيف ألعاب الكوتشينة واحدة واحدة حسب اختيارك."]
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
    else { state.turn="human"; $("gameMessage").textContent="الكمبيوتر عدّى دوره. دورك."; render(); }
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
    $("drawTile").disabled=state.over||state.turn!=="human"||!state.boneyard.length;
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
    if(state.over||state.turn!=="human"||!state.boneyard.length)return;
    state.human.push(state.boneyard.pop());
    $("gameMessage").textContent="سحبت قطعة. العب لو تنفع، أو اسحب تاني.";
    render();
    if(state.human.some(t=>legalSides(t).length)) $("gameMessage").textContent="عندك نقلة متاحة. اختار قطعة.";
  }
  function passHuman() {
    if(state.over||state.turn!=="human"||state.human.some(t=>legalSides(t).length)||state.boneyard.length)return;
    state.turn="cpu"; $("gameMessage").textContent="عدّيت دورك."; render(); setTimeout(cpuMove,650);
  }

  document.querySelectorAll("[data-game]").forEach(button=>button.addEventListener("click",()=>{
    const game=button.dataset.game;
    if(game==="domino"){showDomino();return;}
    const [name,text]=labels[game]; title.textContent=name; description.textContent=text; dialog.showModal();
  }));
  $("backHome").addEventListener("click",backHome);
  $("restartDomino").addEventListener("click",newGame);
  $("closeDialog").addEventListener("click",()=>dialog.close());
  $("dialogAction").addEventListener("click",()=>dialog.close());
  $("exploreButton").addEventListener("click",()=>$("games").scrollIntoView({behavior:"smooth"}));
  $("roomButton").addEventListener("click",()=>{title.textContent="إنشاء ترابيزة";description.textContent="الغرف ودعوة أصحابك أونلاين هتكون في مرحلة اللعب الجماعي.";dialog.showModal();});
  document.querySelectorAll(".nav-item").forEach(item=>item.addEventListener("click",()=>{
    document.querySelectorAll(".nav-item").forEach(nav=>nav.classList.remove("active"));item.classList.add("active");
    if(item.dataset.tab!=="home"){title.textContent=item.textContent.trim();description.textContent="القسم ده لسه تحت التجهيز.";dialog.showModal();}
  }));
  $("profileButton").addEventListener("click",()=>{title.textContent="ملفك الشخصي";description.textContent="هنضيف الاسم والصورة والرصيد والإحصائيات في مرحلة قادمة.";dialog.showModal();});
  if("serviceWorker" in navigator) window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
})();