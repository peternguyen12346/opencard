window.addEventListener("DOMContentLoaded", function () {
  console.log("✅ DOM loaded!");

  if (typeof Pi === 'undefined') {
    alert('❌ Pi SDK chưa được tải!');
    console.error('Pi SDK is undefined!');
    return;
  }

  Pi.init({ version: "2.0" });
  console.log("✅ Pi SDK initialized!", Pi);

  const resultEl = document.getElementById("result");
  const authBtn = document.getElementById("authBtn");
  const payBtn = document.getElementById("payBtn");

  if (!authBtn) {
    console.error("❌ Không tìm thấy nút authBtn trong DOM!");
    return;
  }

  let currentUser = null;

  // Nút đăng nhập
  authBtn.addEventListener("click", async () => {
    console.log("🟢 Nút đăng nhập được nhấn");
    try {
      const scopes = ["payments"];
      const auth = await Pi.authenticate(scopes, onIncompletePaymentFound);
      currentUser = auth.user;
      resultEl.textContent = "✅ Đăng nhập thành công:\n" + JSON.stringify(currentUser, null, 2);
      payBtn.disabled = false;
    } catch (error) {
      console.error("❌ Lỗi đăng nhập:", error);
      resultEl.textContent = "Lỗi đăng nhập: " + error.message;
    }
  });

  // Nút thanh toán
  payBtn.addEventListener("click", async () => {
    if (!currentUser) {
      alert("Bạn cần đăng nhập trước!");
      return;
    }

    try {
      resultEl.textContent = "⏳ Đang tạo giao dịch...";
      const uid = currentUser.uid;
      const amount = 1.0;
      const res = await fetch(`/start-payment/?uid=${uid}&amount=${amount}`);
      if (!res.ok) throw new Error("Lỗi HTTP " + res.status);

      const data = await res.json();
      resultEl.textContent = "📦 Yêu cầu thanh toán:\n" + JSON.stringify(data, null, 2);

      await Pi.createPayment({
        amount: amount,
        memo: "Test payment with Pi",
        metadata: { purpose: "demo" },
      });
    } catch (err) {
      console.error("❌ Lỗi thanh toán:", err);
      resultEl.textContent = "Lỗi thanh toán: " + err.message;
    }
  });

  function onIncompletePaymentFound(payment) {
    console.log("🔁 Giao dịch chưa hoàn tất:", payment);
  }
});
