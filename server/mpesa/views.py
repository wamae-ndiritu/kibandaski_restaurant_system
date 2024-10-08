# views.py
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.views import View
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework import status
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
from orders.models import Order
from mpesa.serializer import CompletedTransactionSerializer
from asgiref.sync import async_to_sync
from channels_app.consumers import SSEConsumer
from accounts.models import CustomUser
from rest_framework.pagination import PageNumberPagination
from math import ceil
channel_layer = get_channel_layer()


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
        access_token = MpesaAccessToken.validated_mpesa_access_token
        user_id = self.kwargs.get('user_id')
        order_id = self.kwargs.get('order_id')
        server_url = os.environ.get('SERVER_URL')

        api_url = "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
        headers = {"Authorization": "Bearer %s" % access_token}

        data = json.loads(request.body.decode('utf-8'))

        phone = data.get('phone')
        amount = data.get('amount')
        call_back_url = f"{server_url}/mpesa/mpesa-callback/{user_id}/{order_id}"

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
                "CallBackURL": call_back_url,
                "AccountReference": "Wamae Ndiritu",
                "TransactionDesc": "Web Development Charges"
            }

            response = requests.post(
                api_url, json=request_payload, headers=headers)

            return HttpResponse(response.text)

        else:
            return HttpResponse({"message": "Invalid request parameters"})


# mpesa/views.py
async def send_mpesa_payment_status(type, order_data, client_id):
    message = {"type": type, "data": order_data}
    print("Sending mpesa payment status...")
    await channel_layer.send(client_id, message)


async def send_message_to_client(client_id, message):
    # Use SSEConsumer to send message to client
    await SSEConsumer.send_message_to_client(client_id, message)

@api_view(['POST'])
def handle_mpesa_callback(request, client_id, order_id):
    data = json.loads(request.body)
    if request.method == 'POST':
        # Handle all unsuccessful transactions
        if data['Body']['stkCallback']['ResultDesc'] != "The service was accepted successfully":
            async_to_sync(send_message_to_client)(
                client_id, {"type": "incomplete_transaction", "response": {"message": data['Body']['stkCallback']['ResultDesc']}})
            return JsonResponse({"message": "Transaction unsuccessful"}, status=402)

        callbackMetaData = data['Body']['stkCallback'].get('CallbackMetadata', None)

        if callbackMetaData is not None:
            data = data['Body']['stkCallback']['CallbackMetadata']['Item']

            # Extract relevant fields
            amount = data[0].get('Value')
            receipt_number = data[1].get('Value')
            balance = data[2].get('Value')
            transaction_date = data[3].get('Value')
            phone_number = data[4].get('Value')

            # GET THER USERNAME
            user = CustomUser.objects.get(id=client_id)
            user_full_name = f"{user.first_name} {user.last_name}"
            order = Order.objects.get(id=order_id)

            # Create the MpesaTransaction object
            transaction = MpesaTransaction.objects.create(
                amount=amount,
                receiptNumber=receipt_number,
                balance=balance,
                transactionDate=transaction_date,
                phoneNumber=phone_number,
                fullName=user_full_name,
                order_id=order
            )

            async_to_sync(send_message_to_client)(
                client_id, {"message": "Your transaction has been processed successfully!", "amount": transaction.amount, "ReceiptNumber": transaction.receiptNumber})

        return Response({"message": "Your transaction has been processed successfully!"}, status=201)
    return JsonResponse({'message': 'Method not allowed'}, status=405)

# Get all Completed Mpesa Transactions


@api_view(['GET'])
def list_completed_transactions(request):
    if request.method == 'GET':
        query_params = request.query_params

        # Get the page number from query parameters or default to 1
        page_number = int(query_params.get('pageNo', 1))

        # Get the page size from query parameters or default to 1
        page_size = 10

        # Get the total count of transactions
        total_count = MpesaTransaction.objects.count()

        # Calculate the total number of pages
        total_pages = ceil(total_count / page_size)

        # Calculate the starting index for the queryset
        start_index = (page_number - 1) * page_size

        # Calculate the ending index for the queryset
        end_index = min(start_index + page_size, total_count)

        # Get transactions for the specified page
        transactions = MpesaTransaction.objects.all()[start_index:end_index]

        # Serialize paginated transactions
        serializer = CompletedTransactionSerializer(transactions, many=True)

        # Construct response with pagination metadata
        response_data = {
            'offset': page_size,
            'total_pages': total_pages,
            'current_page': page_number,
            'transactions': serializer.data
        }

        return Response(response_data, status=status.HTTP_200_OK)
