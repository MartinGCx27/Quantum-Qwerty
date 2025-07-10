from django.shortcuts import render
import pdb 

# Create your views here.
def index(request):
    logos = [
        {'src': 'img/one-piece.png',
          'class': ''},
        {'src': 'img/html-5.png', 'class': ''},
        {'src': 'img/css-3.png', 'class': ''},
        {'src': 'img/javascript.png', 'class': ''},
        {'src': 'img/bootstrap.png', 'class': ''},
        {'src': 'img/django.png', 'class': ''},
        {'src': 'img/git.png', 'class': ''},
        {'src': 'img/mysql.png', 'class': ''},
        {'src': 'img/python.png', 'class': ''},
        {'src': 'img/php.png', 'class': ''},
        {'src': 'img/java.png', 'class': ''},
        {'src': 'img/laravel.png', 'class': ''},
        {'src': 'img/react.png', 'class': ''},
        {'src': 'img/swift.png', 'class': 'swift'},
        {'src': 'img/android_studio.png', 'class': 'android'},
        {'src': 'img/wordpress.png', 'class': 'wordpress'}
    ]
    # pdb.set_trace()
    return render(request, 'index.html', {'logos': logos})

def ContactUs(request):
    return render(request, 'ContactUs.html')
def services(request):
    return render(request, 'services.html')
