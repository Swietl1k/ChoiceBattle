from django import forms

class GameForm(forms.Form):
    title = forms.CharField(max_length=50, label="Title")
    description = forms.CharField(max_length=150, label="Description")
    number_of_choices = forms.ChoiceField(
        choices=[
            (8, '8 Choices'),
            (16, '16 Choices'),
            (32, '32 Choices')
        ],
        label="Number of choices"
    )
    category = forms.ChoiceField(
        choices=[
            ('Sports', 'Sports'),
            ('Movies', 'Movies'),
            ('Music', 'Music'),
            ('Gaming', 'Gaming'),
            ('Food', 'Food'),
            ('Idols', 'Idols'),
            ('Animals', 'Animals'),
            ('Other', 'Other'),
        ],
        label="Category"
    )


class UploadFileForm(forms.Form):
    title = forms.CharField(max_length=50)
    file = forms.FileField()

class CategoryForm(forms.Form):
    category = forms.ChoiceField(
        choices=[
            ('Sports', 'Sports'),
            ('Movies', 'Movies'),
            ('Music', 'Music'),
            ('Gaming', 'Gaming'),
            ('Food', 'Food'),
            ('Idols', 'Idols'),
            ('Animals', 'Animals'),
            ('Other', 'Other'),
        ],
        label="Category"        
    )