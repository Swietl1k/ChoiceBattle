from django.contrib import admin

# username: admin
# email: admin@admin.com
# password: admin

# Register your models here.

from django.contrib.sessions.models import Session

admin.site.register(Session)