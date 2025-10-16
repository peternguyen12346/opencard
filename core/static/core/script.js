window.addEventListener("DOMContentLoaded", function () {
  console.log("✅ DOM loaded!");

  if (typeof Pi === "undefined") {
    alert("❌ Pi SDK chưa được tải!");
    console.error("Pi SDK is undefined!");
    return;
  }

  Pi.init({ version: "2.0" });
  console.log("✅ Pi SDK initialized!", Pi);

  const resultEl = document.getElementById("result");
  const authBtn = document.getElementById("authBtn");
  const payBtn = document.getElementById("payBtn");

  if (!authBtn || !payBtn) {
    console.error("❌ Không tìm thấy nút authBtn hoặc payBtn trong DOM!");
    return;
  }

  let currentUser = null;

  // --- Nút đăng nhập ---
  authBtn.addEventListener("click", async () => {
    try {
      console.log("🔹 Đang nhấn đăng nhập Pi...");
      const scopes = ["payments"];
      const auth = await Pi.authenticate(scopes, onIncompletePaymentFound);
      currentUser = auth.user;
      console.log("✅ Đăng nhập thành công:", currentUser);
      resultEl.textContent = "Đăng nhập thành công:\n" + JSON.stringify(currentUser, null, 2);
      payBtn.disabled = false;
    } catch (error) {
      console.error("❌ Lỗi đăng nhập:", error);
      resultEl.textContent = "Lỗi đăng nhập: " + error.message;
    }
  });

  // --- Nút thanh toán 1 Pi ---
  payBtn.addEventListener("click", async () => {
    if (!currentUser) {
      alert("Bạn cần đăng nhập trước!");
      return;
    }

    try {
      const uid = currentUser.uid;
      const amount = 1.0;

      // Nếu backend cần tạo payment request
      const res = await fetch(`/start-payment/?uid=${uid}&amount=${amount}`);
      if (!res.ok) throw new Error("Lỗi HTTP " + res.status);
      const data = await res.json();
      console.log("📄 Yêu cầu thanh toán từ server:", data);
      resultEl.textContent = "Yêu cầu thanh toán:\n" + JSON.stringify(data, null, 2);

      // Thực hiện thanh toán Pi
      await Pi.createPayment({
        amount: amount,
        memo: "Thanh toán 1 Pi",
        metadata: { purpose: "demo" },
        onComplete: function (payment) {
          console.log("✅ Thanh toán thành công:", payment);
          resultEl.textContent = "Thanh toán thành công:\n" + JSON.stringify(payment, null, 2);
        },
        onError: function (error) {
          console.error("❌ Lỗi thanh toán:", error);
          resultEl.textContent = "Lỗi thanh toán: " + error.message;
        },
        onCancel: function () {
          console.log("⚠ Người dùng hủy thanh toán");
          resultEl.textContent = "Người dùng hủy thanh toán";
        },
      });
    } catch (err) {
      console.error("❌ Lỗi thanh toán:", err);
      resultEl.textContent = "Lỗi thanh toán: " + err.message;
    }
  });

  // Callback cho giao dịch chưa hoàn tất
  function onIncompletePaymentFound(payment) {
    console.log("🔁 Giao dịch chưa hoàn tất:", payment);
  }
});
