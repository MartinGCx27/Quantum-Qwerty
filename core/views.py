from django.shortcuts import render, redirect
from django.contrib import messages
from django.utils import timezone
import pdb 
from .forms import FormContact
from django.http import JsonResponse
from django.conf import settings
import requests
from django.core.mail import send_mail
import random


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
    desafios = [
        {'titulo':'Visión por computadora', 'icono_url':'https://www.santanderopenacademy.com/content/dam/becasmicrosites/01-soa-blog/iStock-1491043474.jpg'},
        {'titulo':'Educación', 'icono_url':'https://cdn.prod.website-files.com/61e20a03e0607714290543fb/63e3cbaf12de1a263ed4f347_elearning-min.jpg'},
        {'titulo':'Web shops', 'icono_url':'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQED96nlhFVHcK5YaxM6tUl8gFaTAok0eQNag&s'},
        {'titulo':'Landing pages', 'icono_url':'https://elysiamstudio.com/wp-content/uploads/2022/11/750-X-400-2x.jpg'},
        {'titulo':'Dashboards', 'icono_url':'https://t4.ftcdn.net/jpg/02/70/23/67/360_F_270236770_C2sB7zP7AJx0ivHr5KUl2a46yMkqTTAW.jpg'},
        {'titulo':'Apps', 'icono_url':'https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto/gigs/140599451/original/602e9a52c18a32e25dd3282f05c699cf3ce89f80/create-a-professional-ios-and-android-app.png'},
        #{'titulo':'Salud', 'icono_url':'/static/icons/salud.svg'},
    ]
    
    # pdb.set_trace()
    return render(request, 'index.html', {'logos': logos, 'desafios': desafios})


    
def ContactUs(request):
    # Verificamos si la petición es POST y además viene por AJAX (usando cabecera x-requested-with) -LGS
    #EVITA LA RECARGA DEL SUBMIT-LGS
    if request.method == 'POST' and request.headers.get('x-requested-with') == 'XMLHttpRequest':
        # Cargamos los datos enviados al formulario -LGS
        form = FormContact(request.POST)

        # Validamos el formulario (campos requeridos, formatos, etc.) -LGS
        if not form.is_valid():
            # Si el formulario NO es válido, regresamos errores en formato JSON -LGS
            return JsonResponse({
                'success': False,
                'errors': form.errors.get_json_data(escape_html=True)
            })

        # Obtenemos el token que envía reCAPTCHA en el formulario -LGS
        recaptcha_response = request.POST.get('g-recaptcha-response')

        # Armamos los datos que vamos a enviar a Google para validar el captcha -LGS
        data = {
            'secret': settings.RECAPTCHA_SECRET_KEY,  # clave privada -LGS
            'response': recaptcha_response            # token generado por el widget -LGS
        }

        # URL oficial de Google para verificar reCAPTCHA -LGS
        verify_url = 'https://www.google.com/recaptcha/api/siteverify'

        # Hacemos una petición POST a Google con la data -LGS
        r = requests.post(verify_url, data=data)
        result = r.json()  # Obtenemos la respuesta en JSON -LGS

        # Si Google responde que no es válido, regresamos error JSON -LGS
        if not result.get('success'):
            return JsonResponse({
                'success': False,
                'errors': {
                    'captcha': [{
                        'message': '❌ Verificación reCAPTCHA fallida. Por favor inténtalo de nuevo.'
                    }]
                }
            })

        # Si todo está correcto hasta aquí, guardamos el formulario en la base de datos -LGS
        instance = form.save()

        # Usar instace para debug o print, relacionar modelos, o redirijir datos JSON -LGS

        # Obtenemos los datos limpios del formulario para enviarlos por correo -LGS
        nombre = form.cleaned_data.get('name_contact')
        apellido = form.cleaned_data.get('lastname_contact')
        email = form.cleaned_data.get('email_contact')
        telefono = form.cleaned_data.get('phone_contact')
        mensaje = form.cleaned_data.get('comments_contact')

        # # Armamos el asunto y contenido del correo
        asunto = f"Nuevo mensaje de contacto de {nombre} {apellido}"
        contenido = f"""
               Se recibió un nuevo mensaje de contacto:

                Nombre: {nombre}
                Apellido: {apellido}
                Email: {email}
                Teléfono: {telefono}

                Mensaje:
                {mensaje}
                """

        # Envia el correo -LGS
        try:
            send_mail(
                subject=asunto,
                message=contenido,
                from_email=settings.DEFAULT_FROM_EMAIL,      # Remitente configurado en settings -LGS
                recipient_list=['quantumqwrty@gmail.com'],      # A quién le llegará -LGS
                fail_silently=False,
            )
        except Exception as e:
            # Si falla el envío del correo, devolvemos error JSON -LGS
            return JsonResponse({
                'success': False,
                'message': f'Ocurrió un error enviando el correo: {e}'
            })

        # ✅ Si todo salió bien, agregamos un mensaje de éxito a Django messages -LGS
        messages.success(request, 'Formulario enviado correctamente ✅')

        # Devolvemos un JSON indicando éxito (puedes usar redirect_url en JS) -LGS
        return JsonResponse({'success': True, 'redirect_url': request.path})
    
    # Si NO es POST o no es AJAX, simplemente mostramos el formulario vacío -LGS
    form = FormContact()
    # pdb.set_trace()
    return render(request, 'ContactUs.html', {'form': form})



def aboutUs(request):
    return render(request, 'aboutUs.html')

def services(request):
    return render(request, 'services.html')
