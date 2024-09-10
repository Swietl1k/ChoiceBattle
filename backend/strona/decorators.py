import firebase_admin.auth
from rest_framework import status
from rest_framework.response import Response



'''
Decorator function: protection_view, provides other functions resistance to requests that don't have authorization header or have invalid id_token in authorization header.
Other functions that use this decorator are executed only if these two previous conditions are met.  
'''
def protected_view(fun):
    def inner_fun(request, **kwargs):
        # dodać odrzucenie użytkownika kiedy nie ma nagłówka Authorization
        # revoke przy logowaniu jeśli użytkownik posiada wczesniej wygenerowany stary token
        if not request.headers.get("Authorization"):
            return Response({
                "success": False,
                "message": "ACCESS DENIED -> There is no authoriztion header in request"
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            result = firebase_admin.auth.verify_id_token(request.headers.get("Authorization").split()[1], check_revoked=True)
        except Exception as e:
            print("Exception: ", e)
            
            message = e.args[0]

            return Response({
                "success": False,
                "message": f"ACCESS DENIED -> {message}",
            }, status=status.HTTP_403_FORBIDDEN)
        
        request.user_id = result.get("uid")

        return fun(request, **kwargs)
    return inner_fun