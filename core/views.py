from django.shortcuts import render
from django.http import JsonResponse
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .pi_integration import create_payment

def home(request):
    """Hiển thị trang HTML chính."""
    return render(request, "index.html")

def start_payment(request):
    """API frontend gọi để tạo thanh toán."""
    uid = request.GET.get("uid")
    amount = float(request.GET.get("amount", 1.0))
    memo = "Thanh toán thử với Pi"
    result = create_payment(uid, amount, memo)
    return JsonResponse(result)
def validation_key(request):
    return HttpResponse(
        "7e00d8caef77183f5ad86a6eb8256a4ce3eb401e57ed564c7416a382aef81bec8445a604da6b47237d32d64f06e1cf8cca0128d5ce69f58dfd36eda58ee769ea",
        content_type="text/plain"
    )

def index(request):
    return render(request, 'core/index.html')


def api_hello(request):
    # Simple API endpoint returning JSON
    data = {
    'message': 'Hello from Django on localhost!',
    'status': 'ok'
    }
    return JsonResponse(data)
@csrf_exempt
def pi_webhook(request):
    """Pi Network sẽ gọi vào đây khi có giao dịch."""
    if request.method == "POST":
        data = json.loads(request.body)
        print("📩 Webhook từ Pi:", data)
        return JsonResponse({"status": "ok"})
    return JsonResponse({"error": "invalid method"}, status=400)


