from django.shortcuts import render
from django.http import JsonResponse


def index(request):
    return render(request, 'core/index.html')


def api_hello(request):
    # Simple API endpoint returning JSON
    data = {
    'message': 'Hello from Django on localhost!',
    'status': 'ok'
    }
    return JsonResponse(data)