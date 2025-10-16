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
      if (!currentUser) {
    alert("Bạn cần đăng nhập trước!");
    return;
  }

  try {
    resultEl.textContent = "Đang tạo giao dịch...";
    const uid = currentUser.uid;
    const amount = 1.0;

    // Gọi backend nếu cần
    const res = await fetch(`/start-payment/?uid=${uid}&amount=${amount}`);
    if (!res.ok) throw new Error("Lỗi HTTP " + res.status);

    const data = await res.json();
    resultEl.textContent = "Yêu cầu thanh toán:\n" + JSON.stringify(data, null, 2);

    // Thực hiện thanh toán
    await Pi.createPayment({
      amount: amount,
      memo: "Test payment with Pi",
      metadata: { purpose: "demo" },
      onComplete: function(payment) {
        console.log("✅ Thanh toán hoàn tất:", payment);
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
    resultEl.textContent = "Lỗi thanh toán: " + err.message;
  }
  });

  function onIncompletePaymentFound(payment) {
    console.log("🔁 Giao dịch chưa hoàn tất:", payment);
  }
});
