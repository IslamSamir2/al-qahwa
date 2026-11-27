const dialog = document.getElementById("gameDialog");
const title = document.getElementById("dialogTitle");
const description = document.getElementById("dialogText");
const labels = {
  domino: ["دومينو كلاسيك", "اختيار ممتاز! هنجهّز شاشة الدومينو في المرحلة التالية."],
  fives: ["All Fives", "هنضيف نظام حساب النقاط ومضاعفات الخمسة في المرحلة التالية."],
  chess: ["شطرنج", "هنجهّز رقعة الشطرنج ونظام اللعب في المرحلة التالية."],
  cards: ["ألعاب الكوتشينة", "هنضيف ألعاب الكوتشينة واحدة واحدة حسب اختيارك."]
};
document.querySelectorAll("[data-game]").forEach((button) => {
  button.addEventListener("click", () => {
    const [name, text] = labels[button.dataset.game];
    title.textContent = name;
    description.textContent = text;
    dialog.showModal();
  });
});
document.getElementById("closeDialog").addEventListener("click", () => dialog.close());
document.getElementById("dialogAction").addEventListener("click", () => dialog.close());
document.getElementById("exploreButton").addEventListener("click", () => {
  document.getElementById("games").scrollIntoView({ behavior: "smooth" });
});
document.getElementById("roomButton").addEventListener("click", () => {
  title.textContent = "إنشاء ترابيزة";
  description.textContent = "إنشاء الغرف ودعوة أصحابك هتكون ضمن المرحلة التالية.";
  dialog.showModal();
});
document.querySelectorAll(".nav-item").forEach((item) => {
  item.addEventListener("click", () => {
    document.querySelectorAll(".nav-item").forEach((nav) => nav.classList.remove("active"));
    item.classList.add("active");
    if (item.dataset.tab !== "home") {
      title.textContent = item.textContent.trim();
      description.textContent = "القسم ده لسه تحت التجهيز، وهنضيفه ضمن مراحل بناء التطبيق.";
      dialog.showModal();
    }
  });
});
document.getElementById("profileButton").addEventListener("click", () => {
  title.textContent = "ملفك الشخصي";
  description.textContent = "هنضيف الاسم والصورة والرصيد والإحصائيات في المرحلة التالية.";
  dialog.showModal();
});
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
}
