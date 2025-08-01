from django import forms
from .models import Contact

class FormContact(forms.ModelForm):
    class Meta:
        model = Contact
        fields = [
            'name_contact',
            'lastname_contact',
            'email_contact',
            'phone_contact',
            'comments_contact'
        ]
        widgets = {
            'name_contact': forms.TextInput(attrs={
                'class': 'form-control',
                'required': True,
                'id': 'nombre',
                'autocomplete': 'off',
                'placeholder': ' '
            }),
            'lastname_contact': forms.TextInput(attrs={
                'class': 'form-control',
                'required': True,
                'id': 'apellido',
                'autocomplete': 'off',
                'placeholder': ' '
            }),
            'email_contact': forms.EmailInput(attrs={
                'class': 'form-control',
                'required': True,
                'id': 'email',
                'autocomplete': 'off',
                'placeholder': ' '
            }),
            'phone_contact': forms.TextInput(attrs={
                'class': 'form-control',
                'required': True,
                'id': 'phone',
                'autocomplete': 'off',
                'pattern': '[0-9]{10}',
                'title': 'El número debe tener exactamente 10 dígitos.',
                'oninput': 'filterNumbers(this)',
                'placeholder': ' '
            }),
            'comments_contact': forms.Textarea(attrs={
                'class': 'form-control',
                'required': True,
                'id': 'mensaje',
                'autocomplete': 'off',
                'placeholder': ' ',
                'rows': 3
            }),
        }