# views.py
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.views import View
from django.http import JsonResponse
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
import requests
from requests.auth import HTTPBasicAuth
from django.http import HttpResponse
import json
import os
from rest_framework.decorators import api_view
from mpesa.mpesa import MpesaAccessToken, LipaNaMpesaPassword
from mpesa.models import MpesaTransaction


class TokenGeneratorView(View):
    def get(self, request, *args, **kwargs):
        consumer_key = os.environ.get('MPESA_CONSUMER_KEY')
        consumer_secret = os.environ.get('MPESA_CONSUMER_SECRET')
        api_URL = 'https://api.safaricom.co.ke/oauth/v1/generate'

        r = requests.get(api_URL, auth=HTTPBasicAuth(
            consumer_key, consumer_secret))

        if r.status_code == 200:
            mpesa_access_token = json.loads(r.text)
            validated_mpesa_access_token = mpesa_access_token["access_token"]

            return JsonResponse({"token": validated_mpesa_access_token})
        else:
            return JsonResponse({"error": "Failed to generate token"}, status=r.status_code)


@method_decorator(csrf_exempt, name='dispatch')
class PaymentView(View):
    def post(self, request, *args, **kwargs):
        # Assuming MpesaAccessToken and LipanaMpesaPpassword are defined elsewhere in your code
        access_token = MpesaAccessToken.validated_mpesa_access_token

        print("access token: " + access_token)

        api_url = "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
        headers = {"Authorization": "Bearer %s" % access_token}

        data = json.loads(request.body.decode('utf-8'))

        phone = data.get('phone')
        amount = data.get('amount')

        if phone and amount:
            mpesa = LipaNaMpesaPassword()
            request_payload = {
                "BusinessShortCode": mpesa.business_short_code,
                "Password": mpesa.generate_password(),
                "Timestamp": mpesa.payment_time,
                "TransactionType": "CustomerBuyGoodsOnline",
                "Amount": amount,
                "PartyA": phone,
                "PartyB": mpesa.business_short_code,
                "PhoneNumber": phone,
                "CallBackURL": "https://sandbox.safaricom.co.ke/mpesa/",
                "AccountReference": "Wamae Ndiritu",
                "TransactionDesc": "Web Development Charges"
            }

            response = requests.post(
                api_url, json=request_payload, headers=headers)

            return HttpResponse(response.text)

        else:
            return HttpResponse({"message": "Invalid request parameters"})


# mpesa/views.py

@api_view(['POST'])
def handle_mpesa_callback(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        if data['Body']['stkCallback']['CallbackMetadata'] is not None:
            data = data['Body']['stkCallback']['CallbackMetadata']['Item']

            # Extract relevant fields
            amount = data[0].get('Value')
            receipt_number = data[1].get('Value')
            balance = data[2].get('Value')
            transaction_date = data[3].get('Value')
            phone_number = data[4].get('Value')

            # Create the MpesaTransaction object
            transaction = MpesaTransaction.objects.create(
                amount=amount,
                receiptNumber=receipt_number,
                balance=balance,
                transactionDate=transaction_date,
                phoneNumber=phone_number
            )

            return Response(status=201)
    return JsonResponse({'message': 'Method not allowed'}, status=405)


    # # Send the response data to WebSocket clients
    # channel_layer = get_channel_layer()
    # async_to_sync(channel_layer.group_send)(
    #     "transactions_group",
    #     {
    #         "type": "send_transaction",
    #         "message": request.data,
    #     },
    # )

    # # Additional logic for updating your database, if needed

    # # Return a response to Safaricom's callback
    # return HttpResponse(status=200)