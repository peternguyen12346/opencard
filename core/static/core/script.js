window.addEventListener("DOMContentLoaded", function () {
  console.log("✅ DOM loaded!");

  if (typeof Pi === 'undefined') {
    alert('❌ Pi SDK chưa được tải!');
    console.error('Pi SDK is undefined!');
    return;
  }

  // Khởi tạo Pi SDK
  Pi.init({ version: "2.0" });
  console.log("✅ Pi SDK initialized!", Pi);

  const resultEl = document.getElementById("result");
  const authBtn = document.getElementById("authBtn");
  const payBtn = document.getElementById("payBtn");

  if (!authBtn || !payBtn) {
    console.error("❌ Không tìm thấy authBtn hoặc payBtn trong DOM!");
    return;
  }

  let currentUser = null;

  // -----------------------------
  // 1. Đăng nhập bằng Pi
  // -----------------------------
  authBtn.addEventListener("click", async () => {
    try {
      const scopes = ["payments"];
      const auth = await Pi.authenticate(scopes, onIncompletePaymentFound);
      currentUser = auth.user;
      console.log("✅ Đăng nhập thành công:", currentUser);
      resultEl.textContent = "Đăng nhập thành công:\n" + JSON.stringify(currentUser, null, 2);
      payBtn.disabled = false; // Bật nút thanh toán
    } catch (error) {
      console.error("❌ Lỗi đăng nhập:", error);
      resultEl.textContent = "Lỗi đăng nhập: " + error.message;
    }
  });

  // -----------------------------
  // 2. Thanh toán 1 Pi
  // -----------------------------
  payBtn.addEventListener("click", async () => {
    if (!currentUser) {
      alert("Bạn cần đăng nhập trước!");
      return;
    }

    try {
      const amount = 1.0;
      resultEl.textContent = "Đang tạo giao dịch...";

      // Nếu bạn cần gọi backend để tạo payment request, uncomment:
      // const res = await fetch(`/start-payment/?uid=${currentUser.uid}&amount=${amount}`);
      // if (!res.ok) throw new Error("Lỗi HTTP " + res.status);
      // const data = await res.json();
      // console.log("Payment request từ server:", data);

      await Pi.createPayment({
        amount: amount,
        memo: "Thanh toán 1 Pi",
        metadata: { purpose: "demo" },
        onComplete: function(payment) {
          console.log("✅ Thanh toán thành công:", payment);
          resultEl.textContent = "Thanh toán thành công:\n" + JSON.stringify(payment, null, 2);
        },
        onError: function(error) {
          console.error("❌ Lỗi thanh toán:", error);
          resultEl.textContent = "Lỗi thanh toán: " + error.message;
        },
        onCancel: function() {
          console.log("⚠ Người dùng hủy thanh toán");
          resultEl.textContent = "Người dùng hủy thanh toán";
        }
      });
    } catch (err) {
      console.error("❌ Lỗi trong quá trình thanh toán:", err);
      resultEl.textContent = "Lỗi thanh toán: " + err.message;
    }
  });

  // Callback khi có giao dịch chưa hoàn tất
  function onIncompletePaymentFound(payment) {
    console.log("🔁 Giao dịch chưa hoàn tất:", payment);
  }
});
