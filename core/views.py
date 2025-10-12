from django.shortcuts import render
from django.http import JsonResponse
from django.http import HttpResponse

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
